import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { Card as MuiCard } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import TextField from '@mui/material/TextField'
import Zoom from '@mui/material/Zoom'
import Avatar from '@mui/material/Avatar'
import LockResetIcon from '@mui/icons-material/LockReset'
import { useForm } from 'react-hook-form'
import {
  FIELD_REQUIRED_MESSAGE,
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE
} from '~/utils/validators'
import { toast } from 'react-toastify'
import { sendOtpCodeAPI } from '~/apis'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import BackToLoginConfirm from '~/components/BackToLoginConfirm/BackToLoginConfirm'

function AccountForm({ onNext }) {
  const { register, handleSubmit, formState: { errors } } = useForm()

  const submitLogIn = (data) => {
    const { email } = data
    toast.promise(
      sendOtpCodeAPI({ email }), {
        pending: 'Sending OTP code...',
        success: 'OTP code sent successfully!'
      }
    ).then(res => {
      if (!res.error) {
        onNext(email)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(submitLogIn)} >
      <Zoom in={true} style={{ transitionDelay: '200ms' }}>
        <MuiCard sx={{ width: 390, marginTop: '1em' }}>
          <Box sx={{
            margin: '1em',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ bgcolor: 'primary.main' }}><LockResetIcon /></Avatar>
              <Typography variant="h4" align="center">RESET PASSWORD</Typography>
            </Box>
            <Typography variant="body2" align="center" sx={{ color: 'text.secondary', marginTop: '0.5em' }}>
              Please enter your email address to begin the password reset process
            </Typography>
          </Box>
          <Box sx={{ padding: '0 1em 1em 1em' }}>
            <Box sx={{ marginTop: '1em' }}>
              <TextField
                // autoComplete="nope"
                autoFocus
                fullWidth
                label="Enter your Email Address..."
                type="text"
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

          <BackToLoginConfirm
            stepName="quá trình nhập email để đặt lại mật khẩu"
            customMessage="Bạn có chắc chắn muốn quay lại trang đăng nhập?

Thông tin email đã nhập sẽ bị mất và bạn sẽ cần phải bắt đầu lại quá trình đặt lại mật khẩu."
          />
        </MuiCard>
      </Zoom>
    </form>
  )
}

export default AccountForm
