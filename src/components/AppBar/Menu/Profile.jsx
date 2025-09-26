import { useState } from 'react'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Logout from '@mui/icons-material/Logout'
import Login from '@mui/icons-material/Login'
import PersonAdd from '@mui/icons-material/PersonAdd'
import Person from '@mui/icons-material/Person'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentCustomer, logoutCustomerApi } from '~/redux/user/customerSlice'
import { clearCart } from '~/redux/cart/cartSlice'
import { useConfirm } from 'material-ui-confirm'
import { Link, useNavigate } from 'react-router-dom'
import { clearChatData } from '~/utils/chatCleanup'

const Profile = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const currentCustomer = useSelector(selectCurrentCustomer)
  const confirm = useConfirm()

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    const { confirmed } = await confirm({
      title: 'Are you sure you want to logout?',
      cancellationText: 'Cancel',
      confirmationText: 'Confirm'
    })
    if (confirmed) {
      dispatch(logoutCustomerApi())
        .then(() => {
          dispatch(clearCart())
          clearChatData() // Clear chat data on logout
          navigate('/login')
        })
    }
  }

  return (
    <Box>
      <Box>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            aria-controls={open ? 'basic-menu-profiles' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar
              sx={{ width: 26, height: 26 }}
              src={currentCustomer?.avatar}
              alt="profile"
            >
              {!currentCustomer?.avatar && (currentCustomer?.firstName?.charAt(0) || 'U')}
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Box>
        <Menu
          id="basic-menu-profiles"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          slotProps={{
            'aria-labelledby': 'basic-button-profiles'
          }}
        >
          {!currentCustomer ? ([
            <Link to='/login' style={{ color: 'inherit', textDecoration: 'none' }} key="login">
              <MenuItem sx={{ '&:hover': { color: 'primary.main' } }}>
                <ListItemIcon>
                  <Login fontSize="small" />
                </ListItemIcon>
                Login
              </MenuItem>
            </Link>,
            <Link to='/register' style={{ color: 'inherit', textDecoration: 'none' }} key="register">
              <MenuItem sx={{ '&:hover': { color: 'success.main' } }}>
                <ListItemIcon>
                  <PersonAdd fontSize="small" />
                </ListItemIcon>
                Register
              </MenuItem>
            </Link>
          ]) : ([
            <Link to='/profile/overview' style={{ color: 'inherit', textDecoration: 'none' }} key="profile">
              <MenuItem sx={{ '&:hover': { color: 'success.light' } }}>
                <ListItemIcon>
                  <Person fontSize="small" />
                </ListItemIcon>
                Profile
              </MenuItem>
            </Link>,
            <Divider key="divider" />,
            <MenuItem onClick={handleLogout} key="logout" sx={{
              '&:hover': {
                color: 'warning.dark',
                '& .logout-icon': {
                  color: 'warning.dark'
                }
              }
            }}>
              <ListItemIcon>
                <Logout className='logout-icon' fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          ])}
        </Menu>
      </Box>
    </Box>
  )
}

export default Profile