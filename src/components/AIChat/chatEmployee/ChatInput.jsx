/**
 * ChatInput - Message input area with send functionality
 *
 * Props:
 * - input: current input value string
 * - setInput: function to set input value
 * - onSend: function to handle message sending
 * - disabled: boolean indicating if input should be disabled
 * - isSending: boolean indicating if message is being sent
 */

import React from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import SendIcon from '@mui/icons-material/Send'

export default function ChatInput({
  input,
  setInput,
  onSend,
  disabled,
  isSending
}) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <Box sx={{
      p: 2,
      borderTop: 1,
      borderColor: 'grey.200',
      bgcolor: 'white',
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
      boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.05)'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          size="small"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nhập tin nhắn để hỗ trợ khách hàng..."
          disabled={disabled || isSending}
          inputProps={{
            maxLength: 2000,
            'aria-label': 'Tin nhắn hỗ trợ khách hàng'
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={onSend}
                  disabled={disabled || isSending || !input.trim()}
                  sx={{
                    color: (!disabled && !isSending && input.trim()) ? 'primary.main' : 'disabled',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      bgcolor: 'rgba(46, 125, 50, 0.08)'
                    }
                  }}
                  aria-label="Gửi tin nhắn"
                >
                  {isSending ? (
                    <CircularProgress size={20} sx={{ color: 'primary.main' }} />
                  ) : (
                    <SendIcon />
                  )}
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              bgcolor: '#f8fdf8',
              borderRadius: 3,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#c8e6c9'
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main'
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main',
                borderWidth: 2
              }
            }
          }}
        />
      </Box>

      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="caption" color="text.secondary">
          {input.length}/2000 ký tự
        </Typography>

        {disabled && (
          <Typography variant="caption" color="warning.main" sx={{ fontStyle: 'italic' }}>
            Không thể chat trong trạng thái này
          </Typography>
        )}
      </Box>
    </Box>
  )
}