import { useState, useEffect, useCallback } from 'react'
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
import DeliveryInfoForm from './DeliveryInfoForm'
import PaymentMethodForm from './PaymentMethodForm'
import OrderSummary from './OrderSummary'
import OrderConfirmDialog from './OrderConfirmDialog'
import PayPalPaymentForm from './PayPalPaymentForm'
import { createOrder, customerUseCouponAPI, fetchCustomerDetails, getSettingsByTypeAPI } from '~/apis'
import { selectCurrentCustomer } from '~/redux/user/customerSlice'
import { selectCurrentCart, clearCart } from '~/redux/cart/cartSlice'

const Checkout = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const currentCart = useSelector(selectCurrentCart)
  const currentCustomer = useSelector(selectCurrentCustomer)
  const [shippingSettings, setShippingSettings] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [customerDetails, setCustomerDetails] = useState(null)
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponDiscount, setCouponDiscount] = useState(0)
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

  // Selected store information
  const [selectedStore, setSelectedStore] = useState(null)

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
        toast.error('Không thể tải thông tin khách hàng!')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [currentCustomer])

  // Load shipping settings from API only when needed
  // API Response structure: { "shipping.additionalFeePerKm": "4000", "shipping.baseFee": "20000", ... }
  const loadShippingSettings = useCallback(async () => {
    try {
      const data = await getSettingsByTypeAPI('shipping')
      if (data && Object.keys(data).length > 0) {
        // Handle flat structure with dot notation keys
        setShippingSettings({
          enabled: data['shipping.enabled'] !== undefined ? data['shipping.enabled'] : true,
          baseFee: parseInt(data['shipping.baseFee']) || 10000,
          freeShippingThreshold: parseInt(data['shipping.freeShippingThreshold']) || 200000,
          additionalFeePerKm: parseInt(data['shipping.additionalFeePerKm']) || 5000,
          maxDistance: parseInt(data['shipping.maxDistance']) || 20
        })
      }
    } catch {
      toast.error('Không thể tải cài đặt vận chuyển!')
      // Keep default values if API fails
    }
  }, [])

  // Load shipping settings on component mount
  useEffect(() => {
    loadShippingSettings()
  }, [loadShippingSettings])

  // Calculate shipping fee based on settings, customer tier, and distance
  const calculateShippingFee = useCallback(async (subtotal, customerTier, distance) => {
    let shippingFee = 0

    // Check if shippingSettings is loaded
    if (!shippingSettings || !shippingSettings.enabled) {
      return shippingFee
    }

    // Check if free shipping applies
    const isFreeShipping = subtotal >= shippingSettings.freeShippingThreshold ||
                          customerTier === 'RADIANCE'

    if (isFreeShipping) {
      return 0
    }

    // Calculate shipping fee: baseFee + distance * additionalFeePerKm
    shippingFee = shippingSettings.baseFee

    // Add distance-based fee for the entire distance
    if (distance && distance > 0) {
      shippingFee += distance * shippingSettings.additionalFeePerKm

      // Check max distance limit
      if (distance > shippingSettings.maxDistance) {
        // Use max fee for distances beyond limit
        shippingFee = shippingSettings.baseFee + (shippingSettings.maxDistance * shippingSettings.additionalFeePerKm)
      }
    }

    return shippingFee
  }, [shippingSettings])

  useEffect(() => {
    const calculateOrderSummary = async () => {
      // Calculate order summary based on cart items
      const cartItems = currentCart?.cartItems || []
      const subtotal = cartItems.reduce((total, item) => {
        return total + (item.totalPrice || item.basePrice || 0)
      }, 0)

      // Calculate shipping fee using the async helper function
      let shippingFee = 0
      if (shippingSettings) {
        shippingFee = await calculateShippingFee(
          subtotal,
          customerDetails?.membership?.currentTier,
          selectedStore?.distance
        )
      }

      // Calculate membership discount
      let membershipDiscount = 0
      if (customerDetails?.membership?.currentTier === 'RADIANCE') {
        membershipDiscount = subtotal * 0.1
      } else if (customerDetails?.membership?.currentTier === 'VITALITY') {
        membershipDiscount = subtotal * 0.05
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
    }

    calculateOrderSummary()
  }, [currentCart, customerDetails, appliedCoupon, couponDiscount, shippingSettings, selectedStore, calculateShippingFee])

  // Handle apply coupon
  const handleApplyCoupon = (coupon, discountAmount) => {
    setAppliedCoupon(coupon)
    setCouponDiscount(discountAmount)
    toast.success(`Đã áp dụng coupon "${coupon.couponName}"!`)
  }

  // Handle remove coupon
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponDiscount(0)
    toast.info('Đã bỏ coupon')
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
        const cartItems = currentCart?.cartItems || []
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
            itemType: item.itemType,
            menuMealId: item.itemType === 'MENU_MEAL' ? item.menuMeal?.id : null,
            customMealId: item.itemType === 'CUSTOM_MEAL' ? item.customMeal?.id : null,
            quantity: item.quantity || 1,
            unitPrice: item.unitPrice || 0,
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

          dispatch(clearCart())
          toast.success('Đặt hàng thành công!')
          navigate('/profile/order-history')
        }
      } else if (paymentMethod?.toLowerCase() === 'paypal') {
        setShowPayPalForm(true)
        setConfirmDialogOpen(false)
        setLoading(false)
        return
      }
    } catch {
      toast.error('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!')
    } finally {
      setLoading(false)
    }
  }

  // Handle PayPal payment success
  const handlePayPalSuccess = async (paymentResult) => {
    try {
      setLoading(true)

      // Create order with PAID status
      const cartItems = currentCart?.cartItems || []
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
          itemType: item.itemType,
          menuMealId: item.itemType === 'MENU_MEAL' ? item.menuMeal?.id : null,
          customMealId: item.itemType === 'CUSTOM_MEAL' ? item.customMeal?.id : null,
          quantity: item.quantity || 1,
          unitPrice: item.unitPrice || 0,
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
        toast.success('Đặt hàng và thanh toán thành công!')
        navigate('/profile/order-history')
      }
    } catch {
      toast.error('Có lỗi xảy ra sau khi thanh toán PayPal')
    } finally {
      setShowPayPalForm(false)
      setLoading(false)
    }
  }

  const handlePayPalError = () => {
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
              onStoreSelect={setSelectedStore}
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
              selectedStore={selectedStore}
              shippingSettings={shippingSettings}
            />

            {/* Place Order Button */}
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handlePlaceOrder}
              disabled={loading || (currentCart?.cartItems?.length || 0) === 0}
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
                sx={{
                  mt: 2,
                  height: 42,
                  bgcolor: 'white',
                  color: 'primary.main',
                  borderColor: 'primary.main',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    borderColor: 'primary.main'
                  }
                }}
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
