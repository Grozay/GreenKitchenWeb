import { Link, useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { Card as MuiCard } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import TextField from '@mui/material/TextField'
import Zoom from '@mui/material/Zoom'
import Avatar from '@mui/material/Avatar'
import SecurityIcon from '@mui/icons-material/Security'
import { useForm } from 'react-hook-form'
import {
  FIELD_REQUIRED_MESSAGE,
  OTP_RULE,
  OTP_RULE_MESSAGE
} from '~/utils/validators'
import { toast } from 'react-toastify'
import { verifyOtpCodeAPI } from '~/apis'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'

function OtpForm({ onNext, email }) {
  const { register, handleSubmit, formState: { errors } } = useForm()
  // const userId = location.state?.userId

  // Debug: Check if email is received
  if (!email) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography color="error">Email is required. Please go back and enter your email.</Typography>
      </Box>
    )
  }

  const submitLogIn = (data) => {
    const { otpCode } = data
    const requestData = {
      email: email,
      token: otpCode
    }
    toast.promise(
      verifyOtpCodeAPI(requestData), {
        pending: 'Verifying OTP...',
        success: 'OTP verified successfully!'
      }
    ).then(res => {
      //Đoạn này phải kiểm tra không có lỗi mới redirect về route /
      if (!res.error) {
        // navigate('/account/reset-password/new-password', { state: { userId } })
        onNext(email)
      }
    }).catch(() => {
      // Handle error silently or show user-friendly message
    })
  }

  return (
    <form onSubmit={handleSubmit(submitLogIn)} >
      <Zoom in={true} style={{ transitionDelay: '200ms' }}>
        <MuiCard sx={{ minWidth: 480, maxWidth: 480, marginTop: '1em' }}>
          <Box sx={{
            margin: '1em',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ bgcolor: 'primary.main' }}><SecurityIcon /></Avatar>
              <Typography variant="h4" align="center">VERIFY OTP</Typography>
            </Box>
          </Box>
          <Box sx={{ padding: '0 1em', textAlign: 'center', mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Enter the OTP code sent to: <strong>{email}</strong>
            </Typography>
          </Box>
          <Box sx={{ padding: '0 1em 1em 1em' }}>
            <Box sx={{ marginTop: '1em' }}>
              <TextField
                // autoComplete="nope"
                autoFocus
                fullWidth
                label="Please enter your OTP..."
                type="text"
                variant="outlined"
                error={!!errors['otpCode']}
                {...register('otpCode', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: OTP_RULE,
                    message: OTP_RULE_MESSAGE
                  }
                })}
              />
              <FieldErrorAlert errors={errors} fieldName='otpCode' />
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
              Proceed
            </Button>
          </CardActions>
          {/* <Box sx={{ padding: '0 1em 1em 1em', textAlign: 'center' }}>
            <Typography>New to Nexus Service Marketing System?</Typography>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Typography sx={{ color: 'primary.main', '&:hover': { color: '#ffbb39' } }}>Create account!</Typography>
            </Link>
          </Box> */}
          <Box sx={{ padding: '0 1em 1em 1em', textAlign: 'center' }}>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Typography sx={{ color: 'primary.main', '&:hover': { color: '#ffbb39' } }}> Back to Login</Typography>
            </Link>
          </Box>
        </MuiCard>
      </Zoom>
    </form>
  )
}

export default OtpForm
