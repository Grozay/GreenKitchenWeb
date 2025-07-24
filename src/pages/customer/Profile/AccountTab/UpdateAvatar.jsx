import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar'
import PersonIcon from '@mui/icons-material/Person'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import { toast } from 'react-toastify'
import { useState, useRef } from 'react'
import { updateAvatarAPI } from '~/apis'

export default function UpdateAvatar({ customerDetails, setCustomerDetails }) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Chỉ chấp nhận file JPG, PNG')
      return
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error('Kích thước file không được vượt quá 5MB')
      return
    }

    setUploading(true)

    await toast.promise(updateAvatarAPI(customerDetails.email, file), {
      pending: 'Đang tải lên ảnh đại diện...',
      success: {
        render({ data }) {
          // Update customer details with new avatar
          setCustomerDetails(prev => ({
            ...prev,
            avatar: data.avatar
          }))
          return 'Cập nhật ảnh đại diện thành công!'
        }
      },
      error: 'Có lỗi xảy ra khi tải lên ảnh'
    }).then(() => {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    })
  }


  return (
    <Grid size={{ xs: 12, sm: 12, md: 6 }}>
      <Card sx={{
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        height: '100%'
      }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2
          }}>
            <Typography variant="h6" component="h3">
              Hình đại diện
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={handleFileSelect}
              disabled={uploading}
              startIcon={<PhotoCameraIcon />}
            >
              {uploading ? 'Đang tải...' : 'Thay đổi'}
            </Button>
          </Box>

          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <Avatar
              src={customerDetails?.avatar}
              sx={{
                width: 60,
                height: 60,
                background: !customerDetails?.avatar ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent'
              }}
            >
              {!customerDetails?.avatar && <PersonIcon sx={{ fontSize: 30, color: '#ffffff' }} />}
            </Avatar>
            <Box>
              <Typography variant="body2" sx={{
                color: 'primary.main',
                fontWeight: 500,
                mb: 0.5
              }}>
                Tải lên ảnh đại diện của bạn
              </Typography>
              <Typography variant="caption" sx={{
                color: 'text.secondary',
                fontSize: '0.75rem'
              }}>
                Định dạng: JPG, PNG. Kích thước tối đa: 5MB
              </Typography>
            </Box>
          </Box>

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/jpg,image/png"
            style={{ display: 'none' }}
          />
        </CardContent>
      </Card>
    </Grid>
  )
}
