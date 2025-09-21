import { useEffect, useMemo, useState } from 'react'
import Grid from '@mui/material/Grid'
import FoodReferenceDialog from './FoodReferenceDialog'
import FoodReferenceList from './FoodReferenceList'
import { updateCustomerReferenceAPI } from '~/apis'
import FavoriteProducts from './FavoriteProducts'
import CouponsSummaryCard from './CouponsSummaryCard'
import RecentOrdersCard from './RecentOrdersCard'
import MembershipSummaryCard from './MembershipSummaryCard'
import TopBanner from '~/components/Banners/TopBanner'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { selectCurrentLanguage } from '~/redux/translations/translationsSlice'

export default function OverviewTab({ customerDetails, setCustomerDetails }) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [prefill, setPrefill] = useState(null)
  const [userDeclined, setUserDeclined] = useState(false)
  const { t } = useTranslation()
  const currentLang = useSelector(selectCurrentLanguage)
  // theme available if needed by children

  const vegetarianTypes = [
    { value: 'NEVER', label: t('profile.overviewTab.vegetarianTypes.never') },
    { value: 'VEGAN', label: t('profile.overviewTab.vegetarianTypes.vegan') },
    { value: 'LUNAR_VEGAN', label: t('profile.overviewTab.vegetarianTypes.lunarVegan') }
  ]

  // Handle cancel dialog
  const handleCancelDialog = () => {
    setDialogOpen(false)
    setUserDeclined(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditMode(false)
    setPrefill(null)
  }

  const handleSubmitReference = async (formVals) => {
    // Adapter for create vs update
    const payload = {
      customerId: customerDetails.id,
      vegetarianType: formVals.vegetarianType || 'NEVER',
      canEatEggs: !!formVals.canEatEggs,
      canEatDairy: !!formVals.canEatDairy,
      note: formVals.note || '',
      favoriteProteins: (formVals.favoriteProteins || []).map(name => ({ proteinName: name })),
      favoriteCarbs: (formVals.favoriteCarbs || []).map(name => ({ carbName: name })),
      favoriteVegetables: (formVals.favoriteVegetables || []).map(name => ({ vegetableName: name })),
      allergies: (formVals.allergies || []).map(name => ({ allergyName: name }))
    }
    if (editMode) {
      const updated = await updateCustomerReferenceAPI(payload)
      setCustomerDetails(prev => ({ ...prev, customerReference: updated }))
    }
  }

  // Derived data for summary widgets
  const {
    totalSixMonthSpend,
    sixMonthOrderCount,
    recentOrders,
    availableCoupons
  } = useMemo(() => {
    const orders = Array.isArray(customerDetails?.orders) ? customerDetails.orders : []
    const coupons = Array.isArray(customerDetails?.customerCoupons) ? customerDetails.customerCoupons : []
    const now = new Date()
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(now.getMonth() - 6)

    const deliveredLast6M = orders.filter(o => {
      const d = o.deliveryTime ? new Date(o.deliveryTime) : (o.createdAt ? new Date(o.createdAt) : null)
      const inRange = d ? d >= sixMonthsAgo && d <= now : false
      // Count only delivered orders for spend; if no status, still count
      return inRange && (!o.status || o.status === 'DELIVERED')
    })
    // Prefer server-provided metric if available
    const membershipSixMonth = Number(customerDetails?.membership?.totalSpentLast6Months)
    const sum = Number.isFinite(membershipSixMonth) && membershipSixMonth >= 0
      ? membershipSixMonth
      : deliveredLast6M.reduce((acc, o) => acc + (o.totalAmount || 0), 0)

    const sortedRecent = [...orders].sort((a, b) => {
      const da = new Date(a.createdAt || a.deliveryTime || 0).getTime()
      const db = new Date(b.createdAt || b.deliveryTime || 0).getTime()
      return db - da
    }).slice(0, 3)

    const availCoupons = coupons
      .filter(c => c.status === 'AVAILABLE')
      .sort((a, b) => new Date(b.expiresAt || 0) - new Date(a.expiresAt || 0))
      .slice(0, 6)

    return {
      totalSixMonthSpend: sum,
      sixMonthOrderCount: deliveredLast6M.length,
      recentOrders: sortedRecent,
      availableCoupons: availCoupons
    }
  }, [customerDetails])

  const formatVND = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0)

  const statusColorMap = {
    PENDING: 'warning',
    CONFIRMED: 'info',
    SHIPPING: 'primary',
    DELIVERED: 'success',
    CANCELLED: 'error'
  }

  const getStatusColor = (status) => statusColorMap[status] || 'default'

  const statusLabelMap = {
    PENDING: t('profile.overviewTab.orderStatus.pending'),
    CONFIRMED: t('profile.overviewTab.orderStatus.confirmed'),
    SHIPPING: t('profile.overviewTab.orderStatus.shipping'),
    DELIVERED: t('profile.overviewTab.orderStatus.delivered'),
    CANCELLED: t('profile.overviewTab.orderStatus.cancelled')
  }

  const getStatusLabel = (status) => statusLabelMap[status] || status || t('profile.overviewTab.orderStatus.unknown')


  // Auto open form on first visit if no reference yet
  // useEffect(() => {
  //   if (!customerDetails?.customerReference && !dialogOpen && !userDeclined) {
  //     setDialogOpen(true)
  //     setEditMode(false)
  //     setPrefill(null)
  //   }
  // }, [customerDetails, dialogOpen, userDeclined])

  return (
    <>
      <Grid container spacing={2}>
        <Grid size={12}>
          <FoodReferenceList
            customerDetails={customerDetails}
            vegetarianTypes={vegetarianTypes}
            setPrefill={setPrefill}
            setEditMode={setEditMode}
            setDialogOpen={setDialogOpen}
            setUserDeclined={setUserDeclined}
          />
        </Grid>

        <Grid
          size={{ xs: 12, sm: 8, md: 8 }}
          sx = {{
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}
        >

          <RecentOrdersCard
            recentOrders={recentOrders}
            getStatusLabel={getStatusLabel}
            getStatusColor={getStatusColor}
            formatVND={formatVND}
          />

          <MembershipSummaryCard
            membership={customerDetails?.membership}
            formatVND={formatVND}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 4, md: 4 }}>
          <CouponsSummaryCard availableCoupons={availableCoupons} />
        </Grid>

        <Grid size={12}>
          <FavoriteProducts favoriteProducts={customerDetails?.favoriteProducts} />
        </Grid>

      </Grid>

      {/* Food Preference Dialog */}
      <FoodReferenceDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onCancel={handleCancelDialog}
        customerDetails={customerDetails}
        setCustomerDetails={setCustomerDetails}
        editMode={editMode}
        prefill={prefill}
        onSubmit={handleSubmitReference}
      />
    </>
  )
}
