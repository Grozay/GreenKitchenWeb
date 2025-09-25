
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
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
  Refresh as RefreshIcon,
  PowerSettingsNew as PowerIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material'
import { 
  createCartAbandonmentScheduleAPI,
  updateCartAbandonmentScheduleAPI,
  getAllCartAbandonmentSchedulesAPI,
  deleteCartAbandonmentScheduleAPI,
  toggleCartAbandonmentScheduleAPI,
  checkCartAbandonmentScheduleNameAPI,
  getCartAbandonmentScheduleStatisticsAPI
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

  // Form state
  const [formData, setFormData] = useState({
    scheduleName: '',
    dailyTime: '09:00',
    intervalHours: 6,
    isDailyEnabled: true,
    isIntervalEnabled: false,
    isEveningEnabled: false,
    eveningTime: '18:00',
    description: ''
  })

  useEffect(() => {
    loadSchedules()
    loadStatistics()
  }, [])

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
      console.error('Error loading statistics:', error)
    }
  }

  const handleCreateSchedule = () => {
    setEditingSchedule(null)
    setFormData({
      scheduleName: '',
      dailyTime: '09:00',
      intervalHours: 6,
      isDailyEnabled: true,
      isIntervalEnabled: false,
      isEveningEnabled: false,
      eveningTime: '18:00',
      description: ''
    })
    setOpenDialog(true)
  }

  const handleEditSchedule = (schedule) => {
    setEditingSchedule(schedule)
    setFormData({
      scheduleName: schedule.scheduleName,
      dailyTime: schedule.dailyTime || '09:00',
      intervalHours: schedule.intervalHours || 6,
      isDailyEnabled: schedule.isDailyEnabled,
      isIntervalEnabled: schedule.isIntervalEnabled,
      isEveningEnabled: schedule.isEveningEnabled,
      eveningTime: schedule.eveningTime || '18:00',
      description: schedule.description || ''
    })
    setOpenDialog(true)
  }

  const handleSaveSchedule = async () => {
    if (!validateForm()) return

    try {
      if (editingSchedule) {
        await updateCartAbandonmentScheduleAPI(editingSchedule.id, formData)
        onShowSnackbar('Schedule updated successfully', 'success')
      } else {
        await createCartAbandonmentScheduleAPI(formData)
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
    const [h] = time.split(':').map(Number)
    return h >= 5 && h < 12
  }

  const isEveningTime = (time) => {
    if (!time) return false
    const [h] = time.split(':').map(Number)
    return h >= 17 && h <= 22
  }

  // Generate time options by 15 minutes between startHour and endHour inclusive
  const generateTimeOptions = (startHour, endHour) => {
    const options = []
    for (let h = startHour; h <= endHour; h++) {
      for (let m = 0; m < 60; m += 15) {
        if (h === endHour && m > 45) break
        const hh = String(h).padStart(2, '0')
        const mm = String(m).padStart(2, '0')
        options.push(`${hh}:${mm}`)
      }
    }
    return options
  }

  const morningOptions = generateTimeOptions(5, 11)
  const eveningOptions = generateTimeOptions(17, 22)

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
                {statistics.dailyEnabledSchedules || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Daily Schedules
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'background.paper' }}>
            <CardContent>
              <Typography variant="h4" color="warning.main">
                {statistics.eveningEnabledSchedules || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Evening Schedules
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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

      {/* Danh sách lịch */}
      <Paper>
        <TableContainer>
          <Table>
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
          </Table>
        </TableContainer>
      </Paper>

      {/* Dialog tạo/sửa lịch */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingSchedule ? 'Edit Schedule' : 'Create New Schedule'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={7}>
              <Stack spacing={2}>
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
                    rows={2}
                    placeholder="Optional description for this schedule"
                  />
                </Box>

                <Divider textAlign="left">
                  <Typography variant="subtitle2">Time Configuration</Typography>
                </Divider>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.isDailyEnabled}
                          onChange={(e) => {
                            const next = e.target.checked
                            setFormData(prev => ({
                              ...prev,
                              isDailyEnabled: next,
                              dailyTime: next ? (isMorningTime(prev.dailyTime) ? prev.dailyTime : '09:00') : prev.dailyTime
                            }))
                          }}
                        />
                      }
                      label={
                        <Tooltip title="Send once per day at specific time">
                          <Typography>Enable Daily Schedule</Typography>
                        </Tooltip>
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth disabled={!formData.isDailyEnabled}>
                      <InputLabel>Daily Time</InputLabel>
                      <Select
                        label="Daily Time"
                        value={isMorningTime(formData.dailyTime) ? formData.dailyTime : ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, dailyTime: e.target.value }))}
                        error={Boolean(errors.dailyTime)}
                      >
                        {morningOptions.map(t => (
                          <MenuItem key={t} value={t}>{t}</MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>{errors.dailyTime || 'Morning only (05:00 - 11:45)'}</FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.isEveningEnabled}
                          onChange={(e) => {
                            const next = e.target.checked
                            setFormData(prev => ({
                              ...prev,
                              isEveningEnabled: next,
                              eveningTime: next ? (isEveningTime(prev.eveningTime) ? prev.eveningTime : '18:00') : prev.eveningTime
                            }))
                          }}
                        />
                      }
                      label={
                        <Tooltip title="Send another reminder in the evening">
                          <Typography>Enable Evening Schedule</Typography>
                        </Tooltip>
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth disabled={!formData.isEveningEnabled}>
                      <InputLabel>Evening Time</InputLabel>
                      <Select
                        label="Evening Time"
                        value={isEveningTime(formData.eveningTime) ? formData.eveningTime : ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, eveningTime: e.target.value }))}
                        error={Boolean(errors.eveningTime)}
                      >
                        {eveningOptions.map(t => (
                          <MenuItem key={t} value={t}>{t}</MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>{errors.eveningTime || 'Evening only (17:00 - 22:00)'}</FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
              </Stack>
            </Grid>

            <Grid item xs={12} md={5}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Summary</Typography>
                  <Stack spacing={1}>
                    <Typography variant="body2" color="text.secondary">
                      Name: <strong>{formData.scheduleName || '—'}</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Daily: {formData.isDailyEnabled ? formData.dailyTime : 'Off'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Evening: {formData.isEveningEnabled ? formData.eveningTime : 'Off'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Interval: {formData.isIntervalEnabled ? `${formData.intervalHours}h` : 'Off'}
                    </Typography>
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