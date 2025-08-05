import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import dayjs from 'dayjs'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import LinearProgress from '@mui/material/LinearProgress'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { toast } from 'react-toastify'

// Import components
import DeliveryInfoForm from './components/DeliveryInfoForm'
import PaymentMethodForm from './components/PaymentMethodForm'
import OrderSummary from './components/OrderSummary'
import OrderConfirmDialog from './components/OrderConfirmDialog'

// Import API
import { createOrder } from '~/apis'
import { fetchCustomerDetails } from '~/apis'
import { selectCurrentCustomer } from '~/redux/user/customerSlice'
import { selectCartItems, clearCart } from '~/redux/order/orderSlice'

const Checkout = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const orderItems = useSelector(selectCartItems)
  const currentCustomer = useSelector(selectCurrentCustomer)
  const [paymentMethod, setPaymentMethod] = useState('COD')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [customerDetails, setCustomerDetails] = useState(null)

  // Calculate order summary
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    shippingFee: 0,
    membershipDiscount: 0,
    couponDiscount: 0,
    totalAmount: 0
  })

  // Delivery information
  const [deliveryInfo, setDeliveryInfo] = useState({
    recipientName: '',
    recipientPhone: '',
    street: '',
    ward: '',
    district: '',
    city: '',
    deliveryTime: null
  })

  // Fetch customer details and set default address
  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const data = await fetchCustomerDetails(currentCustomer.email)
        setCustomerDetails(data)
        
        // Set default delivery time (current time + 30 minutes)
        const defaultDeliveryTime = dayjs().add(30, 'minute')
        
        // Set default address if available
        const defaultAddress = data?.addresses?.find(addr => addr.isDefault === true)
        if (defaultAddress) {
          setDeliveryInfo(prev => ({
            ...prev,
            recipientName: defaultAddress.recipientName || data.fullName || '',
            recipientPhone: defaultAddress.recipientPhone || data.phone || '',
            street: defaultAddress.street || '',
            ward: defaultAddress.ward || '',
            district: defaultAddress.district || '',
            city: defaultAddress.city || '',
            deliveryTime: defaultDeliveryTime
          }))
        } else {
          // Set default delivery time even if no default address
          setDeliveryInfo(prev => ({
            ...prev,
            recipientName: data.fullName || '',
            recipientPhone: data.phone || '',
            deliveryTime: defaultDeliveryTime
          }))
        }
      } catch {
        // Error handling
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [currentCustomer.email])

  useEffect(() => {
    // Calculate order summary based on cart items
    const subtotal = orderItems.reduce((total, item) => {
      return total + (item.totalPrice || item.basePrice || 0)
    }, 0)

    // Calculate shipping fee (free if over 100k or RADIANCE member)
    const shippingFee = subtotal > 100000 || customerDetails?.membership?.currentTier === 'RADIANCE' ? 0 : 30000

    // Calculate membership discount
    let membershipDiscount = 0
    if (customerDetails?.membership?.currentTier === 'RADIANCE') {
      membershipDiscount = subtotal * 0.1
    } else if (customerDetails?.membership?.currentTier === 'VITALITY') {
      membershipDiscount = subtotal * 0.05
    }

    // Calculate total amount
    const totalAmount = subtotal + shippingFee - membershipDiscount

    setOrderSummary({
      subtotal,
      shippingFee,
      membershipDiscount,
      couponDiscount: 0, // TODO: implement coupon system
      totalAmount
    })
  }, [orderItems, customerDetails])

  // Handle place order validation
  const handlePlaceOrder = () => {
    const newErrors = {}
    
    // Validate delivery information
    if (!deliveryInfo.recipientName.trim()) {
      newErrors.recipientName = 'Vui lòng nhập tên người nhận'
    }
    
    if (!deliveryInfo.recipientPhone.trim()) {
      newErrors.recipientPhone = 'Vui lòng nhập số điện thoại'
    }
    
    if (!deliveryInfo.street.trim()) {
      newErrors.street = 'Vui lòng nhập địa chỉ'
    }
    
    if (!deliveryInfo.ward.trim()) {
      newErrors.ward = 'Vui lòng nhập phường/xã'
    }
    
    if (!deliveryInfo.district.trim()) {
      newErrors.district = 'Vui lòng nhập quận/huyện'
    }
    
    if (!deliveryInfo.city.trim()) {
      newErrors.city = 'Vui lòng nhập thành phố'
    }
    
    if (!deliveryInfo.deliveryTime) {
      newErrors.deliveryTime = 'Vui lòng chọn thời gian giao hàng'
    }
    
    if (!paymentMethod) {
      newErrors.paymentMethod = 'Vui lòng chọn phương thức thanh toán'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast.error('Vui lòng điền đầy đủ thông tin!')
      return
    }

    setErrors({})
    setConfirmDialogOpen(true)
  }

  // Confirm and create order
  const handleConfirmOrder = async () => {
    setLoading(true)
    
    try {
      const orderData = {
        customerId: currentCustomer?.id,
        ...deliveryInfo,
        ...orderSummary,
        paymentMethod: paymentMethod,
        notes: '',
        orderItems: orderItems.map(item => ({
          itemType: item.isCustom ? 'CUSTOM_MEAL' : 'MENU_MEAL',
          menuMealId: !item.isCustom ? item.id : null,
          customMealId: item.isCustom ? item.id : null,
          quantity: item.quantity || 1,
          unitPrice: item.basePrice || 0,
          notes: ''
        }))
      }

      const response = await createOrder(orderData)

      if (response) {
        // Close dialog and clear cart
        setConfirmDialogOpen(false)
        dispatch(clearCart())
        
        // Navigate to order history
        navigate('/profile/order-history')
        
        // Show success message
        if (paymentMethod?.toLowerCase() == 'cod') {
          toast.success('🎉 Đặt hàng thành công! Bạn sẽ thanh toán khi nhận hàng.', {
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
          })
        } else {
          toast.info('Chuyển hướng đến trang thanh toán CARD...')
        }
      }
    } catch {
      toast.error('❌ Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: '#FAF5E8',
      pt: 3,
      pb: 5
    }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/cart')}
            sx={{
              color: '#4C082A',
              mb: 2,
              '&:hover': {
                bgcolor: 'rgba(76, 8, 42, 0.1)'
              }
            }}
          >
            Quay lại giỏ hàng
          </Button>

          <Typography variant="h4" sx={{
            fontWeight: 700,
            color: '#4C082A',
            textAlign: 'center',
            mb: 1
          }}>
            Thanh toán
          </Typography>

          <Typography variant="body1" sx={{
            color: '#666',
            textAlign: 'center'
          }}>
            Hoàn tất thông tin để đặt hàng
          </Typography>
        </Box>

        {/* Progress indicator */}
        {loading && (
          <Box sx={{ mb: 3 }}>
            <LinearProgress sx={{
              borderRadius: 1,
              height: 4,
              bgcolor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                bgcolor: '#4C082A'
              }
            }} />
          </Box>
        )}

        <Grid container spacing={4}>
          {/* Left Column - Forms */}
          <Grid size={{ xs: 12, md: 8 }}>
            {/* Delivery Info Form */}
            <DeliveryInfoForm
              deliveryInfo={deliveryInfo}
              setDeliveryInfo={setDeliveryInfo}
              errors={errors}
              customerDetails={customerDetails}
            />

            {/* Payment Method Form */}
            <PaymentMethodForm
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />

            {/* Error Alert */}
            {Object.keys(errors).length > 0 && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                Vui lòng kiểm tra lại thông tin đã nhập
              </Alert>
            )}
          </Grid>

          {/* Right Column - Order Summary */}
          <Grid size={{ xs: 12, md: 4 }}>
            <OrderSummary {...orderSummary} orderItems={orderItems} />

            {/* Place Order Button */}
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handlePlaceOrder}
              disabled={loading || orderItems.length === 0}
              sx={{
                py: 2,
                borderRadius: 4,
                fontSize: '1.1rem',
                fontWeight: 600,
                bgcolor: '#4C082A',
                '&:hover': {
                  bgcolor: '#3a0620'
                },
                '&:disabled': {
                  bgcolor: '#e0e0e0'
                }
              }}
            >
              {loading ? 'Đang xử lý...' : 'Đặt hàng ngay'}
            </Button>
          </Grid>
        </Grid>

        {/* Order Confirm Dialog */}
        <OrderConfirmDialog
          open={confirmDialogOpen}
          onClose={() => setConfirmDialogOpen(false)}
          onConfirm={handleConfirmOrder}
          deliveryInfo={deliveryInfo}
          paymentMethod={paymentMethod}
          orderSummary={orderSummary}
          loading={loading}
        />
      </Container>
    </Box>
  )
}

export default Checkout
