import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import RadioGroup from '@mui/material/RadioGroup'
import Radio from '@mui/material/Radio'
import Paper from '@mui/material/Paper'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import PaymentIcon from '@mui/icons-material/Payment'

const PaymentMethodForm = ({ paymentMethod, setPaymentMethod }) => {
  const handlePaymentChange = (event) => {
    setPaymentMethod(event.target.value)
  }

  const paymentOptions = [
    {
      value: 'cod',
      label: 'Cash on Delivery (COD)',
      description: 'Pay with cash when receiving goods',
      icon: <LocalShippingIcon sx={{ color: '#4C082A', fontSize: 28 }} />
    },
    {
      value: 'paypal',
      label: 'Pay via PayPal',
      description: 'Safe payment via PayPal with card or PayPal account',
      icon: <PaymentIcon sx={{ color: '#0070ba', fontSize: 28 }} />
    }
  ]

  return (
    <Box sx={{
      bgcolor: 'white',
      borderRadius: 5,
      border: '1px solid #e0e0e0',
      overflow: 'hidden',
      mb: 3
    }}>
      {/* Header */}
      <Box sx={{
        bgcolor: '#f8f9fa',
        px: 3,
        py: 2,
        borderBottom: '1px solid #e0e0e0'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c2c2c' }}>
          PAYMENT METHOD
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3 }}>
        <FormControl component="fieldset" sx={{ width: '100%' }}>
          <RadioGroup
            value={paymentMethod}
            onChange={handlePaymentChange}
            sx={{ gap: 2 }}
          >
            {paymentOptions.map((option) => (
              <Paper
                key={option.value}
                elevation={0}
                sx={{
                  border: paymentMethod === option.value ? '2px solid #4C082A' : '1px solid #e0e0e0',
                  borderRadius: 3,
                  p: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#4C082A',
                    boxShadow: '0 2px 8px rgba(76, 8, 42, 0.1)'
                  }
                }}
                onClick={() => setPaymentMethod(option.value)}
              >
                <FormControlLabel
                  value={option.value}
                  control={
                    <Radio
                      sx={{
                        color: '#e0e0e0',
                        '&.Mui-checked': {
                          color: '#4C082A'
                        }
                      }}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 1 }}>
                      {option.icon}
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#2c2c2c' }}>
                          {option.label}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>
                          {option.description}
                        </Typography>
                      </Box>
                    </Box>
                  }
                  sx={{
                    margin: 0,
                    width: '100%',
                    '& .MuiFormControlLabel-label': {
                      width: '100%'
                    }
                  }}
                />
              </Paper>
            ))}
          </RadioGroup>
        </FormControl>

        {/* Thông tin bổ sung cho PayPal */}
        {paymentMethod === 'paypal' && (
          <Box sx={{
            mt: 3,
            p: 2,
            bgcolor: '#f0f8ff',
            borderRadius: 2,
            border: '1px solid #0070ba'
          }}>
            <Typography variant="body2" sx={{ color: '#0070ba', textAlign: 'center' }}>
              💰 Safe payment via PayPal. Supports Visa, Mastercard and PayPal accounts
            </Typography>
          </Box>
        )}

        {paymentMethod === 'cod' && (
          <Box sx={{
            mt: 3,
            p: 2,
            bgcolor: '#f8f9fa',
            borderRadius: 2,
            border: '1px solid #e0e0e0'
          }}>
            <Typography variant="body2" sx={{ color: '#666', textAlign: 'center' }}>
              🚚 Please prepare cash to pay when receiving goods
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default PaymentMethodForm
