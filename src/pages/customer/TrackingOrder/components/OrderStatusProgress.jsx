import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Chip from '@mui/material/Chip'
import LinearProgress from '@mui/material/LinearProgress'
import Zoom from '@mui/material/Zoom'
import Fade from '@mui/material/Fade'
import { useTheme } from '@mui/material/styles'
import ScheduleIcon from '@mui/icons-material/Schedule'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CancelIcon from '@mui/icons-material/Cancel'
import { ORDER_STATUS } from '~/utils/constants'

const OrderStatusProgress = ({ orderData, orientation = 'vertical' }) => {
  const theme = useTheme()
  const [activeStep, setActiveStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const currentStatus = orderData?.status

  const statusConfig = {
    [ORDER_STATUS.PENDING]: {
      label: 'Pending confirmation',
      icon: <ScheduleIcon />,
      color: '#ff9800',
      bgColor: '#fff3e0',
      description: 'Order is waiting for staff confirmation'
    },
    [ORDER_STATUS.CONFIRMED]: {
      label: 'Confirmed',
      icon: <CheckCircleIcon />,
      color: '#2196f3',
      bgColor: '#e3f2fd',
      description: 'Order has been confirmed and is being prepared'
    },
    [ORDER_STATUS.PREPARING]: {
      label: 'Preparing',
      icon: <RestaurantIcon />,
      color: '#9c27b0',
      bgColor: '#f3e5f5',
      description: 'Kitchen is preparing your food'
    },
    [ORDER_STATUS.SHIPPING]: {
      label: 'Shipping',
      icon: <LocalShippingIcon />,
      color: '#ff5722',
      bgColor: '#fbe9e7',
      description: 'Shipper is on the way to deliver to you'
    },
    [ORDER_STATUS.DELIVERED]: {
      label: 'Delivered',
      icon: <CheckCircleOutlineIcon />,
      color: '#4caf50',
      bgColor: '#e8f5e8',
      description: 'Order has been delivered successfully'
    },
    [ORDER_STATUS.CANCELLED]: {
      label: 'Cancelled',
      icon: <CancelIcon />,
      color: '#f44336',
      bgColor: '#ffebee',
      description: 'Order has been cancelled'
    }
  }

  const steps = [
    ORDER_STATUS.PENDING,
    ORDER_STATUS.CONFIRMED,
    ORDER_STATUS.PREPARING,
    ORDER_STATUS.SHIPPING,
    ORDER_STATUS.DELIVERED
  ]

  useEffect(() => {
    const allSteps = [
      ORDER_STATUS.PENDING,
      ORDER_STATUS.CONFIRMED,
      ORDER_STATUS.PREPARING,
      ORDER_STATUS.SHIPPING,
      ORDER_STATUS.DELIVERED
    ]
    
    if (currentStatus === ORDER_STATUS.CANCELLED) {
      setActiveStep(-1)
      setProgress(0)
      return
    }

    const currentStepIndex = allSteps.indexOf(currentStatus)
    setActiveStep(currentStepIndex)
    
    // Animate progress bar
    const targetProgress = ((currentStepIndex + 1) / allSteps.length) * 100
    let currentProgress = 0
    const increment = targetProgress / 30
    
    const timer = setInterval(() => {
      currentProgress += increment
      if (currentProgress >= targetProgress) {
        currentProgress = targetProgress
        clearInterval(timer)
      }
      setProgress(currentProgress)
    }, 50)

    return () => clearInterval(timer)
  }, [currentStatus])

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const currentConfig = statusConfig[currentStatus]

  return (
    <Paper
      elevation={4}
      sx={{
        p: orientation === 'vertical' ? 3 : 4,
        borderRadius: 3,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        border: `2px solid ${currentConfig?.color}20`,
        height: orientation === 'vertical' ? 'fit-content' : 'auto',
        minHeight: orientation === 'vertical' ? '500px' : 'auto'
      }}
    >
      {/* Header */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
          Order Status
        </Typography>
        
        <Zoom in={true} timeout={500}>
          <Chip
            icon={currentConfig?.icon}
            label={currentConfig?.label}
            sx={{
              px: 2,
              py: 1,
              fontSize: '1.1rem',
              fontWeight: 600,
              color: currentConfig?.color,
              backgroundColor: currentConfig?.bgColor,
              border: `2px solid ${currentConfig?.color}40`,
              '& .MuiChip-icon': {
                color: currentConfig?.color
              }
            }}
          />
        </Zoom>

        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mt: 2, fontStyle: 'italic' }}
        >
          {currentConfig?.description}
        </Typography>
      </Box>

      {/* Progress Bar */}
      {currentStatus !== ORDER_STATUS.CANCELLED && (
        <Box mb={4}>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2" color="text.secondary">
              Progress
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {Math.round(progress)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                backgroundColor: currentConfig?.color,
                borderRadius: 4
              }
            }}
          />
        </Box>
      )}

      {/* Status Timeline */}
      {currentStatus !== ORDER_STATUS.CANCELLED ? (
        <Stepper
          activeStep={activeStep}
          orientation={orientation}
          sx={{
            mb: orientation === 'horizontal' ? 3 : 0,
            '& .MuiStepConnector-root': {
              ...(orientation === 'vertical' && {
                marginLeft: '12px',
                minHeight: '40px'
              })
            }
          }}
        >
          {steps.map((status, index) => {
            const config = statusConfig[status]
            const isActive = index === activeStep
            const isCompleted = index < activeStep
            let time = null
            if (status === ORDER_STATUS.PENDING && orderData.createdAt) time = orderData.createdAt
            if (status === ORDER_STATUS.CONFIRMED && (orderData.confirmedAt || orderData.confirmAt)) time = orderData.confirmedAt || orderData.confirmAt
            if (status === ORDER_STATUS.PREPARING && orderData.preparingAt) time = orderData.preparingAt
            if (status === ORDER_STATUS.SHIPPING && orderData.shippingAt) time = orderData.shippingAt
            if (status === ORDER_STATUS.DELIVERED && orderData.deliveredAt) time = orderData.deliveredAt
            return (
              <Step key={status} completed={isCompleted}>
                <StepLabel
                  icon={
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: isCompleted || isActive ? config.color : '#e0e0e0',
                        color: 'white',
                        transition: 'all 0.3s ease',
                        transform: isActive ? 'scale(1.1)' : 'scale(1)',
                        boxShadow: isActive ? `0 4px 12px ${config.color}40` : 'none'
                      }}
                    >
                      {config.icon}
                    </Box>
                  }
                  sx={{
                    '& .MuiStepLabel-label': {
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? config.color : 'text.secondary',
                      mt: 1
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span>{config.label}</span>
                    {time && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                        {formatDate(time)}
                      </Typography>
                    )}
                  </Box>
                </StepLabel>
              </Step>
            )
          })}
        </Stepper>
      ) : (
        <Fade in={true}>
          <Box textAlign="center" py={2}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: currentConfig.color,
                color: 'white',
                mx: 'auto',
                mb: 2
              }}
            >
              {currentConfig.icon}
            </Box>
            <Typography variant="h6" sx={{ color: currentConfig.color, fontWeight: 600 }}>
              {currentConfig.label}
            </Typography>
          </Box>
        </Fade>
      )}

      {/* Timestamps */}
      <Box 
        display="flex" 
        justifyContent="space-between" 
        flexDirection={{ xs: 'column', sm: 'row' }}
        gap={2}
        mt={3}
        sx={{
          p: 2,
          backgroundColor: '#f5f5f5',
          borderRadius: 2
        }}
      >
        <Box textAlign={{ xs: 'center', sm: 'left' }}>
          <Typography variant="caption" color="text.secondary">
            Order time
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {formatDate(orderData.createdAt)}
          </Typography>
        </Box>
        <Box textAlign={{ xs: 'center', sm: 'right' }}>
          <Typography variant="caption" color="text.secondary">
            Last updated
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {formatDate(orderData.updatedAt)}
          </Typography>
        </Box>
      </Box>
    </Paper>
  )
}

export default OrderStatusProgress
