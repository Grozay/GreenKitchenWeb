import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import dayjs from 'dayjs'

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

  return (
    <Card sx={{
      mb: 2,
      borderRadius: 2,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      '&:hover': {
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        transform: 'translateY(-2px)',
        transition: 'all 0.3s ease'
      }
    }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header - Order Info */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          flexWrap: 'wrap',
          gap: 1
        }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#2e7d32' }}>
              Đơn hàng #{order.id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {dayjs(order.deliveryTime).format('DD/MM/YYYY HH:mm')}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Chip
              label={getStatusLabel(order.status)}
              color={getStatusColor(order.status)}
              variant="outlined"
              sx={{ mb: 1 }}
            />
            <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 600 }}>
              {formatPrice(order.totalAmount)}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Order Items */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 1, color: '#666' }}>
            Sản phẩm đã đặt ({order.orderItems?.length || 0} món)
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {order.orderItems?.slice(0, 3).map((item, idx) => (
              <Box key={idx} sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 1,
                backgroundColor: '#f9f9f9',
                borderRadius: 1
              }}>
                <Avatar
                  src={item.image}
                  sx={{ width: 40, height: 40, backgroundColor: '#4caf50' }}
                  variant="rounded"
                >
                  {!item.image && (item.itemType === 'MENU_MEAL' ? 'M' : 'C')}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {item.title || 'Tên Món Ăn'}
                  </Typography>
                  {item.description && (
                    <Typography variant="caption" color="text.secondary" sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      mb: 0.5
                    }}>
                      {item.description}
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary">
                    Số lượng: {item.quantity} × {formatPrice(item.unitPrice)}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#4caf50' }}>
                  {formatPrice(item.totalPrice)}
                </Typography>
              </Box>
            ))}
            {order.orderItems?.length > 3 && (
              <Typography variant="body2" sx={{
                fontStyle: 'italic',
                color: '#666',
                textAlign: 'center',
                mt: 1
              }}>
                +{order.orderItems.length - 3} sản phẩm khác
              </Typography>
            )}
          </Box>
        </Box>

        {/* Delivery Info */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 1, color: '#666' }}>
            Thông tin giao hàng
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Người nhận:</strong> {order.recipientName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Số điện thoại:</strong> {order.recipientPhone}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Địa chỉ:</strong> {order.street}, {order.ward}, {order.district}, {order.city}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Thời gian giao:</strong> {dayjs(order.deliveryTime).format('DD/MM/YYYY HH:mm')}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Price Breakdown */}
        <Box sx={{
          backgroundColor: '#f5f5f5',
          p: 2,
          borderRadius: 1,
          mb: 2
        }}>
          <Grid container spacing={1}>
            <Grid size={{ xs: 6 }}>
              <Typography variant="body2">Tạm tính:</Typography>
            </Grid>
            <Grid size={{ xs: 6 }} sx={{ textAlign: 'right' }}>
              <Typography variant="body2">{formatPrice(order.subtotal)}</Typography>
            </Grid>

            <Grid size={{ xs: 6 }}>
              <Typography variant="body2">Phí vận chuyển:</Typography>
            </Grid>
            <Grid size={{ xs: 6 }} sx={{ textAlign: 'right' }}>
              <Typography variant="body2">{formatPrice(order.shippingFee)}</Typography>
            </Grid>

            {order.membershipDiscount > 0 && (
              <>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="body2" color="success.main">Giảm giá thành viên:</Typography>
                </Grid>
                <Grid size={{ xs: 6 }} sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" color="success.main">-{formatPrice(order.membershipDiscount)}</Typography>
                </Grid>
              </>
            )}

            {order.couponDiscount > 0 && (
              <>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="body2" color="success.main">Giảm giá coupon:</Typography>
                </Grid>
                <Grid size={{ xs: 6 }} sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" color="success.main">-{formatPrice(order.couponDiscount)}</Typography>
                </Grid>
              </>
            )}

            <Divider sx={{ width: '100%', my: 1 }} />

            <Grid size={{ xs: 6 }}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>Tổng cộng:</Typography>
            </Grid>
            <Grid size={{ xs: 6 }} sx={{ textAlign: 'right' }}>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#4caf50' }}>
                {formatPrice(order.totalAmount)}
              </Typography>
            </Grid>

            {order.pointEarn && (
              <>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="body2" color="primary">Điểm thưởng nhận được:</Typography>
                </Grid>
                <Grid size={{ xs: 6 }} sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" color="primary">+{order.pointEarn} điểm</Typography>
                </Grid>
              </>
            )}
          </Grid>
        </Box>

        {/* Notes */}
        {order.notes && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 1, color: '#666' }}>
              Ghi chú
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{
              backgroundColor: '#f9f9f9',
              p: 1,
              borderRadius: 1,
              fontStyle: 'italic'
            }}>
              {order.notes}
            </Typography>
          </Box>
        )}

        {/* Actions */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 1,
          flexWrap: 'wrap'
        }}>
          {order.status === 'DELIVERED' && (
            <Button
              variant="outlined"
              size="small"
              sx={{
                borderColor: '#ff9800',
                color: '#ff9800',
                '&:hover': {
                  borderColor: '#f57c00',
                  backgroundColor: 'rgba(255, 152, 0, 0.04)'
                }
              }}
            >
              Đánh giá
            </Button>
          )}

          {order.status === 'PENDING' && (
            <Button
              variant="outlined"
              color="error"
              size="small"
            >
              Hủy đơn
            </Button>
          )}

          <Button
            variant="outlined"
            size="small"
            onClick={() => onViewDetails && onViewDetails(order)}
            sx={{
              borderColor: '#4caf50',
              color: '#4caf50',
              '&:hover': {
                borderColor: '#45a049',
                backgroundColor: 'rgba(76, 175, 80, 0.04)'
              }
            }}
          >
            Chi tiết
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}
