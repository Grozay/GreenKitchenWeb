import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { fetchRecentOrdersAPI } from '~/apis' // Import từ index.js

const RecentOrderRequest = ({ customBlue, dailyIncome }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecentOrdersAPI().then(res => {
      setOrders(res || [])
    }).catch(err => {
      console.error('Error fetching recent orders:', err)
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
  console.log('🚀 ~ RecentOrderRequest ~ orders:', orders)

  return (
    <Card sx={{ p: 2, boxShadow: 0 }}>
      <Typography fontWeight={700} mb={1} sx={{ color: customBlue }}>Recent Order Request</Typography>
      {orders.length === 0 ? (
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 100,
          bgcolor: '#fafafa',
          borderRadius: 1
        }}>
          <Typography color="textSecondary" fontSize={14}>
            No data available
          </Typography>
        </Box>
      ) : (
        orders.slice(0, 5).map(order => ( // Limit to 5 for display
          <Box key={order.id} display="flex" alignItems="center" mb={1}>
            <Avatar src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=facearea&w=180&h=120" />
            <Box ml={2} flex={1}>
              <Typography fontWeight={700} fontSize={15} sx={{ color: customBlue }}>Order #{order.id}</Typography>
              <Typography sx={{ color: customBlue, fontSize: 13 }}>Customer: {order.customerName}</Typography>
            </Box>
            {/* <Typography fontSize={13} color="textSecondary" mr={2}>{order.customerName}</Typography> */}
            <Typography fontWeight={700} sx={{ color: customBlue }}>
              ${Math.round(order.totalAmount).toLocaleString()}
            </Typography>
            <Typography
              sx={{
                ml: 2,
                color: '#fff',
                bgcolor: customBlue,
                px: 1.5,
                py: 0.5,
                fontSize: 12,
                fontWeight: 600,
                borderRadius: 2,
                display: 'inline-block',
                textAlign: 'center',
                minWidth: 80
              }}
            >
              {order.status}
            </Typography>
          </Box>
        ))
      )}
    </Card>
  )
}

export default RecentOrderRequest