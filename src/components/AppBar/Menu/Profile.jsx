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
import { useConfirm } from 'material-ui-confirm'
import { Link, useNavigate } from 'react-router-dom'

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
          navigate('/login')
        })
    }
  }

  return (
    <Box>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ p: 0 }}
          aria-controls={open ? 'basic-menu-profiles' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar
            sx={{ width: 36, height: 36 }}
            alt="profile"
          />
        </IconButton>
      </Tooltip>
      <Menu
        id="basic-menu-profiles"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-profiles'
        }}
      >
        {!currentCustomer ? (
          <>
            <Link to='/login' style={{ color: 'inherit', textDecoration: 'none' }}>
              <MenuItem sx={{ '&:hover': { color: 'primary.main' } }}>
                <ListItemIcon>
                  <Login fontSize="small" />
                </ListItemIcon>
                Login
              </MenuItem>
            </Link>

            <Link to='/register' style={{ color: 'inherit', textDecoration: 'none' }}>
              <MenuItem sx={{ '&:hover': { color: 'success.main' } }}>
                <ListItemIcon>
                  <PersonAdd fontSize="small" />
                </ListItemIcon>
                Register
              </MenuItem>
            </Link>
          </>
        ) : (
          <>
            <Link to='/profile' style={{ color: 'inherit', textDecoration: 'none' }}>
              <MenuItem sx={{ '&:hover': { color: 'success.light' } }}>
                <ListItemIcon>
                  <Person fontSize="small" />
                </ListItemIcon>
                Profile
              </MenuItem>
            </Link>

            <Divider />

            <MenuItem onClick={handleLogout} sx={{
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
          </>
        )}
      </Menu>
    </Box>
  )
}

export default Profile