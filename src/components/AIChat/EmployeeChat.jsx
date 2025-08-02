import React, { useEffect, useState, useRef, useCallback } from 'react'
import {
  Box, Button, TextField, Typography, List, ListItem,
  ListItemText, Divider, Paper, Badge, Avatar,
  ListItemAvatar, CircularProgress, IconButton, InputAdornment,
  Snackbar, Alert
} from '@mui/material'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import SendIcon from '@mui/icons-material/Send'
import { fetchMessagesPaged, sendMessage, fetchEmployeeConversations, markConversationRead, releaseConversationToAI, claimConversationAsEmp } from '~/apis/chatAPICus'
import { useChatWebSocket } from '~/hooks/useChatWebSocket'

const PAGE_SIZE = 20

function escapeHTML(str) {
  // Simple HTML escape
  return str.replace(/[&<>"']/g, (m) =>
    ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      '\'': '&#39;'
    }[m])
  )
}

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

  const listRef = useRef(null)
  const isEmpCanChat = selectedConv?.status === 'EMP' || selectedConv?.status === 'WAITING_EMP' || selectedConv?.status === 'AI'
  const isMounted = useRef(true)

  // Fetch danh sách hội thoại
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

  useEffect(() => {
    if (!selectedConv) return
    console.log('selectedConv changed:', selectedConv)

    // Nếu chưa là EMP thì claim trước
    if (selectedConv.status !== 'EMP') {
      claimConversationAsEmp(selectedConv.conversationId, 1)
        .then(async () => {
        // Reload lại convs để có trạng thái mới nhất
          await loadConvs()
          // Gọi lại fetchMessagesPaged cho conversationId đó
          return fetchMessagesPaged(selectedConv.conversationId, 0, PAGE_SIZE)
        })
        .then((data) => {
          if (!isMounted.current) return
          setMessages([...data.content].reverse())
          setHasMore(!data.last)
          setIsLoading(false)
          // Sau khi chắc chắn đã là EMP thì mark-read
          if (selectedConv.conversationId) {
            console.log('Gọi markConversationRead với conversationId:', selectedConv.conversationId)
            markConversationRead(selectedConv.conversationId)
              .then(() => {
                console.log('[markConversationRead] Thành công:', selectedConv.conversationId)
                loadConvs()
              })
              .catch(err => {
                setSnackbar({ open: true, msg: 'Mark read thất bại!', sev: 'error' })
                console.error('[markConversationRead] Lỗi:', err)
              })
          }
        })
        .catch(err => {
          setErrMsg('Không thể claim hội thoại này!')
          setIsLoading(false)
        })
      return // Không chạy xuống dưới
    }

    // Nếu đã là EMP thì load luôn messages
    setMessages([])
    setPage(0)
    setIsLoading(true)
    fetchMessagesPaged(selectedConv.conversationId, 0, PAGE_SIZE)
      .then(data => {
        if (!isMounted.current) return
        setMessages([...data.content].reverse())
        setHasMore(!data.last)
        setIsLoading(false)

        // Mark read luôn khi đã là EMP
        if (selectedConv.conversationId) {
          console.log('Gọi markConversationRead với conversationId:', selectedConv.conversationId)
          markConversationRead(selectedConv.conversationId)
            .then(() => {
              console.log('[markConversationRead] Thành công:', selectedConv.conversationId)
              loadConvs()
            })
            .catch(err => {
              setSnackbar({ open: true, msg: 'Mark read thất bại!', sev: 'error' })
              console.error('[markConversationRead] Lỗi:', err)
            })
        }
      })
      .catch(err => {
        setErrMsg('Không tải được tin nhắn')
        setIsLoading(false)
      })
  }, [selectedConv, loadConvs])


  // Infinite scroll đúng
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

  useEffect(() => {
    const list = listRef.current
    if (!list || !hasMore) return
    const onScroll = () => {
      if (list.scrollTop < 30 && hasMore && !isLoading) {
        handleLoadMore()
      }
    }
    list.addEventListener('scroll', onScroll)
    return () => list.removeEventListener('scroll', onScroll)
  }, [handleLoadMore, hasMore, isLoading])

  // Nhận notify
  useChatWebSocket('/topic/emp-notify', (convId) => {
    if (selectedConv?.conversationId === convId) {
      markConversationRead(convId).then(loadConvs)
    } else {
      loadConvs()
    }
  })

  // Nhận tin nhắn mới qua WS
  useChatWebSocket(
    selectedConv?.conversationId ? `/topic/conversations/${selectedConv.conversationId}` : null,
    (msg) => {
      setMessages(prev => [...prev, msg])
    }
  )


  // Nếu selectedConv bị xóa khỏi convs (VD: chuyển về AI), tự clear
  useEffect(() => {
    if (!selectedConv) return
    if (!convs.some(c => c.conversationId === selectedConv.conversationId)) {
      setSelectedConv(null)
      setMessages([])
    }
  }, [convs, selectedConv])

  // Auto scroll xuống cuối khi có tin mới (nếu đang ở gần cuối)
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    if (list.scrollHeight - list.scrollTop - list.clientHeight < 200) {
      list.scrollTop = list.scrollHeight
    }
  }, [messages])

  // Gửi tin nhắn
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
        // TODO: lấy employeeId động
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

  // Giao diện
  return (
    <Box sx={{
      display: 'flex', width: '100vw', height: '100vh', bgcolor: '#f3f6fa',
      position: 'fixed', left: 0, top: 0, zIndex: 9999
    }}>
      {/* Sidebar */}
      <Paper sx={{
        width: 320, borderRight: 1, borderColor: 'grey.200', height: '100%', overflowY: 'auto'
      }} square>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <ChatBubbleOutlineIcon color="primary" />
          <Typography variant="h6" fontWeight="bold">Tin nhắn</Typography>
        </Box>
        <Divider />
        {convs.length === 0 && (
          <Typography align="center" color="text.secondary" sx={{ mt: 6 }}>Chưa có hội thoại nào</Typography>
        )}
        <List sx={{ p: 0 }}>
          {convs.map(conv => (
            <ListItem
              key={conv.conversationId}
              selected={selectedConv?.conversationId === conv.conversationId}
              button
              onClick={() => setSelectedConv(conv)}
              sx={{
                borderRadius: 2, mx: 1, my: 0.5, p: 1,
                bgcolor: selectedConv?.conversationId === conv.conversationId ? 'primary.50' : 'background.paper',
                boxShadow: selectedConv?.conversationId === conv.conversationId ? 1 : undefined,
                '&:hover': { bgcolor: 'grey.100' }
              }}
            >
              <ListItemAvatar>
                <Badge color="error" badgeContent={conv.unreadCount || null} overlap="circular">
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {conv.customerName?.[0]?.toUpperCase() || '?'}
                  </Avatar>
                </Badge>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography fontWeight="bold">{conv.customerName || 'Ẩn danh'}</Typography>
                    <Typography variant="caption" sx={{ color: '#888', ml: 1 }}>
                      {conv.lastMessageTime}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary" noWrap sx={{ width: 160 }}>
                    {conv.lastMessage || ''}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Chat main */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box sx={{
          p: 2, borderBottom: 1, borderColor: 'grey.200', bgcolor: 'white', display: 'flex', alignItems: 'center', minHeight: 60
        }}>
          {selectedConv && (
            <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
              {selectedConv.customerName?.[0]?.toUpperCase() || '?'}
            </Avatar>
          )}
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {selectedConv?.customerName || 'Chọn hội thoại để chat'}
            </Typography>
            {selectedConv &&
      <Typography variant="body2" color={isEmpCanChat ? 'success.main' : 'text.secondary'}>
        {selectedConv.status}
      </Typography>
            }
          </Box>
          {/* Nút trả về AI */}
          {selectedConv && isEmpCanChat && (
            <Button
              color="secondary"
              variant="outlined"
              sx={{ ml: 2 }}
              onClick={async () => {
                try {
                  await releaseConversationToAI(selectedConv.conversationId)
                  setSnackbar({ open: true, msg: 'Đã chuyển về AI!', sev: 'info' })
                  setSelectedConv(null)
                  loadConvs()
                } catch (e) {
                  setSnackbar({ open: true, msg: 'Không thể chuyển về AI!', sev: 'error' })
                }
              }}
            >
      Trả về AI
            </Button>
          )}
        </Box>


        {/* Chat messages */}
        <Box ref={listRef}
          sx={{
            flex: 1, overflowY: 'auto', bgcolor: '#e4e6eb', px: 2, py: 2,
            display: 'flex', flexDirection: 'column', gap: 1, position: 'relative'
          }}>
          {isLoading && page === 0 && <CircularProgress size={32} sx={{ alignSelf: 'center', my: 4 }} />}
          {selectedConv ? (
            <>
              {messages.length === 0 && !isLoading ? (
                <Typography align="center" color="text.secondary" sx={{ mt: 6 }}>Chưa có tin nhắn nào</Typography>
              ) : (
                messages.map((m, idx) => {
                  const isEmp = m.senderRole === 'EMP'
                  const isAI = m.senderRole === 'AI'
                  const isRight = isEmp || isAI
                  return (
                    <Box key={`${m.id || idx}`} sx={{
                      display: 'flex',
                      flexDirection: isRight ? 'row-reverse' : 'row',
                      alignItems: 'flex-end'
                    }}>
                      <Avatar sx={{
                        width: 32, height: 32, mx: 1,
                        bgcolor: isEmp ? 'primary.main' : (isAI ? '#ffbb39' : 'grey.400')
                      }}>
                        {m.senderName?.[0]?.toUpperCase() || '?'}
                      </Avatar>
                      <Box sx={{
                        maxWidth: '60%', px: 2, py: 1, borderRadius: 2,
                        bgcolor: isEmp ? 'primary.main' : (isAI ? '#ffbb39' : 'white'),
                        color: isEmp ? 'white' : 'black', boxShadow: 1,
                        wordBreak: 'break-word', fontSize: 15,
                        ml: isRight ? 0 : 1, mr: isRight ? 1 : 0
                      }}>
                        <Typography fontWeight="bold" fontSize={13}>
                          {m.senderName}
                        </Typography>
                        <Typography component="span" fontSize={14}
                          sx={{ whiteSpace: 'pre-line' }}
                          dangerouslySetInnerHTML={{ __html: escapeHTML(m.content) }} />
                        <Typography variant="caption" sx={{ float: 'right', mt: 0.5, color: '#ccc' }}>
                          {m.createdAt?.slice(11, 16)}
                        </Typography>
                      </Box>
                    </Box>
                  )
                })
              )}
            </>
          ) : (
            <Typography align="center" color="text.secondary" sx={{ mt: 8 }}>Chọn hội thoại để chat</Typography>
          )}
        </Box>

        {/* Input */}
        <Box sx={{
          p: 2, borderTop: 1, borderColor: 'grey.200', bgcolor: 'white', display: 'flex', alignItems: 'center', gap: 1
        }}>
          <TextField
            fullWidth size="small" value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Nhập tin nhắn..."
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            disabled={!selectedConv || !isEmpCanChat || isSending}
            inputProps={{ maxLength: 2000 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleSend}
                    disabled={!selectedConv || !isEmpCanChat || isSending}
                  >
                    {isSending
                      ? <CircularProgress size={20} />
                      : <SendIcon color={!selectedConv || !isEmpCanChat ? 'disabled' : 'primary'} />
                    }
                  </IconButton>
                </InputAdornment>
              ),
              sx: { bgcolor: '#f0f2f5', borderRadius: 2 }
            }}
          />
        </Box>

        {/* Snackbar */}
        <Snackbar open={!!errMsg || snackbar.open} autoHideDuration={3000}
          onClose={() => { setErrMsg(''); setSnackbar({ ...snackbar, open: false }) }}>
          <Alert severity={errMsg ? 'error' : snackbar.sev}>
            {errMsg || snackbar.msg}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  )
}
