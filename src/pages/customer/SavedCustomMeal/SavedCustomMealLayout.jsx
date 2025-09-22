import React, { useState, useEffect } from 'react'
import { Box, Grid, Card, CardContent, CardMedia, Typography, Button } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { selectCustomerId } from '~/redux/user/customerSlice'
import { getCustomMealByIdAPI } from '~/apis'
import AppBar from '~/components/AppBar/AppBar'
import Footer from '~/components/Footer/Footer'
import theme from '~/theme'
import { useTranslation } from 'react-i18next'
import useTranslate from '~/hooks/useTranslate'
import { selectCurrentLanguage } from '~/redux/translations/translationsSlice'
import { setMealFromCustom, setMeal } from '~/redux/meal/mealSlice'
import { fetchCart, createCartItem } from '~/redux/cart/cartSlice'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import ShoppingCart from '@mui/icons-material/ShoppingCart'

// Component nhỏ để dịch từng ingredient
const IngredientItem = ({ title, currentLang }) => {
  const translatedTitle = useTranslate(title || '', currentLang)
  return (
    <Typography
      variant="caption"
      sx={{
        bgcolor: '#f5f5f5',
        px: 0.8,
        py: 0.3,
        borderRadius: 1,
        fontSize: '0.65rem'
      }}
    >
      {translatedTitle}
    </Typography>
  )
}

// Component riêng cho MealCard để sử dụng hooks
const MealCard = ({ meal, onAdjust, onAddToCart, isAddingToCart }) => {
  const { t } = useTranslation()
  const currentLang = useSelector(selectCurrentLanguage)
  
  // Dịch title và description ở đây (bên trong component)
  const translatedTitle = useTranslate(meal.title || '', currentLang)
  const translatedDescription = useTranslate(meal.description || '', currentLang)
  const translatedPrice = useTranslate('Price:', currentLang)
  const translatedAdjust = useTranslate('Adjust', currentLang)
  const translatedAddToCart = useTranslate('Add to Cart', currentLang)
  const translatedAdding = useTranslate('Adding...', currentLang)

  const quantity = meal.quantity || 1
  const items = [
    { label: t('nutrition.calories'), value: `${Math.round(meal.calories)}`, perUnit: `${Math.round(meal.calories / quantity)}` },
    { label: t('nutrition.protein'), value: `${Math.round(meal.protein)}g`, perUnit: `${Math.round(meal.protein / quantity)}g` },
    { label: t('nutrition.carbs'), value: `${Math.round(meal.carb)}g`, perUnit: `${Math.round(meal.carb / quantity)}g` },
    { label: t('nutrition.fat'), value: `${Math.round(meal.fat)}g`, perUnit: `${Math.round(meal.fat / quantity)}g` }
  ]

  return (
    <Card sx={{
      maxWidth: 345,
      height: '100%',
      borderRadius: 5,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <CardMedia
        component="img"
        height="140"
        image={meal.image}
        alt={translatedTitle}
      />
      <CardContent sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <Box>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              wordBreak: 'break-word',
              minHeight: '2.5em',
              lineHeight: 1.2
            }}
          >
            {translatedTitle}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '3.6em',
              lineHeight: 1.2,
              mb: 1
            }}
          >
            {translatedDescription}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              wordBreak: 'break-all',
              minHeight: '1.2em'
            }}
          >
            {translatedPrice} {meal.price.toLocaleString()} VND
          </Typography>

          {/* Nutrition Info */}
          <Box sx={{ mt: 2 }}>
            <Box sx={{ borderBottom: '1.5px dashed' }}></Box>
            <Box sx={{ mt: 1.5, mb: 1.5 }}>
              <Grid
                container
                spacing={1}
                sx={{
                  textAlign: 'center',
                  justifyContent: 'center'
                }}
              >
                {items.map((nutritionItem, index) => (
                  <Grid size={{ xs: 3 }} key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="h7" fontWeight="bold" sx={{ fontSize: '0.9rem', fontWeight: 700, lineHeight: 1.1 }}>
                      {nutritionItem.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.2, fontWeight: 400, fontSize: '0.7rem' }}>
                      {nutritionItem.label}
                    </Typography>
                    {quantity > 1 && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.1, fontSize: '0.6rem' }}>
                        ({nutritionItem.perUnit} per unit)
                      </Typography>
                    )}
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>

          {/* Ingredients */}
          {meal.details && meal.details.length > 0 && (
            <Box sx={{ mt: 1.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, fontSize: '0.8rem' }}>
                {t('cart.ingredients')}
              </Typography>
              <Box sx={{
                minHeight: '2.4em',
                maxHeight: '2.4em',
                overflow: 'hidden'
              }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.3 }}>
                  {meal.details.slice(0, 4).map((detail) => (
                    <IngredientItem
                      key={detail.id}
                      title={detail.title}
                      currentLang={currentLang}
                    />
                  ))}
                  {meal.details.length > 4 && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        px: 0.8,
                        py: 0.3,
                        fontSize: '0.65rem'
                      }}
                    >
                      +{meal.details.length - 4} more
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}>
          <Button
            variant="contained"
            sx={{ borderRadius: 5 }}
            onClick={() => onAdjust(meal)}
          >
            {translatedAdjust}
          </Button>
          <Button
            variant="contained"
            sx={{
              borderRadius: 5,
              backgroundColor: theme.colorSchemes.light.palette.primary.secondary
            }}
            onClick={() => onAddToCart(meal)}
            disabled={isAddingToCart}
            startIcon={<ShoppingCart />}
          >
            {isAddingToCart ? translatedAdding : translatedAddToCart}
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}

const SavedCustomMealLayout = () => {
  const [customMeals, setCustomMeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState({})
  const customerId = useSelector(selectCustomerId)
  const currentLang = useSelector(selectCurrentLanguage)
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Translations
  const translatedLoginRequired = useTranslate('Bạn cần đăng nhập để đặt món!', currentLang)
  const translatedAddSuccess = useTranslate('Custom meal added to cart successfully!', currentLang)
  const translatedAddFailed = useTranslate('Failed to add custom meal to cart. Please try again.', currentLang)
  const translatedSavedCustomMeals = useTranslate('Saved Custom Meals', currentLang)
  const translatedNoMealsFound = useTranslate('No custom meals found.', currentLang)
  const translatedLoading = useTranslate('Loading...', currentLang)

  useEffect(() => {
    const fetchCustomMeals = async () => {
      if (customerId) {
        try {
          const data = await getCustomMealByIdAPI(customerId)
          const mealsArray = Array.isArray(data) ? data : (data ? [data] : [])
          setCustomMeals(mealsArray)
        } catch (error) {
          console.error('Error fetching custom meals:', error)
          setCustomMeals([])
        }
      }
      setLoading(false)
    }
    fetchCustomMeals()
  }, [customerId])

  if (loading) return <Typography>{translatedLoading}</Typography>

  const handleAdjust = (meal) => {
    dispatch(setMealFromCustom(meal))
    dispatch(setMeal(meal))
    navigate('/saved-smart-meal-planner')
  }

  const handleAddToCart = async (meal) => {
    if (!customerId) {
      toast.error(translatedLoginRequired)
      navigate('/login')
      return
    }

    setAddingToCart(prev => ({ ...prev, [meal.id]: true }))

    try {
      const cartRequestData = {
        isCustom: true,
        customMealId: meal.id,
        quantity: 1,
        unitPrice: meal.price,
        totalPrice: meal.price,
        title: meal.title || 'My Custom Bowl',
        description: meal.description || 'Custom meal with selected ingredients',
        calories: Math.round(meal.calories),
        protein: Math.round(meal.protein),
        carbs: Math.round(meal.carb),
        fat: Math.round(meal.fat),
        itemType: 'CUSTOM_MEAL',
        image: meal.image
      }

      await dispatch(createCartItem({ customerId, itemData: cartRequestData }))
      await dispatch(fetchCart(customerId))
      toast.success(translatedAddSuccess)
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error(translatedAddFailed)
    } finally {
      setAddingToCart(prev => ({ ...prev, [meal.id]: false }))
    }
  }

  return (
    <Box>
      <AppBar />
      <Box
        sx={{
          mt: theme.fitbowl.appBarHeight,
          backgroundColor: theme.colorSchemes.light.palette.background.default,
          minHeight: '100vh',
          px: { xs: 0, sm: 0, md: 2 },
          py: { xs: 1, sm: 2, md: 3 }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h4" gutterBottom>{translatedSavedCustomMeals}</Typography>
          {customMeals.length === 0 ? (
            <Typography>{translatedNoMealsFound}</Typography>
          ) : (
            <Grid container spacing={2}>
              {customMeals.map((meal) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={meal.id}>
                  <MealCard 
                    meal={meal}
                    onAdjust={handleAdjust}
                    onAddToCart={handleAddToCart}
                    isAddingToCart={addingToCart[meal.id]}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
      <Footer />
    </Box>
  )
}

export default SavedCustomMealLayout
