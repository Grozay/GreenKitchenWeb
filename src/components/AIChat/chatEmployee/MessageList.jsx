/**
 * MessageList - Chat messages display with header and infinite scroll
 *
 * Props:
 * - selectedConv: currently selected conversation object
 * - messages: array of message objects
 * - isLoading: boolean indicating loading state
 * - hasMore: boolean indicating if more messages can be loaded
 * - onLoadMore: function to load more messages
 * - onReleaseToAI: function to release conversation to AI
 * - isEmpCanChat: boolean indicating if employee can chat
 */

import React, { useRef, useEffect } from 'react'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import { useTheme } from '@mui/material/styles'
import { useMediaQuery } from '@mui/material'

function escapeHTML(str) {
  return str.replace(/[&<>"']/g, (m) =>
    ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      '\'': '&#39;'
    }[m])
  )
}

export default function MessageList({
  selectedConv,
  messages,
  isLoading,
  hasMore,
  onLoadMore,
  onReleaseToAI,
  isEmpCanChat,
  onBack
}) {
  const listRef = useRef(null)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // Infinite scroll handler
  useEffect(() => {
    const list = listRef.current
    if (!list || !hasMore) return

    const onScroll = () => {
      if (list.scrollTop < 30 && hasMore && !isLoading) {
        onLoadMore()
      }
    }

    list.addEventListener('scroll', onScroll)
    return () => list.removeEventListener('scroll', onScroll)
  }, [onLoadMore, hasMore, isLoading])

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    if (list.scrollHeight - list.scrollTop - list.clientHeight < 200) {
      list.scrollTop = list.scrollHeight
    }
  }, [messages])

  // Get status chip color
  const getStatusColor = (status) => {
    switch (status) {
    case 'EMP': return 'success'
    case 'AI': return 'warning'
    case 'WAITING_EMP': return 'info'
    default: return 'default'
    }
  }

  return (
    <>
      {/* Header */}
      <Box sx={{
        p: { xs: 1.5, sm: 2 },
        borderBottom: 1,
        borderColor: 'grey.200',
        bgcolor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: { xs: 60, sm: 70 },
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 1, sm: 0 }
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          width: { xs: '100%', sm: 'auto' }
        }}>
          {/* Nút Back cho mobile */}
          {isMobile && selectedConv && onBack && (
            <IconButton
              onClick={onBack}
              sx={{
                mr: { xs: 1, sm: 2 },
                color: 'primary.main',
                display: { xs: 'flex', sm: 'none' },
                '&:hover': {
                  backgroundColor: 'rgba(46, 125, 50, 0.08)'
                }
              }}
              aria-label="Quay lại danh sách chat"
            >
              <ArrowBackIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </IconButton>
          )}
          
          {selectedConv && (
            <Avatar sx={{
              mr: { xs: 1, sm: 2 },
              bgcolor: 'primary.main',
              width: { xs: 40, sm: 48 },
              height: { xs: 40, sm: 48 }
            }}>
              {selectedConv.customerName?.[0]?.toUpperCase() || '?'}
            </Avatar>
          )}
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '1rem', sm: '1.25rem' },
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {selectedConv?.customerName || 'Chọn hội thoại'}
            </Typography>
            {selectedConv && (
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {selectedConv.customerPhone || 'Không có SĐT'}
              </Typography>
            )}
          </Box>
        </Box>

        {selectedConv && (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
            gap: { xs: 1, sm: 2 },
            width: { xs: '100%', sm: 'auto' },
            justifyContent: { xs: 'space-between', sm: 'flex-end' }
        }}>
            <Chip
              label={selectedConv.status}
              color={getStatusColor(selectedConv.status)}
              size="small"
              sx={{ 
                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                height: { xs: 24, sm: 28 }
              }}
            />
            {isEmpCanChat && (
            <Button
              variant="outlined"
                size="small"
              onClick={onReleaseToAI}
                startIcon={<SmartToyIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />}
              sx={{
                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                  height: { xs: 24, sm: 28 },
                  px: { xs: 1, sm: 1.5 }
                }}
              >
                Trả về AI
            </Button>
          )}
        </Box>
        )}
      </Box>

      {/* Messages area */}
      <Box
        ref={listRef}
        sx={{
          flex: 1,
          overflowY: 'auto',
          bgcolor: '#f1f8e9',
          px: 2,
          py: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          position: 'relative',
          backgroundImage: 'linear-gradient(45deg, rgba(76, 175, 80, 0.02) 25%, transparent 25%), linear-gradient(-45deg, rgba(76, 175, 80, 0.02) 25%, transparent 25%)',
          backgroundSize: '20px 20px'
        }}
      >
        {isLoading && messages.length === 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress size={32} sx={{ color: 'primary.main' }} />
          </Box>
        )}

        {selectedConv ? (
          <>
        {messages.length === 0 && !isLoading ? (
            <Typography 
                align="center"
              color="text.secondary"
                sx={{ mt: 6, fontStyle: 'italic' }}
            >
                Chưa có tin nhắn nào
            </Typography>
            ) : (
              messages.map((m, idx) => {
                const isEmp = m.senderRole === 'EMP'
                const isAI = m.senderRole === 'AI'
                const isCustomer = m.senderRole === 'CUS' || m.senderRole === 'GUEST'
                const isRight = isEmp || isAI
            
            return (
                  <Box key={`${m.id || idx}`} sx={{
                  display: 'flex',
                    flexDirection: isRight ? 'row-reverse' : 'row',
                    alignItems: 'flex-end',
                    gap: 1
                  }}>
                    <Avatar sx={{
                      width: 36,
                      height: 36,
                      bgcolor: isEmp ? '#2e7d32' : (isAI ? '#ff9800' : '#1976d2'),
                      transition: 'transform 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}>
                      {m.senderName?.[0]?.toUpperCase() || '?'}
                    </Avatar>

                    <Box sx={{
                      maxWidth: '65%',
                      px: 2,
                      py: 1.5,
                      borderRadius: 3,
                      bgcolor: isEmp ? '#2e7d32' : (isAI ? '#ff9800' : 'white'),
                      color: isEmp || isAI ? 'white' : 'black',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      wordBreak: 'break-word',
                      position: 'relative',
                      transition: 'transform 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                      },
                      // Message tail
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 8,
                        width: 0,
                        height: 0,
                        border: '8px solid transparent',
                        borderTopColor: isEmp ? '#2e7d32' : (isAI ? '#ff9800' : 'white'),
                        ...(isRight ? {
                          right: -8,
                          borderRightWidth: 0
                        } : {
                          left: -8,
                          borderLeftWidth: 0
                        })
                      }
                    }}>
                      <Typography
                        fontWeight="bold"
                        fontSize={12}
                    sx={{
                          mb: 0.5,
                          opacity: 0.9
                        }}
                      >
                        {m.senderName}
                        {isAI && (
                          <SmartToyIcon sx={{ ml: 0.5, fontSize: 12, verticalAlign: 'middle' }} />
                        )}
                      </Typography>

                  <Typography
                        component="div"
                        fontSize={14}
                    sx={{
                          whiteSpace: 'pre-line',
                          lineHeight: 1.4
                    }}
                        dangerouslySetInnerHTML={{ __html: escapeHTML(m.content) }}
                  />
                  
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                          textAlign: 'right',
                          mt: 0.5,
                      opacity: 0.7,
                          fontSize: '0.7rem'
                        }}
                      >
                        {m.createdAt?.slice(11, 16)}
                  </Typography>
                </Box>
                  </Box>
                )
              })
            )}
          </>
        ) : (
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: 'text.secondary'
          }}>
            <Avatar sx={{
              width: 80,
              height: 80,
              bgcolor: 'primary.main',
              mb: 2,
              opacity: 0.7
            }}>
              <SmartToyIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Green Kitchen Support
            </Typography>
            <Typography align="center">
              Chọn hội thoại để bắt đầu hỗ trợ khách hàng
            </Typography>
          </Box>
        )}
      </Box>
    </>
  )
}