import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import LogoutIcon from '@mui/icons-material/Logout'
import DrawerAppBarItem from './DrawerAppBarItem'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { useState } from 'react'
import Collapse from '@mui/material/Collapse'
import { Link } from 'react-router-dom'
import ListItem from '@mui/material/ListItem'

const DrawerAppBar = ({ drawerOpen, toggleDrawer, t }) => {
  const navItemStyle = {
    position: 'relative',
    overflow: 'hidden',
    padding: '0.5rem 1rem',
    fontWeight: 900,
    fontSize: '2rem',
    fontSmoothing: 'antialiased',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      backgroundColor: (theme) => theme.palette.text.hover,
      borderRadius: '50px'
    }
  }

  const [open, setOpen] = useState(false)

  const handleClick = () => {
    setOpen(!open)
  }

  return (
    <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
      <Box
        sx={{
          width: 250,
          height: '100%',
          paddingX: 2,
          paddingY: 4,
          color: 'white',
          backgroundColor: (theme) => theme.palette.background.main,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
        role="presentation"
      >
        {/* Profile */}
        <List>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Tooltip title="Remy Sharp">
                <Avatar alt="User Avatar" sx={{ width: 80, height: 80 }} />
              </Tooltip>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ color: 'black', mt: 1 }}>Remy Sharp</Typography>
            </Box>
          </Box>

          {/* Navigation Items */}
          <DrawerAppBarItem
            toggleDrawer={toggleDrawer}
            navItemStyle={navItemStyle}
            t={t}
            label="home"
            path="/"
          />

          <DrawerAppBarItem
            toggleDrawer={toggleDrawer}
            navItemStyle={navItemStyle}
            t={t}
            label="menu"
            path="/menu"
          />

          <DrawerAppBarItem
            toggleDrawer={toggleDrawer}
            navItemStyle={navItemStyle}
            t={t}
            label="customMeal"
            path="/smart-meal-planner"
          />

          {/* <ListItemButton >
            <ListItemIcon>
              {t('navBar.Calculator')}
            </ListItemIcon>
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton> */}
          {/* <ListItem disablePadding >
            <ListItemButton
              onClick={handleClick}
              sx={navItemStyle}
            >
              <ListItemText sx={{ color: (theme) => theme.palette.text.primary }} primary={t('navBar.Calculator')} />
              {open ? <ExpandLess sx={{ color: (theme) => theme.palette.text.primary }}/> : <ExpandMore sx={{ color: (theme) => theme.palette.text.primary }} />}
            </ListItemButton>
          </ListItem> */}
          {/* <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to='/smart-meal-planner'
                  onClick={toggleDrawer(false)}
                  sx={navItemStyle}
                >
                  <ListItemText sx={{ color: (theme) => theme.palette.text.primary }} primary={t('navBar.caloCalculator.0.title')} />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to='/calo-calculator'
                  onClick={toggleDrawer(false)}
                  sx={navItemStyle}
                >
                  <ListItemText sx={{ color: (theme) => theme.palette.text.primary }} primary={t('navBar.caloCalculator.1.title')} />
                </ListItemButton>
              </ListItem>
            </List>
          </Collapse> */}
          {/* <DrawerAppBarItem
            toggleDrawer={toggleDrawer}
            navItemStyle={navItemStyle}
            t={t}
            label="smartMealPlanner"
            path="/smart-meal-planner"
          />

          <DrawerAppBarItem
            toggleDrawer={toggleDrawer}
            navItemStyle={navItemStyle}
            t={t}
            label="caloCalculator"
            path="/calo-calculator"
          /> */}

          <DrawerAppBarItem
            toggleDrawer={toggleDrawer}
            navItemStyle={navItemStyle}
            t={t}
            label="orderChecking"
            path="/order-checking"
          />

          <DrawerAppBarItem
            toggleDrawer={toggleDrawer}
            navItemStyle={navItemStyle}
            t={t}
            label="weekMeal"
            path="/week-meal-planner"
          />

          <DrawerAppBarItem
            toggleDrawer={toggleDrawer}
            navItemStyle={navItemStyle}
            t={t}
            label="forum"
            path="/forum"
          />

        </List>

        {/* Logout Button */}
        <Box>
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              cursor: 'pointer',
              padding: '0.5rem 1.2rem 1rem',
              width: '50%',
              '&:hover': {
                backgroundColor: (theme) => theme.palette.text.hover,
                borderRadius: '50px'
              }
            }}
          >
            <LogoutIcon sx={{ color: (theme) => theme.palette.text.primary, mt: 1 }} />
            <Typography variant="body1" sx={{ color: (theme) => theme.palette.text.primary, mt: 1 }}>
              {t('logout')}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Drawer>
  )
}

export default DrawerAppBar