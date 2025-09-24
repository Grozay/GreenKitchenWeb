import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  getCartByCustomerIdAPI,
  removeMealFromCartAPI,
  increaseMealQuantityInCartAPI,
  decreaseMealQuantityInCartAPI,
  addMealToCartAPI
} from '~/apis/index'


const initialState = {
  currentCart: null
}

// Async thunks: only call API when customerId exists
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (customerId) => {
    if (!customerId) {
      // Not logged in, return empty cart
      return { cartItems: [], totalAmount: 0, totalItems: 0, totalQuantity: 0 }
    }
    const response = await getCartByCustomerIdAPI(customerId)
    return response
  }
)

export const createCartItem = createAsyncThunk(
  'cart/createCartItem',
  async ({ customerId, itemData }) => {
    if (!customerId) {
      // Not logged in, return itemData for reducer to add to cart automatically
      return itemData
    }
    const response = await addMealToCartAPI(customerId, itemData)
    return response
  }
)

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async ({ customerId, itemId }) => {
    if (!customerId) {
      // Not logged in, return itemId for reducer to remove from cart automatically
      return itemId
    }
    await removeMealFromCartAPI(customerId, itemId)
    return itemId
  }
)

export const increaseQuantity = createAsyncThunk(
  'cart/increaseQuantity',
  async ({ customerId, itemId }) => {
    if (!customerId) {
      return itemId
    }
    await increaseMealQuantityInCartAPI(customerId, itemId)
    return itemId
  }
)

export const decreaseQuantity = createAsyncThunk(
  'cart/decreaseQuantity',
  async ({ customerId, itemId }) => {
    if (!customerId) {
      return itemId
    }
    await decreaseMealQuantityInCartAPI(customerId, itemId)
    return itemId
  }
)

// Add asyncThunk to sync local cart to DB after login
export const syncCartAfterLogin = createAsyncThunk(
  'cart/syncCartAfterLogin',
  async (customerId, { getState, dispatch }) => {
    const state = getState()
    const localCartItems = state.cart.currentCart?.cartItems || []

    if (!customerId || localCartItems.length === 0) {
      return
    }

    // Only clear if there are local items
    if (localCartItems.length > 0) {
      dispatch(clearCart())
    }

    // Call API addMealToCart for each item in local cart
    for (const item of localCartItems) {
      try {
        const itemData = {
          menuMealId: item.menuMealId || null,
          customMealId: item.customMealId || null,
          customerWeekMealDayId: item.customerWeekMealDayId || null,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          title: item.title,
          image: item.image,
          description: item.description,
          calories: item.calories,
          protein: item.protein,
          carbs: item.carbs,
          fat: item.fat,
          itemType: item.itemType,
          isCustom: item.isCustom,
          // Add necessary objects for display
          customMeal: item.customMeal || null
          // customerWeekMealDay does not need to be passed as it is already saved in DB
        }

        const response = await addMealToCartAPI(customerId, itemData)

        // customerWeekMealDay is already saved in DB, no need for localStorage
      } catch (error) {
        console.error('Error syncing item:', item.id, error)
        // Can skip error or handle it (e.g., show toast)
      }
    }

    // After sync, fetch cart from DB again
    const updatedCart = await getCartByCustomerIdAPI(customerId)
    return updatedCart
  }
)

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.currentCart = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        let cartData = action.payload

        if (cartData && Array.isArray(cartData.cartItems)) {
          // customerWeekMealDay is already in the response from DB, no need to merge from localStorage
          state.currentCart = cartData
        } else if (cartData && (cartData.customerWeekMealDayId || cartData.id)) {
          // If payload is 1 item, customerWeekMealDay is already in the item from DB
          state.currentCart = {
            cartItems: [cartData],
            totalAmount: cartData.totalPrice || 0,
            totalItems: 1,
            totalQuantity: cartData.quantity || 1
          }
        } else {
          state.currentCart = { cartItems: [], totalAmount: 0, totalItems: 0, totalQuantity: 0 }
        }
      })
      .addCase(createCartItem.fulfilled, (state, action) => {
        // If payload is cart object (has cartItems), assign directly
        if (action.payload && Array.isArray(action.payload.cartItems)) {
          state.currentCart = action.payload
        } else {
          // Always ensure currentCart is an object with cartItems as array
          if (!state.currentCart || !Array.isArray(state.currentCart.cartItems)) {
            state.currentCart = { cartItems: [], totalAmount: 0, totalItems: 0, totalQuantity: 0 }
          }

          // customerWeekMealDay is saved in DB, no need for localStorage

          // No need to merge weekMeal anymore
          const newItem = {
            ...action.payload
          }

          const existIndex = state.currentCart.cartItems.findIndex(
            item => String(item.customerWeekMealDayId || item.menuMealId || item.id) === String(newItem.customerWeekMealDayId || newItem.menuMealId || newItem.id)
          )
          if (existIndex !== -1) {
            // If already exists, increase quantity and update totalPrice
            const existItem = state.currentCart.cartItems[existIndex]
            const updatedQuantity = existItem.quantity + newItem.quantity
            state.currentCart.cartItems[existIndex] = {
              ...existItem,
              quantity: updatedQuantity,
              totalPrice: updatedQuantity * existItem.unitPrice
            }
          } else {
            // If not exists, add new
            state.currentCart.cartItems.push(newItem)
          }
          state.currentCart.totalItems = state.currentCart.cartItems.length
          state.currentCart.totalAmount = state.currentCart.cartItems.reduce((sum, item) => sum + item.totalPrice, 0)
          state.currentCart.totalQuantity = state.currentCart.cartItems.reduce((sum, item) => sum + item.quantity, 0)
        }
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        const itemId = String(action.meta.arg.itemId)

        // customerWeekMealDay is not stored in localStorage

        state.currentCart.cartItems = state.currentCart.cartItems.filter(
          item =>
            String(item.customerWeekMealDayId || item.menuMealId || item.customMealId || item.id) !== itemId
        )
        state.currentCart.totalItems = state.currentCart.cartItems.length
        state.currentCart.totalAmount = state.currentCart.cartItems.reduce((sum, item) => sum + item.totalPrice, 0)
        state.currentCart.totalQuantity = state.currentCart.cartItems.reduce((sum, item) => sum + item.quantity, 0)
      })
      .addCase(increaseQuantity.fulfilled, (state, action) => {
        const itemId = String(action.meta.arg.itemId)
        if (!state.currentCart) {
          state.currentCart = { cartItems: [], totalAmount: 0, totalItems: 0, totalQuantity: 0 }
        }
        state.currentCart.cartItems = state.currentCart.cartItems.map(item =>
          String(item.id) === String(itemId)
            ? { ...item, quantity: item.quantity + 1, totalPrice: (item.quantity + 1) * item.unitPrice }
            : item
        )
        state.currentCart.totalItems = state.currentCart.cartItems.length
        state.currentCart.totalAmount = state.currentCart.cartItems.reduce((sum, item) => sum + item.totalPrice, 0)
        state.currentCart.totalQuantity = state.currentCart.cartItems.reduce((sum, item) => sum + item.quantity, 0)
      })
      .addCase(decreaseQuantity.fulfilled, (state, action) => {
        const itemId = String(action.meta.arg.itemId)
        if (!state.currentCart) {
          state.currentCart = { cartItems: [], totalAmount: 0, totalItems: 0, totalQuantity: 0 }
        }
        state.currentCart.cartItems = state.currentCart.cartItems.map(item =>
          String(item.id) === String(itemId) && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1, totalPrice: (item.quantity - 1) * item.unitPrice }
            : item
        )
        state.currentCart.totalItems = state.currentCart.cartItems.length
        state.currentCart.totalAmount = state.currentCart.cartItems.reduce((sum, item) => sum + item.totalPrice, 0)
        state.currentCart.totalQuantity = state.currentCart.cartItems.reduce((sum, item) => sum + item.quantity, 0)
      })
      // Add case for syncCartAfterLogin
      .addCase(syncCartAfterLogin.fulfilled, (state, action) => {
        if (action.payload && Array.isArray(action.payload.cartItems)) {
          state.currentCart = action.payload // Update with cart merged from DB
        } else {
          // If no payload, keep as is or set empty
          state.currentCart = { cartItems: [], totalAmount: 0, totalItems: 0, totalQuantity: 0 }
        }
      })
  }
})

// Selectors
export const selectCurrentCart = (state) => state.cart.currentCart

export const { clearCart } = cartSlice.actions

export const cartReducer = cartSlice.reducer