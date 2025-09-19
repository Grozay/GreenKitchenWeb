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

// Async thunks: chỉ gọi API khi có customerId
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (customerId) => {
    if (!customerId) {
      // Chưa đăng nhập, trả về cart rỗng
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
      // Chưa đăng nhập, trả về itemData để reducer tự thêm vào cart
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
      // Chưa đăng nhập, trả về itemId để reducer tự xoá khỏi cart
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

// Thêm asyncThunk để sync local cart lên DB sau login
export const syncCartAfterLogin = createAsyncThunk(
  'cart/syncCartAfterLogin',
  async (customerId, { getState, dispatch }) => {
    const state = getState()
    const localCartItems = state.cart.currentCart?.cartItems || []

    if (!customerId || localCartItems.length === 0) {
      return
    }

    // Chỉ clear nếu có local items
    if (localCartItems.length > 0) {
      dispatch(clearCart())
    }

    // Gọi API addMealToCart cho từng item trong local cart
    for (const item of localCartItems) {
      try {
        await addMealToCartAPI(customerId, {
          menuMealId: item.menuMealId || item.id, // Sử dụng menuMealId nếu có, fallback id
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
          // Thêm customMeal nếu là custom meal
          customMeal: item.customMeal || null,
        })
      } catch (error) {
        console.error('Error syncing item:', item.id, error)
        // Có thể bỏ qua lỗi hoặc handle (e.g., show toast)
      }
    }

    // Sau khi sync, fetch lại cart từ DB
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
        if (action.payload && Array.isArray(action.payload.cartItems)) {
          state.currentCart = action.payload
        } else if (action.payload && (action.payload.menuMealId || action.payload.id)) {
          // Nếu payload là 1 item, wrap lại thành cart chuẩn
          state.currentCart = {
            cartItems: [action.payload],
            totalAmount: action.payload.totalPrice || 0,
            totalItems: 1,
            totalQuantity: action.payload.quantity || 1
          }
        } else {
          state.currentCart = { cartItems: [], totalAmount: 0, totalItems: 0, totalQuantity: 0 }
        }
      })
      .addCase(createCartItem.fulfilled, (state, action) => {
        // Nếu payload là cart object (có cartItems), gán luôn
        if (action.payload && Array.isArray(action.payload.cartItems)) {
          state.currentCart = action.payload
        } else {
          // Luôn đảm bảo currentCart là object có cartItems là mảng
          if (!state.currentCart || !Array.isArray(state.currentCart.cartItems)) {
            state.currentCart = { cartItems: [], totalAmount: 0, totalItems: 0, totalQuantity: 0 }
          }
          const newItem = action.payload
          const existIndex = state.currentCart.cartItems.findIndex(
            item => String(item.menuMealId || item.id) === String(newItem.menuMealId || newItem.id)
          )
          if (existIndex !== -1) {
            // Nếu đã có, tăng quantity và cập nhật totalPrice
            const existItem = state.currentCart.cartItems[existIndex]
            const updatedQuantity = existItem.quantity + newItem.quantity
            state.currentCart.cartItems[existIndex] = {
              ...existItem,
              quantity: updatedQuantity,
              totalPrice: updatedQuantity * existItem.unitPrice
            }
          } else {
            // Nếu chưa có, thêm mới
            state.currentCart.cartItems.push(newItem)
          }
          state.currentCart.totalItems = state.currentCart.cartItems.length
          state.currentCart.totalAmount = state.currentCart.cartItems.reduce((sum, item) => sum + item.totalPrice, 0)
          state.currentCart.totalQuantity = state.currentCart.cartItems.reduce((sum, item) => sum + item.quantity, 0)
        }
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        const itemId = String(action.meta.arg.itemId)
        state.currentCart.cartItems = state.currentCart.cartItems.filter(
          item =>
            String(item.menuMealId || item.customMealId) !== itemId
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
      // Thêm case cho syncCartAfterLogin
      .addCase(syncCartAfterLogin.fulfilled, (state, action) => {
        if (action.payload && Array.isArray(action.payload.cartItems)) {
          state.currentCart = action.payload // Update với cart đã merge từ DB
        } else {
          // Nếu không có payload, giữ nguyên hoặc set rỗng
          state.currentCart = { cartItems: [], totalAmount: 0, totalItems: 0, totalQuantity: 0 }
        }
      })
  }
})

// Selectors
export const selectCurrentCart = (state) => state.cart.currentCart

export const { clearCart } = cartSlice.actions

export const cartReducer = cartSlice.reducer