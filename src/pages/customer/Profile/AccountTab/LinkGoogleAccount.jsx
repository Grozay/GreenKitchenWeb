import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import GoogleIcon from '@mui/icons-material/Google'
import { GoogleLogin } from '@react-oauth/google'
import { toast } from 'react-toastify'
import { useState } from 'react'
import { unlinkGoogleAPI, linkGoogleAPI } from '~/apis'
import { useDispatch } from 'react-redux'
import { logoutCustomerApi } from '~/redux/user/customerSlice'
import { useNavigate } from 'react-router-dom'
import { useConfirm } from 'material-ui-confirm'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { selectCurrentLanguage } from '~/redux/translations/translationsSlice'


export default function GoogleSync({ customerDetails, setCustomerDetails }) {
  const [openUnlinkDialog, setOpenUnlinkDialog] = useState(false)
  const [openEmailMismatchDialog, setOpenEmailMismatchDialog] = useState(false)
  const [googleEmailMismatch, setGoogleEmailMismatch] = useState(null)
  const isLinkedWithGoogle = customerDetails?.isOauthUser && customerDetails?.oauthProvider === 'google'
  const { t } = useTranslation()
  const currentLang = useSelector(selectCurrentLanguage)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const confirm = useConfirm()

  const handleUnlinkGoogle = async () => {
    setOpenUnlinkDialog(false)
    await toast.promise(unlinkGoogleAPI({ email: customerDetails.email }), {
      pending: t('accountTab.linkGoogleAccount.unlinking'),
      success: t('accountTab.linkGoogleAccount.unlinkingSuccess'),
      error: t('accountTab.linkGoogleAccount.unlinkingError')
    })

    setCustomerDetails(prev => ({
      ...prev,
      isOauthUser: false,
      oauthProvider: null
    }))
  }


  const handleOpenUnlinkDialog = () => {
    setOpenUnlinkDialog(true)
  }

  const handleCloseUnlinkDialog = () => {
    setOpenUnlinkDialog(false)
  }

  const handleCloseEmailMismatchDialog = () => {
    setOpenEmailMismatchDialog(false)
    setGoogleEmailMismatch(null)
  }

  const handleSwitchToGoogleAccount = async () => {
    // Option 1: Redirect to logout and suggest login with Google email
    toast.info(`Vui lòng đăng xuất và đăng nhập lại bằng email ${googleEmailMismatch.googleEmail}`)
    handleCloseEmailMismatchDialog()

    const { confirmed } = await confirm({
      title: 'Xác nhận đăng xuất',
      description: 'Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?',
      confirmationText: 'Đăng xuất',
      cancellationText: 'Hủy'
    })

    if (confirmed) {
      dispatch(logoutCustomerApi())
        .then(() => {
          navigate('/login')
        })
    }
  }

  const handleIgnoreAndContinue = () => {
    // Option 2: User chooses to not link (just close dialog)
    toast.info('Đã hủy liên kết với Google')
    handleCloseEmailMismatchDialog()
  }

  const performGoogleLink = async (credential) => {
    await toast.promise(linkGoogleAPI({
      email: customerDetails.email,
      idToken: credential
    }), {
      pending: t('accountTab.linkGoogleAccount.linking'),
      success: t('accountTab.linkGoogleAccount.linkingSuccess'),
      error: t('accountTab.linkGoogleAccount.linkingError')
    })

    setCustomerDetails(prev => ({
      ...prev,
      isOauthUser: true,
      oauthProvider: 'google'
    }))
  }

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      // Decode JWT token để lấy email
      const tokenPayload = JSON.parse(atob(credentialResponse.credential.split('.')[1]))
      const googleEmail = tokenPayload.email
      const currentEmail = customerDetails?.email

      // Kiểm tra email có trùng khớp không
      if (googleEmail !== currentEmail) {
        // Hiển thị dialog cảnh báo thay vì link ngay
        setGoogleEmailMismatch({
          currentEmail,
          googleEmail,
          credential: credentialResponse.credential
        })
        setOpenEmailMismatchDialog(true)
        return
      }

      // Nếu email trùng khớp, thực hiện link bình thường
      await performGoogleLink(credentialResponse.credential)
    } catch {
      toast.error(t('accountTab.linkGoogleAccount.googleLoginError'))
    }
  }

  return (
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
              {t('accountTab.linkGoogleAccount.title')}
            </Typography>

            {isLinkedWithGoogle ? (
              <Button
                variant="outlined"
                size="small"
                color="error"
                onClick={handleOpenUnlinkDialog}
              >
                {t('accountTab.linkGoogleAccount.unlinkButton')}
              </Button>
            ) : (
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={() => {
                  toast.error(t('accountTab.linkGoogleAccount.googleLoginFailed'))
                }}
                text="signin"
                shape="rectangular"
                size="medium"
              />
            )}
          </Box>

          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <GoogleIcon sx={{
              fontSize: 40,
              color: isLinkedWithGoogle ? '#EA4335' : 'text.disabled'
            }} />
            <Box>
              <Typography variant="body2" sx={{
                color: isLinkedWithGoogle ? 'primary.main' : 'text.secondary',
                fontWeight: 500
              }}>
                {t('accountTab.linkGoogleAccount.googleLogin')}
              </Typography>
              <Typography variant="body2" sx={{
                color: isLinkedWithGoogle ? 'primary.main' : 'text.disabled',
                fontWeight: 600,
                fontSize: '0.875rem'
              }}>
                {isLinkedWithGoogle ? `✓ ${t('accountTab.linkGoogleAccount.linkedStatus')}` : `○ ${t('accountTab.linkGoogleAccount.notLinkedStatus')}`}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog
        open={openUnlinkDialog}
        onClose={handleCloseUnlinkDialog}
        aria-labelledby="unlink-dialog-title"
        aria-describedby="unlink-dialog-description"
      >
        <DialogTitle id="unlink-dialog-title">
          {t('accountTab.linkGoogleAccount.unlinkConfirmTitle')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="unlink-dialog-description">
            {t('accountTab.linkGoogleAccount.unlinkConfirmContent')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUnlinkDialog} color="primary">
            {t('accountTab.linkGoogleAccount.cancel')}
          </Button>
          <Button onClick={handleUnlinkGoogle} color="error" variant="contained">
            {t('accountTab.linkGoogleAccount.confirmUnlink')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Email Mismatch Dialog */}
      <Dialog
        open={openEmailMismatchDialog}
        onClose={handleCloseEmailMismatchDialog}
        aria-labelledby="email-mismatch-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="email-mismatch-dialog-title" sx={{
          color: 'warning.main',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          ⚠️ {t('accountTab.linkGoogleAccount.emailMismatchTitle')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            <strong>{t('accountTab.linkGoogleAccount.currentAccountEmail')}:</strong> {googleEmailMismatch?.currentEmail}
          </DialogContentText>
          <DialogContentText sx={{ mb: 2 }}>
            <strong>{t('accountTab.linkGoogleAccount.googleAccountEmail')}:</strong> {googleEmailMismatch?.googleEmail}
          </DialogContentText>
          <DialogContentText sx={{ color: 'text.secondary' }}>
            {t('accountTab.linkGoogleAccount.emailMismatchExplanation')}
          </DialogContentText>
          <Box sx={{ mt: 2, pl: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • <strong>{t('accountTab.linkGoogleAccount.logoutOption')}</strong> {t('accountTab.linkGoogleAccount.logoutDescription')} ({googleEmailMismatch?.googleEmail})
            </Typography>
            <Typography variant="body2">
              • <strong>{t('accountTab.linkGoogleAccount.cancelOption')}</strong> {t('accountTab.linkGoogleAccount.cancelDescription')}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleIgnoreAndContinue}
            color="primary"
            variant="outlined"
          >
            {t('accountTab.linkGoogleAccount.understood')}
          </Button>
          <Button
            onClick={handleSwitchToGoogleAccount}
            color="warning"
            variant="contained"
          >
            {t('accountTab.linkGoogleAccount.loginAgain')}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}
