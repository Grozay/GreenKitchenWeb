import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import BasicInfo from './BasicInfo'
import AddressList from './AddressList'
import ChangePassword from './ChangePassword'
import LinkGoogleAccount from './LinkGoogleAccount'
import UpdateAvatar from './UpdateAvatar'

export default function AccountTab({ customerDetails, setCustomerDetails }) {
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
