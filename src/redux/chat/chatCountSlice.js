import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  queueCount: 0,
  myChatCount: 0
}

export const chatCountSlice = createSlice({
  name: 'chatCount',
  initialState,
  reducers: {
    setQueueCount: (state, action) => {
      state.queueCount = action.payload
    },
    setMyChatCount: (state, action) => {
      state.myChatCount = action.payload
    },
    incrementQueueCount: (state) => {
      state.queueCount += 1
    },
    decrementQueueCount: (state) => {
      state.queueCount = Math.max(0, state.queueCount - 1)
    },
    incrementMyChatCount: (state) => {
      state.myChatCount += 1
    },
    decrementMyChatCount: (state) => {
      state.myChatCount = Math.max(0, state.myChatCount - 1)
    },
    resetChatCounts: (state) => {
      state.queueCount = 0
      state.myChatCount = 0
    }
  }
})

export const {
  setQueueCount,
  setMyChatCount,
  incrementQueueCount,
  decrementQueueCount,
  incrementMyChatCount,
  decrementMyChatCount,
  resetChatCounts
} = chatCountSlice.actions

export const selectQueueCount = (state) => state.chatCount.queueCount
export const selectMyChatCount = (state) => state.chatCount.myChatCount
export const selectTotalChatCount = (state) => state.chatCount.queueCount + state.chatCount.myChatCount

export default chatCountSlice.reducer