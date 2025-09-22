import Box from '@mui/material/Box'
import NonMemberNotice from './NonMemberNotice'
import MemberInfoCard from './MemberInfoCard'
import MemberCoupons from './MemberCoupons'
import TierCards from './TierCards'
import Grid from '@mui/material/Grid'
import HistoryModal from './HistoryModal'
import CouponModal from './CouponModal'
import { useState } from 'react'
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
      toast.error('Customer information not found')
      return
    }

    setExchangeLoading(couponId)

    toast.promise(
      exchangeCouponAPI({
        customerId: customerDetails.id,
        couponId: couponId
      }),
      {
        pending: 'Processing coupon exchange...',
        success: 'Coupon exchanged successfully! 🎉'
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
          description: `Exchanged coupon: ${exchangedCoupon.name}`,
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
      benefits: ['Earn points on every order', 'Special promotion notifications'],
      color: '#32CD32',
      bgColor: '#F5F5F5'
    },
    {
      name: 'VITALITY',
      displayName: 'Vitality',
      minSpent: 2000000,
      maxSpent: 5000000,
      benefits: ['Earn points on every order', 'Special promotion notifications', '5% discount on all orders', 'Priority customer support'],
      color: '#FF7043',
      bgColor: '#FBE9E7'
    },
    {
      name: 'RADIANCE',
      displayName: 'Radiance',
      minSpent: 5000000,
      maxSpent: null,
      benefits: ['Earn points on every order', 'Special promotion notifications', '10% discount on all orders', 'Priority customer support', 'Free shipping', 'Free appetizer gift'],
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
            <NonMemberNotice customerDetails={customerDetails} />
          </Grid>
        )}

        {/* Grid 1: Thông tin thành viên hiện tại - chỉ hiển thị khi có membership */}
        {membership && (
          <Grid size={12}>
            <MemberInfoCard
              membership={membership}
              tierColor={tierColor}
              tierProgress={tierProgress}
              setHistoryModalOpen={setHistoryModalOpen}
              handleOpenCouponModal={handleOpenCouponModal}
            />
          </Grid>
        )}

        {/* Grid 2: Uu dai - chỉ hiển thị khi có membership */}
        {membership && (
          <MemberCoupons
            membership={membership}
            customerCoupons={customerCoupons}
          />
        )}

        {/* Grid 3: 3 Cards thông tin các tier - hiển thị cho cả member và non-member */}
        <TierCards
          tierInfo={tierInfo}
          membership={membership}
          selectedTier={selectedTier}
          handleTierClick={handleTierClick}
          displayTier={displayTier}
        />

      </Grid>

      {/* Modal lịch sử điểm thưởng */}
      <HistoryModal
        open={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        pointHistories={pointHistories}
      />

      {/* Modal đổi coupon */}
      <CouponModal
        open={couponModalOpen}
        onClose={() => setCouponModalOpen(false)}
        couponsLoading={couponsLoading}
        exchangeableCoupons={exchangeableCoupons}
        membership={membership}
        exchangeLoading={exchangeLoading}
        handleExchangeCoupon={handleExchangeCoupon}
      />
    </Box>
  )
}
