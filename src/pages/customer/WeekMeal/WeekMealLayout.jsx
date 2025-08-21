import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import AppBar from '~/components/AppBar/AppBar'
import theme from '~/theme'
import Footer from '~/components/Footer/Footer'
import WeekPlan from '~/pages/customer/WeekMeal/WeekPlan/WeekPlan'
import { getWeekMealPlanAPI } from '~/apis'
import { useEffect, useState } from 'react'
import moment from 'moment'
import Skeleton from '@mui/material/Skeleton'

const mealTypes = [
  { key: 'low', title: 'THỰC ĐƠN LOW CALORIES' },
  { key: 'balance', title: 'THỰC ĐƠN BALANCE CALORIES' },
  { key: 'high', title: 'THỰC ĐƠN HIGH CALORIES' },
  { key: 'vegetarian', title: 'THỰC ĐƠN CHAY', type: 'VEGETARIAN' }
]

const WeekMealLayout = () => {
  const [dates, setDates] = useState({
    low: moment(),
    balance: moment(),
    high: moment(),
    vegetarian: moment()
  })
  const [weekData, setWeekData] = useState({
    low: null,
    balance: null,
    high: null,
    vegetarian: null
  })
  const [loading, setLoading] = useState({
    low: false,
    balance: false,
    high: false,
    vegetarian: false
  })

  // LOW CALORIES
  useEffect(() => {
    setLoading(prev => ({ ...prev, low: true }))
    getWeekMealPlanAPI('low', dates.low.format('YYYY-MM-DD'))
      .then(res => setWeekData(prev => ({ ...prev, low: res })))
      .catch(() => setWeekData(prev => ({ ...prev, low: null })))
      .finally(() => setLoading(prev => ({ ...prev, low: false })))
    // eslint-disable-next-line
  }, [dates.low])

  // BALANCE CALORIES
  useEffect(() => {
    setLoading(prev => ({ ...prev, balance: true }))
    getWeekMealPlanAPI('balance', dates.balance.format('YYYY-MM-DD'))
      .then(res => setWeekData(prev => ({ ...prev, balance: res })))
      .catch(() => setWeekData(prev => ({ ...prev, balance: null })))
      .finally(() => setLoading(prev => ({ ...prev, balance: false })))
    // eslint-disable-next-line
  }, [dates.balance])

  // HIGH CALORIES
  useEffect(() => {
    setLoading(prev => ({ ...prev, high: true }))
    getWeekMealPlanAPI('high', dates.high.format('YYYY-MM-DD'))
      .then(res => setWeekData(prev => ({ ...prev, high: res })))
      .catch(() => setWeekData(prev => ({ ...prev, high: null })))
      .finally(() => setLoading(prev => ({ ...prev, high: false })))
    // eslint-disable-next-line
  }, [dates.high])

  // VEGETARIAN
  useEffect(() => {
    setLoading(prev => ({ ...prev, vegetarian: true }))
    getWeekMealPlanAPI('vegetarian', dates.vegetarian.format('YYYY-MM-DD'))
      .then(res => setWeekData(prev => ({ ...prev, vegetarian: res })))
      .catch(() => setWeekData(prev => ({ ...prev, vegetarian: null })))
      .finally(() => setLoading(prev => ({ ...prev, vegetarian: false })))
    // eslint-disable-next-line
  }, [dates.vegetarian])

  // Hàm đổi tuần
  const handleChangeWeek = (key, diff) => {
    setDates(prev => {
      const current = moment()
      const prevDate = moment(prev[key])

      const currentWeek = current.week()
      const currentYear = current.year()

      const newDate = moment(prevDate).add(diff, 'days')
      const newWeek = newDate.week()
      const newYear = newDate.year()

      const weekDiff = (newYear - currentYear) * 52 + (newWeek - currentWeek)

      if (weekDiff < -1 || weekDiff > 1) {
        return prev
      }

      return { ...prev, [key]: newDate }
    })
  }

  return (
    <Box sx={{ bgcolor: theme.palette.background.default, color: theme.palette.text.primary, minHeight: '100vh', fontFamily: '"Poppins", sans-serif' }}>
      <AppBar />
      <Box sx={{ maxWidth: '1280px', mx: 'auto', px: 2, py: 6, mt: theme.fitbowl.appBarHeight }}>
        <Box>
          <Typography
            variant="h1"
            align="center"
            sx={{
              fontSize: { xs: '2.5rem', md: '4rem' },
              fontWeight: 300,
              letterSpacing: '0.1em',
              mb: 2,
              color: theme.palette.text.primary
            }}
          >
            Choose <span style={{ fontWeight: 800, color: theme.palette.primary.secondary }}>WEEKLY MEAL PLAN</span>
          </Typography>
          <Box sx={{ width: '7rem', height: '0.4rem', bgcolor: theme.palette.primary.secondary, mx: 'auto', mb: 4, borderRadius: 2 }} />
          <Typography
            variant="body1"
            align="center"
            sx={{ maxWidth: '48rem', mx: 'auto', mb: 6, fontSize: { xs: '1rem', md: '1.15rem' }, color: theme.palette.text.textSub }}
          >
            Choose a weekly meal plan that suits your needs and preferences. Our plans are designed to help you maintain a balanced diet while enjoying delicious meals every day.
          </Typography>
        </Box>

        {mealTypes.map(({ key, title }) => (
          <Box sx={{ pt: 6 }} key={key}>
            {loading[key] ? (
              <Skeleton variant="rectangular" height={320} sx={{ borderRadius: 3, mb: 4 }} />
            ) : (
              weekData[key] && (
                <WeekPlan
                  weekData={weekData[key]}
                  title={title}
                  onPrevWeek={() => handleChangeWeek(key, -7)}
                  onNextWeek={() => handleChangeWeek(key, 7)}
                />
              )
            )}
          </Box>
        ))}
      </Box>
      <Footer />
    </Box>
  )
}

export default WeekMealLayout
