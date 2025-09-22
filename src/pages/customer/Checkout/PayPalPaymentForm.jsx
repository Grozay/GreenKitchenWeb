import { useState, useEffect } from 'react'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import { toast } from 'react-toastify'
import { getExchangeRateAPI, capturePayPalOrderAPI } from '~/apis'

const PayPalPaymentForm = ({
  orderData,
  onSuccess,
  onError,
  loading: parentLoading
}) => {
  const [{ isPending, isRejected }] = usePayPalScriptReducer()
  const [loading, setLoading] = useState(false)
  const [exchangeRate, setExchangeRate] = useState(26000)
  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID

  // Fetch real-time exchange rate từ backend
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const data = await getExchangeRateAPI()
        if (data.usdToVnd) {
          setExchangeRate(data.usdToVnd)
        }
      } catch {
        // Giữ tỷ giá mặc định nếu API lỗi
      }
    }

    fetchExchangeRate()
  }, [])

  // Convert VND to USD với tỷ giá thực
  const convertToUSD = (vndAmount) => {
    return (vndAmount / exchangeRate).toFixed(2)
  }

  const createOrder = (data, actions) => {
    try {
      // Chuyển đổi VND sang USD
      const usdAmount = convertToUSD(orderData.totalAmount)
      // console.log(`Creating PayPal order: ${orderData.totalAmount} VND = $${usdAmount} USD`)
      // Sử dụng PayPal actions để tạo order trực tiếp
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: usdAmount,
            currency_code: 'USD'
          },
          description: `Green Kitchen Order - ${orderData.orderId}`,
          custom_id: orderData.orderId
        }],
        application_context: {
          shipping_preference: 'NO_SHIPPING',
          user_action: 'PAY_NOW',
          payment_method: {
            payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED'
          }
        }
      })
    } catch (error) {
      // console.error('Error in createOrder:', error)
      toast.error(`Cannot create payment order: ${error.message}`)
    }
  }

  const onApprove = async (data) => {
    try {
      setLoading(true)
      // Thay đổi approach: Gửi orderID về backend để capture
      // Thay vì capture ở frontend (gây lỗi window closed)
      const captureResult = await capturePayPalOrderAPI({
        orderID: data.orderID,
        payerID: data.payerID,
        orderId: orderData.orderId
      })

      // Thành công
      toast.success('Payment successful!')
      onSuccess({
        id: data.orderID,
        status: 'COMPLETED',
        details: captureResult
      })

    } catch (error) {
      toast.error(`Payment failed: ${error.message}`)
      onError(error)
    } finally {
      setLoading(false)
    }
  }

  const onCancel = () => {
    toast.info('Payment has been cancelled')
    onError(new Error('Payment cancelled'))
  }

  const onErrorHandler = (err) => {
    toast.error(`PayPal error: ${err.message || 'An error occurred with PayPal'}`)
    onError(err)
  }

  if (isPending || loading) {
    return (
      <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
        <CircularProgress sx={{ mb: 2 }} />
        <Typography>Loading PayPal...</Typography>
      </Paper>
    )
  }

  if (isRejected || !paypalClientId) {
    return (
      <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Alert severity="error">
          <Typography>Unable to load PayPal. Please try again later.</Typography>
        </Alert>
      </Paper>
    )
  }

  return (
    <Paper sx={{ p: 3, borderRadius: 2, position: 'relative', height: '100%' }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        💰 Pay via PayPal payment gateway
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Original amount:</strong> {orderData.totalAmount?.toLocaleString('vi-VN')}₫
          <br />
          <strong>PayPal payment:</strong> ${convertToUSD(orderData.totalAmount)} USD
          <br />
          <Typography variant="caption" color="text.secondary">
            Exchange rate: 1 USD = {exchangeRate.toLocaleString('vi-VN')} VND
          </Typography>
        </Typography>
      </Alert>


      <Box sx={{ minHeight: 200 }}>
        <PayPalButtons
          style={{
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'paypal',
            height: 45,
            tagline: false
          }}
          fundingSource={undefined}
          forceReRender={[orderData.totalAmount, exchangeRate]}
          createOrder={createOrder}
          onApprove={onApprove}
          onCancel={onCancel}
          onError={onErrorHandler}
          disabled={parentLoading || loading}
        />
      </Box>

      {loading && (
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'rgba(255,255,255,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 2
        }}>
          <CircularProgress />
        </Box>
      )}
    </Paper>
  )
}

export default PayPalPaymentForm
