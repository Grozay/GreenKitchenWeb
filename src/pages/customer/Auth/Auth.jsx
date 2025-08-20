import { Link, useLocation, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import ResetPw from './ResetPw'
import PhoneLoginForm from './PhoneLoginForm'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useConfirm } from 'material-ui-confirm'
import { useSelector } from 'react-redux'
import { selectCurrentCustomer } from '~/redux/user/customerSlice'
import { useEffect } from 'react'

function Auth() {
  const location = useLocation()
  const isLogin = location.pathname === '/login'
  const isRegister = location.pathname === '/register'
  const isResetPw = location.pathname === '/reset-password'
  const isPhoneLogin = location.pathname === '/login-by-phone'
  const confirm = useConfirm()
  const navigate = useNavigate()

  const currentCustomer = useSelector(selectCurrentCustomer)
  // Lấy location mà user muốn truy cập trước khi bị redirect đến login
  const from = location.state?.from?.pathname || '/profile/overview'
  useEffect(() => {
    // Nếu user đã đăng nhập, redirect về trang họ muốn truy cập
    if (currentCustomer) {
      navigate(from, { replace: true })
    }
  }, [currentCustomer, navigate, from])

  const confirmBack = async (e) => {
    e.preventDefault()
    const warningMessage = 'Ban có chắc chắn muốn quay lại trang chủ không?'
    const { confirmed } = await confirm({
      title: 'Xác nhận quay lại trang chủ',
      description: warningMessage,
      confirmationText: 'Quay lại',
      cancellationText: 'Tiếp tục'
    })
    if (confirmed) navigate('/')
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: '#FAF5E8'
    }}>
      <Box sx={{
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {isLogin && <LoginForm />}
        {isRegister && <RegisterForm />}
        {isResetPw && <ResetPw />}
        {isPhoneLogin && <PhoneLoginForm />}

        <Box to="/" sx={{
          marginTop: '1em',
          textDecoration: 'none',
          color: 'inherit',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 1
        }}>
          <ArrowBackIcon fontSize="small" />
          <Link onClick={confirmBack} variant="body1">Go back</Link>
        </Box>


      </Box>
    </Box>
  )
}

export default Auth