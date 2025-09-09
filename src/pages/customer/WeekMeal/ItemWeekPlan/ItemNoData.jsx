import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import theme from '~/theme'
import { useTranslation } from 'react-i18next'

const ItemNoData = ({ title }) => {
  const { t } = useTranslation()

  const translatedNoData = t('weekMeal.noData') || 'No data'
  const translatedDay = t('weekMeal.day') || 'Day'
  const translatedMeal1 = t('weekMeal.meal1') || 'Breakfast'
  const translatedMeal2 = t('weekMeal.meal2') || 'Lunch'
  const translatedMeal3 = t('weekMeal.meal3') || 'Dinner'
  const translatedTime1 = t('weekMeal.time1') || '(6:00 - 10:00)'
  const translatedTime2 = t('weekMeal.time2') || '(11:00 - 14:00)'
  const translatedTime3 = t('weekMeal.time3') || '(17:00 - 20:00)'
  const translatedPrevWeek = t('weekMeal.prevWeek') || 'Previous Week'
  const translatedNextWeek = t('weekMeal.nextWeek') || 'Next Week'
  const translatedNoWeekData = t('weekMeal.noWeekData') || 'No Week Data'

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

      {/* Thanh chọn tuần (ẩn hoặc disable) */}
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
          <Typography sx={{ fontWeight: 800, fontSize: '1.5rem', mx: 1 }}>
            {translatedNoWeekData} {/* Sử dụng translation */}
          </Typography>
        </Box>
      </Box>

      {/* Bảng thực đơn (header) */}
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
          {translatedMeal3} <Box component="span" sx={{ color: theme.palette.primary.secondary, fontWeight: 400 }}>{translatedTime3}</Box>
        </Box>
      </Box>

      {/* Message No data */}
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" sx={{ color: theme.palette.text.textSub }}>
          {translatedNoData}
        </Typography>
      </Box>
    </Box>
  )
}

export default ItemNoData
