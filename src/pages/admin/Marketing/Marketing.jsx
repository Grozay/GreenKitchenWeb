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
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import CampaignIcon from '@mui/icons-material/Campaign'
import TemplateIcon from '@mui/icons-material/Description'
import AnalyticsIcon from '@mui/icons-material/Analytics'
import ScheduleIcon from '@mui/icons-material/Schedule'

// Marketing Components
import EmailMarketing from './components/EmailMarketing'
import CouponManagement from './components/CouponManagement'
import EmailCampaignManager from './components/EmailCampaignManager'
import EmailTemplateManager from './components/EmailTemplateManager'
import EmailAnalytics from './components/EmailAnalytics'
import CartAbandonmentScheduler from './components/CartAbandonmentScheduler'

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
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ 
        p: 3, 
        bgcolor: 'primary.main', 
        color: 'white',
        borderRadius: '8px 8px 0 0'
      }}>
        <Typography variant="h4" component="h1" sx={{ mb: 1, fontWeight: 'bold' }}>
          Marketing Dashboard
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Quản lý chiến dịch marketing, coupon và phân tích khách hàng
        </Typography>
      </Box>



      {/* Quick Actions */}
      <Box sx={{ px: 3, pb: 2 }}>
        <Paper sx={{ p: 2, bgcolor: '#f8f9fa' }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Hành động nhanh
          </Typography>
          <Grid container spacing={2}>
            <Grid item>
              <Button
                variant="contained"
                startIcon={<EmailIcon />}
                onClick={() => setActiveTab(0)}
                sx={{ bgcolor: 'primary.main' }}
              >
                Gửi Email Marketing
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<CampaignIcon />}
                onClick={() => setActiveTab(1)}
                sx={{ borderColor: 'primary.main', color: 'primary.main' }}
              >
                Quản lý Chiến dịch
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<TemplateIcon />}
                onClick={() => setActiveTab(2)}
                sx={{ borderColor: 'primary.main', color: 'primary.main' }}
              >
                Quản lý Template
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<AnalyticsIcon />}
                onClick={() => setActiveTab(3)}
                sx={{ borderColor: 'primary.main', color: 'primary.main' }}
              >
                Analytics
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<ScheduleIcon />}
                onClick={() => setActiveTab(4)}
                sx={{ borderColor: 'primary.main', color: 'primary.main' }}
              >
                Lịch Cart Abandonment
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<LocalOfferIcon />}
                onClick={() => setActiveTab(5)}
                sx={{ borderColor: 'primary.main', color: 'primary.main' }}
              >
                Quản lý Coupon
              </Button>
            </Grid>

          </Grid>
        </Paper>
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
            <Tab icon={<CampaignIcon />} label="Quản lý Chiến dịch" iconPosition="start" />
            <Tab icon={<TemplateIcon />} label="Quản lý Template" iconPosition="start" />
            <Tab icon={<AnalyticsIcon />} label="Analytics" iconPosition="start" />
            <Tab icon={<ScheduleIcon />} label="Lịch Cart Abandonment" iconPosition="start" />
            <Tab icon={<LocalOfferIcon />} label="Quản lý Coupon" iconPosition="start" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <TabPanel value={activeTab} index={0}>
            <EmailMarketing onShowSnackbar={showSnackbar} />
          </TabPanel>
          
          <TabPanel value={activeTab} index={1}>
            <EmailCampaignManager onShowSnackbar={showSnackbar} />
          </TabPanel>
          
          <TabPanel value={activeTab} index={2}>
            <EmailTemplateManager onShowSnackbar={showSnackbar} />
          </TabPanel>
          
          <TabPanel value={activeTab} index={3}>
            <EmailAnalytics onShowSnackbar={showSnackbar} />
          </TabPanel>
          
          <TabPanel value={activeTab} index={4}>
            <CartAbandonmentScheduler onShowSnackbar={showSnackbar} />
          </TabPanel>
          
          <TabPanel value={activeTab} index={5}>
            <CouponManagement onShowSnackbar={showSnackbar} />
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
