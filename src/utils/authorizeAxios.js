import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '~/utils/formatter'
import { refreshTokenCustomerAPI } from '~/apis'
import { logoutCustomerApi } from '~/redux/user/customerSlice.js'
import { logoutEmployeeApi } from '~/redux/user/employeeSlice.js'

//Không thể import {store } from '~/redux/store.js' theo cách thông thường
//giải pháp: Inject store : là kỹ thuật khi cần sửa dụng biến redux store ở các file ngoài phạm vi component như file này
//Hiểu đơn giản: khi ứng dụng bắt đầu chạy, code sẽ chạy vào main.jsx đầu tiên, từ bến đó ta gọi hàm injectStore ngay lập tức để gán biến mainStore vào biến axiosReduxStore cục bộ trong file này
let axiosReduxStore
export const injectStore = (mainStore) => { axiosReduxStore = mainStore }

//khởi taoj một đới tượng axios (authorizeInstance) mục đính để cútoemr và cấu hình chung cho dự án.
const authorizedAxiosInstance = axios.create()
//thời gian chờ tối đa của 1 request: để 10p
authorizedAxiosInstance.defaults.timeout = 10 * 60 * 1000
//withCredentials: sẽ cho phép axios tự động gửi cookie trong mỗi request lên BE (phục vụ việc chúng ta sẽ lưu JWT token (refresh & access) vào trong httpOnly cookie của trình duyệt)
authorizedAxiosInstance.defaults.withCredentials = true

//Cấu hình interceptor cho authorizedAxiosInstance
// intercepter request: Can thiệp vào giữa mọi request api
authorizedAxiosInstance.interceptors.request.use((config) => {
  // Do something before request is sent

  // Kỹ thuật chặn spam click (Xem kĩ mô tả ở file formatter.js)
  interceptorLoadingElements(true)
  return config
}, (error) => {
  // Do something with request error
  return Promise.reject(error)
})

//Khởi tạo một cái promise cho việc gọi api refresh_token
//Mục đichs tạo ra promíe này để khi nào gọi api refresh_token xong xuôi thì mới retry lại nhiều api bị lỗi trước đó.
let refreshTokenPromise = null
// intercepter response: Can thiệp vào giữa mọi response nhận được từ BE
authorizedAxiosInstance.interceptors.response.use((response) => {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data

  // Kỹ thuật chặn spam click (Xem kĩ mô tả ở file formatter.js)
  interceptorLoadingElements(false)
  return response
}, (error) => {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  // Mọi mã http statú code namgừ ngoài khoảng 200 - 299 sẽ là error được và rơi vào đây

  // Kỹ thuật chặn spam click (Xem kĩ mô tả ở file formatter.js)
  interceptorLoadingElements(false)

  //Quang trọng: Xử lý việc refresh token tự động
  //Trường hợp 1: Nếu như nhận mã 401 thừ BE, thì gọi api đăng xuất luôn

  // Xử lý lỗi 401 - Token hết hạn hoặc không hợp lệ
  // console.log('Error response:', error?.response)
  if (error?.response?.status === 401) {

    axiosReduxStore.dispatch(logoutCustomerApi())

    return Promise.reject(error)
  }
  //Trường hợp 2: Nếu như nhận mã 410 thừ BE, thì gọi api refresh_token để lấy token mới
  //Đầu tiên lấy được cái request api đang bị lỗi thong qua error.config
  const originalRequests = error.config
  // Kiểm tra xem error.response có tồn tại không trước khi truy cập thuộc tính status
  if (error?.response?.status === 410 && !originalRequests._retry) {
    // Gán thêm một thuộc tính _retry vào originalRequests để biết được rằng đây là request đã được retry
    originalRequests._retry = true
    // Kiểm tra xem nếu chưa có refreshTokenPromise thì thực hiện việc gọi api refresh_token
    if (!refreshTokenPromise) {
      refreshTokenPromise = refreshTokenCustomerAPI()

      refreshTokenPromise = refreshTokenPromise
        .then((data) => {
          // AccessToken đã nằm trong httpOnly cookie (xử lý từ BE)
          return data?.accessToken
        })
        .catch((_error) => {
          // Nếu nhận bất kì lỗi nào từ api refresh token thì cứ logout luô
          axiosReduxStore.dispatch(logoutCustomerApi())

          return Promise.reject(_error)
        })
        .finally(() => {
          // Dù api có oke hay lỗi thì vẫn luôn gán lại cái refreshTokenPromise = null như ban đầu
          refreshTokenPromise = null
        })
    }
    // Kiểm tra xem nếu chưa có refreshTokenPromise2 thì thực hiện việc gọi api refresh_token
    // Khi refreshTokenPromise được gán xong, thì sẽ retry lại cái request api bị lỗi
    // eslint-disable-next-line no-unused-vars
    return refreshTokenPromise.then((accessToken) => {
      // Return lại axios instance của chúng ta kết hợp các originalRequests để gọi lại những api ban đầu bị lỗi
      return authorizedAxiosInstance(originalRequests)
    })
  }

  // Xử lý tập trung phần hiển thị thông báo lỗi trả về từ mọi API ở đây (viết cod emột lần: Clean Code)
  // console.log error ra là sẽ thâý cấu trúc data dẫn tới message lỗi như dưới đây
  // console.log(error)
  let errorMessage = error?.message
  if (error?.response?.data) {
    errorMessage = error?.response?.data
  }

  // Dùng toastify để hiển thị bất kể mọi mã lỗi lên màn hình -- ngoại trừ 410 -- GONE phục vụ việc tự động refresh token
  if (error?.response?.status !== 410) {
    toast.error(errorMessage)
  }
  return Promise.reject(errorMessage)
})

export default authorizedAxiosInstance