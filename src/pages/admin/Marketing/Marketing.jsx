import React, { useState, useMemo } from 'react'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'

// Icons - import từng cái
import EmailIcon from '@mui/icons-material/Email'
import CampaignIcon from '@mui/icons-material/Campaign'
import AnalyticsIcon from '@mui/icons-material/Analytics'
import ScheduleIcon from '@mui/icons-material/Schedule'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'

// Marketing Components
import EmailMarketing from './components/EmailMarketing'
import EmailCampaignManager from './components/EmailCampaignManager'
import EmailAnalytics from './components/EmailAnalytics'
import CartAbandonmentScheduler from './components/CartAbandonmentScheduler'
import HolidayPlanner from './components/HolidayPlanner'

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`marketing-tabpanel-${index}`}
      aria-labelledby={`marketing-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  )
}

// Marketing Dashboard Component
function MarketingDashboard() {
  const [activeTab, setActiveTab] = useState(0)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' })

  // Marketing stats sẽ được load từ API khi cần

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }))
  }

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity })
  }

  return (
    <Box sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: 'background.default',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <Box sx={{
        p: 3,
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        borderRadius: '8px 8px 0 0'
      }}>
        <Typography variant="h4" component="h1" sx={{ mb: 1, fontWeight: 'bold' }}>
          Marketing Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Manage marketing campaigns and customer analytics
        </Typography>
      </Box>



      

      {/* Tabs */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Paper sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ 
              bgcolor: 'background.paper',
              '& .MuiTab-root': {
                minHeight: 64,
                fontSize: '0.875rem',
                fontWeight: 500
              }
            }}
          >
            <Tab icon={<EmailIcon />} label="Email Marketing" iconPosition="start" />
            <Tab icon={<CampaignIcon />} label="Campaign Management" iconPosition="start" />
            <Tab icon={<AnalyticsIcon />} label="Analytics" iconPosition="start" />
            <Tab icon={<ScheduleIcon />} label="Cart Abandonment Schedule" iconPosition="start" />
            <Tab icon={<CalendarTodayIcon />} label="Holiday Planner" iconPosition="start" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
          <TabPanel value={activeTab} index={0}>
            <EmailMarketing onShowSnackbar={showSnackbar} />
          </TabPanel>
          
          <TabPanel value={activeTab} index={1}>
            <EmailCampaignManager onShowSnackbar={showSnackbar} />
          </TabPanel>
          
          <TabPanel value={activeTab} index={2}>
            <EmailAnalytics onShowSnackbar={showSnackbar} />
          </TabPanel>
          
          <TabPanel value={activeTab} index={3}>
            <CartAbandonmentScheduler onShowSnackbar={showSnackbar} />
          </TabPanel>
          
          <TabPanel value={activeTab} index={4}>
            <HolidayPlanner onShowSnackbar={showSnackbar} />
          </TabPanel>
          
        </Box>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default MarketingDashboard