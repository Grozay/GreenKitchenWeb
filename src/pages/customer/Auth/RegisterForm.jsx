// TrungQuanDev: https://youtube.com/@trungquandev
import { Link, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import LockIcon from '@mui/icons-material/Lock'
import Typography from '@mui/material/Typography'
import { Card as MuiCard } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import TextField from '@mui/material/TextField'
import Zoom from '@mui/material/Zoom'
import { useForm } from 'react-hook-form'
import { FIELD_REQUIRED_MESSAGE, EMAIL_RULE, EMAIL_RULE_MESSAGE, PASSWORD_RULE, PASSWORD_RULE_MESSAGE, PASSWORD_CONFIRMATION_MESSAGE } from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { registerCustomerAPI } from '~/apis'
import { toast } from 'react-toastify'
import Divider from '@mui/material/Divider'
import { GoogleLogin } from '@react-oauth/google'
import { useDispatch } from 'react-redux'
import { googleLoginAPI } from '~/redux/user/customerSlice'
import PasswordField from '~/components/Form/PasswordField'
import PasswordStrengthIndicator from '~/components/Form/PasswordStrengthIndicator'

function RegisterForm() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { register, handleSubmit, formState: { errors }, getValues, watch } = useForm()

  const watchPassword = watch('password', '')

  const submitRegister = (data) => {
    const { firstName, lastName, email, password } = data
    toast.promise(registerCustomerAPI({ firstName, lastName, email, password }), {
      pending: 'Registering...'
    }).then(user => {
      navigate(`/login?registeredEmail=${user.email}`)
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
        navigate('/')
      }
    })
  }

  const handleGoogleLoginError = () => {
    toast.error('Google login failed. Please try again.')
  }

  return (
    <form onSubmit={handleSubmit(submitRegister)}>
      <Zoom in={true} style={{ transitionDelay: '200ms' }}>
        <MuiCard sx={{ minWidth: 380, maxWidth: 380, marginTop: '6em' }}>
          <Box sx={{
            margin: '1em',
            display: 'flex',
            justifyContent: 'center',
            gap: 1
          }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}><LockIcon /></Avatar>
            <Typography variant="h4" align="center">Register</Typography>
          </Box>

          <Box sx={{ padding: '0.5em 1em 1em 1em' }}>
            {/* First Name and Last Name on same row for larger screens */}
            <Box sx={{
              marginTop: '1em',
              display: 'flex',
              flexDirection: 'row',
              gap: 2
            }}>
              <Box sx={{ flex: 1 }}>
                <TextField
                  autoFocus
                  fullWidth
                  label="Enter First Name..."
                  type="text"
                  variant="outlined"
                  error={!!errors['firstName']}
                  {...register('firstName', {
                    required: FIELD_REQUIRED_MESSAGE
                  })}
                />
                <FieldErrorAlert errors={errors} fieldName='firstName' />
              </Box>

              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label="Enter Last Name..."
                  type="text"
                  variant="outlined"
                  error={!!errors['lastName']}
                  {...register('lastName', {
                    required: FIELD_REQUIRED_MESSAGE
                  })}
                />
                <FieldErrorAlert errors={errors} fieldName='lastName' />
              </Box>
            </Box>

            <Box sx={{ marginTop: '1em' }}>
              <TextField
                // autoComplete="nope"
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
              <PasswordStrengthIndicator password={watchPassword} />
            </Box>

            <Box sx={{ marginTop: '1em' }}>
              <PasswordField
                label="Enter Password Confirmation..."
                error={!!errors['passwordConfirmation']}
                register={register}
                registerName="passwordConfirmation"
                registerOptions={{
                  validate: (value) => value === getValues('password') || PASSWORD_CONFIRMATION_MESSAGE
                }}
              />
              <FieldErrorAlert errors={errors} fieldName='passwordConfirmation' />
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
              Register
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

          {/* Google Login Button */}
          <Box sx={{ padding: '1em', display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginError}
              theme="outline"
              size="large"
              width="100%"
              text="signup_with"
            />
          </Box>

          {/* Login link */}
          <Box sx={{
            padding: '0 1em 1em 1em',
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            gap: 2
          }}>
            <Typography>Already have an account?</Typography>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Typography sx={{ fontWeight: 'bold', color: 'primary.main', '&:hover': { color: '#ffbb39' } }}>Log in!</Typography>
            </Link>
          </Box>
        </MuiCard>
      </Zoom>
    </form>
  )
}

export default RegisterForm
