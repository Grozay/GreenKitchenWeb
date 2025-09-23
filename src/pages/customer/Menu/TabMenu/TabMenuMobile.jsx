import { Tabs, Tab } from '@mui/material'
import theme from '~/theme'

const TabMenuMobile = ({ value, handleChange }) => {

  return (
    <Tabs
      value={value}
      onChange={handleChange}
      variant="fullWidth"
      scrollButtons
      allowScrollButtonsMobile
      aria-label="menu type tabs mobile"
      sx={{
        '& .MuiTabs-list': {
          backgroundColor: 'rgba(0, 179, 137, 0.3)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          boxShadow: '0 2px 12px #0001',
          border: '1px solid rgba(0, 179, 137, 0.3)',
          width: '100%',
          borderRadius: '50px',
          p: '2px 0',
          minHeight: '48px'
        },
        '& .MuiTabs-flexContainer': {
          justifyContent: 'center',
          gap: '4px'
        },
        '& .MuiTabs-indicator': {
          display: 'none'
        },
        '& .MuiTab-root': {
          borderRadius: '50px',
          minWidth: '70px',
          padding: '6px 12px',
          transition: 'all 0.3s ease',
          textTransform: 'none',
          fontSize: '0.75rem',
          fontWeight: '600',
          '&:hover': {
            backgroundColor: 'rgba(0, 179, 137, 0.1)',
            color: theme.colorSchemes.light.palette.text.secondary
          },
          '&.Mui-selected': {
            backgroundColor: theme.colorSchemes.light.palette.background.default,
            color: theme.colorSchemes.light.palette.text.secondary,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            fontWeight: '600'
          }
        }
      }}
    >
      <Tab label="HIGH" />
      <Tab label="BALANCE" />
      <Tab label="LOW" />
      <Tab label="VEGETARIAN" />
    </Tabs>
  )
}

export default TabMenuMobile
