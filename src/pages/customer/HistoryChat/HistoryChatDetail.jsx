import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useNavigate, useParams } from 'react-router-dom'
import MessageBubble from '~/pages/customer/ChatPage/MessageBubble'
import ProductMessageBubble from '~/pages/customer/ChatPage/ProductMessageBubble'
import ChatInput from '~/pages/customer/ChatPage/ChatInput'
import TypingIndicator from '~/pages/customer/ChatPage/TypingIndicator'
import { useChatWebSocket } from '~/hooks/useChatWebSocket'
import { useInfiniteScroll } from '~/hooks/useInfiniteScroll'
import { chatApis, fetchMessagesPaged } from '~/apis/chatAPICus'
import { Fade } from '@mui/material'
import { selectCurrentCustomer, selectCustomerName, selectIsCustomerLoggedIn } from '~/redux/user/customerSlice'
import { 
  scrollToBottom, 
  createPendingMessage, 
  createSystemMessage, 
  filterPendingMessages,
  updateMessageStatus,
  canSendMessage
} from '~/utils/chatUtils'

export default function HistoryChatDetail() {
  const navigate = useNavigate()
  const { conversationId } = useParams()
  const currentCustomer = useSelector(selectCurrentCustomer)
  const isCustomerLoggedIn = useSelector(selectIsCustomerLoggedIn)
  const customerId = currentCustomer?.id
  const customerName = useSelector(selectCustomerName) // Sử dụng selector từ Redux

  // Use customerName directly from Redux - simplified
  const displayCustomerName = customerName || 'You'
  const effectiveCustomerId = customerId

  // Utility function để cập nhật trạng thái message thành SENT
  const markMessageAsSent = useCallback((messageId) => {
    setMessages(prev => updateMessageStatus(prev, messageId, 'SENT'))
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
    filterPendingMessages(messages),
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

  // Auto scroll to bottom when messages change - chỉ khi có messages mới
  useEffect(() => {
    if (messages.length > 0 && !isLoading) {
      // Chỉ scroll xuống khi không phải đang load tin nhắn cũ
      scrollToBottom(listRef)
    }
  }, [messages.length, isLoading]) // Thêm isLoading vào dependency

  // Callback để load tin nhắn cũ - được sử dụng bởi useInfiniteScroll
  const loadMoreMessages = useCallback(async () => {
    try {
      const data = await fetchMessagesPaged(conversationId, page + 1, PAGE_SIZE)
      
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
      
      // Cập nhật messages trước
      setMessages(prev => [...[...messagesWithCorrectNames].reverse(), ...prev])
      setPage(prev => prev + 1)
      setHasMore(!data.last)
      
    } catch (error) {
      console.error('Failed to load more messages:', error)
      setHasMore(false) // Set false nếu có lỗi
    }
  }, [conversationId, page, displayCustomerName, PAGE_SIZE])

  // Sử dụng hook chung để xử lý infinite scroll
  // Hook phải được gọi ở top level của component
  const infiniteScrollHook = useInfiniteScroll({
    hasMore,
    isLoading,
    page,
    pageSize: PAGE_SIZE,
    onLoadMore: loadMoreMessages,
    listRef,
    sleepDelay: 500, // Sleep 0.5s trước khi load
    scrollRestoreDelay: 50, // Delay 50ms để khôi phục scroll
    setIsLoading // Truyền callback để set loading state
  })

  // Scroll dependencies đã được xử lý bởi useInfiniteScroll hook

  // WebSocket incoming handler
  const handleIncoming = useCallback((msg) => {
    if (Number(msg.conversationId) !== Number(conversationId)) return
    
    // Override senderName cho CUSTOMER messages từ WebSocket
    const messageWithCorrectName = msg.senderRole === 'CUSTOMER' 
      ? { ...msg, senderName: displayCustomerName }
      : msg
    
    setMessages(prev => {
      // Xoá pending tạm (client) của CUSTOMER nếu server đã trả về bản thật
      let next = prev.filter(m => !(
        m.status === 'pending' && 
        m.content === messageWithCorrectName.content && 
        m.senderRole === messageWithCorrectName.senderRole && 
        messageWithCorrectName.senderRole === 'CUSTOMER'
      ))

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

  useChatWebSocket(conversationId ? `/topic/conversations/${conversationId}` : null, handleIncoming)

  // Fallback senderName for pending - chỉ chạy khi displayCustomerName thay đổi
  useEffect(() => {
    if (displayCustomerName) {
      setMessages(prev => prev.map(m => (
        m.status === 'pending' && m.senderRole === 'CUSTOMER' && !m.senderName
          ? { ...m, senderName: displayCustomerName }
          : m
      )))
    }
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
    const validation = canSendMessage(chatMode, awaitingAI, isCustomerLoggedIn, input)
    if (!validation) return

    const text = input.trim()
    setInput('')
    
    // Sử dụng utility function để tạo pending message
    const pendingMessage = createPendingMessage(conversationId, text, displayCustomerName, effectiveCustomerId)
    setMessages(prev => ([...prev, pendingMessage]))

    const params = {
      conversationId: conversationId,
      senderRole: 'CUSTOMER',
      content: text,
      lang: 'vi'
    }
    if (effectiveCustomerId) params.customerId = effectiveCustomerId

    // Timeout 30 giây để cập nhật trạng thái PENDING -> SENT
    const timeoutId = setTimeout(() => {
      markMessageAsSent(pendingMessage.id)
      console.warn('AI response timeout after 30s, message marked as SENT')
    }, 30000)

    try {
      await chatApis.sendCustomerMessage(params)
      // Clear timeout nếu AI trả lời thành công
      clearTimeout(timeoutId)
    } catch (error) {
      // Clear timeout nếu có lỗi
      clearTimeout(timeoutId)
      
      // Use utility function to create error system message
      const errorMessage = createSystemMessage(conversationId, error?.message || 'Send failed')
      setMessages(prev => ([
        ...prev.filter(m => m.id !== pendingMessage.id),
        errorMessage
      ]))
      setAwaitingAI(false)
    }
  }, [input, chatMode, awaitingAI, conversationId, effectiveCustomerId, displayCustomerName, markMessageAsSent])

  return (
    <Box sx={{ 
      maxWidth: 1000, 
      mx: 'auto', 
      py: 1, // Giảm padding từ 2 xuống 1
      px: { xs: 1, md: 2 }, 
      display: 'flex', 
      flexDirection: 'column', 
      height: 'calc(100vh - 120px)', // Trừ đi chiều cao của ProfileNavBar (khoảng 120px)
      maxHeight: 'calc(100vh - 120px)',
      overflow: 'hidden'
    }}>
      <Box sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 1, mb: 1, flexShrink: 0,
        px: 1, py: 1,
        borderBottom: '1px solid', borderColor: 'divider',
        bgcolor: (t) => t.palette.mode === 'light' ? 'rgba(255,255,255,0.75)' : 'rgba(17,24,39,0.5)',
        backdropFilter: 'saturate(180%) blur(10px)',
        position: 'sticky', top: 0, zIndex: 1
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Back to list">
            <IconButton onClick={() => navigate('/agent')} sx={{ transition: 'transform .15s ease', '&:hover': { transform: 'translateX(-2px)' } }}>
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="subtitle1" fontWeight={700}>Chat Conversation #{conversationId}</Typography>
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
            py: 1, // Giảm padding từ 2 xuống 1
            px: 1,
            borderRadius: 2,
            scrollBehavior: 'smooth',
            '&::-webkit-scrollbar': { width: 6 },
            '&::-webkit-scrollbar-thumb': { bgcolor: 'divider', borderRadius: 3 }
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
            boxShadow: '0 -6px 20px rgba(0,0,0,0.06)',
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


