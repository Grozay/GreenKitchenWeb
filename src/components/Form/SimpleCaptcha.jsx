import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import RefreshIcon from '@mui/icons-material/Refresh'
import { IconButton } from '@mui/material'

const SimpleCaptcha = ({ onVerify, error }) => {
  const [captchaText, setCaptchaText] = useState('')
  const [userInput, setUserInput] = useState('')
  const [isValid, setIsValid] = useState(false)

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'
    let result = ''
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setCaptchaText(result)
    setUserInput('')
    setIsValid(false)
  }

  useEffect(() => {
    generateCaptcha()
  }, [])

  useEffect(() => {
    const valid = userInput.toLowerCase() === captchaText.toLowerCase()
    setIsValid(valid)
    onVerify(valid)
  }, [userInput, captchaText, onVerify])

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
        Security Verification
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Box sx={{
          backgroundColor: '#f5f5f5',
          border: '1px solid #ddd',
          borderRadius: 1,
          padding: '8px 12px',
          fontFamily: 'monospace',
          fontSize: '18px',
          fontWeight: 'bold',
          letterSpacing: '2px',
          minWidth: '100px',
          textAlign: 'center',
          textDecoration: 'line-through',
          color: '#333'
        }}>
          {captchaText}
        </Box>
        <IconButton
          size="small"
          onClick={generateCaptcha}
          title="Refresh CAPTCHA"
        >
          <RefreshIcon />
        </IconButton>
      </Box>
      <TextField
        fullWidth
        size="small"
        placeholder="Enter the characters above"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        error={error}
        helperText={error ? 'Please enter the correct characters' : ''}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: isValid ? '#e8f5e8' : 'inherit'
          }
        }}
      />
    </Box>
  )
}

export default SimpleCaptcha
