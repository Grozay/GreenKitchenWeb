import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'
import { getAvatarInfo, getSenderName } from '~/utils/chatUtils'

function ProductMessageBubble({ message }) {
  // Sử dụng utility functions
  const avatarInfo = getAvatarInfo('AI', 'medium')
  const senderName = getSenderName('AI')
  const IconComponent = avatarInfo.IconComponent

  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 1.5,
      mb: 2,
      px: 2,
      animation: 'fadeIn 0.4s ease-out'
    }}>
      {/* Avatar */}
      <Avatar sx={{
        width: avatarInfo.width,
        height: avatarInfo.height,
        bgcolor: avatarInfo.bgcolor,
        boxShadow: 2,
        flexShrink: 0,
        mt: 0.5,
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.1)'
        }
      }}>
        <IconComponent fontSize={avatarInfo.fontSize} />
      </Avatar>

      {/* Message Bubble */}
      <Paper
        elevation={3}
        sx={{
          bgcolor: 'background.paper',
          borderRadius: 2,
          borderTopLeftRadius: 0.5,
          px: 2,
          py: 1.5,
          maxWidth: '85%',
          position: 'relative',
          transition: 'all 0.3s ease',
          '&:hover': {
            elevation: 6,
            transform: 'translateY(-2px)'
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: -8,
            width: 0,
            height: 0,
            borderTop: '8px solid white',
            borderRight: '8px solid transparent'
          }
        }}
      >

        {/* Sender name */}
        <Chip
          label={senderName}
          size="small"
          variant="outlined"
          sx={{
            mb: 1,
            fontSize: '0.75rem',
            height: 24
          }}
        />

        {/* Message text */}
        {message.content && (
          <Typography
            variant="body2"
            sx={{
              lineHeight: 1.5,
              mb: 2,
              color: 'text.primary',
              wordBreak: 'break-word'
            }}
          >
            {message.content}
          </Typography>
        )}

        {/* Products Grid - Responsive layout */}
        {message.menu && Array.isArray(message.menu) && message.menu.length > 0 && (
          <Grid container spacing={1.5} sx={{ mt: 1 }}>
            {message.menu.map((product, index) => {
              const slugify = (text) =>
                (text || '')
                  .toString()
                  .normalize('NFKD')
                  .replace(/[\u0300-\u036f]/g, '')
                  .toLowerCase()
                  .trim()
                  .replace(/[^a-z0-9\s-]/g, '')
                  .replace(/\s+/g, '-')
                  .replace(/-+/g, '-')
              const finalSlug = product?.slug || slugify(product?.title)
              return finalSlug ? (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                  <Card
                    component="a"
                    href={`/menu/${finalSlug}`}
                    sx={{
                      textDecoration: 'none',
                      color: 'inherit',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4
                      }
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="112"
                      image={product.image || 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=400'}
                      alt={product.title}
                      onError={(e) => { e.target.src = 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=400' }}
                      sx={{
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)'
                        }
                      }}
                    />
                    <CardContent sx={{ p: 1.5 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          mb: 0.5,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                        title={product.title}
                      >
                        {product.title}
                      </Typography>
                      {product.price && (
                        <Typography
                          variant="body2"
                          color="primary"
                          sx={{ fontWeight: 600 }}
                        >
                          {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ) : (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                  <Card sx={{
                    transition: 'all 0.3s ease'
                  }}>
                    <CardMedia
                      component="img"
                      height="112"
                      image={product.image || 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=400'}
                      alt={product.title}
                      onError={(e) => { e.target.src = 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=400' }}
                    />
                    <CardContent sx={{ p: 1.5 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          mb: 0.5,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                        title={product.title}
                      >
                        {product.title}
                      </Typography>
                      {product.price && (
                        <Typography
                          variant="body2"
                          color="primary"
                          sx={{ fontWeight: 600 }}
                        >
                          {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        )}

        {/* Timestamp */}
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            mt: 1.5,
            display: 'block'
          }}
        >
          {new Date(message.timestamp).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Typography>
      </Paper>
    </Box>
  )
}

export default ProductMessageBubble