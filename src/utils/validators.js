export const FIELD_REQUIRED_MESSAGE = 'This field is required.'
export const EMAIL_RULE = /^\S+@\S+\.\S+$/
export const EMAIL_RULE_MESSAGE = 'Email is invalid. (example@nexus.com)'
export const ACCOUNT_ID_RULE = /^[a-zA-Z0-9]+$/
export const ACCOUNT_ID_RULE_MESSAGE = 'Account ID is invalid. (only accept letters and numbers)'
export const OTP_RULE = /^\d{6}$/
export const OTP_RULE_MESSAGE = 'OTP is invalid. (only accept 6 numbers)'
// Stronger password validation - at least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
export const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,256}$/
export const PASSWORD_RULE_MESSAGE = 'Password must be at least 8 characters with uppercase, lowercase, number and special character.'
export const PASSWORD_CONFIRMATION_MESSAGE = 'Password Confirmation does not match!'
export const SALARY_RULE_MESSAGE = 'Salary must be greater than 0'
export const GENDER_RULE_MESSAGE = 'Gender is required.'
export const DOB_RULE_MESSAGE = 'Date of Birth is invalid.'
export const DOB_RULE = (value) => {
  // Kiểm tra định dạng ngày tháng năm YYYY-MM-DD
  const regex = /^\d{4}-\d{2}-\d{2}$/
  if (!regex.test(value)) return false
  // Chuyển đổi giá trị nhập vào thành đối tượng Date
  const inputDate = new Date(value)
  // Lấy ngày hiện tại
  const currentDate = new Date()
  // Đặt thời gian về 00:00:00 để chỉ so sánh ngày
  currentDate.setHours(0, 0, 0, 0)
  // Kiểm tra ngày nhập vào không lớn hơn ngày hiện tại
  return inputDate <= currentDate
}
export const PHONE_NUMBER_RULE = /^[0-9]{10}$/
export const PHONE_NUMBER_RULE_MESSAGE = 'Phone number must be 10 digits'
export const LATITUDE_RULE = /^-?\d{1,2}(\.\d+)?$/
export const LATITUDE_RULE_MESSAGE = 'Latitude must be a number between -90 and 90'
export const LONGITUDE_RULE = /^-?\d{1,3}(\.\d+)?$/
export const LONGITUDE_RULE_MESSAGE = 'Longitude must be a number between -180 and 180'
export const OPEN_AT_RULE = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/
export const OPEN_AT_RULE_MESSAGE = 'Open at must be a valid time format (HH:mm)'
export const CLOSE_AT_RULE = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/
export const CLOSE_AT_RULE_MESSAGE = 'Close at must be a valid time format (HH:mm)'

export const LIMIT_COMMON_FILE_SIZE = 10485760 // byte = 10 MB
export const ALLOW_COMMON_FILE_TYPES = ['image/jpg', 'image/jpeg', 'image/png']
export const singleFileValidator = (file) => {
  if (!file || !file.name || !file.size || !file.type) {
    return 'File cannot be blank.'
  }
  if (file.size > LIMIT_COMMON_FILE_SIZE) {
    return 'Maximum file size exceeded. (10MB)'
  }
  if (!ALLOW_COMMON_FILE_TYPES.includes(file.type)) {
    return 'File type is invalid. Only accept jpg, jpeg and png'
  }
  return null
}
