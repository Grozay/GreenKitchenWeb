import { useEffect, useState, useRef } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'
import MDEditor from '@uiw/react-md-editor'
import SearchBar from './SearchBar'
import CategoryFilter from './CategoryFilter'
import PostPreview from './PostPreview'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getPostCategoriesAPI, getPostsFilteredAPI } from '~/apis'
import Pagination from '@mui/material/Pagination'
import { formatDate } from '~/utils/formatter'
import { Container, Popover, Skeleton } from '@mui/material'
import FilterMobile from './FilterMobile'
import theme from '~/theme'
import AppBar from '~/components/AppBar/AppBar'
import Footer from '~/components/Footer/Footer'


export default function PostLayout() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [searchParams, setSearchParams] = useSearchParams()
  const initialPage = parseInt(searchParams.get('page') || '1', 10)
  const initialCategory = searchParams.get('category') || ''
  const initialQuery = searchParams.get('q') || ''
  const [category, setCategory] = useState(initialCategory)
  const [query, setQuery] = useState(initialQuery)
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery)
  const [debouncedCategory, setDebouncedCategory] = useState(initialCategory)
  const [isSearching, setIsSearching] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(initialPage)
  const [size] = useState(12)
  const [total, setTotal] = useState(0)
  const [anchorEl, setAnchorEl] = useState(null)
  const [hoveredPost, setHoveredPost] = useState(null)
  const hoverTimerRef = useRef(null)
  const open = Boolean(anchorEl && hoveredPost)


  // fetch categories once
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await getPostCategoriesAPI()
        setCategories(cats || [])
      } catch {
        // ignore
      }
    }
    loadCategories()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const res = await getPostsFilteredAPI(
          page,
          size,
          'PUBLISHED',
          debouncedCategory || undefined,
          debouncedQuery || undefined
        )
        setPosts(res.items)
        setTotal(res.total)
      } catch {
        // ignore
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [page, size, debouncedCategory, debouncedQuery, setIsLoading])

  // sync search params to address bar
  useEffect(() => {
    const params = {}
    if (page && page > 1) params.page = String(page)
    if (debouncedCategory) params.category = String(debouncedCategory)
    if (debouncedQuery) params.q = String(debouncedQuery)
    setSearchParams(params)
  }, [page, debouncedCategory, debouncedQuery, setSearchParams])

  // debounce query input: update debouncedQuery 1s after user stops typing
  useEffect(() => {
    const id = setTimeout(() => { setDebouncedQuery(query); setIsSearching(false) }, 1000)
    return () => clearTimeout(id)
  }, [query])

  // debounce category selection: update debouncedCategory 1s after user selects
  useEffect(() => {
    const id = setTimeout(() => { setDebouncedCategory(category); setIsLoading(false) }, 500)
    return () => clearTimeout(id)
  }, [category])

  // wrap setters so changing filters resets page to 1 immediately
  const setCategoryAndReset = (v) => { setCategory(v); setPage(1), setIsLoading(true) }
  const setQueryAndReset = (v) => { setQuery(v); setPage(1); setIsSearching(true) }

  // cleanup hover timer on unmount
  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current)
    }
  }, [])

  // mouse handlers for popover with 500ms open delay
  const handleMouseEnter = (e, post) => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current)
    const target = e.currentTarget
    hoverTimerRef.current = setTimeout(() => {
      setAnchorEl(target)
      setHoveredPost(post)
      hoverTimerRef.current = null
    }, 500)
  }

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current)
      hoverTimerRef.current = null
    }
    setAnchorEl(null); setHoveredPost(null)
  }


  return (
    <Box>
      {isLoading && (
        <LinearProgress
          color="primary"
          variant="indeterminate"
          sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1300 }}
        />
      )}

      <AppBar />

      <Container
        maxWidth="xl"
        sx={{
          mt: theme.fitbowl.appBarHeight,
          minHeight: `calc(100vh - ${theme.fitbowl.appBarHeight})`,
          py: { xs: 3, sm: 4, md: 5 },
          px: { xs: 3, sm: 4, md: 10 }
        }}
      >
        <SearchBar
          query={query}
          setQuery={setQueryAndReset}
          isSearching={isSearching}
        />

        <Grid container spacing={2}>
          <Grid
            size={{ xs: 12, sm: 4, md: 2.5, lg: 2 }}
            display={{ xs: 'none', sm: 'block' }}
          >
            <CategoryFilter categories={categories} category={category} setCategory={setCategoryAndReset} />
          </Grid>

          {/* <Grid
            display={{ xs: 'block', sm: 'none' }}
          >
            <FilterMobile categories={categories} category={category} setCategory={setCategoryAndReset} setQuery={setQueryAndReset} />
          </Grid> */}


          <Grid size={{ xs: 12, sm: 8, md: 9.5, lg: 10 }}>
            <Grid container spacing={2}>
              {posts.length > 0 && posts.map(p => (
                <Grid size={{ xs: 6, sm: 12, md: 6, lg: 4 }} key={p.id}>
                  <Card
                    sx={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
                    aria-owns={open ? 'mouse-over-popover' : undefined}
                    aria-haspopup="true"
                    onClick={() => navigate(`/forum/${p.slug || p.id}`)}
                    onMouseEnter={(e) => handleMouseEnter(e, p)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <CardMedia component="img" sx={{ width: '100%', height: 140 }} image={p.imageUrl || <Skeleton variant="rectangular" width="100%" height="140px" />} alt={p.title} />
                    <CardContent sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          display: 'block'
                        }}
                      >
                        {p.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {p.categoryName || 'Uncategorized'} - {p.publishedAt ? formatDate(p.publishedAt) : ''}
                      </Typography>
                      <Box
                        sx={{
                          mt: 1,
                          color: '#333',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        <MDEditor.Markdown source={p.content || ''} />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}

              <Popover
                id="mouse-over-popover"
                sx={{ pointerEvents: 'none' }}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'center',
                  horizontal: 'center'
                }}
                transformOrigin={{
                  vertical: 'center',
                  horizontal: 'center'
                }}
                onClose={() => { setAnchorEl(null); setHoveredPost(null) }}
                disableAutoFocus
                disableScrollLock
                disableEscapeKeyDown
                disablePortal
                disableEnforceFocus
                disableRestoreFocus
              >
                <Box sx={{ p: 1 }}>
                  {hoveredPost && <PostPreview post={hoveredPost} />}
                </Box>
              </Popover>

              {/* Pagination */}
              {total > size && (
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, width: '100%' }}>
                    <Pagination count={Math.ceil(total / size)} page={page} onChange={(_, v) => setPage(v)} />
                  </Box>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </Box>
  )
}
