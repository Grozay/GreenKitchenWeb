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


const healthyMessages = {
  mealOrder1: 'Bữa sáng là khởi đầu hoàn hảo cho ngày mới, đừng bỏ lỡ để nạp năng lượng nhé!',
  mealOrder2: 'Bữa trưa giúp bạn tiếp tục bứt phá, hãy chọn món để nạp năng lượng!',
  mealOrder3: 'Ăn uống đúng giờ giúp cơ thể khỏe mạnh, đừng quên chăm sóc bản thân nhé!'
}

const DrawerChoosenMeal = ({ open, onClose, weekData, title, onOrder }) => {
  // Mặc định check hết khi mở Drawer
  const [days, setDays] = useState(
    weekData.days.map(d => ({
      ...d,
      mealOrder1: d.mealOrder1 !== undefined ? d.mealOrder1 : true,
      mealOrder2: d.mealOrder2 !== undefined ? d.mealOrder2 : true,
      mealOrder3: d.mealOrder3 !== undefined ? d.mealOrder3 : true
    }))
  )

  useEffect(() => {
    setDays(
      weekData.days.map(d => ({
        ...d,
        mealOrder1: d.mealOrder1 !== undefined ? d.mealOrder1 : true,
        mealOrder2: d.mealOrder2 !== undefined ? d.mealOrder2 : true,
        mealOrder3: d.mealOrder3 !== undefined ? d.mealOrder3 : true
      }))
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

  const handleSwitchChange = (idx, mealKey, checked) => {
    setDays(prev =>
      prev.map((d, i) =>
        i === idx ? { ...d, [mealKey]: checked } : d
      )
    )
    // Nếu tắt switch và chưa cảnh báo healthy cho buổi này thì cảnh báo
    if (!checked && healthyMessages[mealKey] && !shownHealthy[mealKey]) {
      setHealthyMsg(healthyMessages[mealKey])
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

  const totalAmount = filteredDays.reduce((sum, d) => {
    let dayTotal = 0
    if (d.meal1 && d.meal1.price) dayTotal += d.meal1.price
    if (d.meal2 && d.meal2.price) dayTotal += d.meal2.price
    if (d.meal3 && d.meal3.price) dayTotal += d.meal3.price
    return sum + dayTotal
  }, 0)

  const handleOrder = () => {
    const orderData = {
      weekStart: weekData.weekStart,
      weekEnd: weekData.weekEnd,
      type: weekData.type,
      days: filteredDays,
      itemType: 'WEEK_MEAL',
      totalAmount
    }
    console.log('🚀 ~ handleOrder ~ orderData:', orderData)
    if (onOrder) onOrder(orderData)
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
              NGÀY
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
              MEAL 1 <Box component="span" sx={{ color: theme.palette.primary.secondary, fontWeight: 400 }}>(6:00 - 10:00)</Box>
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
              MEAL 2 <Box component="span" sx={{ color: theme.palette.primary.secondary, fontWeight: 400 }}>(11:00 - 14:00)</Box>
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
              MEAL 3<Box component="span" sx={{ color: theme.palette.primary.secondary, fontWeight: 400 }}>(17:00 - 20:00)</Box>
            </Box>
          </Box>
          {days.map((d, idx) => (
            <ItemWeekPlan
              key={idx}
              d={d}
              idx={idx}
              isSwitch={true}
              onSwitchChange={(mealKey, checked) => handleSwitchChange(idx, mealKey, checked)}
            />
          ))}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              variant="contained"
              sx={{ bgcolor: theme.palette.primary.secondary, fontWeight: 700, px: 4, py: 1.5, borderRadius: 5, fontSize: '1.1rem', minWidth: '300px', mb: 3 }}
              onClick={handleOrder}
            >
              Đặt Ngay {totalAmount > 0 ? `(${totalAmount.toLocaleString()} VNĐ)` : ''}
            </Button>
          </Box>
        </Box>
        <ConfirmModal
          open={openHealthy}
          onClose={() => setOpenHealthy(false)}
          onConfirm={() => setOpenHealthy(false)}
          title="Cảnh báo sức khỏe"
          description={healthyMsg}
          btnName="Đã hiểu"
        />
      </Box>
    </Drawer>
  )
}

export default DrawerChoosenMeal