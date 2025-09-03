import { useState, useEffect, useRef } from 'react'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import Container from '@mui/material/Container'
import Toolbar from '@mui/material/Toolbar'
import Badge from '@mui/material/Badge'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Chip from '@mui/material/Chip'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Pagination from '@mui/material/Pagination'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import { API_ROOT, ORDER_STATUS } from '~/utils/constants'
import { getOrdersFilteredAPI, updateOrderStatusAPI } from '~/apis'
import { toast } from 'react-toastify'
import LinearProgress from '@mui/material/LinearProgress'
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'
import Popper from '@mui/material/Popper'
import Grid from '@mui/material/Grid'
import { useConfirm } from 'material-ui-confirm'

const getStatusColor = (status) => {
  switch (status) {
  case ORDER_STATUS.PENDING: return 'warning'
  case ORDER_STATUS.CONFIRMED: return 'info'
  case ORDER_STATUS.PREPARING: return 'primary'
  case ORDER_STATUS.SHIPPING: return 'secondary'
  case ORDER_STATUS.DELIVERED: return 'success'
  default: return 'default'
  }
}

const getNextStatus = (currentStatus) => {
  switch (currentStatus) {
  case ORDER_STATUS.PENDING: return ORDER_STATUS.CONFIRMED
  case ORDER_STATUS.CONFIRMED: return ORDER_STATUS.PREPARING
  case ORDER_STATUS.PREPARING: return ORDER_STATUS.SHIPPING
  case ORDER_STATUS.SHIPPING: return ORDER_STATUS.DELIVERED
  default: return currentStatus
  }
}

export default function OrderList() {
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [orders, setOrders] = useState([])
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [searchText, setSearchText] = useState('')
  const [debouncedSearchText, setDebouncedSearchText] = useState('')
  const [searching, setSearching] = useState(false)
  const searchTimeout = useRef()
  const [fromDate, setFromDate] = useState(dayjs().subtract(30, 'day'))
  const [toDate, setToDate] = useState(dayjs())
  const [newOrders, setNewOrders] = useState([])
  const [showNewOrderDialog, setShowNewOrderDialog] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(null)
  const [showNoOrdersText, setShowNoOrdersText] = useState(false)

  const navigate = useNavigate()
  const newOrderBtnRef = useRef(null)
  const confirm = useConfirm()

  // Khôi phục newOrders từ localStorage khi component mount
  useEffect(() => {
    const savedNewOrders = localStorage.getItem('newOrders')
    if (savedNewOrders) {
      try {
        const parsed = JSON.parse(savedNewOrders)
        setNewOrders(parsed)
      } catch {
        // Ignore parsing errors
      }
    }
  }, [])

  // Lưu newOrders vào localStorage khi nó thay đổi
  useEffect(() => {
    if (newOrders.length > 0) {
      localStorage.setItem('newOrders', JSON.stringify(newOrders))
    } else {
      localStorage.removeItem('newOrders')
    }
  }, [newOrders])

  // fetch orders when page/status/debouncedSearchText change
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getOrdersFilteredAPI(
          page,
          size,
          statusFilter === 'ALL' ? undefined : statusFilter,
          debouncedSearchText || undefined,
          fromDate.format('YYYY-MM-DD'),
          toDate.format('YYYY-MM-DD')
        )
        setOrders(res.items)
        setTotal(res.total)
      } catch {
        toast.error('Failed to load orders')
      }
    }
    fetchOrders()
  }, [page, size, statusFilter, debouncedSearchText, fromDate, toDate])

  // Debounce searchText
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current)
    setSearching(true)
    searchTimeout.current = setTimeout(() => {
      setDebouncedSearchText(searchText)
      setSearching(false)
    }, 500)
    return () => clearTimeout(searchTimeout.current)
  }, [searchText])

  // Delay showing "No orders found" text
  useEffect(() => {
    if (orders.length === 0) {
      const timer = setTimeout(() => {
        setShowNoOrdersText(true)
      }, 500)
      return () => clearTimeout(timer)
    } else {
      setShowNoOrdersText(false)
    }
  }, [orders.length])

  // WebSocket: Tự động nhận order mới và cập nhật vào bảng
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(`${API_ROOT}/apis/v1/ws`),
      reconnectDelay: 5000
    })
    client.onConnect = () => {
      client.subscribe('/topic/order/new', (message) => {
        try {
          const newOrder = JSON.parse(message.body)
          setOrders(prev => {
            // Nếu order đã có trong danh sách thì không thêm nữa
            if (prev.some(o => o.id === newOrder.id)) return prev
            return [newOrder, ...prev]
          })
          setNewOrders(prev => {
            const updatedNewOrders = [newOrder, ...prev]
            // Lưu ngay vào localStorage khi nhận order mới
            localStorage.setItem('newOrders', JSON.stringify(updatedNewOrders))
            return updatedNewOrders
          })
        } catch {
          //Ignore
        }
      })
    }
    client.activate()
    return () => client.deactivate()
  }, [])

  const handleFromDateChange = (val) => {
    if (val && dayjs(val).isValid()) {
      setFromDate(dayjs(val))
      setPage(1)
    }
  }

  const handleToDateChange = (val) => {
    if (val && dayjs(val).isValid()) {
      setToDate(dayjs(val))
      setPage(1)
    }
  }

  const handleRowClick = (order) => {
    // Xóa order khỏi danh sách new orders khi đã xem
    setNewOrders(prev => prev.filter(o => o.id !== order.id))
    navigate(`/management/orders/${order.orderCode}`)
  }

  const handleUpdateStatus = async (orderId, newStatus) => {
    const { confirmed } = await confirm({
      title: 'Confirm Order Status Update',
      description: `Are you sure you want to update the order status to ${newStatus}?`,
      confirmationText: 'Yes, Update',
      cancellationText: 'No, Cancel'
    })
    if (!confirmed) return

    setUpdatingStatus(orderId)
    try {
      const response = await updateOrderStatusAPI({
        id: orderId,
        status: newStatus
      })

      if (response) {
        // Update order status in the list
        setOrders(prev => prev.map(order =>
          order.id === orderId
            ? { ...order, status: newStatus }
            : order
        ))
        toast.success(`Order status updated to ${newStatus}`)
      }
    } catch {
      toast.error('Failed to update order status')
    } finally {
      setUpdatingStatus(null)
    }
  }

  const handleStatusChange = (order, newStatus) => {
    if (newStatus !== order.status) {
      handleUpdateStatus(order.id, newStatus)
    }
  }

  return (
    <Container sx={{ minHeight: '90vh' }}>
      <Toolbar disableGutters sx={{ position: 'relative' }}>
        <Typography variant="h4" sx={{ flexGrow: 1, fontWeight: 'bold', py: 2 }}>Order Management</Typography>
        <Badge badgeContent={newOrders.length} color="secondary" sx={{ mr: 2 }}>
          <Button
            variant="contained"
            color="info"
            onClick={() => setShowNewOrderDialog(v => !v)}
            sx={{ fontWeight: 700 }}
            ref={newOrderBtnRef}
          >
            New Orders
          </Button>
        </Badge>
        <Popper
          open={showNewOrderDialog}
          anchorEl={newOrderBtnRef.current}
          placement="bottom-end"
          sx={{ zIndex: 1300 }}
        >
          <Box
            sx={{
              mt: 1,
              width: 350,
              bgcolor: '#fff',
              boxShadow: 6,
              borderRadius: 2,
              p: 3,
              overflowY: 'auto',
              minHeight: 200
            }}
            onClick={e => e.stopPropagation()}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>New Orders</Typography>
              <Button size="small" color="primary" onClick={() => setShowNewOrderDialog(false)}>Close</Button>
            </Box>
            {Array.isArray(newOrders) && newOrders.length === 0 ? (
              <Typography color="text.secondary">No new orders.</Typography>
            ) : (
              Array.isArray(newOrders) && newOrders.map(order => (
                <Box key={order.id || order.orderCode || Math.random()} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 2, bgcolor: '#fafafa', cursor: 'pointer' }} onClick={() => {
                  setNewOrders(prev => prev.filter(o => o.id !== order.id))
                  navigate(`/management/orders/${order.orderCode}`)
                }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#222' }}>Order #{order.orderCode || order.id || '-'}</Typography>
                  <Typography variant="body2" sx={{ color: '#222' }}>Customer: {order.recipientName || (order.customer && order.customer.recipientName) || '-'}</Typography>
                  <Typography variant="body2" sx={{ color: '#222' }}>Total: {order.totalAmount ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount) : '-'}</Typography>
                  <Typography variant="body2" sx={{ color: '#222' }}>Status: {order.status || '-'}</Typography>
                  <Typography variant="body2" sx={{ color: '#555' }}>Created: {order.createdDate ? new Date(order.createdDate).toLocaleString() : (order.createdAt ? new Date(order.createdAt).toLocaleString() : '-')}</Typography>
                </Box>
              ))
            )}
          </Box>
        </Popper>
      </Toolbar>

      <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 3 }}>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="From date"
                value={fromDate}
                onChange={handleFromDateChange}
                sx={{ width: '100%' }}
                slotProps={{ textField: { size: 'small' } }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="To date"
                value={toDate}
                onChange={handleToDateChange}
                sx={{ width: '100%' }}
                slotProps={{ textField: { size: 'small' } }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              label="Search Order Code"
              variant="outlined"
              size="small"
              value={searchText}
              onChange={e => { setSearchText(e.target.value); setPage(1) }}
              sx={{ width: '100%' }}
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
                  endAdornment: searching ? <CircularProgress size={20} /> : null
                }
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              select
              label="Status"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              size="small"
              sx={{ width: '100%' }}
            >
              <MenuItem value="ALL">All</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="CONFIRMED">Confirmed</MenuItem>
              <MenuItem value="PREPARING">Preparing</MenuItem>
              <MenuItem value="SHIPPING">Shipping</MenuItem>
              <MenuItem value="DELIVERED">Delivered</MenuItem>
            </TextField>
          </Grid>
        </Grid>
        {searching && (
          <LinearProgress sx={{ mb: 1 }} />
        )}
        <TableContainer sx={{ borderRadius: 3, boxShadow: 1 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', width: 180 }}>Order Code</TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: 180 }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: 120 }}>Total</TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: 120 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: 180 }}>Ordered At</TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: 150 }}>Update Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map(order => {
                const isNew = newOrders.some(o => o.id === order.id)
                const nextStatus = getNextStatus(order.status)
                const canUpdateStatus = order.status !== ORDER_STATUS.DELIVERED

                return (
                  <TableRow
                    key={order.id}
                    hover
                    sx={{
                      transition: 'background 0.2s',
                      '&:hover': { bgcolor: '#eaf0fb', cursor: 'pointer' },
                      '&:active': { bgcolor: '#e3f2fd' }
                    }}
                    onClick={() => handleRowClick(order)}
                  >
                    <TableCell sx={{ fontWeight: 500 }}>
                      {order.orderCode}
                      {isNew && <span style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: 8 }}><Chip label="New" color="success" size="small" sx={{ fontWeight: 'bold', height: 22 }} /></span>}
                    </TableCell>
                    <TableCell>{order.recipientName || (order.customer && order.customer.recipientName) || '-'}</TableCell>
                    <TableCell sx={{ color: '#1976d2', fontWeight: 500 }}>{order.totalAmount?.toLocaleString()}₫</TableCell>
                    <TableCell>
                      <Chip label={order.status} color={getStatusColor(order.status)} sx={{ fontWeight: 'bold' }} />
                    </TableCell>
                    <TableCell>{order.createdDate ? new Date(order.createdDate).toLocaleString() : (order.createdAt ? new Date(order.createdAt).toLocaleString() : '-')}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      {canUpdateStatus ? (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleStatusChange(order, nextStatus)}
                          disabled={updatingStatus === order.id}
                          sx={{
                            fontSize: '0.75rem',
                            minWidth: 120,
                            fontWeight: 'bold',
                            textTransform: 'uppercase'
                          }}
                        >
                          {updatingStatus === order.id ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CircularProgress size={14} />
                              Updating...
                            </Box>
                          ) : (
                            `SET ${nextStatus}`
                          )}
                        </Button>
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                          Completed
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
              {orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    {!showNoOrdersText ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                        <CircularProgress size={40} />
                      </Box>
                    ) : (
                      'No orders found'
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination & size option */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 2, gap: 2 }}>
          <TextField
            select
            label="Items/page"
            value={size}
            onChange={e => { setSize(Number(e.target.value)); setPage(1) }}
            size="small"
            sx={{ minWidth: 120 }}
          >
            {[10, 20, 50, 100].map(opt => (
              <MenuItem key={opt} value={opt}>{opt}</MenuItem>
            ))}
          </TextField>
          <Pagination
            count={Math.max(1, Math.ceil(total / size))}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
          />
        </Box>
      </Paper>
    </Container>
  )
}