import { useState } from 'react'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import PersonAdd from '@mui/icons-material/PersonAdd'
import Settings from '@mui/icons-material/Settings'
import Logout from '@mui/icons-material/Logout'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
// import { useDispatch, useSelector } from 'react-redux'
// import { selectCurrentUser, logoutUserApi } from '~/redux/user/userSlice.js'
import { useConfirm } from 'material-ui-confirm'
import { Link } from 'react-router-dom'

const Profile = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  // const dispatch = useDispatch()
  // const currentUser = useSelector(selectCurrentUser)
  const confirmLogout = useConfirm()

  const handleLogout = () => {
    confirmLogout({
      title: 'Are you sure you want to logout?',
      cancellationText: 'Cancel',
      confirmationText: 'Confirm'
    })
      .then(() => { })
      .catch(() => { })
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
        <Link to='/settings/account' style={{ color: 'inherit' }}>
          <MenuItem sx={{ '&:hover': { color: 'success.light' } }}>
            <Avatar sx={{ width: 28, height: 28, mr: 2 }} src="https://i.pinimg.com/564x/2d/75/90/2d759090909090909090909090909090.jpg" /> Profile
          </MenuItem>
        </Link>

        <Divider />
        {/* <MenuItem sx={{
          '&:hover': {
            color: 'primary.light',
            '& .order-checking-icon': {
              color: 'primary.light'
            }
          }
        }}>
          <ListItemIcon>
            <AssignmentTurnedInIcon className='order-checking-icon' fontSize="small" />
          </ListItemIcon>
          Order Checking
        </MenuItem> */}
        <MenuItem sx={{
          '&:hover': {
            color: 'warning.dark',
            '& .settings-icon': {
              color: 'warning.dark'
            }
          }
        }}>
          <ListItemIcon>
            <Settings className='settings-icon' fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{
          '&:hover': {
            color: 'warning.dark',
            '& .logout-icon': {
              color: 'warning.dark'
            }
          }
        }}>
          <ListItemIcon >
            <Logout className='logout-icon' fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default Profile