import { useEffect, useState, useRef, useCallback } from 'react'
import { Box, CircularProgress, IconButton, Tooltip, Paper, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useNavigate, useParams } from 'react-router-dom'
import MessageBubble from '~/components/AIChat/chatCustomer/MessageBubble'
import ProductMessageBubble from '~/components/AIChat/chatCustomer/ProductMessageBubble'
import ChatInput from '~/components/AIChat/chatCustomer/ChatInput'
import { useChatWebSocket } from '~/hooks/useChatWebSocket'
import { chatApis, fetchMessagesPaged } from '~/apis/chatAPICus'
import { Fade } from '@mui/material'

export default function HistoryChatDetail() {
  const navigate = useNavigate()
  const { conversationId } = useParams()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [awaitingAI, setAwaitingAI] = useState(false)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const listRef = useRef(null)
  const PAGE_SIZE = 20

  useEffect(() => {
    if (!conversationId) return
    setIsLoading(true)
    setPage(0)
    fetchMessagesPaged(conversationId, 0, PAGE_SIZE).then(data => {
      setMessages([...data.content].reverse())
      setHasMore(!data.last)
      setIsLoading(false)
    })
  }, [conversationId])

  // Websocket nhận dữ liệu realtime cho conv cũ
  const handleIncoming = useCallback((msg) => {
    if (Number(msg.conversationId) !== Number(conversationId)) return
    setMessages(prev => {
      const idx = prev.findIndex(m => m.id === msg.id)
      if (idx >= 0) return prev.map((m, i) => i === idx ? { ...m, ...msg } : m)
      return [...prev, msg]
    })
  }, [conversationId])

  useChatWebSocket(`/topic/conversations/${conversationId}`, handleIncoming)

  // load thêm
  const handleLoadMore = useCallback(() => {
    if (isLoading || !hasMore) return
    setIsLoading(true)
    fetchMessagesPaged(conversationId, page + 1, PAGE_SIZE).then(data => {
      setMessages(prev => [...[...data.content].reverse(), ...prev])
      setPage(prev => prev + 1)
      setHasMore(!data.last)
      setIsLoading(false)
    })
  }, [conversationId, isLoading, hasMore, page])

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const onScroll = () => {
      if (list.scrollTop === 0 && hasMore && !isLoading) handleLoadMore()
    }
    list.addEventListener('scroll', onScroll)
    return () => list.removeEventListener('scroll', onScroll)
  }, [handleLoadMore, hasMore, isLoading])

  // auto scroll dưới
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages])

  // gửi vào conv cũ
  const handleSend = useCallback(async () => {
    const text = input.trim()
    if (!text || awaitingAI) return
    setInput('')
    setAwaitingAI(true)
    const tempId = `temp-${Date.now()}`
    setMessages(prev => ([...prev, { id: tempId, conversationId, senderRole: 'CUSTOMER', content: text, timestamp: new Date().toISOString(), status: 'pending' }]))
    try {
      await chatApis.sendCustomerMessage({ conversationId, content: text })
    } catch (e) {
      setAwaitingAI(false)
    }
  }, [input, awaitingAI, conversationId])

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
      scrollBehavior: 'smooth', // 👈 Smooth scroll
    }}
  >
    {isLoading && hasMore && (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress size={24} />
      </Box>
    )}

    {messages.map((m, idx) => {
      const hasProducts = Array.isArray(m.menu) && m.menu.length > 0
      return (
        <Fade in={true} timeout={400} key={`${m.id}-${idx}`}>
          <Box sx={{ mb: 1 }}>
            {hasProducts
              ? <ProductMessageBubble message={m} />
              : <MessageBubble message={m} isOwn={m.senderRole === 'CUSTOMER'} />}
          </Box>
        </Fade>
      )
    })}
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
      disabled={awaitingAI}
      chatMode={'AI'}
      awaitingAI={awaitingAI}
      isCustomerLoggedIn={true}
    />
  </Paper>
</Paper>
    </Box>
  )
}


