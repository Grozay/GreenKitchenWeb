/**
 * EmployeeMessenger - Main component for employee chat interface
 *
 * Props: None (root component)
 *
 * Manages:
 * - Overall state (conversations, selected conversation, messages)
 * - WebSocket connections
 * - API calls coordination
 * - Layout and sidebar toggle
 */

import React, { useEffect, useState, useRef, useCallback } from 'react'
import Box from '@mui/material/Box'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import Sidebar from './Sidebar'
import MessageList from './MessageList'
import ChatInput from './ChatInput'
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

export default function EmployeeMessenger() {
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
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const isMounted = useRef(true)
  const isEmpCanChat = selectedConv?.status === 'EMP' || selectedConv?.status === 'WAITING_EMP' || selectedConv?.status === 'AI'

  // Fetch conversations list
  const loadConvs = useCallback(async () => {
    try {
      const conversations = await fetchEmployeeConversations()
      setConvs(conversations)
    } catch (error) {
      console.error('Error fetching conversations:', error)
      setSnackbar({ open: true, msg: 'Không tải được danh sách hội thoại', sev: 'error' })
    }
  }, [])

  useEffect(() => {
    isMounted.current = true
    loadConvs()
    return () => { isMounted.current = false }
  }, [loadConvs])

  // Handle conversation selection
  const handleSelectConversation = useCallback(async (conv) => {
    setSelectedConv(conv)
    setMessages([])
    setPage(0)
    setIsLoading(true)

    try {
      // If not EMP status, claim first
      if (conv.status !== 'EMP') {
        await claimConversationAsEmp(conv.conversationId, 1)
        await loadConvs()
      }

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
          loadConvs()
        } catch (err) {
          setSnackbar({ open: true, msg: 'Mark read thất bại!', sev: 'error' })
          console.error('Mark read error:', err)
        }
      }
    } catch (err) {
      setErrMsg('Không thể chọn hội thoại này!')
      setIsLoading(false)
    }
  }, [loadConvs])

  // Load more messages for infinite scroll
  const handleLoadMore = useCallback(() => {
    if (!selectedConv || !hasMore || isLoading) return
    setIsLoading(true)
    const lastMsgId = messages[0]?.id
    fetchMessagesPaged(selectedConv.conversationId, lastMsgId, PAGE_SIZE)
      .then(data => {
        if (!isMounted.current) return
        setMessages(prev => [...[...data.content].reverse(), ...prev])
        setHasMore(!data.last)
        setIsLoading(false)
      })
      .catch(() => {
        setErrMsg('Không tải thêm được tin nhắn')
        setIsLoading(false)
      })
  }, [selectedConv, hasMore, isLoading, messages])

  // Send message
  const handleSend = async () => {
    const text = input.trim()
    if (!text || !selectedConv || !isEmpCanChat || isSending) return
    if (text.length > 2000) {
      setSnackbar({ open: true, msg: 'Tối đa 2000 ký tự.', sev: 'warning' })
      return
    }
    setIsSending(true)
    try {
      const resp = await sendMessage({
        conversationId: selectedConv.conversationId,
        senderRole: 'EMP',
        employeeId: 1,
        content: text,
        lang: 'vi'
      })
      setMessages(prev => [...prev, resp])
      setInput('')
    } catch (e) {
      setSnackbar({ open: true, msg: 'Gửi thất bại.', sev: 'error' })
      console.error(e)
    }
    setIsSending(false)
  }

  // Release conversation to AI
  const handleReleaseToAI = async () => {
    if (!selectedConv) return
    try {
      await releaseConversationToAI(selectedConv.conversationId)
      setSnackbar({ open: true, msg: 'Đã chuyển về AI!', sev: 'info' })
      setSelectedConv(null)
      loadConvs()
    } catch (e) {
      setSnackbar({ open: true, msg: 'Không thể chuyển về AI!', sev: 'error' })
    }
  }

  // WebSocket listeners
  useChatWebSocket('/topic/emp-notify', (convId) => {
    if (selectedConv?.conversationId === convId) {
      markConversationRead(convId).then(loadConvs)
    } else {
      loadConvs()
    }
  })

  useChatWebSocket(
    selectedConv?.conversationId ? `/topic/conversations/${selectedConv.conversationId}` : null,
    (msg) => {
      setMessages(prev => [...prev, msg])
      loadConvs() // Refresh conversations to update status 
    }
  )

  // Clear selected conversation if it's removed from list
  useEffect(() => {
    if (!selectedConv) return
    if (!convs.some(c => c.conversationId === selectedConv.conversationId)) {
      setSelectedConv(null)
      setMessages([])
    }
  }, [convs, selectedConv])

  // Update selected conversation if it changes in the list
  useEffect(() => {
    if (!selectedConv) return
    const found = convs.find(c => c.conversationId === selectedConv.conversationId)
    if (found) setSelectedConv(found)
  }, [convs])


  return (
    <Box sx={{
      display: 'flex',
      width: '100vw',
      height: '100vh',
      bgcolor: '#f1f8e9',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 9999,
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
    }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: { xs: 0, md: sidebarOpen ? 320 : 0 },
          minWidth: 0,
          transition: 'width 0.3s cubic-bezier(.4,0,.2,1)',
          overflow: 'hidden',
          height: '100vh',
          position: { xs: 'fixed', md: 'static' },
          zIndex: 1200
        }}
      >
        <Sidebar
          conversations={convs}
          selectedConv={selectedConv}
          onSelectConversation={handleSelectConversation}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      </Box>
      {/* Phần chat bên phải */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0, // KEY! Để flex children scroll được
        height: '100vh'
      }}>
        {/* Bọc riêng message list để scroll */}
        <Box sx={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          <MessageList
            selectedConv={selectedConv}
            messages={messages}
            isLoading={isLoading}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            onReleaseToAI={handleReleaseToAI}
            isEmpCanChat={isEmpCanChat}
          />
        </Box>

        <ChatInput
          input={input}
          setInput={setInput}
          onSend={handleSend}
          disabled={!selectedConv || !isEmpCanChat || isSending}
          isSending={isSending}
        />
      </Box>

      <Snackbar
        open={!!errMsg || snackbar.open}
        autoHideDuration={3000}
        onClose={() => {
          setErrMsg('')
          setSnackbar({ ...snackbar, open: false })
        }}
      >
        <Alert severity={errMsg ? 'error' : snackbar.sev}>
          {errMsg || snackbar.msg}
        </Alert>
      </Snackbar>
    </Box>
  )
}