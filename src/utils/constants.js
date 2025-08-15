// Dynamic API_ROOT based on current hostname
const getApiRoot = () => {
  if (import.meta.env.VITE_API_ROOT) {
    return import.meta.env.VITE_API_ROOT
  }

  const hostname = window.location.hostname
  return `http://${hostname}:8080`
}

export const API_ROOT = getApiRoot()

// Order Status
export const ORDER_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PREPARING: 'PREPARING',
  SHIPPING: 'SHIPPING',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED'
}

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED'
}

// Payment Methods
export const PAYMENT_METHOD = {
  COD: 'COD',
  PAYPAL: 'PAYPAL'
}

// User Roles
export const USER_ROLES = {
  CUSTOMER: 'CUSTOMER',
  EMPLOYEE: 'EMPLOYEE',
  ADMIN: 'ADMIN'
}

// Membership Tiers
export const MEMBERSHIP_TIERS = {
  ENERGY: 'ENERGY',
  VITALITY: 'VITALITY',
  RADIANCE: 'RADIANCE'
}

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Lỗi kết nối mạng. Vui lòng thử lại.',
  UNAUTHORIZED: 'Bạn không có quyền truy cập.',
  NOT_FOUND: 'Không tìm thấy dữ liệu.',
  SERVER_ERROR: 'Lỗi máy chủ. Vui lòng thử lại sau.',
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ.',
  TOKEN_EXPIRED: 'Phiên đăng nhập đã hết hạn.',
  UNKNOWN_ERROR: 'Đã có lỗi xảy ra.'
}

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Đăng nhập thành công!',
  REGISTER_SUCCESS: 'Đăng ký thành công!',
  ORDER_CREATED: 'Đặt hàng thành công!',
  ORDER_UPDATED: 'Cập nhật đơn hàng thành công!',
  PAYMENT_SUCCESS: 'Thanh toán thành công!',
  PROFILE_UPDATED: 'Cập nhật thông tin thành công!'
}
