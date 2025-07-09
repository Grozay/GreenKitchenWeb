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
import LanguageSelect from '~/components/AppBar/LanguageSelect/LanguageSelect'
import { useTranslation } from 'react-i18next'
import NavItem from '~/components/AppBar/Menu/NavItem'
import { Link } from 'react-router-dom'
import CaloCalculator from '~/components/AppBar/Menu/CaloCalculator'

function ResponsiveAppBar() {
  // eslint-disable-next-line no-unused-vars
  const [anchorElNav, setAnchorElNav] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { t } = useTranslation()
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
        <Toolbar disableGutters>
          <Typography
            variant="h5"
            component={Link}
            to="/"
            sx={{
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              letterSpacing: '.3rem',
              textTransform: 'uppercase',
              fontSize: '2rem',
              textDecoration: 'none',
              color: (theme) => theme.palette.primary.secondary
            }}
          >
            {t('navBar.nameWebsite')}
          </Typography>
          {/* drawer */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>

            <DrawerAppBar
              drawerOpen={drawerOpen}
              toggleDrawer={toggleDrawer}
              t={t}
            />

            <Typography
              variant="h5"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'Sacramento, cursive',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: (theme) => theme.palette.primary.secondary,
                justifyContent: 'start',
                alignItems: 'center',
                textDecoration: 'none',
                // color: (theme) => theme.palette.text.primary
              }}
            >
              {t('navBar.nameWebsite')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {/* <Profile /> */}
              <LanguageSelect />
              <IconButton
                size="large"
                aria-label="open drawer"
                onClick={toggleDrawer(true)}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Box>

          {/* nav items */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', alignItems: 'center' }}>
            {/* <NavItem to="/" label="home" handleCloseNavMenu={handleCloseNavMenu} t={t} /> */}
            <NavItem to="/menu" label="menu" handleCloseNavMenu={handleCloseNavMenu} t={t} />
            {/* <NavItem to="/calo-calculator" label="caloCalculator" handleCloseNavMenu={handleCloseNavMenu} t={t} /> */}
            <CaloCalculator label="Calculator" t={t} />
            <NavItem to="/about-us" label="aboutUs" handleCloseNavMenu={handleCloseNavMenu} t={t} />
            <NavItem to="/catering" label="catering" handleCloseNavMenu={handleCloseNavMenu} t={t} />
            <NavItem to="/blogs" label="blog" handleCloseNavMenu={handleCloseNavMenu} t={t} />
          </Box>
          {/* cart */}
          <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
              <Cart />
              <LanguageSelect />
              <Profile />
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
export default ResponsiveAppBar
