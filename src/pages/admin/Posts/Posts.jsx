import { useEffect, useState } from 'react'
import { useRef } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Chip from '@mui/material/Chip'
import { useNavigate } from 'react-router-dom'
import { getPostCategoriesAPI, getPostByIdAPI, getPostsFilteredAPI } from '~/apis'
import Pagination from '@mui/material/Pagination'
import { toast } from 'react-toastify'
import { Typography } from '@mui/material'

export default function Posts() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [page, setPage] = useState(1)
  const [size] = useState(10)
  const [total, setTotal] = useState(0)
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [searchText, setSearchText] = useState('')
  const [debouncedSearchText, setDebouncedSearchText] = useState('')
  const [searching, setSearching] = useState(false)
  const searchTimeout = useRef()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await getPostCategoriesAPI()
        setCategories(cats || [])
      } catch {
        toast.error('Failed to load categories')
      }
    }
    fetchCategories()
  }, [])


  // Debounce searchText
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current)
    setSearching(true)
    searchTimeout.current = setTimeout(() => {
      setDebouncedSearchText(searchText)
      setSearching(false)
    }, 1000)
    return () => clearTimeout(searchTimeout.current)
  }, [searchText])

  // fetch posts when page/status/debouncedSearchText/category change
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      try {
        const res = await getPostsFilteredAPI(
          page,
          size,
          statusFilter === 'ALL' ? undefined : statusFilter,
          categoryFilter ? Number(categoryFilter) : undefined,
          debouncedSearchText || undefined
        )
        setPosts(res.items)
        setTotal(res.total)
      } catch {
        toast.error('Failed to load posts')
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [page, size, statusFilter, debouncedSearchText, categoryFilter])


  const handleEdit = async (postId) => {
    try {
      const post = await toast.promise(
        getPostByIdAPI(postId),
        { pending: 'Loading post...', success: 'Ready to edit', error: 'Failed to load post' }
      )
      if (post) {
        navigate(`/management/posts/edit/${postId}`, { state: { post } })
      }
    } catch (e) {
      // toast.promise displays error already; keep console for debugging
      // eslint-disable-next-line no-console
      console.error('Failed to load post for edit', e)
    }
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Typography variant="h3" gutterBottom>
          Posts Management
        </Typography>
        <Paper sx={{ p: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <FormControl sx={{ minWidth: 220 }} size="small">
              <InputLabel id="category-filter-label">Category</InputLabel>
              <Select
                labelId="category-filter-label"
                label="Category"
                value={categoryFilter}
                onChange={(e) => { setCategoryFilter(e.target.value); setPage(1) }}
              >
                <MenuItem value="">All</MenuItem>
                {categories.map(c => (
                  <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 160 }} size="small">
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                label="Status"
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
              >
                <MenuItem value="ALL">All</MenuItem>
                <MenuItem value="PUBLISHED">Published</MenuItem>
                <MenuItem value="DRAFT">Draft</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Search Posts..."
              variant="outlined"
              size="small"
              value={searchText}
              onChange={e => { setSearchText(e.target.value); setPage(1) }}
              sx={{ minWidth: 220 }}
              slotProps={{
                input: {
                  endAdornment: searching ? <CircularProgress size={20} /> : null
                }
              }}
            />
            <Box sx={{ flex: 1 }} />
            <Button variant="contained" onClick={() => navigate('/management/posts/create')}>Create Post</Button>
          </Stack>

          {searching && (
            <LinearProgress sx={{ mb: 1 }} />
          )}

          <TableContainer>
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Published At</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {posts.map(p => (
                  <TableRow key={p.id} hover>
                    <TableCell>{p.title}</TableCell>
                    <TableCell>{p.categoryName || '-'}</TableCell>
                    <TableCell>
                      <Chip label={p.status} size="small" color={p.status === 'PUBLISHED' ? 'success' : 'default'} />
                    </TableCell>
                    <TableCell>{p.publishedAt ? new Date(p.publishedAt).toLocaleString() : '-'}</TableCell>
                    <TableCell align="right">
                      <Button size="small" onClick={() => handleEdit(p.id)}>Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
                {posts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">No posts found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {total > size && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Pagination count={Math.ceil(total / size)} page={page} onChange={(_, v) => setPage(v)} />
            </Box>
          )}
        </Paper>
      </Container>
    </>
  )
}
