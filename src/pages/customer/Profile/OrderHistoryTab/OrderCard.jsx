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
      mb: 1.5,
      borderRadius: 2,
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
    }}>
      <CardContent sx={{ p: 2 }}>
        {/* Header - Order Info */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#2e7d32', fontSize: '14px' }}>
              Đơn hàng #{order.id}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '14px' }}>
              {dayjs(order.deliveryTime).format('DD/MM/YYYY HH:mm')}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Chip label={getStatusLabel(order.status)} color={getStatusColor(order.status)} variant="filled" size="small" sx={{ mb: 0.5, fontSize: '14px', height: '24px' }} />
            <Typography variant="subtitle1" sx={{ color: 'red', fontWeight: 600, fontSize: '14px' }}>{formatPrice(order.totalAmount)}</Typography>
          </Box>
        </Box>

        {/* Order Items */}
        <Box sx={{ mb: 1.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: '#666', fontSize: '14px' }}>
            Sản phẩm đã đặt ({order.orderItems?.length || 0} món)
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {order.orderItems?.slice(0, 3).map((item, idx) => (
              <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 0.75, backgroundColor: '#f9f9f9', borderRadius: 1 }}>
                <Avatar src={item.image} sx={{ width: 32, height: 32, backgroundColor: '#4caf50' }} variant="rounded">{!item.image && (item.itemType === 'MENU_MEAL' ? 'M' : 'C')}</Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="caption" sx={{ fontWeight: 500, fontSize: '14px' }}>{item.title || 'Tên Món Ăn'}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '14px' }}>SL: {item.quantity} × {formatPrice(item.unitPrice)}</Typography>
                </Box>
                <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '14px' }}>{formatPrice(item.totalPrice)}</Typography>
              </Box>
            ))}
            {order.orderItems?.length > 3 && (
              <Typography variant="caption" sx={{ fontStyle: 'italic', color: '#666', textAlign: 'center', mt: 0.5, fontSize: '14px' }}>+{order.orderItems.length - 3} sản phẩm khác</Typography>
            )}
          </Box>
        </Box>

        {/* Details button navigates to order page (or calls callback) */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="text"
            size="small"
            onClick={() => navigate(`/profile/order-history/${order.orderCode}`)}
            sx={{ 
              height: '28px',
              fontSize: '14px'
            }}>
              Xem chi tiết  <ArrowForwardIosIcon sx={{ fontSize: 10, ml: 0.5 }} />
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}
