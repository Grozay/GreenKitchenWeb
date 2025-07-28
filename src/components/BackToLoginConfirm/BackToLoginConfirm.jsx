import { useNavigate } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useConfirm } from 'material-ui-confirm'

function BackToLoginConfirm({
  stepName = 'quá trình đặt lại mật khẩu',
  customMessage = null
}) {
  const navigate = useNavigate()
  const confirm = useConfirm()

  const handleBackToLogin = async (e) => {
    e.preventDefault()
    const warningMessage = customMessage ||
      `Bạn có chắc chắn muốn quay lại trang đăng nhập?\n\n${stepName} hiện tại sẽ bị hủy bỏ và bạn sẽ cần phải bắt đầu lại từ đầu.`
    const { confirmed } = await confirm({
      title: 'Xác nhận quay lại',
      description: (
        <Box>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.6, mb: 2 }}>
            {warningMessage}
          </Typography>
          <Box sx={{
            p: 2,
            borderRadius: 1,
            backgroundColor: '#fff3e0',
            border: '1px solid #ffb74d'
          }}>
            <Typography variant="body2" sx={{ color: '#e65100', fontWeight: 500 }}>
              ⚠️ Lưu ý: Thao tác này không thể hoàn lại!
            </Typography>
          </Box>
        </Box>
      ),
      confirmationText: 'Quay lại Login',
      cancellationText: 'Tiếp tục'
    })
    if (confirmed) navigate('/login')
  }

  return (
    <Box sx={{ padding: '0 1em 1em 1em', textAlign: 'center' }}>
      <Typography
        component="a"
        href="#"
        onClick={handleBackToLogin}
        sx={{
          color: 'primary.main',
          textDecoration: 'none',
          cursor: 'pointer',
          '&:hover': {
            color: '#ffbb39',
            textDecoration: 'underline'
          }
        }}
      >
        Back to Login
      </Typography>
    </Box>
  )
}

export default BackToLoginConfirm
