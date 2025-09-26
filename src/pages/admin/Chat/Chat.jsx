
import React, { Suspense, lazy, useMemo } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// Lazy load EmployeeChat component to improve LCP
const EmployeeChat = lazy(() => import('~/components/AIChat/chatEmployee/EmployeeMessenger'))

// Loading skeleton component
const ChatSkeleton = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  
  return (
    <Box sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: 'background.paper',
      borderRadius: 2,
      overflow: 'hidden'
    }}>
      {/* Header skeleton */}
      <Box sx={{
        p: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper'
      }}>
        <Skeleton variant="text" width="60%" height={32} />
        <Skeleton variant="text" width="40%" height={24} sx={{ mt: 1 }} />
      </Box>
      
      {/* Content skeleton */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex',
        p: 2,
        gap: 2
      }}>
        {/* Sidebar skeleton */}
        <Box sx={{ 
          width: isMobile ? '100%' : 320,
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}>
          {[...Array(8)].map((_, index) => (
            <Box key={index} sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              p: 1 
            }}>
              <Skeleton variant="circular" width={48} height={48} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="70%" height={20} />
                <Skeleton variant="text" width="50%" height={16} />
              </Box>
            </Box>
          ))}
        </Box>
        
        {/* Chat area skeleton */}
        {!isMobile && (
          <Box sx={{ 
            flex: 1, 
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}>
            <Box sx={{ 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}>
              {[...Array(5)].map((_, index) => (
                <Box key={index} sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  p: 1,
                  justifyContent: index % 2 === 0 ? 'flex-start' : 'flex-end'
                }}>
                  <Skeleton 
                    variant="rounded" 
                    width={index % 2 === 0 ? '60%' : '40%'} 
                    height={60} 
                  />
                </Box>
              ))}
            </Box>
            
            {/* Input skeleton */}
            <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Skeleton variant="rounded" width="100%" height={56} />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default function Chat() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // Memoized styles to avoid re-calculation
  const containerStyles = useMemo(() => ({
    p: { xs: 1, sm: 2, md: 3 },
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  }), [])

  const chatContainerStyles = useMemo(() => ({
    flex: 1, 
    minHeight: 0,
    // On mobile, chat takes full screen
    height: isMobile ? 'calc(100vh - 32px)' : 'auto'
  }), [isMobile])

  return (
    <Box sx={{ ...containerStyles, bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Chat component takes all remaining space */}
      <Box sx={chatContainerStyles}>
        <Suspense fallback={<ChatSkeleton />}>
          <EmployeeChat />
        </Suspense>
      </Box>
    </Box>
  )
}