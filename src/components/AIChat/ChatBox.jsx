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
import ChatIcon from '@mui/icons-material/Chat'
import CloseIcon from '@mui/icons-material/Close'
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


  // Chuyển AI <-> EMP
  const handleToggleChat = useCallback(() => {
    if (chatMode === 'AI') {
      if (!isCustomerLoggedIn) {
        window.location.href = '/login'
        return
      }
      sendMessage({
        conversationId: animationConvId,
        senderRole: 'CUSTOMER',
        customerId,
        content: '/meet_emp',
        lang: 'vi'
      }).then((resp) => {
        if (resp.senderName !== 'SYSTEM') setMessages(prev => [...prev, resp])
        setConversationStatus('WAITING_EMP')
        setChatMode('EMP')
      })
    } else {
      sendMessage({
        conversationId: animationConvId,
        senderRole: 'CUSTOMER',
        customerId,
        content: '/backtoAI',
        lang: 'vi'
      }).then((resp) => {
        if (resp.senderName !== 'SYSTEM') setMessages(prev => [...prev, resp])
        setConversationStatus('AI')
        setChatMode('AI')
      })
    }
  }, [chatMode, isCustomerLoggedIn, animationConvId, customerId])


  return (
    <Box sx={{ width: 400, border: 1, borderColor: 'grey.300', borderRadius: 2, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Chat với {chatMode === 'AI' ? 'AI' : 'nhân viên'}
      </Typography>

      <List
        ref={listRef}
        sx={{
          height: 300,
          overflowY: 'auto',
          bgcolor: 'grey.50',
          mb: 2,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {messages.map((m, idx) => (
          <ListItem
            key={`${m.id}-${idx}`}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: m.senderRole === 'CUSTOMER' ? 'flex-end' : 'flex-start' // ✅ GIỮ
            }}
          >
            <Box
              sx={{
                bgcolor: m.senderRole === 'CUSTOMER' ? '#e0f7fa' : '#f1f1f1',
                alignSelf: m.senderRole === 'CUSTOMER' ? 'flex-end' : 'flex-start', // ✅ GIỮ
                px: 2,
                py: 1,
                borderRadius: 2,
                maxWidth: '80%'
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                {getSenderName(m, customerName)}
              </Typography>
              <Typography variant="body2">{m.content}</Typography>
            </Box>
          </ListItem>
        ))}
      </List>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập tin nhắn..."
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={chatMode === 'AI' && awaitingAI}
        />
        <Button
          variant="contained"
          onClick={handleSend}
          disabled={
            (chatMode === 'AI' && awaitingAI) || (chatMode === 'EMP' && !isCustomerLoggedIn)
          }
        >
          Gửi
        </Button>
      </Box>

      <Box sx={{ mt: 1, textAlign: 'right' }}>
        <Button color="secondary" onClick={handleToggleChat} disabled={chatMode === 'AI' && awaitingAI}>
          {chatMode === 'AI' ? 'Gặp nhân viên' : 'Gặp AI'}
        </Button>
      </Box>
    </Box>
  )
}


export default function Chat() {
  const [isOpen, setIsOpen] = useState(false)
  const handleToggleChat = useCallback(() => setIsOpen((prev) => !prev), [])

  return (
    <>
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          transition: 'transform 0.3s ease',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
        }}
        onClick={handleToggleChat}
      >
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </Fab>

      <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: 100,
            right: 24,
            zIndex: 999,
            borderRadius: 2,
            overflow: 'hidden',
            maxWidth: '90vw',
            maxHeight: '80vh'
          }}
        >
          <ChatWidget />
        </Paper>
      </Slide>
    </>
  )
}


