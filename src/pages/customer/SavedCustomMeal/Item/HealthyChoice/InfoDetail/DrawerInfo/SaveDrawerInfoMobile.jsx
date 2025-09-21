import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import SaveIcon from '@mui/icons-material/Save'
import ShoppingCart from '@mui/icons-material/ShoppingCart'
import { useTheme } from '@mui/material'
import { selectCurrentMeal, clearCart } from '~/redux/meal/mealSlice'
import { fetchCart, createCartItem } from '~/redux/cart/cartSlice' // Sửa: import createCartItem
import { calcCustomTotal, getSuggestedMeals, getNutritionalAdvice } from '~/utils/nutrition'
import { createCustomMealAPI, updateCustomMealAPI } from '~/apis/index'
import { toast } from 'react-toastify'
import Grid from '@mui/material/Grid'
import FoodCard from '~/components/FoodCard/FoodCard'
import CustomMealInfoModal from '~/components/Modals/InfoModal/CustomMealInfoModal'
import { useNavigate } from 'react-router-dom'
import { IMAGE_DEFAULT } from '~/utils/constants'
import useTranslate from '~/hooks/useTranslate'
import { selectCurrentLanguage } from '~/redux/translations/translationsSlice'
import { useTranslation } from 'react-i18next'

const SaveDrawerInfoMobile = ({ onClose, itemHealthy }) => {
  console.log('Render SaveDrawerInfoMobile')
  const [isReviewing, setIsReviewing] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)
  const [savingMeal, setSavingMeal] = useState(false)
  const [openInfoModal, setOpenInfoModal] = useState(false)
  const [orderMode, setOrderMode] = useState(false)
  const dispatch = useDispatch()
  const theme = useTheme()
  const selected = useSelector(selectCurrentMeal)
  const currentCustomer = useSelector(state => state.customer.currentCustomer)
  const customerId = currentCustomer?.id || null // Sửa: lấy customerId động
  const customTotal = calcCustomTotal(selected)
  const suggestedMeals = getSuggestedMeals(customTotal, itemHealthy, selected)
  const nutritionalAdvice = getNutritionalAdvice(customTotal)
  const allSelectedItems = Object.values(selected).flat()
  const currentLang = useSelector(selectCurrentLanguage)
  const { t } = useTranslation()

  const translatedHealthyMeals = useTranslate('Healthy Meals Just For You', currentLang)
  const translatedReviewSelections = useTranslate('Review My Selections', currentLang)
  const translatedBalanced = useTranslate('Your meal is well-balanced!', currentLang)
  const translatedCanOrder = useTranslate('You can now order your custom meal or review your choices.', currentLang)
  const translatedClearSelections = useTranslate('Clear Selections', currentLang)
  const translatedOrOrder = useTranslate('Or order your custom meal', currentLang)
  const translatedCalories = t('nutrition.calories')
  const translatedProtein = t('nutrition.protein')
  const translatedCarbs = t('nutrition.carbs')
  const translatedFat = t('nutrition.fat')
  const translatedTotalPrice = useTranslate('Total Price:', currentLang)
  const translatedFavoriteMix = useTranslate('My favorite mix with quantities', currentLang)
  const translatedCustomMeal = useTranslate('your custom Meal', currentLang)
  const translatedAdding = useTranslate('Adding...', currentLang)
  const translatedSaving = useTranslate('Saving...', currentLang)
  const translatedSaveCustom = useTranslate('Save custom meal', currentLang)
  const meal = useSelector(state => state.meal.meal) // Lấy meal từ Redux
  const totalPrice = allSelectedItems.reduce((sum, item) => sum + (item.price || 0), 0)
    const translatedLoginToast = useTranslate('You need to log in to place an order!', currentLang)
  const translatedSaveLoginToast = useTranslate('You need to log in to save the meal!', currentLang)
  const handleOrderCustom = () => {
    setOrderMode(true)
    setOpenInfoModal(true)
  }

  const handleSaveCustom = () => {
    setOrderMode(false)
    setOpenInfoModal(true)
  }

  const mainProtein = selected.protein?.[0]
  const defaultImage = mainProtein?.image || IMAGE_DEFAULT.IMAGE_CUSTOM

  const navigate = useNavigate()

  const handleModalSave = async ({ title, desc }) => {
    setOpenInfoModal(false)
    if (orderMode) {
      // ORDER FLOW (giữ nguyên)
      if (!customerId) {
        toast.error(translatedLoginToast)
        setOrderMode(false)
        navigate('/login')
        return
      }
      try {
        const customMealData = {
          customerId: customerId,
          title: title || translatedFavoriteMix,
          description: desc || translatedCustomMeal,
          calories: Math.round(customTotal.calories),
          protein: Math.round(customTotal.protein),
          carb: Math.round(customTotal.carbs),
          fat: Math.round(customTotal.fat),
          price: totalPrice,
          image: defaultImage,
          proteins: selected.protein?.map(item => ({
            ingredientId: item.id,
            quantity: item.quantity
          })) || [],
          carbs: selected.carbs?.map(item => ({
            ingredientId: item.id,
            quantity: item.quantity
          })) || [],
          sides: selected.side?.map(item => ({
            ingredientId: item.id,
            quantity: item.quantity
          })) || [],
          sauces: selected.sauce?.map(item => ({
            ingredientId: item.id,
            quantity: item.quantity
          })) || []
        }
        const savedCustomMeal = await createCustomMealAPI(customMealData)

        const cartRequestData = {
          isCustom: true,
          customMealId: savedCustomMeal.id,
          quantity: 1,
          unitPrice: totalPrice,
          totalPrice: totalPrice,
          title: savedCustomMeal.name || 'My Custom Bowl',
          description: savedCustomMeal.description || 'Custom meal with selected ingredients',
          calories: Math.round(customTotal.calories),
          protein: Math.round(customTotal.protein),
          carbs: Math.round(customTotal.carbs),
          fat: Math.round(customTotal.fat),
          itemType: 'CUSTOM_MEAL',
          image: savedCustomMeal.image || defaultImage
        }

        await dispatch(createCartItem({ customerId, itemData: cartRequestData }))
        await dispatch(fetchCart(customerId))
        onClose()
        toast.success('Custom meal added to cart successfully!')
      } catch (error) {
        toast.error('Failed to add custom meal to cart. Please try again.' + error.message)
      } finally {
        setOrderMode(false)
      }
    } else {
      // SAVE/UPDATE FLOW
      setSavingMeal(true)
      if (!customerId) {
        toast.error(translatedSaveLoginToast)
        setSavingMeal(false)
        navigate('/login')
        return
      }
      try {
        const customMealData = {
          customerId: customerId,
          title: title || translatedFavoriteMix,
          description: desc || translatedCustomMeal,
          calories: Math.round(customTotal.calories),
          protein: Math.round(customTotal.protein),
          carb: Math.round(customTotal.carbs),
          fat: Math.round(customTotal.fat),
          price: totalPrice,
          image: defaultImage,
          proteins: selected.protein?.map(item => ({
            ingredientId: item.id,
            quantity: item.quantity
          })) || [],
          carbs: selected.carbs?.map(item => ({
            ingredientId: item.id,
            quantity: item.quantity
          })) || [],
          sides: selected.side?.map(item => ({
            ingredientId: item.id,
            quantity: item.quantity
          })) || [],
          sauces: selected.sauce?.map(item => ({
            ingredientId: item.id,
            quantity: item.quantity
          })) || []
        }

        if (meal?.id) {
          // UPDATE EXISTING MEAL
          await updateCustomMealAPI(meal.id, customMealData)
          navigate('/saved-custom-meals')
          clearCart()
          toast.success(`Custom meal "${title}" updated successfully!`)
        } else {
          // CREATE NEW MEAL
          await createCustomMealAPI(customMealData)
          toast.success(`Custom meal "${title}" saved successfully!`)
        }
        onClose()
      } catch (error) {
        toast.error('Failed to save/update custom meal. Please try again.')
      } finally {
        setSavingMeal(false)
      }
    }
  }

  const handleClearSelections = () => {
    dispatch(clearCart())
  }


  const handleCloseDrawer = () => {
    onClose()
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: 'rgba(0,0,0,0.5)',
        zIndex: 1300,
        display: 'flex',
        alignItems: 'flex-end'
      }}
      onClick={handleCloseDrawer}
    >
      <Box
        sx={{
          p: 3,
          width: '100%',
          bgcolor: theme.palette.background.default,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '80%',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          maxHeight: '90%',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="drawer-title"
      >
        <CustomMealInfoModal
          open={openInfoModal}
          onClose={() => {
            setOpenInfoModal(false)
            setOrderMode(false)
          }}
          onSave={handleModalSave}
          defaultTitle={mainProtein ? 'My Custom Bowl' : ''}
          defaultDesc="Custom meal with selected ingredients"
        />
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SearchIcon sx={{ color: theme.palette.primary.secondary }} />
              <Typography id="drawer-title" variant="h6" sx={{ fontWeight: 'medium' }}>
                {translatedHealthyMeals}
              </Typography>
            </Box>
            <Box
              sx={{
                width: '10rem',
                height: '0.2rem',
                bgcolor: theme.palette.primary.secondary,
                borderRadius: 2
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'flex-end' }}>
            <IconButton
              onClick={handleCloseDrawer}
              aria-label="Close drawer"
              sx={{
                color: theme.palette.text.primary,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                  color: theme.palette.text.primary
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Scrollable Content */}
        <Box sx={{ flex: 1, overflowY: 'auto', mx: 2, mb: 2, pt: 2 }}>
          <Box sx={{ mb: 2 }}>
            <Grid container spacing={2}>
              {allSelectedItems.map(item => (
                <Grid size={{ xs: 6, sm: 4, md: 2 }} key={item.id}>
                  <FoodCard card={item} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>

        {/* Sticky Custom Meal Section */}
        <Box
          sx={{
            borderRadius: 2,
            position: 'sticky',
            bottom: 0,
            zIndex: 1,
            bgcolor: theme.palette.background.default
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 1.5 }}>
            <Button
              variant="outlined"
              onClick={handleClearSelections}
              sx={{
                borderRadius: 5,
                color: theme.palette.text.primary,
                borderColor: theme.palette.text.primary,
                fontWeight: 400,
                '&:hover': {
                  bgcolor: '#00000010'
                }
              }}
              aria-label="Clear selections"
            >
              {translatedClearSelections}
            </Button>
          </Box>
          <Box
            sx={{
              width: '10rem',
              height: '0.2rem',
              mx: 'auto',
              mb: 1.5,
              bgcolor: theme.palette.text.primary,
              borderRadius: 2
            }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 1.5 }}>
            <LocalOfferIcon sx={{ color: theme.palette.primary.secondary }} />
            <Typography variant="h5" sx={{ fontWeight: 'medium' }}>
              {translatedOrOrder}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 1.5 }}>
            <TrendingUpIcon sx={{ color: theme.palette.primary.secondary }} />
            <Typography
              variant="body1"
              sx={{ textAlign: 'center', fontSize: { xs: '0.875rem', sm: '1rem' }, whiteSpace: 'nowrap' }}
            >
              {translatedCalories} {Math.round(customTotal.calories)} kcal | {translatedProtein} {Math.round(customTotal.protein)}g | {translatedCarbs}{' '}
              {Math.round(customTotal.carbs)}g | {translatedFat} {Math.round(customTotal.fat)}g
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.primary.secondary }}>
              {translatedTotalPrice} {totalPrice.toLocaleString()} VNĐ
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="outlined"
              color="success"
              startIcon={<SaveIcon />}
              sx={{ mt: 2, borderRadius: 5 }}
              onClick={handleSaveCustom}
              disabled={savingMeal}
              aria-label="Save custom meal"
            >
              {savingMeal ? translatedSaving : translatedSaveCustom}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default SaveDrawerInfoMobile