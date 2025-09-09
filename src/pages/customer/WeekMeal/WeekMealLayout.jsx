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
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
// import { selectCurrentLanguage } from '~/redux/translations/translationsSlice'
import ItemNoData from '~/pages/customer/WeekMeal/ItemWeekPlan/ItemNoData'
const WeekMealLayout = () => {
  const [dates, setDates] = useState({
    low: moment().isoWeekday(1), // Thứ hai của tuần hiện tại (đảm bảo không phụ thuộc locale)
    balance: moment().isoWeekday(1),
    high: moment().isoWeekday(1),
    vegetarian: moment().isoWeekday(1)
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
  // const currentLang = useSelector(selectCurrentLanguage)
  const { t } = useTranslation()

  // Sử dụng translations từ en.js và vi.js
  const translatedChooseWeekly = t('weekMeal.chooseWeekly')
  const translatedChooseWeeklyDesc = t('weekMeal.chooseWeeklyDesc')
  const translatedNoData = t('weekMeal.noData')
  const translatedLowCalories = t('weekMeal.lowCalories')
  const translatedBalanceCalories = t('weekMeal.balanceCalories')
  const translatedHighCalories = t('weekMeal.highCalories')
  const translatedVegetarian = t('weekMeal.vegetarian')

  // Cập nhật mealTypes để sử dụng translations
  const mealTypes = [
    { key: 'low', title: translatedLowCalories },
    { key: 'balance', title: translatedBalanceCalories },
    { key: 'high', title: translatedHighCalories },
    { key: 'vegetarian', title: translatedVegetarian, type: 'VEGETARIAN' }
  ]

  // LOW CALORIES
  useEffect(() => {
    setLoading(prev => ({ ...prev, low: true }))
    const mondayDate = dates.low.format('YYYY-MM-DD') // Bỏ .startOf('week') vì dates.low đã là Monday
    getWeekMealPlanAPI('low', mondayDate)
      .then(res => setWeekData(prev => ({ ...prev, low: res })))
      .catch(() => setWeekData(prev => ({ ...prev, low: null })))
      .finally(() => setLoading(prev => ({ ...prev, low: false })))
  }, [dates.low])

  // BALANCE CALORIES
  useEffect(() => {
    setLoading(prev => ({ ...prev, balance: true }))
    const mondayDate = dates.balance.format('YYYY-MM-DD') // Bỏ .startOf('week')
    getWeekMealPlanAPI('balance', mondayDate)
      .then(res => setWeekData(prev => ({ ...prev, balance: res })))
      .catch(() => setWeekData(prev => ({ ...prev, balance: null })))
      .finally(() => setLoading(prev => ({ ...prev, balance: false })))
  }, [dates.balance])

  // HIGH CALORIES
  useEffect(() => {
    setLoading(prev => ({ ...prev, high: true }))
    const mondayDate = dates.high.format('YYYY-MM-DD') // Bỏ .startOf('week')
    getWeekMealPlanAPI('high', mondayDate)
      .then(res => setWeekData(prev => ({ ...prev, high: res })))
      .catch(() => setWeekData(prev => ({ ...prev, high: null })))
      .finally(() => setLoading(prev => ({ ...prev, high: false })))
  }, [dates.high])

  // VEGETARIAN
  useEffect(() => {
    setLoading(prev => ({ ...prev, vegetarian: true }))
    const mondayDate = dates.vegetarian.format('YYYY-MM-DD') // Bỏ .startOf('week')
    getWeekMealPlanAPI('vegetarian', mondayDate)
      .then(res => setWeekData(prev => ({ ...prev, vegetarian: res })))
      .catch(() => setWeekData(prev => ({ ...prev, vegetarian: null })))
      .finally(() => setLoading(prev => ({ ...prev, vegetarian: false })))
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
      console.log('Week diff for', key, ':', weekDiff) // Debug: kiểm tra weekDiff

      if (weekDiff < -1 || weekDiff > 1) {
        console.log('Blocked change for', key, 'due to weekDiff:', weekDiff) // Debug: lý do bị chặn
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
            Choose <span style={{ fontWeight: 800, color: theme.palette.primary.secondary }}>{translatedChooseWeekly}</span>
          </Typography>
          <Box sx={{ width: '7rem', height: '0.4rem', bgcolor: theme.palette.primary.secondary, mx: 'auto', mb: 4, borderRadius: 2 }} />
          <Typography
            variant="body1"
            align="center"
            sx={{ maxWidth: '48rem', mx: 'auto', mb: 6, fontSize: { xs: '1rem', md: '1.15rem' }, color: theme.palette.text.textSub }}
          >
            {translatedChooseWeeklyDesc}
          </Typography>
        </Box>

        {mealTypes.map(({ key, title }) => (
          <Box sx={{ pt: 6 }} key={key}>
            {loading[key] ? (
              <Skeleton variant="rectangular" height={320} sx={{ borderRadius: 3, mb: 4 }} />
            ) : weekData[key] && weekData[key].days && weekData[key].days.length > 0 ? (
              <WeekPlan
                weekData={weekData[key]}
                title={title}
                onPrevWeek={() => handleChangeWeek(key, -7)}
                onNextWeek={() => handleChangeWeek(key, 7)}
              />
            ) : (
              <ItemNoData title={title} />
            )}
          </Box>
        ))}
      </Box>
      <Footer />
    </Box>
  )
}

export default WeekMealLayout
