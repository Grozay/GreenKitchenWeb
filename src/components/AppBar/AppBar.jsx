import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import { useState } from 'react'
import DrawerAppBar from '~/components/AppBar/DrawerAppBar/DrawerAppBar'
import Profile from '~/components/AppBar/Menu/Profile'
import Cart from '~/components/AppBar/Cart/Cart'
import NavItem from '~/components/AppBar/Menu/NavItem'
import { Link } from 'react-router-dom'
import TopAppBar from '../TopAppBar/TopAppBar'
import { Divider } from '@mui/material'
// import CaloCalculator from '~/components/AppBar/Menu/CaloCalculator'

function ResponsiveAppBar() {
  // eslint-disable-next-line no-unused-vars
  const [anchorElNav, setAnchorElNav] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  // const { t } = useTranslation()
  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }


  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }
    setDrawerOpen(open)
  }
  return (
    <AppBar sx={{
      backgroundColor: (theme) => theme.palette.background.main, height: (theme) => theme.fitbowl.appBarHeight,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Container maxWidth="xl">
        <TopAppBar />
        <Toolbar disableGutters>
          <Typography
            component={Link}
            to="/"
            sx={{
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              fontSize: { md: '2rem', lg: '2.5rem' },
              textDecoration: 'none',
              color: (theme) => theme.palette.primary.secondary,
              textWrap: 'nowrap'
            }}
          >
            Green Kitchen
          </Typography>

          {/* Drawer */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', sm:'flex', md: 'none' }, justifyContent: 'start', alignItems: 'center' }}>

            <DrawerAppBar
              drawerOpen={drawerOpen}
              toggleDrawer={toggleDrawer}
              // t={t}
            />
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                size="large"
                aria-label="open drawer"
                onClick={toggleDrawer(true)}
                color="inherit"
              >
                <MenuIcon sx={{ color: (theme) => theme.palette.primary.main }} />
              </IconButton>

            </Box>

            <Typography
              variant="h5"
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                // fontFamily: 'Sacramento, cursive',
                fontWeight: 700,
                fontSize: {xs: '2rem', sm: '2.5rem'},
                // letterSpacing: '.3rem',
                color: (theme) => theme.palette.primary.secondary,
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                textDecoration: 'none',
                px: 1,
              }}
            >
              Green Kitchen
            </Typography>
            <Cart />
          </Box>

          {/* nav items */}
          <Box sx={{
            flexGrow: 1,
            display: { xs: 'none', sm:'none', md: 'flex', lg: 'flex' },
            justifyContent: 'center',
            alignItems: 'center',
            textWrap: 'nowrap',
            gap: { md: 0, lg: 2 }
          }}>
            <NavItem to="/menu" label="MENU" handleCloseNavMenu={handleCloseNavMenu} />
            <NavItem to="/smart-meal-planner" label="CUSTOM MEAL" handleCloseNavMenu={handleCloseNavMenu} />
            <NavItem to="/week-meal-planner" label="WEEK MEAL" handleCloseNavMenu={handleCloseNavMenu} />
            <NavItem to="/about-us" label="ABOUT US" handleCloseNavMenu={handleCloseNavMenu} />
            <NavItem to="/blog" label="BLOG" handleCloseNavMenu={handleCloseNavMenu} />
          </Box>

          {/* cart, profile */}
          <Box sx={{ flexGrow: 0, display: { xs: 'none', sm: 'none', md: 'flex' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Cart />
              <Divider orientation="vertical" flexItem sx={{ bgcolor: (theme) => theme.palette.primary.main }} />
              <Profile />
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
export default ResponsiveAppBar
