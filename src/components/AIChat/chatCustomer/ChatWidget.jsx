import { useEffect, useState, useRef, useCallback } from 'react'
import { useSelector } from 'react-redux'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import ChatContainer from './ChatContainer'
import MessageBubble from './MessageBubble'
import ProductMessageBubble from './ProductMessageBubble'
import TypingIndicator from './TypingIndicator'
import ChatInput from './ChatInput'
import FloatingChatButton from './FloatingChatButton'
import FloatingCloseButton from './FloatingCloseButton'
import { fetchMessagesPaged, initGuestConversation, getConversations } from '~/apis/chatAPICus'
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

function ChatWidget({ conversationId = null, initialMode = 'AI' }) {
  const isCustomerLoggedIn = useSelector(state => !!state.customer.currentCustomer)
  const customerId = useSelector(state => state.customer.currentCustomer?.id)
  const customerName = useSelector(state => state.customer.currentCustomer?.name)

  const chatAPI = getChatAPI(isCustomerLoggedIn)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')

  const [animationConvId, setAnimationConvId] = useState(() => {
    if (!isCustomerLoggedIn) {
    // Nếu đã có trong localStorage thì lấy lại, còn không thì null để tạo mới
      return Number(localStorage.getItem('conversationId')) || null
    }
    // User login thì vẫn lấy từ prop/conversations
    return conversationId
  })

  const [chatMode, setChatMode] = useState(initialMode)
  const [awaitingAI, setAwaitingAI] = useState(false)
  const [conversationStatus, setConversationStatus] = useState('AI')
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const listRef = useRef(null)
  const PAGE_SIZE = 20


  // Gộp các logic lấy conversationId từ props/localStorage
  useEffect(() => {
    if (!isCustomerLoggedIn) {
      let id = Number(localStorage.getItem('conversationId')) || null
      if (!id) {
      // Chưa có conversationId localStorage thì tạo mới
        chatAPI.initConversation().then(newId => {
          setAnimationConvId(newId)
          localStorage.setItem('conversationId', newId)
          chatAPI.fetchConversationStatus(newId).then(status => {
            setConversationStatus(status)
            setChatMode(status === 'AI' ? 'AI' : 'EMP')
          })
        })
      } else {
        setAnimationConvId(id)
        chatAPI.fetchConversationStatus(id).then(status => {
          setConversationStatus(status)
          setChatMode(status === 'AI' ? 'AI' : 'EMP')
        })
      }
      return
    }

    // LOGIN FLOW (như cũ)
    chatAPI.getConversations(customerId).then(convs => {
      if (convs && convs.length > 0) {
        const latestConvId = convs[0]
        setAnimationConvId(latestConvId)
        localStorage.removeItem('conversationId')
        chatAPI.fetchConversationStatus(latestConvId).then(status => {
          setConversationStatus(status)
          setChatMode(status === 'AI' ? 'AI' : 'EMP')
        })
      }
    // else ...
    })

    // eslint-disable-next-line
}, [isCustomerLoggedIn, customerId])


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
      setIsLoading(false)
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

  // Scroll listener để load thêm tin nhắn
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
  const handleIncoming = useCallback((msg) => {
    if (msg.conversationId && msg.conversationId !== animationConvId) {
      setAnimationConvId(msg.conversationId)
      // CHỈ LƯU localStorage khi đang là GUEST
      if (!isCustomerLoggedIn) {
        localStorage.setItem('conversationId', msg.conversationId)
      }
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
  }, [animationConvId, isCustomerLoggedIn])


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

  return (
    <ChatContainer chatMode={chatMode}>
      {/* Messages Area */}
      <Box
        ref={listRef}
        sx={{
          flex: 1,
          overflowY: 'auto',
          bgcolor: 'grey.50',
          py: 2,
          '&::-webkit-scrollbar': {
            width: 6
          },
          '&::-webkit-scrollbar-track': {
            bgcolor: 'transparent'
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'grey.400',
            borderRadius: 3
          }
        }}
      >
        {isLoading && hasMore && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        {messages.map((message, idx) => {
          // Check if message has product menu
          const hasProducts = message.menu && Array.isArray(message.menu) && message.menu.length > 0

          if (hasProducts) {
            return (
              <ProductMessageBubble
                key={`${message.id}-${idx}`}
                message={message}
                customerName={customerName}
              />
            )
          }

          return (
            <MessageBubble
              key={`${message.id}-${idx}`}
              message={message}
              customerName={customerName}
              isOwn={message.senderRole === 'CUSTOMER'}
            />
          )
        })}

        {awaitingAI && <TypingIndicator />}
      </Box>

      {/* Input Area */}
      <ChatInput
        input={input}
        setInput={setInput}
        handleSend={handleSend}
        disabled={chatMode === 'AI' && awaitingAI}
        chatMode={chatMode}
        awaitingAI={awaitingAI}
        isCustomerLoggedIn={isCustomerLoggedIn}
      />
    </ChatContainer>
  )
}

export default function Chat() {
  const [isOpen, setIsOpen] = useState(false)
  const [showChatButton, setShowChatButton] = useState(true)
  const [showCloseButton, setShowCloseButton] = useState(false)

  const handleToggleChat = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  // Xử lý animation callbacks để đồng bộ buttons
  const handleChatEntered = useCallback(() => {
    setShowChatButton(false)
    setShowCloseButton(true)
  }, [])

  const handleChatExited = useCallback(() => {
    setShowCloseButton(false)
    setShowChatButton(true)
  }, [])

  return (
    <>
      {/* FAB buttons - luôn hiển thị, chỉ thay đổi icon */}
      <Box
        sx={{
          position: 'fixed',
          bottom: { xs: 20, sm: 24, md: 32 },
          right: { xs: 20, sm: 24, md: 32 },
          zIndex: 1400
        }}
      >
        <FloatingChatButton
          onClick={handleToggleChat}
          show={showChatButton}
        />
        <FloatingCloseButton
          onClick={handleToggleChat}
          show={showCloseButton}
        />
      </Box>

      {/* Chat Container với animation bên trong */}
      <ChatContainer
        chatMode="AI"
        open={isOpen}
        onEntered={handleChatEntered}
        onExited={handleChatExited}
      >
        <ChatWidget />
      </ChatContainer>
    </>
  )
}