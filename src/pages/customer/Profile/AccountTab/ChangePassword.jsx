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
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { selectCurrentLanguage } from '~/redux/translations/translationsSlice'

export default function ChangePassword({ customerDetails, setCustomerDetails }) {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()
  const currentLang = useSelector(selectCurrentLanguage)
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
      pending: t('accountTab.changePassword.processing'),
      success: t('accountTab.changePassword.success'),
      error: t('accountTab.changePassword.error')
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
                {t('accountTab.changePassword.title')}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={handleClickOpen}
              >
                {t('accountTab.changePassword.button')}
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
                  {t('accountTab.changePassword.dialogTitle')}
                </Typography>
                <Typography variant="body2" sx={{
                  color: '#666',
                  fontStyle: 'italic',
                  fontSize: '0.75rem'
                }}>
                  {customerDetails?.passwordUpdatedAt ? `${t('accountTab.changePassword.lastChanged')}: ${formatDate(customerDetails.passwordUpdatedAt)}` : t('accountTab.changePassword.neverChanged')}
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
              {t('accountTab.changePassword.title')}
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
                  label={t('accountTab.changePassword.currentPassword')}
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
                  label={t('accountTab.changePassword.newPassword')}
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
                  label={t('accountTab.changePassword.confirmPassword')}
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
              {t('accountTab.changePassword.cancel')}
            </Button>
            <Button
              type="submit"
              variant="contained"
            >
              {t('accountTab.changePassword.save')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}
