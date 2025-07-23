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

export default function GoogleSync({ customerDetails, setCustomerDetails }) {
  const [openUnlinkDialog, setOpenUnlinkDialog] = useState(false)
  const [openEmailMismatchDialog, setOpenEmailMismatchDialog] = useState(false)
  const [googleEmailMismatch, setGoogleEmailMismatch] = useState(null)
  const isLinkedWithGoogle = customerDetails?.isOauthUser && customerDetails?.oauthProvider === 'google'

  const handleUnlinkGoogle = async () => {
    setOpenUnlinkDialog(false)
    await toast.promise(unlinkGoogleAPI({ email: customerDetails.email }), {
      pending: 'Đang hủy liên kết với Google...',
      success: 'Đã hủy liên kết với Google thành công!',
      error: 'Có lỗi xảy ra khi hủy liên kết'
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

  const handleSwitchToGoogleAccount = () => {
    // Option 1: Redirect to logout and suggest login with Google email
    toast.info(`Vui lòng đăng xuất và đăng nhập lại bằng email ${googleEmailMismatch.googleEmail}`)
    handleCloseEmailMismatchDialog()
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
      pending: 'Đang liên kết với Google...',
      success: 'Liên kết với Google thành công!',
      error: 'Có lỗi xảy ra khi liên kết với Google'
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
      toast.error('Có lỗi xảy ra khi xử lý đăng nhập Google')
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
              Liên kết Google
            </Typography>

            {isLinkedWithGoogle ? (
              <Button
                variant="outlined"
                size="small"
                color="error"
                onClick={handleOpenUnlinkDialog}
              >
                Hủy liên kết
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
                Đăng nhập bằng Google
              </Typography>
              <Typography variant="body2" sx={{
                color: isLinkedWithGoogle ? 'primary.main' : 'text.disabled',
                fontWeight: 600,
                fontSize: '0.875rem'
              }}>
                {isLinkedWithGoogle ? '✓ Đã liên kết' : '○ Chưa liên kết'}
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
          Xác nhận hủy liên kết
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="unlink-dialog-description">
            Bạn có chắc chắn muốn hủy liên kết tài khoản Google không?
            Sau khi hủy liên kết, bạn sẽ không thể đăng nhập bằng Google nữa.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUnlinkDialog} color="primary">
            Hủy
          </Button>
          <Button onClick={handleUnlinkGoogle} color="error" variant="contained">
            Xác nhận
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
          ⚠️ Email không khớp
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            <strong>Email tài khoản hiện tại:</strong> {googleEmailMismatch?.currentEmail}
          </DialogContentText>
          <DialogContentText sx={{ mb: 2 }}>
            <strong>Email Google bạn đang đăng nhập:</strong> {googleEmailMismatch?.googleEmail}
          </DialogContentText>
          <DialogContentText sx={{ color: 'text.secondary' }}>
            Để đảm bảo bảo mật, chúng tôi chỉ cho phép liên kết Google với cùng email tài khoản.
            Bạn có thể:
          </DialogContentText>
          <Box sx={{ mt: 2, pl: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • <strong>Đăng xuất</strong> và đăng nhập lại bằng email Google ({googleEmailMismatch?.googleEmail})
            </Typography>
            <Typography variant="body2">
              • <strong>Hủy</strong> và tiếp tục sử dụng tài khoản hiện tại
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleIgnoreAndContinue}
            color="primary"
            variant="outlined"
          >
            Hủy liên kết
          </Button>
          <Button
            onClick={handleSwitchToGoogleAccount}
            color="warning"
            variant="contained"
          >
            Đăng nhập lại
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}
