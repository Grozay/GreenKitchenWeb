import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import MessageBubble from './MessageBubble'
import ProductMessageBubble from './ProductMessageBubble'
import ChatInput from './ChatInput'
import TypingIndicator from './TypingIndicator'
import { selectCustomerName } from '~/redux/user/customerSlice'
import { useInfiniteScroll } from '~/hooks/useInfiniteScroll'
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
  fetchConversationStatus as userFetchConversationStatus,
  getConversations
} from '~/apis/chatAPICus'

export default function ChatPanel({ onMessagesUpdate }) {
  const isCustomerLoggedIn = useSelector(state => !!state.customer.currentCustomer)
  const customerId = useSelector(state => state.customer.currentCustomer?.id)
  const customerName = useSelector(selectCustomerName) // Sử dụng selector từ Redux

  // Memoize chatAPI để tránh tạo object mới mỗi lần render
  const chatAPI = useMemo(() => {
    if (isCustomerLoggedIn) {
      return {
        initConversation: null,
        sendMessage: userSendMessage,
        fetchMessagesPaged: userFetchMessagesPaged,
        fetchConversationStatus: userFetchConversationStatus,
        getConversations
      }
    }
    return {
      initConversation: guestInitConversation,
      sendMessage: guestSendMessage,
      fetchMessagesPaged: guestFetchMessagesPaged,
      fetchConversationStatus: guestFetchConversationStatus
    }
  }, [isCustomerLoggedIn])

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [chatMode, setChatMode] = useState('AI')
  const [awaitingAI, setAwaitingAI] = useState(false)
  const [conversationStatus, setConversationStatus] = useState('AI')
  const [animationConvId, setAnimationConvId] = useState(() => {
    if (!isCustomerLoggedIn) {
      return Number(localStorage.getItem('conversationId')) || null
    }
    return null
  })

  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingOlder, setIsLoadingOlder] = useState(false) // State riêng cho việc load tin nhắn cũ
  const listRef = useRef(null)
  const awaitingTimeoutRef = useRef(null)
  const PAGE_SIZE = 20

  // Initialize conversation ID and status
  useEffect(() => {
    if (!isCustomerLoggedIn) {
      let id = Number(localStorage.getItem('conversationId')) || null
      if (!id) {
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

    // Logged-in user: load latest conversation
    chatAPI.getConversations?.(customerId).then(convs => {
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
  }, [isCustomerLoggedIn, customerId, chatAPI])

  // Guest bootstrap if no conv id yet
  useEffect(() => {
    if (!animationConvId && !isCustomerLoggedIn) {
      guestInitConversation().then(id => {
        setAnimationConvId(id)
        localStorage.setItem('conversationId', id)
        guestFetchMessagesPaged(id, 0, PAGE_SIZE).then(data => {
          setMessages(data.content.reverse())
          setHasMore(!data.last)
        })
      })
    }
  }, [animationConvId, isCustomerLoggedIn])

  // Load messages on conv change or mode change
  useEffect(() => {
    if (!animationConvId) return
    setIsLoading(true)
    setPage(0)
    chatAPI.fetchMessagesPaged(animationConvId, 0, PAGE_SIZE).then(data => {
      setMessages([...data.content].reverse())
      setPage(0)
      setHasMore(!data.last)
      setIsLoading(false)
    })
  }, [animationConvId, chatMode, chatAPI, PAGE_SIZE])

  // Auto scroll to bottom when messages change - chỉ khi có messages mới
  useEffect(() => {
    if (messages.length > 0 && !isLoadingOlder && listRef.current) {
      // Chỉ scroll xuống khi không phải đang load tin nhắn cũ
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages.length, isLoadingOlder]) // Thêm isLoadingOlder vào dependency

  // Expose messages to parent for menu extraction - memoize để tránh re-render
  const memoizedOnMessagesUpdate = useCallback(() => {
    if (onMessagesUpdate) onMessagesUpdate(messages)
  }, [onMessagesUpdate, messages])

  useEffect(() => {
    memoizedOnMessagesUpdate()
  }, [memoizedOnMessagesUpdate])

  // Callback để load tin nhắn cũ - được sử dụng bởi useInfiniteScroll
  const loadMoreMessages = useCallback(async () => {
    try {
      const data = await chatAPI.fetchMessagesPaged(animationConvId, page + 1, PAGE_SIZE)
      
      // Cập nhật messages trước
      setMessages(prev => [...[...data.content].reverse(), ...prev])
      setPage(prev => prev + 1)
      setHasMore(!data.last)
      
    } catch (error) {
      console.error('Failed to load more messages:', error)
      setHasMore(false) // Set false nếu có lỗi
    }
  }, [animationConvId, page, chatAPI, PAGE_SIZE])

  // Sử dụng hook chung để xử lý infinite scroll
  // Hook phải được gọi ở top level của component
  const infiniteScrollHook = useInfiniteScroll({
    hasMore,
    isLoading: isLoadingOlder, // Sử dụng isLoadingOlder
    page,
    pageSize: PAGE_SIZE,
    onLoadMore: loadMoreMessages,
    listRef,
    sleepDelay: 500, // Sleep 0.5s trước khi load
    scrollRestoreDelay: 50, // Delay 50ms để khôi phục scroll
    setIsLoading: setIsLoadingOlder // Truyền callback để set loading state
  })

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const onScroll = () => {
      if (list.scrollTop === 0 && hasMore && !isLoadingOlder) loadMoreMessages()
    }
    list.addEventListener('scroll', onScroll)
    return () => list.removeEventListener('scroll', onScroll)
  }, [loadMoreMessages, hasMore, isLoadingOlder])

  // WebSocket incoming handler
  const handleIncoming = useCallback((msg) => {
    if (
      msg.conversationId &&
      Number(msg.conversationId) !== Number(animationConvId)
    ) {
      setAnimationConvId(msg.conversationId)
      if (!isCustomerLoggedIn) {
        localStorage.setItem('conversationId', msg.conversationId)
      }
    }
    setMessages(prev => {
      // Xoá pending tạm (client) của CUSTOMER nếu server đã trả về bản thật
      let next = prev.filter(m => !(
        m.status === 'pending' && 
        m.content === msg.content && 
        m.senderRole === msg.senderRole && 
        msg.senderRole === 'CUSTOMER'
      ))

      // Upsert theo id: nếu đã tồn tại -> replace, chưa có -> append
      const idx = next.findIndex(m => m.id === msg.id)
      if (idx >= 0) {
        next = next.map((m, i) => i === idx ? { ...m, ...msg } : m)
      } else {
        next = [...next, msg]
      }
      return next
    })
  }, [animationConvId, isCustomerLoggedIn])

  // FIX: Bỏ duplicate WebSocket subscription - ChatWidget đã handle
  // useChatWebSocket(animationConvId ? `/topic/conversations/${animationConvId}` : null, handleIncoming)
  useChatWebSocket('/topic/emp-notify', async (convId) => {
    const cid = typeof convId === 'object' ? convId.conversationId : convId
    if (Number(cid) === Number(animationConvId)) {
      try {
        const status = await chatAPI.fetchConversationStatus(animationConvId)
        setConversationStatus(status)
        setChatMode(status === 'EMP' ? 'EMP' : 'AI')
      } catch (e) {
        console.error('[WebSocket] Error fetching conversation status:', e)
        setConversationStatus('AI') // Fallback to AI mode on error
        setChatMode('AI')
      }
    }
  })

  // Fallback senderName for pending
  useEffect(() => {
    if (customerName) {
      setMessages(prev => prev.map(m => (
        m.status === 'pending' && m.senderRole === 'CUSTOMER' && !m.senderName
          ? { ...m, senderName: customerName }
          : m
      )))
    }
  }, [customerName])

  // Tính awaitingAI chỉ dựa trên tin nhắn cuối cùng - memoize để tránh tính toán lại
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

  // Send message
  const handleSend = useCallback(async () => {
    const text = input.trim()
    if (!text) return
    if (chatMode === 'AI' && awaitingAI) return

    setInput('')
    // Show AI waiting status immediately to avoid F5 on first time
    setAwaitingAI(true)
    // Fallback: if no response received for some reason, auto unlock after 30s
    if (awaitingTimeoutRef.current) clearTimeout(awaitingTimeoutRef.current)
    awaitingTimeoutRef.current = setTimeout(() => {
      setAwaitingAI(false)
    }, 30000)
    const tempId = `temp-${Date.now()}`
    setMessages(prev => ([
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
    ]))

    const params = {
      conversationId: animationConvId,
      senderRole: 'CUSTOMER',
      content: text,
      lang: 'vi'
    }
    if (isCustomerLoggedIn) params.customerId = customerId

    try {
      const resp = await chatAPI.sendMessage(params)
      const respConvId = resp?.conversationId
      if (!animationConvId && respConvId) {
        setAnimationConvId(respConvId)
        if (!isCustomerLoggedIn) {
          localStorage.setItem('conversationId', respConvId)
        }
      }
      // Backfill: lần đầu subscribe có thể chưa kịp nhận tin từ WS → refetch nhanh
      setTimeout(() => {
        const cid = respConvId || animationConvId
        if (!cid) return
        chatAPI.fetchMessagesPaged(cid, 0, PAGE_SIZE)
          .then(data => {
            setMessages([...data.content].reverse())
            setHasMore(!data.last)
            // Nếu đã có phản hồi, huỷ fallback lock
            if (awaitingTimeoutRef.current) {
              clearTimeout(awaitingTimeoutRef.current)
              awaitingTimeoutRef.current = null
            }
          })
          .catch(() => {})
      }, 300)
    } catch (error) {
      setMessages(prev => ([
        ...prev.filter(m => m.id !== tempId),
        {
          id: Date.now() + 1,
          conversationId: animationConvId,
          senderName: 'SYSTEM',
          content: error?.message || 'Send failed',
          timestamp: new Date().toISOString()
        }
      ]))
      setAwaitingAI(false)
    }
  }, [input, chatMode, awaitingAI, animationConvId, isCustomerLoggedIn, customerId, customerName, chatAPI])

  return (
    <>
      {/* Cleanup awaiting timeout on unmount */}
      {useEffect(() => {
        return () => {
          if (awaitingTimeoutRef.current) {
            clearTimeout(awaitingTimeoutRef.current)
            awaitingTimeoutRef.current = null
          }
        }
      }, [])}
      <Box
        ref={listRef}
        sx={{
          flex: 1,
          overflowY: 'auto',
          bgcolor: 'grey.50',
          py: 2,
          minHeight: 400,
          '&::-webkit-scrollbar': { width: 6 },
          '&::-webkit-scrollbar-thumb': { bgcolor: 'grey.400', borderRadius: 3 }
        }}
      >
        {/* Loading indicator cho tin nhắn cũ */}
        {isLoadingOlder && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
            <Box sx={{ ml: 1, color: 'text.secondary' }}>
              Loading older messages...
            </Box>
          </Box>
        )}

        {/* Loading indicator cho tin nhắn mới */}
        {isLoading && !isLoadingOlder && hasMore && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        {messages
          .filter(m => !(m.senderRole === 'AI' && (m.status === 'PENDING' || m.status === 'pending')))
          .map((message, idx) => {
            const hasMenu = Array.isArray(message.menu) && message.menu.length > 0
            return hasMenu ? (
              <ProductMessageBubble
                key={`${message.id}-${idx}`}
                message={message}
              />
            ) : (
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
      <ChatInput
        input={input}
        setInput={setInput}
        handleSend={handleSend}
        disabled={chatMode === 'AI' && awaitingAI}
        chatMode={chatMode}
        awaitingAI={awaitingAI}
        isCustomerLoggedIn={isCustomerLoggedIn}
      />
    </>
  )
}
