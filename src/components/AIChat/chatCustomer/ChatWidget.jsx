import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
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
import { useChatLogic } from '~/hooks/useChatLogic'

function ChatWidget({ conversationId = null, initialMode = 'AI' }) {
  const isCustomerLoggedIn = useSelector(state => !!state.customer.currentCustomer)
  const customerId = useSelector(state => state.customer.currentCustomer?.id)

  // Memoize chatAPI để tránh tạo object mới mỗi lần render
  const chatAPI = useMemo(() => {
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
  }, [isCustomerLoggedIn])

  const [animationConvId, setAnimationConvId] = useState(() => {
    if (!isCustomerLoggedIn) {
      // Nếu đã có trong localStorage thì lấy lại, còn không thì null để tạo mới
      return Number(localStorage.getItem('conversationId')) || null
    }
    // User login thì vẫn lấy từ prop/conversations
    return conversationId
  })

  const [conversationStatus, setConversationStatus] = useState('AI')
  const [chatMode, setChatMode] = useState(initialMode)

  // Sử dụng custom hook cho logic chat
  const {
    messages,
    input,
    awaitingAI,
    isLoading,
    hasMore,
    setInput,
    handleSend,
    listRef,
    handleIncoming,
    customerName // Lấy customerName từ useChatLogic
  } = useChatLogic({
    conversationId: animationConvId,
    initialMode,
    pageSize: 20,
    chatAPI,
    onMessagesUpdate: null
  })

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
    })
    // eslint-disable-next-line
  }, [isCustomerLoggedIn, customerId, chatAPI])

  useEffect(() => {
    if (!animationConvId && !isCustomerLoggedIn) {
      initGuestConversation().then(id => {
        setAnimationConvId(id)
        localStorage.setItem('conversationId', id)
        // FIX: Load messages ngay khi có conversationId
        fetchMessagesPaged(id, 0, 20).then(data => {
          // useChatLogic sẽ handle setMessages
        })
      })
    }
  }, [animationConvId, isCustomerLoggedIn])

  // Xử lý tin nhắn từ websocket
  useChatWebSocket(animationConvId ? `/topic/conversations/${animationConvId}` : null, (msg) => {
    console.log('📨 Customer WebSocket message received:', animationConvId, msg)
    handleIncoming(msg)
  })
  useChatWebSocket('/topic/emp-notify', async (convId) => {
    console.log('🔔 Customer emp-notify received:', convId)
    const conversationId = typeof convId === 'object' ? convId.conversationId : convId
    if (Number(conversationId) === Number(animationConvId)) {
      try {
        const status = await chatAPI.fetchConversationStatus(animationConvId)
        console.log('📊 Conversation status updated:', status)
        setConversationStatus(status)
        setChatMode(status === 'EMP' ? 'EMP' : 'AI')
        // Optional: toast thông báo "Nhân viên đã tham gia hỗ trợ"
      } catch (error) {
        console.error('Failed to fetch conversation status:', error)
      }
    }
  })

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Messages Area */}
      <Box
        ref={listRef}
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          bgcolor: 'grey.50',
          py: 2,
          '&::-webkit-scrollbar': { width: 6 },
          '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
          '&::-webkit-scrollbar-thumb': { bgcolor: 'grey.400', borderRadius: 3 }
        }}
      >
        {isLoading && hasMore && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        {messages
          .filter(m => !(m.senderRole === 'AI' && (m.status === 'PENDING' || m.status === 'pending')))
          .map((message, idx) => {
            const hasProducts = message.menu && Array.isArray(message.menu) && message.menu.length > 0
            if (hasProducts) {
              return (
                <ProductMessageBubble
                  key={`${message.id}-${idx}`}
                  message={message}
                  customerName={customerName} // Sử dụng customerName từ useChatLogic
                />
              )
            }
            return (
              <MessageBubble
                key={`${message.id}-${idx}`}
                message={message}
                customerName={customerName} // Sử dụng customerName từ useChatLogic
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
    </Box>
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