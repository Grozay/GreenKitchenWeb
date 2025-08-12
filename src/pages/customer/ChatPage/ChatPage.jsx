import Box from '@mui/material/Box'
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
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'grey.50' }}>
      {/* Left panel: sản phẩm gợi ý */}
      <Box sx={{ flex: 2, minWidth: 320, maxWidth: 420, bgcolor: 'background.paper', borderRight: '1px solid #e0e0e0', overflowY: 'auto' }}>
        <MenuPanel menuProducts={menuProducts} chatMessages={messages} />
      </Box>
      {/* Right panel: chat */}
      <Box sx={{ flex: 3, minWidth: 0, display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <ChatPanel onMessagesUpdate={handleMessagesUpdate} />
      </Box>
    </Box>
  )
}
