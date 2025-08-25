import { useState, useEffect, useCallback } from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Divider from '@mui/material/Divider'
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
import FeedbackTab from './FeedbackTab/FeedbackTab'
import { useSelector } from 'react-redux'
import { selectCurrentCustomer } from '~/redux/user/customerSlice'
import { fetchCustomerDetails } from '~/apis'
import CircularProgress from '@mui/material/CircularProgress'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import AssessmentIcon from '@mui/icons-material/Assessment'
import LoyaltyIcon from '@mui/icons-material/Loyalty'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import RateReviewIcon from '@mui/icons-material/RateReview'
import StorefrontIcon from '@mui/icons-material/Storefront'
import PolicyIcon from '@mui/icons-material/Policy'
import BottomProfileNav from '~/components/BottomProfileNav/BottomProfileNav'
import OrderDetails from './OrderHistoryTab/OrderDetails'

// Khai báo đống tabs ra biến const để dùng lại cho gọn
const TABS = {
  ACCOUNT: 'account',
  MEMBERSHIP: 'membership',
  OVERVIEW: 'overview',
  ORDERHISTORY: 'order-history',
  TDEEPROFILE: 'tdee-profile',
  STORELOCATION: 'store-location',
  FEEDBACK: 'feedback',
  POLICY: 'policy',
  ORDERDETAILS: 'order-details'
}

function Profile() {
  const location = useLocation()
  const [customerDetails, setCustomerDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const currentCustomer = useSelector(selectCurrentCustomer)

  // Function đơn giản có nhiệm vụ lấy ra cái tab mặc định dựa theo url.
  const getDefaultTab = useCallback(() => {
    if (location.pathname.includes(TABS.MEMBERSHIP)) return TABS.MEMBERSHIP
    if (location.pathname.includes(TABS.ACCOUNT)) return TABS.ACCOUNT
    if (location.pathname.includes(TABS.TDEEPROFILE)) return TABS.TDEEPROFILE
    // detect order history details path: /profile/order-history/:orderCode -> show order-details tab
    if (location.pathname.includes(TABS.ORDERHISTORY) && /\/profile\/order-history\/.+/.test(location.pathname)) return TABS.ORDERDETAILS
    if (location.pathname.includes(TABS.ORDERHISTORY)) return TABS.ORDERHISTORY
    if (location.pathname.includes(TABS.FEEDBACK)) return TABS.FEEDBACK
    return TABS.OVERVIEW
  }, [location.pathname])
  // State lưu trữ giá trị tab nào đang active
  const [activeTab, setActiveTab] = useState(getDefaultTab())

  // Đồng bộ tab đang hiển thị với URL khi người dùng điều hướng bằng Link bên ngoài TabList
  useEffect(() => {
    setActiveTab(getDefaultTab())
    // if URL contains an order code, keep it available for the OrderDetails tab
    // nothing else required here — OrderDetails will receive the code from location below
  }, [getDefaultTab])

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
    <Container
      maxWidth={false}
      sx={{
        maxWidth: { lg: '1350px', xl: '1500px' }
      }}
    >
      <ProfileNavBar />
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          minHeight: 400,
          pt: { xs: 2, sm: 3, md: 4 },
          pb: { xs: 9, sm: 9, md: 0 }
        }}
      >
        <TabContext value={activeTab}>
          <TabList
            orientation='vertical'
            onChange={handleChangeTab}
            sx={{
              display: { xs: 'none', sm: 'none', md: 'flex' },
              gap: 2,
              borderRight: 1,
              height: '100%',
              borderColor: 'divider',
              minWidth: 250,
              textAlign: 'left',
              cursor: 'pointer',
              '& .MuiTab-root': {
                justifyContent: 'flex-start',
                textAlign: 'left',
                alignItems: 'center',
                minHeight: 44,
                py: 1,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white'
                },
                transition: 'background-color 0.3s, color 0.3s'
              },
              '& .MuiTab-iconWrapper': {
                marginRight: 2,
                '& svg': { fontSize: 18 }
              },
              '& .MuiTabs-indicator': {
                display: 'none'
              }
            }}
          >
            <Tab
              disabled
              sx={{ minHeight: 80, justifyContent: 'flex-start', textAlign: 'left', cursor: 'default', mb: 2 }}
              label={
                <Box>
                  <Box fontWeight={700} fontSize={16}>{currentCustomer.fullName}</Box>
                  <Box fontSize={14} color="text.secondary">{currentCustomer.email}</Box>
                </Box>
              }
            />
            <Divider />
            <Box sx={{ height: 16 }} />
            <Tab
              label="Tổng Quan"
              value={TABS.OVERVIEW}
              icon={<AssessmentIcon fontSize='medium'/>}
              iconPosition="start"
              component={Link}
              to="/profile/overview"/>
            <Tab
              label="Thông Tin Tài Khoản"
              value={TABS.ACCOUNT}
              icon={<ManageAccountsIcon fontSize='medium'/>}
              iconPosition='start'
              component={Link}
              to="/profile/account" />
            <Tab
              label="Hạng Thành Viên"
              value={TABS.MEMBERSHIP}
              icon={<LoyaltyIcon fontSize='medium'/>}
              iconPosition="start"
              component={Link}
              to="/profile/membership" />
            <Tab
              label="Lịch Sử Đặt Hàng"
              value={TABS.ORDERHISTORY}
              icon={<LocalShippingIcon fontSize='medium'/>}
              iconPosition="start"
              component={Link}
              to="/profile/order-history" />
            <Tab
              label="Thông tin TDEE"
              value={TABS.TDEEPROFILE}
              icon={<FitnessCenterIcon fontSize='medium'/>}
              iconPosition="start"
              component={Link}
              to="/profile/tdee-profile" />
            {/* Group separator before the last three tabs */}
            <Box sx={{ height: 16 }} />
            <Divider />
            <Box sx={{ height: 16 }} />
            <Tab
              label="Hỗ trợ và Phản hồi"
              value={TABS.FEEDBACK}
              icon={<RateReviewIcon fontSize='medium'/>}
              iconPosition="start"
              component={Link}
              to="/profile/feedback" />
            <Tab
              label="Tìm kiếm cửa hàng"
              value={TABS.STORELOCATION}
              icon={<StorefrontIcon fontSize='medium'/>}
              iconPosition="start"
              component={Link}
              to="/store-location" />
            <Tab
              label="Chính sách sử dụng"
              value={TABS.POLICY}
              icon={<PolicyIcon fontSize='medium'/>}
              iconPosition="start"
              component={Link}
              to="/policy" />
          </TabList>
          <Box
            sx={{
              flex: 1,
              '& .MuiTabPanel-root': {
                p: { xs: 0, sm: 2 }
              }
            }}
          >
            <TabPanel value={TABS.OVERVIEW}><OverviewTab customerDetails={customerDetails} setCustomerDetails={setCustomerDetails} /></TabPanel>
            <TabPanel value={TABS.ACCOUNT}><AccountTab customerDetails={customerDetails} setCustomerDetails={setCustomerDetails} /></TabPanel>
            <TabPanel value={TABS.MEMBERSHIP}><MembershipTab customerDetails={customerDetails} setCustomerDetails={setCustomerDetails} /></TabPanel>
            <TabPanel value={TABS.ORDERHISTORY}><OrderHistoryTab customerDetails={customerDetails} setCustomerDetails={setCustomerDetails} /></TabPanel>
            <TabPanel value={TABS.TDEEPROFILE}><CustomerTDEETab customerDetails={customerDetails} setCustomerDetails={setCustomerDetails} /></TabPanel>
            <TabPanel value={TABS.FEEDBACK}><FeedbackTab customerDetails={customerDetails} setCustomerDetails={setCustomerDetails} /></TabPanel>
            {/* Order details tab: if URL is /profile/order-history/:orderCode we extract the code and pass it in */}
            <TabPanel value={TABS.ORDERDETAILS}>
              {(() => {
                const m = location.pathname.match(/\/profile\/order-history\/([^/]+)/)
                const orderCode = m ? decodeURIComponent(m[1]) : null
                return <OrderDetails orderCode={orderCode} customerDetails={customerDetails} setCustomerDetails={setCustomerDetails} />
              })()}
            </TabPanel>
          </Box>
        </TabContext>
      </Box>
      {/* mobile bottom nav for xs / sm */}
      <Box sx={{ display: { xs: 'block', sm: 'block', md: 'none' } }}>
        <BottomProfileNav />
      </Box>
    </Container>
  )
}

export default Profile
