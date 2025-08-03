import { createSlice, createSelector } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

const initialState = {
  cartItems: [],
  totalQuantity: 0,
  totalPrice: 0
}

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    // Add item to cart (menu meal or custom meal)
    addToCart: (state, action) => {
      const newItem = action.payload
      // Check if item already exists in cart
      const existingItemIndex = state.cartItems.findIndex(item => {
        if (newItem.isCustom) {
          // For custom items, compare by unique combinations
          return item.isCustom &&
            JSON.stringify(item.mealItem) === JSON.stringify(newItem.mealItem)
        } else {
          // For menu items, compare by id
          return !item.isCustom && item.id === newItem.id
        }
      })

      if (existingItemIndex >= 0) {
        // Item exists, increase quantity
        state.cartItems[existingItemIndex].quantity += newItem.quantity || 1
        state.cartItems[existingItemIndex].totalPrice =
          state.cartItems[existingItemIndex].basePrice * state.cartItems[existingItemIndex].quantity
      } else {
        // New item, add to cart
        const cartItem = {
          ...newItem,
          cartId: Date.now() + Math.random(),
          quantity: newItem.quantity || 1,
          basePrice: newItem.totalPrice || newItem.price || 0,
          totalPrice: (newItem.totalPrice || newItem.price || 0) * (newItem.quantity || 1)
        }
        state.cartItems.push(cartItem)
      }

      // Recalculate totals
      state.totalQuantity = state.cartItems.reduce((total, item) => total + item.quantity, 0)
      state.totalPrice = state.cartItems.reduce((total, item) => total + item.totalPrice, 0)
      toast.success('Added to cart successfully!')
    },

    // Update quantity of item in cart
    updateCartItemQuantity: (state, action) => {
      const { cartId, quantity } = action.payload
      const itemIndex = state.cartItems.findIndex(item => item.cartId === cartId)

      if (itemIndex >= 0) {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or less
          state.cartItems.splice(itemIndex, 1)
        } else {
          // Update quantity and total price
          state.cartItems[itemIndex].quantity = quantity
          state.cartItems[itemIndex].totalPrice =
            state.cartItems[itemIndex].basePrice * quantity
        }

        // Recalculate totals
        state.totalQuantity = state.cartItems.reduce((total, item) => total + item.quantity, 0)
        state.totalPrice = state.cartItems.reduce((total, item) => total + item.totalPrice, 0)
      }
    },

    // Remove item from cart
    removeFromCart: (state, action) => {
      const cartId = action.payload
      state.cartItems = state.cartItems.filter(item => item.cartId !== cartId)

      // Recalculate totals
      state.totalQuantity = state.cartItems.reduce((total, item) => total + item.quantity, 0)
      state.totalPrice = state.cartItems.reduce((total, item) => total + item.totalPrice, 0)

      toast.success('Item removed from cart')
    },

    // Clear all items from cart
    clearCart: (state) => {
      state.cartItems = []
      state.totalQuantity = 0
      state.totalPrice = 0
    },

    // Add custom meal to cart (from smart meal builder)
    addCustomMealToCart: (state, action) => {
      const { selectedItems, totalNutrition, customerId } = action.payload

      // Calculate price based on ingredients (you can adjust pricing logic)
      const basePrice = 15 // Base price for custom meal
      const ingredientPrice = Object.values(selectedItems).flat().length * 2
      const totalPrice = basePrice + ingredientPrice

      const customMeal = {
        cartId: Date.now() + Math.random(),
        isCustom: true,
        mealItem: selectedItems,
        nutrition: totalNutrition,
        customerId,
        quantity: 1,
        basePrice: totalPrice,
        totalPrice: totalPrice,
        title: 'Custom Bowl',
        description: 'Your personalized healthy meal'
      }

      state.cartItems.push(customMeal)

      state.totalQuantity = state.cartItems.reduce((total, item) => total + item.quantity, 0)
      state.totalPrice = state.cartItems.reduce((total, item) => total + item.totalPrice, 0)

      toast.success('Custom meal added to cart!')
    }
  }
})

// Selectors
export const selectCartItems = (state) => state.order.cartItems
export const selectCartTotalQuantity = (state) => state.order.totalQuantity
export const selectCartTotalPrice = (state) => state.order.totalPrice

// Calculate total nutrition for all items in cart
export const selectCartTotalNutrition = createSelector(
  [selectCartItems],
  (cartItems) => {
    return cartItems.reduce((total, item) => {
      let itemNutrition = { calories: 0, protein: 0, carbs: 0, fat: 0 }

      if (item.isCustom && item.mealItem) {
        Object.values(item.mealItem).forEach(category => {
          if (Array.isArray(category)) {
            category.forEach(food => {
              itemNutrition.calories += (food.calories || 0) * (food.quantity || 1)
              itemNutrition.protein += (food.protein || 0) * (food.quantity || 1)
              itemNutrition.carbs += (food.carbs || 0) * (food.quantity || 1)
              itemNutrition.fat += (food.fat || 0) * (food.quantity || 1)
            })
          }
        })
      } else if (item.nutrition) {
        itemNutrition = item.nutrition
      } else {
        itemNutrition = {
          calories: item.calories || 0,
          protein: item.protein || 0,
          carbs: item.carbs || 0,
          fat: item.fat || 0
        }
      }

      total.calories += itemNutrition.calories * item.quantity
      total.protein += itemNutrition.protein * item.quantity
      total.carbs += itemNutrition.carbs * item.quantity
      total.fat += itemNutrition.fat * item.quantity

      return total
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 })
  }
)

export const {
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  addCustomMealToCart
} = orderSlice.actions

export const orderReducer = orderSlice.reducer