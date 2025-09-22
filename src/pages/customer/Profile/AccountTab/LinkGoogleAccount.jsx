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


export default function GoogleSync({ customerDetails, setCustomerDetails }) {
  const [openUnlinkDialog, setOpenUnlinkDialog] = useState(false)
  const [openEmailMismatchDialog, setOpenEmailMismatchDialog] = useState(false)
  const [googleEmailMismatch, setGoogleEmailMismatch] = useState(null)
  const isLinkedWithGoogle = customerDetails?.isOauthUser && customerDetails?.oauthProvider === 'google'

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const confirm = useConfirm()

  const handleUnlinkGoogle = async () => {
    setOpenUnlinkDialog(false)
    await toast.promise(unlinkGoogleAPI({ email: customerDetails.email }), {
      pending: 'Unlinking Google...',
      success: 'Successfully unlinked from Google!',
      error: 'Error occurred while unlinking'
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
    toast.info(`Please log out and log in again with email ${googleEmailMismatch.googleEmail}`)
    handleCloseEmailMismatchDialog()

    const { confirmed } = await confirm({
      title: 'Confirm logout',
      description: 'Are you sure you want to log out of your account?',
      confirmationText: 'Log out',
      cancellationText: 'Cancel'
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
    toast.info('Google linking cancelled')
    handleCloseEmailMismatchDialog()
  }

  const performGoogleLink = async (credential) => {
    await toast.promise(linkGoogleAPI({
      email: customerDetails.email,
      idToken: credential
    }), {
      pending: 'Linking with Google...',
      success: 'Successfully linked with Google!',
      error: 'Error occurred while linking with Google'
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
      toast.error('Error occurred while processing Google login')
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
              Link Google
            </Typography>

            {isLinkedWithGoogle ? (
              <Button
                variant="outlined"
                size="small"
                color="error"
                onClick={handleOpenUnlinkDialog}
              >
                Unlink
              </Button>
            ) : (
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={() => {
                  toast.error('Google login failed')
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
                Login with Google
              </Typography>
              <Typography variant="body2" sx={{
                color: isLinkedWithGoogle ? 'primary.main' : 'text.disabled',
                fontWeight: 600,
                fontSize: '0.875rem'
              }}>
                {isLinkedWithGoogle ? '✓ Linked' : '○ Not linked'}
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
          Confirm Unlink
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="unlink-dialog-description">
            Are you sure you want to unlink your Google account?
            After unlinking, data linked to your Google account may be lost!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUnlinkDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUnlinkGoogle} color="error" variant="contained">
            Confirm
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
          ⚠️ Email Mismatch
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            <strong>Current account email:</strong> {googleEmailMismatch?.currentEmail}
          </DialogContentText>
          <DialogContentText sx={{ mb: 2 }}>
            <strong>Google email you are logged in with:</strong> {googleEmailMismatch?.googleEmail}
          </DialogContentText>
          <DialogContentText sx={{ color: 'text.secondary' }}>
            For security reasons, we only allow linking Google with the same account email.
            You can:
          </DialogContentText>
          <Box sx={{ mt: 2, pl: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • <strong>Log out</strong> and log in again with Google email ({googleEmailMismatch?.googleEmail})
            </Typography>
            <Typography variant="body2">
              • <strong>Cancel</strong> and continue using the current account
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleIgnoreAndContinue}
            color="primary"
            variant="outlined"
          >
            Cancel Linking
          </Button>
          <Button
            onClick={handleSwitchToGoogleAccount}
            color="warning"
            variant="contained"
          >
            Log In Again
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}
