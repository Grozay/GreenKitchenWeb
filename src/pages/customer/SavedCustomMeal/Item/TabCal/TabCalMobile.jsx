import { Tabs, Tab } from '@mui/material'
import theme from '~/theme'
import { useTranslation } from 'react-i18next'

const TabCalMobile = ({ value, handleChange }) => {
  const { t } = useTranslation()

  return (
    <Tabs
      value={value}
      onChange={handleChange}
      variant="fullWidth"
      scrollButtons
      allowScrollButtonsMobile
      aria-label="scrollable force tabs example"
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
          gap: '8px'
        },
        '& .MuiTabs-indicator': {
          display: 'none'
        },
        '& .MuiTab-root': {
          borderRadius: '50px',
          minWidth: '80px',
          padding: '8px 16px',
          transition: 'all 0.3s ease',
          textTransform: 'none',
          fontSize: '0.875rem',
          '&:hover': {
            backgroundColor: 'rgba(0, 179, 137, 0.1)',
            color: theme.colorSchemes.light.palette.text.secondary
          },
          '&.Mui-selected': {
            backgroundColor: theme.colorSchemes.light.palette.background.default,
            color: theme.colorSchemes.light.palette.text.secondary,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            fontWeight: '500'
          }
        }
      }}
    >
      <Tab label={t('smartMeal.protein')} />
      <Tab label={t('smartMeal.carbs')} />
      <Tab label={t('smartMeal.side')} />
      <Tab label={t('smartMeal.sauce')} />
    </Tabs>
  )
}

export default TabCalMobile