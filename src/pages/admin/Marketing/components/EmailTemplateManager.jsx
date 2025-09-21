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
  Chip,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Preview as PreviewIcon,
  ContentCopy as CopyIcon,
  Save as SaveIcon
} from '@mui/icons-material'

const EmailTemplateManager = ({ onShowSnackbar }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    category: 'general',
    variables: []
  })

  // Templates sẽ được load từ API thực tế
  // TODO: Implement API call to load templates from backend
  // const fetchTemplates = async () => {
  //   try {
  //     const response = await fetch('/api/email-templates')
  //     const data = await response.json()
  //     setTemplates(data)
  //   } catch (error) {
  //     console.error('Error loading templates:', error)
  //     onShowSnackbar('Lỗi tải danh sách template', 'error')
  //   }
  // }
  // useEffect(() => { fetchTemplates() }, [])

  const [templates, setTemplates] = useState([])

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      setIsLoading(true)
      // TODO: Gọi API load templates thực tế
      // const response = await getEmailTemplatesAPI()
      // setTemplates(response.data)
      setIsLoading(false)
    } catch (error) {
      onShowSnackbar('Lỗi tải danh sách template', 'error')
      setIsLoading(false)
    }
  }

  const handleCreateTemplate = () => {
    setSelectedTemplate(null)
    setFormData({
      name: '',
      subject: '',
      category: 'general',
      variables: []
    })
    setOpenDialog(true)
  }

  const handleEditTemplate = (template) => {
    setFormData({
      name: template.name,
      subject: template.subject,
      category: template.category,
      variables: template.variables || []
    })
    setOpenDialog(true)
  }

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template)
    setFormData({
      ...formData,
      subject: template.subject,
      category: template.category,
      variables: template.variables || []
    })
    onShowSnackbar(`Đã chọn template: ${template.name}`, 'success')
  }

  const handleUnselectTemplate = () => {
    setSelectedTemplate(null)
    setFormData({
      ...formData,
      subject: '',
      category: 'general',
      variables: []
    })
    onShowSnackbar('Đã bỏ chọn template', 'info')
  }

  const handleSaveTemplate = async () => {
    if (!formData.name) {
      onShowSnackbar('Vui lòng nhập tên template', 'warning')
      return
    }
    // FE không chỉnh HTML, chỉ quản lý meta; preview/render sẽ gọi BE Thymeleaf
    onShowSnackbar('Lưu meta template (BE sẽ render Thymeleaf)', 'success')
    setOpenDialog(false)
  }

  const handleDeleteTemplate = (templateId) => {
    if (window.confirm('Bạn có chắc muốn xóa template này?')) {
      setTemplates(templates.filter(t => t.id !== templateId))
      onShowSnackbar('Đã xóa template', 'success')
    }
  }

  const handleCopyTemplate = (template) => {
    setFormData({
      name: `${template.name} (Copy)`,
      subject: template.subject,
      category: template.category,
      variables: template.variables || []
    })
    setOpenDialog(true)
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'cart_abandonment': return 'error'
      case 'welcome': return 'success'
      case 'promotional': return 'warning'
      case 'newsletter': return 'info'
      default: return 'default'
    }
  }

  const getCategoryText = (category) => {
    switch (category) {
      case 'cart_abandonment': return 'Cart Abandonment'
      case 'welcome': return 'Welcome'
      case 'promotional': return 'Promotional'
      case 'newsletter': return 'Newsletter'
      default: return 'General'
    }
  }

  return (
    <Box>
      {/* Header */}
      <Paper sx={{ p: 2, mb: 3, bgcolor: 'background.paper' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Quản lý Email Templates</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateTemplate}
          >
            Tạo template mới
          </Button>
        </Box>
      </Paper>

      {/* Danh sách templates */}
      <Grid container spacing={3}>
        {isLoading ? (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          </Grid>
        ) : templates.length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'background.paper' }}>
              <Typography variant="body1" color="text.secondary">
                Chưa có template nào
              </Typography>
            </Paper>
          </Grid>
        ) : (
          templates.map((template) => (
            <Grid item xs={12} md={6} lg={4} key={template.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {template.name}
                    </Typography>
                    <Chip 
                      label={getCategoryText(template.category)} 
                      color={getCategoryColor(template.category)}
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    {template.subject}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {template.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                  </Typography>
                  
                  {template.variables && template.variables.length > 0 && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Variables: {template.variables.join(', ')}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
                
                <Divider />
                
                <CardActions>
                  <Button 
                    size="small" 
                    variant="contained" 
                    color="primary"
                    onClick={() => handleSelectTemplate(template)}
                    sx={{ mr: 1 }}
                  >
                    Chọn
                  </Button>
                  <IconButton size="small" onClick={() => handleEditTemplate(template)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleCopyTemplate(template)}>
                    <CopyIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => setPreviewMode(template)}>
                    <PreviewIcon />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => handleDeleteTemplate(template.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Dialog tạo/sửa template */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Template</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tên template"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Danh mục</InputLabel>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <MenuItem value="general">General</MenuItem>
                  <MenuItem value="cart_abandonment">Cart Abandonment</MenuItem>
                  <MenuItem value="welcome">Welcome</MenuItem>
                  <MenuItem value="promotional">Promotional</MenuItem>
                  <MenuItem value="newsletter">Newsletter</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {/* Hiển thị thông tin template đã chọn */}
            {selectedTemplate && (
              <Grid item xs={12}>
                <Alert severity="success" sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    Template đã chọn: {selectedTemplate.name}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
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
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tiêu đề email"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button 
            onClick={handleSaveTemplate} 
            variant="contained" 
            startIcon={<SaveIcon />}
          >
            Lưu template
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog preview */}
      <Dialog open={!!previewMode} onClose={() => setPreviewMode(false)} maxWidth="md" fullWidth>
        <DialogTitle>Preview Template</DialogTitle>
        <DialogContent>
          {previewMode && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {previewMode.subject}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box
                dangerouslySetInnerHTML={{ __html: previewMode.content }}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  padding: 2,
                  borderRadius: 1,
                  bgcolor: 'background.paper'
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewMode(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default EmailTemplateManager
