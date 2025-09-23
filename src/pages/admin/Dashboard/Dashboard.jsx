import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import OverviewDashboard from './OverviewDashboard'
import SalesFiguresDashboard from './SalesFiguresDashboard'
import OrderSuccessRate from './OrderSuccessRate'
import MostFavouriteItems from './MostFavouriteItems'
import RecentOrderRequest from './RecentOrderRequest'
import DailyTrendingMenus from './WeekTrendingMenus'

const customBlue = '#2196F3'

export default function Dashboard() {
  return (
    <Box sx={{ p: 3, minHeight: '100vh' }}>
      {/* Overview */}
      <Paper elevation={3} sx={{ borderRadius: 3, p: 2, mb: 2 }}>
        <OverviewDashboard customBlue={customBlue} />
      </Paper>

      {/* Sales Figures & Popular Food */}
      <Paper elevation={3} sx={{ borderRadius: 3, p: 2, mb: 2 }}>
        <SalesFiguresDashboard customBlue={customBlue} />
      </Paper>

      {/* Daily Target Income & Most Favourite Items */}
      <Grid container spacing={2} mb={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={3} sx={{ borderRadius: 3, p: 2, height: '100%' }}>
            <OrderSuccessRate customBlue={customBlue} />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={3} sx={{ borderRadius: 3, p: 2, height: '100%' }}>
            <MostFavouriteItems customBlue={customBlue} />
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Order Request & Daily Trending Menus */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={3} sx={{ borderRadius: 3, p: 2, height: '100%' }}>
            <RecentOrderRequest customBlue={customBlue} />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={3} sx={{ borderRadius: 3, p: 2, height: '100%' }}>
            <DailyTrendingMenus customBlue={customBlue} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}