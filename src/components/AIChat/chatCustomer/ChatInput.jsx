import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import SendIcon from '@mui/icons-material/Send'

function ChatInput({
  input,
  setInput,
  handleSend,
  disabled,
  chatMode,
  awaitingAI,
  isCustomerLoggedIn
}) {
  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2 },
        bgcolor: 'background.paper',
        display: 'flex',
        gap: { xs: 1, sm: 1.25 },
        alignItems: 'flex-end',
        minHeight: { xs: 64, sm: 68 },
        borderTop: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.05)',
        flexShrink: 0
      }}
    >
      {/* Text Input với cải thiện UX */}
      <TextField
        fullWidth
        multiline
        maxRows={3}
        variant="outlined"
        size="small"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Nhập tin nhắn..."
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
          }
        }}
        disabled={disabled}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            bgcolor: 'grey.50',
            fontSize: '16px', // Tối thiểu 16px
            transition: 'all 0.2s ease',
            minHeight: { xs: 40, sm: 44 },
            '& fieldset': {
              borderColor: 'grey.300'
            },
            '&:hover fieldset': {
              borderColor: 'grey.400'
            },
            '&.Mui-focused fieldset': {
              borderColor: 'primary.main',
              borderWidth: 1.5
            },
            '&.Mui-focused': {
              bgcolor: 'background.paper'
            }
          },
          '& .MuiInputBase-input': {
            fontSize: '16px',
            py: { xs: 1, sm: 1.25 },
            px: { xs: 1.25, sm: 1.5 }
          },
          '& .MuiInputBase-inputMultiline': {
            resize: 'none'
          }
        }}
      />

      {/* Send Button với animation */}
      <IconButton
        onClick={handleSend}
        disabled={
          (chatMode === 'AI' && awaitingAI) ||
          (chatMode === 'EMP' && !isCustomerLoggedIn) ||
          !input.trim()
        }
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          width: { xs: 40, sm: 44 },
          height: { xs: 40, sm: 44 },
          borderRadius: 2,
          transition: 'all 0.2s ease',
          flexShrink: 0,
          '&:hover': {
            bgcolor: 'primary.dark',
            transform: 'scale(1.05)'
          },
          '&:active': {
            transform: 'scale(0.95)'
          },
          '&:disabled': {
            bgcolor: 'grey.300',
            color: 'grey.500',
            transform: 'none'
          }
        }}
      >
        <SendIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
      </IconButton>
    </Box>
  )
}

export default ChatInput