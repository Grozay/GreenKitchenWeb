import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Box, CircularProgress, IconButton, Tooltip, Paper, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useNavigate, useParams } from 'react-router-dom'
import MessageBubble from '~/pages/customer/ChatPage/MessageBubble'
import ProductMessageBubble from '~/pages/customer/ChatPage/ProductMessageBubble'
import ChatInput from '~/pages/customer/ChatPage/ChatInput'
import TypingIndicator from '~/pages/customer/ChatPage/TypingIndicator'
import { useChatWebSocket } from '~/hooks/useChatWebSocket'
import { chatApis, fetchMessagesPaged } from '~/apis/chatAPICus'
import { Fade } from '@mui/material'
import { selectCurrentCustomer, selectCustomerName, selectIsCustomerLoggedIn } from '~/redux/user/customerSlice'

export default function HistoryChatDetail() {
  const navigate = useNavigate()
  const { conversationId } = useParams()
  const currentCustomer = useSelector(selectCurrentCustomer)
  const isCustomerLoggedIn = useSelector(selectIsCustomerLoggedIn)
  const customerId = currentCustomer?.id
  const customerName = useSelector(selectCustomerName)

  // Fallback: lấy customer info từ localStorage nếu Redux state bị mất
  const [fallbackCustomerName, setFallbackCustomerName] = useState('')
  const [fallbackCustomerId, setFallbackCustomerId] = useState(null)
  
  useEffect(() => {
    if ((!customerName && !fallbackCustomerName) || (!customerId && !fallbackCustomerId)) {
      try {
        const storedCustomer = localStorage.getItem('customer')
        if (storedCustomer) {
          const parsed = JSON.parse(storedCustomer)
          if (parsed.name) setFallbackCustomerName(parsed.name)
          if (parsed.id) setFallbackCustomerId(parsed.id)
        }
      } catch (e) {
        // Silent fail
      }
    }
  }, [customerName, fallbackCustomerName, customerId, fallbackCustomerId])
  
  // Sử dụng customerName từ Redux hoặc fallback - memoized để tránh re-render
  const displayCustomerName = useMemo(() => 
    customerName || fallbackCustomerName || 'Bạn', 
    [customerName, fallbackCustomerName]
  )

  const effectiveCustomerId = useMemo(() => customerId || fallbackCustomerId, [customerId, fallbackCustomerId])

  // Utility function để cập nhật trạng thái message thành SENT
  const markMessageAsSent = useCallback((messageId) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId && (msg.status === 'PENDING' || msg.status === 'pending')
        ? { ...msg, status: 'SENT' }
        : msg
    ))
    setAwaitingAI(false)
  }, [])

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [chatMode, setChatMode] = useState('AI')
  const [awaitingAI, setAwaitingAI] = useState(false)
  const [conversationStatus, setConversationStatus] = useState('AI')
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const listRef = useRef(null)
  const PAGE_SIZE = 20

  // Memoized filtered messages để tránh re-render không cần thiết
  const filteredMessages = useMemo(() => 
    messages.filter(m => !(m.senderRole === 'AI' && (m.status === 'PENDING' || m.status === 'pending'))),
    [messages]
  )

  // Load messages khi conversationId thay đổi
  useEffect(() => {
    if (!conversationId) return
    setIsLoading(true)
    setPage(0)
    fetchMessagesPaged(conversationId, 0, PAGE_SIZE).then(data => {
      // Override senderName cho tất cả CUSTOMER messages để hiển thị tên đúng
      const messagesWithCorrectNames = data.content.map(msg => {
        if (msg.senderRole === 'CUSTOMER') {
          return {
            ...msg,
            senderName: displayCustomerName
          }
        }
        return msg
      })
      setMessages([...messagesWithCorrectNames].reverse())
      setHasMore(!data.last)
      setIsLoading(false)
    })
  }, [conversationId, displayCustomerName])

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages])

  // Infinite scroll load more - memoized để tránh re-create function
  const handleLoadMore = useCallback(() => {
    if (isLoading || !hasMore) return
    setIsLoading(true)
    fetchMessagesPaged(conversationId, page + 1, PAGE_SIZE).then(data => {
      // Override senderName cho tất cả CUSTOMER messages khi load thêm
      const messagesWithCorrectNames = data.content.map(msg => {
        if (msg.senderRole === 'CUSTOMER') {
          return {
            ...msg,
            senderName: displayCustomerName
          }
        }
        return msg
      })
      setMessages(prev => [...[...messagesWithCorrectNames].reverse(), ...prev])
      setPage(prev => prev + 1)
      setHasMore(!data.last)
      setIsLoading(false)
    })
  }, [conversationId, page, hasMore, isLoading, displayCustomerName])

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const onScroll = () => {
      if (list.scrollTop === 0 && hasMore && !isLoading) handleLoadMore()
    }
    list.addEventListener('scroll', onScroll)
    return () => list.removeEventListener('scroll', onScroll)
  }, [handleLoadMore, hasMore, isLoading])

  // WebSocket incoming handler - memoized để tránh re-create function
  const handleIncoming = useCallback((msg) => {
    if (Number(msg.conversationId) !== Number(conversationId)) return
    
    // Override senderName cho CUSTOMER messages từ WebSocket
    const messageWithCorrectName = msg.senderRole === 'CUSTOMER' 
      ? { ...msg, senderName: displayCustomerName }
      : msg
    
    setMessages(prev => {
      // Xoá pending tạm (client) của CUSTOMER nếu server đã trả về bản thật
      let next = prev.filter(m => !(m.status === 'pending' && m.content === messageWithCorrectName.content && m.senderRole === messageWithCorrectName.senderRole && messageWithCorrectName.senderRole === 'CUSTOMER'))

      // Upsert theo id: nếu đã tồn tại -> replace, chưa có -> append
      const idx = next.findIndex(m => m.id === messageWithCorrectName.id)
      if (idx >= 0) {
        next = next.map((m, i) => i === idx ? { ...m, ...messageWithCorrectName } : m)
      } else {
        next = [...next, messageWithCorrectName]
      }
      return next
    })
  }, [conversationId, displayCustomerName])

  // Timeout handler cho AI messages - cập nhật PENDING -> SENT sau 30s
  useEffect(() => {
    const timeoutIds = new Map()
    
    messages.forEach(msg => {
      if (msg.senderRole === 'AI' && (msg.status === 'PENDING' || msg.status === 'pending')) {
        // Nếu đã có timeout cho message này thì không tạo mới
        if (timeoutIds.has(msg.id)) return
        
        const timeoutId = setTimeout(() => {
          markMessageAsSent(msg.id)
          console.warn(`AI message ${msg.id} timeout after 30s, marked as SENT`)
        }, 30000)
        
        timeoutIds.set(msg.id, timeoutId)
      }
    })
    
    // Cleanup timeouts khi component unmount hoặc messages thay đổi
    return () => {
      timeoutIds.forEach(timeoutId => clearTimeout(timeoutId))
      timeoutIds.clear()
    }
  }, [messages, markMessageAsSent])

  useChatWebSocket(conversationId ? `/topic/conversations/${conversationId}` : null, handleIncoming)

  // Fallback senderName for pending - chỉ chạy khi displayCustomerName thay đổi
  useEffect(() => {
    setMessages(prev => prev.map(m => (
      m.status === 'pending' && m.senderRole === 'CUSTOMER' && !m.senderName
        ? { ...m, senderName: displayCustomerName }
        : m
    )))
  }, [displayCustomerName])

  // Tính awaitingAI dựa trên trạng thái PENDING thực tế - memoized để tránh tính toán lại
  const nextAwaitingAI = useMemo(() => {
    const isPending = (st) => st === 'PENDING' || st === 'pending'
    const lastMsg = messages[messages.length - 1]
    const lastIsAiPending = lastMsg && lastMsg.senderRole === 'AI' && isPending(lastMsg.status)
    const lastCustomerPending = lastMsg && lastMsg.senderRole === 'CUSTOMER' && isPending(lastMsg.status)
    return lastIsAiPending || (chatMode === 'AI' && lastCustomerPending)
  }, [messages, chatMode])

  // Update awaitingAI chỉ khi cần thiết
  useEffect(() => {
    if (nextAwaitingAI !== awaitingAI) {
      setAwaitingAI(nextAwaitingAI)
    }
  }, [nextAwaitingAI, awaitingAI])

  // Send message - memoized để tránh re-create function
  const handleSend = useCallback(async () => {
    const text = input.trim()
    if (!text) return
    if (chatMode === 'AI' && awaitingAI) return

    setInput('')
    const tempId = `temp-${Date.now()}`
    
    // Sử dụng displayCustomerName (đã có fallback logic)
    const senderName = displayCustomerName
    
    setMessages(prev => ([
      ...prev,
      {
        id: tempId,
        conversationId: conversationId,
        senderName: senderName,
        senderRole: 'CUSTOMER',
        content: text,
        timestamp: new Date().toISOString(),
        status: 'pending'
      }
    ]))

    const params = {
      conversationId: conversationId,
      senderRole: 'CUSTOMER',
      content: text,
      lang: 'vi'
    }
    if (effectiveCustomerId) params.customerId = effectiveCustomerId

    // Timeout 30 giây để cập nhật trạng thái PENDING -> SENT
    const timeoutId = setTimeout(() => {
      markMessageAsSent(tempId)
      console.warn('AI response timeout after 30s, message marked as SENT')
    }, 30000)

    try {
      await chatApis.sendCustomerMessage(params)
      // Clear timeout nếu AI trả lời thành công
      clearTimeout(timeoutId)
    } catch (error) {
      // Clear timeout nếu có lỗi
      clearTimeout(timeoutId)
      setMessages(prev => ([
        ...prev.filter(m => m.id !== tempId),
        {
          id: Date.now() + 1,
          conversationId: conversationId,
          senderName: 'SYSTEM',
          content: error?.message || 'Gửi thất bại',
          timestamp: new Date().toISOString()
        }
      ]))
      setAwaitingAI(false)
    }
  }, [input, chatMode, awaitingAI, conversationId, effectiveCustomerId, displayCustomerName, markMessageAsSent])

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', py: 2, px: { xs: 1, md: 2 }, display: 'flex', flexDirection: 'column', height: '100dvh' }}>
      <Box sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 1, mb: 1, flexShrink: 0,
        px: 1, py: 1,
        borderBottom: '1px solid', borderColor: 'divider',
        bgcolor: 'background.paper',
        position: 'sticky', top: 0, zIndex: 1
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Quay lại danh sách">
            <IconButton onClick={() => navigate('/historyChat')}>
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="subtitle1" fontWeight={700}>GreenKitchen</Typography>
        </Box>
        <IconButton>
          <MoreVertIcon />
        </IconButton>
      </Box>

      <Paper
        elevation={3}
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          bgcolor: 'background.default',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box
          ref={listRef}
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            bgcolor: 'grey.50',
            py: 2,
            px: 1,
            borderRadius: 2,
            scrollBehavior: 'smooth',
          }}
        >
          {isLoading && hasMore && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}

          {filteredMessages
            .map((message, idx) => {
              const hasProducts = message.menu && Array.isArray(message.menu) && message.menu.length > 0
              if (hasProducts) {
                return (
                  <ProductMessageBubble
                    key={`${message.id}-${idx}`}
                    message={message}
                    customerName={displayCustomerName}
                  />
                )
              }
              return (
                <MessageBubble
                  key={`${message.id}-${idx}`}
                  message={message}
                  customerName={displayCustomerName}
                  isOwn={message.senderRole === 'CUSTOMER'}
                />
              )
            })}

          {awaitingAI && <TypingIndicator />}
        </Box>

        {/* Chat input */}
        <Paper
          elevation={3}
          sx={{
            position: 'sticky',
            bottom: 0,
            zIndex: 2,
            bgcolor: 'background.paper',
            boxShadow: '0 -2px 8px rgba(0,0,0,0.05)',
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <ChatInput
            input={input}
            setInput={setInput}
            handleSend={handleSend}
            disabled={chatMode === 'AI' && awaitingAI}
            chatMode={chatMode}
            awaitingAI={awaitingAI}
            isCustomerLoggedIn={isCustomerLoggedIn}
          />
        </Paper>
      </Paper>
    </Box>
  )
}


