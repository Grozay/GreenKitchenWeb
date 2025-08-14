import { createSlice, createSelector, createAsyncThunk } from '@reduxjs/toolkit'
import { createIngredientActHistoryAPI } from '~/apis/index'

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
  totalFat: 0
}

export const createIngredientActHistory = createAsyncThunk(
  'meal/createIngredientActHistory',
  async ({ item, customerId }, { dispatch }) => {
    const apiData = {
      customerId: customerId,
      ingredientId: item.id,
      actionType: 'ADD'
    }
    const response = await createIngredientActHistoryAPI(apiData)
    dispatch(addItem(item))
    return response
  }
)

export const hoverIngredientActHistory = createAsyncThunk(
  'meal/hoverIngredientActHistory',
  async ({ item, customerId }) => {
    const apiData = {
      customerId: customerId,
      ingredientId: item.id,
      actionType: 'HOVER'
    }
    const response = await createIngredientActHistoryAPI(apiData)
    return response
  }
)


export const removeIngredientActHistory = createAsyncThunk(
  'meal/removeIngredientActHistory',
  async ({ item, customerId }, { dispatch }) => {
    const apiData = {
      customerId: customerId,
      ingredientId: item.id,
      actionType: 'REMOVE'
    }
    const response = await createIngredientActHistoryAPI(apiData)
    dispatch(removeItem(item))
    return response
  }
)

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
      state.title = '',
      state.description = '',
      state.image = 'https://res.cloudinary.com/quyendev/image/upload/v1750922086/Top-blade-beef-steak-300x300_fvv3fj.png',
      state.totalCalories = 0
      state.totalProtein = 0
      state.totalCarbs = 0
      state.totalFat = 0
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createIngredientActHistory.pending, () => {
        // Handle loading state if needed
      })
      .addCase(createIngredientActHistory.fulfilled, () => {
        // API call successful, item already added to state via addItem dispatch
      })
      .addCase(createIngredientActHistory.rejected, () => {
        // Handle error state if needed
      })
      .addCase(removeIngredientActHistory.pending, () => {
        // Handle loading state if needed
      })
      .addCase(removeIngredientActHistory.fulfilled, () => {
        // API call successful, item already removed from state via removeItem dispatch
      })
      .addCase(removeIngredientActHistory.rejected, () => {
        // Handle error state if needed
      })
  }
})

export const { addItem, removeItem, clearCart } = mealSlice.actions

export const selectCurrentMeal = (state) => {
  return state.meal.selectedItems
}

// total calories = (Protein (g) × 4) + (Carbs (g) × 4) + (Fat (g) × 9)
export const selectMealTotals = createSelector(
  (state) => state.meal,
  (meal) => ({
    totalCalories: (meal.totalProtein * 4) + (meal.totalCarbs * 4) + (meal.totalFat * 9), // Protein * 4 + Carbs * 4 + Fat * 9
    totalProtein: meal.totalProtein,
    totalCarbs: meal.totalCarbs,
    totalFat: meal.totalFat
  })
)

export const mealReducer = mealSlice.reducer