import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import theme from '~/theme'
import { useTranslation } from 'react-i18next' // Thêm import

const TabMenu = ({ value, handleChange }) => {
  const { t } = useTranslation() // Sử dụng t()

  return (
    <Tabs
      value={value}
      onChange={handleChange}
      variant="scrollable"
      scrollButtons
      allowScrollButtonsMobile
      aria-label="menu type tabs"
      sx={{
        '& .MuiTabs-list': {
          backgroundColor: 'rgba(0, 179, 137, 0.3)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 12px #0001',
          border: '1px solid rgba(0, 179, 137, 0.3)',
          width: '100%',
          borderRadius: '50px',
          p: '5px 0'
        },
        '& .MuiTabs-flexContainer': {
          justifyContent: 'center'
        },
        '& .MuiTabs-indicator': {
          display: 'none'
        },
        '& .MuiTab-root': {
          borderRadius: '50px',
          margin: '0 8px',
          maxWidth: 500,
          minHeight: '36px',
          transition: 'all 0.3s ease',
          '&.Mui-selected': {
            backgroundColor: theme.colorSchemes.light.palette.background.default,
            color: theme.colorSchemes.light.palette.text.secondary
          },
          '&:hover': {
            backgroundColor: theme.colorSchemes.light.palette.background.default,
            color: theme.colorSchemes.light.palette.text.secondary
          }
        }
      }}
    >
      <Tab label={t('menu.high')} />
      <Tab label={t('menu.balance')} />
      <Tab label={t('menu.low')} />
      <Tab label={t('menu.vegetarian')} />
    </Tabs>
  )
}

export default TabMenu
