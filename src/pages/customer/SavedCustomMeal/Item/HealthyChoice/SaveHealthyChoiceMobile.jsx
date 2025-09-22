import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentMeal, selectMealTotals, clearCart } from '~/redux/meal/mealSlice'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Drawer from '@mui/material/Drawer'
import theme from '~/theme'
import SauceSuggestionDialog from '~/pages/customer/SmartMeal/Item/HealthyChoice/DialogSauces/SauceSuggestionDialog'
import useTranslate from '~/hooks/useTranslate'
import { selectCurrentLanguage } from '~/redux/translations/translationsSlice'
import { useTranslation } from 'react-i18next'
import SaveDrawerInfoMobile from '~/pages/customer/SavedCustomMeal/Item/HealthyChoice/InfoDetail/DrawerInfo/SaveDrawerInfoMobile' // Thay SaveDrawerInfoMobile
const SaveHealthyChoiceMobile = ({ itemHealthy }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const selectedItems = useSelector(selectCurrentMeal)
  const { totalCalories, totalProtein, totalCarbs, totalFat } = useSelector(selectMealTotals)
  const currentLang = useSelector(selectCurrentLanguage)
  const [openDrawer1, setOpenDrawer1] = useState(false)
  const [openSauceDialog, setOpenSauceDialog] = useState(false)
  const [hasSuggestedSauce, setHasSuggestedSauce] = useState(false)
  const suggestedSauces = useSelector(state => state.suggestSauce.suggestedSauces)
  const allSauces = itemHealthy.sauce

  const translatedCalories = t('nutrition.calories')
  const translatedProtein = t('nutrition.protein')
  const translatedCarbs = t('nutrition.carbs')
  const translatedFat = t('nutrition.fat')
  const translatedSavedMeal = useTranslate('Saved your custom meal', currentLang)
  // const translatedOrderNow = useTranslate('Order Now', currentLang)

  const items = [
    { label: translatedCalories, value: `${Math.round(totalCalories)}` },
    { label: translatedProtein, value: `${Math.round(totalProtein)}g` },
    { label: translatedCarbs, value: `${Math.round(totalCarbs)}g` },
    { label: translatedFat, value: `${Math.round(totalFat)}g` }
  ]

  // Reset khi đổi protein
  useEffect(() => {
    setHasSuggestedSauce(false)
  }, [selectedItems.protein])


  // const handleClearSelections = () => {
  //   dispatch(clearCart())
  // }

  // const handleNutritionClick = () => {
  //   setOpenDrawer(true)
  // }

  const handleCloseDrawer1 = () => {
    setOpenDrawer1(false)
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
          setOpenDrawer1(true)
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
            setOpenDrawer1(true)
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
          {translatedSavedMeal}
        </Box>
      </Box>
      <Drawer
        anchor="bottom"
        open={openDrawer1}
        onClose={handleCloseDrawer1}
        ModalProps={{
          keepMounted: true
        }}
        PaperProps={{
          role: 'dialog',
          'aria-labelledby': 'drawer-title',
          sx: { overflow: 'auto' }
        }}
      >
        <SaveDrawerInfoMobile selectedItems={items} onClose={handleCloseDrawer1} itemHealthy={itemHealthy} />
      </Drawer>
    </Box>
  )
}

export default SaveHealthyChoiceMobile