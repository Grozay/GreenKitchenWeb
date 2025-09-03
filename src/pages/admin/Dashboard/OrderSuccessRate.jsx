import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { fetchOrderSuccessRateAPI } from '~/apis' // Import từ index.js
import moment from 'moment'

const OrderSuccessRate = ({ customBlue }) => {
  const [successRate, setSuccessRate] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState('month') // Default This Month

  // const targetRate = 100 // Target 100%

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value)
  }

  useEffect(() => {
    let from, to
    const now = moment()

    switch (selectedType) {
    case 'week':
      from = now.clone().startOf('week').format('YYYY-MM-DD')
      to = now.clone().endOf('week').format('YYYY-MM-DD')
      break
    case 'month':
      from = now.clone().startOf('month').format('YYYY-MM-DD')
      to = now.clone().endOf('month').format('YYYY-MM-DD')
      break
    case 'year':
      from = now.clone().startOf('year').format('YYYY-MM-DD')
      to = now.clone().endOf('year').format('YYYY-MM-DD')
      break
    case 'lastYear':
      from = now.clone().subtract(1, 'year').startOf('year').format('YYYY-MM-DD')
      to = now.clone().subtract(1, 'year').endOf('year').format('YYYY-MM-DD')
      break
    default:
      from = now.clone().startOf('month').format('YYYY-MM-DD')
      to = now.clone().endOf('month').format('YYYY-MM-DD')
    }

    fetchOrderSuccessRateAPI(from, to).then(res => {
      setSuccessRate(res?.successRate || 0)
    }).catch(err => {
      console.error('Error fetching success rate:', err)
      setSuccessRate(0)
    }).finally(() => {
      setLoading(false)
    })
  }, [selectedType]) // Re-fetch khi selectedType thay đổi

  const percentage = Math.min(Math.round(successRate), 100) // % success rate, max 100%

  if (loading) {
    return (
      <Card sx={{ p: 2, minHeight: 220, boxShadow: 0 }}>
        <Box display="flex" justifyContent="center" alignItems="center" height={200}>
          <CircularProgress sx={{ color: customBlue }} />
        </Box>
      </Card>
    )
  }

  return (
    <Card sx={{ p: 2, minHeight: 220, boxShadow: 0 }}>
      <Box display="flex" justifyContent="space-between" alignItems="start">
        <Typography fontWeight={700} sx={{ color: customBlue }}>Order Success Rate</Typography>
        <Select
          value={selectedType}
          onChange={handleTypeChange}
          size="small"
          sx={{
            borderRadius: 2,
            fontSize: 12,
            height: 40
          }}
        >
          <MenuItem value="week">This Week</MenuItem>
          <MenuItem value="month">This Month</MenuItem>
          <MenuItem value="year">This Year</MenuItem>
          <MenuItem value="lastYear">Last Year</MenuItem>
        </Select>
      </Box>
      <Box display="flex" alignItems="center" flexDirection="column" mt={5}>
        <Box position="relative" display="inline-flex">
          <CircularProgress
            variant="determinate"
            value={percentage}
            size={200}
            thickness={4.5}
            sx={{ color: customBlue, bgcolor: '#e3f2fd', borderRadius: '50%' }}
          />
          <Box
            top={0}
            left={0}
            bottom={0}
            right={0}
            position="absolute"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="h5" fontWeight={700} sx={{ color: customBlue }}>{percentage}%</Typography>
          </Box>
        </Box>
        {/* <Typography mt={1} fontWeight={700} fontSize={22} sx={{ color: customBlue }}>{successRate.toFixed(1)}%</Typography>
        <Typography color="textSecondary" fontSize={14}>From {targetRate}%</Typography> */}
      </Box>
    </Card>
  )
}

export default OrderSuccessRate