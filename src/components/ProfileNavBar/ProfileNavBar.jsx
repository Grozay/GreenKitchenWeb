import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Avatar from '@mui/material/Avatar'
import Logout from '@mui/icons-material/Logout'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logoutCustomerApi } from '~/redux/user/customerSlice'
import { useConfirm } from 'material-ui-confirm'
import { clearChatData } from '~/utils/chatCleanup'
import { useSelector } from 'react-redux'
import { selectCurrentCustomer } from '~/redux/user/customerSlice'

function ProfileNavBar() {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const confirm = useConfirm()
  const currentCustomer = useSelector(selectCurrentCustomer)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async (e) => {
    e.preventDefault()
    const { confirmed } = await confirm({
      title: 'Are you sure you want to logout?',
      body: 'You will be redirected to the login page.',
      cancellationText: 'Cancel',
      confirmationText: 'Log out'
    })
    if (confirmed) {
      dispatch(logoutCustomerApi())
        .then(() => {
          clearChatData() // Clear chat data on logout
          navigate('/login')
        })
    }
  }

  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      py: 3,
      zIndex: 10
    }}>
      {/* Left: Website name */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography
          component={Link}
          to="/"
          sx={{ 
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 700,
            fontSize: '2rem'
          }}
        >
          Green Kitchen
        </Typography>
      </Box>

      {/* Center: Agent & Profile buttons */}
      <Box sx={{ display: { xs: 'none', sm: 'flex' }, justifyContent: 'center', gap: 2 }}>
        <Button component={Link} to="/agent" color="primary" variant="outlined">Agent</Button>
        <Button component={Link} to="/profile" color="primary" variant="contained">Profile</Button>
      </Box>

      {/* Right: Account icon with dropdown */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <IconButton
          color="primary"
          onClick={handleClick}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar
            src={currentCustomer?.avatar}
            sx={{ width: 32, height: 32 }}
          >
            {!currentCustomer?.avatar && (currentCustomer?.firstName?.charAt(0) || 'U')}
          </Avatar>
        </IconButton>

        <Menu
          id="account-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          slotProps={{
            'aria-labelledby': 'account-button'
          }}
        >
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
        </Menu>
      </Box>
    </Box>
  )
}

export default ProfileNavBar
