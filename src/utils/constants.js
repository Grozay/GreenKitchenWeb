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
  SHIPPER: 'SHIPPER',
  ADMIN: 'ADMIN'
}

// Membership Tiers
export const MEMBERSHIP_TIERS = {
  ENERGY: 'ENERGY',
  VITALITY: 'VITALITY',
  RADIANCE: 'RADIANCE'
}

//Employee Roles
export const EMPLOYEE_ROLES = {
  EMPLOYEE: 'EMPLOYEE',
  ADMIN: 'ADMIN'
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

export const IMAGE_DEFAULT = {
  IMAGE_WEEK_MEAL: 'http://res.cloudinary.com/dbq8itp9r/image/upload/v1755936835/i75eqgnrej3psk700afg.png',
  IMAGE_CUSTOM: 'http://res.cloudinary.com/dbq8itp9r/image/upload/v1755936835/i75eqgnrej3psk700afg.png'
}

export const HEALTHY_MESSAGES = {
  mealOrder1: 'Bữa sáng là khởi đầu hoàn hảo cho ngày mới, đừng bỏ lỡ để nạp năng lượng nhé!',
  mealOrder2: 'Bữa trưa giúp bạn tiếp tục bứt phá, hãy chọn món để nạp năng lượng!',
  mealOrder3: 'Ăn uống đúng giờ giúp cơ thể khỏe mạnh, đừng quên chăm sóc bản thân nhé!'
}
