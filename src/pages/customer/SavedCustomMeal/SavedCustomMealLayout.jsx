import React, { useState, useEffect, useCallback } from 'react'
import { Box, Grid, Card, CardContent, CardMedia, Typography, Button, Skeleton } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { selectCustomerId } from '~/redux/user/customerSlice'
import { getCustomMealByIdAPI, deleteCustomMealAPI } from '~/apis'
import AppBar from '~/components/AppBar/AppBar'
import Footer from '~/components/Footer/Footer'
import theme from '~/theme'
import { setMealFromCustom, setMeal } from '~/redux/meal/mealSlice'
import { fetchCart, createCartItem } from '~/redux/cart/cartSlice'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import ShoppingCart from '@mui/icons-material/ShoppingCart'
import ConfirmModal from '~/components/Modals/ComfirmModal/ComfirmModal'

// Component nhỏ để dịch từng ingredient
const IngredientItem = ({ title }) => {
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
      {title}
    </Typography>
  )
}

// Skeleton component cho MealCard
const MealCardSkeleton = () => {
  return (
    <Card sx={{
      maxWidth: 345,
      height: '100%',
      borderRadius: 5,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Skeleton variant="rectangular" height={140} sx={{ borderRadius: '5px 5px 0 0' }} />
      <CardContent sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <Box>
          <Skeleton variant="text" height={28} width="80%" sx={{ mb: 1 }} />
          <Skeleton variant="text" height={20} width="60%" sx={{ mb: 2 }} />

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {[...Array(4)].map((_, index) => (
              <Skeleton key={index} variant="rounded" width={60} height={24} />
            ))}
          </Box>

          <Box sx={{ mb: 2 }}>
            {[...Array(4)].map((_, index) => (
              <Skeleton key={index} variant="text" height={16} width="90%" sx={{ mb: 0.5 }} />
            ))}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Skeleton variant="rectangular" height={36} width={80} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" height={36} width={80} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" height={36} width={40} sx={{ borderRadius: 1 }} />
        </Box>
      </CardContent>
    </Card>
  )
}

// Component riêng cho MealCard để sử dụng hooks
const MealCard = ({ meal, onAdjust, onAddToCart, isAddingToCart, onDelete }) => {

  const quantity = meal.quantity || 1
  const items = [
    { label: 'Calories', value: `${Math.round(meal.calories)}`, perUnit: `${Math.round(meal.calories / quantity)}` },
    { label: 'Protein', value: `${Math.round(meal.protein)}g`, perUnit: `${Math.round(meal.protein / quantity)}g` },
    { label: 'Carbs', value: `${Math.round(meal.carb)}g`, perUnit: `${Math.round(meal.carb / quantity)}g` },
    { label: 'Fat', value: `${Math.round(meal.fat)}g`, perUnit: `${Math.round(meal.fat / quantity)}g` }
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
        height="150"
        image={meal.image}
        alt={meal.title}
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
            {meal.title}
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
            {meal.description}
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
            {meal.price.toLocaleString()} VND
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
                Ingredients:
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

        {/* 2 nút trên */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}>
          <Button
            variant="contained"
            sx={{ borderRadius: 5 }}
            onClick={() => onAdjust(meal)}
          >
            Adjust
          </Button>

          <Button
            variant="contained"
            sx={{ borderRadius: 5 }}
            onClick={() => onDelete(meal)}
          >
            Delete
          </Button>
        </Box>

        {/* Nút Add to Cart chiếm hết phần còn lại */}
        <Button
          variant="contained"
          sx={{
            borderRadius: 5,
            backgroundColor: theme.colorSchemes.light.palette.primary.secondary,
            width: '100%',
            mt: 1
          }}
          onClick={() => onAddToCart(meal)}
          disabled={isAddingToCart}
          startIcon={<ShoppingCart />}
        >
          {isAddingToCart ? 'Adding...' : 'Add to Cart'}
        </Button>
      </CardContent>
    </Card>
  )
}

const SavedCustomMealLayout = () => {
  const [customMeals, setCustomMeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState({})
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [mealToDelete, setMealToDelete] = useState(null)
  const customerId = useSelector(selectCustomerId)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Component title với style đẹp như trang Menu
  const PageTitle = () => (
    <Box sx={{ textAlign: 'center', mb: 4 }}>
      <Typography
        variant="h1"
        align="center"
        sx={{
          fontSize: { xs: '2.5rem', md: '4rem' },
          fontWeight: 300,
          letterSpacing: '0.1em',
          mb: 2,
          color: theme.palette.text.primary
        }}
      >
        Choose <span style={{ fontWeight: 800, color: theme.palette.primary.secondary }}>Your Custom Meal</span>
      </Typography>
      <Box sx={{ width: '6rem', height: '0.4rem', bgcolor: theme.palette.primary.secondary, mx: 'auto', mb: 4 }} />
      <Typography
        variant="body1"
        align="center"
        sx={{ maxWidth: '48rem', mx: 'auto', mb: 6, fontSize: { xs: '1rem', md: '1.15rem' }, color: theme.palette.text.textSub }}
      >
        Choose your custom meal and adjust the ingredients to your liking.
      </Typography>
    </Box>
  )

  const fetchCustomMeals = useCallback(async () => {
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
  }, [customerId])

  useEffect(() => {
    fetchCustomMeals()
  }, [fetchCustomMeals])

  if (loading) return (
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
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Skeleton variant="text" height={60} width={400} sx={{ mx: 'auto', mb: 2 }} />
            <Skeleton variant="rectangular" width={96} height={4} sx={{ mx: 'auto', mb: 4 }} />
            <Skeleton variant="text" height={24} width={500} sx={{ mx: 'auto', mb: 2 }} />
          </Box>
          <Grid container spacing={2}>
            {[...Array(8)].map((_, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
                <MealCardSkeleton />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
      <Footer />
    </Box>
  )

  const handleAdjust = (meal) => {
    dispatch(setMealFromCustom(meal))
    dispatch(setMeal(meal))
    navigate('/saved-smart-meal-planner')
  }

  const handleAddToCart = async (meal) => {
    if (!customerId) {
      toast.error('Please log in to add to cart')
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
      toast.success('Custom meal added to cart successfully!')
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Failed to add custom meal to cart. Please try again.')
    } finally {
      setAddingToCart(prev => ({ ...prev, [meal.id]: false }))
    }
  }

  const handleDelete = (meal) => {
    setMealToDelete(meal)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!mealToDelete) return

    try {
      await deleteCustomMealAPI(mealToDelete.id)
      toast.success('Deleted successfully')
      // Load lại dữ liệu sau khi xóa
      await fetchCustomMeals()
      setDeleteModalOpen(false)
      setMealToDelete(null)
    } catch (error) {
      console.error('Error deleting custom meal:', error)
      toast.error('Failed to delete custom meal')
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
          <PageTitle />
          {customMeals.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '50vh',
                flexDirection: 'column'
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  textAlign: 'center',
                  color: 'text.secondary',
                  fontWeight: 500
                }}
              >
                No custom meals found.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {customMeals.slice().reverse().map((meal) => (
                <Grid size={{ xs: 12, sm: 6, md: 2, lg: 2 }} key={meal.id}>
                  <MealCard
                    meal={meal}
                    onAdjust={handleAdjust}
                    onAddToCart={handleAddToCart}
                    isAddingToCart={addingToCart[meal.id]}
                    onDelete={handleDelete}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
      <Footer />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setMealToDelete(null)
        }}
        onConfirm={confirmDelete}
        title="Delete Custom Meal"
        description={`Are you sure you want to delete "${mealToDelete?.title}"? This action cannot be undone.`}
        btnName="Delete"
      />
    </Box>
  )
}

export default SavedCustomMealLayout
