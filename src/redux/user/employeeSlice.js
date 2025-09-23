import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

//khởi tạo gía trị state của 1 cái slice trong redux
const initialState = {
  currentEmployee: null
}

//Các hành động gọi api (bất đồng bộ) và cập nhập dữ liệu vào redux, dùng middleware CreateAsyncThunk đi kèm với extraReducers

//Employee
export const loginEmployeeApi = createAsyncThunk(
  'employee/loginEmployeeApi',
  async (data) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/auth/employee-login`, data)
    return response.data
  }
)

export const logoutEmployeeApi = createAsyncThunk(
  'employee/logoutEmployeeApi',
  async () => {
    const response = await authorizedAxiosInstance.delete(`${API_ROOT}/apis/v1/auth/employee-logout`)
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

      //update lại dữ liệu của currentEmployee
      state.currentEmployee = user
    })
    builder.addCase(logoutEmployeeApi.fulfilled, (state) => {
      state.currentEmployee = null
    })
  }
})

// export const { } = userSlice.actions

//selector: là nơi cho các component lấy dữ liệu từ redux store
export const selectCurrentEmployee = (state) => {
  return state.employee.currentEmployee
}

export const employeeReducer = employeeSlice.reducer