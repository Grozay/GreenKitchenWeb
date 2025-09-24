import { useEffect, useState } from 'react'
import moment from 'moment'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import Skeleton from '@mui/material/Skeleton'
import FastfoodIcon from '@mui/icons-material/Fastfood'
import PeopleIcon from '@mui/icons-material/People'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import TrendingUpIcon from '@mui/icons-material/TrendingUp' // Thêm icon tăng
import TrendingDownIcon from '@mui/icons-material/TrendingDown' // Thêm icon giảm
import { fetchDashboardOverviewAPI } from '~/apis'
import CustomDateRangePicker from './RangePicker/CustomDateRangePicker'

const OverviewDashboard = ({ customBlue }) => {
  const [dateRange, setDateRange] = useState([moment('2024-01-01'), moment()])
  const [overview, setOverview] = useState(null)
  const [loading, setLoading] = useState(true)

  const statData = [
    {
      icon: <FastfoodIcon sx={{ color: customBlue }} />,
      label: 'Orders',
      value: overview ? overview.totalOrders.toLocaleString() : '...',
      changePercent: overview?.ordersChangePercent
    },
    {
      icon: <PeopleIcon sx={{ color: customBlue }} />,
      label: 'Customers',
      value: overview ? overview.totalCustomers.toLocaleString() : '...',
      changePercent: overview?.customersChangePercent
    },
    {
      icon: <MenuBookIcon sx={{ color: customBlue }} />,
      label: 'Menu',
      value: overview ? overview.totalMenus.toLocaleString() : '...',
      changePercent: overview?.menusChangePercent
    },
    {
      icon: <AttachMoneyIcon sx={{ color: customBlue }} />,
      label: 'Income',
      value: overview ? `$${Math.round(overview.totalIncome).toLocaleString()}` : '...',
      changePercent: overview?.incomeChangePercent
    }
  ]

  useEffect(() => {
    if (!dateRange || !dateRange[0] || !dateRange[1]) return
    const from = dateRange[0].format('YYYY-MM-DD')
    const to = dateRange[1].format('YYYY-MM-DD')
    setLoading(true)
    fetchDashboardOverviewAPI(from, to)
      .then((res) => {
        setOverview(res)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching overview:', err)
        setLoading(false)
      })
  }, [dateRange])

  if (loading) {
    return (
      <>
        <Box mb={2}>
          <CustomDateRangePicker onDateRangeChange={setDateRange} onQuickSelect={true} />
        </Box>
        <Grid container spacing={2} mb={2}>
          {[1, 2, 3, 4].map((_, idx) => (
            <Grid key={idx} size={{ xs: 12, md: 3 }}>
              <Card sx={{ p: 2, display: 'flex', alignItems: 'center', borderRadius: 5, flexDirection: 'column', boxShadow: 0 }}>
                <Skeleton variant="circular" width={40} height={40} sx={{ mb: 1 }} />
                <Skeleton variant="text" width={60} height={20} />
                <Skeleton variant="text" width={80} height={30} />
                <Box sx={{ width: '100%', mt: 1 }}>
                  <Skeleton variant="rectangular" width="100%" height={6} />
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </>
    )
  }

  return (
    <>
      <Box mb={2}>
        <CustomDateRangePicker onDateRangeChange={setDateRange} onQuickSelect={true} />
      </Box>
      <Grid container spacing={2} mb={2}>
        {statData.map((stat, idx) => (
          <Grid key={stat.label} size={{ xs: 12, md: 3 }}>
            <Card sx={{ p: 2, display: 'flex', alignItems: 'center', borderRadius: 5, flexDirection: 'column', boxShadow: 0 }}>
              <Avatar sx={{ bgcolor: '#e3f2fd', mb: 1 }}>{stat.icon}</Avatar>
              <Typography color="textSecondary" fontWeight={500}>{stat.label}</Typography>
              <Typography variant="h5" fontWeight={700} sx={{ color: customBlue }}>{stat.value}</Typography>
              {stat.changePercent !== null && stat.changePercent !== undefined ? (
                <Box display="flex" alignItems="center" mt={1}>
                  {stat.changePercent !== null && stat.changePercent !== undefined && stat.changePercent > 0 ? (
                    <TrendingUpIcon sx={{ color: 'green', fontSize: 16, mr: 0.5, opacity: 0.7 }} />
                  ) : stat.changePercent !== null && stat.changePercent !== undefined && stat.changePercent < 0 ? (
                    <TrendingDownIcon sx={{ color: 'red', fontSize: 16, mr: 0.5, opacity: 0.7 }} />
                  ) : null}
                  <Typography
                    variant="body2"
                    sx={{
                      color: stat.changePercent !== null && stat.changePercent !== undefined && stat.changePercent > 0 ? 'green' :
                        stat.changePercent !== null && stat.changePercent !== undefined && stat.changePercent < 0 ? 'red' : 'gray',
                      fontWeight: 600,
                      opacity: 0.7 // Giảm opacity để text nhẹ hơn
                    }}
                  >
                    {stat.changePercent !== null && stat.changePercent !== undefined
                      ? (stat.changePercent > 0 ? '+' : '') + stat.changePercent.toFixed(2) + '%'
                      : '0.00%'}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" sx={{ color: 'gray', fontWeight: 600, mt: 1 }}>
                  0.00%
                </Typography>
              )}
              {/* <Box sx={{ width: '100%', mt: 1 }}>
                <LinearProgress
                  sx={{
                    height: 6,
                    borderRadius: 5,
                    bgcolor: '#f8f7fa',
                    '& .MuiLinearProgress-bar': { backgroundColor: customBlue }
                  }}
                  value={60 + idx * 10}
                  variant="determinate"
                />
              </Box> */}
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  )
}

export default OverviewDashboard
