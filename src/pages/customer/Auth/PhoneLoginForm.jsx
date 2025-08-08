import { Link, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { Card as MuiCard } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import TextField from '@mui/material/TextField'
import Zoom from '@mui/material/Zoom'
import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar'
import PhoneIcon from '@mui/icons-material/Phone'
import { useForm } from 'react-hook-form'
import { FIELD_REQUIRED_MESSAGE } from '~/utils/validators'
import { useDispatch } from 'react-redux'
import { phoneLoginAPI } from '~/redux/user/customerSlice'
import { toast } from 'react-toastify'
import { useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import phoneAuthService from '~/services/phoneAuthService'
import theme from '~/theme'

function PhoneLoginForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm()

  const [step, setStep] = useState('phone') // 'phone' or 'otp'
  const [loading, setLoading] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [error, setError] = useState('')

  const submitPhoneNumber = async (data) => {
    setLoading(true)
    setError('')
    setPhoneNumber(data.phoneNumber)

    try {
      const result = await phoneAuthService.sendOTP(data.phoneNumber)
      
      if (result.success) {
        toast.success(result.message)
        setStep('otp')
        
        // If it's a test phone, show the OTP code in console and alert
        if (result.isTestPhone) {
          // console.log('🔥 TEST PHONE DETECTED: OTP Code is 444888')
          toast.info('Số test phone! OTP: 444888')
        }
      } else {
        setError(result.message)
        toast.error(result.message)
      }
    } catch {
      const errorMessage = 'Có lỗi xảy ra khi gửi OTP'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const submitOTPVerification = async () => {
    if (!otpCode.trim()) {
      setError('Vui lòng nhập mã OTP')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Verify OTP with Firebase
      const verifyResult = await phoneAuthService.verifyOTP(otpCode)

      if (!verifyResult.success) {
        setError(verifyResult.message)
        toast.error(verifyResult.message)
        setLoading(false)
        return
      }

      // 🎉 OTP Verification successful!
      toast.success('Xác thực OTP thành công! 🎉')
      
      // Login with backend using Firebase ID token
      const loginData = {
        firebaseIdToken: verifyResult.user.idToken,
        phoneNumber: phoneNumber
      }

      // Call phone login API
      const result = await dispatch(phoneLoginAPI(loginData))
      
      if (phoneLoginAPI.fulfilled.match(result)) {
        toast.success('Đăng nhập thành công!')
        navigate('/')
      } else {
        // Handle API error
        const errorMessage = result.payload?.message || 'Đăng nhập thất bại. Vui lòng thử lại.'
        setError(errorMessage)
        toast.error(errorMessage)
      }
    } catch {
      const errorMessage = 'Có lỗi xảy ra khi xác thực OTP'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setLoading(true)
    setError('')
    
    try {
      phoneAuthService.resetRecaptcha()
      const result = await phoneAuthService.sendOTP(phoneNumber)
      
      if (result.success) {
        toast.success('Mã OTP mới đã được gửi')
        setOtpCode('')
      } else {
        setError(result.message)
        toast.error(result.message)
      }
    } catch {
      const errorMessage = 'Có lỗi xảy ra khi gửi lại OTP'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleBackToPhone = () => {
    phoneAuthService.resetRecaptcha()
    setStep('phone')
    setOtpCode('')
    setError('')
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 100px)',
      padding: 2
    }}>
      <Zoom in={true} style={{ transitionDelay: '200ms' }}>
        <MuiCard sx={{ minWidth: 380, maxWidth: 380, marginTop: '1em' }}>
          <Box sx={{
            margin: '1em',
            display: 'flex',
            justifyContent: 'center',
            gap: 1
          }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}><PhoneIcon /></Avatar>
            <Typography variant="h4" align="center">
              {step === 'phone' ? 'Phone Login' : 'Enter OTP'}
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Box sx={{ padding: '0 1em' }}>
              <Alert severity="error" sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}>
                {error}
              </Alert>
            </Box>
          )}

          {/* Phone Number Step */}
          {step === 'phone' && (
            <form onSubmit={handleSubmit(submitPhoneNumber)}>
              <Box sx={{ padding: '0 1em 1em 1em' }}>
                <Box sx={{ marginTop: '1em' }}>
                  <TextField
                    autoFocus
                    fullWidth
                    label="Nhập số điện thoại..."
                    type="tel"
                    variant="outlined"
                    placeholder="0987654321"
                    error={!!errors['phoneNumber']}
                    disabled={loading}
                    {...register('phoneNumber', {
                      required: FIELD_REQUIRED_MESSAGE,
                      pattern: {
                        value: /^(0[3-9])+([0-9]{8})$/,
                        message: 'Số điện thoại không hợp lệ (VD: 0987654321)'
                      }
                    })}
                  />
                  {errors['phoneNumber'] && (
                    <Typography variant="body2" color="error" sx={{ mt: 0.5 }}>
                      {errors['phoneNumber'].message}
                    </Typography>
                  )}
                </Box>
              </Box>

              <CardActions sx={{ padding: '0 1em 1em 1em' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Gửi mã OTP'}
                </Button>
              </CardActions>
            </form>
          )}

          {/* OTP Verification Step */}
          {step === 'otp' && (
            <Box>
              <Box sx={{ padding: '0 1em' }}>
                <Typography variant="body2" sx={{ mb: 2, textAlign: 'center', color: 'text.secondary' }}>
                  Mã OTP đã được gửi đến số điện thoại
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, textAlign: 'center', fontWeight: 'bold' }}>
                  {phoneNumber}
                </Typography>
              </Box>

              <Box sx={{ padding: '0 1em 1em 1em' }}>
                <TextField
                  autoFocus
                  fullWidth
                  label="Nhập mã OTP"
                  type="text"
                  variant="outlined"
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) => {
                    setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                    setError('')
                  }}
                  disabled={loading}
                  inputProps={{
                    maxLength: 6,
                    style: { textAlign: 'center', fontSize: '1.2rem', letterSpacing: '0.5em' }
                  }}
                />
              </Box>

              <CardActions sx={{ padding: '0 1em 1em 1em', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  onClick={submitOTPVerification}
                  disabled={loading || otpCode.length !== 6}
                >
                  {loading ? <CircularProgress size={24} /> : 'Xác thực & Đăng nhập'}
                </Button>

                <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleBackToPhone}
                    disabled={loading}
                    sx={{ flex: 1 }}
                  >
                    Quay lại
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleResendOTP}
                    disabled={loading}
                    sx={{ flex: 1 }}
                  >
                    Gửi lại OTP
                  </Button>
                </Box>
              </CardActions>
            </Box>
          )}

          {/* Divider */}
          <Box sx={{ padding: '0 1em', display: 'flex', alignItems: 'center', gap: 1 }}>
            <Divider sx={{ flex: 1 }} />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              OR
            </Typography>
            <Divider sx={{ flex: 1 }} />
          </Box>

          {/* Other Login Options */}
          <Box sx={{
            padding: '1em',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 1.5
          }}>
            <Button
              sx={{
                width: '100%',
                height: '42px',
                fontSize: '0.875rem',
                fontWeight: 400,
                transform: 'none',
                transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out',
                '&:hover': {
                  bgcolor: theme.palette.primary.light,
                  color: theme.palette.primary.contrastText
                }
              }}
              onClick={() => navigate('/login')}
              variant='outlined'
              disabled={loading}
            >
              Login with Email
            </Button>
          </Box>

          {/* Sign up link */}
          <Box sx={{
            padding: '0 1em 1em 1em',
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            gap: 2
          }}>
            <Typography>New to Green Kitchen?</Typography>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Typography sx={{ fontWeight: 'bold', color: 'primary.main', '&:hover': { color: '#ffbb39' } }}>
                Sign up now!
              </Typography>
            </Link>
          </Box>
        </MuiCard>
      </Zoom>

      {/* Hidden reCAPTCHA container */}
      <div id="recaptcha-container" style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        background: 'white',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }}></div>
    </Box>
  )
}

export default PhoneLoginForm
