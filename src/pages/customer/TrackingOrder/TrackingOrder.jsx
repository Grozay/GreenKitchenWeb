import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { selectCurrentLanguage } from '../../../redux/translations/translationSlice'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  const { t } = useTranslation()
  const currentLanguage = useSelector(selectCurrentLanguage)
  const theme = useTheme()
  const navigate = useNavigate()
  const [orderId, setOrderId] = useState('')
  const [orderData, setOrderData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchAttempted, setSearchAttempted] = useState(false)


  const handleSearch = async () => {
    if (!orderId.trim()) {
      setError(t('trackingOrder.errors.pleaseEnterOrderCode'))
      return
    }

    setLoading(true)
    setError('')
    setSearchAttempted(true)

    try {
      // Gọi API thông qua apis/index.js
      const data = await getOrderByCodeAPI(orderId)
      setOrderData(data)
    } catch (err) {
      setError(t('trackingOrder.errors.orderNotFound'))
      setOrderData(null)
    } finally {
      setLoading(false)
    }
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
        {t('trackingOrder.backToHome')}
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
          {t('trackingOrder.title')}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          {t('trackingOrder.description')}
        </Typography>

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
                label={t('trackingOrder.orderCodeLabel')}
                placeholder={t('trackingOrder.orderCodePlaceholder')}
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
                {loading ? t('trackingOrder.searching') : t('trackingOrder.search')}
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
              {t('trackingOrder.searchOtherOrder')}
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
                {t('trackingOrder.orderNotFound')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('trackingOrder.checkOrderCodeAndRetry')}
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
