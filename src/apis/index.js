import axios from 'axios'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

//token
export const refreshTokenEmployeeAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/Employees/RefreshToken`)
  return response.data
}

export const refreshTokenCustomerAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/auth/RefreshToken`)
  return response.data
}

export const resetPasswordAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/auth/resetPassword`, data)
  return response.data
}

export const changePasswordAPI = async (data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/customers/updatePassword`, data)
  return response.data
}

export const unlinkGoogleAPI = async (data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/customers/unlinkGoogle`, data)
  return response.data
}

export const linkGoogleAPI = async (data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/customers/linkGoogle`, data)
  return response.data
}

export const verifyOtpCodeAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/auth/verifyOtpCode`, data)
  return response.data
}

export const sendOtpCodeAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/auth/sendOtpCode`, data)
  return response.data
}

export const registerCustomerAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/auth/register`, data)
  return response.data
}

export const verifyCustomerAPI = async (data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/auth/verify`, data)
  return response.data
}

export const resendVerifyEmailApi = async (data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/auth/resendVerifyEmail`, data)
  return response.data
}

//Customer
export const fetchCustomerDetails = async (email) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/customers/email/${email}`)
  return response.data
}

export const updateCustomerInfo = async (data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/customers/update`, data)
  return response.data
}
export const updateAvatarAPI = async (email, file) => {
  const formData = new FormData()
  formData.append('imageFile', file)
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/customers/updateAvatar/${email}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

export const updateCustomerPassword = async (data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/customers/updatePassword`, data)
  return response.data
}

// ingredients
export const getIngredientsAPI = async () => {
  const response = await axios.get(`${API_ROOT}/apis/v1/customers/ingredients`)
  return response.data
}

export const createIngredientActHistoryAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/customers/ingredient-act-his`, data)
  return response.data
}

export const getIngredientActHistoryByCustomerIdAPI = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/ingredient-act-his/customer/${id}`)
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
  const response = await axios.post(`${API_ROOT}/apis/v1/customer-health-info`, data)
  return response.data
}

// MenuMeal
export const getMenuMealAPI = async () => {
  const response = await axios.get(`${API_ROOT}/apis/v1/customers/menu-meals`)
  return response.data
}

export const getDetailMenuMealAPI = async (slug) => {
  const response = await axios.get(`${API_ROOT}/apis/v1/customers/menu-meals/slug/${slug}`)

// Address
export const createNewAddressAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/addresses/create`, data)
  return response.data
}

export const updateAddressAPI = async (data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/addresses/update`, data)
  return response.data
}

export const deleteAddressAPI = async (id) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/addresses/delete/${id}`)
  return response.data
}

// Customer TDEE APIs
export const saveCustomerTDEEAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/customer-tdees`, data)
  return response.data
}

export const getCustomerTDEEsAPI = async (customerId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/customer-tdees/customer/${customerId}`)
  return response.data
}

export const deleteCustomerTDEEAPI = async (id) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/customer-tdees/${id}`)
  return response.data
}

// Coupon APIs
export const getExchangeableCouponsAPI = async (tier, points) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/coupons/exchangeable?tier=${tier}&points=${points}`)
  return response.data
}

export const getAvailableCouponsAPI = async (tier) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/coupons/available?tier=${tier}`)
  return response.data
}

export const getCustomerCouponsAPI = async (customerId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/coupons/customer/${customerId}`)
  return response.data
}

export const getAvailableCustomerCouponsAPI = async (customerId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/coupons/customer/${customerId}/available`)
  return response.data
}

export const exchangeCouponAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/coupons/exchange`, data)
  return response.data
}

export const useCouponAPI = async (customerId, couponCode, orderId) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/coupons/customer/${customerId}/use?couponCode=${couponCode}&orderId=${orderId}`)
  return response.data
}

export const canExchangeCouponAPI = async (customerId, couponId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/coupons/customer/${customerId}/can-exchange/${couponId}`)
  return response.data
}

export const canUseCouponAPI = async (customerId, couponCode) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/coupons/customer/${customerId}/can-use/${couponCode}`)
  return response.data
}

export const validateCouponAPI = async (code) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/coupons/validate/${code}`)
  return response.data
}

export const calculateDiscountAPI = async (code, orderAmount) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/coupons/discount?code=${code}&orderAmount=${orderAmount}`)
  return response.data
}
