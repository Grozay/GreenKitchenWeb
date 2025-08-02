import { configureStore } from '@reduxjs/toolkit'
import { translationsReducer } from './translations/translationsSlice.js'
import { employeeReducer } from './user/employeeSlice.js'
import { customerReducer } from './user/customerSlice.js'
import { mealReducer } from './meal/mealSlice.js'
import { orderReducer } from './order/orderSlice.js'
//config redux-persist
import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const rootPersistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['translations', 'employee', 'customer', 'meal', 'order']
}

const rootReducer = combineReducers({
  translations: translationsReducer,
  employee: employeeReducer,
  customer: customerReducer,
  meal: mealReducer,
  order: orderReducer
})

const persistedReducer = persistReducer(rootPersistConfig, rootReducer)

export default configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  })
})
