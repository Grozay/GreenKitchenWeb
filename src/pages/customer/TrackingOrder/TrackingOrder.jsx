import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import Fade from '@mui/material/Fade'
import CircularProgress from '@mui/material/CircularProgress'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { useTheme } from '@mui/material/styles'
import SearchIcon from '@mui/icons-material/Search'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { getOrderByCodeAPI } from '~/apis'
import OrderStatusProgress from './components/OrderStatusProgress'
import OrderDetailsCard from './components/OrderDetailsCard'
import OrderItemsList from './components/OrderItemsList'

const TrackingOrder = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [orderId, setOrderId] = useState('')
  const [orderData, setOrderData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchAttempted, setSearchAttempted] = useState(false)

  // Auto-search when orderCode is provided in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const orderCodeFromUrl = urlParams.get('orderCode')
    
    if (orderCodeFromUrl) {
      setOrderId(orderCodeFromUrl)
      // Auto-search with the orderCode from URL
      handleSearchWithCode(orderCodeFromUrl)
    }
  }, [location.search])


  const handleSearchWithCode = async (code) => {
    setLoading(true)
    setError('')
    setSearchAttempted(true)

    try {
      const data = await getOrderByCodeAPI(code)
      setOrderData(data)
    } catch (err) {
      setError('Order not found with this code')
      setOrderData(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!orderId.trim()) {
      setError('Please enter order code')
      return
    }
    await handleSearchWithCode(orderId)
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }

  const resetSearch = () => {
    setOrderId('')
    setOrderData(null)
    setError('')
    setSearchAttempted(false)
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/')}
        sx={{
          color: '#4C082A',
          mb: 2,
          '&:hover': {
            bgcolor: 'rgba(76, 8, 42, 0.1)'
          }
        }}
      >
        Back to home
      </Button>

      <Box textAlign="center" mb={4}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: theme.palette.primary.main,
            mb: 2
          }}
        >
          Track Order
        </Typography>
        {!new URLSearchParams(location.search).get('orderCode') && (
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Enter order code to view status and details
          </Typography>
        )}

        {/* Search Section */}
        {!orderData && (
          <Paper
            elevation={3}
            sx={{
              p: 3,
              maxWidth: 500,
              mx: 'auto',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              borderRadius: 3
            }}
          >
            <Box display="flex" gap={2} alignItems="center">
              <TextField
                fullWidth
                label="Order code"
                placeholder="Enter order code (e.g.: GK-123456789)"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                onKeyDown={handleKeyPress}
                variant="outlined"
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
              <Button
                className='interceptor-loading'
                variant="contained"
                onClick={handleSearch}
                disabled={loading || !orderId.trim()}
                sx={{
                  minWidth: 120,
                  borderRadius: 2,
                  py: 1.5
                }}
              >
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </Box>
          </Paper>
        )}
        {orderData && (
          <Box mt={2} textAlign="right">
            <Button
              variant="outlined"
              size="small"
              onClick={resetSearch}
              sx={{ borderRadius: 2 }}
            >
              Search another order
            </Button>
          </Box>
        )}
      </Box>

      {/* Error Message */}
      {error && (
        <Fade in={!!error}>
          <Box mb={3}>
            <Alert
              severity="error"
              sx={{
                maxWidth: 600,
                mx: 'auto',
                borderRadius: 2
              }}
              onClose={() => setError('')}
            >
              {error}
            </Alert>
          </Box>
        </Fade>
      )}

      {/* No Results Message */}
      {searchAttempted && !orderData && !loading && !error && (
        <Fade in={true}>
          <Card sx={{ maxWidth: 600, mx: 'auto', textAlign: 'center', p: 3 }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Order not found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Please check the order code and try again
              </Typography>
            </CardContent>
          </Card>
        </Fade>
      )}

      {/* Order Results */}
      {orderData && (
        <Fade in={!!orderData}>
          <Box>
            {/* Main Content Layout */}
            <Box
              display="flex"
              gap={3}
              flexDirection={{ xs: 'column', md: 'row', lg: 'row' }}
              alignItems={{ xs: 'stretch', md: 'flex-start', lg: 'flex-start' }}
            >
              {/* Left Column - Order Status Progress (Vertical) */}
              <Box
                order={{ xs: 1, md: 1, lg: 1 }}
              >
                <OrderStatusProgress
                  orderData={orderData}
                />
              </Box>

              {/* Right Column - Order Details & Items */}
              <Box
                flex={1}
                display="flex"
                flexDirection="column"
                gap={3}
                order={{ xs: 2, md: 2, lg: 2 }}
              >
                {/* Order Details Card */}
                <Box order={{ xs: 1, md: 1, lg: 1 }}>
                  <OrderDetailsCard order={orderData} />
                </Box>

                {/* Order Items List */}
                <Box order={{ xs: 2, md: 2, lg: 2 }}>
                  <OrderItemsList order={orderData} />
                </Box>
              </Box>
            </Box>
          </Box>
        </Fade>
      )}
    </Container>
  )
}

export default TrackingOrder
