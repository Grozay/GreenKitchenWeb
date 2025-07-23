import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar'
import PersonIcon from '@mui/icons-material/Person'
import BasicInfo from './BasicInfo'
import AddressList from './AddressList'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { fetchCustomerDetails } from '~/apis'
import { selectCurrentCustomer } from '~/redux/user/customerSlice'
import { CircularProgress } from '@mui/material'
import ChangePassword from './ChangePassword'
import LinkGoogleAccount from './LinkGoogleAccount'

export default function AccountTab() {
  const [customerDetails, setCustomerDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const currentCustomer = useSelector(selectCurrentCustomer)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const data = await fetchCustomerDetails(currentCustomer.email)
        setCustomerDetails(data)
      } catch {
        // Error handling
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [currentCustomer.email])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <Grid container spacing={1.5}>
        {/* Phần 1: Thông tin cá nhân */}
        <BasicInfo
          basicInfo={customerDetails}
          setBasicInfo={setCustomerDetails}
        />

        {/* Phần 2: Hình đại diện */}
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
                >
                  Thay đổi
                </Button>
              </Box>

              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}>
                <Avatar sx={{
                  width: 60,
                  height: 60,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}>
                  <PersonIcon sx={{ fontSize: 30, color: '#ffffff' }} />
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
            </CardContent>
          </Card>
        </Grid>

        {/* Phần 3: Số địa chỉ */}
        <AddressList
          addressList={customerDetails?.addresses}
          setAddressList={setCustomerDetails}
          customerDetails={customerDetails}
        />

        {/* Phần 4: Mật khẩu */}
        <ChangePassword email={customerDetails?.email} />

        {/* Phần 5: Liên kết tài khoản Google */}
        <LinkGoogleAccount
          customerDetails={customerDetails}
          setCustomerDetails={setCustomerDetails}
        />
      </Grid>
    </Box>
  )
}
