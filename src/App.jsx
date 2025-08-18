
import BlogLayout from '~/pages/customer/Blogs/BlogLayout'
import HomeLayout from '~/pages/customer/Home/HomeLayout'
import { Routes, Route, Navigate } from 'react-router-dom'
import BlogDetail from './pages/customer/Blogs/BlogDetail/BlogDetail'
import MenuLayout from './pages/customer/Menu/MenuLayout'
import MenuDetail from './pages/customer/Menu/MenuDetail/MenuDetail'
import AboutUs from './pages/customer/AboutUs/AboutUs'
import SmartMealLayout from './pages/customer/SmartMeal/SmartMealLayout'
import Auth from './pages/customer/Auth/Auth'
import AccountVerification from './pages/customer/Auth/AccountVerification'
import NotFound from './pages/customer/NotFound/NotFound'
import Profile from './pages/customer/Profile/Profile'
import TrackingOrder from './pages/customer/TrackingOrder/TrackingOrder'
import Chat from './pages/Employee/Chat/Chat'
import { selectCurrentCustomer } from './redux/user/customerSlice'
import { useSelector } from 'react-redux'
import { Outlet, useLocation } from 'react-router-dom'
import Cart from './pages/customer/Cart/CartLayout'
import Checkout from './pages/customer/Checkout/Checkout'
import { toast } from 'react-toastify'
import ChatAi from './pages/customer/ChatPage/ChatPage'
import WeekMealLayout from './pages/customer/WeekMeal/WeekMealLayout'


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

function App() {
  const currentCustomer = useSelector(selectCurrentCustomer)

  return (
    <Routes>
      <Route path="/" element={<HomeLayout />} />
      <Route path="/blogs" element={<BlogLayout />} />
      <Route path="/blogs/:id" element={<BlogDetail />} />
      <Route path="/menu" element={<MenuLayout />} />
      <Route path="/menu/:slug" element={<MenuDetail />} />
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/smart-meal-planner" element={<SmartMealLayout />} />
      <Route path="/week-meal-planner" element={<WeekMealLayout />} />
      {/* <Route path="/calo-calculator" element={<CaloCalculatorLayout />} /> */}
      <Route path="/cart" element={<Cart />} />

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
        <Route path="/profile/tdee-profile" element={<Profile />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/tracking-order" element={<TrackingOrder />} />
      </Route>

      {/* Test Employee Inbox */}
      <Route path="/employee/inbox" element={<Chat />} />

      {/* AI Chat Page */}
      <Route path="/ai-chat" element={<ChatAi />} />

      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>

  )
}

export default App
