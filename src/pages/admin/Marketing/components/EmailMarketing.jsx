import React, { useState, useEffect, useMemo } from 'react'
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
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Pagination from '@mui/material/Pagination'
import { toast } from 'react-toastify'

// Icons
import EmailIcon from '@mui/icons-material/Email'
import ScheduleIcon from '@mui/icons-material/Schedule'
import PeopleIcon from '@mui/icons-material/People'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import SendIcon from '@mui/icons-material/Send'
import HistoryIcon from '@mui/icons-material/History'
import AnalyticsIcon from '@mui/icons-material/Analytics'
import EditIcon from '@mui/icons-material/Edit'
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
  
  // Templates removed
  
  // Statistics and history
  const [emailStats, setEmailStats] = useState({
    totalSent: 0,
    opened: 0,
    clicked: 0,
    converted: 0
  })
  const [emailHistory, setEmailHistory] = useState([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  
  // Filter states
  const [filterText, setFilterText] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  // Load data on mount
  useEffect(() => {
    loadEmailHistory()
    loadEmailStatistics()
  }, [page])

  // Templates removed

  // Templates removed

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
      const data = await getEmailHistoryAPI(page, 10)
      const list = data.content || []
      // Sort newest first by createdAt (fallback to sentAt/scheduledAt)
      list.sort((a, b) => {
        const getTs = (x) => new Date(x?.createdAt || x?.sentAt || x?.scheduledAt || 0).getTime()
        return getTs(b) - getTs(a)
      })
      setEmailHistory(list)
      setTotalPages(data.totalPages || 0)
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
  
  // Filter campaigns
  const filteredEmailHistory = useMemo(() => {
    return emailHistory
      .filter(c => (filterType ? c.emailType === filterType : true))
      .filter(c => (filterStatus ? c.status === filterStatus : true))
      .filter(c => (filterText ? (c.subject?.toLowerCase().includes(filterText.toLowerCase()) || c.content?.toLowerCase().includes(filterText.toLowerCase())) : true))
  }, [emailHistory, filterText, filterType, filterStatus])

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Main Content Tabs */}
      <Card variant="outlined">
        <CardContent sx={{ pb: 0 }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab icon={<EmailIcon />} label="Create Email" iconPosition="start" />
            <Tab icon={<HistoryIcon />} label="History" iconPosition="start" />
          </Tabs>
        </CardContent>
      </Card>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Grid  item xs={12} md={12}>
          {/* Email Creation Form */}
          <Grid item xs={12} md={6}>
            <Card >
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                  <EmailIcon sx={{ mr: 1 }} />
                  Create Email Marketing
                </Typography>

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
                    label="Input Customer Email"
                    value={previewEmail}
                    onChange={(e) => setPreviewEmail(e.target.value)}
                    sx={{ mb: 3 }}
                    placeholder="Enter email"
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

          <Grid item xs={12} md={6} />
        </Grid>
      )}

      {/* History tab */}
      {activeTab === 1 && (
        <Paper>
          <Box sx={{ p: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              size="small"
              label="Search"
              placeholder="Subject or content"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Type</InputLabel>
              <Select label="Type" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <MenuItem value="">All</MenuItem>
                <MenuItem value="broadcast">Broadcast</MenuItem>
                <MenuItem value="preview">Preview</MenuItem>
                <MenuItem value="cart_abandonment">Cart Abandonment</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Status</InputLabel>
              <Select label="Status" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <MenuItem value="">All</MenuItem>
                <MenuItem value="sent">Sent</MenuItem>
                <MenuItem value="scheduled">Scheduled</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
              </Select>
            </FormControl>
            {(filterText || filterType || filterStatus) && (
              <Button size="small" onClick={() => { setFilterText(''); setFilterType(''); setFilterStatus('') }}>Clear</Button>
            )}
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Subject</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Sent Count</TableCell>
                  <TableCell>Created Date</TableCell>
                  <TableCell>Recipient</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoadingHistory ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : filteredEmailHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body2" color="text.secondary">
                        No email history yet
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmailHistory.map((email) => (
                    <TableRow key={email.id}>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {email.subject}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={email.emailType} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={getStatusText(email.status)} 
                          color={getStatusColor(email.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{email.totalSent || 0}</TableCell>
                      <TableCell>
                        {new Date(email.createdAt).toLocaleDateString('en-US')}
                      </TableCell>
                      <TableCell>
                        {email.recipientEmail || 'All Customers'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <Pagination
                count={totalPages}
                page={page + 1}
                onChange={(event, value) => setPage(value - 1)}
              />
            </Box>
          )}
        </Paper>
      )}

      {/* Removed old tab index 2 */}

      {/* Templates removed */}
    </Box>
  )
}

export default EmailMarketing