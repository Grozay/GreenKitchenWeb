import React, { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Divider
} from '@mui/material'
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
      onShowSnackbar('Lỗi tải danh sách lịch', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const loadStatistics = async () => {
    try {
      const data = await getCartAbandonmentScheduleStatisticsAPI()
      setStatistics(data)
    } catch (error) {
      console.error('Lỗi tải thống kê:', error)
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
      onShowSnackbar('Vui lòng nhập tên lịch', 'warning')
      return
    }

    try {
      if (editingSchedule) {
        await updateCartAbandonmentScheduleAPI(editingSchedule.id, formData)
        onShowSnackbar('Đã cập nhật lịch thành công', 'success')
      } else {
        await createCartAbandonmentScheduleAPI(formData)
        onShowSnackbar('Đã tạo lịch mới thành công', 'success')
      }
      
      setOpenDialog(false)
      loadSchedules()
      loadStatistics()
      
    } catch (error) {
      onShowSnackbar('Lỗi lưu lịch: ' + error.message, 'error')
    }
  }

  const handleDeleteSchedule = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa lịch này?')) {
      try {
        await deleteCartAbandonmentScheduleAPI(id)
        onShowSnackbar('Đã xóa lịch thành công', 'success')
        loadSchedules()
        loadStatistics()
      } catch (error) {
        onShowSnackbar('Lỗi xóa lịch: ' + error.message, 'error')
      }
    }
  }

  const handleToggleSchedule = async (id) => {
    try {
      await toggleCartAbandonmentScheduleAPI(id)
      onShowSnackbar('Đã cập nhật trạng thái lịch', 'success')
      loadSchedules()
      loadStatistics()
    } catch (error) {
      onShowSnackbar('Lỗi cập nhật trạng thái: ' + error.message, 'error')
    }
  }

  const getStatusColor = (isActive) => {
    return isActive ? 'success' : 'default'
  }

  const getStatusText = (isActive) => {
    return isActive ? 'Hoạt động' : 'Tạm dừng'
  }

  return (
    <Box>
      {/* Header với thống kê */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="primary">
                {statistics.totalSchedules || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng số lịch
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="success.main">
                {statistics.activeSchedules || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lịch đang hoạt động
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="info.main">
                {statistics.dailyEnabledSchedules || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lịch hàng ngày
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="warning.main">
                {statistics.eveningEnabledSchedules || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lịch buổi tối
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Actions */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Quản lý Lịch Cart Abandonment</Typography>
          <Box>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={loadSchedules}
              sx={{ mr: 1 }}
            >
              Làm mới
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateSchedule}
            >
              Tạo lịch mới
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
                <TableCell>Tên lịch</TableCell>
                <TableCell>Thời gian hàng ngày</TableCell>
                <TableCell>Thời gian buổi tối</TableCell>
                <TableCell>Khoảng cách</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell>Hành động</TableCell>
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
                      Chưa có lịch nào
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
                          Tắt
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
                          Tắt
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {schedule.isIntervalEnabled ? (
                        <Chip label={`${schedule.intervalHours}h`} size="small" color="info" />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Tắt
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
                        {schedule.description || 'Không có mô tả'}
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
          {editingSchedule ? 'Sửa lịch' : 'Tạo lịch mới'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tên lịch"
                value={formData.scheduleName}
                onChange={(e) => setFormData({ ...formData, scheduleName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mô tả"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                multiline
                rows={2}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>
                <Typography variant="subtitle2">Cấu hình thời gian</Typography>
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
                label="Bật lịch hàng ngày"
              />
            </Grid>
            {formData.isDailyEnabled && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Thời gian hàng ngày"
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
                label="Bật lịch buổi tối"
              />
            </Grid>
            {formData.isEveningEnabled && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Thời gian buổi tối"
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
                label="Bật lịch theo khoảng cách"
              />
            </Grid>
            {formData.isIntervalEnabled && (
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Khoảng cách (giờ)</InputLabel>
                  <Select
                    value={formData.intervalHours}
                    onChange={(e) => setFormData({ ...formData, intervalHours: e.target.value })}
                  >
                    <MenuItem value={1}>1 giờ</MenuItem>
                    <MenuItem value={2}>2 giờ</MenuItem>
                    <MenuItem value={3}>3 giờ</MenuItem>
                    <MenuItem value={6}>6 giờ</MenuItem>
                    <MenuItem value={12}>12 giờ</MenuItem>
                    <MenuItem value={24}>24 giờ</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button 
            onClick={handleSaveSchedule} 
            variant="contained" 
            startIcon={<ScheduleIcon />}
          >
            {editingSchedule ? 'Cập nhật lịch' : 'Tạo lịch'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default CartAbandonmentScheduler
