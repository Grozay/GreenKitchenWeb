import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'
import { toast } from 'react-toastify'
import { clearChatData } from '~/utils/chatCleanup'
//khởi tạo gía trị state của 1 cái slice trong redux
const initialState = {
  currentCustomer: null
}

//Các hành động gọi api (bất đồng bộ) và cập nhật dữ liệu vào redux, dùng middleware CreateAsyncThunk đi kèm với extraReducers
export const loginCustomerApi = createAsyncThunk(
  'customer/loginCustomerApi',
  async (data) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/auth/login`, data)
    return response.data
  }
)

export const googleLoginAPI = createAsyncThunk(
  'customer/googleLoginAPI',
  async (data) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/auth/google-login`, data)
    return response.data
  }
)

export const phoneLoginAPI = createAsyncThunk(
  'customer/phoneLoginAPI',
  async (data) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/auth/phone-login`, data)
    return response.data
  }
)

export const logoutCustomerApi = createAsyncThunk(
  'customer/logoutCustomerApi',
  async (showSuccessMessage = true) => {
    const response = await authorizedAxiosInstance.delete(`${API_ROOT}/apis/v1/auth/logout`)
    if (showSuccessMessage) {
      toast.info('You have been logged out')
    }
    // Clear chat data on logout
    clearChatData()
    return response.data
  }
)

//tạo ra 1 slice trong redux store
export const customerSlice = createSlice({
  name: 'customer',
  initialState,
  //extraReducers: nơi xử lí dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    //account
    builder.addCase(loginCustomerApi.fulfilled, (state, action) => {
      //action.payload là dữ liệu trả về từ axios call api
      const customer = action.payload
      //update lại dữ liệu của currentUser
      state.currentCustomer = customer
    })
    builder.addCase(googleLoginAPI.fulfilled, (state, action) => {
      const customer = action.payload
      //update lại dữ liệu của currentUser
      state.currentCustomer = customer
    })
    builder.addCase(phoneLoginAPI.fulfilled, (state, action) => {
      const customer = action.payload
      //update lại dữ liệu của currentUser
      state.currentCustomer = customer
    })
    builder.addCase(logoutCustomerApi.fulfilled, (state) => {
      state.currentCustomer = null
    })
  }
})

// export const { } = userSlice.actions

//selector: là nơi cho các component lấy dữ liệu từ redux store
export const selectCurrentCustomer = (state) => {
  return state.customer.currentCustomer
}

//selectIsCustomerLoggedIn: là 1 hàm selector giúp cho các component biết xem người dùng có đang đăng nhập hay không
export const selectIsCustomerLoggedIn = (state) => !!state.customer.currentCustomer
//selectCustomerName: là 1 hàm selector giúp cho các component biết tên của người dùng
//nếu người dùng chưa đăng nhập (currentCustomer === null) thì sẽ trả về chuỗi 'Guest'
export const selectCustomerName = (state) => {
  const customer = state.customer.currentCustomer
  if (!customer) return 'Guest'
  
  // Ưu tiên fullName, sau đó đến name, cuối cùng là 'Guest'
  return customer.fullName || customer.name || 'Guest'
}
// Lấy ID khách hàng (null nếu guest)
export const selectCustomerId = state => state.customer.currentCustomer?.id || null

export const customerReducer = customerSlice.reducer
