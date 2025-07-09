import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { selectMealTotals } from '~/redux/meal/mealSlice'
import { useState } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Drawer from '@mui/material/Drawer'
import theme from '~/theme'
import { clearCart } from '~/redux/meal/mealSlice'
import DrawerInfoMobile from '~/pages/customer/SmartMeal/Item/HealthyChoice/InfoDetail/DrawerInfo/DrawerInfoMobile'

const HealthyChoiceMobile = () => {
  const dispatch = useDispatch()
  const { totalCalories, totalProtein, totalCarbs, totalFat } = useSelector(selectMealTotals)
  const [openDrawer, setOpenDrawer] = useState(false)

  const items = [
    { label: 'Calories', value: `${Math.round(totalCalories)}` },
    { label: 'Protein', value: `${Math.round(totalProtein)}g` },
    { label: 'Carbs', value: `${Math.round(totalCarbs)}g` },
    { label: 'Fat', value: `${Math.round(totalFat)}g` }
  ]

  const handleClearSelections = () => {
    dispatch(clearCart())
  }

  const handleNutritionClick = () => {
    setOpenDrawer(true)
  }

  const handleCloseDrawer = () => {
    setOpenDrawer(false)
  }

  return (
    <Box sx={{
      position: 'sticky',
      bottom: 0,
      left: 0,
      right: 0,
      width: '100%',
      backgroundColor: 'white',
      boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
      borderTop: '1px solid',
      borderColor: 'divider',
      zIndex: 1200,
      p: 2,
      boxSizing: 'border-box'
    }}>
      <Grid
        container
        spacing={2}
        sx={{
          textAlign: 'center',
          width: '100%',
          m: 0,
          '& .MuiGrid-item': {
            padding: '0 8px',
            flexBasis: '25%',
            maxWidth: '25%',
            flexGrow: 1
          }
        }}
      >
        {items.map((item, index) => (
          <Grid size={{ xs: 3 }} key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1.1rem', fontWeight: 500, lineHeight: 1.2 }}>
              {item.value}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontWeight: 400, fontSize: '0.75rem' }}>
              {item.label}
            </Typography>
          </Grid>
        ))}
      </Grid>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mt: 2,
        gap: 1
      }}>
        <Box
          onClick={handleNutritionClick}
          sx={{
            flex: 1,
            py: 1,
            px: 2,
            borderRadius: 5,
            cursor: 'pointer',
            textAlign: 'center',
            color: 'white',
            bgcolor: theme.palette.primary.secondary,
            fontWeight: 500,
            fontSize: '0.875rem',
            '&:hover': {
              bgcolor: 'rgba(0, 99, 76, 0.9)'
            }
          }}
        >
          Order Now
        </Box>
      </Box>
      <Drawer
        anchor="bottom"
        open={openDrawer}
        onClose={handleCloseDrawer}
        ModalProps={{
          keepMounted: true
        }}
        PaperProps={{
          role: 'dialog',
          'aria-labelledby': 'drawer-title',
          sx: { overflow: 'auto' }
        }}
      >
        <DrawerInfoMobile selectedItems={items} onClose={handleCloseDrawer} />
      </Drawer>
    </Box>
  )
}

export default HealthyChoiceMobile