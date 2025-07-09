import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { Link } from 'react-router-dom'

function ProfileNavBar() {
  return (
    <Box sx={{
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      p: 3,
      position: 'relative',
      zIndex: 10
    }}>
      {/* Left: Website name */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <Typography
          variant="h4"
          component={Link}
          to="/"
          sx={{ textDecoration: 'none', color: 'inherit', fontWeight: 700 }}
        >
          Green Kitchen
        </Typography>
      </Box>

      {/* Center: Agent & Profile buttons */}
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button component={Link} to="/agent" color="primary" variant="outlined">Agent</Button>
        <Button component={Link} to="/profile" color="primary" variant="contained">Profile</Button>
      </Box>

      {/* Right: Account icon */}
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <IconButton color="primary" component={Link} to="/profile/account">
          <AccountCircleIcon fontSize="large" />
        </IconButton>
      </Box>
    </Box>
  )
}

export default ProfileNavBar
