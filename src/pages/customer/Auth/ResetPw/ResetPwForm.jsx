import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { Card as MuiCard } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import TextField from '@mui/material/TextField'
import Zoom from '@mui/material/Zoom'
import Avatar from '@mui/material/Avatar'
import VpnKeyIcon from '@mui/icons-material/VpnKey'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  PASSWORD_RULE_MESSAGE,
  FIELD_REQUIRED_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_CONFIRMATION_MESSAGE
} from '~/utils/validators'
import { toast } from 'react-toastify'
import { resetPasswordAPI } from '~/apis'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import BackToLoginConfirm from '~/components/BackToLoginConfirm/BackToLoginConfirm'

function ResetPwForm({ onSubmit, email }) {
  const { t } = useTranslation()
  const { register, handleSubmit, formState: { errors }, getValues } = useForm()
  // const userId = location.state?.userId

  const submitLogIn = (data) => {
    const { password } = data
    toast.promise(
      resetPasswordAPI({ email, password }), {
        pending: t('auth.resetPassword.resetPwForm.updatingPassword'),
        success: t('auth.resetPassword.resetPwForm.passwordUpdatedSuccess')
      }
    ).then(res => {
      // console.log(res)
      //Đoạn này phải kiểm tra không có lỗi mới redirect về route /
      if (!res.error) {
        // navigate('/account/login')
        onSubmit()
      }
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
              <Avatar sx={{ bgcolor: 'primary.main' }}><VpnKeyIcon /></Avatar>
              <Typography variant="h4" align="center">{t('auth.resetPassword.resetPwForm.title')}</Typography>
            </Box>
            <Typography variant="body2" align="center" sx={{ color: 'text.secondary', marginTop: '0.5em' }}>
              {t('auth.resetPassword.resetPwForm.description')}
            </Typography>
          </Box>
          <Box sx={{ padding: '0 1em 1em 1em' }}>
            <Box sx={{ marginTop: '1em' }}>
              <TextField
                // autoComplete="nope"
                autoFocus
                fullWidth
                label={t('auth.resetPassword.resetPwForm.passwordLabel')}
                type="password"
                variant="outlined"
                error={!!errors['password']}
                {...register('password', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: PASSWORD_RULE,
                    message: PASSWORD_RULE_MESSAGE
                  }
                })}
              />
              <FieldErrorAlert errors={errors} fieldName='password' />
            </Box>
            <Box sx={{ marginTop: '1em' }}>
              <TextField
                // autoComplete="nope"
                autoFocus
                fullWidth
                label={t('auth.resetPassword.resetPwForm.confirmPasswordLabel')}
                type="password"
                variant="outlined"
                error={!!errors['passwordConfirmation']}
                {...register('passwordConfirmation', {
                  validate: (value) => value === getValues('password') || PASSWORD_CONFIRMATION_MESSAGE
                })}
              />
              <FieldErrorAlert errors={errors} fieldName='passwordConfirmation' />
            </Box>

          </Box>
          <CardActions sx={{ padding: '0 1em 1em 1em' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
            >
              {t('auth.resetPassword.resetPwForm.proceedButton')}
            </Button>
          </CardActions>

          <BackToLoginConfirm
            stepName={t('auth.resetPassword.resetPwForm.stepName')}
            customMessage={t('auth.resetPassword.resetPwForm.backConfirmMessage')}
          />
        </MuiCard>
      </Zoom>
    </form>
  )
}

export default ResetPwForm
