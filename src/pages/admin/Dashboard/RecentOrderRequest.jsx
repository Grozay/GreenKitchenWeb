import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import CircularProgress from '@mui/material/CircularProgress'
import { fetchRecentOrdersAPI } from '~/apis' // Import từ index.js

// Function to format currency with thousand separators
const formatCurrency = (amount) => {
  // Convert to number and round to remove decimals if they're .00
  const numAmount = Math.round(amount)
  return numAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

const RecentOrderRequest = ({ customBlue }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecentOrdersAPI().then(res => {
      setOrders(res || [])
    }).catch(() => {
      setOrders([])
    }).finally(() => {
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <Card sx={{ p: 2, boxShadow: 0, minHeight: 220 }}>
        <Typography fontWeight={700} mb={1} sx={{ color: customBlue }}>Recent Order Request</Typography>
        <Box display="flex" justifyContent="center" alignItems="center" height={150}>
          <CircularProgress sx={{ color: customBlue }} />
        </Box>
      </Card>
    )
  }

  return (
    <Card sx={{ p: 2, boxShadow: 0 }}>
      <Typography fontWeight={700} mb={1} sx={{ color: customBlue }}>Recent Order Request</Typography>
      {orders.slice(0, 5).map(order => ( // Limit to 5 for display
        <Box key={order.id} display="flex" alignItems="center" mb={1}>
          <Avatar src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=facearea&w=180&h=120" />
          <Box ml={2} flex={1}>
            <Typography fontWeight={700} fontSize={15} sx={{ color: customBlue }}>Order #{order.id}</Typography>
            <Typography sx={{ color: customBlue, fontSize: 13 }}>Customer: {order.customerName}</Typography>
          </Box>
          {/* <Typography fontSize={13} color="textSecondary" mr={2}>{order.customerName}</Typography> */}
          <Typography fontWeight={700} sx={{ color: customBlue }}>
            ${formatCurrency(order.totalAmount)}
          </Typography>
          <Box size="small" sx={{ ml: 2, color: '#fff', bgcolor: customBlue, p: 1, fontSize: 13, borderRadius: 2, '&:hover': { bgcolor: '#1976d2' } }}>
            {order.status}
          </Box>
        </Box>
      ))}
    </Card>
  )
}

export default RecentOrderRequest