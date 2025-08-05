import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

function ChatInputBox({ onSend }) {
  const [text, setText] = useState('')
  const handleSend = () => {
    if (text.trim()) {
      onSend(text.trim())
      setText('')
    }
  }
  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <TextField
        fullWidth
        size="small"
        placeholder="Nhập yêu cầu hoặc trò chuyện..."
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSend()}
      />
      <Button variant="contained" onClick={handleSend}>Gửi</Button>
    </Box>
  )
}
export default ChatInputBox
