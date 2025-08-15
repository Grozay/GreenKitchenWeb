import { Box, Paper, Container } from '@mui/material'
import ChatPanel from './ChatPanel'
import MenuPanel from './MenuPanel'
import { useState } from 'react'

export default function ChatPage() {
  const [messages, setMessages] = useState([])
  const [menuProducts, setMenuProducts] = useState([])

  // Khi ChatPanel có message mới, kiểm tra có menu thì truyền sang MenuPanel
  const handleMessagesUpdate = (msgs) => {
    setMessages(msgs)
    const latestMenuMsg = [...msgs].reverse().find(m => Array.isArray(m.menu) && m.menu.length > 0)
    setMenuProducts(latestMenuMsg ? latestMenuMsg.menu : [])
  }

  return (
    <Box sx={{
      display: 'flex',
      height: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      fontFamily: 'Roboto, sans-serif',
      flexDirection: { xs: 'column', lg: 'row' }, // Mobile/Tablet: dọc, Desktop: ngang
      overflow: 'hidden' // Ngăn scroll không cần thiết
    }}>
      {/* Left panel: sản phẩm gợi ý */}
      <Paper
        elevation={3}
        sx={{
          flex: { xs: 'none', lg: '0 0 60%' },
          width: { xs: '100%', lg: '60%' },
          height: { xs: '50vh', md: '50vh', lg: '100vh' }, // Responsive height
          minWidth: { xs: '100%', lg: 320 },
          maxWidth: { xs: '100%', lg: '60%' },
          overflow: 'hidden', // Ngăn scroll không cần thiết
          borderRadius: 0,
          borderRight: { xs: 'none', lg: '1px solid #e0e0e0' },
          borderBottom: { xs: '1px solid #e0e0e0', lg: 'none' },
          order: { xs: 1, lg: 1 } // Đảm bảo thứ tự hiển thị
        }}
      >
        <MenuPanel menuProducts={menuProducts} chatMessages={messages} />
      </Paper>
      {/* Right panel: chat */}
      <Paper
        elevation={4}
        sx={{
          flex: { xs: '1 1 auto', lg: '1 1 40%' },
          width: { xs: '100%', lg: '40%' },
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          height: { xs: '50vh', md: '50vh', lg: '100vh' }, // Responsive height
          borderRadius: 0,
          overflow: 'hidden', // Ngăn scroll không cần thiết
          order: { xs: 2, lg: 2 } // Đảm bảo thứ tự hiển thị
        }}
      >
        <ChatPanel onMessagesUpdate={handleMessagesUpdate} />
      </Paper>
    </Box>
  )
}
