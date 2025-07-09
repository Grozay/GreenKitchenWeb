import { useState, useRef, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Fab,
  Slide,
  CircularProgress,
} from '@mui/material'
import { Send, Close, Chat, Restaurant } from '@mui/icons-material'
import { styled, keyframes } from '@mui/material/styles'
import axios from 'axios'

// Animations
const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
`
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`

// Styled Components
const ChatContainer = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  bottom: 100,
  right: 24,
  width: 380,
  height: 500,
  borderRadius: 20,
  overflow: 'hidden',
  boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
  zIndex: 1300,
  display: 'flex',
  flexDirection: 'column',
}))
const ChatHeader = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
  color: 'white',
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}))
const MessagesContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(1),
  overflowY: 'auto',
  backgroundColor: '#f8f9fa',
}))
const MessageBubble = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isAI',
})(({ theme, isAI }) => ({
  maxWidth: '80%',
  padding: theme.spacing(1.5, 2),
  borderRadius: 18,
  marginBottom: theme.spacing(1),
  wordWrap: 'break-word',
  animation: `${bounce} 0.6s ease-out`,
  ...(isAI
    ? {
      backgroundColor: 'white',
      color: theme.palette.text.primary,
      alignSelf: 'flex-start',
      borderBottomLeftRadius: 6,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    }
    : {
      backgroundColor: '#4caf50',
      color: 'white',
      alignSelf: 'flex-end',
      borderBottomRightRadius: 6,
      marginLeft: 'auto',
    }),
}))
const TypingIndicator = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1.5, 2),
  backgroundColor: 'white',
  borderRadius: 18,
  borderBottomLeftRadius: 6,
  maxWidth: 120,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  marginBottom: theme.spacing(1),
}))
const TypingDot = styled(Box)(({ theme, delay }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  margin: '0 2px',
  animation: `${bounce} 1.4s infinite ease-in-out`,
  animationDelay: delay,
}))
const FloatingButton = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: 24,
  right: 24,
  background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
  color: 'white',
  zIndex: 1300,
  '&:hover': {
    background: 'linear-gradient(135deg, #388e3c 0%, #4caf50 100%)',
    animation: `${pulse} 0.6s ease-in-out`,
  },
}))
const NotificationBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: -8,
  right: -8,
  width: 24,
  height: 24,
  borderRadius: '50%',
  backgroundColor: '#f44336',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 12,
  fontWeight: 'bold',
  animation: `${pulse} 2s infinite`,
}))

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [conversationId, setConversationId] = useState(
    localStorage.getItem('conversationId') || null
  )
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (conversationId) {
      axios
        .get(`http://localhost:8080/apis/v1/chat/messages?conversationId=${conversationId}`)
        .then((res) => {
          const loadedMessages = res.data.map((m, i) => ({
            id: i,
            text: m.message,
            isAI: m.isFromAI,
            timestamp: new Date(),
          }))
          setMessages(loadedMessages)
        })
        .catch((err) => console.error('Load history failed', err))
    }
  }, [conversationId])

  useEffect(() => {
    const timeout = setTimeout(() => scrollToBottom(), 100)
    return () => clearTimeout(timeout)
  }, [messages.length, isTyping])

  const handleSend = async () => {
    if (!inputText.trim()) return
    const userMessage = {
      id: Date.now(),
      text: inputText,
      isAI: false,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInputText('')
    setIsTyping(true)

    try {
      const body = {
        conversationId: conversationId || null,
        message: inputText
      }
      const response = await axios.post(
        'http://localhost:8080/apis/v1/chat/send',
        body
      )

      const convId = response.data.conversationId
      if (!conversationId && convId) {
        localStorage.setItem('conversationId', convId)
        setConversationId(convId)
      }

      setTimeout(() => {
        const aiMessage = {
          id: Date.now() + 1,
          text: response.data.message,
          isAI: true,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiMessage])
        setIsTyping(false)
      }, 1200)
    } catch (error) {
      setTimeout(() => {
        const errorMessage = {
          id: Date.now() + 1,
          text: 'Xin lỗi, lỗi kết nối. Vui lòng thử lại sau.',
          isAI: true,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
        setIsTyping(false)
      }, 1200)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const toggleChat = () => setIsOpen(!isOpen)

  return (
    <>
      <Slide direction='up' in={isOpen} mountOnEnter unmountOnExit>
        <ChatContainer elevation={24}>
          <ChatHeader>
            <Box display='flex' alignItems='center'>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
                <Restaurant />
              </Avatar>
              <Box>
                <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                  AI Green Kitchen
                </Typography>
                <Typography variant='caption' sx={{ opacity: 0.9 }}>
                  Luôn sẵn sàng hỗ trợ bạn
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={toggleChat}
              sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
            >
              <Close />
            </IconButton>
          </ChatHeader>

          <MessagesContainer>
            <Box display='flex' flexDirection='column' gap={1}>
              {messages.map((message) => (
                <Box key={message.id} display='flex' flexDirection='column'>
                  <MessageBubble isAI={message.isAI}>
                    <Typography variant='body2' sx={{ lineHeight: 1.5 }}>
                      {message.text}
                    </Typography>
                    <Typography
                      variant='caption'
                      sx={{ opacity: 0.7, fontSize: 10, mt: 0.5, display: 'block' }}
                    >
                      {message.timestamp.toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Typography>
                  </MessageBubble>
                </Box>
              ))}

              {isTyping && (
                <TypingIndicator>
                  <TypingDot delay='0s' />
                  <TypingDot delay='0.2s' />
                  <TypingDot delay='0.4s' />
                  <Typography variant='caption' sx={{ ml: 1, color: 'text.secondary' }}>
                    AI đang trả lời...
                  </Typography>
                </TypingIndicator>
              )}
            </Box>
            <div ref={messagesEndRef} />
          </MessagesContainer>

          <Box p={2} bgcolor='white'>
            <Box display='flex' alignItems='flex-end' gap={1}>
              <TextField
                fullWidth
                multiline
                maxRows={3}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder='Nhập câu hỏi của bạn...'
                disabled={isTyping}
                variant='outlined'
                size='small'
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    backgroundColor: '#f5f5f5',
                    '&:hover': { backgroundColor: 'white' },
                    '&.Mui-focused': { backgroundColor: 'white' },
                  },
                }}
              />
              <IconButton
                onClick={handleSend}
                disabled={!inputText.trim() || isTyping}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  width: 40,
                  height: 40,
                  '&:hover': { bgcolor: 'primary.dark' },
                  '&.Mui-disabled': { bgcolor: 'grey.300' },
                }}
              >
                {isTyping ? (
                  <CircularProgress size={20} color='inherit' />
                ) : (
                  <Send fontSize='small' />
                )}
              </IconButton>
            </Box>
          </Box>
        </ChatContainer>
      </Slide>

      <FloatingButton onClick={toggleChat}>
        {isOpen ? <Close /> : <Chat />}
        {!isOpen && <NotificationBadge>1</NotificationBadge>}
      </FloatingButton>
    </>
  )
}

export default ChatBox
