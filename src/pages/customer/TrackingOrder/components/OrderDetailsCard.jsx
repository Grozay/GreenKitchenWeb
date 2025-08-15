import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Avatar from '@mui/material/Avatar'
import { useTheme } from '@mui/material/styles'
import ReceiptIcon from '@mui/icons-material/Receipt'
import PersonIcon from '@mui/icons-material/Person'
import PhoneIcon from '@mui/icons-material/Phone'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PaymentIcon from '@mui/icons-material/Payment'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { PAYMENT_METHOD, PAYMENT_STATUS } from '~/utils/constants'

const OrderDetailsCard = ({ order }) => {
  const theme = useTheme()

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getPaymentMethodLabel = (method) => {
    const labels = {
      [PAYMENT_METHOD.COD]: 'Thanh toán khi nhận hàng',
      [PAYMENT_METHOD.PAYPAL]: 'PayPal'
    }
    return labels[method] || method
  }

  const getPaymentStatusColor = (status) => {
    switch (status) {
    case PAYMENT_STATUS.COMPLETED: return 'success'
    case PAYMENT_STATUS.PENDING: return 'warning'
    case PAYMENT_STATUS.FAILED: return 'error'
    default: return 'default'
    }
  }

  const getPaymentStatusLabel = (status) => {
    switch (status) {
    case PAYMENT_STATUS.COMPLETED: return 'Đã thanh toán'
    case PAYMENT_STATUS.PENDING: return 'Chờ thanh toán'
    case PAYMENT_STATUS.FAILED: return 'Thanh toán thất bại'
    default: return status
    }
  }

  return (
    <Card elevation={3} sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box display="flex" alignItems="center" mb={3}>
          <Avatar
            sx={{
              bgcolor: theme.palette.primary.main,
              width: 48,
              height: 48,
              mr: 2
            }}
          >
            <ReceiptIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
              Thông Tin Đơn Hàng
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Mã đơn hàng: #{order.id}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Order Details Grid */}
        <Grid container spacing={3}>
          {/* Customer Information */}
          <Grid item xs={12} md={6}>
            <Box>
              <Box display="flex" alignItems="center" mb={2}>
                <PersonIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Thông tin khách hàng
                </Typography>
              </Box>
              
              <Box ml={4}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Tên:</strong> {order.recipientName || 'Không có thông tin'}
                </Typography>
                
                {order.recipientPhone && (
                  <Box display="flex" alignItems="center" mb={1}>
                    <PhoneIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      {order.recipientPhone}
                    </Typography>
                  </Box>
                )}

                <Box display="flex" alignItems="flex-start" mb={1}>
                  <LocationOnIcon sx={{ fontSize: 16, mr: 1, mt: 0.2, color: 'text.secondary' }} />
                  <Typography variant="body2" sx={{ flex: 1 }}>
                    {`${order.street}, ${order.ward}, ${order.district}, ${order.city}`}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Payment Information */}
          <Grid item xs={12} md={6}>
            <Box>
              <Box display="flex" alignItems="center" mb={2}>
                <PaymentIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Thông tin thanh toán
                </Typography>
              </Box>
              
              <Box ml={4}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Phương thức:</strong> {getPaymentMethodLabel(order.paymentMethod)}
                </Typography>
                
                <Box display="flex" alignItems="center" mb={2}>
                  <Typography variant="body2" sx={{ mr: 1 }}>
                    <strong>Trạng thái:</strong>
                  </Typography>
                  <Chip
                    label={getPaymentStatusLabel(order.paymentStatus)}
                    size="small"
                    sx={{
                      backgroundColor: `${getPaymentStatusColor(order.paymentStatus)}20`,
                      color: getPaymentStatusColor(order.paymentStatus),
                      fontWeight: 500
                    }}
                  />
                </Box>

                <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
                  Tổng tiền: {formatCurrency(order.totalAmount)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Order Timing */}
          <Grid item xs={12}>
            <Box>
              <Box display="flex" alignItems="center" mb={2}>
                <AccessTimeIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Thời gian đặt hàng
                </Typography>
              </Box>
              
              <Box ml={4}>
                <Typography variant="body2">
                  {formatDate(order.createdAt)}
                </Typography>
                {order.note && (
                  <Box mt={2}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                      Ghi chú:
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        p: 2, 
                        backgroundColor: '#f5f5f5', 
                        borderRadius: 1,
                        fontStyle: 'italic'
                      }}
                    >
                      {order.note}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default OrderDetailsCard
