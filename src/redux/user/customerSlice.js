import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'
import { toast } from 'react-toastify'
//khởi tạo gía trị state của 1 cái slice trong redux
const initialState = {
  currentCustomer: null
}

//Các hành động gọi api (bất đồng bộ) và cập nhập dữ liệu vào redux, dùng middleware CreateAsyncThunk đi kèm với extraReducers
export const loginCustomerApi = createAsyncThunk(
  'customer/loginCustomerApi',
  async (data) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/login`, data)
    return response.data
  }
)

export const googleLoginAPI = createAsyncThunk(
  'customer/googleLoginAPI',
  async (data) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/google-login`, data)
    return response.data
  }
)

export const logoutCustomerApi = createAsyncThunk(
  'customer/logoutCustomerApi',
  async (showSuccessMessage = true) => {
    const response = await authorizedAxiosInstance.delete(`${API_ROOT}/logout`)
    if (showSuccessMessage) {
      toast.success('Logout successfully')
    }
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

export const customerReducer = customerSlice.reducer
