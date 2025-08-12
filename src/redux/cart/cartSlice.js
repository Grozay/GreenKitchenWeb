import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  getCartByCustomerIdAPI,
  removeMealFromCartAPI,
  increaseMealQuantityInCartAPI,
  decreaseMealQuantityInCartAPI
} from '~/apis/index'

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

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: [],
    totalItems: 0,
    items: [],
    totalAmount: 0,
    loading: false,
    error: null
  },
  reducers: {
    clearCart: (state) => {
      state.cartItems = []
      state.totalItems = 0
      state.items = []
      state.totalAmount = 0
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false
        state.cartItems = action.payload
        state.totalItems = action.payload.totalItems
        state.items = action.payload.cartItems || []
        state.totalAmount = action.payload.totalAmount
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // Remove from cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false
        const itemId = action.payload
        state.items = state.items.filter(item => item.id !== itemId)
        state.cartItems.cartItems = state.cartItems.cartItems?.filter(item => item.id !== itemId)
        state.totalItems = state.items.length
        state.totalAmount = state.items.reduce((sum, item) => sum + item.totalPrice, 0)
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // Increase quantity
      .addCase(increaseQuantity.pending, (state) => {
        state.loading = true
      })
      .addCase(increaseQuantity.fulfilled, (state, action) => {
        state.loading = false
        // Fetch lại cart data sau khi tăng quantity thành công
        // Hoặc có thể update local state nếu API trả về data mới
      })
      .addCase(increaseQuantity.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // Decrease quantity
      .addCase(decreaseQuantity.pending, (state) => {
        state.loading = true
      })
      .addCase(decreaseQuantity.fulfilled, (state, action) => {
        state.loading = false
        // Fetch lại cart data sau khi giảm quantity thành công
        // Hoặc có thể update local state nếu API trả về data mới
      })
      .addCase(decreaseQuantity.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  }
})

export const { clearCart } = cartSlice.actions

// Selectors
export const selectCartItems = (state) => state.cart.cartItems
export const selectTotalItems = (state) => state.cart.totalItems
export const selectItems = (state) => state.cart.items
export const selectTotalAmount = (state) => state.cart.totalAmount
export const selectCartLoading = (state) => state.cart.loading

export const cartReducer = cartSlice.reducer