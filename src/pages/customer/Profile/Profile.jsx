import { useState, useEffect } from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { Link, useLocation } from 'react-router-dom'
import AccountTab from './AccountTab/AccountTab'
import MembershipTab from './MembershipTab/MembershipTab'
import OverviewTab from './OverviewTab/OverviewTab'
import ProfileNavBar from '~/components/ProfileNavBar/ProfileNavBar'
import OrderHistoryTab from './OrderHistoryTab/OrderHistoryTab'
import CustomerTDEETab from './CustomerTDEETab/CustomerTDEETab'
import { useSelector } from 'react-redux'
import { selectCurrentCustomer } from '~/redux/user/customerSlice'
import { fetchCustomerDetails } from '~/apis'
import { CircularProgress } from '@mui/material'

// Khai báo đống tabs ra biến const để dùng lại cho gọn
const TABS = {
  ACCOUNT: 'account',
  MEMBERSHIP: 'membership',
  OVERVIEW: 'overview',
  ORDERHISTORY: 'order-history',
  TDEEPROFILE: 'tdee-profile'
}

function Profile() {
  const location = useLocation()
  const [customerDetails, setCustomerDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const currentCustomer = useSelector(selectCurrentCustomer)

  // Function đơn giản có nhiệm vụ lấy ra cái tab mặc định dựa theo url.
  const getDefaultTab = () => {
    if (location.pathname.includes(TABS.MEMBERSHIP)) return TABS.MEMBERSHIP
    if (location.pathname.includes(TABS.ACCOUNT)) return TABS.ACCOUNT
    if (location.pathname.includes(TABS.TDEEPROFILE)) return TABS.TDEEPROFILE
    if (location.pathname.includes(TABS.ORDERHISTORY)) return TABS.ORDERHISTORY
    return TABS.OVERVIEW
  }
  // State lưu trữ giá trị tab nào đang active
  const [activeTab, setActiveTab] = useState(getDefaultTab())

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
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  // https://mui.com/material-ui/react-tabs
  const handleChangeTab = (event, selectedTab) => { setActiveTab(selectedTab) }

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
      <ProfileNavBar />
      <Box sx={{ display: 'flex', width: '100%', minHeight: 400, pt: { xs: 2, sm: 3, md: 4 } }}>
        <TabContext value={activeTab}>
          <TabList
            orientation='vertical'
            onChange={handleChangeTab}
            sx={{
              display: { xs: 'none', sm: 'none', md: 'flex' },
              borderRight: 1,
              height: '100%',
              borderColor: 'divider',
              minWidth: 250,
              textAlign: 'left',
              cursor: 'pointer',
              '& .MuiTab-root': {
                justifyContent: 'flex-start',
                textAlign: 'left',
                alignItems: 'flex-start',
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white'
                },
                transition: 'background-color 0.3s, color 0.3s'
              },
              '& .MuiTabs-indicator': {
                display: 'none'
              }
            }}
          >
            <Tab
              disabled
              sx={{ minHeight: 80, justifyContent: 'flex-start', textAlign: 'left', cursor: 'default', opacity: 1 }}
              label={
                <Box>
                  {/* Hiển thị tên và email khách hàng ở đây */}
                  <Box fontWeight={700} fontSize={16}>{currentCustomer.fullName}</Box>
                  <Box fontSize={14} color="text.secondary">{currentCustomer.email}</Box>
                </Box>
              }
            />
            <Tab
              label="Tổng Quan"
              value={TABS.OVERVIEW}
              iconPosition="start"
              component={Link}
              to="/profile/overview" />
            <Tab
              label="Thông Tin Tài Khoản"
              value={TABS.ACCOUNT}
              iconPosition="start"
              component={Link}
              to="/profile/account" />
            <Tab
              label="Hạng Thành Viên"
              value={TABS.MEMBERSHIP}
              iconPosition="start"
              component={Link}
              to="/profile/membership" />
            <Tab
              label="Lịch Sử Đặt Hàng"
              value={TABS.ORDERHISTORY}
              iconPosition="start"
              component={Link}
              to="/profile/order-history" />
            <Tab
              label="Thông tin TDEE"
              value={TABS.TDEEPROFILE}
              iconPosition="start"
              component={Link}
              to="/profile/Tdee-profile" />
          </TabList>
          <Box sx={{ flex: 1 }}>
            <TabPanel value={TABS.OVERVIEW}><OverviewTab customerDetails={customerDetails} setCustomerDetails={setCustomerDetails} /></TabPanel>
            <TabPanel value={TABS.ACCOUNT}><AccountTab customerDetails={customerDetails} setCustomerDetails={setCustomerDetails} /></TabPanel>
            <TabPanel value={TABS.MEMBERSHIP}><MembershipTab customerDetails={customerDetails} setCustomerDetails={setCustomerDetails} /></TabPanel>
            <TabPanel value={TABS.ORDERHISTORY}><OrderHistoryTab customerDetails={customerDetails} setCustomerDetails={setCustomerDetails} /></TabPanel>
            <TabPanel value={TABS.TDEEPROFILE}><CustomerTDEETab customerDetails={customerDetails} setCustomerDetails={setCustomerDetails} /></TabPanel>
          </Box>
        </TabContext>
      </Box>
    </Container>
  )
}

export default Profile
