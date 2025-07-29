import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { useState } from 'react'

export default function OrderHistoryTab() {
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [dateRange, setDateRange] = useState([dayjs().subtract(30, 'day'), dayjs()])
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(true)

  const statusOptions = [
    { key: 'all', label: 'Tất cả', color: 'default' },
    { key: 'pending', label: 'Chờ xác nhận', color: 'warning' },
    { key: 'confirmed', label: 'Đã xác nhận', color: 'info' },
    { key: 'shipping', label: 'Đang giao hàng', color: 'primary' },
    { key: 'delivered', label: 'Đã giao hàng', color: 'success' },
    { key: 'cancelled', label: 'Đã hủy', color: 'error' }
  ]

  // Mock data
  const orders = [
    {
      id: 'DH001',
      date: '2025-01-05',
      status: 'delivered',
      total: 450000,
      items: [
        { name: 'Salad rau xanh hữu cơ', image: '/api/placeholder/60/60', price: 150000, quantity: 2 },
        { name: 'Nước ép cà rốt tươi', image: '/api/placeholder/60/60', price: 75000, quantity: 2 }
      ]
    },
    {
      id: 'DH002',
      date: '2025-01-03',
      status: 'shipping',
      total: 320000,
      items: [
        { name: 'Bánh mì nguyên cám', image: '/api/placeholder/60/60', price: 85000, quantity: 2 },
        { name: 'Sữa hạnh nhân không đường', image: '/api/placeholder/60/60', price: 150000, quantity: 1 }
      ]
    },
    {
      id: 'DH003',
      date: '2024-12-28',
      status: 'pending',
      total: 280000,
      items: [
        { name: 'Quinoa hữu cơ', image: '/api/placeholder/60/60', price: 180000, quantity: 1 },
        { name: 'Dầu oliva nguyên chất', image: '/api/placeholder/60/60', price: 100000, quantity: 1 }
      ]
    }
  ]

  const getStatusColor = (status) => {
    const statusObj = statusOptions.find(s => s.key === status)
    return statusObj ? statusObj.color : 'default'
  }

  const getStatusLabel = (status) => {
    const statusObj = statusOptions.find(s => s.key === status)
    return statusObj ? statusObj.label : status
  }

  const filteredOrders = selectedStatus === 'all'
    ? orders
    : orders.filter(order => order.status === selectedStatus)

  return (
    <Box sx={{
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Phần 1 & 2: Filter gộp chung */}
      <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#2e7d32' }}>
            Bộ lọc tìm kiếm
          </Typography>

          <Grid container spacing={3}>
            {/* Filter theo trạng thái */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography variant="body1" sx={{ mb: 2, fontWeight: 600, color: '#666' }}>
                Lọc theo trạng thái
              </Typography>
              <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1
              }}>
                {statusOptions.map((status) => (
                  <Chip
                    key={status.key}
                    label={status.label}
                    variant={selectedStatus === status.key ? 'filled' : 'outlined'}
                    color={selectedStatus === status.key ? 'primary' : 'default'}
                    onClick={() => setSelectedStatus(status.key)}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: selectedStatus === status.key
                          ? 'primary.main'
                          : 'rgba(76, 175, 80, 0.04)'
                      }
                    }}
                  />
                ))}
              </Box>
            </Grid>

            {/* Filter theo ngày tháng */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Typography variant="body1" sx={{ mb: 2, fontWeight: 600, color: '#666' }}>
                Lọc theo khoảng thời gian
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateRangePicker
                  value={dateRange}
                  onChange={(newValue) => setDateRange(newValue)}
                  sx={{
                    width: '100%',
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#4caf50'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#4caf50'
                      }
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Phần 3: Danh sách đơn hàng với khả năng đóng/mở */}
      <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#2e7d32' }}>
              Lịch sử đơn hàng ({filteredOrders.length} đơn)
            </Typography>
            <IconButton
              onClick={() => setIsOrderHistoryOpen(!isOrderHistoryOpen)}
              sx={{ color: '#4caf50' }}
            >
              {isOrderHistoryOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>

          <Collapse in={isOrderHistoryOpen}>
            {/* Header */}
            <Grid container spacing={2} sx={{
              mb: 2,
              p: 2,
              backgroundColor: '#f5f5f5',
              borderRadius: 1,
              fontWeight: 600
            }}>
              <Grid size={{ xs: 12, sm: 2.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#666' }}>
                  Mã đơn hàng
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 1.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#666' }}>
                  Ngày đặt
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 1.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#666' }}>
                  Trạng thái
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 4.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#666' }}>
                  Sản phẩm
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', textAlign: 'right' }}>
                  Thao tác
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ mb: 2 }} />

            {/* Order Items */}
            {filteredOrders.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  Không có đơn hàng nào phù hợp
                </Typography>
              </Box>
            ) : (
              filteredOrders.map((order, index) => (
                <Box key={order.id}>
                  <Grid container spacing={2} sx={{
                    p: 2,
                    '&:hover': { backgroundColor: '#f9f9f9' },
                    alignItems: 'center'
                  }}>
                    <Grid size={{ xs: 12, sm: 2.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                        #{order.id}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 500 }}>
                        {order.total.toLocaleString('vi-VN')}đ
                      </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 1.5 }}>
                      <Typography variant="body2" sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {dayjs(order.date).format('DD/MM/YYYY')}
                      </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 1.5 }}>
                      <Chip
                        label={getStatusLabel(order.status)}
                        color={getStatusColor(order.status)}
                        size="small"
                        variant="outlined"
                        sx={{
                          maxWidth: '100%',
                          '& .MuiChip-label': {
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '100%'
                          }
                        }}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4.5 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {order.items.slice(0, 2).map((item, idx) => (
                          <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar
                              src={item.image}
                              sx={{ width: 32, height: 32 }}
                              variant="rounded"
                            />
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography variant="body2" sx={{
                                fontSize: '0.75rem',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}>
                                {item.name} x{item.quantity}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                        {order.items.length > 2 && (
                          <Typography variant="body2" sx={{
                            fontSize: '0.75rem',
                            color: '#666',
                            fontStyle: 'italic'
                          }}>
                            +{order.items.length - 2} sản phẩm khác
                          </Typography>
                        )}
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 2 }} sx={{ textAlign: 'right' }}>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{
                          borderColor: '#4caf50',
                          color: '#4caf50',
                          fontSize: '0.75rem',
                          '&:hover': {
                            borderColor: '#45a049',
                            backgroundColor: 'rgba(76, 175, 80, 0.04)'
                          }
                        }}
                      >
                        Xem chi tiết
                      </Button>
                    </Grid>
                  </Grid>

                  {index < filteredOrders.length - 1 && <Divider />}
                </Box>
              ))
            )}
          </Collapse>
        </CardContent>
      </Card>
    </Box>
  )
}
