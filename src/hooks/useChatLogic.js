import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import {
  scrollToBottom,
  handleLoadMoreMessages,
  handleWebSocketMessage,
  createPendingMessage,
  createSystemMessage,
  filterPendingMessages,
  canSendMessage,
  createMessageTimeout,
  clearMessageTimeout,
  updateMessageStatus
} from '~/utils/chatUtils'
import { useInfiniteScroll } from './useInfiniteScroll'
import { selectCustomerName } from '~/redux/user/customerSlice'

export const useChatLogic = ({
  conversationId,
  initialMode = 'AI',
  pageSize = 20,
  chatAPI,
  onMessagesUpdate
}) => {
  const isCustomerLoggedIn = useSelector(state => !!state.customer.currentCustomer)
  const customerId = useSelector(state => state.customer.currentCustomer?.id)
  const customerName = useSelector(selectCustomerName) // Sử dụng selector từ Redux

  // State management
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [chatMode, setChatMode] = useState(initialMode)
  const [awaitingAI, setAwaitingAI] = useState(false)
  const [conversationStatus, setConversationStatus] = useState('AI')
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingOlder, setIsLoadingOlder] = useState(false) // State riêng cho việc load tin nhắn cũ
  
  // Refs
  const listRef = useRef(null)
  const timeoutRefs = useRef(new Map())
  // scrollPositionRef đã được xử lý bởi useInfiniteScroll hook

  // Memoize chatAPI để tránh re-render không cần thiết
  const memoizedChatAPI = useMemo(() => chatAPI, [chatAPI])

  // Load messages khi conversationId hoặc chatMode thay đổi
  useEffect(() => {
    if (!conversationId) return
    
    setIsLoading(true)
    setPage(0)
    
    memoizedChatAPI.fetchMessagesPaged(conversationId, 0, pageSize).then((data) => {
      setMessages([...data.content].reverse())
      setPage(0)
      setHasMore(!data.last)
      setIsLoading(false)
    }).catch(error => {
      console.error('Failed to load messages:', error)
      setIsLoading(false)
    })
  }, [conversationId, chatMode, memoizedChatAPI, pageSize])

  // Auto scroll cuối khi messages thay đổi - chỉ khi có messages mới
  useEffect(() => {
    if (messages.length > 0 && !isLoadingOlder) {
      // Chỉ scroll xuống khi không phải đang load tin nhắn cũ
      scrollToBottom(listRef)
    }
  }, [messages.length, isLoadingOlder]) // Thêm isLoadingOlder vào dependency

  // Expose messages to parent nếu cần - memoize để tránh re-render
  const memoizedOnMessagesUpdate = useCallback(() => {
    if (onMessagesUpdate) {
      onMessagesUpdate(messages)
    }
  }, [onMessagesUpdate, messages])

  useEffect(() => {
    memoizedOnMessagesUpdate()
  }, [memoizedOnMessagesUpdate])

  // Callback để load tin nhắn cũ - được sử dụng bởi useInfiniteScroll
  const loadMoreMessages = useCallback(async () => {
    // Không set loading state ở đây vì useInfiniteScroll sẽ xử lý
    try {
      await handleLoadMoreMessages(
        conversationId,
        page,
        pageSize,
        memoizedChatAPI.fetchMessagesPaged,
        setMessages,
        setPage,
        setHasMore,
        setIsLoadingOlder, // Sử dụng setIsLoadingOlder
        isLoadingOlder, // Sử dụng isLoadingOlder
        hasMore
      )
    } catch (error) {
      console.error('Failed to load more messages:', error)
      setHasMore(false)
    }
  }, [conversationId, page, hasMore, isLoadingOlder, memoizedChatAPI, pageSize])

  // Sử dụng hook chung để xử lý infinite scroll
  // Hook phải được gọi ở top level của component
  const infiniteScrollHook = useInfiniteScroll({
    hasMore,
    isLoading: isLoadingOlder, // Sử dụng isLoadingOlder
    page,
    pageSize,
    onLoadMore: loadMoreMessages,
    listRef,
    sleepDelay: 500, // Sleep 0.5s trước khi load
    scrollRestoreDelay: 50, // Delay 50ms để khôi phục scroll
    setIsLoading: setIsLoadingOlder // Truyền callback để set loading state
  })

  // Expose handleLoadMore function để parent component có thể sử dụng
  const handleLoadMore = useCallback(() => {
    // Gọi trực tiếp loadMoreMessages nếu cần
    if (!isLoadingOlder && hasMore) {
      loadMoreMessages()
    }
  }, [isLoadingOlder, hasMore, loadMoreMessages])

  // Scroll listener đã được xử lý bởi useInfiniteScroll hook

  // Fallback senderName cho pending messages - chỉ chạy khi customerName thay đổi
  useEffect(() => {
    if (customerName) {
      setMessages(prev =>
        prev.map(m =>
          m.status === 'pending' && m.senderRole === 'CUSTOMER' && !m.senderName
            ? { ...m, senderName: customerName }
            : m
        )
      )
    }
  }, [customerName])

  // Xử lý tin nhắn từ websocket - memoize dependencies
  const handleIncoming = useCallback((msg) => {
    handleWebSocketMessage(
      msg,
      conversationId,
      isCustomerLoggedIn,
      setMessages,
      () => {} // setAnimationConvId không cần thiết ở đây
    )
  }, [conversationId, isCustomerLoggedIn])

  // Tính awaitingAI dựa trên trạng thái của tin nhắn cuối cùng - memoize để tránh tính toán lại
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

  // Gửi tin nhắn - memoize dependencies
  const handleSend = useCallback(async () => {
    const validation = canSendMessage(chatMode, awaitingAI, isCustomerLoggedIn, input)
    if (!validation) return

    const text = input.trim()
    setInput('')

    // Tạo pending message và set awaitingAI ngay để tránh bỏ lỡ AI lần đầu
    const pendingMessage = createPendingMessage(conversationId, text, customerName, customerId)
    setMessages(prev => [...prev, pendingMessage])
    setAwaitingAI(true)

    // Tạo timeout cho message
    const timeoutId = createMessageTimeout(pendingMessage.id, 30000, (msgId) => {
      setMessages(prev => updateMessageStatus(prev, msgId, 'SENT'))
      setAwaitingAI(false)
      console.warn(`Message ${msgId} timeout after 30s, marked as SENT`)
    })
    
    timeoutRefs.current.set(pendingMessage.id, timeoutId)

    const params = {
      conversationId,
      senderRole: 'CUSTOMER',
      content: text,
      lang: 'vi'
    }
    
    if (isCustomerLoggedIn) {
      params.customerId = customerId
    }

    try {
      const resp = await memoizedChatAPI.sendMessage(params)
      const respConvId = resp?.conversationId
      // Nếu lần đầu chưa có conversationId từ props, đồng bộ lại để subscribe WS đúng topic
      if (!conversationId && respConvId) {
        // Không có setter ở hook này, parent nên cập nhật conversationId
        // Tuy nhiên ta vẫn dùng respConvId để backfill tạm thời
      }
      // Clear timeout nếu thành công
      clearMessageTimeout(timeoutId)
      timeoutRefs.current.delete(pendingMessage.id)
      // Backfill nhanh sau khi send để lấy AI message nếu WS chưa kịp
      setTimeout(() => {
        const cid = respConvId || conversationId
        if (!cid) return
        memoizedChatAPI.fetchMessagesPaged(cid, 0, pageSize)
          .then((data) => {
            setMessages([...data.content].reverse())
            setHasMore(!data.last)
          })
          .catch(() => {})
      }, 300)
    } catch (error) {
      // Clear timeout nếu có lỗi
      clearMessageTimeout(timeoutId)
      timeoutRefs.current.delete(pendingMessage.id)
      
      // Thêm system message lỗi
      const errorMessage = createSystemMessage(conversationId, error?.message || 'Gửi thất bại')
      setMessages(prev => [
        ...prev.filter(m => m.id !== pendingMessage.id),
        errorMessage
      ])
      setAwaitingAI(false)
    }
  }, [
    input, chatMode, awaitingAI, conversationId,
    isCustomerLoggedIn, customerId, customerName, memoizedChatAPI
  ])

  // Cleanup timeouts khi component unmount
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(timeoutId => clearMessageTimeout(timeoutId))
      timeoutRefs.current.clear()
    }
  }, [])

  // Filtered messages (loại bỏ AI pending) - memoize để tránh tính toán lại
  const filteredMessages = useMemo(() => 
    filterPendingMessages(messages), 
    [messages]
  )

  return {
    // State
    messages: filteredMessages,
    input,
    chatMode,
    awaitingAI,
    conversationStatus,
    isLoading,
    isLoadingOlder, // Thêm isLoadingOlder vào return
    hasMore,
    
    // Actions
    setInput,
    handleSend,
    handleLoadMore,
    
    // Refs
    listRef,
    
    // Handlers
    handleIncoming,
    
    // Utils
    isCustomerLoggedIn,
    customerName
  }
}
