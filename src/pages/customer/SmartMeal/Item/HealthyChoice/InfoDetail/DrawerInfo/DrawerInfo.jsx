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
// import { ItemHealthy } from '~/apis/mockData'
import { selectCurrentMeal, clearCart } from '~/redux/meal/mealSlice'
import { fetchCart, createCartItem } from '~/redux/cart/cartSlice' // Sửa: import createCartItem
import { calcCustomTotal, getSuggestedMeals, getNutritionalAdvice, getSuggestionExplanation } from '~/utils/nutrition'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import PageviewIcon from '@mui/icons-material/Pageview'
import SuggestFood from './SuggestFood'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { createCustomMealAPI, addMealToCartAPI } from '~/apis/index' // Import API functions
import { toast } from 'react-toastify'
import Grid from '@mui/material/Grid'
import FoodCard from '~/components/FoodCard/FoodCard'
import CustomMealInfoModal from '~/components/Modals/InfoModal/CustomMealInfoModal'
import { useNavigate } from 'react-router-dom'
import { IMAGE_DEFAULT } from '~/utils/constants'

const DrawerInfo = ({ onClose, itemHealthy }) => {
  const [openInfoModal, setOpenInfoModal] = useState(false)

  const [isReviewing, setIsReviewing] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)
  const [savingMeal, setSavingMeal] = useState(false)
  const [orderMode, setOrderMode] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const theme = useTheme()
  const dispatch = useDispatch()
  const selected = useSelector(selectCurrentMeal)
  const currentCustomer = useSelector(state => state.customer.currentCustomer)
  const customerId = currentCustomer?.id || null
  const navigate = useNavigate()

  const translatedHealthyMeals = 'Healthy Meals Just For You'
  const translatedReviewSelections = 'Review My Selections'
  const translatedBalanced = 'Your meal is well-balanced!'
  const translatedCanOrder = 'You can now order your custom meal or review your choices.'
  const translatedGoToBuilder = 'Go to Builder'
  const translatedOrOrder = 'Or order your custom meal'
  const translatedCalories = 'Calories'
  const translatedProtein = 'Protein'
  const translatedCarbs = 'Carbs'
  const translatedFat = 'Fat'
  const translatedTotalPrice = 'Total Price:'
  const translatedOrderCustom = 'Order custom meal'
  const translatedSaveCustom = 'Save custom meal'
  const translatedAdding = 'Adding...'
  const translatedSaving = 'Saving...'
  const translatedFavoriteMix = 'My favorite mix with quantities'
  const translatedCustomMeal = 'your custom Meal'
  const translatedLoginToast = 'You need to log in to place an order!'
  const translatedSaveLoginToast = 'You need to log in to save the meal!'

  const customTotal = calcCustomTotal(selected)
  const suggestedMeals = getSuggestedMeals(customTotal, itemHealthy, selected)
  const nutritionalAdvice = getNutritionalAdvice(customTotal)
  const suggestionExplanation = getSuggestionExplanation(suggestedMeals, customTotal)
  const allSelectedItems = Object.values(selected).flat()

  const isBalanced = suggestedMeals.length === 0 && customTotal.calories > 0

  const totalPrice = allSelectedItems.reduce((sum, item) => sum + (item.price || 0), 0)

  const handleOrderCustom = () => {
    setOrderMode(true)
    setOpenInfoModal(true)
  }

  const handleSaveCustom = () => {
    setOpenInfoModal(true)
  }

  const mainProtein = selected.protein?.[0]
  const defaultImage = mainProtein?.image || IMAGE_DEFAULT.IMAGE_CUSTOM
  const handleModalSave = async ({ title, desc }) => {
    setOpenInfoModal(false)
    if (orderMode) {
      // ORDER FLOW
      if (!customerId) {
        toast.error(translatedLoginToast)
        setAddingToCart(false)
        setOrderMode(false)
        navigate('/login')
        return
      }
      setAddingToCart(true)
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
        dispatch(clearCart())
      } catch (error) {
        toast.error('Failed to add custom meal to cart. Please try again.' + error.message)
      } finally {
        setAddingToCart(false)
        setOrderMode(false)
      }
    } else {
      // SAVE FLOW giữ nguyên
      setSavingMeal(true)
      if (!customerId) {
        toast.error(translatedSaveLoginToast)
        setAddingToCart(false)
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
        onClose()
        toast.success(`Custom meal "${savedCustomMeal.title}" saved successfully!`)
        dispatch(clearCart())
      } catch (error) {
        toast.error('Failed to save custom meal. Please try again.')
      } finally {
        setSavingMeal(false)
      }
    }
  }

  const handleCloseDrawer = () => {
    onClose()
  }

  return (
    <Box
      sx={{
        p: 3,
        width: '100%',
        bgcolor: theme.palette.background.default,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%'
      }}
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
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
      <Box sx={{ flex: 1, overflowY: 'auto', mx: 2, mb: 2 }}>
        {isReviewing ? (
          // --- REVIEW VIEW ---
          <>
            <Box sx={{ mb: 2 }}>
              <Grid container spacing={2}>
                {allSelectedItems.map(item => (
                  <Grid size={{ xs: 6, sm: 4, md: 2 }} key={item.id}>
                    <FoodCard card={item} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </>
        ) : (
          // --- BUILDER VIEW ---
          <>
            {/* Always show review button if there are selected items */}
            {allSelectedItems.length > 0 && (
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  startIcon={<PageviewIcon />}
                  onClick={() => setIsReviewing(true)}
                  sx={{ borderRadius: 5 }}
                >
                  {translatedReviewSelections} ({allSelectedItems.length} items)
                </Button>
              </Box>
            )}

            {/* Show either balanced message or suggestions */}
            {isBalanced ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CheckCircleOutlineIcon sx={{ fontSize: 60, color: 'success.main' }} />
                <Typography variant="h6" sx={{ mt: 2, fontWeight: 'medium' }}>
                  {translatedBalanced}
                </Typography>
                <Typography sx={{ color: 'text.secondary', mb: 3 }}>
                  {translatedCanOrder}
                </Typography>
              </Box>
            ) : (
              // SUGGESTING STATE
              <>
                {nutritionalAdvice && (
                  <Typography sx={{ mb: 2, fontStyle: 'italic', color: 'text.secondary', textAlign: 'center' }}>
                    {nutritionalAdvice}
                  </Typography>
                )}
                <SuggestFood suggestedMeals={suggestedMeals} />

                {/* AI explanation button */}
                {suggestedMeals.length > 0 && (
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                    <Button
                      variant="outlined"
                      startIcon={<span>🤖</span>}
                      onClick={() => setShowExplanation(!showExplanation)}
                      sx={{
                        borderRadius: 5,
                        textTransform: 'none',
                        fontSize: '0.9rem',
                        px: 2
                      }}
                    >
                      {showExplanation ? 'Hide explanation' : 'Why these suggestions?'}
                    </Button>
                  </Box>
                )}

                {/* Show explanation */}
                {showExplanation && suggestionExplanation && (
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      bgcolor: 'background.paper',
                      borderRadius: 2,
                      border: `1px solid ${theme.palette.divider}`,
                      maxHeight: '300px',
                      overflowY: 'auto'
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        whiteSpace: 'pre-line',
                        lineHeight: 1.6,
                        fontFamily: 'monospace'
                      }}
                    >
                      {suggestionExplanation}
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </>
        )}
      </Box>

      {/* Sticky Custom Meal Section */}
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          position: 'sticky',
          bottom: 0,
          zIndex: 1
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
          {isReviewing && (
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => setIsReviewing(false)}
              sx={{ borderRadius: 5, color: theme.palette.text.primary, p: 1 }}
              aria-label="Back to Builder"
            >
              {translatedGoToBuilder}
            </Button>
          )}
        </Box>
        <Box
          sx={{
            width: '90%',
            height: '0.2rem',
            mx: 'auto',
            mb: 2,
            bgcolor: theme.palette.text.primary,
            borderRadius: 2
          }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
          <LocalOfferIcon sx={{ color: theme.palette.primary.secondary }} />
          <Typography variant="h5" sx={{ fontWeight: 'medium' }}>
            {translatedOrOrder}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
          <TrendingUpIcon sx={{ color: theme.palette.primary.secondary }} />
          <Typography variant="body1" sx={{ textAlign: 'center' }}>
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
            variant="contained"
            color="success"
            startIcon={<ShoppingCart />}
            sx={{ mt: 2, borderRadius: 5 }}
            onClick={handleOrderCustom}
            disabled={addingToCart}
            aria-label="Order custom meal"
          >
            {addingToCart ? translatedAdding : translatedOrderCustom}
          </Button>
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
  )
}

export default DrawerInfo