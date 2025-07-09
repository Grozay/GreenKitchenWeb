import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useLocation } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import CalculateIcon from '@mui/icons-material/Calculate'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import { styled, alpha } from '@mui/material/styles'
import { Link } from 'react-router-dom'
import React from 'react'
import theme from '~/theme'


const ROUTES = {
  SMART_MEAL_PLANNER: '/smart-meal-planner',
  CALORIE_CALCULATOR: '/calo-calculator'
}

// StyledMenu với transition mượt mà hơn
const StyledMenu = styled((props) => (
  <Menu
    elevation={8}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center'
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center'
    }}
    transitionDuration={200}
    disableAutoFocusItem
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: '12px',
    marginTop: '8px',
    minWidth: '240px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    border: `1px solid ${theme.palette.divider}`,
    '& .MuiMenu-list': {
      padding: '8px 0'
    },
    '& .MuiMenuItem-root': {
      padding: '10px 16px',
      margin: '0 8px',
      borderRadius: '8px',
      transition: 'all 0.2s ease-in-out',
      '&:not(:last-child)': {
        marginBottom: '4px'
      },
      '&:hover': {
        backgroundColor: alpha(theme.palette.background.main, 0.08),
        transform: 'translateX(2px)'
      },
      '&.Mui-selected': {
        backgroundColor: alpha(theme.palette.background.main, 0.5),
        '&:hover': {
          backgroundColor: alpha(theme.palette.background.main, 0.7)
        },
        '& .MuiSvgIcon-root': {
          color: theme.palette.primary.secondary
        }
      },
      '& .MuiSvgIcon-root': {
        color: theme.palette.text.primary,
        fontSize: '1.25rem',
        marginRight: '12px'
      }
    }
  }
}))

const CaloCalculator = ({ label, t }) => {
  const location = useLocation()
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const menuRef = useRef(null)
  const buttonRef = useRef(null)

  // Tự động đóng menu khi di chuyển chuột ra khỏi menu
  useEffect(() => {
    const handleMouseLeave = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.relatedTarget)) {
        setAnchorEl(null)
      }
    }

    if (open) {
      document.addEventListener('mouseleave', handleMouseLeave)
      return () => {
        document.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [open])

  const menuItems = [
    {
      path: ROUTES.SMART_MEAL_PLANNER,
      icon: <RestaurantMenuIcon />,
      title: t('navBar.caloCalculator.0.title'),
      description: t('navBar.caloCalculator.0.description')
    },
    {
      path: ROUTES.CALORIE_CALCULATOR,
      icon: <CalculateIcon />,
      title: t('navBar.caloCalculator.1.title'),
      description: t('navBar.caloCalculator.1.description')
    }
  ]

  const isActive = menuItems.some(
    (item) =>
      location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
  )

  const handleMouseEnter = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMouseLeave = (event) => {
    // Chỉ đóng menu nếu chuột không di chuyển vào menu
    if (menuRef.current && !menuRef.current.contains(event.relatedTarget)) {
      setAnchorEl(null)
    }
  }

  const handleMenuMouseLeave = (event) => {
    // Đóng menu nếu chuột rời khỏi menu và không di chuyển vào button
    if (buttonRef.current && !buttonRef.current.contains(event.relatedTarget)) {
      setAnchorEl(null)
    }
  }

  return (
    <Box
      onMouseLeave={handleMouseLeave}
      sx={{ position: 'relative', display: 'inline-block' }}
    >
      <Button
        ref={buttonRef}
        endIcon={<KeyboardArrowDownIcon />}
        onMouseEnter={handleMouseEnter}
        sx={{
          my: 2,
          color: theme.palette.text.primary,
          display: 'flex',
          alignItems: 'center',
          fontWeight: 400,
          fontSize: '0.9375rem',
          textTransform: 'none',
          padding: '8px 16px',
          backgroundColor: isActive || open ? theme.palette.text.hover : 'transparent',
          borderRadius: '50px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: theme.palette.text.hover,
            borderRadius: '50px'
          },
          '& .MuiButton-endIcon': {
            marginLeft: '4px',
            transition: 'transform 0.2s',
            '& svg': {
              fontSize: '1.1rem'
            }
          },
          '&:hover .MuiButton-endIcon': {
            transform: 'translateY(1px)'
          }
        }}
      >
        {t(`navBar.${label}`)}
      </Button>

      <StyledMenu
        ref={menuRef}
        id="calo-calculator-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{
          onMouseLeave: handleMenuMouseLeave,
          'aria-labelledby': 'calo-calculator-button'
        }}
        disableScrollLock
        keepMounted
      >
        {menuItems.map((item) => {
          const isItemActive =
            location.pathname === item.path ||
            location.pathname.startsWith(`${item.path}/`)
          return (
            <MenuItem
              key={item.path}
              component={Link}
              to={item.path}
              selected={isItemActive}
              sx={{
                '&.Mui-selected': {
                  '& .MuiTypography-root': {
                    color: theme.palette.text.primary
                  }
                }
              }}
            >
              {React.cloneElement(item.icon, {
                sx: {
                  color: isItemActive ? theme.palette.text.primary : theme.palette.text.secondary
                }
              })}
              <Box>
                <Box sx={{ fontWeight: isItemActive ? 600 : 500, fontSize: '0.9375rem' }}>
                  {item.title}
                </Box>
                <Box sx={{ fontSize: '0.75rem', color: theme.palette.text.secondary, mt: 0.25 }}>
                  {item.description}
                </Box>
              </Box>
            </MenuItem>
          )
        })}
      </StyledMenu>
    </Box>
  )
}

export default CaloCalculator