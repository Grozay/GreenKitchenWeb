import { useState } from 'react'
import AppBar from '~/components/AppBar/AppBar'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import SecurityIcon from '@mui/icons-material/Security'
import PersonIcon from '@mui/icons-material/Person'
import { Link, useLocation } from 'react-router-dom'
import AccountTab from './AccountTab'
import MembershipTab from './MembershipTab'
import OverviewTab from './OverviewTab'
import ProfileNavBar from '~/components/ProfileNavBar/ProfileNavBar'
import OrderHistoryTab from './OrderHistoryTab'
import HealthProfileTab from './HealthProfileTab'

// Khai báo đống tabs ra biến const để dùng lại cho gọn
const TABS = {
  ACCOUNT: 'account',
  MEMBERSHIP: 'membership',
  OVERVIEW: 'overview',
  ORDERHISTORY: 'order-history',
  HEALTHPROFILE: 'health-profile'
}

function Profile() {
  const location = useLocation()
  // Function đơn giản có nhiệm vụ lấy ra cái tab mặc định dựa theo url.
  const getDefaultTab = () => {
    if (location.pathname.includes(TABS.MEMBERSHIP)) return TABS.MEMBERSHIP
    if (location.pathname.includes(TABS.ACCOUNT)) return TABS.ACCOUNT
    if (location.pathname.includes(TABS.HEALTHPROFILE)) return TABS.HEALTHPROFILE
    if (location.pathname.includes(TABS.ORDERHISTORY)) return TABS.ORDERHISTORY
    return TABS.OVERVIEW
  }
  // State lưu trữ giá trị tab nào đang active
  const [activeTab, setActiveTab] = useState(getDefaultTab())

  // https://mui.com/material-ui/react-tabs
  const handleChangeTab = (event, selectedTab) => { setActiveTab(selectedTab) }

  return (
    <Box>
      <ProfileNavBar />
      <Box sx={{ display: 'flex', width: '100%', minHeight: 400, p: { xs: 0, sm: 5, md: 10 } }}>
        <TabContext value={activeTab}>
          <TabList
            orientation='vertical'
            onChange={handleChangeTab}
            sx={{
              display: { xs: 'none', sm: 'none', md: 'flex' },
              borderRight: 1,
              borderColor: 'divider',
              minWidth: 180,
              textAlign: 'left',
              '& .MuiTab-root': {
                justifyContent: 'flex-start',
                textAlign: 'left',
                alignItems: 'flex-start'
              }
            }}
          >
            <Tab
              disabled
              sx={{ minHeight: 80, justifyContent: 'flex-start', textAlign: 'left', cursor: 'default', opacity: 1 }}
              label={
                <Box>
                  {/* Hiển thị tên và email khách hàng ở đây */}
                  <Box fontWeight={700} fontSize={16}>Nguyen Van A</Box>
                  <Box fontSize={14} color="text.secondary">email@gmail.com</Box>
                </Box>
              }
            />
            <Tab
              label="Overview"
              value={TABS.OVERVIEW}
              iconPosition="start"
              component={Link}
              to="/profile/overview" />
            <Tab
              label="Account"
              value={TABS.ACCOUNT}
              iconPosition="start"
              component={Link}
              to="/profile/account" />
            <Tab
              label="Membership"
              value={TABS.MEMBERSHIP}
              iconPosition="start"
              component={Link}
              to="/profile/membership" />
            <Tab
              label="Order History"
              value={TABS.ORDERHISTORY}
              iconPosition="start"
              component={Link}
              to="/profile/order-history" />
            <Tab
              label="Health Profile"
              value={TABS.HEALTHPROFILE}
              iconPosition="start"
              component={Link}
              to="/profile/health-profile" />
          </TabList>
          <Box sx={{ flex: 1, pl: { xs: 0, sm: 0, md: 4 } }}>
            <TabPanel value={TABS.OVERVIEW}><OverviewTab /></TabPanel>
            <TabPanel value={TABS.ACCOUNT}><AccountTab /></TabPanel>
            <TabPanel value={TABS.MEMBERSHIP}><MembershipTab /></TabPanel>
            <TabPanel value={TABS.ORDERHISTORY}><OrderHistoryTab /></TabPanel>
            <TabPanel value={TABS.HEALTHPROFILE}><HealthProfileTab /></TabPanel>
          </Box>
        </TabContext>
      </Box>
    </Box>
  )
}

export default Profile
