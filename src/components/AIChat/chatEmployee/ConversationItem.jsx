/**
 * ConversationItem - Individual conversation item in sidebar
 *
 * Props:
 * - conversation: conversation object with customer info
 * - isSelected: boolean indicating if this conversation is selected
 * - onSelect: function to handle conversation selection
 */

import React from 'react'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import PersonIcon from '@mui/icons-material/Person'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'

export default function ConversationItem({ conversation, isSelected, onSelect }) {
  const isGuest = conversation.customerType === 'guest'
  const isRegistered = conversation.customerType === 'cus'

  // Determine customer type for display
  const getCustomerTypeInfo = () => {
    if (isGuest) {
      return {
        label: 'Khách vãng lai',
        color: '#ff9800',
        icon: <PersonOutlineIcon fontSize="small" />
      }
    }
    if (isRegistered) {
      return {
        label: 'Khách hàng',
        color: '#4caf50',
        icon: <PersonIcon fontSize="small" />
      }
    }
    return {
      label: 'Chưa xác định',
      color: '#9e9e9e',
      icon: <PersonOutlineIcon fontSize="small" />
    }
  }

  const customerTypeInfo = getCustomerTypeInfo()

  return (
    <ListItem
      selected={isSelected}
      button
      onClick={onSelect}
      sx={{
        borderRadius: 2,
        mx: 1,
        my: 0.5,
        p: 1.5,
        bgcolor: isSelected ? 'rgba(46, 125, 50, 0.08)' : 'background.paper',
        boxShadow: isSelected ? '0 2px 8px rgba(46, 125, 50, 0.15)' : undefined,
        border: isSelected ? '1px solid rgba(46, 125, 50, 0.2)' : '1px solid transparent',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          bgcolor: isSelected ? 'rgba(46, 125, 50, 0.12)' : 'rgba(76, 175, 80, 0.05)',
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <ListItemAvatar>
        <Badge
          color="error"
          badgeContent={conversation.unreadCount || null}
          overlap="circular"
        >
          <Avatar sx={{
            bgcolor: isSelected ? 'primary.main' : customerTypeInfo.color,
            transition: 'background-color 0.2s ease-in-out'
          }}>
            {conversation.customerName?.[0]?.toUpperCase() || '?'}
          </Avatar>
        </Badge>
      </ListItemAvatar>

      <ListItemText
        primary={
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography
                fontWeight="bold"
                sx={{
                  color: isSelected ? 'primary.main' : 'text.primary',
                  fontSize: '0.95rem',
                  maxWidth: { xs: 120, md: 140 }, // chống tràn trên mobile
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {conversation.customerName || 'Ẩn danh'}
              </Typography>

              <Typography variant="caption" sx={{ color: '#666', fontSize: '0.75rem' }}>
                {conversation.lastMessageTime}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                icon={customerTypeInfo.icon}
                label={customerTypeInfo.label}
                size="small"
                sx={{
                  bgcolor: `${customerTypeInfo.color}15`,
                  color: customerTypeInfo.color,
                  border: `1px solid ${customerTypeInfo.color}30`,
                  height: 20,
                  fontSize: '0.7rem',
                  '& .MuiChip-icon': {
                    fontSize: '0.8rem'
                  }
                }}
              />
              {conversation.customerPhone && (
                <Typography variant="caption" sx={{ color: '#888', fontSize: '0.7rem' }}>
                  {conversation.customerPhone}
                </Typography>
              )}
            </Box>
          </Box>
        }
        secondary={
          <Typography
            variant="body2"
            color="text.secondary"
            noWrap
            sx={{
              width: { xs: 110, md: 180 },
              mt: 0.5,
              fontSize: '0.85rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {conversation.lastMessage || ''}
          </Typography>

        }
      />
    </ListItem>
  )
}