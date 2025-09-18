import React, { useState, useMemo } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
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
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'

// Icons - import từng cái
import EmailIcon from '@mui/icons-material/Email'
import ScheduleIcon from '@mui/icons-material/Schedule'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import PeopleIcon from '@mui/icons-material/People'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SendIcon from '@mui/icons-material/Send'
import HistoryIcon from '@mui/icons-material/History'
import AnalyticsIcon from '@mui/icons-material/Analytics'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { broadcastEmailNowAPI, broadcastEmailScheduleAPI, broadcastPreviewAPI, getEmailHistoryAPI, getEmailStatisticsAPI, scheduleOneOffEmailAPI } from '~/apis'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

const EmailMarketing = ({ onShowSnackbar }) => {
  const [emailType, setEmailType] = useState('cart_abandonment')
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [isScheduled, setIsScheduled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [sendAllCustomers, setSendAllCustomers] = useState(false)
  const [previewEmail, setPreviewEmail] = useState('')
  const [oneOffRecipient, setOneOffRecipient] = useState('')
  const [oneOffSendAt, setOneOffSendAt] = useState('')
  const [emailStats, setEmailStats] = useState({
    totalSent: 0,
    opened: 0,
    clicked: 0,
    converted: 0
  })
  
  const [emailHistory, setEmailHistory] = useState([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)

  // Recurring email schedules (hourly/daily/weekly) - simple panel
  const [recurring, setRecurring] = useState({ name: '', frequency: 'DAILY', minuteOfHour: 0, hourOfDay: 9, dayOfWeek: 'MONDAY', subject: '', content: '' })
  const [recurringList, setRecurringList] = useState([])
  const [savingRecurring, setSavingRecurring] = useState(false)

  const loadRecurringList = async () => {
    try {
      const res = await authorizedAxiosInstance.get(`${API_ROOT}/apis/v1/recurring-emails`)
      setRecurringList(Array.isArray(res.data) ? res.data : [])
    } catch (e) {
      // silent
    }
  }

  React.useEffect(() => { loadRecurringList() }, [])

  const submitRecurring = async () => {
    if (!recurring.name || !recurring.subject || !recurring.content) {
      onShowSnackbar('Please fill Name, Subject and Content', 'warning')
      return
    }
    try {
      setSavingRecurring(true)
      await authorizedAxiosInstance.post(`${API_ROOT}/apis/v1/recurring-emails`, { ...recurring, active: true })
      onShowSnackbar('Created recurring schedule', 'success')
      setRecurring({ name: '', frequency: 'DAILY', minuteOfHour: 0, hourOfDay: 9, dayOfWeek: 'MONDAY', subject: '', content: '' })
      loadRecurringList()
    } catch (e) {
      onShowSnackbar('Failed to create schedule', 'error')
    } finally {
      setSavingRecurring(false)
    }
  }

  // Loading states for backend actions
  

  // Email templates - sẽ load từ API thực tế
  const [emailTemplates, setEmailTemplates] = useState([
    {
      id: 'cart_abandonment',
      name: 'Cart Abandonment Recovery',
      description: 'Khôi phục giỏ hàng bị bỏ quên',
      icon: <ShoppingCartIcon />,
      color: '#f093fb'
    },
    {
      id: 'welcome',
      name: 'Welcome Series',
      description: 'Chào mừng khách hàng mới',
      icon: <PeopleIcon />,
      color: '#4facfe'
    },
    {
      id: 'promotional',
      name: 'Promotional Offers',
      description: 'Khuyến mãi và ưu đãi đặc biệt',
      icon: <TrendingUpIcon />,
      color: '#43e97b'
    },
    {
      id: 'newsletter',
      name: 'Newsletter',
      description: 'Tin tức và cập nhật sản phẩm',
      icon: <NotificationsIcon />,
      color: '#667eea'
    }
  ])

  // Load email history và statistics khi component mount
  React.useEffect(() => {
    loadEmailHistory()
    loadEmailStatistics()
  }, [])

  const handleSendEmail = async () => {
    if (!subject || !content) {
      onShowSnackbar('Vui lòng điền đầy đủ thông tin', 'warning')
      return
    }

    setIsLoading(true)
    
    try {
      if (sendAllCustomers) {
        const res = await broadcastEmailNowAPI({ subject, content })
        onShowSnackbar(`Đã gửi broadcast: ${res.sent || 0} email`, 'success')
      } else if (previewEmail) {
        await broadcastPreviewAPI(previewEmail, { subject, content })
        onShowSnackbar('Đã gửi email preview', 'success')
      } else {
        onShowSnackbar('Vui lòng nhập email preview hoặc bật gửi toàn bộ khách hàng', 'warning')
      }
      
      // Reset form
      setSubject('')
      setContent('')
      setScheduledTime('')
      setIsScheduled(false)
      setPreviewEmail('')
      
      // Reload history sau khi gửi
      loadEmailHistory()
      
    } catch (error) {
      onShowSnackbar('Có lỗi xảy ra khi gửi email', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleScheduleEmail = async () => {
    if (!scheduledTime) {
      onShowSnackbar('Vui lòng chọn thời gian gửi', 'warning')
      return
    }

    // Kiểm tra thời gian lên lịch phải trong tương lai
    const scheduleDate = new Date(scheduledTime)
    const now = new Date()
    if (scheduleDate <= now) {
      onShowSnackbar('Thời gian lên lịch phải trong tương lai', 'warning')
      return
    }

    setIsLoading(true)
    
    try {
      if (sendAllCustomers) {
        // Convert datetime-local to ISO string for backend
        const scheduleAtISO = new Date(scheduledTime).toISOString()
        const res = await broadcastEmailScheduleAPI({ subject, content, scheduleAt: scheduleAtISO })
        const scheduleTime = new Date(scheduledTime).toLocaleString('vi-VN')
        onShowSnackbar(`Đã lên lịch gửi email lúc ${scheduleTime}`, 'success')
      } else {
        onShowSnackbar('Bật "Gửi tất cả khách hàng" để lên lịch broadcast', 'warning')
      }
      
      // Reload history sau khi lên lịch
      loadEmailHistory()
      
    } catch (error) {
      onShowSnackbar('Có lỗi xảy ra khi lên lịch email', 'error')
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
      case 'sent': return 'Đã gửi'
      case 'scheduled': return 'Đã lên lịch'
      case 'failed': return 'Thất bại'
      case 'active': return 'Đang hoạt động'
      case 'completed': return 'Hoàn thành'
      case 'draft': return 'Nháp' 
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
      onShowSnackbar('Lỗi tải lịch sử email', 'error')
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
      {/* Email Statistics */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', bgcolor: '#f8f9fa' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EmailIcon sx={{ fontSize: 32, mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {emailStats.totalSent.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tổng email đã gửi
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', bgcolor: '#f8f9fa' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AnalyticsIcon sx={{ fontSize: 32, mr: 2, color: 'success.main' }} />
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {emailStats.opened.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Email đã mở
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', bgcolor: '#f8f9fa' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon sx={{ fontSize: 32, mr: 2, color: 'warning.main' }} />
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {emailStats.clicked.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Email đã click
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', bgcolor: '#f8f9fa' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PeopleIcon sx={{ fontSize: 32, mr: 2, color: 'info.main' }} />
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {emailStats.converted.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Khách hàng chuyển đổi
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Email Creation Form */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 'fit-content' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
              <EmailIcon sx={{ mr: 1 }} />
              Tạo Email Marketing
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                Loại Email
              </Typography>
              <Grid container spacing={2}>
                {emailTemplates.map((template) => (
                  <Grid item xs={6} key={template.id}>
                    <Card 
                      sx={{ 
                        cursor: 'pointer',
                        border: emailType === template.id ? 2 : 1,
                        borderColor: emailType === template.id ? 'primary.main' : 'divider',
                        bgcolor: emailType === template.id ? 'primary.light' : 'background.paper',
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                      onClick={() => setEmailType(template.id)}
                    >
                      <CardContent sx={{ p: 2, textAlign: 'center' }}>
                        <Box sx={{ color: template.color, mb: 1 }}>
                          {template.icon}
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                          {template.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {template.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            <TextField
              fullWidth
              label="Tiêu đề email"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              sx={{ mb: 3 }}
              placeholder="Nhập tiêu đề email..."
            />

            <TextField
              fullWidth
              label="Nội dung email"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              multiline
              rows={6}
              sx={{ mb: 3 }}
              placeholder="Nhập nội dung email..."
            />

            <FormControlLabel
              control={
                <Switch
                  checked={isScheduled}
                  onChange={(e) => setIsScheduled(e.target.checked)}
                />
              }
              label="Lên lịch gửi email"
              sx={{ mb: 2 }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={sendAllCustomers}
                  onChange={(e) => setSendAllCustomers(e.target.checked)}
                />
              }
              label="Gửi tất cả khách hàng"
              sx={{ mb: 2 }}
            />

            {!sendAllCustomers && (
              <TextField
                fullWidth
                label="Preview email (gửi thử)"
                value={previewEmail}
                onChange={(e) => setPreviewEmail(e.target.value)}
                sx={{ mb: 3 }}
                placeholder="Nhập email để gửi thử..."
              />
            )}

            {isScheduled && (
              <TextField
                fullWidth
                label="Thời gian gửi"
                type="datetime-local"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 3 }}
              />
            )}

            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
              One-off Scheduled Email (Manual)
            </Typography>
            <Grid container spacing={2} sx={{ mb: 1 }}>
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
              sx={{ mb: 2 }}
            >
              Schedule one-off
            </Button>

            <Box sx={{ display: 'flex', gap: 2 }}>
              {isScheduled ? (
                <Button
                  variant="contained"
                  startIcon={<ScheduleIcon />}
                  onClick={handleScheduleEmail}
                  disabled={isLoading}
                  sx={{ flex: 1 }}
                >
                  {isLoading ? <CircularProgress size={20} /> : 'Lên lịch gửi'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  startIcon={<SendIcon />}
                  onClick={handleSendEmail}
                  disabled={isLoading}
                  sx={{ flex: 1 }}
                >
                  {isLoading ? <CircularProgress size={20} /> : 'Gửi ngay'}
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Email Campaigns */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 'fit-content' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
              <HistoryIcon sx={{ mr: 1 }} />
              Chiến dịch Email gần đây
            </Typography>

            {isLoadingHistory ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {emailHistory.length === 0 ? (
                  <ListItem sx={{ px: 0, py: 2 }}>
                    <ListItemText
                      primary={
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                          Chưa có lịch sử email nào
                        </Typography>
                      }
                    />
                  </ListItem>
                ) : (
                  emailHistory.map((email, index) => (
                    <React.Fragment key={email.id}>
                      <ListItem sx={{ px: 0, py: 1 }}>
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
                Tải lại lịch sử
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Recurring Scheduler (simple) */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Recurring Emails</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <TextField fullWidth label="Name" value={recurring.name} onChange={e => setRecurring(r => ({ ...r, name: e.target.value }))} />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField fullWidth select SelectProps={{ native: true }} label="Frequency" value={recurring.frequency} onChange={e => setRecurring(r => ({ ...r, frequency: e.target.value }))}>
                  <option value="HOURLY">Hourly</option>
                  <option value="DAILY">Daily</option>
                  <option value="WEEKLY">Weekly</option>
                </TextField>
              </Grid>
              <Grid item xs={6} sm={2}>
                <TextField fullWidth type="number" label="Minute" value={recurring.minuteOfHour} onChange={e => setRecurring(r => ({ ...r, minuteOfHour: Number(e.target.value) }))} />
              </Grid>
              <Grid item xs={6} sm={2}>
                <TextField fullWidth type="number" label="Hour" value={recurring.hourOfDay} onChange={e => setRecurring(r => ({ ...r, hourOfDay: Number(e.target.value) }))} />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField fullWidth select SelectProps={{ native: true }} label="Day of week" value={recurring.dayOfWeek} onChange={e => setRecurring(r => ({ ...r, dayOfWeek: e.target.value }))}>
                  {['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY'].map(d => <option key={d} value={d}>{d}</option>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Subject" value={recurring.subject} onChange={e => setRecurring(r => ({ ...r, subject: e.target.value }))} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Content" value={recurring.content} onChange={e => setRecurring(r => ({ ...r, content: e.target.value }))} />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" onClick={submitRecurring} disabled={savingRecurring}>{savingRecurring ? 'Saving…' : 'Create recurring'}</Button>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Existing schedules</Typography>
            <List>
              {recurringList.map(item => (
                <ListItem key={item.id} sx={{ px: 0 }}>
                  <ListItemText primary={`${item.name} • ${item.frequency}`} secondary={`next: ${item.nextRunAt || 'N/A'}`} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      
    </Box>
  )
}

export default EmailMarketing
