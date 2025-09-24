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
  NETWORK_ERROR: 'Network connection error. Please try again.',
  UNAUTHORIZED: 'You do not have access permission.',
  NOT_FOUND: 'Data not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Invalid data.',
  TOKEN_EXPIRED: 'Login session has expired.',
  UNKNOWN_ERROR: 'An error occurred.'
}

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  REGISTER_SUCCESS: 'Registration successful!',
  ORDER_CREATED: 'Order created successfully!',
  ORDER_UPDATED: 'Order updated successfully!',
  PAYMENT_SUCCESS: 'Payment successful!',
  PROFILE_UPDATED: 'Profile updated successfully!'
}

export const IMAGE_DEFAULT = {
  IMAGE_WEEK_MEAL: 'http://res.cloudinary.com/dbq8itp9r/image/upload/v1755936835/i75eqgnrej3psk700afg.png',
  IMAGE_CUSTOM: 'http://res.cloudinary.com/dbq8itp9r/image/upload/v1755936835/i75eqgnrej3psk700afg.png'
}

export const HEALTHY_MESSAGES = {
  mealOrder1: 'Breakfast is the perfect start to your day, don\'t miss it to energize yourself!',
  mealOrder2: 'Lunch helps you continue to break through, choose a dish to energize!',
  mealOrder3: 'Eating on time helps keep your body healthy, don\'t forget to take care of yourself!'
}
