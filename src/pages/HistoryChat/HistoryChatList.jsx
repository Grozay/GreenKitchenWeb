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
    <Box sx={{ maxWidth: 800, mx: 'auto', px: 2, py: 3 }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>Lịch sử hội thoại</Typography>
      <Paper sx={{ p: 0 }} elevation={2}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={24} />
          </Box>
        ) : conversations.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">Chưa có cuộc hội thoại nào</Typography>
          </Box>
        ) : (
          <List disablePadding>
            {conversations.map((cid, idx) => (
              <Box key={cid}>
                <ListItemButton onClick={() => navigate(`/historyChat/${cid}`)}>
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


