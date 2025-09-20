
import React, { useCallback, useMemo, memo } from 'react'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import PersonIcon from '@mui/icons-material/Person'
import dayjs from 'dayjs'

const ConversationItem = memo(({ conversation, isSelected, onSelect, isPending = false }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // Memoized format time function
  const formatTime = useCallback((time) => {
    if (!time) return ''
    
    const now = dayjs()
    const messageTime = dayjs(time)
    
    if (now.isSame(messageTime, 'day')) {
      return messageTime.format('HH:mm')
    } else if (now.subtract(1, 'day').isSame(messageTime, 'day')) {
      return 'Hôm qua'
    } else {
      return messageTime.format('DD/MM')
    }
  }, [])

  // Memoized status color function
  const getStatusColor = useCallback((status) => {
    switch (status) {
      case 'EMP': return 'success'
      case 'AI': return 'warning'
      case 'WAITING_EMP': return 'info'
      default: return 'default'
    }
  }, [])

  // Memoized computed values
  const customerName = useMemo(() => 
    conversation.customerName || 'Khách hàng', 
    [conversation.customerName]
  )

  const customerPhone = useMemo(() => 
    conversation.customerPhone || 'Không có số điện thoại', 
    [conversation.customerPhone]
  )

  const lastMessage = useMemo(() => 
    conversation.lastMessage || 'Chưa có tin nhắn', 
    [conversation.lastMessage]
  )

  const formattedTime = useMemo(() => 
    formatTime(conversation.lastMessageTime), 
    [conversation.lastMessageTime, formatTime]
  )

  const statusColor = useMemo(() => 
    getStatusColor(conversation.status), 
    [conversation.status, getStatusColor]
  )

  // Memoized styles
  const listItemStyles = useMemo(() => ({
    px: { xs: 1, sm: 1.5, md: 2 },
    py: { xs: 1, sm: 1.25, md: 1.5 },
    borderBottom: '1px solid',
    borderColor: 'divider',
    opacity: isPending ? 0.7 : 1,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      bgcolor: 'action.hover',
      transform: 'translateY(-1px)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    '&.Mui-selected': {
      bgcolor: 'primary.light',
      '&:hover': {
        bgcolor: 'primary.light'
      }
    }
  }), [isPending])

  const avatarContainerStyles = useMemo(() => ({
    minWidth: { xs: 40, sm: 48, md: 56 }
  }), [])

  const avatarStyles = useMemo(() => ({
    width: { xs: 36, sm: 40, md: 48 },
    height: { xs: 36, sm: 40, md: 48 },
    bgcolor: 'primary.main'
  }), [])

  const personIconStyles = useMemo(() => ({
    fontSize: { xs: 18, sm: 20, md: 24 }
  }), [])

  const contentContainerStyles = useMemo(() => ({
    flex: 1, 
    minWidth: 0, 
    ml: 2
  }), [])

  const primaryContentStyles = useMemo(() => ({
    display: 'flex', 
    alignItems: 'center', 
    gap: 1, 
    mb: 0.5
  }), [])

  const customerNameStyles = useMemo(() => ({
    fontWeight: 'bold',
    fontSize: { xs: '0.875rem', sm: '0.875rem', md: '1rem' },
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }), [])

  const timeStyles = useMemo(() => ({
    fontSize: { xs: '0.625rem', sm: '0.75rem' },
    flexShrink: 0
  }), [])

  const secondaryContentStyles = useMemo(() => ({
    // Empty object for now
  }), [])

  const phoneStyles = useMemo(() => ({
    fontSize: { xs: '0.75rem', sm: '0.875rem' },
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    mb: 0.5
  }), [])

  const messageContainerStyles = useMemo(() => ({
    display: 'flex', 
    alignItems: 'center', 
    gap: 1
  }), [])

  const messageStyles = useMemo(() => ({
    fontSize: { xs: '0.75rem', sm: '0.875rem' },
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    flex: 1
  }), [])

  const chipStyles = useMemo(() => ({
    fontSize: { xs: '0.625rem', sm: '0.75rem' },
    height: { xs: 18, sm: 20, md: 24 },
    minWidth: { xs: 40, sm: 50 }
  }), [])

  // Optimized click handler
  const handleClick = useCallback(() => {
    if (!isPending) {
      onSelect()
    }
  }, [onSelect, isPending])

  return (
    <ListItem
      component="button"
      selected={isSelected}
      onClick={handleClick}
      disabled={isPending}
      sx={listItemStyles}
    >
      <ListItemAvatar sx={avatarContainerStyles}>
        <Avatar sx={avatarStyles}>
          <PersonIcon sx={personIconStyles} />
        </Avatar>
      </ListItemAvatar>
      
      <Box sx={contentContainerStyles}>
        {/* Primary content - Customer name and time */}
        <Box sx={primaryContentStyles}>
          <Typography
            variant="subtitle2"
            component="div"
            sx={customerNameStyles}
          >
            {customerName}
          </Typography>
          
          <Typography
            variant="caption"
            component="div"
            color="text.secondary"
            sx={timeStyles}
          >
            {formattedTime}
          </Typography>
        </Box>
        
        {/* Secondary content - Phone, message and status */}
        <Box sx={secondaryContentStyles}>
          <Typography
            variant="body2"
            component="div"
            color="text.secondary"
            sx={phoneStyles}
          >
            {customerPhone}
          </Typography>
          
          <Box sx={messageContainerStyles}>
            <Typography
              variant="body2"
              component="div"
              color="text.primary"
              sx={messageStyles}
            >
              {lastMessage}
            </Typography>
            
            <Chip
              label={conversation.status}
              color={statusColor}
              size={isSmallMobile ? 'small' : 'medium'}
              sx={chipStyles}
            />
          </Box>
        </Box>
      </Box>
    </ListItem>
  )
})

ConversationItem.displayName = 'ConversationItem'

export default ConversationItem