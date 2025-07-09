import { Link, useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'
import LoginForm from './LoginForm'
import AppBar from '~/components/AppBar/AppBar'
import RegisterForm from './RegisterForm'
// import AccountForm from './ResetPw/AccountForm'
// import OtpForm from './ResetPw/OtpForm'
// import ResetPwForm from './ResetPw/ResetPwForm'
import ResetPw from './ResetPw'
import bgImage from '~/assets/images/Account-login-bg.jpeg'
import { Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

function Auth() {
  const location = useLocation()
  const isLogin = location.pathname === '/login'
  const isRegister = location.pathname === '/register'
  const isResetPw = location.pathname === '/reset-password'

  return (
    <Box>
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
          <Link to="/" variant="body1">Go back</Link>
        </Box>


      </Box>
    </Box>
  )
}

export default Auth