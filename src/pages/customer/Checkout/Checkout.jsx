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
import PayPalPaymentForm from './components/PayPalPaymentForm'

// Import API
import { createOrder, customerUseCouponAPI, fetchCustomerDetails } from '~/apis'
import { selectCurrentCustomer } from '~/redux/user/customerSlice'
import { selectCartItems, clearCart } from '~/redux/cart/cartSlice'

const Checkout = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const orderItems = useSelector(selectCartItems)
  const currentCustomer = useSelector(selectCurrentCustomer)
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [customerDetails, setCustomerDetails] = useState(null)
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [showPayPalForm, setShowPayPalForm] = useState(false)

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
      } catch (error) {
        // console.error('Error fetching customer details:', error)
        toast.error('❌ Không thể tải thông tin khách hàng!')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [currentCustomer])

  useEffect(() => {
    // Calculate order summary based on cart items
    const cartItems = orderItems?.cartItems || orderItems?.items || []
    const subtotal = cartItems.reduce((total, item) => {
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

    // Calculate coupon discount
    let couponDiscount = 0
    if (appliedCoupon) {
      if (appliedCoupon.couponType === 'PERCENTAGE') {
        couponDiscount = (subtotal * appliedCoupon.couponDiscountValue) / 100
      } else if (appliedCoupon.couponType === 'FIXED_AMOUNT') {
        couponDiscount = appliedCoupon.couponDiscountValue
      }

      // Apply maximum discount limit if exists
      if (appliedCoupon.maximumDiscountAmount && couponDiscount > appliedCoupon.maximumDiscountAmount) {
        couponDiscount = appliedCoupon.maximumDiscountAmount
      }

      // Discount cannot exceed order subtotal
      couponDiscount = Math.min(couponDiscount, subtotal)
    }

    // Calculate total amount
    const totalAmount = subtotal + shippingFee - membershipDiscount - couponDiscount

    setOrderSummary({
      subtotal,
      shippingFee,
      membershipDiscount,
      couponDiscount,
      totalAmount
    })
  }, [orderItems, customerDetails, appliedCoupon])

  // Handle apply coupon
  const handleApplyCoupon = (coupon, discountAmount) => {
    setAppliedCoupon(coupon)
    toast.success(`✅ Đã áp dụng coupon "${coupon.couponName}"!`)
  }

  // Handle remove coupon
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    toast.info('🗑️ Đã bỏ coupon')
  }

  // Handle coupons updated after exchange
  const handleCouponsUpdated = async () => {
    try {
      // Refresh customer details để lấy danh sách coupon mới
      const data = await fetchCustomerDetails(currentCustomer.email)
      setCustomerDetails(data)
    } catch {
      // Ignore error, UI sẽ được cập nhật sau
    }
  }

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
      // Kiểm tra phương thức thanh toán
      if (paymentMethod?.toLowerCase() === 'cod') {
        // Xử lý thanh toán COD
        const cartItems = orderItems?.cartItems || orderItems?.items || []
        const orderData = {
          customerId: currentCustomer?.id,
          ...deliveryInfo,
          subtotal: orderSummary.subtotal,
          shippingFee: orderSummary.shippingFee,
          membershipDiscount: orderSummary.membershipDiscount,
          couponDiscount: orderSummary.couponDiscount,
          totalAmount: orderSummary.totalAmount,
          paymentMethod: 'COD',
          notes: '',
          orderItems: cartItems.map(item => ({
            itemType: item.isCustom ? 'CUSTOM_MEAL' : 'MENU_MEAL',
            menuMealId: !item.isCustom ? item.id : null,
            customMealId: item.isCustom ? item.id : null,
            quantity: item.quantity || 1,
            unitPrice: item.basePrice || 0,
            notes: ''
          }))
        }

        // Tạo order
        const response = await createOrder(orderData)

        if (response) {
          // Cập nhật customer coupon nếu có sử dụng
          if (appliedCoupon) {
            try {
              await customerUseCouponAPI({
                id: appliedCoupon.id,
                usedAt: new Date().toISOString(),
                orderId: response.id,
                status: 'USED'
              })
            } catch {
              // Không fail toàn bộ order nếu update coupon lỗi
            }
          }

          // Xử lý thành công
          // setConfirmDialogOpen(false)
          dispatch(clearCart())
          // Hiển thị thông báo thành công
          toast.success('Đặt hàng thành công! Bạn sẽ thanh toán khi nhận hàng.')
          // Chuyển đến trang order history
          navigate('/profile/order-history')
        }
      } else if (paymentMethod?.toLowerCase() === 'paypal') {
        // Xử lý thanh toán PayPal
        setShowPayPalForm(true)
        setConfirmDialogOpen(false)
        setLoading(false)
        return
      }
    } catch {
      // console.log('Error placing order:', error)
      toast.error('❌ Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!')
    } finally {
      setLoading(false)
    }
  }

  // Handle PayPal payment success
  const handlePayPalSuccess = async (paymentResult) => {
    try {
      setLoading(true)

      // Create order with PAID status
      const cartItems = orderItems?.cartItems || orderItems?.items || []
      const orderData = {
        customerId: currentCustomer?.id,
        ...deliveryInfo,
        subtotal: orderSummary.subtotal,
        shippingFee: orderSummary.shippingFee,
        membershipDiscount: orderSummary.membershipDiscount,
        couponDiscount: orderSummary.couponDiscount,
        totalAmount: orderSummary.totalAmount,
        paymentMethod: 'PAYPAL',
        paypalOrderId: paymentResult.id,
        notes: '',
        orderItems: cartItems.map(item => ({
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
        // Handle coupon usage
        if (appliedCoupon) {
          try {
            await customerUseCouponAPI({
              id: appliedCoupon.id,
              usedAt: new Date().toISOString(),
              orderId: response.id,
              status: 'USED'
            })
          } catch {
            // Ignore coupon error
          }
        }

        dispatch(clearCart())
        toast.success('🎉 Đặt hàng và thanh toán PayPal thành công!')
        navigate('/profile/order-history')
      }
    } catch (error) {
      toast.error('❌ Có lỗi xảy ra sau khi thanh toán PayPal')
    } finally {
      setShowPayPalForm(false)
      setLoading(false)
    }
  }

  const handlePayPalError = (error) => {
    setShowPayPalForm(false)
    setLoading(false)
    // Error đã được handle trong PayPalPaymentForm
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
            <OrderSummary
              {...orderSummary}
              appliedCoupon={appliedCoupon}
              onApplyCoupon={handleApplyCoupon}
              onRemoveCoupon={handleRemoveCoupon}
              onCouponsUpdated={handleCouponsUpdated}
              customerDetails={customerDetails}
            />

            {/* Place Order Button */}
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handlePlaceOrder}
              disabled={loading || (orderItems?.cartItems?.length || orderItems?.items?.length || 0) === 0}
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

        {/* PayPal Payment Modal */}
        {showPayPalForm && (
          <Box sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            p: 3
          }}>
            <Box sx={{ width: '100%', maxWidth: 500, position: 'relative' }}>
              <PayPalPaymentForm
                orderData={{
                  ...deliveryInfo,
                  totalAmount: orderSummary.totalAmount,
                  orderId: `temp_${Date.now()}`
                }}
                onSuccess={handlePayPalSuccess}
                onError={handlePayPalError}
                loading={loading}
              />

              <Button
                fullWidth
                variant="outlined"
                onClick={() => setShowPayPalForm(false)}
                sx={{ mt: 2, bgcolor: 'white' }}
              >
                Hủy thanh toán
              </Button>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  )
}

export default Checkout
