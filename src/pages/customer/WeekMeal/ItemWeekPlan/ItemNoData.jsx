import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import theme from '~/theme'
import IconButton from '@mui/material/IconButton'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import moment from 'moment'

const ItemNoData = ({ title, currentWeekDate, onPrevWeek, onNextWeek }) => {

  const translatedNoData = 'No data'
  const translatedDay = 'Day'
  const translatedMeal1 = 'Breakfast'
  const translatedMeal2 = 'Lunch'
  const translatedMeal3 = 'Dinner'
  const translatedTime1 = '(6:00 - 10:00)'
  const translatedTime2 = '(11:00 - 14:00)'
  const translatedTime3 = '(17:00 - 20:00)'
  const translatedPrevWeek = 'Previous Week'
  const translatedNextWeek = 'Next Week'
  const translatedNoWeekData = 'No Week Data'

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
          justifyContent: 'center',
          mb: 4,
          gap: { xs: 2, sm: 0 }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            onClick={onPrevWeek}
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
            {currentWeekDate && (
              <>
                {moment(currentWeekDate).startOf('isoWeek').format('DD/MM')} - {moment(currentWeekDate).endOf('isoWeek').format('DD/MM')}
                <br />
                <Box component="span" sx={{ fontSize: '1rem', fontWeight: 400, color: theme.palette.text.textSub }}>
                  {translatedNoWeekData}
                </Box>
              </>
            )}
          </Typography>
          <IconButton
            onClick={onNextWeek}
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
