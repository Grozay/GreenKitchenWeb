import React, { useState, useMemo, useCallback, memo } from 'react'
import {
  Box,
  Typography,
  List,
  Divider,
  IconButton
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import SearchBar from './SearchBar'
import ConversationItem from './ConversationItem'
import dayjs from 'dayjs'

const Sidebar = memo(({
  conversations,
  selectedConv,
  onSelectConversation,
  isOpen,
  onToggle,
  isPending = false
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // Memoized function để tránh re-creation
  const groupConversationsByDate = useCallback((conversations) => {
    return conversations.reduce((groups, conv) => {
      // Hỗ trợ nhiều định dạng (ISO, dd/MM/yyyy HH:mm, ...)
      let d = dayjs(conv.lastMessageTime, [
        'DD/MM/YYYY HH:mm',
        'DD/MM/YYYY HH:mm:ss',
        'YYYY-MM-DDTHH:mm:ssZ',
        'YYYY-MM-DD HH:mm:ss',
        'HH:mm DD/MM/YYYY',
        dayjs.ISO_8601
      ])
      if (!d.isValid()) d = dayjs(conv.lastMessageTime) // fallback

      const dateStr = d.format('DD/MM/YYYY')
      if (!groups[dateStr]) groups[dateStr] = []
      groups[dateStr].push(conv)
      return groups
    }, {})
  }, [])

  // Filter conversations based on search term
  const filteredConversations = useMemo(() => {
    let list = conversations
    if (searchTerm.trim()) {  
      const term = searchTerm.toLowerCase()
      list = conversations.filter(conv => {
        const name = (conv.customerName || '').toLowerCase()
        const phone = (conv.customerPhone || '').toLowerCase()
        const lastMessage = (conv.lastMessage || '').toLowerCase()
        return name.includes(term) || phone.includes(term) || lastMessage.includes(term)
      })
    }
    // Sort by newest time
    return [...list].sort((a, b) => {
      const timeA = new Date(a.lastMessageTime || 0).getTime()
      const timeB = new Date(b.lastMessageTime || 0).getTime()
      return timeB - timeA
    })
  }, [conversations, searchTerm])

  // Nhóm theo ngày
  const grouped = useMemo(() => groupConversationsByDate(filteredConversations), [filteredConversations, groupConversationsByDate])

  // Memoized styles để tránh re-calculation
  const toggleButtonStyles = useMemo(() => ({
    position: 'fixed',
    top: { xs: 8, sm: 16 },
    left: { xs: 8, sm: 16 },
    zIndex: 1401,
    bgcolor: 'primary.main',
    color: 'white',
    boxShadow: 2,
    display: { xs: 'flex', md: 'flex' },
    width: { xs: 40, sm: 48 },
    height: { xs: 40, sm: 48 }
  }), [])

  const sidebarStyles = useMemo(() => ({
    position: { xs: 'fixed', md: 'static' },
    top: 0,
    left: 0,
    width: { xs: '100vw', md: 320 },
    height: { xs: '100vh', md: '100%' },
    zIndex: 1400,
    bgcolor: 'white',
    boxShadow: { xs: isOpen ? 8 : 0, md: 1 },
    display: { xs: isOpen ? 'flex' : 'none', md: 'flex' },
    flexDirection: 'column',
    minHeight: 0,
    transition: 'all 0.3s cubic-bezier(.4,0,.2,1)',
    borderRadius: { xs: 0, md: '8px 0 0 8px' },
    outline: 'none',
    border: 'none'
  }), [isOpen])

  const headerStyles = useMemo(() => ({
    p: { xs: 1, sm: 1.5, md: 2 },
    pt: { xs: 2, sm: 3, md: 4 },
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    bgcolor: 'primary.main',
    color: 'white',
    borderRadius: { xs: 0, md: '8px 0 0 0' }
  }), [])

  const closeButtonStyles = useMemo(() => ({
    mr: 1,
    color: 'white',
    display: { xs: 'flex', md: 'none' },
    width: { xs: 32, sm: 36, md: 40 },
    height: { xs: 32, sm: 36, md: 40 }
  }), [])

  const searchContainerStyles = useMemo(() => ({
    p: { xs: 1, sm: 1.5, md: 2 }, 
    bgcolor: '#f8fdf8' 
  }), [])

  const conversationsContainerStyles = useMemo(() => ({
    flex: 1, 
    overflowY: 'auto', 
    minHeight: 0,
    px: { xs: 0.5, sm: 1, md: 0 }
  }), [])

  const noConversationsStyles = useMemo(() => ({
    mt: { xs: 3, sm: 4, md: 6 }, 
    p: { xs: 1, sm: 1.5, md: 2 },
    fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }
  }), [])

  const dateHeaderStyles = useMemo(() => ({
    px: { xs: 1, sm: 1.5, md: 2 }, 
    py: { xs: 0.5, sm: 0.75, md: 1 },
    bgcolor: '#f7f7fa',
    fontWeight: 700,
    color: '#666',
    fontSize: { xs: 11, sm: 12, md: 13 },
    borderBottom: '1px solid #eee',
    position: 'sticky', 
    top: 0, 
    zIndex: 1
  }), [])

  // Optimized event handlers
  const handleToggleOpen = useCallback(() => {
    onToggle(true)
  }, [onToggle])

  const handleToggleClose = useCallback(() => {
    onToggle(false)
  }, [onToggle])

  const handleConversationSelect = useCallback((conv) => {
    onSelectConversation(conv)
    if (isMobile) onToggle(false)
  }, [onSelectConversation, isMobile, onToggle])

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value)
  }, [])

  // Memoized conversation items để tránh re-renders
  const conversationItems = useMemo(() => 
    Object.entries(grouped).map(([date, convs]) => (
      <React.Fragment key={date}>
        <Typography sx={dateHeaderStyles}>
          {date}
        </Typography>
        <List sx={{ p: 0 }}>
          {convs.map(conv => (
            <ConversationItem
              key={conv.conversationId}
              conversation={conv}
              isSelected={selectedConv?.conversationId === conv.conversationId}
              onSelect={() => handleConversationSelect(conv)}
              isPending={isPending}
            />
          ))}
        </List>
      </React.Fragment>
    )), [grouped, selectedConv?.conversationId, handleConversationSelect, isPending, dateHeaderStyles]
  )

  // Memoized no conversations message
  const noConversationsMessage = useMemo(() => 
    searchTerm ? 'Không tìm thấy hội thoại nào' : 'Chưa có hội thoại nào',
    [searchTerm]
  )

  return (
    <>
      {/* Toggle hamburger (chỉ hiện trên mobile khi sidebar đóng) */}
      {!isOpen && !isMobile && (
        <IconButton
          onClick={handleToggleOpen}
          sx={toggleButtonStyles}
          aria-label="Mở danh sách hội thoại"
        >
          <MenuIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
        </IconButton>
      )}

      {/* Sidebar */}
      <Box sx={sidebarStyles}>
        {/* Header */}
        <Box sx={headerStyles}>
          {/* Nút đóng sidebar trên mobile */}
          <IconButton
            onClick={handleToggleClose}
            sx={closeButtonStyles}
            aria-label="Đóng danh sách hội thoại"
          >
            <CloseIcon sx={{ fontSize: { xs: 16, sm: 18, md: 20 } }} />
          </IconButton>
          <ChatBubbleOutlineIcon sx={{ fontSize: { xs: 18, sm: 20, md: 24 } }} />
          <Typography 
            variant="h6" 
            fontWeight="bold" 
            color='white' 
            sx={{ 
              flex: 1,
              fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' }
            }}
          >
            Green Kitchen Chat
          </Typography>
        </Box>

        {/* Search */}
        <Box sx={searchContainerStyles}>
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
          />
        </Box>

        <Divider />

        {/* Conversations list */}
        <Box sx={conversationsContainerStyles}>
          {filteredConversations.length === 0 && (
            <Typography
              align="center"
              color="text.secondary"
              sx={noConversationsStyles}
            >
              {noConversationsMessage}
            </Typography>
          )}

          {conversationItems}
        </Box>
      </Box>
    </>
  )
})

Sidebar.displayName = 'Sidebar'

export default Sidebar
