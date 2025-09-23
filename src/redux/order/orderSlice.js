import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  newOrders: [] // array of order objects (at least contains id/orderCode)
}

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addNewOrder: (state, action) => {
      const incoming = action.payload
      if (!incoming || (!incoming.id && !incoming.orderCode)) return
      const exists = state.newOrders.some(o => (o.id ?? o.orderCode) === (incoming.id ?? incoming.orderCode))
      if (!exists) {
        state.newOrders.unshift(incoming)
      }
    },
    removeNewOrder: (state, action) => {
      const id = action.payload
      state.newOrders = state.newOrders.filter(o => (o.id ?? o.orderCode) !== id)
    },
    clearAllNewOrders: (state) => {
      state.newOrders = []
    }
  }
})

export const { addNewOrder, removeNewOrder, clearAllNewOrders } = orderSlice.actions

export const selectNewOrders = (state) => state.order?.newOrders ?? []
export const selectNewOrderCount = (state) => (state.order?.newOrders ?? []).length

export const orderReducer = orderSlice.reducer


