import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'
import { toast } from 'react-toastify'
//khởi tạo gía trị state của 1 cái slice trong redux
const initialState = {
  currentEmployee: null
}

//Các hành động gọi api (bất đồng bộ) và cập nhập dữ liệu vào redux, dùng middleware CreateAsyncThunk đi kèm với extraReducers

//Employee
export const loginEmployeeApi = createAsyncThunk(
  'employee/loginEmployeeApi',
  async (data) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/employees/login`, data)
    return response.data
  }
)

export const logoutEmployeeApi = createAsyncThunk(
  'employee/logoutEmployeeApi',
  async (showSuccessMessage = true) => {
    const response = await authorizedAxiosInstance.delete(`${API_ROOT}/employees/logout`)
    if (showSuccessMessage) {
      toast.success('Logout successfully')
    }
    return response.data
  }
)

//tạo ra 1 slice trong redux store
export const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  //extraReducers: nơi xử lí dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(loginEmployeeApi.fulfilled, (state, action) => {
      //action.payload là dữ liệu trả về từ axios call api
      const user = action.payload

      //update lại dữ liệu của currentUser
      state.currentUser = user
    })
    builder.addCase(logoutEmployeeApi.fulfilled, (state) => {
      state.currentUser = null
    })
  }
})

// export const { } = userSlice.actions

//selector: là nơi cho các component lấy dữ liệu từ redux store
export const selectCurrentUser = (state) => {
  return state.user.currentUser
}

export const employeeReducer = employeeSlice.reducer