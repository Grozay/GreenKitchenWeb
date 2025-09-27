import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import {
  ShoppingCart as ShoppingCartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon
} from '@mui/icons-material'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import GrainIcon from '@mui/icons-material/Grain'
import LocalPizzaIcon from '@mui/icons-material/LocalPizza'
import WhatshotIcon from '@mui/icons-material/Whatshot'
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
      height: { xs: 200, md: 220, lg: 240 },
      imageHeight: { xs: 120, md: 130, lg: 140 },
      borderRadius: 2
    },
    compact: {
      height: { xs: 140, md: 150, lg: 160 },
      imageHeight: { xs: 80, md: 90, lg: 100 },
      borderRadius: 1.5
    },
    featured: {
      height: { xs: 200, md: 220, lg: 240 },
      imageHeight: { xs: 140, md: 150, lg: 160 },
      borderRadius: 3
    }
  }

  const config = variantConfig[variant] || variantConfig.default

  const caloriesValue = useMemo(() => {
    if (typeof product?.calories === 'number') return product.calories
    const carb = product?.carb
    const fat = product?.fat
    const protein = product?.protein
    if ([carb, fat, protein].every((v) => typeof v === 'number')) {
      return Math.round(carb * 4 + protein * 4 + fat * 9)
    }
    return null
  }, [product?.calories, product?.carb, product?.fat, product?.protein])

  const carbValue = useMemo(() => {
    if (typeof product?.carb === 'number') return product.carb
    if (
      typeof product?.calories === 'number' &&
      typeof product?.protein === 'number' &&
      typeof product?.fat === 'number'
    ) {
      const remaining = product.calories - (product.protein * 4 + product.fat * 9)
      const grams = remaining / 4
      return Math.max(0, Math.round(grams))
    }
    return null
  }, [product?.carb, product?.calories, product?.protein, product?.fat])

  if (loading) {
    return (
      <Card sx={{ 
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Skeleton variant="rectangular" height={config.imageHeight} />
        <CardContent sx={{ flex: 1 }}>
          <Skeleton variant="text" height={24} />
          <Skeleton variant="text" height={20} width="60%" />
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
      <Box sx={{
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0 // Ngăn image bị co quá nhỏ
        }}>
        {/* Image container with overlay effects */}
        <CardMedia
          component="img"
          height={typeof config.imageHeight === 'object' ? config.imageHeight.lg : config.imageHeight}
          image={imageError ? 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=400' : (product?.image || 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=400')}
          alt={product?.title || 'Dish'}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          sx={{
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)'
            },
            // Responsive height
            height: {
              xs: typeof config.imageHeight === 'object' ? config.imageHeight.xs : config.imageHeight,
              md: typeof config.imageHeight === 'object' ? config.imageHeight.md : config.imageHeight,
              lg: typeof config.imageHeight === 'object' ? config.imageHeight.lg : config.imageHeight
            }
          }}
        />

        {/* Badges and labels */}
        {product?.isNew && (
          <Chip
            label="New"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              background: 'linear-gradient(45deg, #e91e63, #9c27b0)',
              color: 'white',
              fontWeight: 500,
              fontSize: { xs: '0.65rem', md: '0.7rem', lg: '0.75rem' }, // Font size responsive
              height: { xs: 20, md: 22, lg: 24 } // Height responsive
            }}
          />
        )}

        {product?.discount && (
          <Chip
            label={`-${product.discount}%`}
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              background: 'linear-gradient(45deg, #f44336, #ff9800)',
              color: 'white',
              fontWeight: 500,
              fontSize: { xs: '0.65rem', md: '0.7rem', lg: '0.75rem' }, // Font size responsive
              height: { xs: 20, md: 22, lg: 24 } // Height responsive
            }}
          />
        )}

        {/* Action buttons overlay */}
        {showActions && (
          <Box sx={{
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
          }}>
            <IconButton
              onClick={handleToggleFavorite}
              size="small"
              sx={{
                bgcolor: 'rgba(255,255,255,0.9)',
                '&:hover': {
                  bgcolor: 'white'
                },
                boxShadow: 2,
                width: { xs: 24, md: 28, lg: 32 }, // Size responsive
                height: { xs: 24, md: 28, lg: 32 } // Size responsive
              }}
            >
              {isFavorited ?
                <FavoriteIcon sx={{ 
                  fontSize: { xs: 14, md: 16, lg: 18 }, 
                  color: 'error.main' 
                }} /> :
                <FavoriteBorderIcon sx={{ 
                  fontSize: { xs: 14, md: 16, lg: 18 }, 
                  color: 'text.secondary' 
                }} />
              }
            </IconButton>
          </Box>
        )}
      </Box>

      <CardContent sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        pb: variant === 'compact' ? 1.5 : 2,
        minHeight: 0, // Cho phép content co lại
        overflow: 'hidden', // Ngăn overflow không cần thiết
        p: { xs: 1, md: 1.5, lg: 2 } // Padding responsive
      }}>
        <Typography
          variant={variant === 'compact' ? 'body2' : 'h6'}
          sx={{
            fontWeight: 600,
            mb: 0.5,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.2,
            minHeight: 0, // Cho phép text co lại
            flexShrink: 0, // Ngăn text bị co quá nhỏ
            fontSize: { xs: '0.875rem', md: '1rem', lg: '1.125rem' } // Font size responsive
          }}
        >
          {product?.title || 'Untitled dish'}
        </Typography>

        {/* Category */}
        {product?.category && (
          <Typography variant="caption" color="text.secondary" sx={{ 
            mb: 0.5,
            fontSize: { xs: '0.7rem', md: '0.75rem', lg: '0.8rem' } // Font size responsive
          }}>
            {product.category}
          </Typography>
        )}

        {/* Rating */}
        {product?.rating && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary" sx={{
              fontSize: { xs: '0.7rem', md: '0.75rem', lg: '0.8rem' } // Font size responsive
            }}>
              ⭐ {product.rating}
            </Typography>
            {product?.reviewCount && (
              <Typography variant="caption" color="text.secondary" sx={{ 
                ml: 0.5,
                fontSize: { xs: '0.7rem', md: '0.75rem', lg: '0.8rem' } // Font size responsive
              }}>
                ({product.reviewCount})
              </Typography>
            )}
          </Box>
        )}

        {/* Nutrition info */}
        <Stack direction="row" spacing={1} mb={1}>
          {typeof caloriesValue === 'number' && (
            <Chip
              icon={<WhatshotIcon color="error" />}
              label={`${caloriesValue} kcal`}
              size="small"
              sx={{
                bgcolor: '#ffebee',
                fontWeight: 500,
                borderRadius: 2,
                fontSize: { xs: '0.6rem', md: '0.7rem', lg: '0.75rem' },
                height: { xs: 20, md: 24, lg: 28 }
              }}
            />
          )}
          {typeof carbValue === 'number' && (
            <Chip
              icon={<GrainIcon color="info" />}
              label={`${carbValue}g Carb`}
              size="small"
              sx={{ 
                bgcolor: '#e3f2fd', 
                fontWeight: 500, 
                borderRadius: 2,
                fontSize: { xs: '0.6rem', md: '0.7rem', lg: '0.75rem' }, // Font size responsive
                height: { xs: 20, md: 24, lg: 28 } // Height responsive
              }}
            />
          )}
          {typeof product?.fat === 'number' && (
            <Chip
              icon={<LocalPizzaIcon color="warning" />}
              label={`${product.fat}g Fat`}
              size="small"
              sx={{ 
                bgcolor: '#fff3e0', 
                fontWeight: 500, 
                borderRadius: 2,
                fontSize: { xs: '0.6rem', md: '0.7rem', lg: '0.75rem' }, // Font size responsive
                height: { xs: 20, md: 24, lg: 28 } // Height responsive
              }}
            />
          )}
          {typeof product?.protein === 'number' && (
            <Chip
              icon={<FitnessCenterIcon color="success" />}
              label={`${product.protein}g Protein`}
              size="small"
              sx={{ 
                bgcolor: '#e8f5e9', 
                fontWeight: 500, 
                borderRadius: 2,
                fontSize: { xs: '0.6rem', md: '0.7rem', lg: '0.75rem' }, // Font size responsive
                height: { xs: 20, md: 24, lg: 28 } // Height responsive
              }}
            />
          )}
        </Stack>

        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mt: 'auto',
          flexShrink: 0,
          minHeight: 0
        }}>
          <Box>
            {product?.originalPrice && product.originalPrice > product?.price && (
              <Typography
                variant="caption"
                sx={{
                  color: 'text.disabled',
                  textDecoration: 'line-through',
                  mr: 1,
                  fontSize: { xs: '0.7rem', md: '0.75rem', lg: '0.8rem' }
                }}
              >
                {formatPrice(product.originalPrice)}
              </Typography>
            )}
            <Typography
              variant={variant === 'compact' ? 'body2' : 'body1'}
              color="primary"
              sx={{
                fontWeight: 600,
                fontSize: { xs: '0.875rem', md: '1rem', lg: '1.125rem' }
              }}
            >
              {formatPrice(product?.price)}
            </Typography>
          </Box>
          {/* Bỏ nút thêm vào giỏ hàng */}
        </Box>
      </CardContent>
    </>
  )

  return (
    <Card
      elevation={variant === 'featured' ? 4 : 2}
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        border: variant === 'featured' ? 2 : 0,
        borderColor: variant === 'featured' ? 'primary.main' : 'transparent',
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-4px)'
        },
        // Đảm bảo card responsive tốt
        minWidth: 0,
        flex: 1,
        // Responsive height cố định
        minHeight: { xs: 200, md: 220, lg: 240 },
        // Đảm bảo card luôn lấp đầy container
        alignSelf: 'stretch',
        // Responsive width để đảm bảo card stretch đúng trong grid
        maxWidth: '100%'
      }}
    >
      {href ? (
        <Box
          component="a"
          href={href}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            width: '100%',
            textDecoration: 'none',
            color: 'inherit',
            flex: 1,
            '&:focus': {
              outline: '2px solid',
              outlineColor: 'primary.main'
            }
          }}
        >
          {cardContent}
        </Box>
      ) : (
        cardContent
      )}
    </Card>
  )
}