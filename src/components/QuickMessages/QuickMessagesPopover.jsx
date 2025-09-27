import { useState } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Popover from '@mui/material/Popover'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import { searchQuickMessages } from './QuickMessagesData'

function QuickMessagesPopover({
  open,
  anchorEl,
  onClose,
  onMessageSelect
}) {
  const [searchQuery, setSearchQuery] = useState('')

  // Filter quick messages by search query
  const filteredQuickMessages = searchQuickMessages(searchQuery)

  const handleMessageClick = (message) => {
    onMessageSelect(message)
    setSearchQuery('') // Reset search query
  }

  const handleClose = () => {
    onClose()
    setSearchQuery('') // Reset search query
  }

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      PaperProps={{
        sx: {
          width: 360,
          maxHeight: 500,
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          border: '1px solid',
          borderColor: 'divider'
        }
      }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Chip 
            label="Quick Messages" 
            size="small" 
            color="primary" 
            variant="outlined"
          />
          <Chip 
            label={`${filteredQuickMessages.length} messages`}
            size="small"
            color="default"
            variant="outlined"
          />
        </Box>
        
        {/* Search Input */}
        <TextField
          fullWidth
          size="small"
          placeholder="Search quick messages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              fontSize: '0.875rem',
              '& fieldset': {
                borderColor: 'grey.300'
              },
              '&:hover fieldset': {
                borderColor: 'grey.400'
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main'
              }
            }
          }}
        />
        
        <Box sx={{ fontSize: '0.875rem', color: 'text.secondary', mt: 1 }}>
          Select available messages to send quickly
        </Box>
      </Box>
      
      <List sx={{ p: 0, maxHeight: 350, overflow: 'auto' }}>
        {filteredQuickMessages.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
            No matching messages found
          </Box>
        ) : (
          filteredQuickMessages.map((message, index) => (
            <Box key={message.id}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => handleMessageClick(message)}
                  sx={{
                    py: 1.5,
                    px: 2,
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Box sx={{ fontSize: '1.5rem' }}>
                      {message.icon}
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={message.text}
                    secondary={message.category}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      lineHeight: 1.3
                    }}
                    secondaryTypographyProps={{
                      fontSize: '0.75rem',
                      color: 'text.secondary'
                    }}
                  />
                </ListItemButton>
              </ListItem>
              {index < filteredQuickMessages.length - 1 && <Divider />}
            </Box>
          ))
        )}
      </List>
    </Popover>
  )
}

export default QuickMessagesPopover
