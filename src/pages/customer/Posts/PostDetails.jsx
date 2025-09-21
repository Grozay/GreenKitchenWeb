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
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar'
import ShareIcon from '@mui/icons-material/Share'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import Grid from '@mui/material/Grid'

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
      <Container maxWidth="lg" sx={{
        mt: theme.fitbowl.appBarHeight,
        minHeight: `calc(100vh - ${theme.fitbowl.appBarHeight})`,
        py: 4
      }}>
        <Box sx={{ mt: 1, py: 1 }}>
          <Button startIcon={<ArrowBackIosIcon fontSize='small' />} variant="text" size="medium" onClick={() => navigate('/blog')}>{t('posts.postDetails.backToBlogs')}</Button>
        </Box>
        
        <Paper sx={{ p: 4 }}>
          <Skeleton variant="text" width="80%" height={60} sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Skeleton variant="rectangular" width={80} height={24} />
            <Skeleton variant="text" width={120} />
          </Box>
          <Skeleton variant="rectangular" height={400} sx={{ mb: 3 }} />
          <Skeleton variant="text" height={24} sx={{ mb: 1 }} />
          <Skeleton variant="text" height={24} sx={{ mb: 1 }} />
          <Skeleton variant="text" height={24} width="70%" />
        </Paper>
      </Container>
    </Box>
  )
  if (!post) return <Container sx={{ py: 4 }}><Box sx={{ p: 3 }}>{t('posts.postDetails.postNotFound')}</Box></Container>

  return (
    <Box>
      <AppBar />
      <Container maxWidth="lg" sx={{
        mt: theme.fitbowl.appBarHeight,
        minHeight: `calc(100vh - ${theme.fitbowl.appBarHeight})`,
        py: 4
      }}>
        <Box sx={{ mt: 1, py: 1 }}>
          <Button startIcon={<ArrowBackIosIcon fontSize='small' />} variant="text" size="medium" onClick={() => navigate('/blog')}>{t('posts.postDetails.backToBlogs')}</Button>
        </Box>

        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 4, borderRadius: 2 }}>
              {/* Header */}
              <Box sx={{ mb: 4 }}>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    mb: 2, 
                    fontWeight: 700,
                    fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
                    lineHeight: 1.3
                  }}
                >
                  {post.title}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Chip 
                    label={post.categoryName || 'Uncategorized'} 
                    color="primary" 
                    variant="outlined"
                    size="small"
                  />
                  <Typography variant="body2" color="text.secondary">
                    {post.publishedAt ? formatDate(post.publishedAt) : ''}
                  </Typography>
                </Box>

                <Divider sx={{ mb: 3 }} />
              </Box>

              {/* Featured Image */}
              {post.imageUrl && (
                <Box sx={{ mb: 4 }}>
                  <Box 
                    component="img" 
                    src={post.imageUrl} 
                    alt={post.title} 
                    sx={{ 
                      width: '100%', 
                      height: { xs: 250, sm: 350, md: 400 },
                      objectFit: 'cover', 
                      borderRadius: 2,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                    }} 
                  />
                </Box>
              )}

              {/* Content */}
              <Box 
                sx={{ 
                  '& .w-md-editor-text-container': {
                    fontSize: '1.1rem',
                    lineHeight: 1.7
                  },
                  '& .w-md-editor-text-container h1, .w-md-editor-text-container h2, .w-md-editor-text-container h3': {
                    marginTop: '2rem',
                    marginBottom: '1rem'
                  },
                  '& .w-md-editor-text-container p': {
                    marginBottom: '1.5rem'
                  },
                  '& .w-md-editor-text-container img': {
                    borderRadius: 1,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }
                }}
                data-color-mode="light"
              >
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
              {/* Actions */}
              <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #e0e0e0' }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button 
                    variant="outlined" 
                    startIcon={<ShareIcon />}
                    size="small"
                  >
                    Share
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<BookmarkBorderIcon />}
                    size="small"
                  >
                    Save
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Box sx={{ position: 'sticky', top: 100 }}>
              {/* Author Info */}
              <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.main', mr: 2 }}>
                    GK
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Green Kitchen
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Healthy Living Expert
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Sharing healthy recipes, nutrition tips, and lifestyle advice to help you live your best life.
                </Typography>
              </Paper>

              {/* Table of Contents Placeholder */}
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  In This Article
                </Typography>
                <Box sx={{ pl: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                    • Introduction
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                    • Key Points
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                    • Conclusion
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <Box sx={{ mt: 6 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 4, 
                fontWeight: 600,
                textAlign: 'center'
              }}
            >
              Related Articles
            </Typography>
            <Grid container spacing={3}>
              {relatedPosts.map(r => (
                <Grid item xs={12} sm={6} md={4} key={r.id}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                      }
                    }}
                    onClick={() => navigate(`/blog/${r.slug || r.id}`)}
                  >
                    {r.imageUrl && (
                      <CardMedia 
                        component="img" 
                        image={r.imageUrl} 
                        alt={r.title} 
                        sx={{ 
                          height: 200, 
                          objectFit: 'cover' 
                        }} 
                      />
                    )}
                    <CardContent sx={{ flex: 1, p: 3 }}>
                      <Chip 
                        label={r.categoryName || 'Uncategorized'} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                        sx={{ mb: 2 }}
                      />
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600,
                          mb: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {r.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {r.publishedAt ? formatDate(r.publishedAt) : ''}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  )
}
