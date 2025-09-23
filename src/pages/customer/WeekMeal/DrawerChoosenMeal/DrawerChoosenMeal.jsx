import { useState, useEffect } from 'react'
import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import theme from '~/theme'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Button from '@mui/material/Button'
import ItemWeekPlan from '../ItemWeekPlan/ItemWeekPlan'
import ConfirmModal from '~/components/Modals/ComfirmModal/ComfirmModal'
import { useDispatch, useSelector } from 'react-redux'
import { createCartItem, fetchCart } from '~/redux/cart/cartSlice'
import { clearCart } from '~/redux/meal/mealSlice' // Thêm import clearCart nếu cần
import { toast } from 'react-toastify'
import { IMAGE_DEFAULT } from '~/utils/constants'
import { HEALTHY_MESSAGES } from '~/utils/constants'
import { createCustomerWeekMealAPI } from '~/apis/index'

const DrawerChoosenMeal = ({ open, onClose, weekData, title, onOrder }) => {
  // Tính ngày bị disable (đã qua)
  const getIsDisabled = (dateStr) => {
    const today = new Date()
    const todayStr = today.toISOString().slice(0, 10)
    const dayOfWeek = today.getDay() === 0 ? 7 : today.getDay() // Chủ nhật là 7
    const monday = new Date(today)
    monday.setDate(today.getDate() - (dayOfWeek - 1))
    const mondayStr = monday.toISOString().slice(0, 10)
    return dateStr >= mondayStr && dateStr <= todayStr
  }

  // Mặc định check hết khi mở Drawer (user tự tắt những cái không muốn)
  const [days, setDays] = useState(
    weekData.days.map(d => {
      const isDisabled = getIsDisabled(d.date)
      return {
        ...d,
        mealOrder1: isDisabled ? false : true, // Ngày disable thì tắt luôn
        mealOrder2: isDisabled ? false : true,
        mealOrder3: isDisabled ? false : true,
        isDisabled // Thêm flag để biết ngày này có bị disable không
      }
    })
  )

  useEffect(() => {
    setDays(
      weekData.days.map(d => {
        const isDisabled = getIsDisabled(d.date)
        return {
          ...d,
          mealOrder1: isDisabled ? false : true, // Ngày disable thì tắt luôn
          mealOrder2: isDisabled ? false : true,
          mealOrder3: isDisabled ? false : true,
          isDisabled // Thêm flag để biết ngày này có bị disable không
        }
      })
    )
  }, [weekData])

  const [openHealthy, setOpenHealthy] = useState(false)
  const [healthyMsg, setHealthyMsg] = useState('')
  // Thêm state để nhớ đã cảnh báo healthy cho từng buổi
  const [shownHealthy, setShownHealthy] = useState({
    mealOrder1: false,
    mealOrder2: false,
    mealOrder3: false
  })

  // Reset lại khi mở drawer mới
  useEffect(() => {
    setShownHealthy({
      mealOrder1: false,
      mealOrder2: false,
      mealOrder3: false
    })
  }, [open])

  const dispatch = useDispatch()
  const [ordering, setOrdering] = useState(false)
  const customerId = useSelector(state => state.customer.currentCustomer?.id ?? null)

  // Thêm translations thủ công
  const translatedOrderNow = 'Order Now'
  const translatedHealthWarning = 'Health Warning'
  const translatedUnderstood = 'Understood'
  const translatedDay = 'Day'
  const translatedMeal1 = 'Breakfast'
  const translatedMeal2 = 'Lunch'
  const translatedMeal3 = 'Dinner'
  const translatedTime1 = '(6:00 - 10:00)'
  const translatedTime2 = '(11:00 - 14:00)'
  const translatedTime3 = '(17:00 - 20:00)'
  const translatedAddedToCart = 'Added to cart successfully!'
  const translatedFailedToAdd = 'Failed to add to cart'
  const translatedWeekMealFrom = 'Week meal from'
  const translatedTo = 'to'
  const translatedType = 'type:'

  const handleSwitchChange = (idx, mealKey, checked) => {
    // Không cho phép thay đổi switch của ngày bị disable
    if (days[idx].isDisabled) return

    setDays(prev =>
      prev.map((d, i) =>
        i === idx ? { ...d, [mealKey]: checked } : d
      )
    )
    // Nếu tắt switch và chưa cảnh báo healthy cho buổi này thì cảnh báo
    if (!checked && HEALTHY_MESSAGES[mealKey] && !shownHealthy[mealKey]) {
      setHealthyMsg(HEALTHY_MESSAGES[mealKey])
      setOpenHealthy(true)
      setShownHealthy(prev => ({ ...prev, [mealKey]: true }))
    }
  }

  // Tính filteredDays và totalAmount để dùng cho cả render và khi đặt hàng
  const filteredDays = days
    .map(d => {
      const result = { day: d.day, date: d.date }
      if (d.mealOrder1) result.meal1 = d.meal1
      if (d.mealOrder2) result.meal2 = d.meal2
      if (d.mealOrder3) result.meal3 = d.meal3
      if (!d.mealOrder1 && !d.mealOrder2 && !d.mealOrder3) return null
      return result
    })
    .filter(Boolean)

  const totalAmount = Math.round(filteredDays.reduce((sum, d) => {
    let dayTotal = 0
    if (d.meal1 && d.meal1.price) dayTotal += parseFloat(d.meal1.price) || 0
    if (d.meal2 && d.meal2.price) dayTotal += parseFloat(d.meal2.price) || 0
    if (d.meal3 && d.meal3.price) dayTotal += parseFloat(d.meal3.price) || 0
    return sum + dayTotal
  }, 0))

  const handleOrder = async () => {
    if (ordering) return

    try {
      setOrdering(true)

      // Bước 1: Tạo CustomerWeekMeal trước
      const customerWeekMealData = {
        customerId: customerId,
        type: weekData.type,
        weekStart: weekData.weekStart,
        weekEnd: weekData.weekEnd,
        days: filteredDays.map(d => ({
          day: d.day,
          date: d.date,
          meal1: d.meal1?.id || null,
          meal2: d.meal2?.id || null,
          meal3: d.meal3?.id || null
        }))
      }
      // console.log('🚀 ~ handleOrder ~ customerWeekMealData:', customerWeekMealData)

      const customerWeekMealResponse = await createCustomerWeekMealAPI(customerWeekMealData)
      const customerWeekMealId = customerWeekMealResponse.id

      // Bước 2: Tạo cart item với CustomerWeekMeal ID
      const cartItemData = {
        customerWeekMealId: customerWeekMealId,
        quantity: 1,
        unitPrice: totalAmount,
        totalPrice: totalAmount,
        title: title,
        description: `${translatedWeekMealFrom} ${weekData.weekStart} ${translatedTo} ${weekData.weekEnd}, ${translatedType} ${weekData.type}`,
        image: IMAGE_DEFAULT.IMAGE_WEEK_MEAL,
        itemType: 'WEEK_MEAL'
        // Lưu customerWeekMeal vào cart thay vì customerWeekMealDay
      }

      // Gọi redux thunk để add vào cart
      await dispatch(createCartItem({ customerId, itemData: cartItemData }))
      if (customerId) {
        await dispatch(fetchCart(customerId))
      }
      toast.success(translatedAddedToCart)
      onClose()
    } catch (error) {
      console.error('Error creating customer week meal or adding to cart:', error)
      toast.error(translatedFailedToAdd)
    } finally {
      setOrdering(false)
    }
  }

  const handleClearSelections = () => {
    dispatch(clearCart())
  }

  const handleCloseDrawer = () => {
    onClose()
  }

  return (
    <Drawer anchor="bottom" open={open} onClose={onClose}>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'flex-end', p: 2 }}>
          <IconButton
            onClick={onClose}
            size='large'
            aria-label="Close drawer"
            sx={{
              color: theme.palette.text.primary,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
                color: theme.palette.text.primary
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ mx: 4 }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: '2.5rem',
              fontWeight: 800,
              letterSpacing: '0.1em',
              mb: 2,
              color: theme.palette.text.primary
            }}
          >
            {title}
          </Typography>
          <Box sx={{ width: '7rem', height: '0.4rem', bgcolor: theme.palette.primary.secondary, ml: 1, mb: 4, borderRadius: 2 }} />

          {/* Bảng thực đơn */}
          <Box sx={{ bgcolor: theme.palette.primary.main, borderRadius: 2, display: 'flex', mb: 2 }}>
            <Box
              sx={{
                flex: 1,
                color: '#fff',
                fontWeight: 700,
                py: 2,
                textAlign: 'center',
                fontSize: '1.2rem',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: '25%',
                  right: 0,
                  height: '50%',
                  width: '1px',
                  bgcolor: '#fff'
                }
              }}
            >
              {translatedDay}
            </Box>
            <Box
              sx={{
                flex: 2,
                color: '#fff',
                fontWeight: 700,
                py: 2,
                textAlign: 'center',
                fontSize: '1.2rem',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: '25%',
                  right: 0,
                  height: '50%',
                  width: '1.5px',
                  bgcolor: '#fff'
                }
              }}
            >
              {translatedMeal1} <Box component="span" sx={{ color: theme.palette.primary.secondary, fontWeight: 400 }}>{translatedTime1}</Box>
            </Box>
            <Box
              sx={{
                flex: 2,
                color: '#fff',
                fontWeight: 700,
                py: 2,
                textAlign: 'center',
                fontSize: '1.2rem',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: '25%',
                  right: 0,
                  height: '50%',
                  width: '1.5px',
                  bgcolor: '#fff'
                }
              }}
            >
              {translatedMeal2} <Box component="span" sx={{ color: theme.palette.primary.secondary, fontWeight: 400 }}>{translatedTime2}</Box>
            </Box>
            <Box
              sx={{
                flex: 2,
                color: '#fff',
                fontWeight: 700,
                py: 2,
                textAlign: 'center',
                fontSize: '1.2rem'
              }}
            >
              {translatedMeal3}<Box component="span" sx={{ color: theme.palette.primary.secondary, fontWeight: 400 }}>{translatedTime3}</Box>
            </Box>
          </Box>
          {days.map((d, idx) => (
            <ItemWeekPlan
              key={idx}
              d={d}
              idx={idx}
              isSwitch={true}
              onSwitchChange={(mealKey, checked) => handleSwitchChange(idx, mealKey, checked)}
              forceDisabled={d.isDisabled} // Truyền force disabled từ parent
            />
          ))}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              variant="contained"
              disabled={ordering}
              sx={{ bgcolor: theme.palette.primary.secondary, fontWeight: 700, px: 4, py: 1.5, borderRadius: 5, fontSize: '1.1rem', minWidth: '300px', mb: 3 }}
              onClick={handleOrder}
            >
              {translatedOrderNow} {totalAmount > 0 ? `(${totalAmount.toLocaleString()} VNĐ)` : ''}
            </Button>
          </Box>
        </Box>
        <ConfirmModal
          open={openHealthy}
          onClose={() => setOpenHealthy(false)}
          onConfirm={() => setOpenHealthy(false)}
          title={translatedHealthWarning}
          description={healthyMsg}
          btnName={translatedUnderstood}
        />
      </Box>
    </Drawer>
  )
}

export default DrawerChoosenMeal