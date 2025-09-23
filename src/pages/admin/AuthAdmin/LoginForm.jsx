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
import { loginEmployeeApi } from '~/redux/user/employeeSlice'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { toast } from 'react-toastify'
import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import PasswordField from '~/components/Form/PasswordField'
import theme from '~/theme'

function LoginForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm()

  let [searchParams] = useSearchParams()
  const passwordReseted = searchParams.get('passwordReseted')


  const submitLogIn = (data) => {
    const { email, password } = data
    toast.promise(
      dispatch( loginEmployeeApi({ email, password })), {
        pending: 'Logging in...'
      }
    ).then(res => {
      if (!res.error) {
        toast.success('Login successful!')
        // Redirect về trang user muốn truy cập trước đó
        navigate('/management')
      }
    })
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
              {passwordReseted && (
                <Alert severity="success" sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}>
                  Your password has been reset successfully. You can now log in with your new password.
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

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '0.5em' }}>
                  <Link to="/management/reset-password" style={{ textDecoration: 'none' }}>
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

          </MuiCard>
        </Zoom>
      </form>
    </>
  )
}

export default LoginForm
