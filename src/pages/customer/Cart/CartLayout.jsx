/* eslint-disable no-console */
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import AppBar from '~/components/AppBar/AppBar'
import Footer from '~/components/Footer/Footer'
import theme from '~/theme'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  selectCurrentCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  fetchCart
} from '~/redux/cart/cartSlice'
import CartEmpty from './CartEmpty/CartEmpty'
import ListItemCart from './ListItemCart/ListItemCart'
import { useTranslation } from 'react-i18next'

const Cart = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const customerId = useSelector(state => state.customer.currentCustomer?.id ?? null)
  const { t } = useTranslation()

  // Lấy currentCart từ Redux
  const currentCart = useSelector(selectCurrentCart)
  console.log('🚀 ~ Cart ~ currentCart:', currentCart)
  const cartItems = currentCart?.cartItems || []

  const handleBackToMenu = () => {
    navigate('/menu')
  }

  const increaseItemQuantity = async (cartItemId) => {
    try {
      await dispatch(increaseQuantity({ customerId, itemId: cartItemId }))
    } catch (error) {
      // Xử lý lỗi nếu cần
    }
  }

  const decreaseItemQuantity = async (cartItemId) => {
    try {
      await dispatch(decreaseQuantity({ customerId, itemId: cartItemId }))
    } catch (error) {
      // Xử lý lỗi nếu cần
    }
  }

  const removeItem = async (cartItemId) => {
    try {
      await dispatch(removeFromCart({ customerId, itemId: cartItemId }))
      if (customerId) {
        await dispatch(fetchCart(customerId))
      }
    } catch (error) {
      // Xử lý lỗi nếu cần
    }
  }

  const calculateItemNutrition = (item) => {
    let totalCalories = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0

    if (item.isCustom && item.customMeal?.details) { // Sửa item.details thành item.customMeal?.details
      item.customMeal.details.forEach(detail => { // Sửa item.details thành item.customMeal.details
        totalCalories += (detail.calories || 0) * (detail.quantity || 1)
        totalProtein += (detail.protein || 0) * (detail.quantity || 1)
        totalCarbs += (detail.carbs || 0) * (detail.quantity || 1)
        totalFat += (detail.fat || 0) * (detail.quantity || 1)
      })
    } else if (item.itemType === 'WEEK_MEAL') {
      // WeekMeal không có nutrition, return 0
      return { calories: 0, protein: 0, carbs: 0, fat: 0 }
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

  const calculateTotalNutrition = () => {
    return cartItems.reduce((total, item) => {
      const itemNutrition = calculateItemNutrition(item)
      return {
        calories: total.calories + itemNutrition.calories,
        protein: total.protein + itemNutrition.protein,
        carbs: total.carbs + itemNutrition.carbs,
        fat: total.fat + itemNutrition.fat
      }
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 })
  }

  const totalNutrition = calculateTotalNutrition()

  return (
    <Box>
      <AppBar />
      <Box sx={{ mt: theme.fitbowl.appBarHeight }}>
        <Box sx={{ mx: 2.5, minHeight: '85vh' }}>
          <Box sx={{ pt: 2, pb: 1, ml: 2 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBackToMenu}
              sx={{ borderRadius: 5, color: theme.palette.text.primary }}
              aria-label="Back to Menu"
            >
              {t('cart.backToMenu')}
            </Button>
          </Box>

          {cartItems.length === 0 ? (
            <CartEmpty handleBackToMenu={handleBackToMenu} />
          ) : (
            <ListItemCart
              cartItems={cartItems}
              increaseQuantity={increaseItemQuantity}
              decreaseQuantity={decreaseItemQuantity}
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
