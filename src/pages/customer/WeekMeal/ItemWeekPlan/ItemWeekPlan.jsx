import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import theme from '~/theme'
import Switch from '@mui/material/Switch'
import { styled } from '@mui/material/styles'
import Popover from '@mui/material/Popover'
import Zoom from '@mui/material/Zoom'
import ItemPopover from './ItemPopover'
import WbSunnyIcon from '@mui/icons-material/WbSunny'
import LunchDiningIcon from '@mui/icons-material/LunchDining'
import NightsStayIcon from '@mui/icons-material/NightsStay'

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.primary.secondary,
        opacity: 1,
        border: 0,
        ...(theme.palette.mode === 'dark' && {
          backgroundColor: '#2ECA45'
        })
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5
      }
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff'
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.grey[100],
      ...(theme.palette.mode === 'dark' && {
        color: theme.palette.grey[600]
      })
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: 0.7,
      ...(theme.palette.mode === 'dark' && {
        opacity: 0.3
      })
    }
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: '#E9E9EA',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500
    }),
    ...(theme.palette.mode === 'dark' && {
      backgroundColor: '#39393D'
    })
  }
}))

const ItemWeekPlan = ({ d, idx, isSwitch, onSwitchChange, forceDisabled }) => {

  const translatedCalories = 'Calories'
  const translatedProtein = 'Protein'
  const translatedCarbs = 'Carbs'
  const translatedFat = 'Fat'
  const translatedPrice = 'Price:'
  const translatedCannotOrder = 'Cannot order this day'
  const translatedSelect = 'Select'

  // Dịch tự động cho title và description của meal (như trong MenuDetail)
  const translatedMeal1Title = d.meal1?.title || ''
  const translatedMeal1Description = d.meal1?.description || ''
  const translatedMeal2Title = d.meal2?.title || ''
  const translatedMeal2Description = d.meal2?.description || ''
  const translatedMeal3Title = d.meal3?.title || ''
  const translatedMeal3Description = d.meal3?.description || ''

  // Meal 1
  const [anchorEl1, setAnchorEl1] = useState(null)
  const open1 = Boolean(anchorEl1)
  const [popoverTimeout1, setPopoverTimeout1] = useState(null)

  const handlePopoverOpen1 = (event) => {
    const currentTarget = event.currentTarget
    const timeout = setTimeout(() => {
      setAnchorEl1(currentTarget)
    }, 600)
    setPopoverTimeout1(timeout)
  }

  const handlePopoverClose1 = () => {
    if (popoverTimeout1) {
      clearTimeout(popoverTimeout1)
      setPopoverTimeout1(null)
    }
    setAnchorEl1(null)
  }

  // Meal 2
  const [anchorEl2, setAnchorEl2] = useState(null)
  const open2 = Boolean(anchorEl2)
  const [popoverTimeout2, setPopoverTimeout2] = useState(null)

  const handlePopoverOpen2 = (event) => {
    const currentTarget = event.currentTarget
    const timeout = setTimeout(() => {
      setAnchorEl2(currentTarget)
    }, 600)
    setPopoverTimeout2(timeout)
  }

  const handlePopoverClose2 = () => {
    if (popoverTimeout2) {
      clearTimeout(popoverTimeout2)
      setPopoverTimeout2(null)
    }
    setAnchorEl2(null)
  }

  // Meal 3
  const [anchorEl3, setAnchorEl3] = useState(null)
  const open3 = Boolean(anchorEl3)
  const [popoverTimeout3, setPopoverTimeout3] = useState(null)

  const handlePopoverOpen3 = (event) => {
    const currentTarget = event.currentTarget
    const timeout = setTimeout(() => {
      setAnchorEl3(currentTarget)
    }, 600)
    setPopoverTimeout3(timeout)
  }

  const handlePopoverClose3 = () => {
    if (popoverTimeout3) {
      clearTimeout(popoverTimeout3)
      setPopoverTimeout3(null)
    }
    setAnchorEl3(null)
  }

  const today = new Date()
  const todayStr = today.toISOString().slice(0, 10)

  const dayOfWeek = today.getDay() === 0 ? 7 : today.getDay() // Chủ nhật là 7
  const monday = new Date(today)
  monday.setDate(today.getDate() - (dayOfWeek - 1))
  const mondayStr = monday.toISOString().slice(0, 10)

  const isDisabled = forceDisabled !== undefined ? forceDisabled : (d.date >= mondayStr && d.date <= todayStr)

  return (
    <Box
      key={idx}
      sx={{
        position: 'relative',
        display: 'flex',
        bgcolor: '#fff',
        borderRadius: 2,
        mb: 2,
        boxShadow: 1,
        opacity: isDisabled ? 0.5 : 1
      }}
    >
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 3 }}>
        <Box sx={{
          bgcolor: theme.palette.primary.main,
          color: theme.palette.primary.secondary,
          borderRadius: '50%',
          width: 80,
          height: 80,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: '1.2rem'
        }}>
          <Box>{d.day}</Box>
          <Box sx={{ fontSize: '1rem', color: '#fff', fontWeight: 400 }}>
            {d.date ? (() => {
              const parts = d.date.split('-')
              return parts.length === 3 ? `${parts[2]}.${parts[1]}` : d.date
            })() : ''}
          </Box>
        </Box>
      </Box>
      {/* ...existing code ngày... */}
      {/* MEAL 1 - Sáng */}
      <Box sx={{ flex: 2, py: 3, px: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box
          onMouseEnter={isDisabled ? undefined : handlePopoverOpen1}
          onMouseLeave={isDisabled ? undefined : handlePopoverClose1}
          aria-owns={open1 ? 'meal1-popover' : undefined}
          aria-haspopup="true"
          sx={{ cursor: isDisabled ? 'not-allowed' : 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <WbSunnyIcon sx={{ color: theme.palette.warning.main, mr: 1 }} />
            <Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>{translatedMeal1Title}</Typography>
          </Box>
          {isDisabled && (
            <Typography sx={{ color: 'red', fontSize: '0.95rem', mb: 1 }}>
              {translatedCannotOrder}
            </Typography>
          )}
          <Typography sx={{ color: theme.palette.text.textSub, mb: 1 }}>{translatedMeal1Description}</Typography>
          <Typography sx={{ fontSize: '0.95rem', color: theme.palette.text.textSub }}>
            {translatedCalories} {d.meal1?.calories ?? '--'} | {translatedProtein} {d.meal1?.protein ?? '--'}g | {translatedCarbs}{' '}
            {d.meal1?.carbs ?? '--'}g | {translatedFat} {d.meal1?.fat ?? '--'}g
          </Typography>
          <Typography sx={{ fontSize: '0.95rem', color: theme.palette.text.textSub }}>
            {translatedPrice} {d.meal1?.price ? `${d.meal1.price}VNĐ` : '--'}
          </Typography>
        </Box>
        <Popover
          id="meal1-popover"
          sx={{ pointerEvents: 'none' }}
          open={!isDisabled && open1}
          anchorEl={anchorEl1}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
          onClose={handlePopoverClose1}
          disableRestoreFocus
          TransitionComponent={Zoom}
        >
          <ItemPopover meal={d.meal1} />
        </Popover>
        {isSwitch && (
          <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
            <IOSSwitch
              sx={{ mt: 1 }}
              checked={isDisabled ? false : !!d.mealOrder1}
              onChange={e => onSwitchChange && onSwitchChange('mealOrder1', e.target.checked)}
              disabled={isDisabled}
            />
            <Typography sx={{ color: theme.palette.text.textSub, ml: 1, mt: 1 }}>{translatedSelect}</Typography>
          </Box>
        )}
      </Box>
      {/* MEAL 2 - Trưa */}
      <Box sx={{ flex: 2, py: 3, px: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box
          onMouseEnter={isDisabled ? undefined : handlePopoverOpen2}
          onMouseLeave={isDisabled ? undefined : handlePopoverClose2}
          aria-owns={open2 ? 'meal2-popover' : undefined}
          aria-haspopup="true"
          sx={{ cursor: isDisabled ? 'not-allowed' : 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LunchDiningIcon sx={{ color: theme.palette.primary.secondary, mr: 1 }} />
            <Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>{translatedMeal2Title}</Typography>
          </Box>
          {isDisabled && (
            <Typography sx={{ color: 'red', fontSize: '0.95rem', mb: 1 }}>
              {translatedCannotOrder}
            </Typography>
          )}
          <Typography sx={{ color: theme.palette.text.textSub, mb: 1 }}>{translatedMeal2Description}</Typography>
          <Typography sx={{ fontSize: '0.95rem', color: theme.palette.text.textSub }}>
            {translatedCalories} {d.meal2?.calories ?? '--'} | {translatedProtein} {d.meal2?.protein ?? '--'}g | {translatedCarbs}{' '}
            {d.meal2?.carbs ?? '--'}g | {translatedFat} {d.meal2?.fat ?? '--'}g
          </Typography>
          <Typography sx={{ fontSize: '0.95rem', color: theme.palette.text.textSub }}>
            {translatedPrice} {d.meal2?.price ? `${d.meal2.price}VNĐ` : '--'}
          </Typography>
        </Box>
        <Popover
          id="meal2-popover"
          sx={{ pointerEvents: 'none' }}
          open={!isDisabled && open2}
          anchorEl={anchorEl2}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
          onClose={handlePopoverClose2}
          disableRestoreFocus
          TransitionComponent={Zoom}
        >
          <ItemPopover meal={d.meal2} />
        </Popover>
        {isSwitch && (
          <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
            <IOSSwitch
              sx={{ mt: 1 }}
              checked={isDisabled ? false : !!d.mealOrder2}
              onChange={e => onSwitchChange && onSwitchChange('mealOrder2', e.target.checked)}
              disabled={isDisabled}
            />
            <Typography sx={{ color: theme.palette.text.textSub, ml: 1, mt: 1 }}>{translatedSelect}</Typography>
          </Box>
        )}
      </Box>
      {/* MEAL 3 - Tối */}
      <Box sx={{ flex: 2, py: 3, px: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box
          onMouseEnter={isDisabled ? undefined : handlePopoverOpen3}
          onMouseLeave={isDisabled ? undefined : handlePopoverClose3}
          aria-owns={open3 ? 'meal3-popover' : undefined}
          aria-haspopup="true"
          sx={{ cursor: isDisabled ? 'not-allowed' : 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <NightsStayIcon sx={{ color: theme.palette.info.main, mr: 1 }} />
            <Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>{translatedMeal3Title}</Typography>
          </Box>
          {isDisabled && (
            <Typography sx={{ color: 'red', fontSize: '0.95rem', mb: 1 }}>
              {translatedCannotOrder}
            </Typography>
          )}
          <Typography sx={{ color: theme.palette.text.textSub, mb: 1 }}>{translatedMeal3Description}</Typography>
          <Typography sx={{ fontSize: '0.95rem', color: theme.palette.text.textSub }}>
            {translatedCalories} {d.meal3?.calories ?? '--'} | {translatedProtein} {d.meal3?.protein ?? '--'}g | {translatedCarbs}{' '}
            {d.meal3?.carbs ?? '--'}g | {translatedFat} {d.meal3?.fat ?? '--'}g
          </Typography>
          <Typography sx={{ fontSize: '0.95rem', color: theme.palette.text.textSub }}>
            {translatedPrice} {d.meal3?.price ? `${d.meal3.price}VNĐ` : '--'}
          </Typography>
        </Box>
        <Popover
          id="meal3-popover"
          sx={{ pointerEvents: 'none' }}
          open={!isDisabled && open3}
          anchorEl={anchorEl3}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
          onClose={handlePopoverClose3}
          disableRestoreFocus
          TransitionComponent={Zoom}
        >
          <ItemPopover meal={d.meal3} />
        </Popover>
        {isSwitch && (
          <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
            <IOSSwitch
              sx={{ mt: 1 }}
              checked={isDisabled ? false : !!d.mealOrder3}
              onChange={e => onSwitchChange && onSwitchChange('mealOrder3', e.target.checked)}
              disabled={isDisabled}
            />
            <Typography sx={{ color: theme.palette.text.textSub, ml: 1, mt: 1 }}>{translatedSelect}</Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default ItemWeekPlan
