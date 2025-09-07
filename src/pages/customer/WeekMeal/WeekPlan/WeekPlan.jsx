import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import theme from '~/theme'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import DrawerChoosenMeal from '../DrawerChoosenMeal/DrawerChoosenMeal'
import ItemWeekPlan from '../ItemWeekPlan/ItemWeekPlan'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { selectCurrentLanguage } from '~/redux/translations/translationsSlice'

const WeekPlan = ({ weekData, title, onPrevWeek, onNextWeek }) => {
  const [openDrawer, setOpenDrawer] = useState(false)

  const handleOpenDrawer = () => setOpenDrawer(true)
  const handleCloseDrawer = () => setOpenDrawer(false)

  const currentDate = moment()

  const isValidStartDate = weekData && weekData.weekStart && moment(weekData.weekStart, 'YYYY-MM-DD').isValid()

  const viewedWeekStart = isValidStartDate
    ? moment(weekData.weekStart, 'YYYY-MM-DD')
    : moment()

  const currentWeek = currentDate.week()
  const currentYear = currentDate.year()

  const viewedWeek = viewedWeekStart.week()
  const viewedYear = viewedWeekStart.year()

  const weekDiff = (viewedYear - currentYear) * 52 + (viewedWeek - currentWeek)

  const canPrev = isValidStartDate && weekDiff > -1
  const canNext = isValidStartDate && weekDiff < 1

  const currentLang = useSelector(selectCurrentLanguage)
  const { t } = useTranslation()

  const translatedPrevWeek = t('weekMeal.prevWeek')
  const translatedNextWeek = t('weekMeal.nextWeek')
  const translatedOrderNow = t('weekMeal.orderNow')
  const translatedDay = t('weekMeal.day')
  const translatedMeal1 = t('weekMeal.meal1')
  const translatedMeal2 = t('weekMeal.meal2')
  const translatedMeal3 = t('weekMeal.meal3')
  const translatedTime1 = t('weekMeal.time1')
  const translatedTime2 = t('weekMeal.time2')
  const translatedTime3 = t('weekMeal.time3')

  return (
    <Box>
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

      {/* Thanh chọn tuần */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          mb: 4,
          gap: { xs: 2, sm: 0 }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            onClick={onPrevWeek}
            disabled={!canPrev}
            disableRipple
            disableFocusRipple
            sx={{
              gap: 1,
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: 'transparent'
              },
              '&:hover .prev-week-text': {
                color: theme.palette.primary.secondary,
                textDecoration: 'underline'
              },
              '&:hover .prev-week-icon': {
                color: theme.palette.primary.secondary
              }
            }}
          >
            <ArrowBackIosNewIcon fontSize='small' className='prev-week-icon' sx={{ mb: 0.3 }} />
            <Typography className="prev-week-text" sx={{ color: theme.palette.text.textSub, fontWeight: 500, transition: 'color 0.2s' }}>
              {translatedPrevWeek}
            </Typography>
          </IconButton>
          <Typography sx={{ fontWeight: 800, fontSize: '1.5rem', mx: 1 }}>
            {moment(weekData.weekStart, 'YYYY-MM-DD').format('DD/MM')} - {moment(weekData.weekEnd, 'YYYY-MM-DD').format('DD/MM')}
          </Typography>
          <IconButton
            onClick={onNextWeek}
            disabled={!canNext}
            disableRipple
            disableFocusRipple
            sx={{
              gap: 1,
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: 'transparent'
              },
              '&:hover .next-week-text': {
                color: theme.palette.primary.secondary,
                textDecoration: 'underline'
              },
              '&:hover .next-week-icon': {
                color: theme.palette.primary.secondary
              }
            }}
          >
            <Typography className="next-week-text" sx={{ color: theme.palette.text.textSub, fontWeight: 500, ml: 1, transition: 'color 0.2s' }}>
              {translatedNextWeek}
            </Typography>
            <ArrowForwardIosIcon fontSize='small' className='next-week-icon' sx={{ mb: 0.3 }} />
          </IconButton>
        </Box>
        <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <Button
            variant="contained"
            sx={{
              bgcolor: theme.palette.primary.secondary,
              fontWeight: 700,
              px: 4,
              py: 1.5,
              borderRadius: 5,
              fontSize: '1.1rem',
              width: { xs: '100%', sm: 'auto' } // mobile full width, desktop auto
            }}
            onClick={handleOpenDrawer}
            disabled={!(weekDiff === 0 || weekDiff === 1)}
          >
            {translatedOrderNow}
          </Button>
        </Box>
      </Box>

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
      {weekData.days.map((d, idx) => (
        <ItemWeekPlan key={idx} d={d} idx={idx} isSwitch={false} />
      ))}
      <DrawerChoosenMeal open={openDrawer} onClose={handleCloseDrawer} weekData={weekData} title={title} />
    </Box>
  )
}

export default WeekPlan