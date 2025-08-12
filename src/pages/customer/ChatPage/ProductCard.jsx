import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActionArea from '@mui/material/CardActionArea'
import Typography from '@mui/material/Typography'
import { useMemo } from 'react'

export default function ProductCard({ product }) {
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

  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': { boxShadow: 6 }
      }}
    >
      {href ? (
        <CardActionArea
          href={href}
          component="a"
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', height: '100%' }}
          aria-label={product?.title || 'Xem món'}
        >
          <CardMedia
            component="img"
            height="140"
            image={product?.image || '/img/placeholder.jpg'}
            alt={product?.title || 'Món ăn'}
            loading="lazy"
            onError={(e) => { e.currentTarget.src = '/img/placeholder.jpg' }}
          />
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {product?.title || 'Món chưa đặt tên'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {formatPrice(product?.price)}
            </Typography>
          </CardContent>
        </CardActionArea>
      ) : (
        <>
          <CardMedia
            component="img"
            height="140"
            image={product?.image || '/img/placeholder.jpg'}
            alt={product?.title || 'Món ăn'}
            loading="lazy"
            onError={(e) => { e.currentTarget.src = '/img/placeholder.jpg' }}
          />
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {product?.title || 'Món chưa đặt tên'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {formatPrice(product?.price)}
            </Typography>
          </CardContent>
        </>
      )}
    </Card>
  )
}
