import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { formatDate } from '~/utils/formatter'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import Button from '@mui/material/Button'
import MDEditor from '@uiw/react-md-editor'
import AppBar from '~/components/AppBar/AppBar'
import { getPostBySlugAPI, getPostsFilteredAPI } from '~/apis'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import theme from '~/theme'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import ButtonBase from '@mui/material/ButtonBase'
import { useTranslation } from 'react-i18next'

export default function PostDetails() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(false)
  const [relatedPosts, setRelatedPosts] = useState([])

  useEffect(() => {
    ; (async () => {
      setLoading(true)
      try {
        const p = await getPostBySlugAPI(slug)
        setPost(p)
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    })()
  }, [slug])

  useEffect(() => {
    if (!post) return
    const fetchRelatedPosts = async () => {
      try {
        // prefer category id if available, otherwise search by category name
        const catId = post.categoryId || (post.category && post.category.id) || null
        let res
        if (catId) {
          res = await getPostsFilteredAPI(1, 6, 'PUBLISHED', String(catId), undefined)
        } else if (post.categoryName) {
          res = await getPostsFilteredAPI(1, 6, 'PUBLISHED', undefined, post.categoryName)
        }

        if (res && res.items) {
          setRelatedPosts(res.items.filter(i => i.id !== post.id).slice(0, 6))
        }
      } catch {
        // ignore
      }
    }
    fetchRelatedPosts()
  }, [post])

  if (loading) return (
    <Box>
      <AppBar />
      <Box sx={{
        mt: theme.fitbowl.appBarHeight,
        minHeight: `calc(100vh - ${theme.fitbowl.appBarHeight})`,
        // py: { xs: 3, sm: 4, md: 5 },
        px: { xs: 3, sm: 4, md: 5, lg: 7 }
      }}>
        <Box sx={{ mt: 1, py: 1 }}>
          <Button startIcon={<ArrowBackIosIcon fontSize='small' />} variant="text" size="medium" onClick={() => navigate('/blog')}>{t('posts.postDetails.backToBlogs')}</Button>
        </Box>
        <Box sx={{ p: 3 }}>
          <Skeleton variant="text" width="60%" height={40} />
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="rectangular" height={320} sx={{ my: 2 }} />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
        </Box>
      </Box>
    </Box>
  )
  if (!post) return <Container sx={{ py: 4 }}><Box sx={{ p: 3 }}>{t('posts.postDetails.postNotFound')}</Box></Container>

  return (
    <Box>
      <AppBar />
      <Box sx={{
        mt: theme.fitbowl.appBarHeight,
        minHeight: `calc(100vh - ${theme.fitbowl.appBarHeight})`,
        // py: { xs: 3, sm: 4, md: 5 },
        px: { xs: 3, sm: 4, md: 10 }
      }}>
        <Box sx={{ mt: 1, py: 1 }}>
          <Button startIcon={<ArrowBackIosIcon fontSize='small' />} variant="text" size="medium" onClick={() => navigate('/blog')}>{t('posts.postDetails.backToBlogs')}</Button>
        </Box>

        <Box sx={{ p: 1 }}>
          <Typography variant="h3" sx={{ mb: 1, fontWeight: 700 }}>{post.title}</Typography>
          <Typography variant="caption" color="text.secondary">{post.categoryName || ''} — {post.publishedAt ? formatDate(post.publishedAt) : ''}</Typography>

          

          {post.imageUrl && (
            <Box sx={{ mt: 2 }}>
              <Box component="img" src={post.imageUrl} alt={post.title} sx={{ width: '100%', maxHeight: 480, objectFit: 'cover', borderRadius: 1 }} />
            </Box>
          )}

          <Box sx={{ mt: 2 }} data-color-mode="light">
            {/* Use MDEditor preview to render content (markdown -> HTML, images, etc.) */}
            <MDEditor.Markdown source={post.content || ''} />
          </Box>

          {/* Related posts slider */}
          {relatedPosts.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>{t('posts.postDetails.relatedPosts')}</Typography>
              <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
                {relatedPosts.map(r => (
                  <ButtonBase key={r.id} onClick={() => navigate(`/blog/${r.slug || r.id}`)} sx={{ minWidth: 260 }}>
                    <Card sx={{ width: 260 }}>
                      {r.imageUrl && <CardMedia component="img" image={r.imageUrl} alt={r.title} sx={{ height: 120, objectFit: 'cover' }} />}
                      <CardContent>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{r.title}</Typography>
                        <Typography variant="caption" color="text.secondary">{r.categoryName}</Typography>
                      </CardContent>
                    </Card>
                  </ButtonBase>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}
