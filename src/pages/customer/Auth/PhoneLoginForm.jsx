import { Link, useNavigate, useLocation } from 'react-router-dom'
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
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { useForm } from 'react-hook-form'
import { FIELD_REQUIRED_MESSAGE } from '~/utils/validators'
import { useDispatch } from 'react-redux'
import { phoneLoginAPI } from '~/redux/user/customerSlice'
import { toast } from 'react-toastify'
import { useState, useEffect } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import phoneAuthService from '~/services/phoneAuthService'
import theme from '~/theme'

function PhoneLoginForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { register, handleSubmit, formState: { errors } } = useForm()

  const [step, setStep] = useState('phone')
  const [loading, setLoading] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [error, setError] = useState('')
  const [showBackConfirm, setShowBackConfirm] = useState(false)
  const [cooldownEndTime, setCooldownEndTime] = useState(null)
  const [remainingTime, setRemainingTime] = useState(0)
  const [remainingSeconds, setRemainingSeconds] = useState(0)
  const [attemptCount, setAttemptCount] = useState(0)
  const [showCooldown, setShowCooldown] = useState(false)
  const [otpExpiryTime, setOtpExpiryTime] = useState(null)
  const [otpRemainingMinutes, setOtpRemainingMinutes] = useState(0)
  const [otpRemainingSeconds, setOtpRemainingSeconds] = useState(0)

  // Get location user wanted to access before redirect to login
  const from = location.state?.from?.pathname || '/profile/overview'

  // Check if user is in cooldown (3 attempts allowed in 15 minutes for any phone number)
  const checkCooldown = () => {
    const cooldownKey = 'phone_cooldown_global'
    const attemptsKey = 'phone_attempts_global'
    const savedCooldown = localStorage.getItem(cooldownKey)
    const savedAttempts = localStorage.getItem(attemptsKey)
    
    if (savedCooldown && savedAttempts) {
      const attempts = JSON.parse(savedAttempts)
      const now = Date.now()
      
      // Remove attempts older than 15 minutes
      const validAttempts = attempts.filter(attemptTime => (now - attemptTime) < (15 * 60 * 1000))
      
      if (validAttempts.length >= 3) {
        // User has made 3 attempts, check if cooldown period has passed
        const oldestAttempt = Math.min(...validAttempts)
        const cooldownEndTime = oldestAttempt + (15 * 60 * 1000)
        
        if (now < cooldownEndTime) {
          const remainingMs = cooldownEndTime - now
          const totalSeconds = Math.ceil(remainingMs / 1000)
          const minutes = Math.floor(totalSeconds / 60)
          const seconds = totalSeconds % 60
          
          // Set the countdown state
          setCooldownEndTime(cooldownEndTime)
          setRemainingTime(minutes)
          setRemainingSeconds(seconds)
          setAttemptCount(validAttempts.length)
          setShowCooldown(true)
          
          return Math.ceil(remainingMs / (1000 * 60)) // Return minutes for backward compatibility
        } else {
          // Cooldown has passed, clean up old attempts
          localStorage.removeItem(cooldownKey)
          localStorage.removeItem(attemptsKey)
          setAttemptCount(0)
          setShowCooldown(false)
        }
      } else {
        // Update attempts list with valid ones
        localStorage.setItem(attemptsKey, JSON.stringify(validAttempts))
        setAttemptCount(validAttempts.length)
        if (validAttempts.length > 0) {
          setShowCooldown(true)
        }
      }
    }
    return 0
  }

  // Record attempt globally (not per phone number)
  const recordAttempt = () => {
    const attemptsKey = 'phone_attempts_global'
    const now = Date.now()
    
    // Get existing attempts
    let attempts = []
    const savedAttempts = localStorage.getItem(attemptsKey)
    if (savedAttempts) {
      attempts = JSON.parse(savedAttempts)
    }
    
    // Add new attempt
    attempts.push(now)
    
    // Remove attempts older than 15 minutes
    const validAttempts = attempts.filter(attemptTime => (now - attemptTime) < (15 * 60 * 1000))
    
    // Save attempts
    localStorage.setItem(attemptsKey, JSON.stringify(validAttempts))
    setAttemptCount(validAttempts.length)
    setShowCooldown(true)
    
    // If this is the 3rd attempt, set cooldown
    if (validAttempts.length >= 3) {
      const cooldownKey = 'phone_cooldown_global'
      const oldestAttempt = Math.min(...validAttempts)
      const endTime = oldestAttempt + (15 * 60 * 1000)
      localStorage.setItem(cooldownKey, endTime.toString())
      setCooldownEndTime(endTime)
    }
  }

  // Update remaining time every second
  useEffect(() => {
    if (cooldownEndTime) {
      const interval = setInterval(() => {
        const now = Date.now()
        const remainingMs = cooldownEndTime - now

        if (remainingMs <= 0) {
          setCooldownEndTime(null)
          setRemainingTime(0)
          setRemainingSeconds(0)
          clearInterval(interval)
        } else {
          const totalSeconds = Math.ceil(remainingMs / 1000)
          const minutes = Math.floor(totalSeconds / 60)
          const seconds = totalSeconds % 60
          setRemainingTime(minutes)
          setRemainingSeconds(seconds)
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [cooldownEndTime])

  // OTP expiry countdown timer
  useEffect(() => {
    if (otpExpiryTime) {
      const interval = setInterval(() => {
        const now = Date.now()
        const remainingMs = otpExpiryTime - now
        
        if (remainingMs <= 0) {
          setOtpExpiryTime(null)
          setOtpRemainingMinutes(0)
          setOtpRemainingSeconds(0)
          clearInterval(interval)
        } else {
          const totalSeconds = Math.ceil(remainingMs / 1000)
          const minutes = Math.floor(totalSeconds / 60)
          const seconds = totalSeconds % 60
          setOtpRemainingMinutes(minutes)
          setOtpRemainingSeconds(seconds)
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [otpExpiryTime])

  // Handle browser back button or navigation
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (step === 'otp') {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    const handlePopState = (e) => {
      if (step === 'otp') {
        e.preventDefault()
        setShowBackConfirm(true)
        // Push the current state back to prevent navigation
        window.history.pushState(null, '', window.location.pathname)
      }
    }

    if (step === 'otp') {
      window.addEventListener('beforeunload', handleBeforeUnload)
      window.addEventListener('popstate', handlePopState)
      // Push current state to handle back button
      window.history.pushState(null, '', window.location.pathname)
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('popstate', handlePopState)
    }
  }, [step])

  const submitPhoneNumber = async (data) => {
    // Check cooldown first
    const cooldownMinutes = checkCooldown()
    if (cooldownMinutes > 0) {
      const timeText = remainingTime > 0
        ? `${remainingTime}:${remainingSeconds.toString().padStart(2, '0')}`
        : `${remainingSeconds} seconds`
      const errorMessage = `You have reached the limit of 3 attempts. Please wait ${timeText} and try again.`
      setError(errorMessage)
      toast.error(errorMessage)
      return
    }

    setLoading(true)
    setError('')
    setPhoneNumber(data.phoneNumber)

    try {
      const result = await phoneAuthService.sendOTP(data.phoneNumber)
      if (result.success) {
        toast.success('OTP code has been sent successfully!')
        recordAttempt() // Record this attempt globally
        
        // Set OTP expiry time (15 minutes from now)
        const expiryTime = Date.now() + (15 * 60 * 1000)
        setOtpExpiryTime(expiryTime)
        setOtpRemainingMinutes(15)
        setOtpRemainingSeconds(0)
        
        setStep('otp')
      } else {
        setError(result.message)
        toast.error(result.message)
      }
    } catch {
      const errorMessage = 'An error occurred while sending OTP'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const submitOTPVerification = async () => {
    if (!otpCode.trim()) {
      setError('Please enter the OTP code')
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
      toast.success('OTP verification successful! 🎉')

      // Login with backend using Firebase ID token
      const loginData = {
        firebaseIdToken: verifyResult.user.idToken,
        phoneNumber: phoneNumber
      }

      // Call phone login API
      const result = await dispatch(phoneLoginAPI(loginData))

      if (phoneLoginAPI.fulfilled.match(result)) {
        toast.success('Login successful!')
        // Clear cooldown on successful login
        const cooldownKey = 'phone_cooldown_global'
        const attemptsKey = 'phone_attempts_global'
        localStorage.removeItem(cooldownKey)
        localStorage.removeItem(attemptsKey)
        setAttemptCount(0)
        setShowCooldown(false)
        // Redirect to the page user wanted to access
        navigate(from, { replace: true })
      } else {
        // Handle API error
        const errorMessage = result.payload?.message || 'Login failed. Please try again.'
        setError(errorMessage)
        toast.error(errorMessage)
      }
    } catch {
      const errorMessage = 'An error occurred during OTP verification'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleBackToPhone = () => {
    if (step === 'otp') {
      setShowBackConfirm(true)
    } else {
      resetToPhoneStep()
    }
  }

  const resetToPhoneStep = () => {
    phoneAuthService.resetRecaptcha()
    setStep('phone')
    setOtpCode('')
    setError('')
    setShowBackConfirm(false)
    // Reset OTP timer
    setOtpExpiryTime(null)
    setOtpRemainingMinutes(0)
    setOtpRemainingSeconds(0)
  }

  const handleConfirmBack = () => {
    resetToPhoneStep()
  }

  const handleCancelBack = () => {
    setShowBackConfirm(false)
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
                <Box sx={{ marginTop: '2em', marginBottom: '1.5em' }}>
                  <TextField
                    autoFocus
                    fullWidth
                    label="Enter phone number..."
                    type="tel"
                    variant="outlined"
                    placeholder="0987654321"
                    error={!!errors['phoneNumber']}
                    disabled={loading}
                    {...register('phoneNumber', {
                      required: FIELD_REQUIRED_MESSAGE,
                      pattern: {
                        value: /^(0[3-9])+([0-9]{8})$/,
                        message: 'Invalid phone number (Example: 0987654321)'
                      }
                    })}
                  />
                  {errors['phoneNumber'] && (
                    <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                      {errors['phoneNumber'].message}
                    </Typography>
                  )}
                </Box>

                {showCooldown && (remainingTime > 0 || remainingSeconds > 0) && (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    You have reached the limit of 3 attempts. Please wait{' '}
                    {remainingTime > 0 ? (
                      <strong>{remainingTime}:{remainingSeconds.toString().padStart(2, '0')}</strong>
                    ) : (
                      <strong>{remainingSeconds} seconds</strong>
                    )} and try again.
                  </Alert>
                )}

                {showCooldown && attemptCount > 0 && (remainingTime === 0 && remainingSeconds === 0) && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    You have used {attemptCount} out of 3 attempts. {3 - attemptCount} attempts remaining.
                  </Alert>
                )}
              </Box>

              <CardActions sx={{ padding: '0 1em 2em 1em' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  disabled={loading || (showCooldown && (remainingTime > 0 || remainingSeconds > 0))}
                >
                  {loading ? <CircularProgress size={24} /> : 'Send OTP Code'}
                </Button>
              </CardActions>
            </form>
          )}

          {/* OTP Verification Step */}
          {step === 'otp' && (
            <Box>
              <Box sx={{ padding: '0 1em' }}>
                <Typography variant="body2" sx={{ mb: 1, textAlign: 'center', color: 'text.secondary' }}>
                  OTP code has been sent to phone number
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, textAlign: 'center', fontWeight: 'bold' }}>
                  {phoneNumber}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, textAlign: 'center', color: 'primary.main', fontWeight: 600 }}>
                  📱 Please check your phone for the OTP code
                </Typography>
                
                {/* OTP Expiry Countdown */}
                {(otpRemainingMinutes > 0 || otpRemainingSeconds > 0) ? (
                  <Box sx={{
                    mb: 3,
                    p: 2,
                    backgroundColor: '#fff3cd',
                    border: '1px solid #ffeaa7',
                    borderRadius: 2,
                    textAlign: 'center'
                  }}>
                    <Typography variant="body2" sx={{ color: '#856404', fontWeight: 600 }}>
                      ⏰ Code expires in:{' '}
                      <span style={{ fontSize: '1.1em', fontWeight: 'bold' }}>
                        {otpRemainingMinutes}:{otpRemainingSeconds.toString().padStart(2, '0')}
                      </span>
                    </Typography>
                  </Box>
                ) : (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    ⚠️ OTP code has expired. Please go back and request a new one.
                  </Alert>
                )}
              </Box>

              <Box sx={{ padding: '0 1em 1em 1em' }}>
                <TextField
                  autoFocus
                  fullWidth
                  label="Enter OTP Code"
                  type="text"
                  variant="outlined"
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) => {
                    setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                    setError('')
                  }}
                  disabled={loading || (otpRemainingMinutes === 0 && otpRemainingSeconds === 0)}
                  inputProps={{
                    maxLength: 6,
                    style: { textAlign: 'center', fontSize: '1.2rem', letterSpacing: '0.5em' }
                  }}
                  sx={{ mb: 2 }}
                />
              </Box>

              <CardActions sx={{ padding: '0 1em 2em 1em', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  onClick={submitOTPVerification}
                  disabled={loading || otpCode.length !== 6 || (otpRemainingMinutes === 0 && otpRemainingSeconds === 0)}
                  sx={{
                    fontWeight: 500,
                    transition: 'background-color 0.2s ease-in-out, transform 0.1s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Verify & Login'}
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleBackToPhone}
                  disabled={loading}
                  fullWidth
                  sx={{
                    height: '42px',
                    fontWeight: 500,
                    transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out, transform 0.1s ease-in-out',
                    '&:hover': {
                      bgcolor: theme.palette.primary.light,
                      color: theme.palette.primary.contrastText,
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  Back to Phone Number
                </Button>
              </CardActions>
            </Box>
          )}

          {/* Divider */}
          <Box sx={{ padding: '0 1em 1.5em 1em', display: 'flex', alignItems: 'center', gap: 1 }}>
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
            gap: 2
          }}>
            <Button
              sx={{
                width: '100%',
                height: '42px',
                fontWeight: 500,
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
            padding: '0 1em 2em 1em',
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

      {/* Confirmation Dialog */}
      <Dialog
        open={showBackConfirm}
        onClose={handleCancelBack}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">
          Warning
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            Are you sure you want to go back? The current verification process will be lost and you&apos;ll need to start over.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelBack} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmBack} color="error" variant="contained">
            Yes, Go Back
          </Button>
        </DialogActions>
      </Dialog>

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
