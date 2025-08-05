import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { useState } from 'react'
import OrderCard from './OrderCard'

export default function OrderHistoryTab({ customerDetails }) {
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [startDate, setStartDate] = useState(dayjs().subtract(30, 'day'))
  const [endDate, setEndDate] = useState(dayjs())
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(true)

  const statusOptions = [
    { key: 'all', label: 'Tất cả', color: 'default' },
    { key: 'PENDING', label: 'Chờ xác nhận', color: 'warning' },
    { key: 'CONFIRMED', label: 'Đã xác nhận', color: 'info' },
    { key: 'SHIPPING', label: 'Đang giao hàng', color: 'primary' },
    { key: 'DELIVERED', label: 'Đã giao hàng', color: 'success' },
    { key: 'CANCELLED', label: 'Đã hủy', color: 'error' }
  ]

  // Lấy dữ liệu orders từ customerDetails
  const orders = customerDetails?.orders || []

  // Filter orders theo status và date range
  const filteredOrders = orders.filter(order => {
    // Filter theo status
    const statusMatch = selectedStatus === 'all' || order.status === selectedStatus
    
    // Filter theo date range
    const orderDate = dayjs(order.deliveryTime)
    const dateMatch = orderDate.isAfter(startDate.startOf('day')) &&
                     orderDate.isBefore(endDate.endOf('day'))

    return statusMatch && dateMatch
  }).sort((a, b) => {
    // Sort theo thời gian tạo đơn hàng (mới nhất lên trước)
    return dayjs(b.createdAt || b.deliveryTime).valueOf() - dayjs(a.createdAt || a.deliveryTime).valueOf()
  })

  const handleViewOrderDetails = (order) => {
    // TODO: Implement view details functionality
    alert(`Xem chi tiết đơn hàng #${order.id}`)
  }

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
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <DatePicker
                    label="Từ ngày"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    sx={{
                      flex: 1,
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
                  <DatePicker
                    label="Đến ngày"
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    minDate={startDate}
                    sx={{
                      flex: 1,
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
                </Box>
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
            {/* Order Cards */}
            {filteredOrders.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  Không có đơn hàng nào phù hợp với bộ lọc
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {filteredOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onViewDetails={handleViewOrderDetails}
                  />
                ))}
              </Box>
            )}
          </Collapse>
        </CardContent>
      </Card>
    </Box>
  )
}
