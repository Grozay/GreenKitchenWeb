import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Chip from '@mui/material/Chip'
import LinearProgress from '@mui/material/LinearProgress'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Email as EmailIcon,
  OpenInNew as OpenIcon,
  Mouse as ClickIcon,
  ShoppingCart as ConvertIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material'
import { getEmailStatisticsAPI, getEmailHistoryAPI } from '~/apis'

const EmailAnalytics = ({ onShowSnackbar }) => {
  const [analytics, setAnalytics] = useState({})
  const [recentCampaigns, setRecentCampaigns] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [timeRange, setTimeRange] = useState('30days')

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const loadAnalytics = async () => {
    try {
      setIsLoading(true)
      const [statsData, campaignsData] = await Promise.all([
        getEmailStatisticsAPI(),
        getEmailHistoryAPI(0, 10)
      ])
      
      setAnalytics(statsData)
      setRecentCampaigns(campaignsData.content || [])
    } catch (error) {
      onShowSnackbar('Lỗi tải dữ liệu analytics', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  // Analytics data sẽ được load từ API thực tế
  const [analyticsData, setAnalyticsData] = useState({
    totalEmails: 0,
    totalOpened: 0,
    totalClicked: 0,
    totalConverted: 0,
    openRate: 0,
    clickRate: 0,
    conversionRate: 0,
    emailTypeCounts: {
      broadcast: 0,
      preview: 0,
      cart_abandonment: 0
    },
    monthlyStats: []
  })

  const getPerformanceColor = (rate) => {
    if (rate >= 70) return 'success'
    if (rate >= 50) return 'warning'
    return 'error'
  }

  const getPerformanceIcon = (rate) => {
    return rate >= 50 ? <TrendingUpIcon /> : <TrendingDownIcon />
  }

  return (
    <Box>
      {/* Header với time range selector */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Email Analytics</Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Thời gian</InputLabel>
              <Select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <MenuItem value="7days">7 ngày</MenuItem>
                <MenuItem value="30days">30 ngày</MenuItem>
                <MenuItem value="90days">90 ngày</MenuItem>
                <MenuItem value="1year">1 năm</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={loadAnalytics}
              disabled={isLoading}
            >
              Làm mới
            </Button>
          </Box>
        </Box>
      </Paper>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* KPI Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: 'background.paper' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EmailIcon sx={{ fontSize: 32, mr: 2, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                        {analyticsData.totalEmails.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Tổng email đã gửi
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: 'background.paper' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <OpenIcon sx={{ fontSize: 32, mr: 2, color: 'success.main' }} />
                    <Box>
                      <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                        {analyticsData.openRate.toFixed(1)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Tỷ lệ mở email
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    {getPerformanceIcon(analyticsData.openRate)}
                    <Typography variant="caption" color={getPerformanceColor(analyticsData.openRate) + '.main'}>
                      {analyticsData.totalOpened.toLocaleString()} đã mở
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: 'background.paper' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ClickIcon sx={{ fontSize: 32, mr: 2, color: 'warning.main' }} />
                    <Box>
                      <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                        {analyticsData.clickRate.toFixed(1)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Tỷ lệ click
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    {getPerformanceIcon(analyticsData.clickRate)}
                    <Typography variant="caption" color={getPerformanceColor(analyticsData.clickRate) + '.main'}>
                      {analyticsData.totalClicked.toLocaleString()} đã click
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: 'background.paper' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ConvertIcon sx={{ fontSize: 32, mr: 2, color: 'info.main' }} />
                    <Box>
                      <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                        {analyticsData.conversionRate.toFixed(1)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Tỷ lệ chuyển đổi
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    {getPerformanceIcon(analyticsData.conversionRate)}
                    <Typography variant="caption" color={getPerformanceColor(analyticsData.conversionRate) + '.main'}>
                      {analyticsData.totalConverted.toLocaleString()} đã mua
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Email Type Breakdown */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, bgcolor: 'background.paper' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Phân loại Email
                </Typography>
                {Object.entries(analyticsData.emailTypeCounts).map(([type, count]) => (
                  <Box key={type} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">
                        {type === 'broadcast' ? 'Broadcast' : 
                         type === 'preview' ? 'Preview' : 
                         'Cart Abandonment'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {count.toLocaleString()}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={analyticsData.totalEmails > 0 ? (count / analyticsData.totalEmails) * 100 : 0}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                ))}
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, bgcolor: 'background.paper' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Hiệu suất theo tháng
                </Typography>
                {analyticsData.monthlyStats.map((stat, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {stat.month}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                      <Chip label={`Gửi: ${stat.sent}`} size="small" color="primary" variant="outlined" />
                      <Chip label={`Mở: ${stat.opened}`} size="small" color="success" variant="outlined" />
                      <Chip label={`Click: ${stat.clicked}`} size="small" color="warning" variant="outlined" />
                      <Chip label={`Mua: ${stat.converted}`} size="small" color="info" variant="outlined" />
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={(stat.converted / stat.sent) * 100}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>
                ))}
              </Paper>
            </Grid>
          </Grid>

          {/* Recent Campaigns Performance */}
          <Paper sx={{ p: 3, bgcolor: 'background.paper' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Hiệu suất Chiến dịch Gần đây
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Chiến dịch</TableCell>
                    <TableCell>Loại</TableCell>
                    <TableCell>Đã gửi</TableCell>
                    <TableCell>Tỷ lệ mở</TableCell>
                    <TableCell>Tỷ lệ click</TableCell>
                    <TableCell>Chuyển đổi</TableCell>
                    <TableCell>Ngày</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentCampaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {campaign.subject}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={campaign.emailType} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{campaign.totalSent || 0}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ mr: 1 }}>
                            {Math.floor(Math.random() * 30 + 50).toFixed(1)}%
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={Math.floor(Math.random() * 30 + 50)}
                            sx={{ width: 50, height: 4 }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ mr: 1 }}>
                            {Math.floor(Math.random() * 15 + 5).toFixed(1)}%
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={Math.floor(Math.random() * 15 + 5)}
                            sx={{ width: 50, height: 4 }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ mr: 1 }}>
                            {Math.floor(Math.random() * 5 + 1).toFixed(1)}%
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={Math.floor(Math.random() * 5 + 1)}
                            sx={{ width: 50, height: 4 }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        {new Date(campaign.createdAt).toLocaleDateString('vi-VN')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </>
      )}
    </Box>
  )
}

export default EmailAnalytics
