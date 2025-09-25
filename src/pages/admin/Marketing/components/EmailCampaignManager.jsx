
import React, { useState, useEffect, useMemo } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Chip from '@mui/material/Chip'
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
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
import CardHeader from '@mui/material/CardHeader'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'

import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SendIcon from '@mui/icons-material/Send'
import ScheduleIcon from '@mui/icons-material/Schedule'
import ViewIcon from '@mui/icons-material/Visibility'
import RefreshIcon from '@mui/icons-material/Refresh'
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
  const [filterText, setFilterText] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

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
      const list = data.content || []
      // Sort newest first by createdAt (fallback to sentAt/scheduledAt)
      list.sort((a, b) => {
        const getTs = (x) => new Date(x?.createdAt || x?.sentAt || x?.scheduledAt || 0).getTime()
        return getTs(b) - getTs(a)
      })
      setCampaigns(list)
      setTotalPages(data.totalPages || 0)
    } catch (error) {
      onShowSnackbar('Error loading campaigns list', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const data = await getEmailStatisticsAPI()
      setStats(data)
    } catch (error) {
      console.error('Error loading statistics:', error)
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
      onShowSnackbar('Please fill in all required information', 'warning')
      return
    }

    try {
      setIsCreating(true)
      
      if (formData.isScheduled) {
        if (!formData.scheduledAt) {
          onShowSnackbar('Please select schedule time', 'warning')
          return
        }
        
        const scheduleAtISO = new Date(formData.scheduledAt).toISOString()
        await broadcastEmailScheduleAPI({
          subject: formData.subject,
          content: formData.content,
          scheduleAt: scheduleAtISO
        })
        onShowSnackbar('Email campaign scheduled', 'success')
      } else {
        if (formData.sendAllCustomers) {
          await broadcastEmailNowAPI({
            subject: formData.subject,
            content: formData.content
          })
          onShowSnackbar('Email campaign sent', 'success')
        } else if (formData.previewEmail) {
          await broadcastPreviewAPI(formData.previewEmail, {
            subject: formData.subject,
            content: formData.content
          })
          onShowSnackbar('Email preview sent', 'success')
        } else {
          onShowSnackbar('Please enter preview email or enable send to all customers', 'warning')
          return
        }
      }
      
      setOpenDialog(false)
      loadCampaigns()
      loadStats()
      
    } catch (error) {
      onShowSnackbar('Error saving campaign: ' + error.message, 'error')
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
      case 'sent': return 'Sent'
      case 'scheduled': return 'Scheduled'
      case 'failed': return 'Failed'
      default: return status
    }
  }

  const filteredCampaigns = useMemo(() => {
    return campaigns
      .filter(c => (filterType ? c.emailType === filterType : true))
      .filter(c => (filterStatus ? c.status === filterStatus : true))
      .filter(c => (filterText ? (c.subject?.toLowerCase().includes(filterText.toLowerCase()) || c.content?.toLowerCase().includes(filterText.toLowerCase())) : true))
  }, [campaigns, filterText, filterType, filterStatus])

  return (
    <Box>
      {/* Header với thống kê */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'background.paper' }}>
            <CardContent>
              <Typography variant="h4" color="primary">
                {stats.totalEmails || 0}
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
              <Typography variant="h4" color="success.main">
                {stats.emailTypeCounts?.broadcast || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Broadcast Emails
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'background.paper' }}>
            <CardContent>
              <Typography variant="h4" color="info.main">
                {stats.emailTypeCounts?.preview || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Preview Emails
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'background.paper' }}>
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
          <Typography variant="h6">Email Campaign Management</Typography>
          <Box>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={loadCampaigns}
              sx={{ mr: 1 }}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateCampaign}
            >
              Create Campaign
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Danh sách chiến dịch */}
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
                <TableCell>Actions</TableCell>
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
                      No campaigns yet
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCampaigns.map((campaign) => (
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
          {editingCampaign ? 'Edit Campaign' : 'Create New Campaign'}
        </DialogTitle>
        <DialogContent>
          {(() => {
            const subjectLen = (formData.subject || '').length
            const contentLen = (formData.content || '').length
            const maxSubject = 150
            const maxContent = 10000
            const nowIso = new Date().toISOString().slice(0, 16)
            return (
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={7}>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      label="Email Subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      inputProps={{ maxLength: maxSubject }}
                      helperText={`${subjectLen}/${maxSubject}`}
                    />

                    <TextField
                      fullWidth
                      label="Email Content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      multiline
                      rows={8}
                      required
                      inputProps={{ maxLength: maxContent }}
                      helperText={`${contentLen.toLocaleString()} chars`}
                    />

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel>Email Type</InputLabel>
                          <Select
                            value={formData.emailType}
                            onChange={(e) => setFormData({ ...formData, emailType: e.target.value })}
                            label="Email Type"
                          >
                            <MenuItem value="broadcast">Broadcast</MenuItem>
                            <MenuItem value="preview">Preview</MenuItem>
                          </Select>
                          <FormHelperText>
                            Broadcast: send to all; Preview: send to a test email
                          </FormHelperText>
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
                          label="Schedule Send"
                        />
                        {formData.isScheduled && (
                          <TextField
                            fullWidth
                            sx={{ mt: 1 }}
                            label="Send Time"
                            type="datetime-local"
                            value={formData.scheduledAt}
                            onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ min: nowIso }}
                            helperText="Select a future time to schedule"
                          />
                        )}
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={formData.sendAllCustomers}
                              onChange={(e) => setFormData({ ...formData, sendAllCustomers: e.target.checked })}
                            />
                          }
                          label="Send to All Customers"
                        />
                      </Grid>
                      {!formData.sendAllCustomers && (
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Preview Email"
                            value={formData.previewEmail}
                            onChange={(e) => setFormData({ ...formData, previewEmail: e.target.value })}
                            placeholder="Enter email for testing"
                          />
                        </Grid>
                      )}
                    </Grid>
                  </Stack>
                </Grid>

                <Grid item xs={12} md={5}>
                  <Card variant="outlined">
                    <CardHeader title="Live Preview" subheader="Rendered as plain text" />
                    <CardContent sx={{ pt: 0 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Subject
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
                        {formData.subject || '—'}
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Content
                      </Typography>
                      <Box sx={{ p: 1.5, bgcolor: 'background.paper', border: '1px dashed', borderColor: 'divider', borderRadius: 1, maxHeight: 260, overflow: 'auto' }}>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                          {formData.content || '—'}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )
          })()}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleSaveCampaign} 
            variant="contained" 
            disabled={isCreating}
            startIcon={isCreating ? <CircularProgress size={20} /> : <SendIcon />}
          >
            {isCreating ? 'Saving...' : 'Save Campaign'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default EmailCampaignManager