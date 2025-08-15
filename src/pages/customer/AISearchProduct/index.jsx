// pages/AISearchProduct/index.jsx
import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import ChatPanel from './ChatPanel'
import ProductPanel from './ProductPanel'

function AISearchProductPage() {
  const [messages, setMessages] = useState([])
  const [menuPanel, setMenuPanel] = useState([])
  const [panelStatus, setPanelStatus] = useState('INIT') // INIT | FILTERED | IDLE

  const handleSendMessage = async (text) => {
    const res = await fetch('/api/ai-chat', {
      method: 'POST',
      body: JSON.stringify({ content: text }),
      headers: { 'Content-Type': 'application/json' }
    })
    const data = await res.json()

    setMessages(prev => [...prev, { senderRole: 'CUSTOMER', content: text, timestamp: Date.now() }])
    setMessages(prev => [...prev, { senderRole: data.senderRole || 'AI', content: data.content, menu: data.menu, timestamp: Date.now() }])

    if (data.menu && Array.isArray(data.menu) && data.menu.length > 0) {
      setMenuPanel(data.menu)
      setPanelStatus('FILTERED')
    } else if (panelStatus === 'INIT') {
      setPanelStatus('IDLE')
    }
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f5f6fa' }}>
      <ChatPanel
        messages={messages}
        onSend={handleSendMessage}
      />
      <ProductPanel
        status={panelStatus}
        products={menuPanel}
      />
    </Box>
  )
}

export default AISearchProductPage
