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
import { triggerEmailSchedulerNowAPI, testEmailSchedulerScheduleAPI, getCartScanStatsAPI, scanAndSendCartEmailsAPI, getSchedulerInfoAPI, broadcastEmailNowAPI, broadcastEmailScheduleAPI, broadcastPreviewAPI, getEmailHistoryAPI, getEmailStatisticsAPI, testEmailSchedulerAPI, getActiveEmailTemplatesAPI } from '~/apis'

const EmailMarketing = ({ onShowSnackbar }) => {
  const [emailType, setEmailType] = useState('cart_abandonment')
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [isScheduled, setIsScheduled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [sendAllCustomers, setSendAllCustomers] = useState(false)
  const [previewEmail, setPreviewEmail] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [templates, setTemplates] = useState([])
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [emailStats, setEmailStats] = useState({
    totalSent: 0,
    opened: 0,
    clicked: 0,
    converted: 0
  })
  const [cartScanStats, setCartScanStats] = useState(null)
  const [schedulerInfo, setSchedulerInfo] = useState('')
  const [emailHistory, setEmailHistory] = useState([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)

  // Loading states for backend actions
  const [isTriggering, setIsTriggering] = useState(false)
  const [isSchedulingAuto, setIsSchedulingAuto] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [isFetchingStats, setIsFetchingStats] = useState(false)
  const [isTestingScheduler, setIsTestingScheduler] = useState(false)

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
    loadTemplates()
  }, [])

  // Load templates từ API
  const loadTemplates = async () => {
    try {
      const data = await getActiveEmailTemplatesAPI()
      setTemplates(data)
    } catch (error) {
      console.error('Lỗi load templates:', error)
      onShowSnackbar('Lỗi tải danh sách template', 'error')
    }
  }

  // Chọn template
  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template)
    setSubject(template.subject)
    setContent(template.content)
    setShowTemplateSelector(false)
    onShowSnackbar(`Đã chọn template: ${template.name}`, 'success')
  }

  // Bỏ chọn template
  const handleUnselectTemplate = () => {
    setSelectedTemplate(null)
    setSubject('')
    setContent('')
    onShowSnackbar('Đã bỏ chọn template', 'info')
  }

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
  const triggerCartAbandonmentEmails = async () => {
    try {
      setIsTriggering(true)
      const res = await triggerEmailSchedulerNowAPI()
      onShowSnackbar(res || 'Đã trigger gửi email thành công', 'success')
    } catch (e) {
      onShowSnackbar(`Lỗi trigger gửi email: ${e.message}`, 'error')
    } finally {
      setIsTriggering(false)
    }
  }

  const scheduleAutoEmails = async (hours = 2) => {
    try {
      setIsSchedulingAuto(true)
      const res = await testEmailSchedulerScheduleAPI(hours)
      onShowSnackbar(res || `Đã test lịch tự động mỗi ${hours} giờ`, 'success')
    } catch (e) {
      onShowSnackbar(`Lỗi lên lịch: ${e.message}`, 'error')
    } finally {
      setIsSchedulingAuto(false)
    }
  }

  const getCartScanStats = async () => {
    try {
      setIsFetchingStats(true)
      const data = await getCartScanStatsAPI()
      setCartScanStats(data)
      onShowSnackbar(`Scan stats: scanned=${data.totalCustomersScanned ?? 'N/A'}, new=${data.newCustomersFound ?? 'N/A'}`, 'info')
    } catch (e) {
      onShowSnackbar(`Lỗi lấy thống kê scan: ${e.message}`, 'error')
    } finally {
      setIsFetchingStats(false)
    }
  }

  const scanAndSendCartEmails = async () => {
    try {
      setIsScanning(true)
      const data = await scanAndSendCartEmailsAPI()
      const msg = `Đã quét và gửi email cho ${data.newCustomersFound ?? 'N/A'} khách hàng`
      onShowSnackbar(msg, 'success')
      // Cập nhật KPI giả lập
      setEmailStats(prev => ({
        ...prev,
        totalSent: (prev.totalSent || 0) + (data.newCustomersFound || 0),
        converted: (prev.converted || 0) + Math.round((data.newCustomersFound || 0) * 0.1)
      }))
      // Refresh stats sau khi gửi
      await getCartScanStats()
    } catch (e) {
      onShowSnackbar(`Lỗi quét/gửi email: ${e.message}`, 'error')
    } finally {
      setIsScanning(false)
    }
  }

  const fetchSchedulerInfo = async () => {
    try {
      const info = await getSchedulerInfoAPI()
      setSchedulerInfo(info)
      onShowSnackbar('Đã tải cấu hình scheduler', 'success')
    } catch (e) {
      onShowSnackbar(`Lỗi tải scheduler info: ${e.message}`, 'error')
    }
  }

  const testScheduler = async () => {
    try {
      setIsTestingScheduler(true)
      const result = await testEmailSchedulerAPI()
      onShowSnackbar('Đã test scheduler - kiểm tra email đã lên lịch', 'success')
      // Reload history để xem email đã được gửi
      loadEmailHistory()
    } catch (e) {
      onShowSnackbar(`Lỗi test scheduler: ${e.message}`, 'error')
    } finally {
      setIsTestingScheduler(false)
    }
  }

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

            {/* Template Selector */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Chọn Template</Typography>
                <Button
                  variant="outlined"
                  onClick={() => setShowTemplateSelector(!showTemplateSelector)}
                  sx={{ minWidth: 120 }}
                >
                  {showTemplateSelector ? 'Ẩn Templates' : 'Chọn Template'}
                </Button>
              </Box>
              
              {selectedTemplate && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    Đã chọn: {selectedTemplate.name}
                  </Typography>
                  <Typography variant="body2">
                    Subject: {selectedTemplate.subject}
                  </Typography>
                  <Button 
                    size="small" 
                    color="error" 
                    onClick={handleUnselectTemplate}
                    sx={{ mt: 1 }}
                  >
                    Bỏ chọn template
                  </Button>
                </Alert>
              )}

              {showTemplateSelector && (
                <Grid container spacing={2}>
                  {templates.map((template) => (
                    <Grid item xs={12} md={6} key={template.id}>
                      <Card 
                        sx={{ 
                          cursor: 'pointer',
                          border: selectedTemplate?.id === template.id ? 2 : 1,
                          borderColor: selectedTemplate?.id === template.id ? 'primary.main' : 'divider',
                          '&:hover': { borderColor: 'primary.main' }
                        }}
                        onClick={() => handleSelectTemplate(template)}
                      >
                        <CardContent>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                            {template.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {template.subject}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {template.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>

            {/* Chỉ hiển thị textField khi KHÔNG chọn template */}
            {!selectedTemplate && (
              <>
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
              </>
            )}

            {/* Hiển thị preview khi đã chọn template */}
            {selectedTemplate && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Preview Email</Typography>
                <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Subject: {subject}
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box 
                    dangerouslySetInnerHTML={{ __html: content }}
                    sx={{ 
                      border: '1px solid #ddd', 
                      padding: 2, 
                      bgcolor: 'white',
                      borderRadius: 1
                    }}
                  />
                </Paper>
              </Box>
            )}

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
      </Grid>

      {/* Cart Abandonment Section */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
          <ShoppingCartIcon sx={{ mr: 1 }} />
          Quản lý Cart Abandonment
        </Typography>

        <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: '#fff3e0', border: '1px solid #ffb74d' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: '#e65100' }}>
                Cart Abandonment Rate
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#e65100', mb: 1 }}>
                {cartScanStats?.abandonmentRate || 'N/A'}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tỷ lệ giỏ hàng bị bỏ quên trong tháng này
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: '#e8f5e8', border: '1px solid #81c784' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: '#2e7d32' }}>
                Recovery Emails Sent
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2e7d32', mb: 1 }}>
                {cartScanStats?.totalEmailsSent || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email khôi phục đã được gửi
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: '#e3f2fd', border: '1px solid #64b5f6' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: '#1565c0' }}>
                Recovered Revenue
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1565c0', mb: 1 }}>
                ₫{cartScanStats?.recoveredRevenue || '0'}M
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Doanh thu được khôi phục từ cart abandonment
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<EmailIcon />}
            onClick={triggerCartAbandonmentEmails}
            disabled={isTriggering}
          >
            {isTriggering ? <CircularProgress size={20} /> : 'Gửi Email Cart Abandonment'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<ScheduleIcon />}
            onClick={() => scheduleAutoEmails(2)}
            disabled={isSchedulingAuto}
          >
            {isSchedulingAuto ? 'Đang thiết lập...' : 'Lên lịch gửi tự động'}
          </Button>
          <Button
            variant="outlined"
            onClick={fetchSchedulerInfo}
          >
            Xem cấu hình Scheduler
          </Button>
          <Button
            variant="outlined"
            onClick={getCartScanStats}
            disabled={isFetchingStats}
          >
            {isFetchingStats ? 'Đang lấy thống kê...' : 'Lấy thống kê quét'}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={scanAndSendCartEmails}
            disabled={isScanning}
          >
            {isScanning ? <CircularProgress size={20} /> : 'Quét và gửi email'}
          </Button>
          <Button
            variant="outlined"
            color="info"
            onClick={testScheduler}
            disabled={isTestingScheduler}
          >
            {isTestingScheduler ? <CircularProgress size={20} /> : 'Test Scheduler'}
          </Button>
        </Box>
      </Paper>
      {!!schedulerInfo && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
            Cấu hình Scheduler
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
            {schedulerInfo}
          </Typography>
        </Paper>
      )}
      {!!cartScanStats && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
            Thống kê Quét Cart
          </Typography>
          <Typography variant="body2">
            Tổng đã quét: {cartScanStats.totalCustomersScanned ?? 'N/A'}
          </Typography>
          <Typography variant="body2">
            Khách hàng mới phát hiện: {cartScanStats.newCustomersFound ?? 'N/A'}
          </Typography>
        </Paper>
      )}
    </Box>
  )
}

export default EmailMarketing
