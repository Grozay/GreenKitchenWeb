import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentMeal, selectMealTotals, clearCart } from '~/redux/meal/mealSlice'
import { setSuggestedSauces } from '~/redux/meal/suggestSauceSlice'
import { getSuggestedSauces } from '~/utils/nutrition'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Drawer from '@mui/material/Drawer'
import theme from '~/theme'
import DrawerInfoMobile from '~/pages/customer/SmartMeal/Item/HealthyChoice/InfoDetail/DrawerInfo/DrawerInfoMobile'
import SauceSuggestionDialog from '~/pages/customer/SmartMeal/Item/HealthyChoice/DialogSauces/SauceSuggestionDialog'
const HealthyChoiceMobile = ({ itemHealthy }) => {
  const dispatch = useDispatch()
  const selectedItems = useSelector(selectCurrentMeal)
  const { totalCalories, totalProtein, totalCarbs, totalFat } = useSelector(selectMealTotals)
  const [openDrawer, setOpenDrawer] = useState(false)
  const [openSauceDialog, setOpenSauceDialog] = useState(false)
  const [hasSuggestedSauce, setHasSuggestedSauce] = useState(false)
  const suggestedSauces = useSelector(state => state.suggestSauce.suggestedSauces)
  const allSauces = itemHealthy.sauce

  const items = [
    { label: 'Calories', value: `${Math.round(totalCalories)}` },
    { label: 'Protein', value: `${Math.round(totalProtein)}g` },
    { label: 'Carbs', value: `${Math.round(totalCarbs)}g` },
    { label: 'Fat', value: `${Math.round(totalFat)}g` }
  ]

  // Reset khi đổi protein
  useEffect(() => {
    setHasSuggestedSauce(false)
  }, [selectedItems.protein])

  // Gợi ý sốt
  const handleSuggestSauce = () => {
    let sauces = []
    if (selectedItems.protein.length > 0) {
      selectedItems.protein.forEach(protein => {
        sauces = [
          ...sauces,
          ...getSuggestedSauces(protein, allSauces)
        ]
      })
      sauces = sauces.filter((s, i, arr) => arr.findIndex(x => x.id === s.id) === i)
      dispatch(setSuggestedSauces(sauces))
    } else {
      dispatch(setSuggestedSauces([]))
    }
    setOpenSauceDialog(true)
  }

  // const handleClearSelections = () => {
  //   dispatch(clearCart())
  // }

  // const handleNutritionClick = () => {
  //   setOpenDrawer(true)
  // }

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
      <SauceSuggestionDialog
        open={openSauceDialog}
        sauces={suggestedSauces}
        selectedSauceIds={[]}
        onOk={() => {
          setHasSuggestedSauce(true)
          setOpenSauceDialog(false)
        }}
        onOrderNow={() => {
          setHasSuggestedSauce(true)
          setOpenSauceDialog(false)
          setOpenDrawer(true)
        }}
        onClose={() => setOpenSauceDialog(false)}
      />
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
          onClick={() => {
            if (!hasSuggestedSauce) handleSuggestSauce()
            else setOpenDrawer(true)
          }}
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
          {hasSuggestedSauce ? 'Order Now' : 'Suggest Sauce'}
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
        <DrawerInfoMobile selectedItems={items} onClose={handleCloseDrawer} itemHealthy={itemHealthy} />
      </Drawer>
    </Box>
  )
}

export default HealthyChoiceMobile