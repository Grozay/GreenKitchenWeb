import { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentEmployee } from '~/redux/user/employeeSlice'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import LinearProgress from '@mui/material/LinearProgress'
import IconButton from '@mui/material/IconButton'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import MDEditor from '@uiw/react-md-editor'
import { createPostAPI, getPostByIdAPI, updatePostAPI, getPostCategoriesAPI, uploadPostImageAPI } from '~/apis'
import { toast } from 'react-toastify'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'


export default function PostCreate() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState([])
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)
  const { id } = useParams()
  const isEdit = !!id
  const location = useLocation()
  const preloadedPost = location?.state?.post
  const fileInputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  // upload progress not tracked; show indeterminate while uploading
  const currentEmployee = useSelector(selectCurrentEmployee)
  const [slug, setSlug] = useState('')
  const [slugDirty, setSlugDirty] = useState(false)
  // excerpt removed
  const [imageUrl, setImageUrl] = useState('')
  const [uploadedImages, setUploadedImages] = useState([])
  const [postStatus, setPostStatus] = useState('DRAFT')
  const thumbInputRef = useRef(null)

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) {
      toast.error('Vui lòng chọn file để tải lên')
      return
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      setError('Chỉ chấp nhận file JPG, PNG')
      return
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      setError('Kích thước file không được vượt quá 5MB')
      return
    }

    setUploading(true)
    setError('')

    try {
      // uploadPostImageAPI returns the image URL as plain string (response.data)
      const url = await toast.promise(
        uploadPostImageAPI(file),
        {
          pending: 'Uploading...',
          success: 'Upload successful!',
          error: 'Upload failed'
        }
      )

      if (!url) {
        setError('No URL returned from upload')
        toast.error('No URL returned from upload')
        throw new Error('No URL returned from upload')
      }

      // insert markdown image into content
      setContent((prev) => prev + `\n\n![${file.name}](${url})\n`)
      // store uploaded URL for preview list
      setUploadedImages((prev) => [...prev, url])
    } catch (err) {
      setError(err?.message || 'Có lỗi xảy ra khi tải lên ảnh')
      // eslint-disable-next-line no-console
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleThumbChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      setError('Chỉ chấp nhận file JPG, PNG')
      return
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      setError('Kích thước file không được vượt quá 5MB')
      return
    }

    setUploading(true)
    setError('')

    try {
      // uploadPostImageAPI returns the image URL as plain string (response.data)
      const url = await toast.promise(
        uploadPostImageAPI(file),
        {
          pending: 'Uploading...',
          success: 'Upload successful!',
          error: 'Upload failed'
        }
      )

      if (!url) {
        setError('No URL returned from upload')
        toast.error('No URL returned from upload')
        throw new Error('No URL returned from upload')
      }

      // set thumbnail image URL and add to uploaded list
      setImageUrl(url)
      setUploadedImages((prev) => [...prev, url])
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi tải lên ảnh')
      // eslint-disable-next-line no-console
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
      if (thumbInputRef.current) thumbInputRef.current.value = ''
    }
  }

  const canSave = title.trim().length > 0 && content && !loading

  // auto-generate slug from title unless user edited slug
  useEffect(() => {
    if (slugDirty) return
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

    setSlug(slugify(title))
  }, [title, slugDirty])

  // load post when editing
  useEffect(() => {
    if (!isEdit) return
    let mounted = true

    // If post data was provided via navigation state, use it and skip remote fetch
    if (preloadedPost) {
      const p = preloadedPost
      if (mounted) {
        setTitle(p.title || '')
        setContent(p.content || '')
        if (p.categoryId) setSelectedCategoryId(p.categoryId)
        else if (p.categoryName) {
          const found = categories.find((c) => c.name === p.categoryName || c.slug === p.categoryName)
          if (found) setSelectedCategoryId(found.id)
        }
        setSlug(p.slug || '')
        setImageUrl(p.imageUrl || '')
        setPostStatus(p.status || 'DRAFT')
      }
      return () => { mounted = false }
    }

    async function load() {
      try {
        const p = await getPostByIdAPI(id)
        if (!mounted || !p) return
        setTitle(p.title || '')
        setContent(p.content || '')
        if (p.categoryId) setSelectedCategoryId(p.categoryId)
        else if (p.categoryName) {
          const found = categories.find((c) => c.name === p.categoryName || c.slug === p.categoryName)
          if (found) setSelectedCategoryId(found.id)
        }
        setSlug(p.slug || '')
        setImageUrl(p.imageUrl || '')
        setPostStatus(p.status || 'DRAFT')
      } catch (err) {
        setError(err?.message || 'Failed to load post')
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [id, isEdit, categories, preloadedPost])

  // load categories once
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const cats = await getPostCategoriesAPI()
        if (!mounted) return
        setCategories(cats || [])
      } catch (err) {
        // ignore but reference err to avoid unused variable lint
        void err
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const submitPost = async (targetStatus) => {
    if (!canSave) return
    if (!selectedCategoryId) {
      toast.error('Vui lòng chọn chuyên mục trước khi lưu')
      return
    }
    setLoading(true)
    setError('')
    try {
      const payload = {
        title: title.trim(),
        content,
        slug: slug || undefined,
        authorId: currentEmployee?.id || null,
        categoryId: selectedCategoryId || null,
        imageUrl: imageUrl || undefined,
        // set publishedAt now if publishing
        publishedAt: targetStatus === 'PUBLISHED' ? new Date().toISOString() : null,
        status: targetStatus || undefined
      }

      const action = isEdit ? updatePostAPI(id, payload) : createPostAPI(payload)
      await toast.promise(
        action,
        {
          pending: targetStatus === 'PUBLISHED' ? 'Publishing post...' : 'Saving draft...',
          success: targetStatus === 'PUBLISHED' ? 'Published successfully' : 'Saved as draft',
          error: 'Failed to save post'
        }
      )
      navigate('/management/posts/list')
    } catch (err) {
      setError(err.message || 'Failed to save post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Paper sx={{ p: 3 }} elevation={2}>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h4">{isEdit ? 'Edit Post' : 'Create Post'}</Typography>
              {isEdit && (
                <Chip label={postStatus} color={postStatus === 'PUBLISHED' ? 'success' : 'default'} size="small" />
              )}
            </Box>

            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
            />

            <TextField
              disabled
              label="Slug"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value)
                setSlugDirty(true)
              }}
              fullWidth
            />

            {/* Excerpt removed */}

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField label="Post Image" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} fullWidth />
              <input ref={thumbInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleThumbChange} />
              <Button variant="outlined" onClick={() => thumbInputRef.current.click()} disabled={uploading}>Upload Image</Button>
            </Box>

            {/* Publish controls replaced by action buttons below */}

            <Box>
              <FormControl fullWidth>
                <InputLabel id="post-category-label">Category</InputLabel>
                <Select
                  labelId="post-category-label"
                  label="Category"
                  value={selectedCategoryId ?? ''}
                  onChange={(e) => setSelectedCategoryId(e.target.value ? Number(e.target.value) : null)}
                >
                  {categories && categories.length > 0 ? (
                    categories.map((c) => (
                      <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                    ))
                  ) : (
                    <MenuItem value="">No categories</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Box>

            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Content
              </Typography>
              <Box data-color-mode="light">
                <MDEditor
                  value={content}
                  onChange={(v) => setContent(v || '')}
                  height={400}
                  preview="live"
                />
              </Box>
            </Box>

            <Box>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <Stack direction="row" spacing={2} alignItems="center">
                <Button
                  variant="outlined"
                  onClick={() => fileInputRef.current.click()}
                  disabled={uploading}
                >
                  Insert Image
                </Button>
                {uploading && (
                  <Box sx={{ display: 'flex', alignItems: 'center', width: 240 }}>
                    <LinearProgress sx={{ flex: 1, mr: 2 }} />
                  </Box>
                )}
              </Stack>
              {uploadedImages.length > 0 && (
                <Box sx={{ mt: 1, display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                  {uploadedImages.map((u) => (
                    <Box key={u} sx={{ position: 'relative' }}>
                      <Box component="img" src={u} alt="uploaded" sx={{ height: 80, width: 120, objectFit: 'cover', borderRadius: 1, border: '1px solid rgba(0,0,0,0.08)' }} />
                      <IconButton
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          bgcolor: 'rgba(0,0,0,0.4)',
                          color: '#fff',
                          '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' }
                        }}
                        onClick={() => { navigator.clipboard?.writeText(u); toast.success('Copied!') }}
                        aria-label="copy-url"
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={() => navigate('/management/posts')}>Cancel</Button>
              <Button variant="outlined" disabled={!canSave} onClick={() => submitPost('DRAFT')}>Save as Draft</Button>
              <Button variant="contained" disabled={!canSave} onClick={() => submitPost('PUBLISHED')} startIcon={loading ? <CircularProgress size={16} /> : null}>Publish</Button>
            </Stack>
          </Stack>
        </form>
      </Paper>

    </Container>
  )
}
