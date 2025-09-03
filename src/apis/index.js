import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'
import Drawer from '@mui/material/Drawer'

//token
export const refreshTokenCustomerAPI = async () => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/auth/refresh-token`)
  return response.data
}

export const resetPasswordAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/auth/resetPassword`, data)
  return response.data
}

export const changePasswordAPI = async (data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/apis/v1/customers/updatePassword`, data)
  return response.data
}

export const unlinkGoogleAPI = async (data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/apis/v1/customers/unlinkGoogle`, data)
  return response.data
}

export const linkGoogleAPI = async (data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/apis/v1/customers/linkGoogle`, data)
  return response.data
}

export const verifyOtpCodeAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/auth/verifyOtpCode`, data)
  return response.data
}

export const sendOtpCodeAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/auth/sendOtpCode`, data)
  return response.data
}

export const registerCustomerAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/auth/register`, data)
  return response.data
}

export const verifyCustomerAPI = async (data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/apis/v1/auth/verify`, data)
  return response.data
}

// Phone authentication
export const phoneLoginAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/auth/phone-login`, data)
  return response.data
}

export const resendVerifyEmailApi = async (data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/apis/v1/auth/resendVerifyEmail`, data)
  return response.data
}

//Customer
export const fetchCustomerDetails = async (email) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/customers/email/${email}`)
  return response.data
}

export const getAllCustomersAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/customers`)
  return response.data
}

export const getCustomersFilteredAPI = async (page, size, gender, q) => {
  let url = `${API_ROOT}/apis/v1/customers/filter?page=${page}&size=${size}`
  if (gender) url += `&gender=${encodeURIComponent(gender)}`
  if (q) url += `&q=${encodeURIComponent(q)}`
  const response = await authorizedAxiosInstance.get(url)
  return response.data
}

export const updateCustomerInfo = async (data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/apis/v1/customers/update`, data)
  return response.data
}
export const updateAvatarAPI = async (email, file) => {
  const formData = new FormData()
  formData.append('imageFile', file)
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/apis/v1/customers/updateAvatar/${email}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

export const updateCustomerPassword = async (data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/apis/v1/customers/updatePassword`, data)
  return response.data
}

// ingredients
export const getIngredientsAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/ingredients`)
  return response.data
}

export const getByIdIngredientsAPI = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/ingredients/${id}`)
  return response.data
}

export const createIngredientsAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/ingredients`, data)
  return response.data
}

export const updateIngredientImageAPI = async (id, file) => {
  const formData = new FormData()
  formData.append('imageFile', file)
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/apis/v1/ingredients/${id}/image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

export const updateIngredientsAPI = async (id, data) => {
  const formData = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    if (key !== 'image') {
      formData.append(key, value)
    }
  })
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/apis/v1/ingredients/${id}`, formData)
  return response.data
}


export const deleteIngredientsAPI = async (id) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/apis/v1/ingredients/${id}`)
  return response.data
}

//customMeal

export const createCustomMealAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/custom-meals`, data)
  return response.data
}

export const getCustomMealByIdAPI = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/custom-meals/${id}`)
  return response.data
}

export const createCustomerHealthyInfoAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/customer-health-info`, data)
  return response.data
}

// MenuMeal
export const getMenuMealAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/menu-meals/customers`)
  return response.data
}

export const getDetailMenuMealAPI = async (slug) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/menu-meals/customers/slug/${slug}`)
  return response.data
}

export const createMenuMealAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/menu-meals/customers`, data)
  return response.data
}


export const updateMenuMealImageAPI = async (id, file) => {
  const formData = new FormData()
  formData.append('imageFile', file)
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/apis/v1/menu-meals/customers/${id}/image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

export const updateMenuMealAPI = async (id, data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/apis/v1/menu-meals/customers/${id}`, data)
  return response.data
}

export const deleteMenuMealAPI = async (id) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/apis/v1/menu-meals/customers/${id}`)
  return response.data
}

// Address
export const createNewAddressAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/addresses/create`, data)
  return response.data
}

export const updateAddressAPI = async (data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/apis/v1/addresses/update`, data)
  return response.data
}

export const deleteAddressAPI = async (id) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/apis/v1/addresses/delete/${id}`)
  return response.data
}

// Customer TDEE APIs
export const saveCustomerTDEEAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/customer-tdees`, data)
  return response.data
}

export const getCustomerTDEEsAPI = async (customerId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/customer-tdees/customer/${customerId}`)
  return response.data
}

export const deleteCustomerTDEEAPI = async (id) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/apis/v1/customer-tdees/${id}`)
  return response.data
}

// Coupon APIs
export const exchangeCouponAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/coupons/exchange`, data)
  return response.data
}

export const getExchangeableCouponsAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/coupons/available`)
  return response.data
}

export const getCouponByIdAPI = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/coupons/${id}`)
  return response.data
}

// Admin Coupon APIs
export const getAllCouponsAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/coupons/admin/all`)
  return response.data
}

export const deleteCouponAPI = async (id) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/apis/v1/coupons/admin/delete/${id}`)
  return response.data
}

export const createCouponAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/coupons/admin/create`, data)
  return response.data
}

export const updateCouponAPI = async (id, data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/apis/v1/coupons/admin/update/${id}`, data)
  return response.data
}


// Customer Coupon APIs
export const customerUseCouponAPI = async (data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/apis/v1/customer-coupons/use-coupon`, data)
  return response.data
}

//cart
export const getCartByCustomerIdAPI = async (customerId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/carts/customer/${customerId}`)
  return response.data
}

export const addMealToCartAPI = async (customerId, data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/carts/customer/items/${customerId}`, data)
  return response.data
}

export const removeMealFromCartAPI = async (customerId, cartItemId) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/apis/v1/carts/customer/${customerId}/items/${cartItemId}`)
  return response.data
}

export const increaseMealQuantityInCartAPI = async (customerId, cartItemId) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/carts/customer/${customerId}/items/${cartItemId}/increase`)
  return response.data
}

export const decreaseMealQuantityInCartAPI = async (customerId, cartItemId) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/carts/customer/${customerId}/items/${cartItemId}/decrease`)
  return response.data
}
// Customer Reference APIs
export const getCustomerReferencesByCustomerIdAPI = async (customerId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/customer-references/customer/${customerId}`)
  return response.data
}

export const createCustomerReferenceAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/customer-references/create`, data)
  return response.data
}

export const updateCustomerReferenceAPI = async (data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/apis/v1/customer-references/update`, data)
  return response.data
}

// Order APIs
export const createOrder = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/orders`, data)
  return response.data
}

export const getOrderByCodeAPI = async (orderCode) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/orders/search/${orderCode}`)
  return response.data
}

export const updateOrderStatusAPI = async (data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/apis/v1/orders/updateStatus`, data)
  return response.data
}

export const getOrdersFilteredAPI = async (page, size, status, q, fromDate, toDate) => {
  let url = `${API_ROOT}/apis/v1/orders/filter?page=${page}&size=${size}`
  if (status) url += `&status=${encodeURIComponent(status)}`
  if (q) url += `&q=${encodeURIComponent(q)}`
  if (fromDate) url += `&fromDate=${encodeURIComponent(fromDate)}`
  if (toDate) url += `&toDate=${encodeURIComponent(toDate)}`
  const response = await authorizedAxiosInstance.get(url)
  return response.data
}

// PayPal APIs
export const getExchangeRateAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/paypal/exchange-rate`)
  return response.data
}

export const capturePayPalOrderAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/paypal/capture-order`, data)
  return response.data
}

//WeekMeal APIs
export const getWeekMealPlanAPI = async (type, date) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/week-meals?type=${type}&date=${date}`)
  return response.data
}

export const createWeekMealAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/week-meals`, data)
  return response.data
}

export const updateWeekMealAPI = async (id, data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/apis/v1/week-meals/${id}`, data)
  return response.data
}

export const getByIdWeekMealAPI = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/week-meals/${id}`)
  return response.data
}

export const deleteWeekMealAPI = async (id) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/apis/v1/week-meals/${id}`)
  return response.data
}

export const updateWeekMealDayAPI = async (weekMealId, dayId, data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/apis/v1/week-meals/${weekMealId}/days/${dayId}`, data)
  return response.data
}

export const getWeekMealDayByIdAPI = async (weekMealId, dayId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/week-meals/${weekMealId}/days/${dayId}`)
  return response.data
}


// Posts
export const createPostAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/posts`, data)
  return response.data
}

export const getPostsAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/posts`)
  return response.data
}

export const getPostsFilteredAPI = async (page, size, status, categoryId, q) => {
  let url = `${API_ROOT}/apis/v1/posts/filter?page=${page}&size=${size}`
  if (status) url += `&status=${encodeURIComponent(status)}`
  if (categoryId) url += `&categoryId=${encodeURIComponent(categoryId)}`
  if (q) url += `&q=${encodeURIComponent(q)}`
  const response = await authorizedAxiosInstance.get(url)
  return response.data
}

export const getPostByIdAPI = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/posts/${id}`)
  return response.data
}

export const getPostBySlugAPI = async (slug) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/posts/slug/${slug}`)
  return response.data
}

export const updatePostAPI = async (id, data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/apis/v1/posts/${id}`, data)
  return response.data
}

export const getPostCategoriesAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/post-categories`)
  return response.data
}

export const uploadPostImageAPI = async (file) => {
  const formData = new FormData()
  formData.append('imageFile', file)
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/posts/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}
// Dashboard APIs
export const fetchDashboardOverviewAPI = async (from, to) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/dashboard/overview?from=${from}&to=${to}`)
  return response.data
}

export const fetchPopularFoodsAPI = async (from, to) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/dashboard/popular-foods?from=${from}&to=${to}`)
  return response.data
}

export const fetchSalesFiguresAPI = async (from, to, type = 'day') => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/dashboard/sales-figures?from=${from}&to=${to}&type=${type}`)
  return response.data
}

export const fetchDailyIncomeAPI = async (date) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/dashboard/daily-income?date=${date}`)
  return response.data
}

export const fetchOrderSuccessRateAPI = async (from, to) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/dashboard/order-success-rate?from=${from}&to=${to}`)
  return response.data
}

export const fetchMostFavouriteItemsAPI = async (from, to) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/dashboard/most-favourite-items?from=${from}&to=${to}`)
  return response.data
}

export const fetchRecentOrdersAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/dashboard/recent-orders`)
  return response.data
}

export const fetchWeeklyTrendingMenusAPI = async (date) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/dashboard/weekly-trending-menus?date=${date}`)
  return response.data
}

