import { useState } from 'react'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import ResetPwForm from './ResetPwForm'
import OtpForm from './OtpForm'
import AccountForm from './AccountForm'
import { useNavigate } from 'react-router-dom'
import theme from '~/theme'
const steps = ['Account Verify', 'OTP Verify', 'New Password']

const ResetPw = () => {
  const [activeStep, setActiveStep] = useState(0)
  const [email, setEmail] = useState(null)
  const navigate = useNavigate()

  const handleNext = (data) => {
    setEmail(data)
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  // const handleBack = () => {
  //   setActiveStep((prevActiveStep) => prevActiveStep - 1)
  // }

  const handleSubmit = () => {
    navigate('/login?passwordReseted=true')
  }

  const getStepContent = (step) => {
    switch (step) {
    case 0:
      return <AccountForm onNext={handleNext} />
    case 1:
      return <OtpForm onNext={handleNext} email={email} />
    case 2:
      return <ResetPwForm onSubmit={handleSubmit} email={email} />
    default:
      return 'Unknown step'
    }
  }

  return (
    <Container maxWidth="md" sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2
    }}>
      <Box sx={{
        fontSize: '1.5rem',
        width: { xs: '100%', sm: '85%', md: '70%' }
      }}>
        <Stepper
          activeStep={activeStep}
          sx={{
            '& .MuiStepConnector-line': {
              borderColor: theme.palette.primary.main,
              borderTopWidth: 2,
              borderRadius: '2px'
            },
            '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
              borderColor: theme.palette.success.main,
              borderTopWidth: 2
            },
            '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': {
              borderColor: theme.palette.primary.dark,
              borderTopWidth: 2
            }
          }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>
                <Box sx={{
                  border: '1px solid',
                  backgroundColor: 'white',
                  padding: '0.5rem',
                  borderRadius: '0.5rem'
                }}>
                  {label}
                </Box>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
          {getStepContent(activeStep)}
        </Box>
      </Box>
    </Container>
  )
}

export default ResetPw