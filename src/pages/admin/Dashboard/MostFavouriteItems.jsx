import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import CircularProgress from '@mui/material/CircularProgress'
import { fetchMostFavouriteItemsAPI } from '~/apis' // Import từ index.js
import moment from 'moment'

// Function to format currency with comma separators
const formatCurrency = (amount) => {
  const numAmount = Math.round(parseFloat(amount))
  return numAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const MostFavouriteItems = ({ customBlue }) => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState('month') // Default This Month

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value)
  }

  useEffect(() => {
    let from, to
    const now = moment()

    switch (selectedType) {
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

    fetchMostFavouriteItemsAPI(from, to).then(res => {
      setItems(res || [])
    }).catch(() => {
      setItems([])
    }).finally(() => {
      setLoading(false)
    })
  }, [selectedType])

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
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography fontWeight={700} sx={{ color: customBlue }}>Most Favourite Items</Typography>
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
          <MenuItem value="month">This Month</MenuItem>
          <MenuItem value="year">This Year</MenuItem>
          <MenuItem value="lastYear">Last Year</MenuItem>
        </Select>
      </Box>
      <Grid container spacing={2} mt={1}>
        {items.slice(0, 5).map(item => ( // Limit to 5 items
          <Grid key={item.id} item size={{ xs: 12, md: 4 }}>
            <Card sx={{ p: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: 0, border: '1px solid #e3f2fd', minHeight: 150 }}>
              {item.image && <img src={item.image} alt={item.title} style={{ width: 60, height: 60, borderRadius: 8, marginBottom: 1 }} />}
              <Typography fontWeight={700} sx={{ color: customBlue, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.2, mb: 0.5 }}>{item.title}</Typography>
              <Typography sx={{ color: customBlue, fontWeight: 700, mb: 0.5 }}>${formatCurrency(item.price)}</Typography>
              <Typography fontSize={12} color="textSecondary" sx={{ textAlign: 'center' }}>
                {item.type} | Ordered: {item.count}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Card>
  )
}

export default MostFavouriteItems