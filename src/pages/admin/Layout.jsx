import { createTheme } from '@mui/material/styles'
import { AppProvider } from '@toolpad/core/AppProvider'
import { DashboardLayout } from '@toolpad/core/DashboardLayout'
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom'
import { useState, useMemo, useEffect } from 'react'
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
import OrderDetails from './Order/OrderDetails'
import CustomerList from './Customer/CustomerList'
import Dashboard from './Dashboard/Dashboard'
import Settings from './Settings/Settings'
import NotFound from './NotFound/NotFound'
import AccountList from './Accounts/AccountList'
import AccountCreate from './Accounts/AccountCreate'
import MealsList from './MenuMeal/MenuMealList'
import MealCreate from './MenuMeal/MenuMealCreate'
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
import MealDetail from './MenuMeal/MenuMealDetail'
import MealEdit from './MenuMeal/MenuMealEdit'
import IngredientsList from './Ingredient/IngredientList'
import IngredientCreate from './Ingredient/IngredientCreate'
import IngredientDetail from './Ingredient/IngredientDetail'
import IngredientEdit from './Ingredient/IngredientEdit'
// duplicate/wrong imports removed
import Typography from '@mui/material/Typography'
import { API_ROOT } from '~/utils/constants'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'

// Component bảo vệ Route dựa trên vai trò
const ProtectedRoute = ({ allowedRoles, children }) => {
  const currentEmployee = useSelector(selectCurrentEmployee)
  if (!allowedRoles.includes(currentEmployee.role)) {
    return <Navigate to='/management/not-authorized' />
  }
  return children
}


//Custom Navigation (se tach ra 1 file rieng)
const NAVIGATION = (currentEmployee, newOrderCount) => {
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
      // Orders
      {
        segment: 'management/orders',
        title: 'Orders',
        icon: <AssignmentIcon />,
        action: newOrderCount > 0 ? <Chip label={newOrderCount} color="primary" size="small" /> : null,
        pattern: 'orders{/:orderCode}*'
      },
      // Customers
      {
        segment: 'management/customers',
        title: 'Customer',
        icon: <EmojiPeopleIcon />
      },
      {
        kind: 'header',
        title: 'PRODUCTIVITY'
      },
      // Meals / Products
      {
        segment: 'management/menu-meals',
        title: 'Menu Meals',
        icon: <RestaurantMenuIcon />,
        children: [
          { segment: 'list', title: 'Menu Meals List' },
          { segment: 'create', title: 'Create Menu Meal' }
        ]
      },
      {
        segment: 'management/ingredients',
        title: 'Ingredients',
        icon: <RestaurantMenuIcon />,
        children: [
          { segment: 'list', title: 'Ingredients List' },
          { segment: 'create', title: 'Create Ingredient' }
        ]
      },
      // Support / Tickets
      {
        segment: 'management/support',
        title: 'Support',
        icon: <SupportAgentIcon />,
        action: <Chip label={7} color="primary" size="small" />
      },
      {
        kind: 'header',
        title: 'OTHERS'
      },
      // Stores / Locations
      {
        segment: 'management/stores',
        title: 'Stores',
        icon: <StorefrontIcon />
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
      // Coupons / Promotions
      {
        segment: 'management/coupons',
        title: 'Coupons',
        icon: <LocalOfferIcon />
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

  const [newOrderCount, setNewOrderCount] = useState(0)
  const [showOrderAlert, setShowOrderAlert] = useState(false)

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(`${API_ROOT}/apis/v1/ws`),
      reconnectDelay: 5000,
      // debug: str => console.log(str),
    })
    client.onConnect = () => {
      client.subscribe('/topic/order/new', (message) => {
        console.log('New order received:', message)
        setNewOrderCount(prev => prev + 1)
        setShowOrderAlert(true)
        setTimeout(() => { setShowOrderAlert(false) }, 10000)
      })
    }
    client.activate()
    return () => client.deactivate()
  }, [])

  //Tat thong bao khi click vao Orders
  useEffect(() => {
    if (location.pathname.startsWith('/management/orders')) {
      setNewOrderCount(0)
    }
  }, [location.pathname])

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
    <>
      <Snackbar
        open={showOrderAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ zIndex: 9999 }}
      >
        <Alert severity="info" sx={{ fontWeight: 700, fontSize: 18, justifyContent: 'center', alignItems: 'center' }}>
          You have new Order
        </Alert>
      </Snackbar>

      <AppProvider
        session={session}
        authentication={authentication}
        navigation={NAVIGATION(currentEmployee, newOrderCount)}
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
            Green Kitchen Managemen
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

            <Route path='orders'>
              <Route index element={
                <ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN]}>
                  <OrderList />
                </ProtectedRoute>
              } />
              <Route path=":orderCode" element={
                <ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN]}>
                  <OrderDetails />
                </ProtectedRoute>
              } />
            </Route>

            <Route
              path='not-authorized'
              element={<NotAuthorized />}
            />

            <Route
              path='*'
              element={<NotFound />}
            />

            {/* Coupons / Promotions */}
            <Route path="coupons" element={<ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN]}><Coupons /></ProtectedRoute>} />

            {/* Marketing */}
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

            {/* Locations / Stores */}
            <Route path="stores" element={<ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN]}><Stores /></ProtectedRoute>} />

            {/* Products / Meals */}
            <Route path="menu-meals">
              <Route index path="list" element={
                <ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN]}>
                  <MealsList />
                </ProtectedRoute>
              } />
              <Route path=":slug" element={
                <ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN]}>
                  <MealDetail />
                </ProtectedRoute>
              } />
              <Route path="edit/:slug" element={
                <ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN]}>
                  <MealEdit />
                </ProtectedRoute>
              } />
              <Route path="create" element={
                <ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN]}>
                  <MealCreate />
                </ProtectedRoute>
              } />
            </Route>

            {/* Ingredients */}
            <Route path="ingredients">
              <Route index path="list" element={
                <ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN]}>
                  <IngredientsList />
                </ProtectedRoute>
              } />
              <Route path=":id" element={
                <ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN]}>
                  <IngredientDetail />
                </ProtectedRoute>
              } />
              <Route path="edit/:id" element={
                <ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN]}>
                  <IngredientEdit />
                </ProtectedRoute>
              } />
              <Route path="create" element={
                <ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN]}>
                  <IngredientCreate />
                </ProtectedRoute>
              } />
            </Route>
          </Routes>
        </DashboardLayout>
      </AppProvider >
    </>
  )
}

export default Layout

