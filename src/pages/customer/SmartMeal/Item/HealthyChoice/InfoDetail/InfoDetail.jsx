import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import { useSelector } from 'react-redux'
import { selectMealTotals } from '~/redux/meal/mealSlice'
import { useDispatch } from 'react-redux'
import { clearCart } from '~/redux/meal/mealSlice'
import theme from '~/theme'
import { Drawer } from '@mui/material'
import DrawerInfo from './DrawerInfo/DrawerInfo'
import { selectSuggestedSauces } from '~/redux/meal/suggestSauceSlice'
import SauceSuggestionDialog from '../DialogSauces/SauceSuggestionDialog'
import { getSuggestedSauces } from '~/utils/nutrition'
import { setSuggestedSauces } from '~/redux/meal/suggestSauceSlice'
import { selectCurrentMeal } from '~/redux/meal/mealSlice'

const InfoDetail = ({ itemHealthy }) => {
  const dispatch = useDispatch()
  const suggestedSauces = useSelector(selectSuggestedSauces)
  const [openSauceDialog, setOpenSauceDialog] = useState(false)
  const [hasSuggestedSauce, setHasSuggestedSauce] = useState(false)
  const { totalCalories, totalProtein, totalCarbs, totalFat } = useSelector(selectMealTotals)
  const [openDrawer, setOpenDrawer] = useState(false)
  const selectedItems = useSelector(selectCurrentMeal)
  const allSauces = itemHealthy.sauce

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

  useEffect(() => {
    setHasSuggestedSauce(false)
  }, [selectedItems.protein])

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

  return (
    <Box>
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
          handleNutritionClick()
        }}
        onClose={() => setOpenSauceDialog(false)}
      />
      <Grid
        container
        spacing={2}
        sx={{
          textAlign: 'center',
          py: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          mt: 2,
          pt: 3
        }}
      >
        {items.map((item, index) => (
          <Grid size={{ xs: 6, sm: 3 }} key={index}>
            <Box>
              <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1.2rem', fontWeight: 500 }}>
                {item.value}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontWeight: 400 }}>
                {item.label}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
      <Box sx={{
        mx: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box onClick={handleClearSelections} sx={{
          py: 1,
          px: 4,
          borderRadius: 5,
          maxWidth: 'fit-content',
          cursor: 'pointer',
          textAlign: 'center',
          color: theme.palette.primary.text,
          fontWeight: 400,
          fontSize: '1rem',
          '&:hover': {
            bgcolor: '#00000010'
          }
        }}>
          Clear Selections
        </Box>
        <Box
          onClick={() => {
            if (!hasSuggestedSauce) handleSuggestSauce()
            else handleNutritionClick()
          }}
          sx={{
            py: 1,
            px: 4,
            borderRadius: 5,
            maxWidth: 'fit-content',
            cursor: 'pointer',
            textAlign: 'center',
            color: 'white',
            bgcolor: theme.palette.primary.secondary,
            fontWeight: 400,
            fontSize: '1rem',
            '&:hover': {
              bgcolor: 'rgba(0, 99, 76, 0.8)'
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
        <DrawerInfo selectedItems={items} onClose={handleCloseDrawer} itemHealthy={itemHealthy} />
      </Drawer>
    </Box>
  )
}

export default InfoDetail