import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function OrderCard({ order, onViewDetails }) {
  const getStatusColor = (status) => {
    switch (status) {
    case 'PENDING': return 'warning'
    case 'CONFIRMED': return 'info'
    case 'SHIPPING': return 'primary'
    case 'DELIVERED': return 'success'
    case 'CANCELLED': return 'error'
    default: return 'default'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
    case 'PENDING': return 'Chờ xác nhận'
    case 'CONFIRMED': return 'Đã xác nhận'
    case 'SHIPPING': return 'Đang giao hàng'
    case 'DELIVERED': return 'Đã giao hàng'
    case 'CANCELLED': return 'Đã hủy'
    default: return status
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const navigate = useNavigate()

  return (
    <Card sx={{
      mb: 2,
      borderRadius: 2,
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
    }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header - Order Info */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#2e7d32' }}>
              Đơn hàng #{order.id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {dayjs(order.deliveryTime).format('DD/MM/YYYY HH:mm')}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Chip label={getStatusLabel(order.status)} color={getStatusColor(order.status)} variant="filled" sx={{ mb: 1 }} />
            <Typography variant="h6" sx={{ color: 'red', fontWeight: 600 }}>{formatPrice(order.totalAmount)}</Typography>
          </Box>
        </Box>

        {/* Order Items */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 1, color: '#666' }}>
            Sản phẩm đã đặt ({order.orderItems?.length || 0} món)
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {order.orderItems?.slice(0, 3).map((item, idx) => (
              <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1, backgroundColor: '#f9f9f9', borderRadius: 1 }}>
                <Avatar src={item.image} sx={{ width: 40, height: 40, backgroundColor: '#4caf50' }} variant="rounded">{!item.image && (item.itemType === 'MENU_MEAL' ? 'M' : 'C')}</Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{item.title || 'Tên Món Ăn'}</Typography>
                  <Typography variant="caption" color="text.secondary">Số lượng: {item.quantity} × {formatPrice(item.unitPrice)}</Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatPrice(item.totalPrice)}</Typography>
              </Box>
            ))}
            {order.orderItems?.length > 3 && (
              <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#666', textAlign: 'center', mt: 1 }}>+{order.orderItems.length - 3} sản phẩm khác</Typography>
            )}
          </Box>
        </Box>

        {/* Details button navigates to order page (or calls callback) */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="text"
            size="medium"
            onClick={() => navigate(`/profile/order-history/${order.orderCode}`)}
            sx={{ 
              height: '30px'
            }}>
              Xem chi tiết  <ArrowForwardIosIcon sx={{ fontSize: 12, ml: 1 }} />
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}
