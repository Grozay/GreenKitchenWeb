import { useEffect, useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Box, Paper, Typography, List, ListItemButton, ListItemText, Divider, CircularProgress, TextField, InputAdornment, Chip, Fade, Avatar, ListItemAvatar } from '@mui/material'
import Container from '@mui/material/Container'
import SearchIcon from '@mui/icons-material/Search'
import { useNavigate, useParams } from 'react-router-dom'
import { getConversations } from '~/apis/chatAPICus'
import HistoryChatDetail from './HistoryChatDetail'
import ProfileNavBar from '~/components/ProfileNavBar/ProfileNavBar'

export default function HistoryChatLayout() {
  const navigate = useNavigate()
  const { conversationId } = useParams()
  const currentCustomer = useSelector(state => state.customer.currentCustomer)
  const customerId = currentCustomer?.id

  const [loading, setLoading] = useState(true)
  const [conversations, setConversations] = useState([])
  const [query, setQuery] = useState('')

  const filteredConversations = useMemo(() => {
    if (!query) return conversations
    return conversations.filter(cid => String(cid).includes(query.trim()))
  }, [conversations, query])

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
    <Container maxWidth="xl" sx={{ height: '100dvh' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100dvh' }}>
        <ProfileNavBar />
        <Box sx={{
          display: 'flex',
          flex: 1,
          minHeight: 0,
          bgcolor: 'transparent',
          background: 'linear-gradient(135deg, #edf2fb 0%, #e2eafc 35%, #f9f7ff 100%)'
        }}>
          {/* Sidebar */}
          <Box sx={{
            flex: { xs: '1 1 100%', md: '0 0 360px' },
            borderRight: { md: '1px solid' },
            borderColor: 'divider',
            display: 'flex', flexDirection: 'column', minHeight: 0,
            bgcolor: (t) => t.palette.mode === 'light' ? 'rgba(255,255,255,0.7)' : 'rgba(17,24,39,0.6)',
            backdropFilter: 'saturate(180%) blur(12px)'
          }}>
            {/* Sidebar header */}
            <Box sx={{
              px: 2, pt: 2, pb: 1.5, flexShrink: 0,
              borderBottom: '1px solid', borderColor: 'divider',
              background: (t) => `linear-gradient(180deg, ${t.palette.background.paper}, ${t.palette.background.default})`
            }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 1, color: 'primary.main' }}>Chat Conversations</Typography>
              <TextField
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by ID..."
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'background.paper',
                    transition: 'box-shadow .2s ease, transform .15s ease',
                    '&:hover': { boxShadow: 2 },
                    '&.Mui-focused': { boxShadow: 4, transform: 'translateY(-1px)' }
                  }
                }}
              />
            </Box>
            <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', '&::-webkit-scrollbar': { width: 6 }, '&::-webkit-scrollbar-thumb': { bgcolor: 'divider', borderRadius: 3 } }}>
              <Paper elevation={0} sx={{ borderRadius: 0, bgcolor: 'transparent' }}>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}><CircularProgress size={22} /></Box>
                ) : (
                  <List disablePadding>
                    {filteredConversations.map((cid, idx) => (
                      <Box key={cid}>
                        <ListItemButton
                          selected={Number(conversationId) === Number(cid)}
                          onClick={() => navigate(`/agent/${cid}`)}
                          sx={{
                            py: 1.2,
                            my: 0.5,
                            borderRadius: 2,
                            mx: 1,
                            border: '1px solid',
                            borderColor: (t) => (Number(conversationId) === Number(cid)) ? 'primary.200' : 'transparent',
                            transition: 'transform .15s ease, box-shadow .15s ease, background-color .15s ease',
                            '&.Mui-selected': {
                              bgcolor: 'primary.50',
                              boxShadow: 2
                            },
                            '&:hover': {
                              transform: 'translateX(4px)',
                              boxShadow: 1,
                              bgcolor: 'action.hover'
                            }
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>GK</Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body1" fontWeight={600}>#{cid}</Typography>
                                <Chip label="AI" size="small" color="default" variant="outlined" sx={{ height: 20 }} />
                              </Box>
                            }
                            secondary="Click to view details"
                          />
                        </ListItemButton>
                        {idx < filteredConversations.length - 1 && <Divider />}
                      </Box>
                    ))}
                  </List>
                )}
              </Paper>
            </Box>
          </Box>

          {/* Detail panel */}
          <Box sx={{ flex: 1, minWidth: 0, display: { xs: conversationId ? 'block' : 'none', md: 'block' }, background: 'radial-gradient(1200px 400px at 80% 0%, rgba(99, 102, 241, 0.08) 0%, transparent 60%), linear-gradient(135deg, #f8fafc 0%, #eef2f7 100%)', borderLeft: { md: '1px solid' }, borderColor: 'divider' }}>
            {conversationId ? (
              <Fade in={true} timeout={400}>
                <Paper elevation={4} sx={{ height: '100%', borderRadius: 0 }}>
                  <HistoryChatDetail />
                </Paper>
              </Fade>
            ) : (
              <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary', p: 2 }}>
                <Typography>Select a conversation to view details</Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Container>
  )
}


