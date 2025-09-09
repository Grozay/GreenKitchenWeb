import React, { useState, useMemo, useEffect } from 'react'
import { createTheme } from '@mui/material/styles'
import { AppProvider } from '@toolpad/core/AppProvider'
import { DashboardLayout } from '@toolpad/core/DashboardLayout'
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import DashboardIcon from '@mui/icons-material/Dashboard'
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople'
import AssignmentIcon from '@mui/icons-material/Assignment'
import SettingsIcon from '@mui/icons-material/Settings'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import CampaignIcon from '@mui/icons-material/Campaign'
import ArticleIcon from '@mui/icons-material/Article'
import PeopleIcon from '@mui/icons-material/People'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import KitchenIcon from '@mui/icons-material/Kitchen'
import CalendarViewWeekIcon from '@mui/icons-material/CalendarViewWeek'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import PaymentIcon from '@mui/icons-material/Payment'
import Inventory2Icon from '@mui/icons-material/Inventory2'
import AssessmentIcon from '@mui/icons-material/Assessment'
import SecurityIcon from '@mui/icons-material/Security'
import ChatIcon from '@mui/icons-material/Chat'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import StorefrontIcon from '@mui/icons-material/Storefront'
import NotificationsIcon from '@mui/icons-material/Notifications'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentEmployee } from '~/redux/user/employeeSlice'
import { logoutEmployeeApi } from '~/redux/user/employeeSlice'
import { useConfirm } from 'material-ui-confirm'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { API_ROOT } from '~/utils/constants'
import { EMPLOYEE_ROLES } from '~/utils/constants'
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
import MediaIcon from '@mui/icons-material/PermMedia'
import Stores from './Locations/Stores'
import NotAuthorized from './NotAuthorized/NotAuthorized'
import MealDetail from './MenuMeal/MenuMealDetail'
import MealEdit from './MenuMeal/MenuMealEdit'
import IngredientsList from './Ingredient/IngredientList'
import IngredientCreate from './Ingredient/IngredientCreate'
import IngredientDetail from './Ingredient/IngredientDetail'
import IngredientEdit from './Ingredient/IngredientEdit'
import WeekMealList from './WeekMeal/WeekMealList'
import WeekMealCreate from './WeekMeal/WeekMealCreate'
import WeekMealEdit from './WeekMeal/WeekMealEdit'
import Chat from './Chat/Chat'

// Component bảo vệ Route dựa trên vai trò
const ProtectedRoute = ({ allowedRoles, children }) => {
  const currentEmployee = useSelector(selectCurrentEmployee)
  if (!allowedRoles.includes(currentEmployee.role)) {
    return <Navigate to="/management/not-authorized" />
  }
  return children
}

// Custom Navigation
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
      // Notifications
      {
        segment: 'management/notifications',
        title: 'Notifications',
        icon: <NotificationsIcon />,
        action: newOrderCount > 0 ? <Chip label={newOrderCount} color="warning" size="small" /> : null
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
        segment: 'management/menu-meals/list',
        title: 'Menu Meals',
        icon: <RestaurantMenuIcon />
      },
      {
        segment: 'management/ingredients/list',
        title: 'Ingredients',
        icon: <KitchenIcon />
      },
      {
        segment: 'management/week-meals/list',
        title: 'Week Meals',
        icon: <CalendarViewWeekIcon />
      },
      {
        segment: 'management/inbox',
        title: 'Inbox',
        icon: <ChatIcon />,
        action: <Chip label="New" color="success" size="small" />
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
      {
        segment: 'management/media',
        title: 'Media',
        icon: <MediaIcon />
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
        action: newOrderCount > 0 ? <Chip label={newOrderCount} color="primary" size="small" /> : null,
        children: [
          { segment: 'create', title: 'Create Order' },
          { segment: 'list', title: 'Order List' }
        ]
      },
      {
        segment: 'management/notifications',
        title: 'Notifications',
        icon: <NotificationsIcon />,
        action: newOrderCount > 0 ? <Chip label={newOrderCount} color="warning" size="small" /> : null
      },
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
  colorSchemes: { light: true, dark: true },
  components: {
    MuiDrawer: {
      styleOverrides: {
        root: {
          width: '220px !important',
          '& .MuiDrawer-paper': {
            width: '220px !important',
            borderRight: '1px solid #e0e0e0'
          }
        }
      }
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: '0.875rem',
          fontWeight: 500
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          height: '20px',
          fontSize: '0.75rem'
        }
      }
    },
    MuiListSubheader: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          minHeight: '28px'
        }
      }
    }
  }
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
      reconnectDelay: 5000
    })
    client.onConnect = () => {
      client.subscribe('/topic/order/new', (message) => {
        console.log('New order received:', message)
        setNewOrderCount((prev) => prev + 1)
        setShowOrderAlert(true)
        setTimeout(() => {
          setShowOrderAlert(false)
        }, 10000)
      })
    }
    client.activate()
    return () => client.deactivate()
  }, [])

  // Reset notification count when navigating to Orders or Notifications
  useEffect(() => {
    if (location.pathname.startsWith('/management/orders') || location.pathname.startsWith('/management/notifications')) {
      setNewOrderCount(0)
    }
  }, [location.pathname])

  const handleLogout = async () => {
    const { confirmed } = await confirmLogout({
      title: 'Do you want to log out?',
      description: 'This action cannot be undone!',
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
          Bạn có đơn hàng mới
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
          title: <Typography
            variant='h6'
            sx={{
              fontWeight: 600,
              fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' }
            }}>
            Green Kitchen Management
          </Typography>
        }}
      >
        <DashboardLayout disableCollapsibleSidebar>
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
              path="settings"
              element={
                <ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.EMPLOYEE]}>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="customers"
              element={
                <ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN, EMPLOYEE_ROLES.EMPLOYEE]}>
                  <CustomerList />
                </ProtectedRoute>
              }
            />
            <Route path="orders">
              <Route
                index
                element={
                  <ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN]}>
                    <OrderList />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":orderCode"
                element={
                  <ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN]}>
                    <OrderDetails />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route
              path="notifications"
              element={
                <ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN, EMPLOYEE_ROLES.EMPLOYEE]}>
                  <Typography variant="h4" sx={{ p: 3 }}>
                    Notifications
                  </Typography>
                  <Typography sx={{ p: 3 }}>Đây là trang thông báo (chưa triển khai).</Typography>
                </ProtectedRoute>
              }
            />
            <Route path="not-authorized" element={<NotAuthorized />} />
            <Route path="*" element={<NotFound />} />
            {/* Coupons / Promotions */}
            <Route
              path="coupons"
              element={
                <ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN]}>
                  <Coupons />
                </ProtectedRoute>
              }
            />
            {/* Chat */}
            <Route
              path="inbox"
              element={
                <ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN, EMPLOYEE_ROLES.EMPLOYEE]}>
                  <Chat />
                </ProtectedRoute>
              }
            />
            {/* Marketing */}
            <Route
              path="marketing"
              element={
                <ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN]}>
                  <Marketing />
                </ProtectedRoute>
              }
            />
            {/* Blog Posts */}
            <Route path="posts">
              <Route
                index
                element={
                  <ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN]}>
                    <Posts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="list"
                element={
                  <ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN]}>
                    <Posts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="create"
                element={
                  <ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN]}>
                    <PostCreate />
                  </ProtectedRoute>
                }
              />
              <Route
                path="edit/:id"
                element={
                  <ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN]}>
                    <PostCreate />
                  </ProtectedRoute>
                }
              />
            </Route>
            {/* Locations / Stores */}
            <Route
              path="stores"
              element={
                <ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN]}>
                  <Stores />
                </ProtectedRoute>
              }
            />
            {/* Products / Meals */}
            <Route path="menu-meals">
              <Route
                index
                path="list"
                element={
                  <ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN]}>
                    <MealsList />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":slug"
                element={
                  <ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN]}>
                    <MealDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="edit/:slug"
                element={
                  <ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN]}>
                    <MealEdit />
                  </ProtectedRoute>
                }
              />
              <Route
                path="create"
                element={
                  <ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN]}>
                    <MealCreate />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route path="week-meals">
              <Route
                index
                path="list"
                element={
                  <ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN]}>
                    <WeekMealList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="edit/:id"
                element={
                  <ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN]}>
                    <WeekMealEdit />
                  </ProtectedRoute>
                }
              />
              <Route
                path="create"
                element={
                  <ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN]}>
                    <WeekMealCreate />
                  </ProtectedRoute>
                }
              />
            </Route>
            {/* Ingredients */}
            <Route path="ingredients">
              <Route
                index
                path="list"
                element={
                  <ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN]}>
                    <IngredientsList />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":id"
                element={
                  <ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN]}>
                    <IngredientDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="edit/:id"
                element={
                  <ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN]}>
                    <IngredientEdit />
                  </ProtectedRoute>
                }
              />
              <Route
                path="create"
                element={
                  <ProtectedRoute allowedRoles={[EMPLOYEE_ROLES.ADMIN]}>
                    <IngredientCreate />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </DashboardLayout>
      </AppProvider>
    </>
  )
}

export default Layout
