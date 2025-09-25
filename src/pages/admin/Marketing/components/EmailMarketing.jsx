import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import { toast } from 'react-toastify'

// Icons
import EmailIcon from '@mui/icons-material/Email'
import ScheduleIcon from '@mui/icons-material/Schedule'
import PeopleIcon from '@mui/icons-material/People'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import SendIcon from '@mui/icons-material/Send'
import HistoryIcon from '@mui/icons-material/History'
import AnalyticsIcon from '@mui/icons-material/Analytics'
import PreviewIcon from '@mui/icons-material/Preview'
import TemplateIcon from '@mui/icons-material/Description'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import CloseIcon from '@mui/icons-material/Close'
import { broadcastEmailNowAPI, broadcastEmailScheduleAPI, broadcastPreviewAPI, getEmailHistoryAPI, getEmailStatisticsAPI, scheduleOneOffEmailAPI } from '~/apis'

const EmailMarketing = ({ onShowSnackbar }) => {
  // Main state
  const [activeTab, setActiveTab] = useState(0)
  
  // Email creation state
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [isScheduled, setIsScheduled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [sendAllCustomers, setSendAllCustomers] = useState(false)
  const [previewEmail, setPreviewEmail] = useState('')
  
  // One-off email state
  const [oneOffRecipient, setOneOffRecipient] = useState('')
  const [oneOffSendAt, setOneOffSendAt] = useState('')
  
  // Template state
  const [templates, setTemplates] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [templatePreview, setTemplatePreview] = useState('')
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false)
  const [previewData, setPreviewData] = useState({
    customerName: 'Nguyễn Văn A',
    cartItems: [
      { title: 'Cơm tấm', quantity: 2, price: 50000 },
      { title: 'Canh chua', quantity: 1, price: 30000 }
    ],
    totalAmount: 80000
  })
  
  // Statistics and history
  const [emailStats, setEmailStats] = useState({
    totalSent: 0,
    opened: 0,
    clicked: 0,
    converted: 0
  })
  const [emailHistory, setEmailHistory] = useState([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)

  // Load data on mount
  useEffect(() => {
    loadEmailHistory()
    loadEmailStatistics()
    loadTemplates()
  }, [])

  // Load templates from backend
  const loadTemplates = async () => {
    try {
      // Mock data for now - will be replaced with API call
      const mockTemplates = [
        {
          id: 'welcome',
          name: 'Welcome Email',
          description: 'Welcome email for new customers',
          subject: 'Welcome to Green Kitchen!',
          preview: 'Welcome {{customerName}} to Green Kitchen...'
        },
        {
          id: 'cart-abandonment',
          name: 'Cart Abandonment',
          description: 'Reminder email for abandoned cart',
          subject: 'You forgot something in your cart!',
          preview: 'We noticed you added products...'
        },
        {
          id: 'holiday',
          name: 'Holiday Email',
          description: 'Holiday celebration email',
          subject: 'Happy {{holidayName}}!',
          preview: 'On the occasion of {{holidayName}}, Green Kitchen...'
        }
      ]
      setTemplates(mockTemplates)
    } catch (error) {
      console.error('Failed to load templates:', error)
    }
  }

  // Template functions
  const selectTemplate = (template) => {
    setSelectedTemplate(template)
    setSubject(template.subject)
    setContent(template.preview)
  }

  const previewTemplate = async (template) => {
    try {
      // Mock preview - will be replaced with API call
      const mockPreview = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #4caf50, #8bc34a); padding: 20px; border-radius: 10px;">
          <div style="text-align: center; color: white; margin-bottom: 30px;">
            <h1 style="margin: 0; font-size: 28px;">${template.subject}</h1>
            <p style="font-size: 16px; margin: 10px 0;">Email template preview</p>
          </div>
          <div style="background: white; padding: 25px; border-radius: 8px;">
            <p>Dear ${previewData.customerName},</p>
            <p>${template.preview}</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="#" style="background: #4caf50; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">Call to Action</a>
            </div>
          </div>
        </div>
      `
      setTemplatePreview(mockPreview)
      setTemplateDialogOpen(true)
    } catch (error) {
      onShowSnackbar('Failed to preview template', 'error')
    }
  }

  // Email functions
  const handleSendEmail = async () => {
    if (!subject || !content) {
      onShowSnackbar('Please fill in all required information', 'warning')
      return
    }

    setIsLoading(true)
    
    try {
      if (sendAllCustomers) {
        const res = await broadcastEmailNowAPI({ subject, content })
        onShowSnackbar(`Broadcast sent: ${res.sent || 0} emails`, 'success')
      } else if (previewEmail) {
        await broadcastPreviewAPI(previewEmail, { subject, content })
        onShowSnackbar('Email preview sent', 'success')
      } else {
        onShowSnackbar('Please enter preview email or enable send to all customers', 'warning')
      }
      
      // Reset form
      setSubject('')
      setContent('')
      setScheduledTime('')
      setIsScheduled(false)
      setPreviewEmail('')
      setSelectedTemplate(null)
      
      // Reload history
      loadEmailHistory()
      
    } catch (error) {
      onShowSnackbar('Error occurred while sending email', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleScheduleEmail = async () => {
    if (!scheduledTime) {
      toast.error('Please select send time')
      return
    }

    const scheduleDate = new Date(scheduledTime)
    const now = new Date()
    if (scheduleDate <= now) {
      toast.error('Schedule time must be in the future')
      return
    }

    setIsLoading(true)
    
    try {
      if (sendAllCustomers) {
        const scheduleAtISO = new Date(scheduledTime).toISOString()
        const res = await broadcastEmailScheduleAPI({ subject, content, scheduleAt: scheduleAtISO })
        const scheduleTime = new Date(scheduledTime).toLocaleString('vi-VN')
        onShowSnackbar(`Email scheduled for ${scheduleTime}`, 'success')
      } else {
        onShowSnackbar('Enable "Send to All Customers" to schedule broadcast', 'warning')
      }
      
      loadEmailHistory()
      
    } catch (error) {
      onShowSnackbar('Error occurred while scheduling email', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleScheduleOneOff = async () => {
    if (!oneOffRecipient || !subject || !content || !oneOffSendAt) {
      onShowSnackbar('Please fill recipient, subject, content and time', 'warning')
      return
    }
    const sendAtIso = new Date(oneOffSendAt).toISOString()
    try {
      setIsLoading(true)
      await scheduleOneOffEmailAPI({
        recipient: oneOffRecipient,
        subject,
        content,
        sendAt: sendAtIso
      })
      onShowSnackbar('Scheduled one-off email successfully', 'success')
      setOneOffRecipient('')
      setOneOffSendAt('')
      loadEmailHistory()
    } catch (e) {
      onShowSnackbar('Schedule failed: ' + (e?.message || 'Error'), 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'sent': return 'Sent'
      case 'scheduled': return 'Scheduled'
      case 'failed': return 'Failed'
      case 'active': return 'Active'
      case 'completed': return 'Completed'
      case 'draft': return 'Draft' 
      default: return status
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'sent': return 'success'
      case 'scheduled': return 'warning'
      case 'failed': return 'error'
      case 'active': return 'success'
      case 'completed': return 'info'
      case 'draft': return 'warning'
      default: return 'default'
    }
  }

  // Load email history từ API
  const loadEmailHistory = async () => {
    try {
      setIsLoadingHistory(true)
      const data = await getEmailHistoryAPI(0, 10)
      setEmailHistory(data.content || [])
    } catch (error) {
      onShowSnackbar('Error loading email history', 'error')
    } finally {
      setIsLoadingHistory(false)
    }
  }

  // Load email statistics từ API
  const loadEmailStatistics = async () => {
    try {
      const stats = await getEmailStatisticsAPI()
      if (stats.totalEmails) {
        setEmailStats(prev => ({
          ...prev,
          totalSent: stats.totalEmails
        }))
      }
    } catch (error) {
      console.error('Lỗi tải thống kê email:', error)
    }
  }

  // Backend integrations
  

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Statistics Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', bgcolor: 'background.paper' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EmailIcon sx={{ fontSize: 32, mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {emailStats.totalSent.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Emails Sent
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', bgcolor: 'background.paper' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AnalyticsIcon sx={{ fontSize: 32, mr: 2, color: 'success.main' }} />
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {emailStats.opened.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Emails Opened
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', bgcolor: 'background.paper' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon sx={{ fontSize: 32, mr: 2, color: 'warning.main' }} />
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {emailStats.clicked.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Emails Clicked
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', bgcolor: 'background.paper' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PeopleIcon sx={{ fontSize: 32, mr: 2, color: 'info.main' }} />
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {emailStats.converted.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Converted Customers
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Tabs */}
      <Card variant="outlined">
        <CardContent sx={{ pb: 0 }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab icon={<EmailIcon />} label="Create Email" iconPosition="start" />
            <Tab icon={<TemplateIcon />} label="Templates" iconPosition="start" />
            <Tab icon={<HistoryIcon />} label="History" iconPosition="start" />
          </Tabs>
        </CardContent>
      </Card>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {/* Email Creation Form */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                  <EmailIcon sx={{ mr: 1 }} />
                  Create Email Marketing
                </Typography>

                {selectedTemplate && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      Using template: <strong>{selectedTemplate.name}</strong>
                      <Button 
                        size="small" 
                        onClick={() => setSelectedTemplate(null)}
                        sx={{ ml: 1 }}
                      >
                        Deselect
                      </Button>
                    </Typography>
                  </Alert>
                )}

                <TextField
                  fullWidth
                  label="Email Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  sx={{ mb: 3 }}
                  placeholder="Enter email subject..."
                />

                <TextField
                  fullWidth
                  label="Email Content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  multiline
                  rows={6}
                  sx={{ mb: 3 }}
                  placeholder="Enter email content..."
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={isScheduled}
                      onChange={(e) => setIsScheduled(e.target.checked)}
                    />
                  }
                  label="Schedule Email Send"
                  sx={{ mb: 2 }}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={sendAllCustomers}
                      onChange={(e) => setSendAllCustomers(e.target.checked)}
                    />
                  }
                  label="Send to All Customers"
                  sx={{ mb: 2 }}
                />

                {!sendAllCustomers && (
                  <TextField
                    fullWidth
                    label="Preview Email (Test Send)"
                    value={previewEmail}
                    onChange={(e) => setPreviewEmail(e.target.value)}
                    sx={{ mb: 3 }}
                    placeholder="Enter email for testing..."
                  />
                )}

                {isScheduled && (
                  <TextField
                    fullWidth
                    label="Send Time"
                    type="datetime-local"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{ mb: 3 }}
                  />
                )}

                <Box sx={{ display: 'flex', gap: 2 }}>
                  {isScheduled ? (
                    <Button
                      variant="contained"
                      startIcon={<ScheduleIcon />}
                      onClick={handleScheduleEmail}
                      disabled={isLoading}
                      sx={{ flex: 1 }}
                    >
                      {isLoading ? <CircularProgress size={20} /> : 'Schedule Send'}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      startIcon={<SendIcon />}
                      onClick={handleSendEmail}
                      disabled={isLoading}
                      sx={{ flex: 1 }}
                    >
                      {isLoading ? <CircularProgress size={20} /> : 'Send Now'}
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* One-off Email */}
          {/* <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                  <ScheduleIcon sx={{ mr: 1 }} />
                  One-off Scheduled Email
                </Typography>

                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Recipient"
                      value={oneOffRecipient}
                      onChange={(e) => setOneOffRecipient(e.target.value)}
                      placeholder="user@example.com"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Send at"
                      type="datetime-local"
                      value={oneOffSendAt}
                      onChange={(e) => setOneOffSendAt(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </Grid>

                <Button
                  variant="outlined"
                  startIcon={<ScheduleIcon />}
                  onClick={handleScheduleOneOff}
                  disabled={isLoading}
                  fullWidth
                >
                  Schedule one-off
                </Button>
              </CardContent>
            </Card>
          </Grid> */}
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          {/* Template List */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Email Templates</Typography>
                  <Button size="small" startIcon={<AddIcon />}>
                    Create New
                  </Button>
                </Box>
                <List>
                  {templates.map(template => (
                    <ListItem 
                      key={template.id}
                      button
                      onClick={() => selectTemplate(template)}
                      selected={selectedTemplate?.id === template.id}
                      sx={{ 
                        borderRadius: 1, 
                        mb: 1,
                        '&.Mui-selected': {
                          bgcolor: 'primary.50',
                          '&:hover': {
                            bgcolor: 'primary.100'
                          }
                        }
                      }}
                    >
                      <ListItemIcon>
                        <TemplateIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={template.name}
                        secondary={template.description}
                      />
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation()
                          previewTemplate(template)
                        }}
                      >
                        <PreviewIcon />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Template Preview */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Template Preview
                </Typography>
                {selectedTemplate ? (
                  <Box sx={{ 
                    border: '1px solid #ddd', 
                    borderRadius: 1, 
                    p: 2,
                    maxHeight: 500,
                    overflow: 'auto',
                    bgcolor: 'background.paper'
                  }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Subject: {selectedTemplate.subject}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {selectedTemplate.preview}
                    </Typography>
                  </Box>
                ) : (
                  <Alert severity="info">
                    Select a template to view preview
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 2 && (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
              <HistoryIcon sx={{ mr: 1 }} />
              Email History
            </Typography>

            {isLoadingHistory ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <List>
                {emailHistory.length === 0 ? (
                  <ListItem>
                    <ListItemText
                      primary={
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                          No email history yet
                        </Typography>
                      }
                    />
                  </ListItem>
                ) : (
                  emailHistory.map((email, index) => (
                    <React.Fragment key={email.id}>
                      <ListItem>
                        <ListItemIcon>
                          <EmailIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                {email.subject}
                              </Typography>
                              <Chip 
                                label={getStatusText(email.status)} 
                                color={getStatusColor(email.status)}
                                size="small"
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {email.emailType} • {new Date(email.createdAt).toLocaleDateString('vi-VN')}
                                {email.recipientEmail && ` • Gửi đến: ${email.recipientEmail}`}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 2 }}>
                                <Typography variant="caption" color="text.secondary">
                                  Đã gửi: {email.totalSent || 0}
                                </Typography>
                                {email.sentAt && (
                                  <Typography variant="caption" color="text.secondary">
                                    Gửi lúc: {new Date(email.sentAt).toLocaleString('vi-VN')}
                                  </Typography>
                                )}
                                {email.scheduledAt && (
                                  <Typography variant="caption" color="text.secondary">
                                    Lên lịch: {new Date(email.scheduledAt).toLocaleString('vi-VN')}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < emailHistory.length - 1 && <Divider />}
                    </React.Fragment>
                  ))
                )}
              </List>
            )}

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button variant="outlined" size="small" onClick={loadEmailHistory}>
                Reload History
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Template Preview Dialog */}
      <Dialog
        open={templateDialogOpen}
        onClose={() => setTemplateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Template Preview</Typography>
            <IconButton onClick={() => setTemplateDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box 
            sx={{ 
              border: '1px solid #ddd', 
              borderRadius: 1, 
              p: 2,
              maxHeight: 500,
              overflow: 'auto',
              bgcolor: 'background.paper'
            }}
            dangerouslySetInnerHTML={{ __html: templatePreview }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTemplateDialogOpen(false)}>Close</Button>
          <Button 
            variant="contained" 
            onClick={() => {
              if (selectedTemplate) {
                selectTemplate(selectedTemplate)
                setTemplateDialogOpen(false)
              }
            }}
          >
            Use Template
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default EmailMarketing