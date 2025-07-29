import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import BasicInfo from './BasicInfo'
import AddressList from './AddressList'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { fetchCustomerDetails } from '~/apis'
import { selectCurrentCustomer } from '~/redux/user/customerSlice'
import { CircularProgress } from '@mui/material'
import ChangePassword from './ChangePassword'
import LinkGoogleAccount from './LinkGoogleAccount'
import UpdateAvatar from './UpdateAvatar'

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
        <UpdateAvatar
          customerDetails={customerDetails}
          setCustomerDetails={setCustomerDetails}
        />

        {/* Phần 3: Số địa chỉ */}
        <AddressList
          addressList={customerDetails?.addresses}
          setAddressList={setCustomerDetails}
          customerDetails={customerDetails}
        />

        {/* Phần 4: Mật khẩu */}
        <ChangePassword
          customerDetails={customerDetails}
          setCustomerDetails={setCustomerDetails}
        />

        {/* Phần 5: Liên kết tài khoản Google */}
        <LinkGoogleAccount
          customerDetails={customerDetails}
          setCustomerDetails={setCustomerDetails}
        />
      </Grid>
    </Box>
  )
}
