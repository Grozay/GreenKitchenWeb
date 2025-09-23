import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'
import { fetchCustomerDetails } from '~/apis'
import Pagination from '@mui/material/Pagination'

function CustomerDetails() {
  const { email } = useParams();
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [orderPage, setOrderPage] = useState(1)
  const [pointPage, setPointPage] = useState(1)
  const pageSize = 5

  useEffect(() => {
    const load = async () => {
      if (!email) { setError('Email is missing'); setLoading(false); return }
      try {
        const res = await fetchCustomerDetails(email)
        setData(res)
      } catch {
        setError('Failed to load customer')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [email])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress size={48} />
      </Box>
    )
  }

  if (error || !data) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Typography color="error" sx={{ mb: 2 }}>{error || 'Customer not found'}</Typography>
        <Button variant="text" onClick={() => navigate('/management/customers')}>← Back to Customers</Button>
      </Container>
    )
  }

  const fullName = data.fullName || `${data.firstName || ''} ${data.lastName || ''}`.trim()

  const getStatusColor = (status) => {
    switch (status) {
    case 'PENDING': return 'warning'
    case 'CONFIRMED': return 'info'
    case 'PREPARING': return 'primary'
    case 'SHIPPING': return 'secondary'
    case 'DELIVERED': return 'success'
    case 'CANCELLED': return 'error'
    default: return 'default'
    }
  }

  const sortedOrders = Array.isArray(data.orders)
    ? [...data.orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    : []
  const pagedOrders = sortedOrders.slice((orderPage - 1) * pageSize, orderPage * pageSize)
  const ordersTotalPages = Math.max(1, Math.ceil((sortedOrders.length || 0) / pageSize))

  const sortedPoints = Array.isArray(data.pointHistories)
    ? [...data.pointHistories].sort((a, b) => new Date(b.earnedAt) - new Date(a.earnedAt))
    : []
  const pagedPoints = sortedPoints.slice((pointPage - 1) * pageSize, pointPage * pageSize)
  const pointsTotalPages = Math.max(1, Math.ceil((sortedPoints.length || 0) / pageSize))

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Button variant="text" onClick={() => navigate('/management/customers')}>← Back to Customers</Button>

      {/* Header */}
      <Card elevation={2} sx={{ mb: 2, background: 'linear-gradient(135deg, #4f46e5 0%, #22c55e 100%)', color: 'white' }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar src={data.avatar} sx={{ width: 72, height: 72 }}>
            {fullName?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>{fullName}</Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>{data.email}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, flexWrap: 'wrap' }}>
              {data.gender && <Chip label={data.gender} size="small" />}
              {data.isActive !== undefined && (
                <Chip label={data.isActive ? 'Active' : 'Inactive'} size="small" color={data.isActive ? 'success' : 'default'} variant={data.isActive ? 'filled' : 'outlined'} />
              )}
              {data.oauthProvider && <Chip label={`OAuth: ${data.oauthProvider}`} size="small" />}
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        {/* Membership */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderTop: '4px solid #22c55e' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Membership</Typography>
              {data.membership ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Tier</Typography>
                    <Chip label={data.membership.currentTier} color="primary" size="small" sx={{ fontWeight: 700 }} />
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Available Points</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{data.membership.availablePoints}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Total Earned</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{data.membership.totalPointsEarned}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Total Used</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{data.membership.totalPointsUsed}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Spent (6 months)</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.membership.totalSpentLast6Months || 0)}</Typography>
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">No membership</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Basic Info */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ borderTop: '4px solid #3b82f6' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Basic Information</Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">Full Name</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{fullName || '-'}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">Phone</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{data.phone || '-'}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">Birth Date</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{data.birthDate || '-'}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">Joined</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{data.createdAt ? new Date(data.createdAt).toLocaleString() : '-'}</Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body2" color="text.secondary">OAuth</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{data.isOauthUser ? `Yes (${data.oauthProvider})` : 'No'}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Orders */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderTop: '4px solid #8b5cf6' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Recent Orders</Typography>
              {Array.isArray(data.orders) && data.orders.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {pagedOrders.map((o) => (
                    <Box key={o.id} sx={{ display: 'flex', justifyContent: 'space-between', p: 1.5, border: '1px solid #eee', borderRadius: 1, bgcolor: '#fafafa' }}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>#{o.orderCode}</Typography>
                        <Typography variant="caption" color="text.secondary">{new Date(o.createdAt).toLocaleString()}</Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Chip label={o.status} size="small" color={getStatusColor(o.status)} sx={{ fontWeight: 700, mr: 1 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(o.totalAmount || 0)}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <Pagination
                      count={ordersTotalPages}
                      page={orderPage}
                      onChange={(e, v) => setOrderPage(v)}
                      color="primary"
                      size="small"
                      shape="rounded"
                    />
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">No orders</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Point History */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderTop: '4px solid #f59e0b' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Point History</Typography>
              {Array.isArray(data.pointHistories) && data.pointHistories.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {pagedPoints.map(ph => (
                    <Box key={ph.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, border: '1px solid #eee', borderRadius: 1, bgcolor: '#fffef7' }}>
                      <Box>
                        <Chip
                          label={ph.transactionType}
                          size="small"
                          color={ph.transactionType === 'EARNED' ? 'success' : 'warning'}
                          sx={{ fontWeight: 700, mb: 0.5 }}
                        />
                        <Typography variant="caption" color="text.secondary">{ph.description}</Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {ph.pointsEarned}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">{new Date(ph.earnedAt).toLocaleString()}</Typography>
                      </Box>
                    </Box>
                  ))}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <Pagination
                      count={pointsTotalPages}
                      page={pointPage}
                      onChange={(e, v) => setPointPage(v)}
                      color="primary"
                      size="small"
                      shape="rounded"
                    />
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">No point history</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}

export default CustomerDetails