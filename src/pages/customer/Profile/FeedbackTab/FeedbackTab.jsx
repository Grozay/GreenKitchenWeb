import { useState } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Rating from '@mui/material/Rating'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import SupportIcon from '@mui/icons-material/Support'
import FeedbackIcon from '@mui/icons-material/Feedback'
import ChatIcon from '@mui/icons-material/Chat'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { toast } from 'react-toastify'
import { submitFeedbackAPI, submitSupportTicketAPI } from '~/apis'

export default function FeedbackTab({ customerDetails, setCustomerDetails }) {
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false)
  const [supportDialogOpen, setSupportDialogOpen] = useState(false)
  const [feedbackForm, setFeedbackForm] = useState({
    type: 'GENERAL',
    rating: 5,
    title: '',
    description: '',
    contactEmail: ''
  })
  const [supportForm, setSupportForm] = useState({
    issueType: 'TECHNICAL',
    priority: 'MEDIUM',
    subject: '',
    description: '',
    contactMethod: 'EMAIL'
  })

  const handleFeedbackSubmit = async () => {
    try {
      await submitFeedbackAPI({
        type: feedbackForm.type,
        rating: feedbackForm.rating,
        title: feedbackForm.title,
        description: feedbackForm.description,
        contactEmail: feedbackForm.contactEmail || undefined,
        fromEmail: customerDetails?.email || feedbackForm.contactEmail || undefined
      })
      toast.success('Phản hồi đã được gửi thành công!')
      setFeedbackDialogOpen(false)
      setFeedbackForm({
        type: 'GENERAL',
        rating: 5,
        title: '',
        description: '',
        contactEmail: ''
      })
    } catch (e) {
      toast.error('Gửi phản hồi thất bại!')
    }
  }

  const handleSupportSubmit = async () => {
    try {
      const contactValue = supportForm.contactMethod === 'EMAIL' ? (customerDetails?.email || '') : ''
      await submitSupportTicketAPI({
        issueType: supportForm.issueType,
        priority: supportForm.priority,
        subject: supportForm.subject,
        description: supportForm.description,
        contactMethod: supportForm.contactMethod,
        contactValue
      })
      toast.success('Yêu cầu hỗ trợ đã được gửi thành công!')
      setSupportDialogOpen(false)
      setSupportForm({
        issueType: 'TECHNICAL',
        priority: 'MEDIUM',
        subject: '',
        description: '',
        contactMethod: 'EMAIL'
      })
    } catch (e) {
      toast.error('Gửi yêu cầu hỗ trợ thất bại!')
    }
  }

  return (
    <Box sx={{
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <Grid container spacing={3}>
        {/* Header Section */}
        <Grid size={12}>
          <Card sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
            textAlign: 'center',
            color: 'white'
          }}>
            <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
              <SupportIcon sx={{ fontSize: '80px', mb: 2, opacity: 0.9 }} />
              <Typography variant="h4" sx={{
                fontWeight: 'bold',
                mb: 2,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                Hỗ Trợ & Phản Hồi
              </Typography>
              <Typography variant="h6" sx={{
                opacity: 0.9,
                mb: 3
              }}>
                Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Support Cards */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{
            height: '100%',
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.2)'
            }
          }} onClick={() => setSupportDialogOpen(true)}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <SupportIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Yêu Cầu Hỗ Trợ
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Gặp vấn đề? Chúng tôi sẽ giúp bạn giải quyết nhanh chóng
              </Typography>
              <Button variant="contained" fullWidth>
                Tạo yêu cầu
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{
            height: '100%',
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 8px 32px rgba(255, 152, 0, 0.2)'
            }
          }} onClick={() => setFeedbackDialogOpen(true)}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <FeedbackIcon sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Gửi Phản Hồi
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Chia sẻ ý kiến để chúng tôi cải thiện dịch vụ tốt hơn
              </Typography>
              <Button variant="contained" color="warning" fullWidth>
                Gửi phản hồi
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{
            height: '100%',
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 8px 32px rgba(76, 175, 80, 0.2)'
            }
          }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <ChatIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Chat Trực Tuyến
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Trò chuyện trực tiếp với nhân viên hỗ trợ
              </Typography>
              <Button variant="contained" color="success" fullWidth>
                Bắt đầu chat
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Contact Information */}
        <Grid size={12}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
                📞 Thông Tin Liên Hệ
              </Typography>
              <Grid container spacing={4}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <PhoneIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      Hotline
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'primary.main', fontWeight: 500 }}>
                      1900-xxxx
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      8:00 - 22:00 (Thứ 2 - Chủ nhật)
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <EmailIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      Email
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'primary.main', fontWeight: 500 }}>
                      support@greenkitchen.com
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Phản hồi trong 24h
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <LocationOnIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      Văn Phòng
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'primary.main', fontWeight: 500 }}>
                      TP. Hồ Chí Minh
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      123 Đường ABC, Quận 1
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <ChatIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      Live Chat
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'primary.main', fontWeight: 500 }}>
                      Trực tuyến 24/7
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Hỗ trợ tức thì
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* FAQ Section */}
        <Grid size={12}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
                ❓ Câu Hỏi Thường Gặp
              </Typography>
              <Grid container spacing={3}>
                {[
                  {
                    question: 'Làm thế nào để đặt hàng?',
                    answer: 'Bạn có thể đặt hàng qua website, ứng dụng mobile hoặc gọi điện trực tiếp đến hotline của chúng tôi.'
                  },
                  {
                    question: 'Thời gian giao hàng là bao lâu?',
                    answer: 'Thời gian giao hàng từ 30-60 phút tùy thuộc vào khoảng cách và tình trạng giao thông.'
                  },
                  {
                    question: 'Có thể thanh toán bằng cách nào?',
                    answer: 'Chúng tôi chấp nhận thanh toán tiền mặt, thẻ tín dụng, ví điện tử và chuyển khoản ngân hàng.'
                  },
                  {
                    question: 'Làm sao để trở thành thành viên?',
                    answer: 'Chỉ cần đặt hàng một lần, bạn sẽ tự động trở thành thành viên và nhận được nhiều ưu đãi.'
                  }
                ].map((faq, index) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={index}>
                    <Box sx={{
                      p: 3,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2,
                      height: '100%'
                    }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                        {faq.question}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {faq.answer}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Feedback Dialog */}
      <Dialog
        open={feedbackDialogOpen}
        onClose={() => setFeedbackDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FeedbackIcon sx={{ color: 'warning.main' }} />
            <Typography variant="h6">
              Gửi Phản Hồi
            </Typography>
          </Box>
          <IconButton onClick={() => setFeedbackDialogOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            <Grid size={12}>
              <FormControl fullWidth>
                <InputLabel>Loại phản hồi</InputLabel>
                <Select
                  value={feedbackForm.type}
                  label="Loại phản hồi"
                  onChange={(e) => setFeedbackForm(prev => ({ ...prev, type: e.target.value }))}
                >
                  <MenuItem value="GENERAL">Phản hồi chung</MenuItem>
                  <MenuItem value="FOOD_QUALITY">Chất lượng món ăn</MenuItem>
                  <MenuItem value="SERVICE">Dịch vụ</MenuItem>
                  <MenuItem value="DELIVERY">Giao hàng</MenuItem>
                  <MenuItem value="WEBSITE">Website/Ứng dụng</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={12}>
              <Typography component="legend">Đánh giá tổng thể</Typography>
              <Rating
                value={feedbackForm.rating}
                onChange={(event, newValue) => {
                  setFeedbackForm(prev => ({ ...prev, rating: newValue }))
                }}
                size="large"
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Tiêu đề phản hồi"
                value={feedbackForm.title}
                onChange={(e) => setFeedbackForm(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Mô tả chi tiết"
                multiline
                rows={4}
                value={feedbackForm.description}
                onChange={(e) => setFeedbackForm(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Email liên hệ (tùy chọn)"
                type="email"
                value={feedbackForm.contactEmail}
                onChange={(e) => setFeedbackForm(prev => ({ ...prev, contactEmail: e.target.value }))}
                placeholder="Để nhận phản hồi từ chúng tôi"
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setFeedbackDialogOpen(false)} variant="outlined">
            Hủy
          </Button>
          <Button onClick={handleFeedbackSubmit} variant="contained" color="warning">
            Gửi phản hồi
          </Button>
        </DialogActions>
      </Dialog>

      {/* Support Dialog */}
      <Dialog
        open={supportDialogOpen}
        onClose={() => setSupportDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SupportIcon sx={{ color: 'primary.main' }} />
            <Typography variant="h6">
              Yêu Cầu Hỗ Trợ
            </Typography>
          </Box>
          <IconButton onClick={() => setSupportDialogOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            <Grid size={6}>
              <FormControl fullWidth>
                <InputLabel>Loại vấn đề</InputLabel>
                <Select
                  value={supportForm.issueType}
                  label="Loại vấn đề"
                  onChange={(e) => setSupportForm(prev => ({ ...prev, issueType: e.target.value }))}
                >
                  <MenuItem value="TECHNICAL">Vấn đề kỹ thuật</MenuItem>
                  <MenuItem value="ORDER">Vấn đề đặt hàng</MenuItem>
                  <MenuItem value="PAYMENT">Vấn đề thanh toán</MenuItem>
                  <MenuItem value="DELIVERY">Vấn đề giao hàng</MenuItem>
                  <MenuItem value="ACCOUNT">Vấn đề tài khoản</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={6}>
              <FormControl fullWidth>
                <InputLabel>Mức độ ưu tiên</InputLabel>
                <Select
                  value={supportForm.priority}
                  label="Mức độ ưu tiên"
                  onChange={(e) => setSupportForm(prev => ({ ...prev, priority: e.target.value }))}
                >
                  <MenuItem value="LOW">Thấp</MenuItem>
                  <MenuItem value="MEDIUM">Trung bình</MenuItem>
                  <MenuItem value="HIGH">Cao</MenuItem>
                  <MenuItem value="URGENT">Khẩn cấp</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Tiêu đề yêu cầu"
                value={supportForm.subject}
                onChange={(e) => setSupportForm(prev => ({ ...prev, subject: e.target.value }))}
                required
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Mô tả chi tiết vấn đề"
                multiline
                rows={4}
                value={supportForm.description}
                onChange={(e) => setSupportForm(prev => ({ ...prev, description: e.target.value }))}
                required
                placeholder="Vui lòng mô tả chi tiết vấn đề bạn gặp phải..."
              />
            </Grid>

            <Grid size={12}>
              <FormControl fullWidth>
                <InputLabel>Phương thức liên hệ</InputLabel>
                <Select
                  value={supportForm.contactMethod}
                  label="Phương thức liên hệ"
                  onChange={(e) => setSupportForm(prev => ({ ...prev, contactMethod: e.target.value }))}
                >
                  <MenuItem value="EMAIL">Email</MenuItem>
                  <MenuItem value="PHONE">Điện thoại</MenuItem>
                  <MenuItem value="CHAT">Live Chat</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setSupportDialogOpen(false)} variant="outlined">
            Hủy
          </Button>
          <Button onClick={handleSupportSubmit} variant="contained">
            Gửi yêu cầu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
