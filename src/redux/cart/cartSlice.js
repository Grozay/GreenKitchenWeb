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
// Async thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (customerId) => {
    const response = await getCartByCustomerIdAPI(customerId)
    return response
  }
)

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async ({ customerId, itemId }) => {
    await removeMealFromCartAPI(customerId, itemId)
    return itemId
  }
)

export const increaseQuantity = createAsyncThunk(
  'cart/increaseQuantity',
  async ({ customerId, itemId }) => {
    await increaseMealQuantityInCartAPI(customerId, itemId)
    return itemId
  }
)

export const decreaseQuantity = createAsyncThunk(
  'cart/decreaseQuantity',
  async ({ customerId, itemId }) => {
    await decreaseMealQuantityInCartAPI(customerId, itemId)
    return itemId
  }
)

export const createCartItem = createAsyncThunk(
  'cart/createCartItem',
  async ({ customerId, itemData }) => {
    const response = await addMealToCartAPI(customerId, itemData)
    return response
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
        state.currentCart = action.payload
      })
      .addCase(createCartItem.fulfilled, (state, action) => {
        state.currentCart = action.payload
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        const itemId = action.payload
        if (state.currentCart && state.currentCart.cartItems) {
          state.currentCart.cartItems = state.currentCart.cartItems.filter(item => item.id !== itemId)
          state.currentCart.totalItems = state.currentCart.cartItems.length
          state.currentCart.totalAmount = state.currentCart.cartItems.reduce((sum, item) => sum + item.totalPrice, 0)
        }
      })
      .addCase(increaseQuantity.fulfilled, (state, action) => {
        const itemId = action.meta.arg.itemId
        if (state.currentCart && state.currentCart.cartItems) {
          state.currentCart.cartItems = state.currentCart.cartItems.map(item =>
            item.id === itemId
              ? { ...item, quantity: item.quantity + 1, totalPrice: (item.quantity + 1) * item.unitPrice }
              : item
          )
          state.currentCart.totalItems = state.currentCart.cartItems.length
          state.currentCart.totalAmount = state.currentCart.cartItems.reduce((sum, item) => sum + item.totalPrice, 0)
        }
      })
      .addCase(decreaseQuantity.fulfilled, (state, action) => {
        const itemId = action.meta.arg.itemId
        if (state.currentCart && state.currentCart.cartItems) {
          state.currentCart.cartItems = state.currentCart.cartItems.map(item =>
            item.id === itemId && item.quantity > 1
              ? { ...item, quantity: item.quantity - 1, totalPrice: (item.quantity - 1) * item.unitPrice }
              : item
          )
          state.currentCart.totalItems = state.currentCart.cartItems.length
          state.currentCart.totalAmount = state.currentCart.cartItems.reduce((sum, item) => sum + item.totalPrice, 0)
        }
      })

  }
})

// Selectors: chỉ lấy từ currentCart
export const selectCurrentCart = (state) => state.cart.currentCart
export const selectCartItems = (state) => state.cart.currentCart?.cartItems || []
export const selectTotalItems = (state) => state.cart.currentCart?.totalItems || 0
export const selectTotalAmount = (state) => state.cart.currentCart?.totalAmount || 0

export const { clearCart } = cartSlice.actions

export const cartReducer = cartSlice.reducer