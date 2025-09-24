
import React, { useState, useEffect } from 'react'
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
    if (!formData.scheduleName) {
      onShowSnackbar('Please enter schedule name', 'warning')
      return
    }

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

  const handleDeleteSchedule = async (id) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      try {
        await deleteCartAbandonmentScheduleAPI(id)
        onShowSnackbar('Schedule deleted successfully', 'success')
        loadSchedules()
        loadStatistics()
      } catch (error) {
        onShowSnackbar('Error deleting schedule: ' + error.message, 'error')
      }
    }
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
                        onClick={() => handleDeleteSchedule(schedule.id)}
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Schedule Name"
                value={formData.scheduleName}
                onChange={(e) => setFormData({ ...formData, scheduleName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                multiline
                rows={2}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>
                <Typography variant="subtitle2">Time Configuration</Typography>
              </Divider>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isDailyEnabled}
                    onChange={(e) => setFormData({ ...formData, isDailyEnabled: e.target.checked })}
                  />
                }
                label="Enable Daily Schedule"
              />
            </Grid>
            {formData.isDailyEnabled && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Daily Time"
                  type="time"
                  value={formData.dailyTime}
                  onChange={(e) => setFormData({ ...formData, dailyTime: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            )}
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isEveningEnabled}
                    onChange={(e) => setFormData({ ...formData, isEveningEnabled: e.target.checked })}
                  />
                }
                label="Enable Evening Schedule"
              />
            </Grid>
            {formData.isEveningEnabled && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Evening Time"
                  type="time"
                  value={formData.eveningTime}
                  onChange={(e) => setFormData({ ...formData, eveningTime: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            )}
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isIntervalEnabled}
                    onChange={(e) => setFormData({ ...formData, isIntervalEnabled: e.target.checked })}
                  />
                }
                label="Enable Interval Schedule"
              />
            </Grid>
            {formData.isIntervalEnabled && (
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Interval (hours)</InputLabel>
                  <Select
                    value={formData.intervalHours}
                    onChange={(e) => setFormData({ ...formData, intervalHours: e.target.value })}
                  >
                    <MenuItem value={1}>1 hour</MenuItem>
                    <MenuItem value={2}>2 hours</MenuItem>
                    <MenuItem value={3}>3 hours</MenuItem>
                    <MenuItem value={6}>6 hours</MenuItem>
                    <MenuItem value={12}>12 hours</MenuItem>
                    <MenuItem value={24}>24 hours</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleSaveSchedule} 
            variant="contained" 
            startIcon={<ScheduleIcon />}
          >
            {editingSchedule ? 'Update Schedule' : 'Create Schedule'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default CartAbandonmentScheduler