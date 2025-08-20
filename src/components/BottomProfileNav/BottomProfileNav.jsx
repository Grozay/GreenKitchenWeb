import { useMemo } from 'react'
import Paper from '@mui/material/Paper'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import AssessmentIcon from '@mui/icons-material/Assessment'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import LoyaltyIcon from '@mui/icons-material/Loyalty'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import { Link, useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'

export default function BottomProfileNav() {
  const location = useLocation()

  const value = useMemo(() => {
    const p = location.pathname || ''
    if (p.includes('/profile/order-history')) return '/profile/order-history'
    if (p.includes('/profile/membership')) return '/profile/membership'
    if (p.includes('/profile/account')) return '/profile/account'
    // default to overview
    return '/profile/overview'
  }, [location.pathname])

  return (
    <Paper
      elevation={8}
      square
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        display: { xs: 'block', sm: 'block', md: 'none' }
      }}
    >
      <Box sx={{ maxWidth: 900, margin: '0 auto' }}>
        <BottomNavigation showLabels value={value}>
          <BottomNavigationAction
            label="Tổng Quan"
            value="/profile/overview"
            icon={<AssessmentIcon />}
            component={Link}
            to="/profile/overview"
          />
          <BottomNavigationAction
            label="Lịch sử"
            value="/profile/order-history"
            icon={<LocalShippingIcon />}
            component={Link}
            to="/profile/order-history"
          />
          <BottomNavigationAction
            label="Ưu đãi"
            value="/profile/membership"
            icon={<LoyaltyIcon />}
            component={Link}
            to="/profile/membership"
          />
          <BottomNavigationAction
            label="Tài Khoản"
            value="/profile/account"
            icon={<ManageAccountsIcon />}
            component={Link}
            to="/profile/account"
          />
        </BottomNavigation>
      </Box>
    </Paper>
  )
}
