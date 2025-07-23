import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { Card as MuiCard } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import TextField from '@mui/material/TextField'
import Zoom from '@mui/material/Zoom'
import Avatar from '@mui/material/Avatar'
import SecurityIcon from '@mui/icons-material/Security'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import {
  FIELD_REQUIRED_MESSAGE,
  OTP_RULE,
  OTP_RULE_MESSAGE
} from '~/utils/validators'
import { toast } from 'react-toastify'
import { verifyOtpCodeAPI } from '~/apis'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import BackToLoginConfirm from '~/components/BackToLoginConfirm/BackToLoginConfirm'

function OtpForm({ onNext, email }) {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes = 300 seconds
  const [isExpired, setIsExpired] = useState(false)
  // const userId = location.state?.userId

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true)
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          setIsExpired(true)
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  // Format time to MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // Debug: Check if email is received
  if (!email) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography color="error">Email is required. Please go back and enter your email.</Typography>
      </Box>
    )
  }

  const submitLogIn = (data) => {
    if (isExpired) {
      toast.error('OTP đã hết hạn. Vui lòng yêu cầu mã OTP mới.')
      return
    }

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

            {/* OTP Timer */}
            <Box sx={{
              mt: 2,
              p: 1.5,
              borderRadius: 1,
              backgroundColor: isExpired ? '#ffebee' : '#e8f5e8',
              border: `1px solid ${isExpired ? '#f44336' : '#4caf50'}`
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <AccessTimeIcon
                  sx={{
                    color: isExpired ? '#f44336' : '#4caf50',
                    fontSize: '1.2rem'
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: isExpired ? '#f44336' : '#4caf50'
                  }}
                >
                  {isExpired ? 'OTP đã hết hạn' : `Thời gian còn lại: ${formatTime(timeLeft)}`}
                </Typography>
              </Box>
              {isExpired && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                  Vui lòng yêu cầu mã OTP mới
                </Typography>
              )}
            </Box>
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
              disabled={isExpired}
              sx={{
                opacity: isExpired ? 0.6 : 1,
                '&.Mui-disabled': {
                  backgroundColor: '#bdbdbd',
                  color: '#ffffff'
                }
              }}
            >
              {isExpired ? 'OTP đã hết hạn' : 'Proceed'}
            </Button>
          </CardActions>

          <BackToLoginConfirm
            stepName="quá trình xác thực OTP"
            customMessage="Bạn có chắc chắn muốn quay lại trang đăng nhập?

Mã OTP hiện tại sẽ hết hiệu lực và bạn sẽ cần phải yêu cầu mã OTP mới để đặt lại mật khẩu."
          />
        </MuiCard>
      </Zoom>
    </form>
  )
}

export default OtpForm
