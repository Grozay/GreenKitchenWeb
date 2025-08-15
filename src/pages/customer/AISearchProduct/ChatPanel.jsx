import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import MessageBubble from '~/components/AIChat/chatCustomer/MessageBubble'
import ProductMessageBubble from '~/components/AIChat/chatCustomer/ProductMessageBubble'
import ChatInputBox from './ChatInputBox'

function ChatPanel({ messages, onSend }) {
  return (
    <Box sx={{
      flex: 1.7,
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid #e0e0e0',
      minWidth: 0,
      maxWidth: 650,
      bgcolor: 'white'
    }}>
      <Box sx={{ flex: 1, overflowY: 'auto', px: 0.5, pt: 2 }}>
        {messages.map((msg, i) =>
          msg.menu && Array.isArray(msg.menu) && msg.menu.length > 0
            ? <ProductMessageBubble key={i} message={msg} />
            : <MessageBubble key={i} message={msg} customerName="Bạn" isOwn={msg.senderRole === 'CUSTOMER'} />
        )}
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <ChatInputBox onSend={onSend} />
      </Box>
    </Box>
  )
}
export default ChatPanel
