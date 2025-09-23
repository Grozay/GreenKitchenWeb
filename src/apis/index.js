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
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/custom-meals/customer/${id}`)
  return response.data
}

export const createCustomerHealthyInfoAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/customer-health-info`, data)
  return response.data
}

export const updateCustomMealAPI = async (id, data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/apis/v1/custom-meals/${id}`, data)
  return response.data
}

export const deleteCustomMealAPI = async (id) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/apis/v1/custom-meals/${id}`)
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

//review menu meal
export const getMenuMealReviewsAPI = async (menuMealId, page = 0, size = 10) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/menu-meal-reviews/menu-meal/${menuMealId}?page=${page}&size=${size}`)
  return response.data
}

export const createMenuMealReviewAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/menu-meal-reviews`, data)
  return response.data
}

export const updateMenuMealReviewAPI = async (reviewId, data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/apis/v1/menu-meal-reviews/${reviewId}`, data)
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

// Stores
export const getStoresAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/stores`)
  return response.data
}

export const createStoreAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/stores`, data)
  return response.data
}

export const updateStoreAPI = async (id, data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/apis/v1/stores/${id}`, data)
  return response.data
}

export const deleteStoreAPI = async (id) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/apis/v1/stores/${id}`)
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

export const getCouponByIdAPI = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/coupons/${id}`)
  return response.data
}

export const updateCouponAPI = async (id, data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/apis/v1/coupons/admin/update/${id}`, data)
  return response.data
}

export const getCouponWithCustomersAPI = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/coupons/admin/${id}/with-customers`)
  return response.data
}


// Customer Coupon APIs
export const customerUseCouponAPI = async (data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/apis/v1/customer-coupons/use-coupon`, data)
  return response.data
}

export const createCustomerCouponAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/customer-coupons/create`, data)
  return response.data
}

export const getCustomerCouponsByCouponIdAPI = async (couponId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/customer-coupons/coupon/${couponId}`)
  return response.data
}

export const createBulkCustomerCouponsAPI = async (couponId, customerIds) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/coupons/admin/bulk-create-customer-coupons`, {
    couponId,
    customerIds
  })
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

export const submitFeedbackAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/support/feedback`, data)
  return response.data
}

export const submitSupportTicketAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/support/ticket`, data)
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

// AI Content Generation APIs
export const generateAIContentAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/posts/ai/generate`, data)
  return response.data
}

export const generateAITitleAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/posts/ai/generate-title`, data)
  return response.data
}

export const generateAIContentOnlyAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/posts/ai/generate-content`, data)
  return response.data
}

// Marketing - Email Scheduler & Cart Scan
export const triggerEmailSchedulerNowAPI = async () => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/email-scheduler/trigger-now`)
  return response.data
}

export const testEmailSchedulerScheduleAPI = async (hours = 2) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/email-scheduler/test-schedule?hours=${hours}`)
  return response.data
}

export const getCartScanStatsAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/cart-scan/stats`)
  return response.data
}

export const scanAndSendCartEmailsAPI = async () => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/cart-scan/scan-and-send-emails`)
  return response.data
}

export const getSchedulerInfoAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/email-scheduler/info`)
  return response.data
}

// Admin Broadcast Email APIs
export const broadcastEmailNowAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/email-admin/broadcast`, data)
  return response.data
}

export const broadcastEmailScheduleAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/email-admin/broadcast-schedule`, data)
  return response.data
}

export const broadcastPreviewAPI = async (to, data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/email-admin/preview?to=${encodeURIComponent(to)}`, data)
  return response.data
}

// Email History APIs
export const getEmailHistoryAPI = async (page = 0, size = 10, emailType = null, status = null) => {
  const params = new URLSearchParams({ page: page.toString(), size: size.toString() })
  if (emailType) params.append('emailType', emailType)
  if (status) params.append('status', status)

  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/email-admin/history?${params}`)
  return response.data
}

export const getEmailStatisticsAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/email-admin/statistics`)
  return response.data
}

export const getEmailHistoryByIdAPI = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/email-admin/history/${id}`)
  return response.data
}

export const testEmailSchedulerAPI = async () => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/email-admin/test-scheduler`)
  return response.data
}

// One-off Scheduled Email API
export const scheduleOneOffEmailAPI = async (data) => {
  // Backend endpoint base is /emails/schedule
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/emails/schedule`, data)
  return response.data
}

// Cart Abandonment Schedule APIs
export const createCartAbandonmentScheduleAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/cart-abandonment-schedule`, data)
  return response.data
}

export const updateCartAbandonmentScheduleAPI = async (id, data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/apis/v1/cart-abandonment-schedule/${id}`, data)
  return response.data
}

export const getAllCartAbandonmentSchedulesAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/cart-abandonment-schedule`)
  return response.data
}

export const getCartAbandonmentScheduleByIdAPI = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/cart-abandonment-schedule/${id}`)
  return response.data
}

export const deleteCartAbandonmentScheduleAPI = async (id) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/apis/v1/cart-abandonment-schedule/${id}`)
  return response.data
}

export const toggleCartAbandonmentScheduleAPI = async (id) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/apis/v1/cart-abandonment-schedule/${id}/toggle`)
  return response.data
}

export const checkCartAbandonmentScheduleNameAPI = async (scheduleName, excludeId = null) => {
  const params = new URLSearchParams({ scheduleName })
  if (excludeId) params.append('excludeId', excludeId)
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/cart-abandonment-schedule/check-name?${params}`)
  return response.data
}

export const getCartAbandonmentScheduleStatisticsAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/cart-abandonment-schedule/statistics`)
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

// Holidays APIs - Using Nager.Date Public API
export const getUpcomingHolidaysAPI = async (fromDate = null, daysAhead = 120) => {
  try {
    // Try Nager.Date API first
    const currentYear = new Date().getFullYear()
    const nextYear = currentYear + 1

    const [currentYearHolidays, nextYearHolidays] = await Promise.all([
      fetch(`https://date.nager.at/api/v3/PublicHolidays/${currentYear}/VN`).then(res => res.json()),
      fetch(`https://date.nager.at/api/v3/PublicHolidays/${nextYear}/VN`).then(res => res.json())
    ])

    const allHolidays = [...currentYearHolidays, ...nextYearHolidays]

    // Filter upcoming holidays
    const now = new Date()
    const futureDate = new Date()
    futureDate.setDate(now.getDate() + (daysAhead || 120))

    const upcomingHolidays = allHolidays
      .filter(holiday => {
        const holidayDate = new Date(holiday.date)
        return holidayDate >= now && holidayDate <= futureDate
      })
      .map(holiday => ({
        id: holiday.date,
        name: holiday.name,
        date: holiday.date,
        country: 'VN',
        lunar: holiday.name.toLowerCase().includes('tết') || holiday.name.toLowerCase().includes('trung thu'),
        daysUntil: Math.ceil((new Date(holiday.date) - now) / (1000 * 60 * 60 * 24))
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))

    return upcomingHolidays
  } catch (error) {
    console.warn('Nager.Date API failed, falling back to backend:', error)
    // Fallback to backend API
    const params = new URLSearchParams()
    if (fromDate) params.append('fromDate', fromDate)
    if (daysAhead) params.append('daysAhead', daysAhead.toString())
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/holidays/upcoming?${params}`)
    return response.data
  }
}

// Holiday Admin CRUD
export const adminListHolidaysAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/holidays/admin`)
  return response.data
}

export const adminCreateHolidayAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/holidays/admin`, data)
  return response.data
}

export const adminUpdateHolidayAPI = async (id, data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/apis/v1/holidays/admin/${id}`, data)
  return response.data
}

export const adminDeleteHolidayAPI = async (id) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/apis/v1/holidays/admin/${id}`)
}

// Additional Public Holiday APIs
export const getVietnamPublicHolidaysAPI = async (year = null) => {
  const targetYear = year || new Date().getFullYear()
  try {
    const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${targetYear}/VN`)
    if (!response.ok) throw new Error('API request failed')
    return await response.json()
  } catch (error) {
    console.warn('Vietnam holidays API failed:', error)
    return []
  }
}

export const getBlackFridayDateAPI = async (year = null) => {
  const targetYear = year || new Date().getFullYear()
  try {
    // Black Friday is the Friday after Thanksgiving (4th Thursday of November)
    const thanksgiving = new Date(targetYear, 10, 1) // November 1st
    thanksgiving.setDate(1 + (11 - thanksgiving.getDay()) % 7 + 21) // 4th Thursday

    const blackFriday = new Date(thanksgiving)
    blackFriday.setDate(thanksgiving.getDate() + 1) // Friday after Thanksgiving

    return {
      id: `black-friday-${targetYear}`,
      date: blackFriday.toISOString().split('T')[0],
      name: 'Black Friday',
      country: 'US',
      description: 'Biggest shopping day of the year',
      year: targetYear
    }
  } catch (error) {
    console.warn('Black Friday calculation failed:', error)
    return null
  }
}

export const getThanksgivingDateAPI = async (year = null) => {
  const targetYear = year || new Date().getFullYear()
  try {
    // 4th Thursday of November
    const thanksgiving = new Date(targetYear, 10, 1) // November 1st
    thanksgiving.setDate(1 + (11 - thanksgiving.getDay()) % 7 + 21) // 4th Thursday

    return {
      id: `thanksgiving-${targetYear}`,
      date: thanksgiving.toISOString().split('T')[0],
      name: 'Thanksgiving Day (US)',
      country: 'US',
      description: '4th Thursday of November',
      year: targetYear
    }
  } catch (error) {
    console.warn('Thanksgiving calculation failed:', error)
    return null
  }
}

export const getSpecialEventsAPI = async (year = null) => {
  const targetYear = year || new Date().getFullYear()
  try {
    // Cyber Monday (Monday after Thanksgiving)
    const thanksgiving = new Date(targetYear, 10, 1)
    thanksgiving.setDate(1 + (11 - thanksgiving.getDay()) % 7 + 21)
    const cyberMonday = new Date(thanksgiving)
    cyberMonday.setDate(thanksgiving.getDate() + 4) // Monday after Thanksgiving

    return [
      {
        id: `cyber-monday-${targetYear}`,
        name: 'Cyber Monday',
        date: cyberMonday.toISOString().split('T')[0],
        country: 'US',
        description: 'Online shopping day after Thanksgiving',
        year: targetYear
      }
    ]
  } catch (error) {
    console.warn('Special events calculation failed:', error)
    return []
  }
}
// Settings APIs
export const getSettingsAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/settings`)
  return response.data
}

export const getSettingsByTypeAPI = async (settingType) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/settings/type/${settingType}`)
  return response.data
}

export const saveSettingAPI = async (key, value, settingType) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/settings/save`, {
    key,
    value,
    settingType
  })
  return response.data
}

export const saveSettingsBulkAPI = async (settings, settingType) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/settings/save-bulk`, {
    settings,
    settingType
  })
  return response.data
}

export const deleteSettingAPI = async (key) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/apis/v1/settings/${key}`)
  return response.data
}

export const deactivateSettingAPI = async (key) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/apis/v1/settings/${key}/deactivate`)
  return response.data
}

// Users API
export const getAllUsersAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/customers`)

  return response.data
}

// Holiday Email Template APIs
export const getHolidayEmailTemplateAPI = async (holidayId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/holidays/email/templates/${holidayId}`)
  return response.data
}

export const getHolidayEmailTemplateWithTypeAPI = async (holidayId, templateType) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/holidays/email/templates/${holidayId}/${templateType}`)
  return response.data
}

export const scheduleHolidayEmailAPI = async (request) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/holidays/email/schedule`, request)
  return response.data
}

export const sendImmediateHolidayEmailAPI = async (request) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/holidays/email/send-immediate`, request)
  return response.data
}

export const getAvailableTemplateTypesAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/holidays/email/template-types`)
  return response.data
}

// Get scheduled holiday emails
export const getScheduledHolidayEmailsAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/holidays/email/scheduled`)
  return response.data
}

// Delete scheduled holiday email
export const deleteScheduledHolidayEmailAPI = async (scheduleId) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/apis/v1/holidays/email/scheduled/${scheduleId}`)
  return response.data
}

// Update scheduled holiday email
export const updateScheduledHolidayEmailAPI = async (scheduleId, data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/apis/v1/holidays/email/scheduled/${scheduleId}`, data)
  return response.data
}

// Email Tracking APIs
export const getEmailTrackingStatsAPI = async (emailType) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/email-tracking/stats/${emailType}`)
  return response.data
}

export const getCustomerTrackingStatsAPI = async (customerId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/email-tracking/customer-stats/${customerId}`)
  return response.data
}

export const getEmailTrackingInfoAPI = async (trackingId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/email-tracking/info/${trackingId}`)
  return response.data
}

// Email Admin Tracking APIs
export const getCartAbandonmentTrackingStatsAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/email-admin/tracking-stats/cart-abandonment`)
  return response.data
}

export const getCustomerEmailTrackingStatsAPI = async (customerId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/email-admin/tracking-stats/customer/${customerId}`)
  return response.data
}