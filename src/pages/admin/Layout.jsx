import { createTheme, useTheme } from '@mui/material/styles'
import { AppProvider } from '@toolpad/core/AppProvider'
import { DashboardLayout } from '@toolpad/core/DashboardLayout'
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom'
import { useState, useMemo } from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople'
import AssignmentIcon from '@mui/icons-material/Assignment'
import SettingsIcon from '@mui/icons-material/Settings'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import CampaignIcon from '@mui/icons-material/Campaign'
import ArticleIcon from '@mui/icons-material/Article'
import PeopleIcon from '@mui/icons-material/People'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import PaymentIcon from '@mui/icons-material/Payment'
import Inventory2Icon from '@mui/icons-material/Inventory2'
import AssessmentIcon from '@mui/icons-material/Assessment'
import SecurityIcon from '@mui/icons-material/Security'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import StorefrontIcon from '@mui/icons-material/Storefront'
import { useSelector } from 'react-redux'
import { selectCurrentEmployee } from '~/redux/user/employeeSlice'
import { useDispatch } from 'react-redux'
import { logoutEmployeeApi } from '~/redux/user/employeeSlice'
import { useConfirm } from 'material-ui-confirm'
import OrderList from './Order/OrderList'
import CustomerList from './Customer/CustomerList'
import Dashboard from './Dashboard/Dashboard'
import Settings from './Settings/Settings'
import NotFound from './NotFound/NotFound'
import AccountList from './Accounts/AccountList'
import AccountCreate from './Accounts/AccountCreate'
import MealsList from './Products/MealsList'
import MealCreate from './Products/MealCreate'
import Inventory from './Inventory/Inventory'
import Coupons from './Coupons/Coupons'
import Payments from './Payments/Payments'
import Delivery from './Delivery/Delivery'
import Marketing from './Marketing/Marketing'
import Posts from './Posts/Posts'
import PostCreate from './Posts/PostCreateOrUpdateForm'
import Reports from './Reports/Reports'
import SecurityLogs from './Security/SecurityLogs'
import SupportTickets from './Support/SupportTickets'
import Stores from './Locations/Stores'
import NotAuthorized from './NotAuthorized/NotAuthorized'
import { EMPLOYEE_ROLES } from '~/utils/constants'
import Typography from '@mui/material/Typography'

// Component bảo vệ Route dựa trên vai trò
const ProtectedRoute = ({ allowedRoles, children }) => {
  const currentEmployee = useSelector(selectCurrentEmployee)
  if (!allowedRoles.includes(currentEmployee.role)) {
    return <Navigate to='/management/not-authorized' />
  }
  return children
}


//Custom Navigation (se tach ra 1 file rieng)
const NAVIGATION = (currentEmployee) => {
  const baseNav = []
  if (currentEmployee?.role === EMPLOYEE_ROLES.ADMIN) {
    baseNav.push(
      {
        kind: 'header',
        title: 'MAIN MENU'
      },
      // Dashboard
      {
        segment: 'management/',
        title: 'Dashboard',
        icon: <DashboardIcon />
      },
      // Accounts
      {
        segment: 'management/accounts',
        title: 'Account',
        icon: <PeopleIcon />,
        children: [
          { segment: 'list', title: 'Account List' },
          { segment: 'create', title: 'Create Account' }
        ]
      },
      // Customers
      {
        segment: 'management/customers',
        title: 'Customer',
        icon: <EmojiPeopleIcon />
      },
      // Meals / Products
      {
        segment: 'management/meals',
        title: 'Meals',
        icon: <RestaurantMenuIcon />,
        children: [
          { segment: 'list', title: 'Meals List' },
          { segment: 'create', title: 'Create Meal' }
        ]
      },
      {
        kind: 'header',
        title: 'PRODUCTIVITY'
      },
      // Orders
      {
        segment: 'management/orders',
        title: 'Order',
        icon: <AssignmentIcon />
      },
      // Coupons / Promotions
      {
        segment: 'management/coupons',
        title: 'Coupons',
        icon: <LocalOfferIcon />
      },
      // Payments
      {
        segment: 'management/payments',
        title: 'Payments',
        icon: <PaymentIcon />
      },
      // Delivery / Drivers
      {
        segment: 'management/delivery',
        title: 'Delivery',
        icon: <LocalShippingIcon />
      },
      // Inventory
      {
        segment: 'management/inventory',
        title: 'Inventory',
        icon: <Inventory2Icon />
      },
      {
        kind: 'header',
        title: 'GENERAL'
      },
      // Reports
      {
        segment: 'management/reports',
        title: 'Reports',
        icon: <AssessmentIcon />
      },
      // Security & Audit
      {
        segment: 'management/security',
        title: 'Security & Audit',
        icon: <SecurityIcon />
      },
      // Support / Tickets
      {
        segment: 'management/support',
        title: 'Support',
        icon: <SupportAgentIcon />,
        action: <Chip label={7} color="primary" size="small" />
      },
      // Stores / Locations
      {
        segment: 'management/stores',
        title: 'Stores',
        icon: <StorefrontIcon />
      },
      {
        kind: 'header',
        title: 'OTHERS'
      },
      // Marketing & Posts
      {
        segment: 'management/marketing',
        title: 'Marketing',
        icon: <CampaignIcon />
      },
      {
        segment: 'management/posts',
        title: 'Posts',
        icon: <ArticleIcon />
      },
      // Settings
      {
        segment: 'management/settings',
        title: 'Settings',
        icon: <SettingsIcon />
      }
    )
  } else if (currentEmployee?.role === EMPLOYEE_ROLES.EMPLOYEE) {
    baseNav.push(
      {
        segment: 'management/orders',
        title: 'Order',
        icon: <AssignmentIcon />,
        children: [
          { segment: 'create', title: 'Create Order' },
          { segment: 'list', title: 'Order List' }
        ]
      }
      ,
      {
        segment: 'management/support',
        title: 'Support',
        icon: <SupportAgentIcon />
      }
    )
  }
  return baseNav
}

const customTheme = createTheme({
  cssVariables: { colorSchemeSelector: 'data-toolpad-color-scheme' },
  colorSchemes: { light: true, dark: true }
})

function Layout(props) {
  const { window } = props
  const dispatch = useDispatch()
  const currentEmployee = useSelector(selectCurrentEmployee)
  const confirmLogout = useConfirm()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    const { confirmed } = await confirmLogout({
      title: 'Are you sure you want to logout?',
      description: 'This action is permanent!',
      cancellationText: 'Cancel',
      confirmationText: 'Confirm'
    })
    if (confirmed) {
      dispatch(logoutEmployeeApi())
    }
  }

  const [session, setSession] = useState({
    user: {
      fullname: currentEmployee.fullname,
      email: currentEmployee.email,
      image: currentEmployee.image
    }
  })

  const authentication = useMemo(() => {
    return {
      signIn: () => {
        setSession({
          user: {
            fullname: currentEmployee.fullname,
            email: currentEmployee.email,
            image: currentEmployee.image
          }
        })
      },
      signOut: handleLogout
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEmployee])

  const router = useMemo(() => {
    return {
      pathname: location.pathname,
      searchParams: new URLSearchParams(location.search),
      navigate: (path) => navigate(path)
    }
  }, [location, navigate])

  return (
    <AppProvider
      session={session}
      authentication={authentication}
      navigation={NAVIGATION(currentEmployee)}
      theme={customTheme}
      router={router}
      window={window}
      branding={{
        logo: '',
        homeUrl: '/management',
        title: <Typography sx={{
          fontWeight: 600,
          fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' }
        }}>
          Green Kitchen Management
        </Typography>
      }}
    >
      <DashboardLayout>
        <Routes>
          <Route
            index
            element={
              <ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path='settings'
            element={
              <ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.EMPLOYEE]}>
                <Settings />
              </ProtectedRoute>
            }
          />

          <Route
            path='customers'
            element={
              <ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN, EMPLOYEE_ROLES.EMPLOYEE]}>
                <CustomerList />
              </ProtectedRoute>
            }
          />

          <Route
            path='orders'
            element={
              <ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN, EMPLOYEE_ROLES.EMPLOYEE]}>
                <OrderList />
              </ProtectedRoute>
            }
          />

          <Route
            path='not-authorized'
            element={<NotAuthorized />}
          />

          <Route
            path='*'
            element={<NotFound />}
          />

          {/* Accounts */}
          <Route path="accounts">
            <Route index element={
              <ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN]}>
                <AccountList />
              </ProtectedRoute>
            } />
            <Route path="list" element={
              <ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN]}>
                <AccountList />
              </ProtectedRoute>
            } />
            <Route path="create" element={
              <ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN]}>
                <AccountCreate />
              </ProtectedRoute>
            } />
          </Route>

          {/* Products / Meals */}
          <Route path="meals">
            <Route index element={
              <ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN]}>
                <MealsList />
              </ProtectedRoute>
            } />
            <Route path="list" element={
              <ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN]}>
                <MealsList />
              </ProtectedRoute>
            } />
            <Route path="create" element={
              <ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN]}>
                <MealCreate />
              </ProtectedRoute>
            } />
          </Route>

          {/* Inventory */}
          <Route path="inventory" element={<ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN]}><Inventory /></ProtectedRoute>} />

          {/* Coupons / Promotions */}
          <Route path="coupons" element={<ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN]}><Coupons /></ProtectedRoute>} />

          {/* Payments */}
          <Route path="payments" element={<ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN]}><Payments /></ProtectedRoute>} />

          {/* Delivery / Drivers */}
          <Route path="delivery" element={<ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN]}><Delivery /></ProtectedRoute>} />

          {/* Marketing & Posts */}
          <Route path="marketing" element={<ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN]}><Marketing /></ProtectedRoute>} />

          {/*Blog Posts */}
          <Route path="posts">
            <Route index element={
              <ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN]}>
                <Posts />
              </ProtectedRoute>
            } />
            <Route path="list" element={
              <ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN]}>
                <Posts />
              </ProtectedRoute>
            } />
            <Route path="create" element={
              <ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN]}>
                <PostCreate />
              </ProtectedRoute>
            } />
            <Route path="edit/:id" element={
              <ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN]}>
                <PostCreate />
              </ProtectedRoute>
            } />
          </Route>

          {/* Reports */}
          <Route path="reports" element={<ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN]}><Reports /></ProtectedRoute>} />

          {/* Security & Audit */}
          <Route path="security" element={<ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN]}><SecurityLogs /></ProtectedRoute>} />

          {/* Support / Tickets */}
          <Route path="support" element={
            <ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN, EMPLOYEE_ROLES.EMPLOYEE]}>
              <SupportTickets />
            </ProtectedRoute>} />

          {/* Locations / Stores */}
          <Route path="stores" element={<ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN]}><Stores /></ProtectedRoute>} />

        </Routes>
      </DashboardLayout>
    </AppProvider >
  )
}

export default Layout

