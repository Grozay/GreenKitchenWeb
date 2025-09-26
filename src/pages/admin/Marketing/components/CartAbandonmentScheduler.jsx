
import React, { useState, useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { TimeField } from '@mui/x-date-pickers/TimeField'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
  Refresh as RefreshIcon,
  PowerSettingsNew as PowerIcon,
  AccessTime as TimeIcon,
  Email as EmailIcon,
  TrackChanges as TrackingIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material'
import { 
  createCartAbandonmentScheduleAPI,
  updateCartAbandonmentScheduleAPI,
  getAllCartAbandonmentSchedulesAPI,
  deleteCartAbandonmentScheduleAPI,
  toggleCartAbandonmentScheduleAPI,
  checkCartAbandonmentScheduleNameAPI,
  getCartAbandonmentScheduleStatisticsAPI,
  getCartEmailLogsAPI,
  getEmailLogStatisticsAPI,
  getEmailTrackingAPI,
  getTrackingStatisticsAPI
} from '~/apis'

const CartAbandonmentScheduler = ({ onShowSnackbar }) => {
  const [schedules, setSchedules] = useState([])
  const [statistics, setStatistics] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [scheduleToDelete, setScheduleToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [errors, setErrors] = useState({ scheduleName: '', dailyTime: '', eveningTime: '' })
  const [nameStatus, setNameStatus] = useState('idle') // idle | checking | ok | conflict
  const nameCheckTimerRef = useRef(null)

  // Email tracking states
  const [emailLogs, setEmailLogs] = useState([])
  const [emailTracking, setEmailTracking] = useState([])
  const [emailLogStats, setEmailLogStats] = useState({})
  const [trackingStats, setTrackingStats] = useState({})
  const [isLoadingEmailLogs, setIsLoadingEmailLogs] = useState(false)
  const [activeTab, setActiveTab] = useState(0) // 0: Schedules, 1: Email Logs, 2: Tracking
  
  // Filter states
  const [selectedLinkTypes, setSelectedLinkTypes] = useState([])
  const availableLinkTypes = ['CART', 'CHECKOUT', 'UNSUBSCRIBE', 'PREFERENCES', 'SOCIAL_FACEBOOK', 'SOCIAL_INSTAGRAM', 'SOCIAL_TWITTER']

  // Form state
  const [formData, setFormData] = useState({
    scheduleName: '',
    dailyTime: new Date(2024, 0, 1, 9, 0), // 09:00
    intervalHours: 6,
    isDailyEnabled: true,
    isIntervalEnabled: false,
    isEveningEnabled: false,
    eveningTime: new Date(2024, 0, 1, 18, 0), // 18:00
    description: ''
  })

  useEffect(() => {
    loadSchedules()
    loadStatistics()
    loadEmailLogs()
    loadEmailTracking()
    loadEmailLogStatistics()
    loadTrackingStatistics()
  }, [])

  useEffect(() => {
    if (activeTab === 1) {
      loadEmailLogs()
      loadEmailLogStatistics()
    } else if (activeTab === 2) {
      loadEmailTracking()
      loadTrackingStatistics()
    }
  }, [activeTab])

  const loadSchedules = async () => {
    try {
      setIsLoading(true)
      const data = await getAllCartAbandonmentSchedulesAPI()
      setSchedules(data)
    } catch (error) {
      onShowSnackbar('Error loading schedules list', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const loadStatistics = async () => {
    try {
      const data = await getCartAbandonmentScheduleStatisticsAPI()
      setStatistics(data)
    } catch (error) {
      // silent
    }
  }

  const loadEmailLogs = async () => {
    try {
      setIsLoadingEmailLogs(true)
      const data = await getCartEmailLogsAPI(0, 50)
      setEmailLogs(data.emailLogs || [])
    } catch (error) {
      onShowSnackbar('Error loading email logs', 'error')
    } finally {
      setIsLoadingEmailLogs(false)
    }
  }

  const loadEmailTracking = async (linkTypes = null) => {
    try {
      setIsLoadingEmailLogs(true)
      const data = await getEmailTrackingAPI(0, 50, null, null, null, linkTypes || selectedLinkTypes)
      setEmailTracking(data.trackingLogs || [])
    } catch (error) {
      onShowSnackbar('Error loading email tracking', 'error')
    } finally {
      setIsLoadingEmailLogs(false)
    }
  }

  const loadEmailLogStatistics = async () => {
    try {
      const data = await getEmailLogStatisticsAPI()
      setEmailLogStats(data)
    } catch (error) {
      // silent
    }
  }

  const loadTrackingStatistics = async () => {
    try {
      const data = await getTrackingStatisticsAPI()
      setTrackingStats(data)
    } catch (error) {
      // silent
    }
  }

  

  const handleCreateSchedule = () => {
    setEditingSchedule(null)
    setFormData({
      scheduleName: '',
      dailyTime: new Date(2024, 0, 1, 9, 0), // 09:00
      intervalHours: 6,
      isDailyEnabled: true,
      isIntervalEnabled: false,
      isEveningEnabled: false,
      eveningTime: new Date(2024, 0, 1, 18, 0), // 18:00
      description: ''
    })
    setOpenDialog(true)
  }

  const handleEditSchedule = (schedule) => {
    setEditingSchedule(schedule)
    
    // Convert string time to Date object
    const parseTimeString = (timeString) => {
      if (!timeString) return new Date(2024, 0, 1, 9, 0)
      const [hours, minutes] = timeString.split(':').map(Number)
      return new Date(2024, 0, 1, hours, minutes)
    }
    
    setFormData({
      scheduleName: schedule.scheduleName,
      dailyTime: parseTimeString(schedule.dailyTime),
      intervalHours: schedule.intervalHours || 6,
      isDailyEnabled: schedule.isDailyEnabled,
      isIntervalEnabled: schedule.isIntervalEnabled,
      isEveningEnabled: schedule.isEveningEnabled,
      eveningTime: parseTimeString(schedule.eveningTime),
      description: schedule.description || ''
    })
    setOpenDialog(true)
  }

  const handleSaveSchedule = async () => {
    if (!validateForm()) return

    try {
      // Convert Date objects to time strings for API
      const formatTimeToString = (date) => {
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        return `${hours}:${minutes}`
      }

      const apiData = {
        ...formData,
        dailyTime: formatTimeToString(formData.dailyTime),
        eveningTime: formatTimeToString(formData.eveningTime)
      }

      if (editingSchedule) {
        await updateCartAbandonmentScheduleAPI(editingSchedule.id, apiData)
        onShowSnackbar('Schedule updated successfully', 'success')
      } else {
        await createCartAbandonmentScheduleAPI(apiData)
        onShowSnackbar('New schedule created successfully', 'success')
      }
      
      setOpenDialog(false)
      loadSchedules()
      loadStatistics()
      
    } catch (error) {
      onShowSnackbar('Error saving schedule: ' + error.message, 'error')
    }
  }

  // Validation helpers
  const isMorningTime = (time) => {
    if (!time) return false
    if (time instanceof Date) {
      const h = time.getHours()
      return h >= 5 && h < 12
    }
    const [h] = time.split(':').map(Number)
    return h >= 5 && h < 12
  }

  const isEveningTime = (time) => {
    if (!time) return false
    if (time instanceof Date) {
      const h = time.getHours()
      return h >= 13 && h <= 22
    }
    const [h] = time.split(':').map(Number)
    return h >= 13 && h <= 22
  }

  // Helper function to format time for display
  const formatTimeForDisplay = (time) => {
    if (time instanceof Date) {
      const hours = String(time.getHours()).padStart(2, '0')
      const minutes = String(time.getMinutes()).padStart(2, '0')
      return `${hours}:${minutes}`
    }
    return time || '--'
  }

  const validateForm = () => {
    let valid = true
    const newErrors = { scheduleName: '', dailyTime: '', eveningTime: '' }
    if (!formData.scheduleName || formData.scheduleName.trim().length === 0) {
      newErrors.scheduleName = 'Schedule name is required'
      valid = false
    }
    if (nameStatus === 'checking') valid = false
    if (nameStatus === 'conflict' && (!editingSchedule || editingSchedule.scheduleName !== formData.scheduleName)) {
      newErrors.scheduleName = 'Schedule name already exists'
      valid = false
    }

    if (formData.isDailyEnabled && !isMorningTime(formData.dailyTime)) {
      newErrors.dailyTime = 'Please select a morning time (05:00 - 11:59)'
      valid = false
    }
    if (formData.isEveningEnabled && !isEveningTime(formData.eveningTime)) {
      newErrors.eveningTime = 'Please select an evening time (17:00 - 22:00)'
      valid = false
    }
    setErrors(newErrors)
    if (!valid) onShowSnackbar?.('Please fix validation errors', 'warning')
    return valid
  }

  const handleScheduleNameChange = (value) => {
    setFormData(prev => ({ ...prev, scheduleName: value }))
    setErrors(prev => ({ ...prev, scheduleName: '' }))
    if (nameCheckTimerRef.current) clearTimeout(nameCheckTimerRef.current)
    const trimmed = (value || '').trim()
    if (!trimmed) {
      setNameStatus('idle')
      return
    }
    // If name unchanged in edit mode, skip check
    if (editingSchedule && trimmed === editingSchedule.scheduleName) {
      setNameStatus('ok')
      return
    }
    setNameStatus('checking')
    nameCheckTimerRef.current = setTimeout(async () => {
      try {
        const excludeId = editingSchedule ? editingSchedule.id : null
        const result = await checkCartAbandonmentScheduleNameAPI(trimmed, excludeId)
        const exists = typeof result === 'object' && result !== null && 'exists' in result ? result.exists : result
        setNameStatus(exists ? 'conflict' : 'ok')
      } catch (e) {
        setNameStatus('idle')
      }
    }, 400)
  }

  const handleDeleteSchedule = (schedule) => {
    setScheduleToDelete(schedule)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteSchedule = async () => {
    if (!scheduleToDelete) return
    try {
      setIsDeleting(true)
      await deleteCartAbandonmentScheduleAPI(scheduleToDelete.id)
      onShowSnackbar('Schedule deleted successfully', 'success')
      await loadSchedules()
      await loadStatistics()
    } catch (error) {
      onShowSnackbar('Error deleting schedule: ' + error.message, 'error')
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setScheduleToDelete(null)
    }
  }

  const cancelDeleteSchedule = () => {
    setDeleteDialogOpen(false)
    setScheduleToDelete(null)
  }

  const handleToggleSchedule = async (id) => {
    try {
      await toggleCartAbandonmentScheduleAPI(id)
      onShowSnackbar('Schedule status updated', 'success')
      loadSchedules()
      loadStatistics()
    } catch (error) {
      onShowSnackbar('Error updating status: ' + error.message, 'error')
    }
  }

  const getStatusColor = (isActive) => {
    return isActive ? 'success' : 'default'
  }

  const getStatusText = (isActive) => {
    return isActive ? 'Active' : 'Inactive'
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '--'
    const date = new Date(dateTimeString)
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleLinkTypeFilter = (linkTypes) => {
    setSelectedLinkTypes(linkTypes)
    loadEmailTracking(linkTypes)
  }

  return (
    <Box>
      {/* Header với thống kê */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'background.paper' }}>
            <CardContent>
              <Typography variant="h4" color="primary">
                {statistics.totalSchedules || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Schedules
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'background.paper' }}>
            <CardContent>
              <Typography variant="h4" color="success.main">
                {statistics.activeSchedules || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Schedules
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'background.paper' }}>
            <CardContent>
              <Typography variant="h4" color="info.main">
                {emailLogStats.totalEmails || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Emails Sent
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'background.paper' }}>
            <CardContent>
              <Typography variant="h4" color="warning.main">
                {trackingStats.totalClicks || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Link Clicks
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
      </Grid>

      {/* Tabs Navigation */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab 
            label="Schedule Management" 
            icon={<ScheduleIcon />} 
            iconPosition="start"
          />
          <Tab 
            label="Email Logs" 
            icon={<EmailIcon />} 
            iconPosition="start"
          />
          <Tab 
            label="Email Tracking" 
            icon={<TrackingIcon />} 
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && (
        <>
          {/* Actions */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Cart Abandonment Schedule Management</Typography>
              <Box>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={loadSchedules}
                  sx={{ mr: 1 }}
                >
                  Refresh
                </Button>
                
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreateSchedule}
                >
                  Create New Schedule
                </Button>
              </Box>
            </Box>
          </Paper>
        </>
      )}

      {activeTab === 1 && (
        <>
          {/* Email Logs Actions */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Email Logs - Customers who have received email</Typography>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={loadEmailLogs}
              >
                Refresh
              </Button>
            </Box>
          </Paper>
        </>
      )}

      {activeTab === 2 && (
        <>
          {/* Email Tracking Actions */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Email Tracking - Track click links</Typography>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={loadEmailTracking}
              >
                Refresh
              </Button>
            </Box>
          </Paper>
        </>
      )}

      {/* Tab Content Tables */}
      <Paper>
        <TableContainer>
          <Table>
            {/* Schedule Management Tab */}
            {activeTab === 0 && (
              <>
                <TableHead>
                  <TableRow>
                    <TableCell>Schedule Name</TableCell>
                    <TableCell>Daily Time</TableCell>
                    <TableCell>Evening Time</TableCell>
                    <TableCell>Interval</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : schedules.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography variant="body2" color="text.secondary">
                          No schedules yet
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    schedules.map((schedule) => (
                      <TableRow key={schedule.id}>
                        <TableCell>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {schedule.scheduleName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {schedule.isDailyEnabled ? (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <TimeIcon sx={{ mr: 1, fontSize: 16 }} />
                              {schedule.dailyTime}
                            </Box>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              Off
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {schedule.isEveningEnabled ? (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <TimeIcon sx={{ mr: 1, fontSize: 16 }} />
                              {schedule.eveningTime}
                            </Box>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              Off
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {schedule.isIntervalEnabled ? (
                            <Chip label={`${schedule.intervalHours}h`} size="small" color="info" />
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              Off
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={getStatusText(schedule.isActive)} 
                            color={getStatusColor(schedule.isActive)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {schedule.description || 'No description'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <IconButton size="small" onClick={() => handleEditSchedule(schedule)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            onClick={() => handleToggleSchedule(schedule.id)}
                            color={schedule.isActive ? 'warning' : 'success'}
                          >
                            <PowerIcon />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            onClick={() => handleDeleteSchedule(schedule)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </>
            )}

            {/* Email Logs Tab */}
            {activeTab === 1 && (
              <>
                <TableHead>
                  <TableRow>
                    <TableCell>Customer Email</TableCell>
                    <TableCell>Email Type</TableCell>
                    <TableCell>Sent At</TableCell>
                    <TableCell>Cart Items</TableCell>
                    <TableCell>Total Amount</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoadingEmailLogs ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : emailLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography variant="body2" color="text.secondary">
                          No email logs yet
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    emailLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {log.customerEmail || `Customer #${log.customerId}`}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={log.emailType || 'CART_ABANDONMENT'} 
                            size="small" 
                            color="primary" 
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDateTime(log.emailSentAt)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {log.cartItemsCount || 0} items
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {log.totalAmount ? `${log.totalAmount.toLocaleString('vi-VN')} VNĐ` : '--'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={log.emailStatus || 'SENT'} 
                            size="small" 
                            color="success" 
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </>
            )}

            {/* Email Tracking Tab - Chỉ hiển thị CART links */}
            {activeTab === 2 && (
              <>
                <TableHead>
                  <TableRow>
                    <TableCell>Customer Email</TableCell>
                    <TableCell>Email Type</TableCell>
                    <TableCell>Cart Link Clicked</TableCell>
                    <TableCell>Clicked At</TableCell>
                    <TableCell>IP Address</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoadingEmailLogs ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : emailTracking.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography variant="body2" color="text.secondary">
                          No CART link clicks yet
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    emailTracking.map((track) => (
                      <TableRow key={track.id}>
                        <TableCell>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {track.customerEmail || `Customer #${track.customerId}`}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={track.emailType || 'CART_ABANDONMENT'} 
                            size="small" 
                            color="primary" 
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label="CART" 
                            size="small" 
                            color="success" 
                            icon={<VisibilityIcon />}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDateTime(track.clickedAt)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {track.ipAddress || '--'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </>
            )}
          </Table>
        </TableContainer>
      </Paper>

      {/* Dialog tạo/sửa lịch */}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingSchedule ? 'Edit Schedule' : 'Create New Schedule'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} lg={8}>
                <Stack spacing={3}>
                  <Box>
                    <TextField
                      fullWidth
                      label="Schedule Name"
                      value={formData.scheduleName}
                      onChange={(e) => handleScheduleNameChange(e.target.value)}
                      required
                      error={Boolean(errors.scheduleName)}
                      helperText={
                        errors.scheduleName ||
                        (nameStatus === 'checking' ? 'Checking name availability…' : '')
                      }
                      placeholder="e.g. Morning Daily + Evening Remind"
                    />
                  </Box>
                  <Box>
                    <TextField
                      fullWidth
                      label="Description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      multiline
                      rows={3}
                      placeholder="Optional description for this schedule"
                    />
                  </Box>

                  <Divider textAlign="left">
                    <Typography variant="subtitle2">Time Configuration</Typography>
                  </Divider>

                  <Stack spacing={3}>
                    {/* Daily Schedule Section */}
                    <Box sx={{ 
                      border: '1px solid', 
                      borderColor: 'divider', 
                      borderRadius: 2, 
                      p: 3,
                      bgcolor: formData.isDailyEnabled ? 'action.hover' : 'background.paper',
                      transition: 'all 0.2s ease-in-out'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {/* Left half - Switch and Label */}
                        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={formData.isDailyEnabled}
                                onChange={(e) => {
                                  const next = e.target.checked
                                  setFormData(prev => ({
                                    ...prev,
                                    isDailyEnabled: next,
                                    dailyTime: next ? (isMorningTime(prev.dailyTime) ? prev.dailyTime : new Date(2024, 0, 1, 9, 0)) : prev.dailyTime
                                  }))
                                }}
                                color="primary"
                                size="medium"
                              />
                            }
                            label={
                              <Tooltip title="Send once per day at specific time">
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, ml: 1 }}>
                                  Enable Daily Schedule
                                </Typography>
                              </Tooltip>
                            }
                          />
                        </Box>
                        
                        {/* Right half - Time Input */}
                        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                          <TimeField
                            label="Daily Time"
                            value={formData.dailyTime}
                            onChange={(newTime) => setFormData(prev => ({ ...prev, dailyTime: newTime }))}
                            disabled={!formData.isDailyEnabled}
                            format="HH:mm"
                            slotProps={{
                              textField: {
                                error: Boolean(errors.dailyTime),
                                helperText: errors.dailyTime || 'Morning time recommended (05:00 - 11:59)',
                                placeholder: "HH:MM",
                                sx: {
                                  width: 200,
                                  '& .MuiOutlinedInput-root': {
                                    bgcolor: formData.isDailyEnabled ? 'background.paper' : 'action.disabled'
                                  }
                                }
                              }
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>

                    {/* Evening Schedule Section */}
                    <Box sx={{ 
                      border: '1px solid', 
                      borderColor: 'divider', 
                      borderRadius: 2, 
                      p: 3,
                      bgcolor: formData.isEveningEnabled ? 'action.hover' : 'background.paper',
                      transition: 'all 0.2s ease-in-out'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {/* Left half - Switch and Label */}
                        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={formData.isEveningEnabled}
                                onChange={(e) => {
                                  const next = e.target.checked
                                  setFormData(prev => ({
                                    ...prev,
                                    isEveningEnabled: next,
                                    eveningTime: next ? (isEveningTime(prev.eveningTime) ? prev.eveningTime : new Date(2024, 0, 1, 18, 0)) : prev.eveningTime
                                  }))
                                }}
                                color="primary"
                                size="medium"
                              />
                            }
                            label={
                              <Tooltip title="Send another reminder in the evening">
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, ml: 1 }}>
                                  Enable Evening Schedule
                                </Typography>
                              </Tooltip>
                            }
                          />
                        </Box>
                        
                        {/* Right half - Time Input */}
                        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                          <TimeField
                            label="Evening Time"
                            value={formData.eveningTime}
                            onChange={(newTime) => setFormData(prev => ({ ...prev, eveningTime: newTime }))}
                            disabled={!formData.isEveningEnabled}
                            format="HH:mm"
                            slotProps={{
                              textField: {
                                error: Boolean(errors.eveningTime),
                                helperText: errors.eveningTime || 'Evening time recommended (13:00 - 22:00)',
                                placeholder: "HH:MM",
                                sx: {
                                  width: 200,
                                  '& .MuiOutlinedInput-root': {
                                    bgcolor: formData.isEveningEnabled ? 'background.paper' : 'action.disabled'
                                  }
                                }
                              }
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Stack>
                </Stack>
              </Grid>

              <Grid item xs={12} lg={4}>
                <Card variant="outlined" sx={{ height: 'fit-content', position: 'sticky', top: 20 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: 'primary.main' }}>
                      Schedule Summary
                    </Typography>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Schedule Name
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {formData.scheduleName || '—'}
                        </Typography>
                      </Box>
                      
                      <Divider />
                      
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Daily Schedule
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: formData.isDailyEnabled ? 'success.main' : 'text.disabled' }}>
                          {formData.isDailyEnabled ? formatTimeForDisplay(formData.dailyTime) : 'Disabled'}
                        </Typography>
                      </Box>
                      
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Evening Schedule
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: formData.isEveningEnabled ? 'success.main' : 'text.disabled' }}>
                          {formData.isEveningEnabled ? formatTimeForDisplay(formData.eveningTime) : 'Disabled'}
                        </Typography>
                      </Box>
                      
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Interval Schedule
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: formData.isIntervalEnabled ? 'success.main' : 'text.disabled' }}>
                          {formData.isIntervalEnabled ? `${formData.intervalHours}h` : 'Disabled'}
                        </Typography>
                      </Box>

                      {formData.description && (
                        <>
                          <Divider />
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                              Description
                            </Typography>
                            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                              {formData.description}
                            </Typography>
                          </Box>
                        </>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleSaveSchedule} 
              variant="contained" 
              startIcon={<ScheduleIcon />}
              disabled={nameStatus === 'checking'}
            >
              {editingSchedule ? 'Update Schedule' : 'Create Schedule'}
            </Button>
          </DialogActions>
        </Dialog>
      </LocalizationProvider>

      {/* Dialog xác nhận xóa */}
      <Dialog open={deleteDialogOpen} onClose={cancelDeleteSchedule} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Schedule</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Are you sure you want to delete this schedule?
          </Typography>
          {scheduleToDelete && (
            <Typography variant="body2" color="text.secondary">
              {scheduleToDelete.scheduleName}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDeleteSchedule} disabled={isDeleting}>Cancel</Button>
          <Button onClick={confirmDeleteSchedule} color="error" variant="contained" disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default CartAbandonmentScheduler