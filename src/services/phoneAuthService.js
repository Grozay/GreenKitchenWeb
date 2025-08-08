import {
  RecaptchaVerifier,
  signInWithPhoneNumber
} from 'firebase/auth'
import { auth } from '../utils/firebase'

class PhoneAuthService {
  constructor() {
    this.recaptchaVerifier = null
    this.confirmationResult = null
  }

  // Setup reCAPTCHA (invisible to avoid UI interruption)
  setupRecaptcha(elementId = 'recaptcha-container') {
    if (!this.recaptchaVerifier) {
      this.recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
        size: 'invisible', // Invisible reCAPTCHA
        callback: () => {
          // reCAPTCHA solved, will automatically proceed
          // console.log('reCAPTCHA solved successfully')
        },
        'expired-callback': () => {
          // reCAPTCHA expired, need to reset
          // console.log('reCAPTCHA expired, resetting...')
          this.resetRecaptcha()
        },
        'error-callback': () => {
          // reCAPTCHA error
          // console.log('reCAPTCHA error occurred')
        }
      })
    }
    return this.recaptchaVerifier
  }

  // Gửi OTP đến số điện thoại
  async sendOTP(phoneNumber) {
    try {
      // Format số điện thoại Việt Nam
      const formattedPhone = this.formatVietnamesePhone(phoneNumber)
      // console.log('Original phone:', phoneNumber)
      // console.log('Formatted phone:', formattedPhone)

      // Check if this is a test phone number
      const isTestPhone = formattedPhone === '+84933032332'

      if (!this.recaptchaVerifier) {
        // console.log('Setting up reCAPTCHA...')
        this.setupRecaptcha()
      }

      // console.log('Sending OTP to:', formattedPhone)

      this.confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        this.recaptchaVerifier
      )

      // console.log('SMS sent successfully, verification ID:', this.confirmationResult.verificationId)

      // Different message for test vs real numbers
      const message = isTestPhone
        ? 'Đây là số test! Mã OTP là: 444888'
        : 'Mã OTP đã được gửi đến số điện thoại của bạn'

      return {
        success: true,
        message: message,
        verificationId: this.confirmationResult.verificationId,
        isTestPhone: isTestPhone
      }
    } catch (error) {
      // console.error('Error sending OTP:', error)
      // console.error('Error code:', error.code)
      // console.error('Error message:', error.message)
      this.resetRecaptcha() // Reset on error
      return {
        success: false,
        message: this.getErrorMessage(error.code),
        error: error.code
      }
    }
  }

  // Xác thực OTP
  async verifyOTP(otpCode) {
    try {
      if (!this.confirmationResult) {
        throw new Error('No verification in progress')
      }

      const result = await this.confirmationResult.confirm(otpCode)
      const user = result.user

      // Lấy Firebase ID Token để gửi về backend
      const idToken = await user.getIdToken()

      return {
        success: true,
        user: {
          uid: user.uid,
          phoneNumber: user.phoneNumber,
          idToken: idToken
        },
        message: 'Xác thực thành công'
      }
    } catch (error) {
      // console.error('Error verifying OTP:', error)
      return {
        success: false,
        message: this.getErrorMessage(error.code),
        error: error.code
      }
    }
  }

  // Format số điện thoại Việt Nam
  formatVietnamesePhone(phoneNumber) {
    // Loại bỏ tất cả ký tự không phải số
    let cleaned = phoneNumber.replace(/\D/g, '')

    // Nếu bắt đầu bằng 0, thay thế bằng +84
    if (cleaned.startsWith('0')) {
      cleaned = '+84' + cleaned.substring(1)
    }
    // Nếu bắt đầu bằng 84, thêm +
    else if (cleaned.startsWith('84')) {
      cleaned = '+' + cleaned
    }
    // Nếu không có country code, thêm +84
    else if (!cleaned.startsWith('+84')) {
      cleaned = '+84' + cleaned
    }

    return cleaned
  }

  // Reset reCAPTCHA
  resetRecaptcha() {
    if (this.recaptchaVerifier) {
      this.recaptchaVerifier.clear()
      this.recaptchaVerifier = null
    }
    this.confirmationResult = null
  }

  // Lấy error message tiếng Việt
  getErrorMessage(errorCode) {
    switch (errorCode) {
    case 'auth/invalid-phone-number':
      return 'Số điện thoại không hợp lệ'
    case 'auth/too-many-requests':
      return 'Quá nhiều yêu cầu. Vui lòng thử lại sau'
    case 'auth/invalid-verification-code':
      return 'Mã OTP không đúng'
    case 'auth/code-expired':
      return 'Mã OTP đã hết hạn'
    case 'auth/missing-verification-code':
      return 'Vui lòng nhập mã OTP'
    case 'auth/quota-exceeded':
      return 'Đã vượt quá giới hạn gửi SMS'
    case 'auth/captcha-check-failed':
      return 'Xác thực reCAPTCHA thất bại'
    case 'auth/invalid-app-credential':
      return 'Thông tin xác thực ứng dụng không hợp lệ'
    case 'auth/app-not-authorized':
      return 'Ứng dụng chưa được ủy quyền'
    default:
      return 'Có lỗi xảy ra. Vui lòng thử lại'
    }
  }
}

export default new PhoneAuthService()
