
import React, { useEffect, useState, useRef, useCallback, useMemo, memo, Suspense, lazy, useTransition, useDeferredValue } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentEmployee } from '~/redux/user/employeeSlice'
import Box from '@mui/material/Box'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import Skeleton from '@mui/material/Skeleton'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

// Lazy load components với preloading để cải thiện LCP
const Sidebar = lazy(() => import('./Sidebar'))
const MessageList = lazy(() => import('./MessageList'))
const ChatInput = lazy(() => import('./ChatInput'))

// Preload critical components after initial render
const preloadComponents = () => {
  // Preload Sidebar after a short delay
  setTimeout(() => {
    import('./Sidebar')
  }, 200)
  
  // Preload MessageList after Sidebar
  setTimeout(() => {
    import('./MessageList')
  }, 400)
  
  // Preload ChatInput last
  setTimeout(() => {
    import('./ChatInput')
  }, 600)
}

import {
  fetchMessagesPaged,
  sendMessage,
  fetchEmployeeConversations,
  markConversationRead,
  releaseConversationToAI,
  claimConversationAsEmp
} from '~/apis/chatAPICus'
import { useChatWebSocket } from '~/hooks/useChatWebSocket'

const PAGE_SIZE = 20

// Loading skeleton cho Sidebar
const SidebarSkeleton = () => (
  <Box sx={{ 
    height: '100%', 
    bgcolor: 'white',
    p: 2
  }}>
    <Skeleton variant="text" width="80%" height={32} sx={{ mb: 3 }} />
    {[...Array(6)].map((_, index) => (
      <Box key={index} sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2, 
        mb: 2 
      }}>
        <Skeleton variant="circular" width={48} height={48} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="70%" height={20} />
          <Skeleton variant="text" width="50%" height={16} />
        </Box>
      </Box>
    ))}
  </Box>
)

// Loading skeleton cho MessageList
const MessageListSkeleton = () => (
  <Box sx={{ 
    flex: 1, 
    display: 'flex',
    flexDirection: 'column',
    p: 2,
    gap: 2
  }}>
    <Box sx={{ 
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 1
    }}>
      {[...Array(5)].map((_, index) => (
        <Box key={index} sx={{ 
          display: 'flex', 
          gap: 2, 
          p: 1,
          justifyContent: index % 2 === 0 ? 'flex-start' : 'flex-end'
        }}>
          <Skeleton 
            variant="rounded" 
            width={index % 2 === 0 ? '60%' : '40%'} 
            height={60} 
          />
        </Box>
      ))}
    </Box>
  </Box>
)

// Loading skeleton cho ChatInput
const ChatInputSkeleton = () => (
  <Box sx={{ 
    p: 2, 
    borderTop: '1px solid #e0e0e0',
    bgcolor: 'white'
  }}>
    <Skeleton variant="rounded" width="100%" height={56} />
  </Box>
)

const EmployeeMessenger = memo(() => {
  const employee = useSelector(selectCurrentEmployee)
  const employeeId = employee?.id
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'))
  
  const [convs, setConvs] = useState([])
  const [selectedConv, setSelectedConv] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [errMsg, setErrMsg] = useState('')
  const [snackbar, setSnackbar] = useState({ open: false, msg: '', sev: 'info' })
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile) // Trên mobile mặc định đóng
  const [showChat, setShowChat] = useState(false) // Trên mobile mặc định hiện danh sách
  const [lastSendTime, setLastSendTime] = useState(0) // Track last send time to prevent double send
  const [isInitialized, setIsInitialized] = useState(false) // Track initialization
  const [isWebSocketReady, setIsWebSocketReady] = useState(false) // Track WebSocket readiness

  // Performance optimization states
  const [isPendingSelection, startSelectionTransition] = useTransition()
  const [isPendingMessages, startMessagesTransition] = useTransition()
  
  // Deferred values for better performance
  const deferredSelectedConv = useDeferredValue(selectedConv)
  const deferredMessages = useDeferredValue(messages)
  const deferredConvs = useDeferredValue(convs)

  const isMounted = useRef(true)
  
  // FIX: Thêm refs để track WebSocket và prevent double send
  const wsConnectionRef = useRef(null)
  const lastMessageRef = useRef(null)
  const isProcessingMessageRef = useRef(false)
  const conversationChangeTimeRef = useRef(0)
  const sentMessagesRef = useRef(new Set()) // Track sent messages to prevent duplicates
  const currentConversationRef = useRef(null) // Track current conversation
  
  // Memoized computed values để tránh re-calculation
  const isEmpCanChat = useMemo(() => 
    deferredSelectedConv?.status === 'EMP' || 
    deferredSelectedConv?.status === 'WAITING_EMP' || 
    deferredSelectedConv?.status === 'AI', 
    [deferredSelectedConv?.status]
  )

  // Memoized conversation ID for WebSocket
  const selectedConvId = useMemo(() => 
    deferredSelectedConv?.conversationId, 
    [deferredSelectedConv?.conversationId]
  )

  // Memoized conversation selection state
  const conversationSelectionState = useMemo(() => ({
    hasSelectedConv: !!deferredSelectedConv,
    canChat: isEmpCanChat,
    isDisabled: !deferredSelectedConv || !isEmpCanChat || isSending
  }), [deferredSelectedConv, isEmpCanChat, isSending])

  // Memoized styles
  const mobileContainerStyles = useMemo(() => ({
    display: 'flex',
    width: '100%',
    height: '100%',
    bgcolor: '#f1f8e9',
    borderRadius: 0,
    overflow: 'hidden',
    position: 'relative'
  }), [])

  const desktopContainerStyles = useMemo(() => ({
    display: 'flex',
    width: '100%',
    height: '100%',
    bgcolor: '#f1f8e9',
    borderRadius: 2,
    overflow: 'hidden',
    boxShadow: 2,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
  }), [])

  const sidebarStyles = useMemo(() => ({
    width: sidebarOpen ? 320 : 0,
    height: '100%',
    minWidth: 0,
    transition: 'all 0.3s cubic-bezier(.4,0,.2,1)',
    overflow: 'hidden',
    position: 'relative',
    zIndex: 1200
  }), [sidebarOpen])

  const chatAreaStyles = useMemo(() => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0
  }), [])

  // Memoized sidebar display styles
  const sidebarDisplayStyles = useMemo(() => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1200,
    display: !showChat ? 'block' : 'none',
    bgcolor: 'white'
  }), [showChat])

  const chatViewStyles = useMemo(() => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1300,
    display: showChat ? 'flex' : 'none',
    flexDirection: 'column',
    bgcolor: 'white'
  }), [showChat])

  // Memoized snackbar state
  const snackbarState = useMemo(() => ({
    open: !!errMsg || snackbar.open,
    severity: errMsg ? 'error' : snackbar.sev,
    message: errMsg || snackbar.msg
  }), [errMsg, snackbar.open, snackbar.sev, snackbar.msg])

  // Fetch conversations list
  const loadConvs = useCallback(async () => {
    try {
      const conversations = await fetchEmployeeConversations()
      if (isMounted.current) {
        setConvs(conversations)
        setIsInitialized(true)
        
        // Start preloading components after conversations are loaded
        preloadComponents()
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
      if (isMounted.current) {
        setSnackbar({ open: true, msg: 'Không tải được danh sách hội thoại', sev: 'error' })
        setIsInitialized(true) // Mark as initialized even on error
        
        // Still preload components even on error
        preloadComponents()
      }
    }
  }, [])

  useEffect(() => {
    isMounted.current = true
    
    // Prioritize initial render over data loading
    const renderTimer = setTimeout(() => {
      // Start loading conversations
      loadConvs()
    }, 50) // Reduced delay for better LCP
    
    // Enable WebSocket after a longer delay to prioritize UI
    const wsTimer = setTimeout(() => {
      if (isMounted.current) {
        setIsWebSocketReady(true)
      }
    }, 300)
    
    return () => { 
      isMounted.current = false
      clearTimeout(renderTimer)
      clearTimeout(wsTimer)
    }
  }, [loadConvs])

  // FIX: Cleanup WebSocket connection khi chuyển conversation
  useEffect(() => {
    if (wsConnectionRef.current) {
      // Cleanup previous WebSocket connection
      wsConnectionRef.current = null
      isProcessingMessageRef.current = false
      lastMessageRef.current = null
    }
    
    // Set conversation change time để track khi nào conversation mới được chọn
    conversationChangeTimeRef.current = Date.now()
    
    // FIX: Clear sent messages tracking khi chuyển conversation
    sentMessagesRef.current.clear()
    
    // FIX: Update current conversation reference
    currentConversationRef.current = selectedConvId
    
    return () => {
      // Cleanup khi component unmount hoặc conversation thay đổi
      wsConnectionRef.current = null
      isProcessingMessageRef.current = false
      lastMessageRef.current = null
    }
  }, [selectedConvId])

  // Optimized conversation selection with transitions
  const handleSelectConversation = useCallback(async (conv) => {
    // Start transition for conversation selection
    startSelectionTransition(() => {
      setSelectedConv(conv)
      setMessages([])
      setPage(0)
      setIsLoading(true)
      
      // Trên mobile, chuyển sang view chat
      if (isMobile) {
        setShowChat(true)
      }
    })

    try {
      // If not EMP status, claim first
      if (conv.status !== 'EMP') {
        await claimConversationAsEmp(conv.conversationId, employeeId)
        await loadConvs()
      }

      // Start transition for messages loading
      startMessagesTransition(async () => {
        try {
          const data = await fetchMessagesPaged(conv.conversationId, 0, PAGE_SIZE)
          if (!isMounted.current) return

          setMessages([...data.content].reverse())
          setHasMore(!data.last)
          setIsLoading(false)

          // Mark as read
          if (conv.conversationId) {
            console.log('Marking conversation as read:', conv.conversationId)
            try {
              await markConversationRead(conv.conversationId)
              console.log('Successfully marked as read:', conv.conversationId)
              if (isMounted.current) {
                loadConvs()
              }
            } catch (err) {
              if (isMounted.current) {
                setSnackbar({ open: true, msg: 'Mark read thất bại!', sev: 'error' })
              }
              console.error('Mark read error:', err)
            }
          }
        } catch (err) {
          if (isMounted.current) {
            setErrMsg('Không thể chọn hội thoại này!')
            setIsLoading(false)
          }
        }
      })
    } catch (err) {
      if (isMounted.current) {
        setErrMsg('Không thể chọn hội thoại này!')
        setIsLoading(false)
      }
    }
  }, [loadConvs, employeeId, isMobile])

  // Xử lý quay lại danh sách chat
  const handleBackToList = useCallback(() => {
    startSelectionTransition(() => {
      setShowChat(false)
      setSelectedConv(null)
      setMessages([])
      setPage(0)
      setHasMore(true)
      setIsLoading(false)
      setIsSending(false)
      setInput('')
      
      // FIX: Reset WebSocket tracking
      wsConnectionRef.current = null
      isProcessingMessageRef.current = false
      lastMessageRef.current = null
      sentMessagesRef.current.clear()
      currentConversationRef.current = null
    })
  }, [])

  // Load more messages for infinite scroll
  const handleLoadMore = useCallback(() => {
    if (!deferredSelectedConv || !hasMore || isLoading) return
    setIsLoading(true)
    const lastMsgId = deferredMessages[0]?.id
    fetchMessagesPaged(deferredSelectedConv.conversationId, lastMsgId, PAGE_SIZE)
      .then(data => {
        if (!isMounted.current) return
        setMessages(prev => [...[...data.content].reverse(), ...prev])
        setHasMore(!data.last)
        setIsLoading(false)
      })
      .catch(() => {
        if (isMounted.current) {
          setErrMsg('Không tải thêm được tin nhắn')
          setIsLoading(false)
        }
      })
  }, [deferredSelectedConv, hasMore, isLoading, deferredMessages])

  // FIX: Cải thiện send message với duplicate prevention mạnh mẽ
  const handleSend = useCallback(async () => {
    const text = input.trim()
    if (!text || !deferredSelectedConv || !isEmpCanChat || isSending) return
    if (text.length > 2000) {
      setSnackbar({ open: true, msg: 'Tối đa 2000 ký tự.', sev: 'warning' })
      return
    }
    
    // FIX: Prevent double send trong 3 giây đầu sau khi chuyển conversation
    const now = Date.now()
    const timeSinceConvChange = now - conversationChangeTimeRef.current
    if (timeSinceConvChange < 3000) {
      console.log('Preventing double send - conversation too recent:', timeSinceConvChange, 'ms')
      return
    }
    
    // FIX: Prevent duplicate message content với hash tracking
    const messageHash = `${deferredSelectedConv.conversationId}-${text}-${now}`
    if (sentMessagesRef.current.has(messageHash)) {
      console.log('Preventing duplicate message hash:', messageHash)
      return
    }
    
    // FIX: Prevent duplicate message content trong 10 giây
    if (lastMessageRef.current === text && now - lastSendTime < 10000) {
      console.log('Preventing duplicate message content:', text)
      return
    }
    
    // FIX: Verify conversation hasn't changed
    if (currentConversationRef.current !== deferredSelectedConv.conversationId) {
      console.log('Conversation changed, preventing send')
      return
    }
    
    setIsSending(true)
    setLastSendTime(now)
    lastMessageRef.current = text
    
    // FIX: Add message hash to sent messages tracking
    sentMessagesRef.current.add(messageHash)
    
    try {
      const resp = await sendMessage({
        conversationId: deferredSelectedConv.conversationId,
        senderRole: 'EMP',
        employeeId: employeeId,
        content: text,
        lang: 'vi'
      })
      if (isMounted.current) {
        setMessages(prev => [...prev, resp])
        setInput('')
      }
    } catch (e) {
      if (isMounted.current) {
        setSnackbar({ open: true, msg: 'Gửi thất bại.', sev: 'error' })
        // FIX: Remove failed message from tracking
        sentMessagesRef.current.delete(messageHash)
      }
      console.error(e)
    }
    if (isMounted.current) {
      setIsSending(false)
    }
  }, [input, deferredSelectedConv, isEmpCanChat, isSending, employeeId, lastSendTime])

  // Release conversation to AI
  const handleReleaseToAI = useCallback(async () => {
    if (!deferredSelectedConv) return
    try {
      await releaseConversationToAI(deferredSelectedConv.conversationId)
      if (isMounted.current) {
        setSnackbar({ open: true, msg: 'Đã chuyển về AI!', sev: 'info' })
        setSelectedConv(null)
        loadConvs()
      }
    } catch (e) {
      if (isMounted.current) {
        setSnackbar({ open: true, msg: 'Không thể chuyển về AI!', sev: 'error' })
      }
    }
  }, [deferredSelectedConv, loadConvs])

  // Memoized snackbar close handler
  const handleSnackbarClose = useCallback(() => {
    setErrMsg('')
    setSnackbar(prev => ({ ...prev, open: false }))
  }, [])

  // Memoized sidebar toggle handler
  const handleSidebarToggle = useCallback(() => {
    setSidebarOpen(prev => !prev)
  }, [])

  // FIX: Cải thiện WebSocket notification handler với duplicate prevention
  const handleWebSocketNotification = useCallback((convId) => {
    if (deferredSelectedConv?.conversationId === convId) {
      markConversationRead(convId).then(() => {
        if (isMounted.current) {
          loadConvs()
        }
      })
    } else {
      if (isMounted.current) {
        loadConvs()
      }
    }
  }, [deferredSelectedConv?.conversationId, loadConvs])

  // FIX: Cải thiện WebSocket message handler với duplicate prevention mạnh mẽ
  const handleWebSocketMessage = useCallback((msg) => {
    // FIX: Prevent duplicate messages by checking if message already exists
    if (isProcessingMessageRef.current) {
      console.log('Skipping duplicate WebSocket message:', msg.id)
      return
    }
    
    // FIX: Verify conversation hasn't changed
    if (currentConversationRef.current !== msg.conversationId) {
      console.log('Conversation changed, skipping message:', msg.id)
      return
    }
    
    isProcessingMessageRef.current = true
    
    setMessages(prev => {
      const messageExists = prev.some(existingMsg => 
        existingMsg.id === msg.id || 
        (existingMsg.content === msg.content && 
         existingMsg.senderRole === msg.senderRole &&
         Math.abs(new Date(existingMsg.createdAt) - new Date(msg.createdAt)) < 1000)
      )
      
      if (messageExists) {
        console.log('Message already exists, skipping:', msg.id)
        return prev
      }
      
      return [...prev, msg]
    })
    
    if (isMounted.current) {
      loadConvs() // Refresh conversations to update status 
    }
    
    // Reset processing flag after a short delay
    setTimeout(() => {
      isProcessingMessageRef.current = false
    }, 100)
  }, [loadConvs])

  // FIX: WebSocket listeners với cleanup và connection tracking - CHỈ SỬ DỤNG 1 TOPIC
  const wsTopic = useMemo(() => {
    // FIX: Chỉ sử dụng 1 WebSocket connection cho tất cả notifications
    if (!isInitialized || !isWebSocketReady) return null
    
    // FIX: Sử dụng topic chung cho employee notifications
    return '/topic/emp-notify'
  }, [isInitialized, isWebSocketReady])

  // FIX: WebSocket listeners - chỉ khởi tạo 1 connection
  useChatWebSocket(wsTopic, (data) => {
    // FIX: Handle cả notification và message trong 1 handler
    if (data.type === 'MESSAGE' && data.conversationId === selectedConvId) {
      handleWebSocketMessage(data)
    } else if (data.type === 'NOTIFICATION') {
      handleWebSocketNotification(data.conversationId)
    }
  })

  // Clear selected conversation if it's removed from list
  useEffect(() => {
    if (!deferredSelectedConv) return
    if (!deferredConvs.some(c => c.conversationId === deferredSelectedConv.conversationId)) {
      setSelectedConv(null)
      setMessages([])
    }
  }, [deferredConvs, deferredSelectedConv])

  // Update selected conversation if it changes in the list
  useEffect(() => {
    if (!deferredSelectedConv) return
    const found = deferredConvs.find(c => c.conversationId === deferredSelectedConv.conversationId)
    if (found) setSelectedConv(found)
  }, [deferredConvs, deferredSelectedConv])

  // Responsive layout cho mobile
  if (isMobile) {
    return (
      <>
        <Box sx={mobileContainerStyles}>
          {/* Sidebar - hiển thị khi không có chat hoặc khi toggle */}
          <Box sx={sidebarDisplayStyles}>
            <Suspense fallback={<SidebarSkeleton />}>
              <Sidebar
                conversations={deferredConvs}
                selectedConv={deferredSelectedConv}
                onSelectConversation={handleSelectConversation}
                isOpen={true}
                onToggle={() => {}}
                isPending={isPendingSelection}
              />
            </Suspense>
          </Box>
          
          {/* Chat view - hiển thị khi có conversation được chọn */}
          <Box sx={chatViewStyles}>
            <Suspense fallback={<MessageListSkeleton />}>
              <MessageList
                selectedConv={deferredSelectedConv}
                messages={deferredMessages}
                isLoading={isLoading || isPendingMessages}
                hasMore={hasMore}
                onLoadMore={handleLoadMore}
                onReleaseToAI={handleReleaseToAI}
                isEmpCanChat={isEmpCanChat}
                onBack={handleBackToList}
                isPending={isPendingMessages}
              />
            </Suspense>
            
            <Suspense fallback={<ChatInputSkeleton />}>
              <ChatInput
                input={input}
                setInput={setInput}
                onSend={handleSend}
                disabled={conversationSelectionState.isDisabled}
                isSending={isSending}
              />
            </Suspense>
          </Box>
        </Box>

        <Snackbar
          open={snackbarState.open}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
        >
          <Alert severity={snackbarState.severity}>
            {snackbarState.message}
          </Alert>
        </Snackbar>
      </>
    )
  }

  // Desktop layout
  return (
    <>
      <Box sx={desktopContainerStyles}>
        {/* Sidebar */}
        <Box sx={sidebarStyles}>
          <Suspense fallback={<SidebarSkeleton />}>
            <Sidebar
              conversations={deferredConvs}
              selectedConv={deferredSelectedConv}
              onSelectConversation={handleSelectConversation}
              isOpen={sidebarOpen}
              onToggle={handleSidebarToggle}
              isPending={isPendingSelection}
            />
          </Suspense>
        </Box>
        
        {/* Chat area */}
        <Box sx={chatAreaStyles}>
          <Suspense fallback={<MessageListSkeleton />}>
            <MessageList
              selectedConv={deferredSelectedConv}
              messages={deferredMessages}
              isLoading={isLoading || isPendingMessages}
              hasMore={hasMore}
              onLoadMore={handleLoadMore}
              onReleaseToAI={handleReleaseToAI}
              isEmpCanChat={isEmpCanChat}
              onBack={handleBackToList}
              isPending={isPendingMessages}
            />
          </Suspense>
          
          <Suspense fallback={<ChatInputSkeleton />}>
            <ChatInput
              input={input}
              setInput={setInput}
              onSend={handleSend}
              disabled={conversationSelectionState.isDisabled}
              isSending={isSending}
            />
          </Suspense>
        </Box>
      </Box>

      <Snackbar
        open={snackbarState.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert severity={snackbarState.severity}>
          {snackbarState.message}
        </Alert>
      </Snackbar>
    </>
  )
})

EmployeeMessenger.displayName = 'EmployeeMessenger'

export default EmployeeMessenger