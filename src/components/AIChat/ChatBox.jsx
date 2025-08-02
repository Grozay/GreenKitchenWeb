import { useEffect, useState, useRef, useCallback } from 'react'
import { useSelector } from 'react-redux'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Fab from '@mui/material/Fab'
import Paper from '@mui/material/Paper'
import Slide from '@mui/material/Slide'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import Badge from '@mui/material/Badge'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import ChatIcon from '@mui/icons-material/Chat'
import CloseIcon from '@mui/icons-material/Close'
import PersonIcon from '@mui/icons-material/Person'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import SendIcon from '@mui/icons-material/Send'
import MinimizeIcon from '@mui/icons-material/Minimize'
import { fetchMessagesPaged, sendMessage, initGuestConversation, getConversations } from '~/apis/chatAPICus'
import { useChatWebSocket } from '~/hooks/useChatWebSocket'
import {
  initGuestConversation as guestInitConversation,
  sendMessage as guestSendMessage,
  fetchMessagesPaged as guestFetchMessagesPaged,
  fetchConversationStatus as guestFetchConversationStatus
} from '~/apis/chatAPIGuest'

import {
  sendMessage as userSendMessage,
  fetchMessagesPaged as userFetchMessagesPaged,
  fetchConversationStatus as userFetchConversationStatus

} from '~/apis/chatAPICus'

// Helper fallback cho senderName
function getSenderName(msg, customerName) {
  if (msg.senderName) return msg.senderName
  if (msg.senderRole === 'CUSTOMER') return customerName || 'Bạn'
  if (msg.senderRole === 'EMP') return 'Nhân viên'
  return msg.senderRole
}

// Component cho message bubble
function MessageBubble({ message, customerName, isOwn }) {
  const getSenderIcon = (senderRole) => {
    switch (senderRole) {
    case 'CUSTOMER':
      return <PersonIcon sx={{ fontSize: 20 }} />
    case 'AI':
      return <SmartToyIcon sx={{ fontSize: 20 }} />
    case 'EMP':
      return <SupportAgentIcon sx={{ fontSize: 20 }} />
    default:
      return <PersonIcon sx={{ fontSize: 20 }} />
    }
  }

  const getSenderColor = (senderRole) => {
    switch (senderRole) {
    case 'CUSTOMER':
      return '#1976d2'
    case 'AI':
      return '#9c27b0'
    case 'EMP':
      return '#2e7d32'
    default:
      return '#757575'
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isOwn ? 'row-reverse' : 'row',
        alignItems: 'flex-end',
        gap: 1,
        mb: 2,
        px: 1
      }}
    >
      <Avatar
        sx={{
          width: 40,
          height: 40,
          bgcolor: getSenderColor(message.senderRole),
          flexShrink: 0
        }}
      >
        {getSenderIcon(message.senderRole)}
      </Avatar>

      <Box
        sx={{
          maxWidth: '75%',
          minWidth: 120
        }}
      >
        <Paper
          elevation={2}
          sx={{
            p: 2,
            bgcolor: isOwn ? '#1976d2' : '#f5f5f5',
            color: isOwn ? 'white' : 'text.primary',
            borderRadius: 3,
            borderTopLeftRadius: isOwn ? 3 : 0.5,
            borderTopRightRadius: isOwn ? 0.5 : 3,
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              [isOwn ? 'right' : 'left']: -8,
              width: 0,
              height: 0,
              borderTop: `8px solid ${isOwn ? '#1976d2' : '#f5f5f5'}`,
              borderLeft: isOwn ? '8px solid transparent' : 'none',
              borderRight: isOwn ? 'none' : '8px solid transparent'
            }
          }}
        >
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              fontWeight: 600,
              mb: 0.5,
              opacity: 0.8,
              fontSize: '0.75rem'
            }}
          >
            {getSenderName(message, customerName)}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: '16px',
              lineHeight: 1.4,
              wordBreak: 'break-word'
            }}
          >
            {message.content}
          </Typography>

          {message.menu && Array.isArray(message.menu) && message.menu.length > 0 && (
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {message.menu.map((meal) => (
                <Paper
                  key={meal.id}
                  elevation={3}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                    color: 'text.primary',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Box
                      component="img"
                      src={meal.image || 'src/assets/images/Dial-up-Connection.jpg'}
                      alt={meal.title}
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 2,
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                      onError={(e) => {
                        e.target.src = 'src/assets/images/Dial-up-Connection.jpg'
                      }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          mb: 1,
                          color: 'text.primary',
                          fontSize: '16px'
                        }}
                      >
                        {meal.title}
                      </Typography>
                      <Chip
                        label={meal.price?.toLocaleString('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }) ?? ''}
                        color="primary"
                        variant="filled"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}

          <Typography
            variant="caption"
            sx={{
              display: 'block',
              textAlign: 'right',
              mt: 1,
              opacity: 0.6,
              fontSize: '0.7rem'
            }}
          >
            {message.timestamp ? new Date(message.timestamp).toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit'
            }) : ''}
          </Typography>
        </Paper>
      </Box>
    </Box>
  )
}

function ChatWidget({ conversationId = null, initialMode = 'AI' }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [animationConvId, setAnimationConvId] = useState(conversationId)
  const [chatMode, setChatMode] = useState(initialMode)
  const [awaitingAI, setAwaitingAI] = useState(false)
  const [conversationStatus, setConversationStatus] = useState('AI')
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const listRef = useRef(null)
  const PAGE_SIZE = 20

  const customerId = useSelector(state => state.customer.currentCustomer?.id)
  const customerName = useSelector(state => state.customer.currentCustomer?.name)
  const isCustomerLoggedIn = useSelector(state => !!state.customer.currentCustomer)
  const chatAPI = getChatAPI(isCustomerLoggedIn)

  // Gộp các logic lấy conversationId từ props/localStorage
  useEffect(() => {
    let id = conversationId
    if (!id) {
      id = Number(localStorage.getItem('conversationId')) || null
    }
    if (!id && !isCustomerLoggedIn) {
      // Guest cần init conversation
      chatAPI.initConversation().then(newId => {
        setAnimationConvId(newId)
        localStorage.setItem('conversationId', newId)
        chatAPI.fetchConversationStatus(newId).then(status => {
          setConversationStatus(status)
          setChatMode(status === 'AI' ? 'AI' : 'EMP')
        })
      })
      return
    }
    // CASE: Customer login mà không có conversationId
    if (!id && isCustomerLoggedIn) {
      // Gọi API lấy conversations của customer
      chatAPI.getConversations(customerId).then(convs => {
        if (convs && convs.length > 0) {
          const latestConvId = convs[0] // hoặc lấy theo tiêu chí business
          setAnimationConvId(latestConvId)
          localStorage.setItem('conversationId', latestConvId)
          chatAPI.fetchConversationStatus(latestConvId).then(status => {
            setConversationStatus(status)
            setChatMode(status === 'AI' ? 'AI' : 'EMP')
          })
        } else {
          // Customer chưa từng chat: có thể tự tạo conversation mới, hoặc để user chat mới sẽ tạo
          // Nếu muốn auto tạo mới, bạn gọi API khởi tạo mới ở đây
        }
      })
      return
    }

    if (id) {
      setAnimationConvId(id)
      localStorage.setItem('conversationId', id)
      console.log('conversationId', id)
      chatAPI.fetchConversationStatus(id).then(status => {
        setConversationStatus(status)
        setChatMode(status === 'AI' ? 'AI' : 'EMP')
      })
    }
    // eslint-disable-next-line
  }, [conversationId, isCustomerLoggedIn])

  useEffect(() => {
    if (!animationConvId && !isCustomerLoggedIn) {
      initGuestConversation().then(id => {
        setAnimationConvId(id)
        localStorage.setItem('conversationId', id)
        // load ngay 0 tin (nếu cần)
        fetchMessagesPaged(id, 0, PAGE_SIZE).then(data => {
          setMessages(data.content.reverse())
          setHasMore(!data.last)
        })
      })
    }
  }, [animationConvId, isCustomerLoggedIn])

  // Load messages khi animationConvId hoặc chatMode đổi

  useEffect(() => {
    if (!animationConvId) return
    setIsLoading(true)
    setPage(0)
    chatAPI.fetchMessagesPaged(animationConvId, 0, PAGE_SIZE).then((data) => {
      setMessages([...data.content].reverse())
      setPage(0)
      setHasMore(!data.last)
    })
    // eslint-disable-next-line
  }, [animationConvId, chatMode])

  // Auto scroll cuối khi messages thay đổi
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages])

  // Infinite scroll
  const handleLoadMore = useCallback(() => {
    if (isLoading || !hasMore) return
    setIsLoading(true)
    chatAPI.fetchMessagesPaged(animationConvId, page + 1, PAGE_SIZE).then((data) => {
      setMessages(prev => [...[...data.content].reverse(), ...prev])
      setPage(prev => prev + 1)
      setHasMore(!data.last)
      setIsLoading(false)
    })
  }, [animationConvId, page, hasMore, isLoading, chatAPI])

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const handleScroll = () => {
      if (list.scrollTop === 0 && hasMore && !isLoading) handleLoadMore()
    }
    list.addEventListener('scroll', handleScroll)
    return () => list.removeEventListener('scroll', handleScroll)
  }, [handleLoadMore, hasMore, isLoading])

  // Fallback senderName cho pending messages
  useEffect(() => {
    setMessages(prev =>
      prev.map(m =>
        m.status === 'pending' && m.senderRole === 'CUSTOMER' && !m.senderName
          ? { ...m, senderName: customerName || 'Bạn' }
          : m
      )
    )
  }, [customerName])

  // Xử lý tin nhắn từ websocket
  // WebSocket
  const handleIncoming = useCallback((msg) => {
    if (msg.conversationId && msg.conversationId !== animationConvId) {
      setAnimationConvId(msg.conversationId)
      localStorage.setItem('conversationId', msg.conversationId)
    }
    setMessages(prev => {
      const filtered = prev.filter(m =>
        !(m.status === 'pending' && m.content === msg.content && m.senderRole === msg.senderRole)
      )
      if (filtered.some(m => m.id === msg.id)) return filtered
      return [...filtered, msg]
    })
    if (msg.senderRole === 'AI') setAwaitingAI(false)
    console.log('>>> handleIncoming:', msg)

  }, [animationConvId])


  useChatWebSocket(`/topic/conversations/${animationConvId}`, handleIncoming)
  useChatWebSocket('/topic/emp-notify', async (convId) => {
    const conversationId = typeof convId === 'object' ? convId.conversationId : convId
    if (Number(conversationId) === Number(animationConvId)) {
      try {
        const status = await chatAPI.fetchConversationStatus(animationConvId)
        setConversationStatus(status)
        setChatMode(status === 'EMP' ? 'EMP' : 'AI')
        // Optional: toast thông báo "Nhân viên đã tham gia hỗ trợ"
      } catch (error) {
        console.error('Failed to fetch conversation status:', error)
      }
    }
  })


  function getChatAPI(isCustomerLoggedIn) {
    if (isCustomerLoggedIn) {
      return {
        initConversation: null, // user login luôn có conversationId khi chat
        sendMessage: userSendMessage,
        fetchMessagesPaged: userFetchMessagesPaged,
        fetchConversationStatus: userFetchConversationStatus,
        getConversations: getConversations
      }
    }
    return {
      initConversation: guestInitConversation,
      sendMessage: guestSendMessage,
      fetchMessagesPaged: guestFetchMessagesPaged,
      fetchConversationStatus: guestFetchConversationStatus

    }
  }


  // Gửi tin nhắn
  const handleSend = useCallback(async () => {
    const text = input.trim()
    if (!text) return
    if (chatMode === 'AI' && awaitingAI) return

    setInput('')
    if (chatMode === 'AI') setAwaitingAI(true)
    const tempId = `temp-${Date.now()}`
    setMessages(prev => [
      ...prev,
      {
        id: tempId,
        conversationId: animationConvId,
        senderName: isCustomerLoggedIn ? customerName : 'Guest',
        senderRole: 'CUSTOMER',
        content: text,
        timestamp: new Date().toISOString(),
        status: 'pending'
      }
    ])

    const params = {
      conversationId: animationConvId,
      senderRole: 'CUSTOMER',
      content: text,
      lang: 'vi'
    }
    if (isCustomerLoggedIn) params.customerId = customerId

    try {
      await chatAPI.sendMessage(params)
      // KHÔNG setMessages với resp trả về ở đây nữa!
    } catch (error) {
      setMessages(prev => [
        ...prev.filter(m => m.id !== tempId),
        {
          id: Date.now() + 1,
          conversationId: animationConvId,
          senderName: 'SYSTEM',
          content: error?.message || 'Gửi thất bại',
          timestamp: new Date().toISOString()
        }
      ])
      setAwaitingAI(false)
    }
  }, [
    input, chatMode, awaitingAI, animationConvId,
    isCustomerLoggedIn, customerId, customerName, chatAPI
  ])

  const getChatModeIcon = () => {
    switch (chatMode) {
    case 'AI':
      return <SmartToyIcon sx={{ mr: 1 }} />
    case 'EMP':
      return <SupportAgentIcon sx={{ mr: 1 }} />
    default:
      return <ChatIcon sx={{ mr: 1 }} />
    }
  }

  const getChatModeColor = () => {
    switch (chatMode) {
    case 'AI':
      return '#9c27b0'
    case 'EMP':
      return '#2e7d32'
    default:
      return '#1976d2'
    }
  }

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'fixed',
        right: { xs: 0, md: 24 },
        bottom: { xs: 0, md: 100 },
        width: { xs: '100vw', sm: 420, md: 480 },
        maxWidth: '100vw',
        height: { xs: '100vh', sm: '70vh', md: 600 },
        minHeight: 600,
        bgcolor: 'background.paper',
        zIndex: 1300,
        borderRadius: { xs: 0, sm: 3 },
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          bgcolor: getChatModeColor(),
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 64
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Badge
            variant="dot"
            color="success"
            sx={{
              '& .MuiBadge-badge': {
                bgcolor: '#4caf50',
                color: '#4caf50'
              }
            }}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: 'rgba(255,255,255,0.2)',
                mr: 2
              }}
            >
              {getChatModeIcon()}
            </Avatar>
          </Badge>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '18px' }}>
              Chat với {chatMode === 'AI' ? 'AI Assistant' : 'Nhân viên'}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              {awaitingAI ? 'Đang soạn tin...' : 'Đang hoạt động'}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider />

      {/* Messages Area */}
      <Box
        ref={listRef}
        sx={{
          flex: 1,
          overflowY: 'auto',
          bgcolor: '#fafafa',
          p: 1,
          '&::-webkit-scrollbar': {
            width: 6
          },
          '&::-webkit-scrollbar-track': {
            bgcolor: 'transparent'
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'rgba(0,0,0,0.2)',
            borderRadius: 3
          }
        }}
      >
        {isLoading && hasMore && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        {messages.map((message, idx) => (
          <MessageBubble
            key={`${message.id}-${idx}`}
            message={message}
            customerName={customerName}
            isOwn={message.senderRole === 'CUSTOMER'}
          />
        ))}

        {awaitingAI && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: 1,
              mb: 2,
              px: 1
            }}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: '#9c27b0',
                flexShrink: 0
              }}
            >
              <SmartToyIcon sx={{ fontSize: 20 }} />
            </Avatar>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                bgcolor: '#f5f5f5',
                borderRadius: 3,
                borderTopLeftRadius: 0.5,
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              <CircularProgress size={16} />
              <Typography variant="body2" color="text.secondary">
                AI đang soạn phản hồi...
              </Typography>
            </Paper>
          </Box>
        )}
      </Box>

      <Divider />

      {/* Input Area */}
      <Box
        sx={{
          p: 2,
          bgcolor: 'background.paper',
          display: 'flex',
          gap: 1,
          alignItems: 'flex-end',
          minHeight: 80
        }}
      >
        <TextField
          fullWidth
          multiline
          maxRows={4}
          variant="outlined"
          size="medium"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập tin nhắn..."
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
          disabled={chatMode === 'AI' && awaitingAI}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              bgcolor: '#f8f9fa',
              fontSize: '16px',
              '& fieldset': {
                borderColor: 'rgba(0,0,0,0.12)'
              },
              '&:hover fieldset': {
                borderColor: 'rgba(0,0,0,0.23)'
              },
              '&.Mui-focused fieldset': {
                borderColor: getChatModeColor()
              }
            },
            '& .MuiInputBase-input': {
              fontSize: '16px',
              py: 1.5
            }
          }}
        />
        <IconButton
          onClick={handleSend}
          disabled={
            (chatMode === 'AI' && awaitingAI) ||
            (chatMode === 'EMP' && !isCustomerLoggedIn) ||
            !input.trim()
          }
          sx={{
            bgcolor: getChatModeColor(),
            color: 'white',
            width: 48,
            height: 48,
            '&:hover': {
              bgcolor: getChatModeColor(),
              opacity: 0.8
            },
            '&:disabled': {
              bgcolor: 'rgba(0,0,0,0.12)',
              color: 'rgba(0,0,0,0.26)'
            }
          }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  )
}


export default function Chat() {
  const [isOpen, setIsOpen] = useState(false)
  const handleToggleChat = useCallback(() => setIsOpen((prev) => !prev), [])

  return (
    <>
      <Fab
        color="primary"
        size="large"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          width: 64,
          height: 64,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isOpen ? 'rotate(180deg) scale(0.9)' : 'rotate(0deg) scale(1)',
          boxShadow: 4,
          '&:hover': {
            transform: isOpen ? 'rotate(180deg) scale(0.95)' : 'rotate(0deg) scale(1.05)',
            boxShadow: 6
          }
        }}
        onClick={handleToggleChat}
      >
        {isOpen ? <CloseIcon sx={{ fontSize: 28 }} /> : <ChatIcon sx={{ fontSize: 28 }} />}
      </Fab>

      <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit timeout={400}>
        <div>
          <ChatWidget />
        </div>
      </Slide>
    </>
  )
}