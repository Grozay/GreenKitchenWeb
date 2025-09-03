
import HomeLayout from '~/pages/customer/Home/HomeLayout'
import { Routes, Route, Navigate } from 'react-router-dom'
import MenuLayout from './pages/customer/Menu/MenuLayout'
import MenuDetail from './pages/customer/Menu/MenuDetail/MenuDetail'
import AboutUs from './pages/customer/AboutUs/AboutUs'
import SmartMealLayout from './pages/customer/SmartMeal/SmartMealLayout'
import Auth from './pages/customer/Auth/Auth'
import AccountVerification from './pages/customer/Auth/AccountVerification'
import NotFound from './pages/customer/NotFound/NotFound'
import Profile from './pages/customer/Profile/Profile'
import TrackingOrder from './pages/customer/TrackingOrder/TrackingOrder'
import Chat from './pages/admin/Chat/Chat'
import { selectCurrentCustomer } from './redux/user/customerSlice'
import { selectCurrentEmployee } from './redux/user/employeeSlice'
import { useSelector } from 'react-redux'
import { Outlet, useLocation } from 'react-router-dom'
import Cart from './pages/customer/Cart/CartLayout'
import Checkout from './pages/customer/Checkout/Checkout'
import { toast } from 'react-toastify'
import ChatAi from './pages/customer/ChatPage/ChatPage'
import HistoryChatLayout from './pages/customer/HistoryChat/HistoryChatLayout'
import WeekMealLayout from './pages/customer/WeekMeal/WeekMealLayout'
import AuthAdmin from './pages/admin/AuthAdmin/Auth'
import Layout from './pages/admin/Layout'
import PostLayout from './pages/customer/Posts/PostLayout'
import PostDetails from './pages/customer/Posts/PostDetails'
import { BankTransfer } from './pages/customer/Checkout/BankTransfer'

const ProtectedRoute = ({ user }) => {
  const location = useLocation()
  if (!user) {
    // Hiển thị thông báo cho user biết họ cần đăng nhập
    toast.info('Vui lòng đăng nhập để tiếp tục')

    // Lưu location hiện tại để redirect sau khi login
    return <Navigate to='/login' state={{ from: location }} replace={true} />
  }
  return <Outlet />
}

const ProtectedAdminRoute = ({ user }) => {
  if (!user) {
    return <Navigate to='/management/login' replace={true} />
  }
  return <Outlet />
}

function App() {
  const currentCustomer = useSelector(selectCurrentCustomer)
  const currentEmployee = useSelector(selectCurrentEmployee)

  return (
    <Routes>
      <Route path="/" element={<HomeLayout />} />
      <Route path="/blog" element={<PostLayout />} />
      <Route path="/blog/:slug" element={<PostDetails />} />
      <Route path="/menu" element={<MenuLayout />} />
      <Route path="/menu/:slug" element={<MenuDetail />} />
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/smart-meal-planner" element={<SmartMealLayout />} />
      <Route path="/week-meal-planner" element={<WeekMealLayout />} />
      {/* <Route path="/calo-calculator" element={<CaloCalculatorLayout />} /> */}
      <Route path="/cart" element={<Cart />} />
      <Route path="/bank-transfer" element={<BankTransfer />} />

      {/* Authentication */}
      <Route path="/login" element={<Auth />} />
      <Route path="/login-by-phone" element={<Auth />} />
      <Route path="/register" element={<Auth />} />
      <Route path="/reset-password" element={<Auth />} />
      <Route path="/verify-email" element={<AccountVerification />} />

      {/* Customer Profile */}
      <Route element={<ProtectedRoute user={currentCustomer} />}>
        <Route path="/profile" element={<Navigate to="/profile/overview" replace />} />
        <Route path="/profile/overview" element={<Profile />} />
        <Route path="/profile/account" element={<Profile />} />
        <Route path="/profile/membership" element={<Profile />} />
        <Route path="/profile/order-history" element={<Profile />} />
        <Route path="/profile/order-history/:orderCode" element={<Profile />} />
        <Route path="/profile/tdee-profile" element={<Profile />} />
        <Route path="/profile/feedback" element={<Profile />} />
        <Route path="/profile/store-location" element={<Profile />} />
        <Route path="/profile/policy" element={<Profile />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/tracking-order" element={<TrackingOrder />} />

        {/* History Chat - require customer login */}
        <Route path="/agent" element={<HistoryChatLayout />} />
        <Route path="/agent/:conversationId" element={<HistoryChatLayout />} />
      </Route>

      {/* Test Employee Inbox */}
      <Route path="/employee/inbox" element={<Chat />} />

      {/* AI Chat Page */}
      <Route path="/ai-chat" element={<ChatAi />} />


      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />

      {/* Protect Admin Route */}
      <Route path='/management/login' element={<AuthAdmin />} />
      <Route path='/management/*' element={<ProtectedAdminRoute user={currentEmployee} />}>
        <Route path='*' element={<Layout />} />
      </Route>

    </Routes>

  )
}

export default App
