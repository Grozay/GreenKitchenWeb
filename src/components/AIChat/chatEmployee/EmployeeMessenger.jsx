
import React, { useEffect, useState, useRef, useCallback, useMemo, memo, Suspense, lazy, useTransition, useDeferredValue } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentEmployee } from '~/redux/user/employeeSlice'
import Box from '@mui/material/Box'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import Skeleton from '@mui/material/Skeleton'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Badge from '@mui/material/Badge'


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
  console.log('employeeId', employeeId)
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
  const [activeTab, setActiveTab] = useState('QUEUE')

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
  const isEmpCanChat = useMemo(() => {
    const canChat = deferredSelectedConv?.status === 'EMP' || 
      deferredSelectedConv?.status === 'WAITING_EMP' || 
      deferredSelectedConv?.status === 'AI'
    console.log('💬 isEmpCanChat check - status:', deferredSelectedConv?.status, 'canChat:', canChat)
    return canChat
  }, [deferredSelectedConv?.status])

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

  const queueConvs = useMemo(() => (
    (deferredConvs || []).filter(c => c.status === 'WAITING_EMP')
  ), [deferredConvs])

  const myConvs = useMemo(() => (
    (deferredConvs || []).filter(c => c.status === 'EMP' && c.employeeId === employeeId)
  ), [deferredConvs, employeeId])

  const handleTabChange = useCallback((e, val) => {
    setActiveTab(val)
    // reset selection when switching tabs
    setSelectedConv(null)
    setMessages([])
    setPage(0)
  }, [])

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
    // FIX: Hiển thị sidebar khi không có selectedConv hoặc showChat = false
    display: (!selectedConv && !showChat) ? 'block' : 'none',
    bgcolor: 'white'
  }), [selectedConv, showChat])

  const chatViewStyles = useMemo(() => {
    const shouldShow = selectedConv || showChat
    console.log('🎨 Chat view styles - selectedConv:', selectedConv, 'showChat:', showChat, 'shouldShow:', shouldShow)
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 1300,
      // FIX: Hiển thị chat khi có selectedConv hoặc showChat = true
      display: shouldShow ? 'flex' : 'none',
      flexDirection: 'column',
      bgcolor: 'white'
    }
  }, [selectedConv, showChat])

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
    
    // FIX: Fallback polling để đảm bảo nhận được updates (mỗi 10 giây)
    const pollTimer = setInterval(() => {
      if (isMounted.current && isInitialized) {
        console.log('🔄 Polling conversations for updates...')
        loadConvs()
      }
    }, 10000)
    
    // FIX: Polling tin nhắn cho conversation đang mở (mỗi 2 giây để nhanh hơn)
    const messagePollTimer = setInterval(() => {
      if (isMounted.current && selectedConvId && isInitialized) {
        console.log('🔄 Polling messages for conversation:', selectedConvId)
        fetchMessagesPaged(selectedConvId, 0, PAGE_SIZE).then(data => {
          if (isMounted.current) {
            setMessages([...data.content].reverse())
            setHasMore(!data.last)
          }
        }).catch(err => {
          console.error('Error polling messages:', err)
        })
      }
    }, 2000) // Tăng tần suất lên 2 giây để nhanh hơn
    
    return () => { 
      isMounted.current = false
      clearTimeout(renderTimer)
      clearTimeout(wsTimer)
      clearInterval(pollTimer)
      clearInterval(messagePollTimer)
    }
  }, [loadConvs, isInitialized])

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

  // Optimistic update for conversation status changes (moved up to avoid TDZ)
  const updateConversationStatus = useCallback((convId, newStatus, newEmployeeId = null) => {
    setConvs(prev => prev.map(conv => 
      conv.conversationId === convId 
        ? { ...conv, status: newStatus, employeeId: newEmployeeId }
        : conv
    ))
  }, [])

  // Optimized conversation selection with transitions
  const handleSelectConversation = useCallback(async (conv) => {
    console.log('🎯 Selecting conversation:', conv)
    try {
      // FIX: Claim trước, chỉ setSelectedConv sau khi claim thành công
      if (conv.status !== 'EMP') {
        console.log('📝 Claiming conversation:', conv.conversationId)
        // Optimistic update: move from Queue to My immediately
        updateConversationStatus(conv.conversationId, 'EMP', employeeId)
        try {
          await claimConversationAsEmp(conv.conversationId, employeeId)
          console.log('✅ Conversation claimed successfully')
        } catch (error) {
          console.log('❌ Failed to claim conversation:', error)
          // Revert on error
          updateConversationStatus(conv.conversationId, conv.status, null)
          
          // FIX: Handle specific error cases với better user feedback
          if (error.response?.status === 409) {
            const errorMsg = error.response?.data?.error || 'Conversation đã được claim bởi nhân viên khác'
            setSnackbar({ open: true, msg: errorMsg, sev: 'warning' })
            // Refresh conversation list to show current state
            await loadConvs()
            return // Don't proceed to select conversation
          }
          
          throw error
        }
        // Refresh to get latest data
        await loadConvs()
      }

      // FIX: Chỉ setSelectedConv sau khi claim thành công
      console.log('🎨 Setting selected conversation and starting chat view')
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

      // Start transition for messages loading
      startMessagesTransition(async () => {
        try {
          console.log('📥 Loading messages for conversation:', conv.conversationId)
          const data = await fetchMessagesPaged(conv.conversationId, 0, PAGE_SIZE)
          if (!isMounted.current) return

          console.log('📥 Loaded messages:', data.content.length, 'messages')
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
  }, [loadConvs, employeeId, isMobile, updateConversationStatus, startSelectionTransition, startMessagesTransition])

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
  }, [startSelectionTransition])

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
    console.log('💬 Attempting to send message:', text)
    console.log('💬 Conditions - text:', !!text, 'selectedConv:', !!deferredSelectedConv, 'canChat:', isEmpCanChat, 'sending:', isSending)
    
    if (!text || !deferredSelectedConv || !isEmpCanChat || isSending) {
      console.log('❌ Send blocked - missing conditions')
      return
    }
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
      console.log('📤 Sending message to API...')
      const resp = await sendMessage({
        conversationId: deferredSelectedConv.conversationId,
        senderRole: 'EMP',
        employeeId: employeeId,
        content: text,
        lang: 'vi'
      })
      console.log('✅ Message sent successfully:', resp)
      if (isMounted.current) {
        // FIX: Không append local echo vì WebSocket sẽ đẩy lại
        // setMessages(prev => [...prev, resp])
        setInput('')
        // FIX: Unlock send button ngay sau khi gửi thành công
        setIsSending(false)
        
        // FIX: Force refresh messages sau khi gửi để đảm bảo realtime
        setTimeout(() => {
          if (isMounted.current && selectedConvId) {
            console.log('🔄 Force refreshing messages after send')
            fetchMessagesPaged(selectedConvId, 0, PAGE_SIZE).then(data => {
              if (isMounted.current) {
                setMessages([...data.content].reverse())
                setHasMore(!data.last)
              }
            }).catch(err => {
              console.error('Error force refreshing messages:', err)
            })
          }
        }, 200) // Giảm delay xuống 200ms để nhanh hơn
        
        // FIX: Thêm một lần refresh nữa sau 1 giây để đảm bảo sync
        setTimeout(() => {
          if (isMounted.current && selectedConvId) {
            console.log('🔄 Second force refresh after send')
            fetchMessagesPaged(selectedConvId, 0, PAGE_SIZE).then(data => {
              if (isMounted.current) {
                setMessages([...data.content].reverse())
                setHasMore(!data.last)
              }
            }).catch(err => {
              console.error('Error second force refreshing messages:', err)
            })
          }
        }, 1000)
      }
    } catch (e) {
      console.log('❌ Failed to send message:', e)
      if (isMounted.current) {
        setSnackbar({ open: true, msg: 'Gửi thất bại.', sev: 'error' })
        // FIX: Remove failed message from tracking
        sentMessagesRef.current.delete(messageHash)
        // FIX: Unlock send button khi gửi thất bại
        setIsSending(false)
      }
      console.error(e)
    }
  }, [input, deferredSelectedConv, isEmpCanChat, isSending, employeeId, lastSendTime])

  // Release conversation to AI
  const handleReleaseToAI = useCallback(async () => {
    if (!deferredSelectedConv) return
    const convId = deferredSelectedConv.conversationId
    const originalStatus = deferredSelectedConv.status
    
    try {
      // Optimistic update: move from My back to Queue or remove
      updateConversationStatus(convId, 'WAITING_EMP', null)
      
      await releaseConversationToAI(convId)
      if (isMounted.current) {
        setSnackbar({ open: true, msg: 'Đã chuyển về AI!', sev: 'info' })
        
        // FIX: Reset UI state ngay sau khi release thành công
        setSelectedConv(null)
        setMessages([])
        setPage(0)
        setHasMore(true)
        setIsLoading(false)
        setIsSending(false)
        setInput('')
        
        // Refresh to get latest data
        await loadConvs()
      }
    } catch (e) {
      // Revert on error
      updateConversationStatus(convId, originalStatus, employeeId)
      if (isMounted.current) {
        setSnackbar({ open: true, msg: 'Không thể chuyển về AI!', sev: 'error' })
      }
    }
  }, [deferredSelectedConv, employeeId, updateConversationStatus, loadConvs])

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
    console.log('🔧 Processing WebSocket message:', msg)
    
    // FIX: Prevent duplicate messages by checking if message already exists
    if (isProcessingMessageRef.current) {
      console.log('Skipping duplicate WebSocket message:', msg.id)
      return
    }
    
    // FIX: Verify conversation hasn't changed (normalize id to number)
    const currentId = currentConversationRef.current != null ? Number(currentConversationRef.current) : null
    const incomingId = msg && msg.conversationId != null ? Number(msg.conversationId) : null
    if (currentId == null || incomingId == null || currentId !== incomingId) {
      console.log('Conversation changed, skipping message:', msg.id)
      return
    }
    
    isProcessingMessageRef.current = true
    
    // FIX: Process message immediately without delay
    setMessages(prev => {
      const messageExists = prev.some(existingMsg => 
        existingMsg.id === msg.id || 
        (existingMsg.content === msg.content && 
         existingMsg.senderRole === msg.senderRole &&
         Math.abs(new Date(existingMsg.timestamp) - new Date(msg.timestamp)) < 1000)
      )
      
      if (messageExists) {
        console.log('Message already exists, skipping:', msg.id)
        isProcessingMessageRef.current = false
        return prev
      }
      
      console.log('✅ Adding new message to list:', msg.id)
      return [...prev, msg]
    })
    
    // FIX: Refresh conversations immediately
    if (isMounted.current) {
      loadConvs() // Refresh conversations to update status 
    }
    
    // FIX: Reset processing flag immediately
    isProcessingMessageRef.current = false
  }, [loadConvs])

  // FIX: WebSocket listeners với cleanup và connection tracking - CHỈ SỬ DỤNG 1 TOPIC
  const wsTopic = useMemo(() => {
    // FIX: Subscribe ngay khi component mount, không chờ isWebSocketReady
    if (!isInitialized) return null
    
    // FIX: Sử dụng topic chung cho employee notifications
    return '/topic/emp-notify'
  }, [isInitialized])

  // FIX: WebSocket listeners - chỉ khởi tạo 1 connection
  useChatWebSocket(wsTopic, (data) => {
    console.log('🔔 WebSocket emp-notify received:', data)
    
    // Chấp nhận cả payload cũ (convId thuần) và mới (JSON có conversationId, status,...)
    const convId = typeof data === 'object' ? data.conversationId : data
    
    // Nếu payload mới có status → cập nhật danh sách conversations ngay để tránh chậm
    if (data && typeof data === 'object' && data.status) {
      console.log('📝 Updating conversation status:', convId, '->', data.status)
      setConvs(prev => prev.map(c => c.conversationId === convId ? { ...c, status: data.status } : c))
      
      // FIX: Refresh conversations list để đảm bảo data consistency
      setTimeout(() => {
        if (isMounted.current) {
          loadConvs()
        }
      }, 100)
    }
    
    if (convId) {
      handleWebSocketNotification(convId)
    }
  })

  // Subscribe realtime tin nhắn của conversation đang mở (không chờ isWebSocketReady)
  const convTopic = useMemo(() => {
    const topic = selectedConvId ? `/topic/conversations/${selectedConvId}` : null
    console.log('🔄 WebSocket topic changed:', topic, 'for conversation:', selectedConvId)
    return topic
  }, [selectedConvId])

  useChatWebSocket(convTopic, (msg) => {
    console.log('📨 WebSocket message received for conversation:', selectedConvId, msg)
    console.log('📨 Current selectedConv:', selectedConv)
    console.log('📨 Current selectedConvId:', selectedConvId)
    
    // FIX: Verify message belongs to current conversation
    const incomingId = msg && msg.conversationId != null ? Number(msg.conversationId) : null
    const currentId = selectedConvId != null ? Number(selectedConvId) : null
    if (!msg || incomingId == null || currentId == null || incomingId !== currentId) {
      console.log('❌ Message rejected - conversation mismatch:', msg?.conversationId, 'vs', selectedConvId)
      return
    }
    
    console.log('✅ Message accepted, processing...')
    
    // FIX: Process message immediately và force UI update
    handleWebSocketMessage(msg)
    
    // FIX: Force refresh ngay lập tức để đảm bảo UI sync
    if (isMounted.current && selectedConvId) {
      console.log('🔄 Immediate force refresh after WebSocket message')
      fetchMessagesPaged(selectedConvId, 0, PAGE_SIZE).then(data => {
        if (isMounted.current) {
          setMessages([...data.content].reverse())
          setHasMore(!data.last)
        }
      }).catch(err => {
        console.error('Error force refreshing after WebSocket:', err)
      })
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

  const conversationsToShow = activeTab === 'QUEUE' ? queueConvs : myConvs

  // Responsive layout cho mobile
  if (isMobile) {
    return (
      <>
        <Box sx={mobileContainerStyles}>
          {/* Tabs Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'white', px: 2 }}>
            <Tabs value={activeTab} onChange={handleTabChange} aria-label="chat tabs">
              <Tab
                value="QUEUE"
                label={<Badge color="error" badgeContent={queueConvs.length}>Queue</Badge>}
              />
              <Tab
                value="MY"
                label={<Badge color="primary" badgeContent={myConvs.length}>My</Badge>}
              />
            </Tabs>
          </Box>
          {/* Sidebar - hiển thị khi không có chat hoặc khi toggle */}
          <Box sx={sidebarDisplayStyles}>
            <Suspense fallback={<SidebarSkeleton />}> 
              <Sidebar
                conversations={conversationsToShow}
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
            
            {deferredSelectedConv && (
              <Suspense fallback={<ChatInputSkeleton />}>
                <ChatInput
                  input={input}
                  setInput={setInput}
                  onSend={handleSend}
                  disabled={conversationSelectionState.isDisabled}
                  isSending={isSending}
                />
              </Suspense>
            )}
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
          {/* Tabs Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'white', px: 2 }}>
            <Tabs value={activeTab} onChange={handleTabChange} aria-label="chat tabs">
              <Tab
                value="QUEUE"
                label={<Badge color="error" badgeContent={queueConvs.length}>Queue</Badge>}
              />
              <Tab
                value="MY"
                label={<Badge color="primary" badgeContent={myConvs.length}>My</Badge>}
              />
            </Tabs>
          </Box>
          <Suspense fallback={<SidebarSkeleton />}> 
            <Sidebar
              conversations={conversationsToShow}
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
          
          {deferredSelectedConv && (
            <Suspense fallback={<ChatInputSkeleton />}>
              <ChatInput
                input={input}
                setInput={setInput}
                onSend={handleSend}
                disabled={conversationSelectionState.isDisabled}
                isSending={isSending}
              />
            </Suspense>
          )}
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