import { createSlice, createSelector } from '@reduxjs/toolkit'

const initialState = {
  selectedItems: {
    protein: [],
    carbs: [],
    side: [],
    sauce: []
  },
  title: '',
  description: '',
  image: 'https://res.cloudinary.com/quyendev/image/upload/v1750922086/Top-blade-beef-steak-300x300_fvv3fj.png',
  totalCalories: 0,
  totalProtein: 0,
  totalCarbs: 0,
  totalFat: 0,
  meal: null // Thêm state meal
}

const mealSlice = createSlice({
  name: 'meal',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const typeKey = action.payload.type.toLowerCase()
      const existingItem = state.selectedItems[typeKey].find(
        item => item.id === action.payload.id
      )

      if (existingItem) {
        existingItem.quantity += 1
      } else {
        state.selectedItems[typeKey].push({
          ...action.payload,
          quantity: 1
        })
      }

      state.totalProtein += action.payload.protein || 0
      state.totalCarbs += action.payload.carbs || 0
      state.totalFat += action.payload.fat || 0
    },
    removeItem: (state, action) => {
      const typeKey = action.payload.type.toLowerCase()
      const itemToRemove = state.selectedItems[typeKey].find(
        item => item.id === action.payload.id
      )

      if (itemToRemove) {
        if (itemToRemove.quantity > 1) {
          itemToRemove.quantity -= 1
        } else {
          state.selectedItems[typeKey] = state.selectedItems[typeKey].filter(
            item => item.id !== action.payload.id
          )
        }

        state.totalProtein -= itemToRemove.protein || 0
        state.totalCarbs -= itemToRemove.carbs || 0
        state.totalFat -= itemToRemove.fat || 0
      }
    },
    clearCart: (state) => {
      state.selectedItems = {
        protein: [],
        carbs: [],
        side: [],
        sauce: []
      }
      state.title = ''
      state.description = ''
      state.image = 'https://res.cloudinary.com/quyendev/image/upload/v1750922086/Top-blade-beef-steak-300x300_fvv3fj.png'
      state.totalCalories = 0
      state.totalProtein = 0
      state.totalCarbs = 0
      state.totalFat = 0
    },
    setMealFromCustom: (state, action) => {
      const { details, title, price, description, image } = action.payload // Thêm title, price, description, image
      // Clear current selection
      state.selectedItems = {
        protein: [],
        carbs: [],
        side: [],
        sauce: []
      }
      state.totalCalories = 0
      state.totalProtein = 0
      state.totalCarbs = 0
      state.totalFat = 0
      state.title = title || ''
      state.price = price || 0
      state.description = description || ''
      state.image = image || 'https://res.cloudinary.com/quyendev/image/upload/v1750922086/Top-blade-beef-steak-300x300_fvv3fj.png'

      // Add each detail as item
      details.forEach(detail => {
        const typeKey = detail.type.toLowerCase()
        if (state.selectedItems[typeKey]) {
          state.selectedItems[typeKey].push({
            ...detail,
            quantity: detail.quantity || 1,
            price: detail.calories * 10 // Thêm price, ví dụ calories * 10
          })
        }
      })
    },
    setMeal: (state, action) => {
      state.meal = action.payload // Thêm action setMeal
    }
  }
})

export const { addItem, removeItem, clearCart, setMealFromCustom, setMeal } = mealSlice.actions

export const selectCurrentMeal = (state) => {
  return state.meal.selectedItems
}

// total calories = (Protein (g) × 4) + (Carbs (g) × 4) + (Fat (g) × 9)
export const selectMealTotals = createSelector(
  (state) => state.meal,
  (meal) => ({
    totalCalories: (meal.totalProtein * 4) + (meal.totalCarbs * 4) + (meal.totalFat * 9),
    totalProtein: meal.totalProtein,
    totalCarbs: meal.totalCarbs,
    totalFat: meal.totalFat
  })
)

export const mealReducer = mealSlice.reducer