import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import AppBar from '~/components/AppBar/AppBar'
import Footer from '~/components/Footer/Footer'
import theme from '~/theme'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { selectCartItems, selectCartTotalNutrition, updateCartItemQuantity, removeFromCart } from '~/redux/order/orderSlice'
import CartEmpty from './CartEmpty/CartEmpty'
import ListItemCart from './ListItemCart/ListItemCart'

const Cart = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  // Redux selectors
  const cartItems = useSelector(selectCartItems)
  const totalNutrition = useSelector(selectCartTotalNutrition)

  const handleBackToMenu = () => {
    navigate('/menu')
  }

  const updateQuantity = (cartId, newQuantity) => {
    dispatch(updateCartItemQuantity({ cartId, quantity: newQuantity }))
  }

  const removeItem = (cartId) => {
    dispatch(removeFromCart(cartId))
  }

  const calculateItemNutrition = (item) => {
    const mealItem = item.mealItem
    let totalCalories = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0

    if (item.isCustom && mealItem) {
      Object.values(mealItem).forEach(category => {
        if (Array.isArray(category)) {
          category.forEach(food => {
            totalCalories += (food.calories || 0) * (food.quantity || 1)
            totalProtein += (food.protein || 0) * (food.quantity || 1)
            totalCarbs += (food.carbs || 0) * (food.quantity || 1)
            totalFat += (food.fat || 0) * (food.quantity || 1)
          })
        }
      })
    } else if (item.nutrition) {
      totalCalories = item.nutrition.calories || 0
      totalProtein = item.nutrition.protein || 0
      totalCarbs = item.nutrition.carbs || 0
      totalFat = item.nutrition.fat || 0
    } else {
      totalCalories = item.calories || 0
      totalProtein = item.protein || 0
      totalCarbs = item.carbs || 0
      totalFat = item.fat || 0
    }

    return {
      calories: totalCalories * item.quantity,
      protein: totalProtein * item.quantity,
      carbs: totalCarbs * item.quantity,
      fat: totalFat * item.quantity
    }
  }
  return (
    <Box>
      <AppBar />
      <Box sx={{ mt: theme.fitbowl.appBarHeight }}>
        <Box sx={{ mx: 2 }}>
          <Box sx={{ pt: 2, pb: 1, ml: 2 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBackToMenu}
              sx={{ borderRadius: 5, color: theme.palette.text.primary }}
              aria-label="Back to Menu"
            >
              Back to Menu
            </Button>
          </Box>

          {cartItems.length === 0 ? (
            <CartEmpty handleBackToMenu={handleBackToMenu} />
          ) : (
            <ListItemCart
              cartItems={cartItems}
              updateQuantity={updateQuantity}
              removeItem={removeItem}
              totalNutrition={totalNutrition}
              calculateItemNutrition={calculateItemNutrition}
            />
          )}
        </Box>
      </Box>
      <Footer />
    </Box>
  )
}

export default Cart
