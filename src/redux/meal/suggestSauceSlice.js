import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  suggestedSauces: [],
  showSauceHint: false
}

const suggestSauceSlice = createSlice({
  name: 'suggestSauce',
  initialState,
  reducers: {
    setSuggestedSauces: (state, action) => {
      state.suggestedSauces = action.payload
    },
    setShowSauceHint: (state, action) => {
      state.showSauceHint = action.payload
    },
    clearSuggestions: (state) => {
      state.suggestedSauces = []
      state.showSauceHint = false
    }
  }
})

export const { setSuggestedSauces, setShowSauceHint, clearSuggestions } = suggestSauceSlice.actions

// Selectors
export const selectSuggestedSauces = (state) => state.suggestSauce.suggestedSauces
export const selectShowSauceHint = (state) => state.suggestSauce.showSauceHint

export default suggestSauceSlice.reducer