import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import LockIcon from '@mui/icons-material/Lock'
import CloseIcon from '@mui/icons-material/Close'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import PasswordField from '~/components/Form/PasswordField'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import PasswordStrengthIndicator from '~/components/Form/PasswordStrengthIndicator'
import { FIELD_REQUIRED_MESSAGE, PASSWORD_RULE, PASSWORD_RULE_MESSAGE, PASSWORD_CONFIRMATION_MESSAGE } from '~/utils/validators'
import { changePasswordAPI } from '~/apis'
import { formatDate } from '~/utils/formatter'

export default function ChangePassword({ customerDetails, setCustomerDetails }) {
  const [open, setOpen] = useState(false)
  const { register, handleSubmit, formState: { errors }, getValues, watch, reset } = useForm()

  const watchNewPassword = watch('newPassword', '')

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    reset() // Reset form when closing
  }

  const onSubmit = async (data) => {
    const { oldPassword, newPassword } = data
    await toast.promise(changePasswordAPI({ email: customerDetails.email, oldPassword, newPassword }), {
      pending: 'Đang thay đổi mật khẩu...',
      success: 'Mật khẩu đã được thay đổi thành công!',
      error: 'Có lỗi xảy ra khi thay đổi mật khẩu'
    }).then(res => {
      if (!res.error) {
        setCustomerDetails(prev => ({
          ...prev,
          passwordUpdatedAt: new Date().toISOString() // Update password updated time
        }))
        handleClose()
      }
    })
  }

  return (
    <>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <Card sx={{
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          height: '100%'
        }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2
            }}>
              <Typography variant="h6" component="h3">
                Mật khẩu
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={handleClickOpen}
              >
                Đổi mật khẩu
              </Button>
            </Box>

            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              <LockIcon sx={{
                fontSize: 40,
                color: '#FF6B35'
              }} />
              <Box>
                <Typography variant="body2" sx={{
                  color: 'primary.main',
                  fontWeight: 500
                }}>
                  Thay đổi mật khẩu tài khoản
                </Typography>
                <Typography variant="body2" sx={{
                  color: '#666',
                  fontStyle: 'italic',
                  fontSize: '0.75rem'
                }}>
                  {customerDetails?.passwordUpdatedAt ? `Cập nhật lần cuối: ${formatDate(customerDetails.passwordUpdatedAt)}` : 'Chưa cập nhật mật khẩu'}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2
          }
        }}
      >
        <DialogTitle sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LockIcon sx={{ color: '#FF6B35' }} />
            <Typography variant="h6">
              Thay đổi mật khẩu
            </Typography>
          </Box>
          <IconButton
            onClick={handleClose}
            size="small"
          >
            <CloseIcon sx={{ color: '#9E9E9E' }} />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ pt: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Current Password */}
              <Box>
                <PasswordField
                  label="Mật khẩu hiện tại"
                  error={!!errors['oldPassword']}
                  register={register}
                  registerName="oldPassword"
                  registerOptions={{
                    required: FIELD_REQUIRED_MESSAGE
                  }}
                  fullWidth
                />
                <FieldErrorAlert errors={errors} fieldName='oldPassword' />
              </Box>

              {/* New Password */}
              <Box>
                <PasswordField
                  label="Mật khẩu mới"
                  error={!!errors['newPassword']}
                  register={register}
                  registerName="newPassword"
                  registerOptions={{
                    required: FIELD_REQUIRED_MESSAGE,
                    pattern: {
                      value: PASSWORD_RULE,
                      message: PASSWORD_RULE_MESSAGE
                    }
                  }}
                  fullWidth
                />
                <FieldErrorAlert errors={errors} fieldName='newPassword' />
                <PasswordStrengthIndicator password={watchNewPassword} />
              </Box>

              {/* Confirm New Password */}
              <Box>
                <PasswordField
                  label="Xác nhận mật khẩu mới"
                  error={!!errors['confirmNewPassword']}
                  register={register}
                  registerName="confirmNewPassword"
                  registerOptions={{
                    required: FIELD_REQUIRED_MESSAGE,
                    validate: (value) => value === getValues('newPassword') || PASSWORD_CONFIRMATION_MESSAGE
                  }}
                  fullWidth
                />
                <FieldErrorAlert errors={errors} fieldName='confirmNewPassword' />
              </Box>
            </Box>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={handleClose}
              variant="outlined"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="contained"
            >
              Thay đổi mật khẩu
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}
