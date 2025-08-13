import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActionArea from '@mui/material/CardActionArea'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { useState, useMemo } from 'react'

export default function ProductCard({ 
  product, 
  loading = false,
  showActions = true,
  variant = 'default', // 'default' | 'compact' | 'featured'
  onAddToCart,
  onToggleFavorite,
  isFavorited = false
}) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

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

  const finalSlug = useMemo(
    () => product?.slug || slugify(product?.title),
    [product?.slug, product?.title]
  )

  const href = finalSlug ? `/menu/${finalSlug}` : undefined

  const formatPrice = (v) =>
    typeof v === 'number'
      ? v.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
      : '—'

  // Variant configurations
  const variantConfig = {
    default: {
      height: 200,
      imageHeight: 140,
      borderRadius: 2
    },
    compact: {
      height: 160,
      imageHeight: 100,
      borderRadius: 1.5
    },
    featured: {
      height: 240,
      imageHeight: 160,
      borderRadius: 3
    }
  }

  const config = variantConfig[variant] || variantConfig.default

  if (loading) {
    return (
      <Card sx={{ 
        borderRadius: config.borderRadius,
        height: config.height,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Skeleton variant="rectangular" height={config.imageHeight} />
        <CardContent sx={{ flexGrow: 1 }}>
          <Skeleton variant="text" sx={{ fontSize: '1.2rem' }} />
          <Skeleton variant="text" width="60%" />
        </CardContent>
      </Card>
    )
  }

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onAddToCart?.(product)
  }

  const handleToggleFavorite = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onToggleFavorite?.(product)
  }

  const cardContent = (
    <>
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        {/* Image container with overlay effects */}
        <CardMedia
          component="img"
          height={config.imageHeight}
          image={imageError ? '/img/placeholder.jpg' : (product?.image || '/img/placeholder.jpg')}
          alt={product?.title || 'Món ăn'}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          sx={{
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.05)'
            }
          }}
        />

        {/* Badges and labels */}
        {product?.isNew && (
          <Chip
            label="Mới"
            color="secondary"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              fontSize: '0.75rem',
              height: 24
            }}
          />
        )}

        {product?.discount && (
          <Chip
            label={`-${product.discount}%`}
            color="error"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              fontSize: '0.75rem',
              height: 24
            }}
          />
        )}

        {/* Action buttons overlay */}
        {showActions && (
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5,
              opacity: 0,
              transition: 'opacity 0.3s ease',
              '.MuiCard-root:hover &': {
                opacity: 1
              }
            }}
          >
            <IconButton
              size="small"
              onClick={handleToggleFavorite}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 1)' }
              }}
            >
              {isFavorited ? (
                <FavoriteIcon color="error" fontSize="small" />
              ) : (
                <FavoriteBorderIcon fontSize="small" />
              )}
            </IconButton>
          </Box>
        )}
      </Box>

      <CardContent sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column',
        pb: variant === 'compact' ? 1.5 : 2
      }}>
        <Typography
          variant={variant === 'compact' ? 'body2' : 'subtitle1'}
          fontWeight={600}
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.3,
            mb: 0.5
          }}
        >
          {product?.title || 'Món chưa đặt tên'}
        </Typography>

        {/* Category */}
        {product?.category && (
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ mb: 0.5 }}
          >
            {product.category}
          </Typography>
        )}

        {/* Rating */}
        {product?.rating && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              ⭐ {product.rating}
            </Typography>
            {product?.reviewCount && (
              <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                ({product.reviewCount})
              </Typography>
            )}
          </Box>
        )}

        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mt: 'auto'
        }}>
          <Box>
            {product?.originalPrice && product.originalPrice > product?.price && (
              <Typography 
                variant="caption" 
                sx={{ 
                  textDecoration: 'line-through',
                  color: 'text.disabled',
                  mr: 1
                }}
              >
                {formatPrice(product.originalPrice)}
              </Typography>
            )}
            <Typography 
              variant={variant === 'compact' ? 'body2' : 'body1'}
              color="primary"
              fontWeight={600}
            >
              {formatPrice(product?.price)}
            </Typography>
          </Box>

          {showActions && onAddToCart && (
            <IconButton
              size="small"
              onClick={handleAddToCart}
              color="primary"
              sx={{
                ml: 1,
                '&:hover': {
                  transform: 'scale(1.1)'
                }
              }}
            >
              <AddShoppingCartIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </CardContent>
    </>
  )

  return (
    <Card
      sx={{
        borderRadius: config.borderRadius,
        boxShadow: 1,
        height: config.height,
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': { 
          boxShadow: 6,
          transform: 'translateY(-2px)'
        },
        ...(variant === 'featured' && {
          border: '2px solid',
          borderColor: 'primary.main'
        })
      }}
    >
      {href ? (
        <CardActionArea
          href={href}
          component="a"
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'stretch', 
            height: '100%',
            '&:focus-visible': {
              outline: '2px solid',
              outlineColor: 'primary.main'
            }
          }}
          aria-label={`Xem chi tiết ${product?.title || 'món ăn'}`}
        >
          {cardContent}
        </CardActionArea>
      ) : (
        cardContent
      )}
    </Card>
  )
}