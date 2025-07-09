import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import theme from '~/theme'

const TabCal = ({ value, handleChange }) => {
  return (
    <Tabs
      value={value}
      onChange={handleChange}
      variant="scrollable"
      scrollButtons
      allowScrollButtonsMobile
      aria-label="scrollable force tabs example"
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
          maxWidth: 600,
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
      <Tab label="PROTEIN" hrefLang='#' />
      <Tab label="CARBS" hrefLang='#' />
      <Tab label="SIDE" hrefLang='#' />
      <Tab label="SAUCE" hrefLang='#' />
    </Tabs>
  )
}

export default TabCal