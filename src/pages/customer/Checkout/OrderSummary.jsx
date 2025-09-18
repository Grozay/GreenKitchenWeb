import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Popover from '@mui/material/Popover'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemButton from '@mui/material/ListItemButton'
import Chip from '@mui/material/Chip'
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import PointOfSaleIcon from '@mui/icons-material/PointOfSale'
import WarningIcon from '@mui/icons-material/Warning'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useConfirm } from 'material-ui-confirm'
import { selectCurrentCart } from '~/redux/cart/cartSlice'
import { selectCurrentCustomer } from '~/redux/user/customerSlice'
import { getExchangeableCouponsAPI, exchangeCouponAPI } from '~/apis'
import { toast } from 'react-toastify'

const OrderSummary = ({
  subtotal = 0,
  shippingFee = 0,
  membershipDiscount = 0,
  couponDiscount = 0,
  appliedCoupon = null,
  onApplyCoupon,
  onRemoveCoupon,
  onCouponsUpdated,
  customerDetails,
  selectedStore,
  shippingSettings
}) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [exchangeAnchorEl, setExchangeAnchorEl] = useState(null)
  const [exchangeableCoupons, setExchangeableCoupons] = useState([])
  const [availableCoupons, setAvailableCoupons] = useState([])
  const [isLoadingCoupons, setIsLoadingCoupons] = useState(false)
  const currentCart = useSelector(selectCurrentCart)
  const items = currentCart?.cartItems || []
  const currentCustomer = useSelector(selectCurrentCustomer)
  const confirm = useConfirm()

  // Update available coupons when customerDetails changes
  useEffect(() => {
    const customerCoupons = customerDetails?.customerCoupons || []
    const filteredCoupons = customerCoupons.filter(coupon =>
      coupon.status === 'AVAILABLE' &&
      new Date(coupon.expiresAt) > new Date() &&
      isCouponApplicable(coupon, subtotal)
    )
    setAvailableCoupons(filteredCoupons)
  }, [customerDetails, subtotal])

  // Calculate coupon discount
  const calculateCouponDiscount = (coupon, orderSubtotal) => {
    if (!coupon) return 0

    let discount = 0
    if (coupon.couponType === 'PERCENTAGE') {
      discount = (orderSubtotal * coupon.couponDiscountValue) / 100
    } else if (coupon.couponType === 'FIXED_AMOUNT') {
      discount = coupon.couponDiscountValue
    }

    const cappedDiscount = coupon.maxDiscount ? Math.min(discount, coupon.maxDiscount) : discount

    return cappedDiscount
  }

  // Check if coupon is applicable to current order
  const isCouponApplicable = (coupon, orderSubtotal) => {
    // Check minimum order value
    if (coupon.minimumOrderValue && orderSubtotal < coupon.minimumOrderValue) {
      return false
    }
    return true
  }

  const handleCouponClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCouponClose = () => {
    setAnchorEl(null)
  }

  const handleSelectCoupon = (coupon) => {
    const discountAmount = calculateCouponDiscount(coupon, subtotal)
    onApplyCoupon && onApplyCoupon(coupon, discountAmount)
    handleCouponClose()
  }

  const handleRemoveCoupon = () => {
    onRemoveCoupon && onRemoveCoupon()
  }

  // Handle get coupons for exchange
  const handleGetCoupons = async (event) => {
    setExchangeAnchorEl(event.currentTarget)
    setIsLoadingCoupons(true)
    try {
      const data = await getExchangeableCouponsAPI()
      setExchangeableCoupons(data || [])
    } catch {
      toast.error('Không thể tải danh sách coupon!')
      setExchangeableCoupons([])
    } finally {
      setIsLoadingCoupons(false)
    }
  }

  // Handle exchange coupon
  const handleExchangeCoupon = async (coupon) => {
    // Kiểm tra điểm có đủ để đổi không
    const availablePoints = customerDetails?.membership?.availablePoints || 0
    if (!customerDetails?.membership || availablePoints < coupon.pointsRequired) {
      toast.error('Bạn không đủ điểm đổi thưởng!')
      return
    }

    // Kiểm tra xem customer đã có coupon này chưa (so sánh couponCode)
    const customerCoupons = customerDetails?.customerCoupons || []
    const hasCoupon = customerCoupons.some(
      customerCoupon => customerCoupon.couponCode === coupon.code && !customerCoupon.isUsed
    )

    const handleExchange = () => {
      try {
        toast.promise(exchangeCouponAPI({ customerId: currentCustomer.id, couponId: coupon.id }), {
          pending: 'Đang đổi coupon...',
          success: 'Đổi coupon thành công!',
          error: 'Có lỗi xảy ra khi đổi coupon!'
        }).then(result => {
          if (!result.error) {
            setExchangeAnchorEl(null)
            onCouponsUpdated && onCouponsUpdated()
          }
        })
      } catch {
        toast.error('Có lỗi xảy ra khi đổi coupon!')
      }
    }

    if (hasCoupon) {
      const { confirmed } = await confirm({
        description: `Bạn đã có coupon &quot;${coupon.name}&quot; và chưa sử dụng. Bạn có chắc chắn muốn đổi thêm không?`,
        confirmationText: 'Đổi thêm',
        cancellationText: 'Hủy'
      })
      if (confirmed) {
        handleExchange()
      }
    } else {
      const { confirmed } = await confirm({
        description: `Bạn có thật sự muốn đổi ${coupon.pointsRequired} điểm để lấy coupon "${coupon.name}" không?`,
        confirmationText: 'Đồng ý',
        cancellationText: 'Hủy'
      })
      if (confirmed) {
        handleExchange()
      }
    }
  }

  const handleCloseExchangePopover = () => {
    setExchangeAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const exchangeOpen = Boolean(exchangeAnchorEl)

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price || 0)
  }

  // Calculate capped coupon discount
  const cappedCouponDiscount = appliedCoupon && appliedCoupon.maxDiscount && couponDiscount > appliedCoupon.maxDiscount ? appliedCoupon.maxDiscount : couponDiscount

  // Calculate total amount with capped discount
  const calculatedTotal = subtotal + shippingFee - membershipDiscount - cappedCouponDiscount

  return (
    <Box sx={{
      bgcolor: 'white',
      borderRadius: 5,
      border: '1px solid #e0e0e0',
      overflow: 'hidden',
      mb: 3
    }}>
      {/* Header */}
      <Box sx={{
        bgcolor: '#f8f9fa',
        px: 3,
        py: 2,
        borderBottom: '1px solid #e0e0e0'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c2c2c' }}>
          TÓM TẮT ĐƠN HÀNG
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3 }}>
        {/* Danh sách món ăn */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 2, color: '#2c2c2c' }}>
            Món ăn đã chọn ({items.length} món)
          </Typography>

          {items.map((item, index) => (
            <Box key={index} sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 1,
              borderBottom: index < items.length - 1 ? '1px solid #f0f0f0' : 'none'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  component="img"
                  src={item.cartItems?.image || item.image}
                  alt={item.cartItems?.name || item.title || item.name}
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    objectFit: 'cover'
                  }}
                />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: '#2c2c2c' }}>
                    {item.cartItems?.name || item.title || item.name}
                    {item.isCustom && <span style={{ color: '#666', fontSize: '0.8em' }}> (Custom)</span>}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#666' }}>
                    Số lượng: {item.quantity || 1}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#4C082A' }}>
                {formatPrice(item.totalPrice || (item.basePrice || item.price || 0) * (item.quantity || 1))}
              </Typography>
            </Box>
          ))}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Tính toán giá */}
        <Box sx={{ space: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Tạm tính:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {formatPrice(subtotal)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Phí vận chuyển:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {shippingFee > 0 ? formatPrice(shippingFee) : 'Miễn phí'}
            </Typography>
          </Box>

          {/* Membership Free Shipping Info */}
          {shippingFee === 0 && customerDetails?.membership?.currentTier === 'RADIANCE' && shippingSettings && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, pl: 2 }}>
              <Typography variant="caption" sx={{ color: '#00B389', fontWeight: 600 }}>
                Membership Free Shipping
              </Typography>
              <Typography variant="caption" sx={{ color: '#00B389', fontWeight: 600 }}>
                -{formatPrice(shippingSettings.baseFee || 10000)}
              </Typography>
            </Box>
          )}

          {/* Distance Info */}
          {selectedStore && shippingFee > 0 && shippingSettings && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, pl: 2 }}>
              <Typography variant="caption" sx={{ color: '#666' }}>
                Khoảng cách: {selectedStore.distance} km
              </Typography>
              <Typography variant="caption" sx={{ color: '#666' }}>
                +{formatPrice(selectedStore.distance * (shippingSettings.additionalFeePerKm || 5000))}
              </Typography>
            </Box>
          )}

          {membershipDiscount > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: '#00B389' }}>
                Giảm giá thành viên:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#00B389' }}>
                -{formatPrice(membershipDiscount)}
              </Typography>
            </Box>
          )}

          {/* Coupon Section */}
          <Box sx={{ mb: 2 }}>
            {appliedCoupon ? (
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 2,
                bgcolor: '#f0f8f0',
                borderRadius: 2,
                border: '1px solid #4caf50',
                mb: 1
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocalOfferIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#4caf50' }}>
                      {appliedCoupon.couponName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#666' }}>
                      Mã: {appliedCoupon.couponCode}
                    </Typography>
                  </Box>
                </Box>
                <Button
                  size="small"
                  onClick={handleRemoveCoupon}
                  sx={{ color: '#666', minWidth: 'auto', p: 0.5 }}
                >
                  Bỏ
                </Button>
              </Box>
            ) : (
              <Box>
                {/* Nút chọn coupon có sẵn */}
                {availableCoupons.length > 0 && (
                  <Button
                    variant="outlined"
                    startIcon={<CardGiftcardIcon />}
                    onClick={handleCouponClick}
                    sx={{
                      width: '100%',
                      height: 48,
                      py: 1.5,
                      borderColor: '#e0e0e0',
                      color: '#666',
                      mb: 1,
                      '&:hover': {
                        borderColor: '#4C082A',
                        bgcolor: '#f5f5f5'
                      }
                    }}
                  >
                    Chọn coupon có sẵn ({availableCoupons.length} coupon)
                  </Button>
                )}

                {/* Nút lấy coupon mới */}
                <Button
                  variant="contained"
                  startIcon={<ShoppingCartIcon />}
                  onClick={handleGetCoupons}
                  disabled={isLoadingCoupons}
                  sx={{
                    width: '100%',
                    py: 1.5,
                    bgcolor: '#4C082A',
                    color: 'white',
                    '&:hover': {
                      borderColor: '#4C082A'
                    }
                  }}
                >
                  {isLoadingCoupons ? 'Đang tải...' : 'Lấy coupon mới'}
                </Button>
              </Box>
            )}
          </Box>

          {/* Coupon Popover */}
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleCouponClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left'
            }}
          >
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Chọn coupon
              </Typography>

              {availableCoupons.length === 0 ? (
                <Typography variant="body2" sx={{ color: '#666', textAlign: 'center', py: 2 }}>
                  Không có coupon khả dụng
                </Typography>
              ) : (
                <List sx={{ p: 0 }}>
                  {availableCoupons.map((coupon) => (
                    <ListItem key={coupon.id} sx={{ p: 0, mb: 1 }}>
                      <ListItemButton
                        onClick={() => handleSelectCoupon(coupon)}
                        sx={{
                          border: '1px solid #e0e0e0',
                          borderRadius: 2,
                          p: 2,
                          '&:hover': {
                            borderColor: '#4C082A',
                            bgcolor: '#f5f5f5'
                          }
                        }}
                      >
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {coupon.couponName}
                              </Typography>
                              <Chip
                                label={coupon.maxDiscount
                                  ? formatPrice(coupon.maxDiscount)
                                  : coupon.couponType === 'PERCENTAGE'
                                    ? `${coupon.couponDiscountValue}%`
                                    : formatPrice(coupon.couponDiscountValue)
                                }
                                size="small"
                                color="primary"
                                sx={{ fontWeight: 600 }}
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
                                Mã: {coupon.couponCode}
                              </Typography>
                              {coupon.couponDescription && (
                                <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
                                  {coupon.couponDescription}
                                </Typography>
                              )}
                              {coupon.maxDiscount && (
                                <Typography variant="caption" sx={{ color: '#00B389', display: 'block', fontWeight: 600 }}>
                                  Giảm tối đa: {formatPrice(coupon.maxDiscount)}
                                </Typography>
                              )}
                              <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
                                HSD: {new Date(coupon.expiresAt).toLocaleDateString('vi-VN')}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          </Popover>

          {/* Exchange Coupon Popover */}
          <Popover
            open={exchangeOpen}
            anchorEl={exchangeAnchorEl}
            onClose={handleCloseExchangePopover}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left'
            }}
          >
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Đổi điểm lấy coupon
              </Typography>

              {/* Hiển thị điểm hiện tại của khách hàng */}
              {customerDetails && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                    p: 1.5,
                    backgroundColor: '#e3f2fd',
                    borderRadius: 1,
                    border: '1px solid #2196f3'
                  }}
                >
                  <PointOfSaleIcon sx={{ color: '#2196f3', mr: 1 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#1976d2' }}>
                    Điểm thưởng hiện tại: {customerDetails?.membership?.availablePoints || 0} điểm
                  </Typography>
                </Box>
              )}
              {isLoadingCoupons ? (
                <Typography variant="body2" sx={{ color: '#666', textAlign: 'center', py: 2 }}>
                  Đang tải...
                </Typography>
              ) : exchangeableCoupons.length === 0 ? (
                <Typography variant="body2" sx={{ color: '#666', textAlign: 'center', py: 2 }}>
                  Không có coupon để đổi
                </Typography>
              ) : (
                <List sx={{ p: 0 }}>
                  {exchangeableCoupons.map((coupon) => {
                    const formatPrice = (price) => {
                      return new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(price || 0)
                    }

                    const availablePoints = customerDetails?.membership?.availablePoints || 0
                    const canExchange = customerDetails?.membership && availablePoints >= coupon.pointsRequired

                    return (
                      <ListItem key={coupon.id} sx={{ p: 0, mb: 1 }}>
                        <ListItemButton
                          onClick={() => handleExchangeCoupon(coupon)}
                          disabled={!canExchange}
                          sx={{
                            border: '1px solid #e0e0e0',
                            borderRadius: 2,
                            p: 2,
                            opacity: canExchange ? 1 : 0.6,
                            '&:hover': canExchange ? {
                              borderColor: '#4C082A',
                              bgcolor: '#f5f5f5'
                            } : {},
                            '&.Mui-disabled': {
                              opacity: 0.6,
                              cursor: 'not-allowed'
                            }
                          }}
                        >
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {coupon.name}
                                  </Typography>
                                  {!canExchange && (
                                    <WarningIcon sx={{ color: '#f44336', fontSize: 16 }} />
                                  )}
                                </Box>
                                <Chip
                                  label={coupon.maxDiscount
                                    ? formatPrice(coupon.maxDiscount)
                                    : coupon.type === 'PERCENTAGE'
                                      ? `${coupon.discountValue}%`
                                      : formatPrice(coupon.discountValue)
                                  }
                                  size="small"
                                  color="primary"
                                  sx={{ fontWeight: 600 }}
                                />
                              </Box>
                            }
                            secondary={
                              <Box>
                                <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
                                  Mã: {coupon.code}
                                </Typography>
                                {coupon.description && (
                                  <Typography variant="caption" sx={{ color: '#666', display: 'block', mb: 0.5 }}>
                                    {coupon.description}
                                  </Typography>
                                )}
                                {coupon.maxDiscount && (
                                  <Typography variant="caption" sx={{ color: '#00B389', display: 'block', mb: 0.5, fontWeight: 600 }}>
                                    Giảm tối đa: {formatPrice(coupon.maxDiscount)}
                                  </Typography>
                                )}
                                {!canExchange && (
                                  <Typography variant="caption" sx={{ color: '#f44336', display: 'block', mb: 0.5, fontWeight: 600 }}>
                                    Không đủ điểm để đổi!
                                  </Typography>
                                )}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                                  <Typography variant="caption" sx={{ color: '#666' }}>
                                    HSD: {new Date(coupon.validUntil).toLocaleDateString('vi-VN')}
                                  </Typography>
                                  <Chip
                                    label={`${coupon.pointsRequired} điểm`}
                                    size="small"
                                    sx={{
                                      bgcolor: canExchange ? '#4C082A' : '#ccc',
                                      color: 'white',
                                      fontWeight: 600,
                                      fontSize: '0.7rem'
                                    }}
                                  />
                                </Box>
                              </Box>
                            }
                          />
                        </ListItemButton>
                      </ListItem>
                    )
                  })}
                </List>
              )}
            </Box>
          </Popover>

          {couponDiscount > 0 && appliedCoupon && (
            <Box sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ color: '#00B389' }}>
                  Giảm giá coupon <br /> ({appliedCoupon.couponName}):
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: '#00B389' }}>
                    -{formatPrice(cappedCouponDiscount)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c2c2c' }}>
              Tổng cộng:
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#4C082A' }}>
              {formatPrice(calculatedTotal)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default OrderSummary
