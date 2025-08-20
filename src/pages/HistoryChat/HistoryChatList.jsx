import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Box, Paper, Typography, List, ListItemButton, ListItemText, Divider, CircularProgress } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { getConversations } from '~/apis/chatAPICus'

export default function HistoryChatList() {
  const navigate = useNavigate()
  const currentCustomer = useSelector(state => state.customer.currentCustomer)
  const customerId = currentCustomer?.id
  const [loading, setLoading] = useState(true)
  const [conversations, setConversations] = useState([])

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        if (customerId) {
          const ids = await getConversations(customerId)
          if (mounted) setConversations(Array.isArray(ids) ? ids : [])
        }
      } catch (e) {
        console.error('Load conversations failed', e)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [customerId])

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', px: { xs: 1.5, md: 2 }, py: 3 }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>Lịch sử hội thoại</Typography>
      <Paper sx={{ p: 0, borderRadius: 3, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }} elevation={2}>
        {loading ? (
          <Box sx={{ p: 2 }}>
            {[...Array(6)].map((_, i) => (
              <Box key={i} sx={{ px: 2, py: 1.2 }}>
                <Box sx={{ height: 52, borderRadius: 2, bgcolor: 'action.hover' }} />
              </Box>
            ))}
          </Box>
        ) : conversations.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
            <Typography variant="subtitle1" fontWeight={600}>Chưa có cuộc hội thoại nào</Typography>
            <Typography variant="body2">Bắt đầu trò chuyện để thấy lịch sử xuất hiện ở đây.</Typography>
          </Box>
        ) : (
          <List disablePadding>
            {conversations.map((cid, idx) => (
              <Box key={cid}>
                <ListItemButton
                  onClick={() => navigate(`/historyChat/${cid}`)}
                  sx={{
                    py: 1.2,
                    borderRadius: 2,
                    mx: 1,
                    my: .5,
                    border: '1px solid',
                    borderColor: 'transparent',
                    transition: 'transform .15s ease, box-shadow .15s ease',
                    '&:hover': { transform: 'translateX(4px)', boxShadow: 1, bgcolor: 'action.hover' }
                  }}
                >
                  <ListItemText primary={`Conversation #${cid}`} secondary="Nhấn để xem chi tiết" />
                </ListItemButton>
                {idx < conversations.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  )
}


