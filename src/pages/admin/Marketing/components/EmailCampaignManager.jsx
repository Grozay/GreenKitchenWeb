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
  Chip,
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
  Pagination
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
  Schedule as ScheduleIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material'
import { 
  getEmailHistoryAPI, 
  broadcastEmailNowAPI, 
  broadcastEmailScheduleAPI, 
  broadcastPreviewAPI,
  getEmailStatisticsAPI 
} from '~/apis'

const EmailCampaignManager = ({ onShowSnackbar }) => {
  const [campaigns, setCampaigns] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState(null)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [stats, setStats] = useState({})

  // Form state
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
    emailType: 'broadcast',
    scheduledAt: '',
    isScheduled: false,
    sendAllCustomers: true,
    previewEmail: ''
  })

  useEffect(() => {
    loadCampaigns()
    loadStats()
  }, [page])

  const loadCampaigns = async () => {
    try {
      setIsLoading(true)
      const data = await getEmailHistoryAPI(page, 10)
      setCampaigns(data.content || [])
      setTotalPages(data.totalPages || 0)
    } catch (error) {
      onShowSnackbar('Lỗi tải danh sách chiến dịch', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const data = await getEmailStatisticsAPI()
      setStats(data)
    } catch (error) {
      console.error('Lỗi tải thống kê:', error)
    }
  }

  const handleCreateCampaign = () => {
    setEditingCampaign(null)
    setFormData({
      subject: '',
      content: '',
      emailType: 'broadcast',
      scheduledAt: '',
      isScheduled: false,
      sendAllCustomers: true,
      previewEmail: ''
    })
    setOpenDialog(true)
  }

  const handleEditCampaign = (campaign) => {
    setEditingCampaign(campaign)
    setFormData({
      subject: campaign.subject,
      content: campaign.content,
      emailType: campaign.emailType,
      scheduledAt: campaign.scheduledAt ? new Date(campaign.scheduledAt).toISOString().slice(0, 16) : '',
      isScheduled: campaign.status === 'scheduled',
      sendAllCustomers: campaign.emailType === 'broadcast',
      previewEmail: campaign.recipientEmail || ''
    })
    setOpenDialog(true)
  }

  const handleSaveCampaign = async () => {
    if (!formData.subject || !formData.content) {
      onShowSnackbar('Vui lòng điền đầy đủ thông tin', 'warning')
      return
    }

    try {
      setIsCreating(true)
      
      if (formData.isScheduled) {
        if (!formData.scheduledAt) {
          onShowSnackbar('Vui lòng chọn thời gian lên lịch', 'warning')
          return
        }
        
        const scheduleAtISO = new Date(formData.scheduledAt).toISOString()
        await broadcastEmailScheduleAPI({
          subject: formData.subject,
          content: formData.content,
          scheduleAt: scheduleAtISO
        })
        onShowSnackbar('Đã lên lịch chiến dịch email', 'success')
      } else {
        if (formData.sendAllCustomers) {
          await broadcastEmailNowAPI({
            subject: formData.subject,
            content: formData.content
          })
          onShowSnackbar('Đã gửi chiến dịch email', 'success')
        } else if (formData.previewEmail) {
          await broadcastPreviewAPI(formData.previewEmail, {
            subject: formData.subject,
            content: formData.content
          })
          onShowSnackbar('Đã gửi email preview', 'success')
        } else {
          onShowSnackbar('Vui lòng nhập email preview hoặc bật gửi toàn bộ khách hàng', 'warning')
          return
        }
      }
      
      setOpenDialog(false)
      loadCampaigns()
      loadStats()
      
    } catch (error) {
      onShowSnackbar('Lỗi lưu chiến dịch: ' + error.message, 'error')
    } finally {
      setIsCreating(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'sent': return 'success'
      case 'scheduled': return 'warning'
      case 'failed': return 'error'
      default: return 'default'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'sent': return 'Đã gửi'
      case 'scheduled': return 'Đã lên lịch'
      case 'failed': return 'Thất bại'
      default: return status
    }
  }

  return (
    <Box>
      {/* Header với thống kê */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="primary">
                {stats.totalEmails || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng email đã gửi
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="success.main">
                {stats.emailTypeCounts?.broadcast || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email broadcast
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="info.main">
                {stats.emailTypeCounts?.preview || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email preview
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="warning.main">
                {stats.emailTypeCounts?.cart_abandonment || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Cart abandonment
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Actions */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Quản lý Chiến dịch Email</Typography>
          <Box>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={loadCampaigns}
              sx={{ mr: 1 }}
            >
              Làm mới
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateCampaign}
            >
              Tạo chiến dịch
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Danh sách chiến dịch */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tiêu đề</TableCell>
                <TableCell>Loại</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Số lượng gửi</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : campaigns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="text.secondary">
                      Chưa có chiến dịch nào
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {campaign.subject}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={campaign.emailType} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={getStatusText(campaign.status)} 
                        color={getStatusColor(campaign.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{campaign.totalSent || 0}</TableCell>
                    <TableCell>
                      {new Date(campaign.createdAt).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleEditCampaign(campaign)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small">
                        <ViewIcon />
                      </IconButton>
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

      {/* Dialog tạo/sửa chiến dịch */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingCampaign ? 'Sửa chiến dịch' : 'Tạo chiến dịch mới'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tiêu đề email"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nội dung email"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                multiline
                rows={6}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Loại email</InputLabel>
                <Select
                  value={formData.emailType}
                  onChange={(e) => setFormData({ ...formData, emailType: e.target.value })}
                >
                  <MenuItem value="broadcast">Broadcast</MenuItem>
                  <MenuItem value="preview">Preview</MenuItem>
                  <MenuItem value="cart_abandonment">Cart Abandonment</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isScheduled}
                    onChange={(e) => setFormData({ ...formData, isScheduled: e.target.checked })}
                  />
                }
                label="Lên lịch gửi"
              />
            </Grid>
            {formData.isScheduled && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Thời gian gửi"
                  type="datetime-local"
                  value={formData.scheduledAt}
                  onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.sendAllCustomers}
                    onChange={(e) => setFormData({ ...formData, sendAllCustomers: e.target.checked })}
                  />
                }
                label="Gửi tất cả khách hàng"
              />
            </Grid>
            {!formData.sendAllCustomers && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email preview"
                  value={formData.previewEmail}
                  onChange={(e) => setFormData({ ...formData, previewEmail: e.target.value })}
                  placeholder="Nhập email để gửi thử"
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button 
            onClick={handleSaveCampaign} 
            variant="contained" 
            disabled={isCreating}
            startIcon={isCreating ? <CircularProgress size={20} /> : <SendIcon />}
          >
            {isCreating ? 'Đang lưu...' : 'Lưu chiến dịch'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default EmailCampaignManager
