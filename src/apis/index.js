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

export const updateCustomerPassword = async (data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/customers/updatePassword`, data)
  return response.data
}



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
