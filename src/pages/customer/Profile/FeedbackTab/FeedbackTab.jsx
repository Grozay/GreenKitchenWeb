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
      toast.success('Feedback submitted successfully!')
      setFeedbackDialogOpen(false)
      setFeedbackForm({
        type: 'GENERAL',
        rating: 5,
        title: '',
        description: '',
        contactEmail: ''
      })
    } catch (e) {
      toast.error('Failed to submit feedback!')
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
      toast.success('Support request submitted successfully!')
      setSupportDialogOpen(false)
      setSupportForm({
        issueType: 'TECHNICAL',
        priority: 'MEDIUM',
        subject: '',
        description: '',
        contactMethod: 'EMAIL'
      })
    } catch (e) {
      toast.error('Failed to submit support request!')
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
                Support & Feedback
              </Typography>
              <Typography variant="h6" sx={{
                opacity: 0.9,
                mb: 3
              }}>
                We are always ready to support you 24/7
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
                Support Request
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Having issues? We&apos;ll help you resolve them quickly
              </Typography>
              <Button variant="contained" fullWidth>
                Create Request
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
                Send Feedback
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Share your thoughts to help us improve our service
              </Typography>
              <Button variant="contained" color="warning" fullWidth>
                Send Feedback
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
                Live Chat
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Chat directly with our support AI for best suggest healthy information
              </Typography>
              <Button variant="contained" color="success" fullWidth>
                Start Chat
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Contact Information */}
        <Grid size={12}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
                📞 Contact Information
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
                      8:00 - 22:00 (Monday - Sunday)
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
                      Response within 24h
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <LocationOnIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      Office
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'primary.main', fontWeight: 500 }}>
                      Ho Chi Minh City
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      123 ABC Street, District 1
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
                      Online 24/7
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Instant support
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
                ❓ Frequently Asked Questions
              </Typography>
              <Grid container spacing={3}>
                {[
                  {
                    question: 'How to place an order?',
                    answer: 'You can place an order through our website, mobile app, or call our hotline directly.'
                  },
                  {
                    question: 'How long is the delivery time?',
                    answer: 'Delivery time is 30-60 minutes depending on distance and traffic conditions.'
                  },
                  {
                    question: 'What payment methods are available?',
                    answer: 'We accept cash payment, credit card, e-wallet, and bank transfer.'
                  },
                  {
                    question: 'How to become a member?',
                    answer: 'Just place an order once, you will automatically become a member and receive many benefits.'
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
              Send Feedback
            </Typography>
          </Box>
          <IconButton onClick={() => setFeedbackDialogOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={3} item xs={12} sx={{ mt: 1 }}>
            <Grid size={12}>
              <FormControl fullWidth>
                <InputLabel>Feedback Type</InputLabel>
                <Select
                  value={feedbackForm.type}
                  label="Feedback Type"
                  onChange={(e) => setFeedbackForm(prev => ({ ...prev, type: e.target.value }))}
                >
                  <MenuItem value="GENERAL">General Feedback</MenuItem>
                  <MenuItem value="FOOD_QUALITY">Food Quality</MenuItem>
                  <MenuItem value="SERVICE">Service</MenuItem>
                  <MenuItem value="DELIVERY">Delivery</MenuItem>
                  <MenuItem value="WEBSITE">Website/App</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={12}>
              <Typography component="legend">Overall Rating</Typography>
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
                label="Feedback Title"
                value={feedbackForm.title}
                onChange={(e) => setFeedbackForm(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Detailed Description"
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
                label="Contact Email (optional)"
                type="email"
                value={feedbackForm.contactEmail}
                onChange={(e) => setFeedbackForm(prev => ({ ...prev, contactEmail: e.target.value }))}
                placeholder="To receive response from us"
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3 }} >
          <Button onClick={() => setFeedbackDialogOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleFeedbackSubmit} variant="contained" color="warning">
            Send Feedback
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
              Support Request
            </Typography>
          </Box>
          <IconButton onClick={() => setSupportDialogOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={3} item xs={12} sx={{ mt: 1 }}>
            <Grid size={6}>
              <FormControl fullWidth>
                <InputLabel>Issue Type</InputLabel>
                <Select
                  value={supportForm.issueType}
                  label="Issue Type"
                  onChange={(e) => setSupportForm(prev => ({ ...prev, issueType: e.target.value }))}
                >
                  <MenuItem value="TECHNICAL">Technical Issue</MenuItem>
                  <MenuItem value="ORDER">Order Issue</MenuItem>
                  <MenuItem value="PAYMENT">Payment Issue</MenuItem>
                  <MenuItem value="DELIVERY">Delivery Issue</MenuItem>
                  <MenuItem value="ACCOUNT">Account Issue</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={6}>
              <FormControl fullWidth>
                <InputLabel>Priority Level</InputLabel>
                <Select
                  value={supportForm.priority}
                  label="Priority Level"
                  onChange={(e) => setSupportForm(prev => ({ ...prev, priority: e.target.value }))}
                >
                  <MenuItem value="LOW">Low</MenuItem>
                  <MenuItem value="MEDIUM">Medium</MenuItem>
                  <MenuItem value="HIGH">High</MenuItem>
                  <MenuItem value="URGENT">Urgent</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Request Title"
                value={supportForm.subject}
                onChange={(e) => setSupportForm(prev => ({ ...prev, subject: e.target.value }))}
                required
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Detailed Problem Description"
                multiline
                rows={4}
                value={supportForm.description}
                onChange={(e) => setSupportForm(prev => ({ ...prev, description: e.target.value }))}
                required
                placeholder="Please describe the problem you are experiencing in detail..."
              />
            </Grid>

            <Grid size={12}>
              <FormControl fullWidth>
                <InputLabel>Contact Method</InputLabel>
                <Select
                  value={supportForm.contactMethod}
                  label="Contact Method"
                  onChange={(e) => setSupportForm(prev => ({ ...prev, contactMethod: e.target.value }))}
                >
                  <MenuItem value="EMAIL">Email</MenuItem>
                  <MenuItem value="PHONE">Phone</MenuItem>
                  <MenuItem value="CHAT">Live Chat</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setSupportDialogOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSupportSubmit} variant="contained">
            Send Request
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
