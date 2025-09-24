
import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import LinearProgress from '@mui/material/LinearProgress'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Avatar from '@mui/material/Avatar'
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Mouse as ClickIcon,
  Refresh as RefreshIcon,
  Link as LinkIcon,
  ShoppingCart as CartIcon,
  Payment as PaymentIcon,
  Unsubscribe as UnsubscribeIcon,
  Settings as SettingsIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  Analytics as AnalyticsIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material'
import { 
  getEmailStatisticsAPI, 
  getEmailHistoryAPI,
  getCartAbandonmentTrackingStatsAPI,
  getEmailTrackingStatsAPI
} from '~/apis'

const EmailAnalytics = ({ onShowSnackbar }) => {
  const [trackingStats, setTrackingStats] = useState({})
  const [emailHistory, setEmailHistory] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [timeRange, setTimeRange] = useState('30days')

  useEffect(() => {
    loadTrackingData()
  }, [timeRange])

  const loadTrackingData = async () => {
    try {
      setIsLoading(true)
      const [cartTrackingData, historyData] = await Promise.all([
        getCartAbandonmentTrackingStatsAPI(),
        getEmailHistoryAPI(0, 20)
      ])
      
      setTrackingStats(cartTrackingData)
      setEmailHistory(historyData.content || [])
    } catch (error) {
      console.error('Error loading tracking data:', error)
      onShowSnackbar('Error loading tracking data', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  // Tính toán dữ liệu tracking
  const trackingData = {
    totalClicks: trackingStats.totalClicks || 0,
    clicksLast24h: trackingStats.clicksLast24h || 0,
    clicksLast7Days: trackingStats.clicksLast7Days || 0,
    clicksByLinkType: trackingStats.clicksByLinkType || {},
    totalEmails: emailHistory.length,
    recentEmails: emailHistory.slice(0, 10)
  }

  const getLinkTypeIcon = (linkType) => {
    switch (linkType) {
      case 'CART': return <CartIcon />
      case 'CHECKOUT': return <PaymentIcon />
      case 'UNSUBSCRIBE': return <UnsubscribeIcon />
      case 'PREFERENCES': return <SettingsIcon />
      case 'SOCIAL_FACEBOOK': return <FacebookIcon />
      case 'SOCIAL_INSTAGRAM': return <InstagramIcon />
      case 'SOCIAL_TWITTER': return <TwitterIcon />
      default: return <LinkIcon />
    }
  }

  const getLinkTypeLabel = (linkType) => {
    switch (linkType) {
      case 'CART': return 'Cart'
      case 'CHECKOUT': return 'Checkout'
      case 'UNSUBSCRIBE': return 'Unsubscribe'
      case 'PREFERENCES': return 'Preferences'
      case 'SOCIAL_FACEBOOK': return 'Facebook'
      case 'SOCIAL_INSTAGRAM': return 'Instagram'
      case 'SOCIAL_TWITTER': return 'Twitter'
      default: return linkType
    }
  }

  const getLinkTypeColor = (linkType) => {
    switch (linkType) {
      case 'CART': return 'primary'
      case 'CHECKOUT': return 'success'
      case 'UNSUBSCRIBE': return 'error'
      case 'PREFERENCES': return 'warning'
      case 'SOCIAL_FACEBOOK': return 'info'
      case 'SOCIAL_INSTAGRAM': return 'secondary'
      case 'SOCIAL_TWITTER': return 'default'
      default: return 'default'
    }
  }

  return (
    <Box>
      {/* Header với time range selector */}
      <Paper 
        sx={{ 
          p: 3, 
          mb: 3, 
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'grey.100', color: 'text.primary' }}>
              <AnalyticsIcon />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
                Email Tracking Analytics
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Analyze email marketing effectiveness through tracking links
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Time Range</InputLabel>
              <Select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <MenuItem value="7days">7 days</MenuItem>
                <MenuItem value="30days">30 days</MenuItem>
                <MenuItem value="90days">90 days</MenuItem>
                <MenuItem value="1year">1 year</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={loadTrackingData}
              disabled={isLoading}
            >
              Refresh
            </Button>
          </Box>
        </Box>
      </Paper>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        <>
          {/* Tracking Overview Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'grey.100', mr: 2 }}>
                      <ClickIcon sx={{ color: 'text.primary' }} />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        {trackingData.totalClicks.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Total Clicks
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      All tracking links
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'grey.100', mr: 2 }}>
                      <TimelineIcon sx={{ color: 'text.primary' }} />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        {trackingData.clicksLast24h.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Clicks Last 24h
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Recent Activity
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'grey.100', mr: 2 }}>
                      <AssessmentIcon sx={{ color: 'text.primary' }} />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        {trackingData.clicksLast7Days.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Clicks Last 7 Days
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Weekly Trend
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'grey.100', mr: 2 }}>
                      <LinkIcon sx={{ color: 'text.primary' }} />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        {Object.keys(trackingData.clicksByLinkType).length}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Link Types
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Diverse Interactions
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Link Type Analysis */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={8}>
              <Card sx={{ height: '100%', border: '1px solid', borderColor: 'divider' }}>
                <CardHeader
                  title="Click Analysis by Link Type"
                  subheader="Understand user behavior when interacting with emails"
                  avatar={
                    <Avatar sx={{ bgcolor: 'grey.100' }}>
                      <LinkIcon sx={{ color: 'text.primary' }} />
                    </Avatar>
                  }
                />
                <CardContent>
                  {Object.keys(trackingData.clicksByLinkType).length > 0 ? (
                    <List>
                      {Object.entries(trackingData.clicksByLinkType)
                        .sort(([,a], [,b]) => b - a)
                        .map(([linkType, count], index) => (
                        <ListItem key={linkType} sx={{ px: 0 }}>
                          <ListItemIcon>
                            <Avatar sx={{ bgcolor: 'grey.100' }}>
                              {getLinkTypeIcon(linkType)}
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={getLinkTypeLabel(linkType)}
                            secondary={
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <Typography variant="body2" sx={{ mr: 2, fontWeight: 600 }}>
                                  {count.toLocaleString()} clicks
                                </Typography>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={trackingData.totalClicks > 0 ? (count / trackingData.totalClicks) * 100 : 0}
                                  sx={{ 
                                    width: 100, 
                                    height: 6, 
                                    borderRadius: 3,
                                    bgcolor: 'grey.200'
                                  }}
                                />
                                <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
                                  {trackingData.totalClicks > 0 ? ((count / trackingData.totalClicks) * 100).toFixed(1) : 0}%
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No tracking data available
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', border: '1px solid', borderColor: 'divider' }}>
                <CardHeader
                  title="Tracking Overview"
                  subheader="Summary Statistics"
                  avatar={
                    <Avatar sx={{ bgcolor: 'grey.100' }}>
                      <AnalyticsIcon sx={{ color: 'text.primary' }} />
                    </Avatar>
                  }
                />
                <CardContent>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                      {trackingData.totalClicks.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Clicks
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={100}
                      sx={{ height: 8, borderRadius: 4, mt: 1, bgcolor: 'grey.200' }}
                    />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                      {trackingData.clicksLast24h.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Clicks Last 24h
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={trackingData.totalClicks > 0 ? (trackingData.clicksLast24h / trackingData.totalClicks) * 100 : 0}
                      sx={{ height: 8, borderRadius: 4, mt: 1, bgcolor: 'grey.200' }}
                    />
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                      {trackingData.clicksLast7Days.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Clicks Last 7 Days
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={trackingData.totalClicks > 0 ? (trackingData.clicksLast7Days / trackingData.totalClicks) * 100 : 0}
                      sx={{ height: 8, borderRadius: 4, mt: 1, bgcolor: 'grey.200' }}
                    />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                      {Object.keys(trackingData.clicksByLinkType).length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tracked Link Types
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Recent Email History */}
          <Card sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardHeader
              title="Recent Email History"
              subheader="Sent emails and tracking data"
              avatar={
                <Avatar sx={{ bgcolor: 'grey.100' }}>
                  <TimelineIcon sx={{ color: 'text.primary' }} />
                </Avatar>
              }
            />
            <CardContent>
              {trackingData.recentEmails.length > 0 ? (
                <List>
                  {trackingData.recentEmails.map((email, index) => (
                    <React.Fragment key={email.id || index}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon>
                          <Avatar sx={{ bgcolor: 'grey.100' }}>
                            <ClickIcon sx={{ color: 'text.primary' }} />
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {email.subject || 'Email without subject'}
                              </Typography>
                              <Chip 
                                label={email.emailType || 'Unknown'} 
                                size="small" 
                                variant="outlined"
                                sx={{ borderColor: 'grey.300', color: 'text.secondary' }}
                              />
                            </Box>
                          }
                          secondary={
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                Sent: {email.totalSent || 0} emails | 
                                Status: {email.status || 'Unknown'} | 
                                Date: {email.sentAt ? new Date(email.sentAt).toLocaleDateString('en-US') : 'N/A'}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < trackingData.recentEmails.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    Chưa có lịch sử email
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  )
}

export default EmailAnalytics
