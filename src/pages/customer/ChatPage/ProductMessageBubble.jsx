import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Paper from '@mui/material/Paper'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Tooltip from '@mui/material/Tooltip'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import { useNavigate } from 'react-router-dom'

function ProductMessageBubble({ message }) {
  const navigate = useNavigate()
  const senderName = 'Nhân viên GreenKitchen'


  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: { xs: 1, sm: 1.5 },
        mb: 1.5,
        px: { xs: 2, sm: 2.5 },
        animation: 'slideInMessage 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        '@keyframes slideInMessage': {
          '0%': {
            opacity: 0,
            transform: 'translateY(20px) scale(0.95)'
          },
          '100%': {
            opacity: 1,
            transform: 'translateY(0) scale(1)'
          }
        }
      }}
    >
      {/* Avatar */}
      <Avatar
        sx={{
          width: { xs: 32, sm: 36 },
          height: { xs: 32, sm: 36 },
          bgcolor: 'grey.600', // Màu mặc định
          flexShrink: 0,
          boxShadow: 1,
          mt: 0.5,
          transition: 'transform 0.2s ease',
          '&:hover': {
            transform: 'scale(1.1)'
          }
        }}
      >
        <SupportAgentIcon fontSize="small" />
      </Avatar>

      {/* Message Bubble */}
      <Paper
        elevation={2}
        sx={{
          p: { xs: '12px 14px', sm: '14px 16px' },
          bgcolor: 'grey.100',
          borderRadius: 2.5,
          borderTopLeftRadius: 0.5,
          maxWidth: { xs: '85%', sm: '80%' },
          position: 'relative',
          transition: 'all 0.2s ease',
          transform: 'translateZ(0)',
          '&:hover': {
            transform: 'translateY(-1px) translateZ(0)',
            boxShadow: 3
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: -6,
            width: 0,
            height: 0,
            borderTop: '6px solid',
            borderTopColor: 'grey.100',
            borderRight: '6px solid transparent'
          }
        }}
      >
        {/* Sender name */}
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            fontWeight: 600,
            mb: 1,
            opacity: 0.85,
            fontSize: { xs: '11px', sm: '12px' },
            letterSpacing: '0.3px'
          }}
        >
          {senderName}
        </Typography>


        {/* Message text */}
        {message.content && (
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '16px', sm: '16px' },
              lineHeight: 1.5,
              mb: 2,
              wordBreak: 'break-word'
            }}
          >
            {message.content}
          </Typography>
        )}

        {/* Products Grid - Responsive layout */}
        {message.menu && Array.isArray(message.menu) && message.menu.length > 0 && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr', // Mobile: 1 cột dọc
                sm: 'repeat(2, 1fr)', // Tablet: 2 cột
                md: 'repeat(2, 1fr)' // Desktop: 2 cột (vì bubble không quá rộng)
              },
              gap: { xs: 1.5, sm: 2 },
              mt: 1
            }}
          >
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
                <a key={product.id} href={`/menu/${finalSlug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Card
                    sx={{
                      maxWidth: { xs: '100%', sm: 180, md: 200 },
                      cursor: 'pointer',
                      transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      borderRadius: 2,
                      overflow: 'hidden',
                      animation: `slideInProduct 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.1}s both`,
                      '@keyframes slideInProduct': {
                        '0%': { opacity: 0, transform: 'translateY(30px) scale(0.9)' },
                        '100%': { opacity: 1, transform: 'translateY(0) scale(1)' }
                      },
                      '&:hover': {
                        transform: 'translateY(-6px) scale(1.02)',
                        boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
                        '& .product-image': { transform: 'scale(1.08)' }
                      }
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="120"
                      image={product.image || 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=400'}
                      alt={product.title}
                      className="product-image"
                      sx={{
                        objectFit: 'cover',
                        transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        cursor: 'pointer'
                      }}
                      onError={(e) => { e.target.src = 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=400' }}
                    />
                    <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                      <Tooltip title={product.title} placement="top" arrow>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: { xs: '13px', sm: '14px' }, cursor: 'pointer' }}>
                          {product.title}
                        </Typography>
                      </Tooltip>
                      {product.price && (
                        <Typography variant="body2" color="primary" sx={{ fontWeight: 600, fontSize: { xs: '13px', sm: '14px' } }}>
                          {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </a>
              ) : (
                <Card
                  key={product.id}
                  sx={{
                    maxWidth: { xs: '100%', sm: 180, md: 200 },
                    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    borderRadius: 2,
                    overflow: 'hidden',
                    animation: `slideInProduct 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.1}s both`
                  }}
                >
                  <CardMedia
                    component="img"
                    height="120"
                    image={product.image || 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={product.title}
                    className="product-image"
                    sx={{ objectFit: 'cover' }}
                    onError={(e) => { e.target.src = 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=400' }}
                  />
                  <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                    <Tooltip title={product.title} placement="top" arrow>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: { xs: '13px', sm: '14px' } }}>
                        {product.title}
                      </Typography>
                    </Tooltip>
                    {product.price && (
                      <Typography variant="body2" color="primary" sx={{ fontWeight: 600, fontSize: { xs: '13px', sm: '14px' } }}>
                        {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </Box>
        )}

        {/* Timestamp */}
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mt: 1.5,
            opacity: 0.65,
            fontSize: { xs: '10px', sm: '11px' }
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