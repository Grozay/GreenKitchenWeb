import React, { useState, useMemo } from 'react'
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
import SearchBar from './SearchBar'
import ConversationItem from './ConversationItem'
import dayjs from 'dayjs'

export default function Sidebar({
  conversations,
  selectedConv,
  onSelectConversation,
  isOpen,
  onToggle
}) {
  const [searchTerm, setSearchTerm] = useState('')

  function groupConversationsByDate(conversations) {
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
  }


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
  const grouped = useMemo(() => groupConversationsByDate(filteredConversations), [filteredConversations])


  return (
    <>
      {/* Toggle hamburger (chỉ hiện trên mobile khi sidebar đóng) */}
      {!isOpen && (
        <IconButton
          onClick={() => onToggle(true)}
          sx={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: 1401,
            bgcolor: 'primary.main',
            color: 'white',
            boxShadow: 2,
            display: { xs: 'flex', md: 'none' }
          }}
          aria-label="Mở danh sách hội thoại"
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Sidebar */}
      <Box
        sx={{
          position: { xs: 'fixed', md: 'static' },
          top: 0,
          left: 0,
          width: { xs: '100vw', md: 320 },
          height: '100vh',
          zIndex: 1400,
          bgcolor: 'white',
          boxShadow: { xs: isOpen ? 8 : 0, md: 1 },
          display: { xs: isOpen ? 'flex' : 'none', md: 'flex' }, // KEY!
          flexDirection: 'column', // KEY!
          minHeight: 0, // KEY!
          transition: 'all 0.3s cubic-bezier(.4,0,.2,1)'
        }}
      >

        {/* Header */}
        <Box sx={{
          p: 2,
          pt: 4,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          bgcolor: 'primary.main',
          color: 'white'
        }}>
          {/* Nút đóng sidebar trên mobile */}
          <IconButton
            onClick={() => onToggle(false)}
            sx={{
              mr: 1,
              color: 'white',
              display: { xs: 'flex', md: 'none' }
            }}
            aria-label="Đóng danh sách hội thoại"
          >
            <CloseIcon />
          </IconButton>
          <ChatBubbleOutlineIcon />
          <Typography variant="h6" fontWeight="bold" color='white' sx={{ flex: 1 }}>
            Green Kitchen Chat
          </Typography>
        </Box>

        {/* Search */}
        <Box sx={{ p: 2, bgcolor: '#f8fdf8' }}>
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </Box>

        <Divider />

        {/* Conversations list */}
        <Box sx={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          {filteredConversations.length === 0 && (
            <Typography
              align="center"
              color="text.secondary"
              sx={{ mt: 6, p: 2 }}
            >
              {searchTerm ? 'Không tìm thấy hội thoại nào' : 'Chưa có hội thoại nào'}
            </Typography>
          )}

          {Object.entries(grouped).map(([date, convs]) => (
            <React.Fragment key={date}>
              <Typography
                sx={{
                  px: 2, py: 1,
                  bgcolor: '#f7f7fa',
                  fontWeight: 700,
                  color: '#666',
                  fontSize: 13,
                  borderBottom: '1px solid #eee',
                  position: 'sticky', top: 0, zIndex: 1
                }}
              >
                {date}
              </Typography>
              <List sx={{ p: 0 }}>
                {convs.map(conv => (
                  <ConversationItem
                    key={conv.conversationId}
                    conversation={conv}
                    isSelected={selectedConv?.conversationId === conv.conversationId}
                    onSelect={() => {
                      onSelectConversation(conv)
                      if (window.innerWidth < 900) onToggle(false)
                    }}
                  />
                ))}
              </List>
            </React.Fragment>
          ))}
        </Box>
      </Box>
    </>
  )
}
