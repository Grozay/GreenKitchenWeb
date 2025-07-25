import { createSlice } from '@reduxjs/toolkit'

const savedLanguage = localStorage.getItem('currentLanguage') || 'en'
const initialState = {
  currentLanguage: savedLanguage
}

export const translationsSlice = createSlice({
  name: 'translations',
  initialState,
  reducers: {
    updateCurrentLanguage: (state, action) => {
      state.currentLanguage = action.payload
      localStorage.setItem('currentLanguage', action.payload)
    }
  }
})

export const { updateCurrentLanguage } = translationsSlice.actions

export const selectCurrentLanguage = (state) => {
  return state.translations.currentLanguage
}

export const translationsReducer = translationsSlice.reducer
