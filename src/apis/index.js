import axios from 'axios'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

//token
export const refreshTokenEmployeeAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/Employees/RefreshToken`)
  return response.data
}

export const refreshTokenCustomerAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/RefreshToken`)
  return response.data
}

export const resetPasswordAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/resetPassword`, data)
  return response.data
}

export const verifyOtpCodeAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/verifyOtpCode`, data)
  return response.data
}

export const sendOtpCodeAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/sendOtpCode`, data)
  return response.data
}

export const registerCustomerAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/register`, data)
  return response.data
}

export const verifyCustomerAPI = async (data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/verify`, data)
  return response.data
}

export const resendVerifyEmailApi = async (data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/resendVerifyEmail`, data)
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
  return response.data
}
