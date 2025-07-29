import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'

const PasswordStrengthIndicator = ({ password }) => {
  const [strength, setStrength] = useState(0)
  const [label, setLabel] = useState('')
  const [color, setColor] = useState('error')

  useEffect(() => {
    if (!password) {
      setStrength(0)
      setLabel('')
      return
    }

    let score = 0
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password)
    }

    // Calculate strength score
    score = Object.values(checks).filter(Boolean).length

    setStrength((score / 5) * 100)

    // Set label and color based on score
    if (score <= 2) {
      setLabel('Weak')
      setColor('error')
    } else if (score <= 3) {
      setLabel('Fair')
      setColor('warning')
    } else if (score <= 4) {
      setLabel('Good')
      setColor('info')
    } else {
      setLabel('Strong')
      setColor('success')
    }
  }, [password])

  if (!password) return null

  return (
    <Box sx={{ mt: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
        <Typography variant="caption" color="text.secondary">
          Password Strength
        </Typography>
        <Typography variant="caption" color={`${color}.main`} sx={{ fontWeight: 500 }}>
          {label}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={strength}
        color={color}
        sx={{
          height: 4,
          borderRadius: 2,
          backgroundColor: 'grey.200'
        }}
      />
    </Box>
  )
}

export default PasswordStrengthIndicator
