import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom'
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
import LockIcon from '@mui/icons-material/Lock'
import { useForm } from 'react-hook-form'
import {
  PASSWORD_RULE_MESSAGE,
  FIELD_REQUIRED_MESSAGE,
  PASSWORD_RULE,
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE
} from '~/utils/validators'
import { useDispatch } from 'react-redux'
import { loginCustomerApi, googleLoginAPI } from '~/redux/user/customerSlice'
import { resendVerifyEmailApi } from '~/apis'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { toast } from 'react-toastify'
import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { GoogleLogin } from '@react-oauth/google'
import PasswordField from '~/components/Form/PasswordField'
import RememberMeCheckbox from '~/components/Form/RememberMeCheckbox'
import theme from '~/theme'

function LoginForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { register, handleSubmit, formState: { errors } } = useForm()

  let [searchParams] = useSearchParams()
  const registeredEmail = searchParams.get('registeredEmail')
  const verifiedEmail = searchParams.get('verifiedEmail')
  const passwordReseted = searchParams.get('passwordReseted')

  const [openResendVerifyPanel, setOpenResendVerifyPanel] = useState(false)
  const [resendEmail, setResendEmail] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  // Lấy location mà user muốn truy cập trước khi bị redirect đến login
  const from = location.state?.from?.pathname || '/profile/overview'

  const submitLogIn = (data) => {
    const { email, password } = data
    toast.promise(
      dispatch(loginCustomerApi({ email, password })), {
        pending: 'Logging in...'
      }
    ).then(res => {
      if (res.error?.message?.includes('not active')) {
        setResendEmail(email)
        setOpenResendVerifyPanel(true)
      }
      if (!res.error) {
        toast.success('Login successful!')
        // Redirect về trang user muốn truy cập trước đó
        navigate(from, { replace: true })
      }
    })
  }

  const handleResend = () => {
    const email = resendEmail.trim()
    toast.promise(
      resendVerifyEmailApi({ email }), {
        pending: 'Resending verification email...',
        success: 'Verification email resent successfully!'
      }
    ).then(() => {
      setOpenResendVerifyPanel(false)
      setResendEmail('')
    })
  }

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    toast.promise(
      dispatch(googleLoginAPI({ idToken: credentialResponse.credential })),
      {
        pending: 'Signing in with Google...',
        success: 'Google login successful!',
        error: 'Google login failed'
      }
    ).then(response => {
      if (!response.error) {
        // Redirect về trang user muốn truy cập trước đó
        navigate(from, { replace: true })
      }
    })
  }

  const handleGoogleLoginError = () => {
    toast.error('Google login failed. Please try again.')
  }

  return (
    <>
      <form onSubmit={handleSubmit(submitLogIn)} >
        <Zoom in={true} style={{ transitionDelay: '200ms' }}>
          <MuiCard sx={{ minWidth: 380, maxWidth: 380, marginTop: '1em' }}>
            <Box sx={{
              margin: '1em',
              display: 'flex',
              justifyContent: 'center',
              gap: 1
            }}>
              <Avatar sx={{ bgcolor: 'primary.main' }}><LockIcon /></Avatar>
              <Typography variant="h4" align="center">Login</Typography>
            </Box>

            <Box sx={{ marginTop: '1em', display: 'flex', justifyContent: 'center', flexDirection: 'column', padding: '0 1em' }}>
              {verifiedEmail && (
                <Alert severity="success" sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}>
                  Your email&nbsp;<Typography variant="span" sx={{ fontWeight: 'bold', '&:hover': { color: '#fdba26' } }}>{verifiedEmail}</Typography>&nbsp;has been verified.<br />Now you can login to enjoy our services! Have a good day!
                </Alert>
              )}

              {registeredEmail && (
                <Alert severity="info" sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}>
                  An email has been sent to&nbsp;<Typography variant="span" sx={{ fontWeight: 'bold', '&:hover': { color: '#fdba26' } }}>{registeredEmail}</Typography>
                  <br />Please check and verify your account before logging in!
                </Alert>
              )}

              {passwordReseted && (
                <Alert severity="success" sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}>
                  Your password has been reset successfully!<br />Please login with your new password.
                </Alert>
              )}
            </Box>

            <Box sx={{ padding: '0 1em 1em 1em' }}>
              <Box sx={{ marginTop: '1em' }}>
                <TextField
                  // autoComplete="nope"
                  autoFocus
                  fullWidth
                  label="Enter Email..."
                  type="text"
                  variant="outlined"
                  error={!!errors['email']}
                  {...register('email', {
                    required: FIELD_REQUIRED_MESSAGE,
                    pattern: {
                      value: EMAIL_RULE,
                      message: EMAIL_RULE_MESSAGE
                    }
                  })}
                />
                <FieldErrorAlert errors={errors} fieldName='email' />
              </Box>

              <Box sx={{ marginTop: '1em' }}>
                <PasswordField
                  label="Enter Password..."
                  error={!!errors['password']}
                  register={register}
                  registerName="password"
                  registerOptions={{
                    required: FIELD_REQUIRED_MESSAGE,
                    pattern: {
                      value: PASSWORD_RULE,
                      message: PASSWORD_RULE_MESSAGE
                    }
                  }}
                />
                <FieldErrorAlert errors={errors} fieldName='password' />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5em' }}>
                  <RememberMeCheckbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <Link to="/reset-password" style={{ textDecoration: 'none' }}>
                    <Typography variant="body2" sx={{ color: 'primary.main', '&:hover': { color: '#ffbb39' } }}>
                      Forgot Password?
                    </Typography>
                  </Link>
                </Box>
              </Box>
            </Box>
            <CardActions sx={{ padding: '0 1em 1em 1em' }}>
              <Button
                className='interceptor-loading'
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
              >
                Login
              </Button>
            </CardActions>

            {/* Divider */}
            <Box sx={{ padding: '0 1em', display: 'flex', alignItems: 'center', gap: 1 }}>
              <Divider sx={{ flex: 1 }} />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                OR
              </Typography>
              <Divider sx={{ flex: 1 }} />
            </Box>

            {/* Google and Phone Login Button */}
            <Box sx={{
              padding: '1em',
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 1.5
            }}>
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleLoginError}
                theme="outline"
                size="large"
                logo_alignment="center"
              />

              <Button sx={{
                width: '100%',
                height: '42px',
                fontSize: '0.875rem',
                fontWeight: 400,
                transform: 'none',
                transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out',
                '&:hover': {
                  bgcolor: theme.palette.primary.light,
                  color: theme.palette.primary.contrastText
                  // Remove all transform effects
                }
              }}
              onClick={() => navigate('/login-by-phone')}
              variant='outlined'>
                Login By Phone Number
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
                <Typography sx={{ fontWeight: 'bold', color: 'primary.main', '&:hover': { color: '#ffbb39' } }}>Sign up now!</Typography>
              </Link>
            </Box>
          </MuiCard>
        </Zoom>
      </form>

      {/* Resend verification email dialog */}
      <Dialog open={openResendVerifyPanel} onClose={() => setOpenResendVerifyPanel(false)}>
        <DialogTitle>Account Not Active</DialogTitle>
        <DialogContent>
          <Typography>
            Your account is not active. Would you like to resend the verification email to <b>{resendEmail}</b>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button className='interceptor-loading' onClick={() => setOpenResendVerifyPanel(false)}>Cancel</Button>
          <Button className='interceptor-loading' onClick={handleResend} variant="contained" color="primary">Resend Email</Button>
        </DialogActions>
      </Dialog>

    </>
  )
}

export default LoginForm
