import { useState, useEffect, useRef, useCallback } from 'react'
import { useSelector } from 'react-redux'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import MessageBubble from './MessageBubble'
import ProductMessageBubble from './ProductMessageBubble'
import ChatInput from './ChatInput'
import TypingIndicator from './TypingIndicator'

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
  const customerName = useSelector(state => state.customer.currentCustomer?.name)

  const chatAPI = getChatAPI(isCustomerLoggedIn)

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
  const listRef = useRef(null)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCustomerLoggedIn, customerId])

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationConvId, chatMode])

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages])

  // Expose messages to parent for menu extraction
  useEffect(() => {
    if (onMessagesUpdate) onMessagesUpdate(messages)
  }, [messages, onMessagesUpdate])

  // Infinite scroll load more
  const handleLoadMore = useCallback(() => {
    if (isLoading || !hasMore) return
    setIsLoading(true)
    chatAPI.fetchMessagesPaged(animationConvId, page + 1, PAGE_SIZE).then(data => {
      setMessages(prev => [...[...data.content].reverse(), ...prev])
      setPage(prev => prev + 1)
      setHasMore(!data.last)
      setIsLoading(false)
    })
  }, [animationConvId, page, hasMore, isLoading, chatAPI])

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const onScroll = () => {
      if (list.scrollTop === 0 && hasMore && !isLoading) handleLoadMore()
    }
    list.addEventListener('scroll', onScroll)
    return () => list.removeEventListener('scroll', onScroll)
  }, [handleLoadMore, hasMore, isLoading])

  // WebSocket incoming handler
  const handleIncoming = useCallback((msg) => {
    if (msg.conversationId && msg.conversationId !== animationConvId) {
      setAnimationConvId(msg.conversationId)
      if (!isCustomerLoggedIn) {
        localStorage.setItem('conversationId', msg.conversationId)
      }
    }
    setMessages(prev => {
      // Xoá pending tạm (client) của CUSTOMER nếu server đã trả về bản thật
      let next = prev.filter(m => !(m.status === 'pending' && m.content === msg.content && m.senderRole === msg.senderRole && msg.senderRole === 'CUSTOMER'))

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

  useChatWebSocket(animationConvId ? `/topic/conversations/${animationConvId}` : null, handleIncoming)
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
    setMessages(prev => prev.map(m => (
      m.status === 'pending' && m.senderRole === 'CUSTOMER' && !m.senderName
        ? { ...m, senderName: customerName || 'Bạn' }
        : m
    )))
  }, [customerName])

  // Tính awaitingAI chỉ dựa trên tin nhắn cuối cùng
  useEffect(() => {
    const isPending = (st) => st === 'PENDING' || st === 'pending'
    const lastMsg = messages[messages.length - 1]
    const lastIsAiPending = lastMsg && lastMsg.senderRole === 'AI' && isPending(lastMsg.status)
    const lastCustomerPending = lastMsg && lastMsg.senderRole === 'CUSTOMER' && isPending(lastMsg.status)
    const nextAwaiting = lastIsAiPending || (chatMode === 'AI' && lastCustomerPending)
    if (nextAwaiting !== awaitingAI) setAwaitingAI(nextAwaiting)
  }, [messages, chatMode, awaitingAI])

  // Send message
  const handleSend = useCallback(async () => {
    const text = input.trim()
    if (!text) return
    if (chatMode === 'AI' && awaitingAI) return

    setInput('')
    // awaitingAI sẽ được tính lại dựa trên message PENDING và AI PENDING từ server
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
      await chatAPI.sendMessage(params)
    } catch (error) {
      setMessages(prev => ([
        ...prev.filter(m => m.id !== tempId),
        {
          id: Date.now() + 1,
          conversationId: animationConvId,
          senderName: 'SYSTEM',
          content: error?.message || 'Gửi thất bại',
          timestamp: new Date().toISOString()
        }
      ]))
      setAwaitingAI(false)
    }
  }, [input, chatMode, awaitingAI, animationConvId, isCustomerLoggedIn, customerId, customerName, chatAPI])

  return (
    <>
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
        {isLoading && hasMore && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        {messages
          .filter(m => !(m.senderRole === 'AI' && (m.status === 'PENDING' || m.status === 'pending')))
          .map((message, idx) => {
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

function getChatAPI(isCustomerLoggedIn) {
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
}
