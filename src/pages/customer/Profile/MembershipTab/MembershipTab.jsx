import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import HistoryIcon from '@mui/icons-material/History'
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard'
import LoyaltyOutlinedIcon from '@mui/icons-material/LoyaltyOutlined'
import { useState, useEffect } from 'react'
import { getExchangeableCouponsAPI, exchangeCouponAPI } from '~/apis'
import { toast } from 'react-toastify'

export default function MembershipTab({ customerDetails, setcustomerDetails }) {
  const [historyModalOpen, setHistoryModalOpen] = useState(false)
  const [couponModalOpen, setCouponModalOpen] = useState(false)
  const [selectedTier, setSelectedTier] = useState(null)
  const [exchangeableCoupons, setExchangeableCoupons] = useState([])
  const [couponsLoading, setCouponsLoading] = useState(false)
  const [exchangeLoading, setExchangeLoading] = useState(null)
  
  // Separate states for membership data
  const [membership, setMembership] = useState(customerDetails?.membership || null)
  const [pointHistories, setPointHistories] = useState(customerDetails?.pointHistories || [])
  const [customerCoupons, setCustomerCoupons] = useState(customerDetails?.customerCoupons || [])

  // // Sync states when customerDetails changes
  // useEffect(() => {
  //   setMembership(customerDetails?.membership || null)
  //   setPointHistories(customerDetails?.pointHistories || [])
  //   setCustomerCoupons(customerDetails?.customerCoupons || [])
  // }, [customerDetails])

  // Fetch available coupons
  const fetchExchangeableCoupons = async () => {
    setCouponsLoading(true)
    try {
      const data = await getExchangeableCouponsAPI()
      setExchangeableCoupons(data || [])
    } catch (error) {
      console.error('Error fetching coupons:', error)
      setExchangeableCoupons([])
    } finally {
      setCouponsLoading(false)
    }
  }

  // Handle coupon exchange
  const handleExchangeCoupon = (couponId) => {
    if (!customerDetails?.id) {
      toast.error('Không tìm thấy thông tin khách hàng')
      return
    }

    setExchangeLoading(couponId)

    toast.promise(
      exchangeCouponAPI({
        customerId: customerDetails.id,
        couponId: couponId
      }),
      {
        pending: 'Đang xử lý đổi coupon...',
        success: 'Đổi coupon thành công! 🎉'
      }
    ).then(() => {
      // Tìm coupon đã đổi từ danh sách exchangeableCoupons
      const exchangedCoupon = exchangeableCoupons.find(c => c.id === couponId)

      if (exchangedCoupon) {
        // 1. Cập nhật membership - trừ điểm khả dụng
        setMembership(prevMembership => ({
          ...prevMembership,
          availablePoints: (prevMembership.availablePoints || 0) - exchangedCoupon.pointsRequired
        }))

        // 2. Thêm lịch sử điểm mới (sử dụng điểm)
        const newPointHistory = {
          id: Date.now(), // Temporary ID
          transactionType: 'USED',
          pointsEarned: -exchangedCoupon.pointsRequired,
          earnedAt: new Date().toISOString(),
          description: `Đổi coupon: ${exchangedCoupon.name}`,
          spentAmount: 0
        }

        setPointHistories(prevHistories => [
          newPointHistory,
          ...prevHistories
        ])

        // 3. Thêm customer coupon mới
        const newCustomerCoupon = {
          id: Date.now() + 1, // Temporary ID
          customerId: customerDetails.id,
          couponId: exchangedCoupon.id,
          status: 'AVAILABLE',
          exchangedAt: new Date().toISOString(),
          expiresAt: exchangedCoupon.validUntil,
          usedAt: null,
          orderId: null,
          // Snapshot data từ coupon
          couponCode: exchangedCoupon.code,
          couponName: exchangedCoupon.name,
          couponDescription: exchangedCoupon.description,
          couponType: exchangedCoupon.type,
          couponDiscountValue: exchangedCoupon.discountValue
        }

        setCustomerCoupons(prevCoupons => [
          newCustomerCoupon,
          ...prevCoupons
        ])
      }

      // Đóng modal và refresh coupon list
      setCouponModalOpen(false)
      fetchExchangeableCoupons()
    }).finally(() => {
      setExchangeLoading(null)
    })
  }

  // Open coupon modal and fetch data
  const handleOpenCouponModal = () => {
    setCouponModalOpen(true)
    fetchExchangeableCoupons()
  }

  // Helper functions để xử lý dữ liệu
  const calculateTierProgress = (currentTier, totalSpent) => {
    const tierRequiredSpending = {
      'ENERGY': { min: 0, max: 2000000 }, // Next: VITALITY
      'VITALITY': { min: 2000000, max: 5000000 }, // Next: RADIANCE
      'RADIANCE': { min: 5000000, max: null } // Already highest
    }

    const tierOrder = ['ENERGY', 'VITALITY', 'RADIANCE']
    const currentTierIndex = tierOrder.indexOf(currentTier)
    const nextTier = currentTierIndex < tierOrder.length - 1 ? tierOrder[currentTierIndex + 1] : null

    let progressToNextTier = 0
    let spentToNextTier = 0
    let currentTierRange = tierRequiredSpending[currentTier]

    if (nextTier && currentTierRange.max) {
      const currentProgress = totalSpent - currentTierRange.min
      const tierRange = currentTierRange.max - currentTierRange.min
      progressToNextTier = Math.min((currentProgress / tierRange) * 100, 100)
      spentToNextTier = Math.max(currentTierRange.max - totalSpent, 0)
    }

    return {
      nextTier,
      progressToNextTier,
      spentToNextTier,
      currentTierMin: currentTierRange.min,
      currentTierMax: currentTierRange.max
    }
  }

  // Thông tin các tier (đặt ở đây để có thể sử dụng cho cả member và non-member)
  const tierInfo = [
    {
      name: 'ENERGY',
      displayName: 'Energy',
      minSpent: 0,
      maxSpent: 2000000,
      benefits: ['Tích điểm cho mọi đơn hàng', 'Thông báo khuyến mãi đặc biệt'],
      color: '#32CD32',
      bgColor: '#F5F5F5'
    },
    {
      name: 'VITALITY',
      displayName: 'Vitality',
      minSpent: 2000000,
      maxSpent: 5000000,
      benefits: ['Tích điểm cho mọi đơn hàng', 'Thông báo khuyến mãi đặc biệt', 'Giảm giá 5% cho tất cả đơn hàng', 'Ưu tiên hỗ trợ khách hàng'],
      color: '#FF7043',
      bgColor: '#FBE9E7'
    },
    {
      name: 'RADIANCE',
      displayName: 'Radiance',
      minSpent: 5000000,
      maxSpent: null,
      benefits: ['Tích điểm cho mọi đơn hàng', 'Thông báo khuyến mãi đặc biệt', 'Giảm giá 10% cho tất cả đơn hàng', 'Ưu tiên hỗ trợ khách hàng', 'Miễn phí giao hàng', 'Tặng món khai vị miễn phí'],
      color: '#FFB300',
      bgColor: '#FFF8E1'
    }
  ]

  const tierProgress = membership ? calculateTierProgress(membership.currentTier, membership.totalSpentLast6Months) : null

  const handleTierClick = (tier) => {
    setSelectedTier(tier)
  }

  // Mặc định hiển thị thông tin của currentTier
  const getCurrentTierInfo = () => {
    return tierInfo.find(tier => tier.name === membership?.currentTier)
  }

  const displayTier = selectedTier || getCurrentTierInfo()

  const tierColor = {
    'ENERGY': '#32CD32',
    'VITALITY': '#FF7043',
    'RADIANCE': '#FFB300'
  }

  return (
    <Box sx={{
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <Grid container spacing={1.5}>
        {/* Thông báo cho non-member */}
        {!membership && (
          <Grid size={12}>
            <Card sx={{
              background: 'linear-gradient(135deg, #782d0aff 0%, #764ba2 100%)',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
              textAlign: 'center'
            }}>
              <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
                <Typography sx={{ fontSize: '80px', mb: 2 }}>🎯</Typography>
                <Typography variant="h4" sx={{
                  fontWeight: 'bold',
                  color: 'white',
                  mb: 2,
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}>
                  Chào {customerDetails?.fullName}!
                </Typography>
                <Typography variant="h5" sx={{
                  fontWeight: 'bold',
                  color: '#FFD700',
                  mb: 3,
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}>
                  Bạn chưa là hội viên!
                </Typography>
                <Typography variant="h6" sx={{
                  color: 'white',
                  mb: 4,
                  opacity: 0.9
                }}>
                  Hãy order một món bất kỳ để nhận ưu đãi hội viên nhé! 🌟
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: '#FFD700',
                    color: '#000',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    boxShadow: '0 4px 16px rgba(255, 215, 0, 0.4)',
                    '&:hover': {
                      backgroundColor: '#FFC107',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(255, 215, 0, 0.6)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => window.location.href = '/menu'}
                >
                  🍽️ See Menu
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Grid 1: Thông tin thành viên hiện tại - chỉ hiển thị khi có membership */}
        {membership && (
          <Grid size={12}>
            <Card sx={{
              background: `linear-gradient(135deg, ${tierColor[membership?.currentTier] || '#1976d2'} 0%, ${tierColor[membership?.currentTier] || '#1976d2'}CC 100%)`,
              borderRadius: 3,
              boxShadow: `0 4px 16px ${tierColor[membership?.currentTier] || '#1976d2'}40`
            }}>
              <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                {/* Dòng 1: Tên + Hạng + 2 Buttons tất cả trong 1 hàng */}
                <Grid container spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                  <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                      <LoyaltyOutlinedIcon sx={{ fontSize: '2rem', color: 'white' }} />
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
                        Hạng Thành Viên
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Button 1: Lịch sử điểm */}
                  <Grid size={{ xs: 12, sm: 3, md: 3 }}>
                    <Button
                      variant="contained"
                      startIcon={<HistoryIcon />}
                      onClick={() => setHistoryModalOpen(true)}
                      fullWidth
                      size="medium"
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        color: 'white',
                        fontWeight: 'bold',
                        borderRadius: 3,
                        py: 1.5,
                        border: '2px solid rgba(255,255,255,0.2)',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.25)',
                          border: '2px solid rgba(255,255,255,0.4)',
                          transform: 'translateY(-2px)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Lịch sử điểm
                    </Button>
                  </Grid>

                  {/* Button 2: Đổi coupon */}
                  <Grid size={{ xs: 12, sm: 3, md: 3 }}>
                    <Button
                      variant="contained"
                      startIcon={<CardGiftcardIcon />}
                      onClick={handleOpenCouponModal}
                      fullWidth
                      size="medium"
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        color: 'white',
                        fontWeight: 'bold',
                        borderRadius: 3,
                        py: 1.5,
                        border: '2px solid rgba(255,255,255,0.2)',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.25)',
                          border: '2px solid rgba(255,255,255,0.4)',
                          transform: 'translateY(-2px)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Đổi coupon
                    </Button>
                  </Grid>
                </Grid>

                {/* Dòng 2: 3 thẻ thông tin (Điểm + Chi tiêu + Progress) */}
                <Grid container spacing={2}>
                  {/* Điểm khả dụng */}
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Box sx={{
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderRadius: 2,
                      p: 2,
                      textAlign: 'center',
                      height: '100%'
                    }}>
                      <Typography variant="body2" sx={{ opacity: 0.8, mb: 1, fontWeight: 'bold', color: 'white' }}>
                        Điểm Khả Dụng:
                      </Typography>
                      <Typography variant="h5" sx={{
                        fontWeight: 'bold',
                        color: 'white'
                      }}>
                        {membership?.availablePoints?.toLocaleString() || '0'}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8, fontWeight: 'bold', color: 'white' }}>
                        điểm
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Tổng chi tiêu */}
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Box sx={{
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderRadius: 2,
                      p: 2,
                      textAlign: 'center',
                      height: '100%'
                    }}>
                      <Typography variant="body2" sx={{ opacity: 0.8, mb: 1, fontWeight: 'bold', color: 'white' }}>
                        Tổng chi tiêu:
                      </Typography>
                      <Typography variant="h5" sx={{
                        fontWeight: 'bold',
                        color: 'white'
                      }}>
                        {membership?.totalSpentLast6Months?.toLocaleString() || '0'}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8, fontWeight: 'bold', color: 'white' }}>
                        VNĐ
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Progress tier - size 6 */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    {/* Progress bar hoặc thông báo hạng tối đa */}
                    {tierProgress?.nextTier ? (
                      <Box sx={{
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        borderRadius: 3,
                        p: 2,
                        border: '1px solid rgba(255,255,255,0.2)',
                        height: '100%'
                      }}>
                        <Typography variant="h6" sx={{
                          mb: 1.5,
                          fontWeight: 'bold',
                          textAlign: 'center',
                          color: 'white',
                          fontSize: { xs: '1rem', sm: '1.25rem' }
                        }}>
                          🎯 Tiến độ lên {tierProgress.nextTier}
                        </Typography>

                        <Box sx={{ position: 'relative', mb: 1.5 }}>
                          <LinearProgress
                            variant="determinate"
                            value={tierProgress.progressToNextTier}
                            sx={{
                              height: 10,
                              borderRadius: 5,
                              backgroundColor: 'rgba(255,255,255,0.3)',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: '#FFD700',
                                borderRadius: 5,
                                boxShadow: '0 2px 6px rgba(255, 215, 0, 0.3)'
                              }
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              color: tierProgress?.progressToNextTier > 50 ? '#000' : '#fff',
                              fontWeight: 'bold',
                              fontSize: '0.7rem'
                            }}
                          >
                            {Math.round(tierProgress?.progressToNextTier || 0)}%
                          </Typography>
                        </Box>

                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.8rem', color: 'white' }}>
                            Còn cần: <strong style={{ color: '#FFD700' }}>{tierProgress?.spentToNextTier?.toLocaleString() || '0'} VNĐ</strong>
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      // Thông báo cho hạng RADIANCE (hạng cao nhất)
                      <Box sx={{
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        borderRadius: 3,
                        p: 2,
                        border: '2px solid #FFD700',
                        position: 'relative',
                        overflow: 'hidden',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                      }}>
                        {/* Hiệu ứng lấp lánh */}
                        <Box sx={{
                          position: 'absolute',
                          top: 0,
                          left: '-100%',
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.3), transparent)',
                          animation: 'shimmer 3s infinite',
                          '@keyframes shimmer': {
                            '0%': { left: '-100%' },
                            '100%': { left: '100%' }
                          }
                        }} />

                        <Box sx={{ position: 'relative', textAlign: 'center' }}>
                          <Typography variant="h6" sx={{
                            mb: 1,
                            fontWeight: 'bold',
                            color: '#FFD700',
                            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                            fontSize: { xs: '1rem', sm: '1.25rem' }
                          }}>
                            👑 HẠNG TỐI ĐA
                          </Typography>

                          <Typography variant="h5" sx={{
                            mb: 1,
                            fontWeight: 'bold',
                            color: 'white',
                            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                            fontSize: { xs: '1.25rem', sm: '1.5rem' }
                          }}>
                            ✨ RADIANCE ✨
                          </Typography>

                          <Typography variant="body2" sx={{
                            color: 'white',
                            opacity: 0.9,
                            fontSize: '0.8rem'
                          }}>
                            Chi tiêu: <strong>{membership?.totalSpentLast6Months?.toLocaleString() || '0'} VNĐ</strong>
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Grid 2: Uu dai - chỉ hiển thị khi có membership */}
        {membership && (
          <Grid size={12} sx={{
            width: '100%',
            textAlign: 'center',
            margin: '0 auto',
            backgroundColor: '#ffffff',
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{
              fontWeight: 'bold',
              textAlign: 'center',
              m: 2
            }}>
              Ưu đãi của bạn
            </Typography>

            {/* Hiển thị danh sách customer coupons */}
            {customerCoupons && customerCoupons.length > 0 ? (
              <Grid container spacing={2} sx={{ p: 2 }}>
                {customerCoupons.map((customerCoupon) => (
                  <Grid size={{ xs: 12, sm: 6, md: 6 }} key={customerCoupon.id}>
                    <Card sx={{
                      border: customerCoupon.status === 'AVAILABLE' ? '2px solid #4caf50' : '2px solid #ff9800',
                      borderRadius: 3,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: customerCoupon.status === 'AVAILABLE'
                          ? '0 8px 24px rgba(76,175,80,0.3)'
                          : '0 8px 24px rgba(255,152,0,0.3)'
                      }
                    }}>
                      <CardContent sx={{ p: 3 }}>
                        {/* Header với status chip */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h6" sx={{
                            fontWeight: 'bold',
                            color: customerCoupon.status === 'AVAILABLE' ? '#4caf50' : '#ff9800'
                          }}>
                            🎫 {customerCoupon.couponName || 'Coupon'}
                          </Typography>
                          <Chip
                            label={customerCoupon.status === 'AVAILABLE' ? 'Có thể dùng' :
                              customerCoupon.status === 'USED' ? 'Đã sử dụng' : 'Hết hạn'}
                            color={customerCoupon.status === 'AVAILABLE' ? 'success' :
                              customerCoupon.status === 'USED' ? 'warning' : 'error'}
                            sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}
                          />
                        </Box>

                        {/* Thông tin coupon */}
                        <Box sx={{ textAlign: 'left', mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            <strong>Mã:</strong> {customerCoupon.couponCode}
                          </Typography>

                          {customerCoupon.couponDescription && (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              <strong>Mô tả:</strong> {customerCoupon.couponDescription}
                            </Typography>
                          )}

                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            <strong>Giảm:</strong>{' '}
                            {customerCoupon.couponType === 'PERCENTAGE'
                              ? `${customerCoupon.couponDiscountValue}%`
                              : `${customerCoupon.couponDiscountValue?.toLocaleString()} VNĐ`}
                          </Typography>

                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            <strong>Ngày đổi:</strong> {new Date(customerCoupon.exchangedAt).toLocaleDateString('vi-VN')}
                          </Typography>

                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            <strong>Hạn sử dụng:</strong> {new Date(customerCoupon.expiresAt).toLocaleDateString('vi-VN')}
                          </Typography>

                          {customerCoupon.usedAt && (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              <strong>Ngày sử dụng:</strong> {new Date(customerCoupon.usedAt).toLocaleDateString('vi-VN')}
                            </Typography>
                          )}

                          {customerCoupon.orderId && (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              <strong>Đơn hàng:</strong> #{customerCoupon.orderId}
                            </Typography>
                          )}
                        </Box>

                        {/* Action button */}
                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                          {customerCoupon.status === 'AVAILABLE' ? (
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              sx={{
                                borderRadius: 2,
                                px: 3,
                                fontWeight: 'bold'
                              }}
                              onClick={() => {
                                // TODO: Implement use coupon functionality
                                alert('Chức năng sử dụng coupon sẽ được triển khai trong đơn hàng')
                              }}
                            >
                              Sử dụng ngay
                            </Button>
                          ) : (
                            <Button
                              variant="outlined"
                              disabled
                              size="small"
                              sx={{
                                borderRadius: 2,
                                px: 3
                              }}
                            >
                              {customerCoupon.status === 'USED' ? 'Đã sử dụng' : 'Hết hạn'}
                            </Button>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Box sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2
                }}>
                  <Typography sx={{ fontSize: '80px' }}>🎁</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Bạn đang chưa có ưu đãi nào
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Hãy đổi điểm lấy coupon để nhận ưu đãi nhé!
                </Typography>
              </Box>
            )}
          </Grid>
        )}

        {/* Grid 3: 3 Cards thông tin các tier - hiển thị cho cả member và non-member */}
        <Grid size={12} sx={{
          backgroundColor: '#ffffff',
          margin: '0 auto',
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          p: 2
        }}>
          <Typography variant="h5" gutterBottom sx={{
            fontWeight: 'bold',
            m: 2,
            textAlign: 'center'
          }}>
            🏆 {membership ? 'Các hạng thành viên' : 'Các hạng thành viên - Ưu đãi đang chờ bạn!'}
          </Typography>
          <Grid container spacing={1.5}>
            {tierInfo.map((tier) => {
              const isCurrentTier = tier.name === membership?.currentTier
              const isSelectedTier = selectedTier && selectedTier.name === tier.name
              return (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={tier.name}>
                  <Card
                    onClick={membership ? () => handleTierClick(tier) : undefined}
                    sx={{
                      height: '100%',
                      position: 'relative',
                      backgroundColor: tier.bgColor,
                      border: isSelectedTier
                        ? `3px solid ${tier.color}`
                        : '1px solid #e0e0e0',
                      borderRadius: 3,
                      boxShadow: isSelectedTier
                        ? `0 8px 32px ${tier.color}40`
                        : isCurrentTier
                          ? `0 6px 24px ${tier.color}30`
                          : '0 4px 16px rgba(0,0,0,0.1)',
                      transform: isSelectedTier
                        ? 'scale(1.05)'
                        : isCurrentTier
                          ? 'scale(1.02)'
                          : 'scale(1)',
                      transition: 'all 0.3s ease-in-out',
                      cursor: membership ? 'pointer' : 'default',
                      '&:hover': {
                        transform: isSelectedTier
                          ? 'scale(1.05)'
                          : membership ? 'scale(1.02)' : 'scale(1)',
                        boxShadow: `0 8px 24px ${tier.color}40`
                      }
                    }}
                  >
                    <CardContent sx={{ p: { xs: 2, sm: 3 }, height: '100%' }}>
                      <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Typography variant="h5" sx={{
                          fontWeight: 'bold',
                          color: tier.color,
                          mb: 1
                        }}>
                          {tier.displayName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.75rem' } }}>
                          {tier.maxSpent
                            ? `Chi tiêu từ ${tier.minSpent.toLocaleString()} - ${tier.maxSpent.toLocaleString()} VNĐ`
                            : `Chi tiêu từ ${tier.minSpent.toLocaleString()} VNĐ trở lên`
                          }
                        </Typography>
                      </Box>

                      {/* Hiển thị ưu đãi ngắn gọn cho non-member */}
                      {!membership && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" sx={{
                            fontWeight: 'bold',
                            color: tier.color,
                            mb: 1
                          }}>
                            🎁 Ưu đãi chính:
                          </Typography>
                          {tier.benefits.map((benefit, index) => (
                            <Typography key={index} variant="body2" sx={{
                              fontSize: '0.85rem',
                              mb: 0.5,
                              color: 'text.secondary'
                            }}>
                              • {benefit}
                            </Typography>
                          ))}
                        </Box>
                      )}

                      {isCurrentTier && (
                        <Chip
                          label="HẠNG HIỆN TẠI"
                          sx={{
                            width: '100%',
                            margin: '0 auto',
                            backgroundColor: tier.color,
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.5rem',
                            zIndex: 1
                          }}
                        />
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              )
            })}
          </Grid>

          {/* Hiển thị thông tin ưu đãi - chỉ cho member */}
          {displayTier && membership && (
            <Card sx={{
              borderRadius: 3,
              border: `2px solid ${displayTier.color}`,
              backgroundColor: displayTier.bgColor,
              mt: 3
            }}>
              <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" sx={{
                    fontWeight: 'bold',
                    color: displayTier.color
                  }}>
                    🎁 Ưu đãi cho hạng {displayTier.displayName}
                    {displayTier.name === membership?.currentTier && (
                      <Chip
                        label="HẠNG HIỆN TẠI"
                        sx={{
                          ml: 2,
                          backgroundColor: displayTier.color,
                          color: 'white',
                          fontSize: '0.75rem'
                        }}
                      />
                    )}
                  </Typography>
                </Box>

                {/* Hiển thị quyền lợi dạng list */}
                <Box>
                  <Box sx={{ pl: 2 }}>
                    {displayTier.benefits.map((benefit, index) => (
                      <Box key={index} sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        mb: 1.5,
                        p: 1,
                        borderRadius: 1,
                        backgroundColor: 'rgba(255,255,255,0.3)',
                        border: `1px solid ${displayTier.color}30`
                      }}>
                        <Typography sx={{
                          color: displayTier.color,
                          fontWeight: 'bold',
                          minWidth: '24px',
                          mr: 1
                        }}>
                          {index + 1}.
                        </Typography>
                        <Typography variant="body1" sx={{
                          color: 'text.primary',
                          fontWeight: '500'
                        }}>
                          {benefit}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Modal lịch sử điểm thưởng */}
      <Dialog
        open={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{
          backgroundColor: theme => theme.palette.primary.main,
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h6" sx={{ color: 'white' }}>Lịch sử điểm thưởng</Typography>
          <IconButton onClick={() => setHistoryModalOpen(false)} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {pointHistories && pointHistories.length > 0 ? (
            <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
              {pointHistories.sort((a, b) => new Date(b.earnedAt) - new Date(a.earnedAt)).map((pHistory) => (
                <Card key={pHistory.id} sx={{ mb: 2, border: '1px solid #e0e0e0' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid size={{ xs: 12, sm: 3 }}>
                        <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
                          {new Date(pHistory.earnedAt).toLocaleDateString('vi-VN')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(pHistory.earnedAt).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="body1">
                          {pHistory.description ||
                            (pHistory.transactionType === 'USED'
                              ? `Sử dụng điểm (${pHistory.pointsUsed || 0} điểm)`
                              : `Điểm từ đơn hàng ${pHistory.spentAmount?.toLocaleString()} VNĐ`
                            )
                          }
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 3 }}>
                        <Chip
                          label={`${pHistory.transactionType === 'USED' ? '-' : '+'}${Math.abs(pHistory.pointsEarned) || pHistory.pointsUsed || 0} điểm`}
                          color={pHistory.transactionType === 'USED' ? 'error' : 'success'}
                          sx={{ fontWeight: 'bold' }}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                📝 Chưa có lịch sử giao dịch điểm
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal đổi coupon */}
      <Dialog
        open={couponModalOpen}
        onClose={() => setCouponModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{
          backgroundColor: theme => theme.palette.primary.main,
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h6">🎁 Đổi coupon</Typography>
          <IconButton onClick={() => setCouponModalOpen(false)} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {couponsLoading ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Đang tải danh sách coupon...
              </Typography>
            </Box>
          ) : exchangeableCoupons.length > 0 ? (
            <Grid container spacing={3}>
              {exchangeableCoupons.map((coupon) => (
                <Grid size={{ xs: 12, sm: 6 }} key={coupon.id}>
                  <Card sx={{
                    border: '2px solid #1976d2',
                    borderRadius: 2,
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 16px rgba(25,118,210,0.3)'
                    }
                  }}>
                    <CardContent>
                      <Typography variant="h6" color="primary" gutterBottom>
                        🎫 {coupon.name}
                      </Typography>

                      {coupon.description && (
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {coupon.description}
                        </Typography>
                      )}

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Mã coupon: <strong>{coupon.code}</strong>
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                          Loại giảm giá:
                          {coupon.type === 'PERCENTAGE' && ` ${coupon.discountValue}%`}
                          {coupon.type === 'FIXED_AMOUNT' && ` ${coupon.discountValue?.toLocaleString()} VNĐ`}
                        </Typography>

                        {coupon.minimumOrderValue && (
                          <Typography variant="body2" color="text.secondary">
                            Đơn hàng tối thiểu: {coupon.minimumOrderValue?.toLocaleString()} VNĐ
                          </Typography>
                        )}

                        {coupon.maximumDiscountAmount && (
                          <Typography variant="body2" color="text.secondary">
                            Giảm tối đa: {coupon.maximumDiscountAmount?.toLocaleString()} VNĐ
                          </Typography>
                        )}

                        <Typography variant="body2" color="text.secondary">
                          Hạn sử dụng: {new Date(coupon.validUntil).toLocaleDateString('vi-VN')}
                        </Typography>

                        {coupon.exchangeLimit && (
                          <Typography variant="body2" color="text.secondary">
                            Còn lại: {coupon.exchangeLimit - coupon.exchangeCount} coupon
                          </Typography>
                        )}
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        <Chip
                          label={`${coupon.pointsRequired} điểm`}
                          color="primary"
                          variant="outlined"
                          sx={{ fontWeight: 'bold' }}
                        />
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleExchangeCoupon(coupon.id)}
                          disabled={
                            (membership?.availablePoints || 0) < coupon.pointsRequired ||
                            exchangeLoading === coupon.id
                          }
                          sx={{ ml: 1, minWidth: '120px' }}
                        >
                          {exchangeLoading === coupon.id ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : (membership?.availablePoints || 0) >= coupon.pointsRequired ? (
                            'Đổi ngay'
                          ) : (
                            'Không đủ điểm'
                          )}
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography sx={{ fontSize: '64px', mb: 2 }}>🎁</Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Không có coupon nào có thể đổi
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {!membership?.availablePoints || membership.availablePoints === 0
                  ? 'Bạn chưa có điểm để đổi coupon. Hãy mua sắm để tích điểm nhé!'
                  : 'Hiện tại chưa có coupon phù hợp với hạng thành viên và số điểm của bạn.'
                }
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  )
}
