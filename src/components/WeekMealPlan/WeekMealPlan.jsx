import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { formatDate } from '~/utils/formatter'

export default function WeekMealPlan({ data }) {
  if (!data) return null
  const { type, weekStart, weekEnd, days = [] } = data

  const mapDay = (code) => {
    switch (code) {
    case 'T2': return 'Monday'
    case 'T3': return 'Tuesday'
    case 'T4': return 'Wednesday'
    case 'T5': return 'Thursday'
    case 'T6': return 'Friday'
    case 'T7': return 'Saturday'
    case 'CN': return 'Sunday'
    default: return code
    }
  }

  const MEAL_WINDOWS = {
    1: { label: 'BREAKFAST', start: '06:00', end: '10:00' },
    2: { label: 'LUNCH', start: '11:00', end: '14:00' },
    3: { label: 'DINNER', start: '17:00', end: '20:00' }
  }

  const parseDateTime = (dateStr, hhmm) => {
    // hhmm format: HH:MM
    const [h, m] = hhmm.split(':')
    const d = new Date(dateStr + 'T00:00:00')
    d.setHours(Number(h), Number(m), 0, 0)
    return d
  }

  const renderMeal = (meal, label, dayDate, mealIndex) => {
    if (!meal) return null
    const window = MEAL_WINDOWS[mealIndex]
    const now = new Date()
    const endAt = parseDateTime(dayDate, window.end)
    const isPast = now > endAt
    return (
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', p: 1, border: '1px solid #eee', borderRadius: 1, opacity: isPast ? 0.5 : 1 }}>
        {meal.image && (
          <Box component="img" src={meal.image} alt={meal.title} sx={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 1 }} />
        )}
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="subtitle2" noWrap sx={{ fontWeight: 600 }}>
            {label}: {meal.title}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {window.label} ({window.start} - {window.end})
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {meal.calories} cal • P {meal.protein}g • C {meal.carbs}g • F {meal.fat}g
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
          {meal.price?.toLocaleString()}₫
        </Typography>
      </Box>
    )
  }

  return (
    <Card elevation={0} sx={{ mt: 1, border: '1px dashed #ddd', bgcolor: 'grey.50' }}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Week Meal Plan</Typography>
            <Typography variant="body2" color="text.secondary">({type})</Typography>
            <Typography variant="body2" color="text.secondary">{formatDate(weekStart)} ~ {formatDate(weekEnd)}</Typography>
          </Box>
        }
        sx={{ py: 1, '& .MuiCardHeader-content': { overflow: 'hidden' } }}
      />
      <CardContent sx={{ pt: 0 }}>
        <Grid container spacing={1}>
          {Array.isArray(days) && days.map((d, idx) => (
            <Grid size={{ xs: 12, md: 6 }} key={idx}>
              <Card variant="outlined" sx={{ p: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{mapDay(d.day)} • {formatDate(d.date)}</Typography>
                  {d.type && (
                    <Typography variant="caption" color="text.secondary">{d.type}</Typography>
                  )}
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {renderMeal(d.meal1, 'Meal 1', d.date, 1)}
                  {renderMeal(d.meal2, 'Meal 2', d.date, 2)}
                  {renderMeal(d.meal3, 'Meal 3', d.date, 3)}
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  )
}
