import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Divider from '@mui/material/Divider'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PersonIcon from '@mui/icons-material/Person'
import PhoneIcon from '@mui/icons-material/Phone'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import PaymentIcon from '@mui/icons-material/Payment'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

const OrderConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  deliveryInfo,
  paymentMethod,
  orderSummary,
  loading
}) => {
  const { t } = useTranslation()
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price || 0)
  }

  const formatDateTime = (date) => {
    if (!date) return t('checkout.orderConfirm.undetermined')
    return dayjs(date).format('DD/MM/YYYY HH:mm')
  }

  const getPaymentMethodText = (method) => {
    return method === 'cod' ? t('checkout.payment.cod.label') : t('checkout.payment.card.label')
  }

  const getFullAddress = () => {
    const { street, ward, district, city } = deliveryInfo
    return [street, ward, district, city].filter(Boolean).join(', ')
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 4,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{
        textAlign: 'center',
        bgcolor: '#f8f9fa',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <CheckCircleIcon sx={{ color: '#4C082A', fontSize: 40, mb: 1 }} />
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#2c2c2c' }}>
          {t('checkout.orderConfirm.title')}
        </Typography>
        <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
          {t('checkout.orderConfirm.subtitle')}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Thông tin giao hàng */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#2c2c2c', display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOnIcon sx={{ color: '#4C082A' }} />
            {t('checkout.orderConfirm.deliveryInfo')}
          </Typography>
          
          <Box sx={{ bgcolor: '#f8f9fa', p: 2, borderRadius: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <PersonIcon sx={{ fontSize: 16, color: '#666' }} />
              <Typography variant="body2">
                <strong>{t('checkout.orderConfirm.recipient')}:</strong> {deliveryInfo.recipientName}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <PhoneIcon sx={{ fontSize: 16, color: '#666' }} />
              <Typography variant="body2">
                <strong>{t('checkout.orderConfirm.phone')}:</strong> {deliveryInfo.recipientPhone}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
              <LocationOnIcon sx={{ fontSize: 16, color: '#666', mt: 0.2 }} />
              <Typography variant="body2">
                <strong>{t('checkout.orderConfirm.address')}:</strong> {getFullAddress()}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTimeIcon sx={{ fontSize: 16, color: '#666' }} />
              <Typography variant="body2">
                <strong>{t('checkout.orderConfirm.deliveryTime')}:</strong> {formatDateTime(deliveryInfo.deliveryTime)}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Phương thức thanh toán */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#2c2c2c', display: 'flex', alignItems: 'center', gap: 1 }}>
            <PaymentIcon sx={{ color: '#4C082A' }} />
            {t('checkout.orderConfirm.paymentMethod')}
          </Typography>
          
          <Box sx={{ bgcolor: '#f8f9fa', p: 2, borderRadius: 2 }}>
            <Typography variant="body2">
              {getPaymentMethodText(paymentMethod)}
            </Typography>
          </Box>
        </Box>

        {/* Tóm tắt đơn hàng */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#2c2c2c' }}>
            {t('checkout.orderConfirm.orderSummary')}
          </Typography>
          
          <Box sx={{ bgcolor: '#f8f9fa', p: 2, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">{t('checkout.orderConfirm.subtotal')}:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {formatPrice(orderSummary.subtotal)}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">{t('checkout.orderConfirm.shippingFee')}:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {orderSummary.shippingFee > 0 ? formatPrice(orderSummary.shippingFee) : t('checkout.orderConfirm.freeShipping')}
              </Typography>
            </Box>
            
            {orderSummary.membershipDiscount > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#00B389' }}>{t('checkout.orderConfirm.membershipDiscount')}:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#00B389' }}>
                  -{formatPrice(orderSummary.membershipDiscount)}
                </Typography>
              </Box>
            )}
            
            {orderSummary.couponDiscount > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#00B389' }}>{t('checkout.orderConfirm.couponDiscount')}:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#00B389' }}>
                  -{formatPrice(orderSummary.couponDiscount)}
                </Typography>
              </Box>
            )}
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>{t('checkout.orderConfirm.total')}:</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#4C082A' }}>
                {formatPrice(orderSummary.totalAmount)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: 3,
            px: 4,
            borderColor: '#e0e0e0',
            color: '#666',
            '&:hover': {
              borderColor: '#4C082A',
              color: '#4C082A'
            }
          }}
        >
          {t('checkout.orderConfirm.goBack')}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          disabled={loading}
          sx={{
            borderRadius: 3,
            px: 4,
            bgcolor: '#4C082A',
            '&:hover': {
              bgcolor: '#3a0620'
            },
            '&:disabled': {
              bgcolor: '#e0e0e0'
            }
          }}
        >
          {loading ? t('checkout.orderConfirm.processing') : t('checkout.orderConfirm.confirmOrder')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default OrderConfirmDialog
