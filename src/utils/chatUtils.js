import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import PersonIcon from '@mui/icons-material/Person'
import InfoIcon from '@mui/icons-material/Info'
import SmartToyIcon from '@mui/icons-material/SmartToy' // Icon mới cho AI
import HeadsetIcon from '@mui/icons-material/Headset' // Icon mới cho Employee

// ===== CHAT AVATAR CONFIGURATION =====
// Easy to change avatar for each sender type
export const CHAT_AVATARS = {
  CUSTOMER: {
    icon: PersonIcon,
    bgcolor: 'primary.main',
    color: '#fff'
  },
  AI: {
    icon: SmartToyIcon, // Thay đổi icon AI ở đây
    bgcolor: '#6366f1', // Màu xanh dương cho AI
    color: '#fff'
  },
  EMP: {
    icon: HeadsetIcon, // Thay đổi icon Employee ở đây
    bgcolor: '#059669', // Màu xanh lá cho Employee
    color: '#fff'
  },
  SYSTEM: {
    icon: InfoIcon,
    bgcolor: '#f59e0b',
    color: '#fff'
  }
}

// Function to get avatar config by sender role
export const getAvatarConfig = (senderRole) => {
  return CHAT_AVATARS[senderRole] || CHAT_AVATARS.SYSTEM
}

// Function to render avatar component - returns necessary info, not JSX
export const getAvatarInfo = (senderRole, size = 'medium') => {
  const config = getAvatarConfig(senderRole)
  const IconComponent = config.icon
  
  const sizeMap = {
    small: { width: 28, height: 28, fontSize: 'small' },
    medium: { width: 36, height: 36, fontSize: 'medium' },
    large: { width: 44, height: 44, fontSize: 'large' }
  }
  
  const sizeConfig = sizeMap[size] || sizeMap.medium
  
  return {
    IconComponent, // Trả về component class, không phải JSX
    bgcolor: config.bgcolor,
    color: config.color,
    width: sizeConfig.width,
    height: sizeConfig.height,
    fontSize: sizeConfig.fontSize
  }
}

// ===== SENDER NAME CONFIGURATION =====
export const SENDER_NAMES = {
  CUSTOMER: (customerName) => customerName || 'You',
  AI: 'AI GreenKitchen',
  EMP: 'GreenKitchen Employee',
  SYSTEM: 'System'
}

export const getSenderName = (senderRole, customerName = '') => {
  if (senderRole === 'CUSTOMER') {
    return SENDER_NAMES.CUSTOMER(customerName)
  }
  return SENDER_NAMES[senderRole] || SENDER_NAMES.SYSTEM
}

// ===== SCROLL UTILITIES =====
export const scrollToBottom = (ref, smooth = true) => {
  if (ref?.current) {
    const scrollOptions = {
      top: ref.current.scrollHeight,
      behavior: smooth ? 'smooth' : 'auto'
    }
    ref.current.scrollTo(scrollOptions)
  }
}

export const scrollToTop = (ref, smooth = true) => {
  if (ref?.current) {
    const scrollOptions = {
      top: 0,
      behavior: smooth ? 'smooth' : 'auto'
    }
    ref.current.scrollTo(scrollOptions)
  }
}

// Utility function để giữ vị trí scroll khi prepend messages
export const maintainScrollPosition = (ref, oldScrollTop, oldScrollHeight) => {
  console.log('chatUtils: maintainScrollPosition called', {
    ref: ref?.current ? 'available' : 'null',
    oldScrollTop,
    oldScrollHeight
  })
  
  if (!ref?.current) {
    console.log('chatUtils: No ref available')
    return
  }
  
  const newScrollHeight = ref.current.scrollHeight
  const heightDifference = newScrollHeight - oldScrollHeight
  
  // Tính toán vị trí scroll mới dựa trên chiều cao đã thay đổi
  const newScrollTop = oldScrollTop + heightDifference
  
  console.log('chatUtils: Maintaining scroll position:', {
    oldScrollTop,
    oldScrollHeight,
    newScrollHeight,
    heightDifference,
    newScrollTop
  })
  
  // Khôi phục vị trí scroll
  ref.current.scrollTop = newScrollTop
  
  return newScrollTop
}

// Utility function để lưu vị trí scroll hiện tại
export const saveScrollPosition = (ref) => {
  console.log('chatUtils: saveScrollPosition called', {
    ref: ref?.current ? 'available' : 'null'
  })
  
  if (!ref?.current) {
    console.log('chatUtils: No ref available')
    return null
  }
  
  const scrollInfo = {
    scrollTop: ref.current.scrollTop,
    scrollHeight: ref.current.scrollHeight
  }
  
  console.log('chatUtils: Saved scroll position:', scrollInfo)
  return scrollInfo
}

// ===== MESSAGE UTILITIES =====
export const createPendingMessage = (conversationId, content, customerName, customerId = null) => {
  const message = {
    id: `temp-${Date.now()}`,
    conversationId,
    senderName: customerName,
    senderRole: 'CUSTOMER',
    content: content.trim(),
    timestamp: new Date().toISOString(),
    status: 'pending'
  }
  
  if (customerId) {
    message.customerId = customerId
  }
  
  return message
}

export const createSystemMessage = (conversationId, content) => ({
  id: Date.now() + 1,
  conversationId,
  senderName: 'SYSTEM',
  senderRole: 'SYSTEM',
  content,
  timestamp: new Date().toISOString()
})

// ===== MESSAGE FILTERING =====
export const filterPendingMessages = (messages) => {
  return messages.filter(m => !(m.senderRole === 'AI' && (m.status === 'PENDING' || m.status === 'pending')))
}

export const updateMessageStatus = (messages, messageId, newStatus) => {
  return messages.map(msg => 
    msg.id === messageId ? { ...msg, status: newStatus } : msg
  )
}

// ===== INFINITE SCROLL UTILITIES =====
export const handleLoadMoreMessages = async (
  conversationId,
  page,
  pageSize,
  fetchFunction,
  setMessages,
  setPage,
  setHasMore,
  setIsLoading,
  isLoading, // Thêm tham số isLoading
  hasMore // Thêm tham số hasMore
) => {
  console.log('handleLoadMoreMessages called:', {
    conversationId,
    page,
    pageSize,
    isLoading,
    hasMore
  })
  
  if (isLoading || !hasMore) {
    console.log('Cannot load more messages:', { isLoading, hasMore })
    return
  }
  
  setIsLoading(true)
  
  // Tạo timeout cho việc load messages
  const loadTimeout = setTimeout(() => {
    console.warn('Load messages timeout after 10s')
    setIsLoading(false)
    setHasMore(false) // Set false nếu timeout
  }, 10000) // 10 giây timeout
  
  try {
    console.log('Fetching messages for page:', page + 1)
    const data = await fetchFunction(conversationId, page + 1, pageSize)
    
    // Clear timeout nếu thành công
    clearTimeout(loadTimeout)
    
    console.log('Messages fetched:', {
      contentLength: data.content?.length || 0,
      last: data.last,
      newHasMore: !data.last
    })
    
    // Sleep 0.5s trước khi cập nhật messages
    console.log('Sleeping 0.5s before updating messages...')
    await new Promise(resolve => setTimeout(resolve, 500))
    
    setMessages(prev => {
      const newMessages = [...[...data.content].reverse(), ...prev]
      console.log('Messages updated:', {
        oldCount: prev.length,
        newCount: newMessages.length,
        addedCount: data.content?.length || 0
      })
      return newMessages
    })
    
    setPage(prev => prev + 1)
    setHasMore(!data.last)
    
  } catch (error) {
    // Clear timeout nếu có lỗi
    clearTimeout(loadTimeout)
    console.error('Failed to load more messages:', error)
    setHasMore(false) // Set false nếu có lỗi
  } finally {
    setIsLoading(false)
  }
}

// ===== WEBSOCKET MESSAGE HANDLING =====
export const handleWebSocketMessage = (msg, currentConversationId, isCustomerLoggedIn, setMessages, setAnimationConvId) => {
  console.log('🔧 handleWebSocketMessage called:', msg)
  console.log('🔧 Current conversationId:', currentConversationId)
  console.log('🔧 isCustomerLoggedIn:', isCustomerLoggedIn)
  
  // Cập nhật conversationId nếu cần
  if (msg.conversationId && msg.conversationId !== currentConversationId) {
    console.log('🔄 Updating conversationId:', currentConversationId, '->', msg.conversationId)
    setAnimationConvId(msg.conversationId)
    if (!isCustomerLoggedIn) {
      localStorage.setItem('conversationId', msg.conversationId)
    }
  }
  
  // Cập nhật messages
  setMessages(prev => {
    console.log('📝 Current messages count:', prev.length)
    
    // Xoá pending tạm của CUSTOMER nếu server đã trả về bản thật
    let next = prev.filter(m => !(
      m.status === 'pending' && 
      m.content === msg.content && 
      m.senderRole === msg.senderRole && 
      msg.senderRole === 'CUSTOMER'
    ))
    
    // FIX: Kiểm tra duplicate trước khi append
    const isDuplicate = next.some(existingMsg => 
      existingMsg.id === msg.id || 
      (existingMsg.content === msg.content && 
       existingMsg.senderRole === msg.senderRole &&
       Math.abs(new Date(existingMsg.timestamp) - new Date(msg.timestamp)) < 1000)
    )
    
    if (isDuplicate) {
      console.log('❌ Message already exists, skipping:', msg.id)
      return next
    }
    
    console.log('✅ Adding new message to list:', msg.id, 'Total messages:', next.length + 1)
    // FIX: Chỉ append nếu chưa tồn tại, không replace
    return [...next, msg]
  })
}

// ===== TIMEOUT UTILITIES =====
export const createMessageTimeout = (messageId, timeoutMs, onTimeout) => {
  return setTimeout(() => {
    onTimeout(messageId)
  }, timeoutMs)
}

export const clearMessageTimeout = (timeoutId) => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
}

// ===== VALIDATION UTILITIES =====
export const validateMessageInput = (input) => {
  const trimmed = input.trim()
  return {
    isValid: trimmed.length > 0,
    message: trimmed
  }
}

export const canSendMessage = (chatMode, awaitingAI, isCustomerLoggedIn, input) => {
  if (!input.trim()) return false
  if (chatMode === 'AI' && awaitingAI) return false
  if (chatMode === 'EMP' && !isCustomerLoggedIn) return false
  return true
}
