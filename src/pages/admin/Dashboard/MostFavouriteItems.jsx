import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import CircularProgress from '@mui/material/CircularProgress'
import { fetchMostFavouriteItemsAPI } from '~/apis' // Import từ index.js
import moment from 'moment'

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
    }).catch(err => {
      console.error('Error fetching most favourite items:', err)
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
        {items.length === 0 ? (
          <Grid item size={{ xs: 12 }}>
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 150,
              borderRadius: 2,
            }}>
              <Typography color="textSecondary" fontSize={16}>
                No data available
              </Typography>
            </Box>
          </Grid>
        ) : (
          items.slice(0, 5).map(item => ( // Limit to 5 items
            <Grid key={item.id} item size={{ xs: 12, sm: 6, md: 4 }}>
              <Card sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: 0,
                border: '1px solid #e3f2fd',
                borderRadius: 2,
                height: 220,
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }
              }}>
                <Box sx={{
                  width: 70,
                  height: 70,
                  borderRadius: 2,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: '#f5f5f5',
                  mb: 1
                }}>
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <Typography sx={{ color: '#999', fontSize: 12 }}>No Image</Typography>
                  )}
                </Box>

                <Typography
                  fontWeight={700}
                  sx={{
                    color: customBlue,
                    textAlign: 'center',
                    mb: 0.5,
                    fontSize: '0.9rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    lineHeight: 1.2,
                    minHeight: '2.4rem'
                  }}
                >
                  {item.title}
                </Typography>

                <Typography
                  sx={{
                    color: customBlue,
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    mb: 0.5
                  }}
                >
                  ${Math.round(item.price).toLocaleString()}
                </Typography>

                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  flexWrap: 'wrap'
                }}>
                  <Typography
                    sx={{
                      fontSize: '0.75rem',
                      color: '#666',
                      fontWeight: 500,
                      bgcolor: '#e3f2fd',
                      px: 1,
                      py: 0.25,
                      borderRadius: 1
                    }}
                  >
                    {item.type}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.75rem',
                      color: '#666',
                      fontWeight: 500
                    }}
                  >
                    {item.count} orders
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Card>
  )
}

export default MostFavouriteItems