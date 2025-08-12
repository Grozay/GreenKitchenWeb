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
      toast.error(`Không thể tạo đơn thanh toán: ${error.message}`)
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
      toast.success('Thanh toán PayPal thành công!')
      onSuccess({
        id: data.orderID,
        status: 'COMPLETED',
        details: captureResult
      })

    } catch (error) {
      toast.error(`Thanh toán thất bại: ${error.message}`)
      onError(error)
    } finally {
      setLoading(false)
    }
  }

  const onCancel = () => {
    toast.info('Thanh toán đã được hủy')
    onError(new Error('Payment cancelled'))
  }

  const onErrorHandler = (err) => {
    toast.error(`Lỗi PayPal: ${err.message || 'Có lỗi xảy ra với PayPal'}`)
    onError(err)
  }

  if (isPending || loading) {
    return (
      <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
        <CircularProgress sx={{ mb: 2 }} />
        <Typography>Đang tải PayPal...</Typography>
      </Paper>
    )
  }

  if (isRejected || !paypalClientId) {
    return (
      <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Alert severity="error">
          <Typography>Không thể tải PayPal. Vui lòng thử lại sau.</Typography>
        </Alert>
      </Paper>
    )
  }

  return (
    <Paper sx={{ p: 3, borderRadius: 2, position: 'relative' }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        💰 Thanh toán qua PayPal
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Số tiền gốc:</strong> {orderData.totalAmount?.toLocaleString('vi-VN')}₫
          <br />
          <strong>Thanh toán PayPal:</strong> ${convertToUSD(orderData.totalAmount)} USD
          <br />
          <Typography variant="caption" color="text.secondary">
            Tỷ giá: 1 USD = {exchangeRate.toLocaleString('vi-VN')} VND
          </Typography>
        </Typography>
      </Alert>

      <Alert severity="success" sx={{ mb: 2 }}>
        <Typography variant="body2">
          <strong>🧪 SANDBOX MODE - Chỉ để test!</strong>
          <br />
          • Đăng nhập PayPal với test account
          <br />
          • Hoặc test card: 4111111111111111, 12/25, 123
          <br />
          • <strong>Lưu ý:</strong> Không đóng popup cho đến khi hoàn thành!
        </Typography>
      </Alert>

      <Box sx={{ minHeight: 200 }}>
        {/* Debug info */}
        {import.meta.env.DEV && (
          <Alert severity="info" sx={{ mb: 2, fontSize: '0.8rem' }}>
            PayPal Client ID: {paypalClientId?.slice(0, 10)}...
            <br />
            Exchange Rate: {exchangeRate}
            <br />
            Amount: {orderData.totalAmount} VND = ${convertToUSD(orderData.totalAmount)} USD
          </Alert>
        )}

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
