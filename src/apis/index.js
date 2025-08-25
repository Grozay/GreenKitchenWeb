import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

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

export const createCustomMealAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/custom-meals`, data)
  return response.data
}

export const getCustomMealByCustomerIdAPI = async (customerId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/custom-meals/customer/${customerId}`)
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

// Coupon APIs - Updated endpoints
export const exchangeCouponAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/coupons/exchange`, data)
  return response.data
}

export const getExchangeableCouponsAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/coupons/available`)
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

// Posts
export const createPostAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/posts`, data)
  return response.data
}

export const getPostsAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/posts`)
  return response.data
}

export const getPostsPagedAPI = async (page = 1, size = 10) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/posts?page=${page}&size=${size}`)
  return response.data
}

export const getPostsFilteredAPI = async (page = 1, size = 10, status, categoryId, q) => {
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
