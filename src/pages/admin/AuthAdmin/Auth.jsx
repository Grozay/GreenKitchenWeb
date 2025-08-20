import { useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'
import LoginForm from './LoginForm'
import { useSelector } from 'react-redux'
import { selectCurrentEmployee } from '~/redux/user/employeeSlice'
import { Navigate } from 'react-router-dom'
function Auth() {
  const location = useLocation()
  const isLogin = location.pathname === '/management/login'
  // const isRegister = location.pathname === '/register'
  const currentEmployee = useSelector(selectCurrentEmployee)
  if (currentEmployee) {
    return <Navigate to='/management/' replace={true} />
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
        {/* {isRegister && <RegisterForm />} */}
      </Box>
    </Box>
  )
}

export default Auth