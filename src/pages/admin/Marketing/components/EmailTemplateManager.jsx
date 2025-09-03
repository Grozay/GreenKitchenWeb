import React, { useState, useEffect } from 'react'
import { 
  createEmailTemplateAPI,
  updateEmailTemplateAPI,
  getAllEmailTemplatesAPI,
  deleteEmailTemplateAPI,
  toggleEmailTemplateAPI,
  checkEmailTemplateNameAPI,
  getEmailTemplateStatisticsAPI
} from '~/apis'
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
  const [editingTemplate, setEditingTemplate] = useState(null)
  const [previewMode, setPreviewMode] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    content: '',
    category: 'general',
    variables: []
  })

  // Templates sẽ được load từ API thực tế
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: 'Cart Abandonment Recovery',
      subject: '🛒 Bạn quên gì đó trong giỏ hàng - Green Kitchen',
      content: `
        <h2>Xin chào {{customerName}}!</h2>
        <p>Chúng tôi nhận thấy bạn đã thêm một số sản phẩm vào giỏ hàng nhưng chưa hoàn tất đơn hàng.</p>
        
        <h3>Giỏ hàng của bạn:</h3>
        {{#each cartItems}}
        <div style="border: 1px solid #ddd; padding: 10px; margin: 10px 0;">
          <h4>{{title}}</h4>
          <p>Số lượng: {{quantity}}</p>
          <p>Giá: {{totalPrice}}</p>
        </div>
        {{/each}}
        
        <p><strong>Tổng tiền: {{totalAmount}}</strong></p>
        
        <a href="{{frontendUrl}}/cart" style="background: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Hoàn tất đơn hàng
        </a>
        
        <p>Nếu bạn có bất kỳ câu hỏi nào, hãy liên hệ với chúng tôi.</p>
        <p>Trân trọng,<br>Đội ngũ Green Kitchen</p>
      `,
      category: 'cart_abandonment',
      variables: ['customerName', 'cartItems', 'totalAmount', 'frontendUrl'],
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'Welcome Series',
      subject: 'Chào mừng bạn đến với Green Kitchen! 🌱',
      content: `
        <h2>Chào mừng {{customerName}}!</h2>
        <p>Cảm ơn bạn đã đăng ký tài khoản tại Green Kitchen. Chúng tôi rất vui được phục vụ bạn!</p>
        
        <h3>Những gì bạn có thể làm:</h3>
        <ul>
          <li>Khám phá thực đơn healthy của chúng tôi</li>
          <li>Đặt hàng online dễ dàng</li>
          <li>Theo dõi lịch sử đơn hàng</li>
          <li>Nhận thông báo về ưu đãi đặc biệt</li>
        </ul>
        
        <a href="{{frontendUrl}}/menu" style="background: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Khám phá thực đơn
        </a>
        
        <p>Chúc bạn có trải nghiệm tuyệt vời!</p>
        <p>Trân trọng,<br>Đội ngũ Green Kitchen</p>
      `,
      category: 'welcome',
      variables: ['customerName', 'frontendUrl'],
      createdAt: '2024-01-10',
      updatedAt: '2024-01-10'
    },
    {
      id: 3,
      name: 'Promotional Offer',
      subject: '🎉 Ưu đãi đặc biệt chỉ dành cho bạn!',
      content: `
        <h2>Xin chào {{customerName}}!</h2>
        <p>Chúng tôi có một ưu đãi đặc biệt dành riêng cho bạn!</p>
        
        <div style="background: #f0f8ff; padding: 20px; border-radius: 10px; text-align: center;">
          <h3 style="color: #ff6b6b;">Giảm {{discountPercent}}% cho đơn hàng tiếp theo!</h3>
          <p>Mã giảm giá: <strong>{{couponCode}}</strong></p>
          <p>Hạn sử dụng: {{expiryDate}}</p>
        </div>
        
        <a href="{{frontendUrl}}/menu" style="background: #ff6b6b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 16px;">
          Sử dụng ưu đãi ngay
        </a>
        
        <p>Đừng bỏ lỡ cơ hội này!</p>
        <p>Trân trọng,<br>Đội ngũ Green Kitchen</p>
      `,
      category: 'promotional',
      variables: ['customerName', 'discountPercent', 'couponCode', 'expiryDate', 'frontendUrl'],
      createdAt: '2024-01-12',
      updatedAt: '2024-01-12'
    }
  ])

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      setIsLoading(true)
      const data = await getAllEmailTemplatesAPI()
      setTemplates(data)
    } catch (error) {
      onShowSnackbar('Lỗi tải danh sách template', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateTemplate = () => {
    setEditingTemplate(null)
    setSelectedTemplate(null)
    setFormData({
      name: '',
      subject: '',
      content: '',
      category: 'general',
      variables: []
    })
    setOpenDialog(true)
  }

  const handleEditTemplate = (template) => {
    setEditingTemplate(template)
    setFormData({
      name: template.name,
      subject: template.subject,
      content: template.content,
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
      content: template.content,
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
      content: '',
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
    
    if (!selectedTemplate && (!formData.subject || !formData.content)) {
      onShowSnackbar('Vui lòng điền đầy đủ subject và content', 'warning')
      return
    }

    try {
      const response = editingTemplate 
        ? await updateEmailTemplateAPI(editingTemplate.id, formData)
        : await createEmailTemplateAPI(formData)
      
      onShowSnackbar(
        editingTemplate ? 'Đã cập nhật template thành công' : 'Đã tạo template mới thành công', 
        'success'
      )

      setOpenDialog(false)
      loadTemplates()
    } catch (error) {
      onShowSnackbar('Lỗi lưu template: ' + (error.response?.data?.error || error.message), 'error')
    }
  }

  const handleDeleteTemplate = async (templateId) => {
    if (window.confirm('Bạn có chắc muốn xóa template này?')) {
      try {
        await deleteEmailTemplateAPI(templateId)
        onShowSnackbar('Đã xóa template thành công', 'success')
        loadTemplates()
      } catch (error) {
        onShowSnackbar('Lỗi xóa template: ' + (error.response?.data?.error || error.message), 'error')
      }
    }
  }

  const handleCopyTemplate = (template) => {
    setFormData({
      name: `${template.name} (Copy)`,
      subject: template.subject,
      content: template.content,
      category: template.category,
      variables: template.variables || []
    })
    setEditingTemplate(null)
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
      <Paper sx={{ p: 2, mb: 3 }}>
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
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                Chưa có template nào
              </Typography>
            </Paper>
          </Grid>
        ) : (
          templates.map((template) => (
            <Grid item xs={12} md={6} lg={4} key={template.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
                    variant={selectedTemplate?.id === template.id ? "outlined" : "contained"}
                    color={selectedTemplate?.id === template.id ? "success" : "primary"}
                    onClick={() => handleSelectTemplate(template)}
                    sx={{ mr: 1 }}
                  >
                    {selectedTemplate?.id === template.id ? "Đã chọn" : "Chọn"}
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
        <DialogTitle>
          {editingTemplate ? 'Sửa template' : 'Tạo template mới'}
        </DialogTitle>
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
                    Đã chọn template: {selectedTemplate.name}
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
              </Grid>
            )}

            {/* Chỉ hiển thị textField khi KHÔNG chọn template */}
            {!selectedTemplate && (
              <>
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
                    label="Nội dung email (HTML)"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    multiline
                    rows={12}
                    required
                    helperText="Sử dụng {{variableName}} để chèn biến động"
                  />
                </Grid>
              </>
            )}
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
                  border: '1px solid #ddd', 
                  padding: 2, 
                  borderRadius: 1,
                  backgroundColor: '#f9f9f9'
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
