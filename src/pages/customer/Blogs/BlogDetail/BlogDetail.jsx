import {
  Box,
  Typography,
  Button,
  Grid,
  Divider
} from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Link } from 'react-router-dom'
import AppBar from '~/components/AppBar/AppBar'
import { detailedNewsItem, relatedNews } from '~/apis/mockData'

const RedUnderline = styled(Box)(({ theme }) => ({
  height: '4px',
  width: '60px',
  backgroundColor: '#e31b23',
  marginBottom: theme.spacing(3),
  borderRadius: '2px'
}))

const CategoryTag = styled(Button)(({ theme }) => ({
  backgroundColor: '#f5f7fa',
  color: 'black',
  fontWeight: 600,
  textTransform: 'none',
  padding: theme.spacing(0.5, 2),
  borderRadius: '15px',
  border: '1px solid #e0e0e0',
  '&:hover': {
    backgroundColor: theme.palette.grey[300],
    borderColor: theme.palette.grey[400]
  },
  fontSize: '0.7rem',
  boxShadow: 'none'
}))

const RelatedNewsCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1.5),
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.common.white,
  boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
  cursor: 'pointer',
  '&:hover': {
    boxShadow: '0 4px 8px rgba(0,0,0,0.12)'
  }
}))

const BlogDetail = () => {
  const theme = useTheme()

  const blogContent = detailedNewsItem.contentMarkdown

  return (
    <Box sx={{ backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: 'Roboto, sans-serif' }}>
      <AppBar />
      <Box
        sx={{
          mt: theme.fitbowl.appBarHeight,
          maxWidth: 1300,
          mx: 'auto',
          px: { xs: 2, md: 3 },
          pt: { xs: 4, md: 6 },
          pb: { xs: 8, md: 10 }
        }}
      >
        <Grid container spacing={{ xs: 4, md: 6 }}>
          <Grid item xs={12} md={8}>
            <Box sx={{ backgroundColor: 'white', p: { xs: 3, md: 5 }, borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  mb: 1.5,
                  fontFamily: 'Montserrat, sans-serif',
                  letterSpacing: '0.05em'
                }}
              >
                {detailedNewsItem.title}
              </Typography>
              <RedUnderline sx={{ mb: 2 }} />

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {detailedNewsItem.categories.map((category, index) => (
                  <CategoryTag key={index}>
                    {category}
                  </CategoryTag>
                ))}
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                {detailedNewsItem.date}
              </Typography>

              <Box sx={{
                color: 'text.primary',
                fontSize: '1rem',
                lineHeight: 1.7,
                '& h1, & h2, & h3, & h4, & h5, & h6': {
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 600,
                  mt: 4,
                  mb: 2,
                  color: 'text.primary'
                },
                '& p': { mb: 2 },
                '& ul, & ol': { ml: 3, mb: 2 },
                '& li': { mb: 1 },
                '& blockquote': {
                  borderLeft: `4px solid ${theme.palette.background.main}`,
                  backgroundColor: theme.palette.grey[100],
                  padding: theme.spacing(1, 2),
                  ml: 0,
                  mb: 2,
                  fontStyle: 'italic',
                  color: theme.palette.text.secondary
                },
                '& img': {
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: '8px',
                  mt: 2,
                  mb: 2
                }
              }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {blogContent}
                </ReactMarkdown>
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Box sx={{
          mt: 4
        }}>
          <Grid item xs={12} md={8}>
            <Box sx={{ backgroundColor: 'white', p: { xs: 2, md: 3 }, borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  mb: 2,
                  fontFamily: 'Montserrat, sans-serif'
                }}
              >
                RELATED NEWS
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {relatedNews.map((item) => (
                <Link to={`/blog/${item.id}`} key={item.id} style={{ textDecoration: 'none' }}>
                  <RelatedNewsCard>
                    <Box
                      component="img"
                      src={item.image}
                      alt={item.title}
                      sx={{
                        width: 80,
                        height: 80,
                        objectFit: 'cover',
                        borderRadius: '4px',
                        mr: 2
                      }}
                    />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        {item.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.date}
                      </Typography>
                    </Box>
                  </RelatedNewsCard>
                </Link>
              ))}
            </Box>
          </Grid>
        </Box>
      </Box>
    </Box>
  )
}

export default BlogDetail