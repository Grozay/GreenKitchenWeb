import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { fetchWeeklyTrendingMenusAPI } from '~/apis' // Đổi import
import moment from 'moment'
import { useNavigate } from 'react-router-dom' // Thêm import

const WeeklyTrendingMenus = ({ customBlue }) => {
  const [menus, setMenus] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate() // Thêm navigate

  useEffect(() => {
    const today = moment().format('YYYY-MM-DD')
    fetchWeeklyTrendingMenusAPI(today).then(res => { // Đổi call
      setMenus(res || [])
    }).catch(err => {
      console.error('Error fetching weekly trending menus:', err)
      setMenus([])
    }).finally(() => {
      setLoading(false)
    })
  }, [])

  const handleView = (slug) => {
    navigate(`/management/menu-meals/${slug}`) // Navigate với slug
  }

  if (loading) {
    return (
      <Card sx={{ p: 2, boxShadow: 0, minHeight: 220 }}>
        <Typography fontWeight={700} mb={1} sx={{ color: customBlue }}>Weekly Trending Menus</Typography> {/* Đổi title */}
        <Box display="flex" justifyContent="center" alignItems="center" height={150}>
          <CircularProgress sx={{ color: customBlue }} />
        </Box>
      </Card>
    )
  }

  return (
    <Card sx={{ p: 2, boxShadow: 0 }}>
      <Typography fontWeight={700} mb={1} sx={{ color: customBlue }}>Weekly Trending Menus</Typography>
      {menus.length === 0 ? (
        <Typography color="textSecondary" fontSize={13}>No trending menus for this week.</Typography> // Đổi message
      ) : (
        menus.slice(0, 5).map(menu => ( // Limit to 5
          <Box key={menu.id} display="flex" alignItems="center" mb={1}>
            {menu.image && <Avatar src={menu.image} />}
            <Box ml={2} flex={1}>
              <Typography fontWeight={700} fontSize={15} sx={{ color: customBlue }}>{menu.title}</Typography>
              <Typography color="textSecondary" fontSize={13}>Order {menu.count}x</Typography>
            </Box>
            <Typography fontWeight={700} sx={{ color: customBlue }}>${menu.price.toFixed(2)}</Typography>
            <Button size="small" sx={{ ml: 2, color: '#fff', bgcolor: customBlue, px: 2, fontSize: 13, borderRadius: 2, '&:hover': { bgcolor: '#1976d2' } }} onClick={() => handleView(menu.slug)}>View</Button> {/* Thêm onClick */}
          </Box>
        ))
      )}
    </Card>
  )
}

export default WeeklyTrendingMenus