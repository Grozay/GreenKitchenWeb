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
  selectItems,
  fetchCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity
} from '~/redux/cart/cartSlice'
import CartEmpty from './CartEmpty/CartEmpty'
import ListItemCart from './ListItemCart/ListItemCart'
import { useEffect } from 'react'

const Cart = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const customerId = 1 // Hoặc lấy từ auth state

  // Redux selectors - cập nhật selectors
  const items = useSelector(selectItems)

  // Load cart data on component mount
  useEffect(() => {
    dispatch(fetchCart(customerId))
  }, [dispatch, customerId])

  const handleBackToMenu = () => {
    navigate('/menu')
  }

  // Tách thành 2 hàm riêng biệt
  const increaseItemQuantity = async (cartItemId) => {
    try {
      await dispatch(increaseQuantity({ customerId, itemId: cartItemId }))
      // Refresh cart data sau khi update
      await dispatch(fetchCart(customerId))
    } catch (error) {
      console.error('Error increasing quantity:', error)
    }
  }

  const decreaseItemQuantity = async (cartItemId) => {
    try {
      await dispatch(decreaseQuantity({ customerId, itemId: cartItemId }))
      // Refresh cart data sau khi update
      await dispatch(fetchCart(customerId))
    } catch (error) {
      console.error('Error decreasing quantity:', error)
    }
  }

  const removeItem = async (cartItemId) => {
    try {
      await dispatch(removeFromCart({ customerId, itemId: cartItemId }))
    } catch (error) {
      console.error('Error removing item:', error)
    }
  }

  const calculateItemNutrition = (item) => {
    let totalCalories = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0

    if (item.isCustom && item.details) {
      // Tính toán nutrition cho custom meal
      item.details.forEach(detail => {
        totalCalories += (detail.calories || 0) * (detail.quantity || 1)
        totalProtein += (detail.protein || 0) * (detail.quantity || 1)
        totalCarbs += (detail.carbs || 0) * (detail.quantity || 1)
        totalFat += (detail.fat || 0) * (detail.quantity || 1)
      })
    } else {
      // Tính toán nutrition cho menu meal
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

  // Tính tổng nutrition
  const calculateTotalNutrition = () => {
    return items?.reduce((total, item) => {
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

  // if (loading) {
  //   return (
  //     <Box>
  //       <AppBar />
  //       <Box sx={{
  //         mt: theme.fitbowl.appBarHeight,
  //         display: 'flex',
  //         justifyContent: 'center',
  //         alignItems: 'center',
  //         minHeight: '50vh'
  //       }}>
  //         <Typography>Loading cart...</Typography>
  //       </Box>
  //     </Box>
  //   )
  // }

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
              Back to Menu
            </Button>
          </Box>

          {!items || items.length === 0 ? (
            <CartEmpty handleBackToMenu={handleBackToMenu} />
          ) : (
            <ListItemCart
              cartItems={items}
              increaseQuantity={increaseItemQuantity} // Pass hàm tăng
              decreaseQuantity={decreaseItemQuantity} // Pass hàm giảm
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
