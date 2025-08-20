import { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentEmployee } from '~/redux/user/employeeSlice'
import {
  Container,
  Paper,
  TextField,
  Button,
  Stack,
  Typography,
  CircularProgress,
  Alert,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  LinearProgress
} from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import MDEditor from '@uiw/react-md-editor'
import { createPostAPI, getPostByIdAPI, updatePostAPI, getPostCategoriesAPI } from '~/apis'

// Configure Cloudinary: set these env vars in your frontend build or replace the placeholders
const CLOUDINARY_CLOUD_NAME = (typeof window !== 'undefined' && window.__env?.REACT_APP_CLOUDINARY_CLOUD_NAME) || '<your-cloud-name>'
const CLOUDINARY_UPLOAD_PRESET = (typeof window !== 'undefined' && window.__env?.REACT_APP_CLOUDINARY_UPLOAD_PRESET) || '<your-upload-preset>'
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`

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
  const fileInputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const currentEmployee = useSelector(selectCurrentEmployee)
  const [slug, setSlug] = useState('')
  const [slugDirty, setSlugDirty] = useState(false)
  const [excerpt, setExcerpt] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const thumbInputRef = useRef(null)
  const [publishedAt, setPublishedAt] = useState('')
  const [status, setStatus] = useState('DRAFT')

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadProgress(0)
    setError('')

    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

      // simple fetch upload; Cloudinary doesn't support progress via fetch easily.
      const res = await fetch(CLOUDINARY_UPLOAD_URL, { method: 'POST', body: fd })
      if (!res.ok) throw new Error('Upload failed')
      const json = await res.json()
      const url = json.secure_url || json.url
      if (!url) throw new Error('No URL returned from upload')

      // insert markdown image at cursor: append at end for simplicity
      setContent((prev) => prev + `\n\n![${file.name}](${url})\n`)
    } catch (err) {
      setError(err.message || 'Upload error')
    } finally {
      setUploading(false)
      setUploadProgress(0)
      e.target.value = null
    }
  }

  const handleThumbChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadProgress(0)
    setError('')

    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
      const res = await fetch(CLOUDINARY_UPLOAD_URL, { method: 'POST', body: fd })
      if (!res.ok) throw new Error('Upload failed')
      const json = await res.json()
      const url = json.secure_url || json.url
      if (!url) throw new Error('No URL returned from upload')
      setImageUrl(url)
    } catch (err) {
      setError(err.message || 'Upload error')
    } finally {
      setUploading(false)
      setUploadProgress(0)
      e.target.value = null
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

    async function load() {
      try {
        const p = await getPostByIdAPI(id)
        if (!mounted || !p) return
        setTitle(p.title || '')
        setContent(p.content || '')
        // if backend returns categoryId/name, set selected category
        if (p.categoryId) setSelectedCategoryId(p.categoryId)
        else if (p.categoryName) {
          // try to match by name after categories load
          const found = categories.find((c) => c.name === p.categoryName || c.slug === p.categoryName)
          if (found) setSelectedCategoryId(found.id)
        }
        setSlug(p.slug || '')
        setExcerpt(p.excerpt || '')
        setImageUrl(p.imageUrl || '')
        if (p.publishedAt) setPublishedAt(p.publishedAt.substring(0, 16))
        if (p.status) setStatus(p.status)
      } catch (err) {
        setError(err?.message || 'Failed to load post')
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [id, isEdit, categories])

  // load categories once
  useEffect(() => {
    let mounted = true
    ;(async () => {
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
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSave) return
    setLoading(true)
    setError('')
    try {
      const payload = {
        title: title.trim(),
        content,
        slug: slug || undefined,
        excerpt: excerpt || undefined,
        authorId: currentEmployee?.id || null,
        categoryId: selectedCategoryId || null,
        imageUrl: imageUrl || undefined,
        publishedAt: publishedAt ? new Date(publishedAt).toISOString() : null,
        status: status || undefined
      }
      // try to supply slug/excerpt/imageUrl if available
      // slug will be generated server-side if not provided
      if (isEdit) {
        await updatePostAPI(id, payload)
      } else {
        await createPostAPI(payload)
      }
      navigate('/management/posts/list')
    } catch (err) {
      setError(err.message || 'Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Paper sx={{ p: 3 }} elevation={2}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <Typography variant="h4">Create Post</Typography>

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

            <TextField
              label="Excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              fullWidth
              multiline
              minRows={2}
            />

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField label="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} fullWidth />
              <input ref={thumbInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleThumbChange} />
              <Button variant="outlined" onClick={() => thumbInputRef.current.click()} disabled={uploading}>Upload Image</Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Published at"
                type="datetime-local"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <FormControl sx={{ minWidth: 160 }}>
                <InputLabel id="post-status-label">Status</InputLabel>
                <Select labelId="post-status-label" label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <MenuItem value="DRAFT">Draft</MenuItem>
                  <MenuItem value="PUBLISHED">Published</MenuItem>
                  <MenuItem value="ARCHIVED">Archived</MenuItem>
                </Select>
              </FormControl>
            </Box>

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
                <MDEditor value={content} onChange={(v) => setContent(v || '')} height={400} preview="edit" />
              </Box>
            </Box>

            <Box>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
              <Stack direction="row" spacing={2} alignItems="center">
                <Button variant="outlined" onClick={() => fileInputRef.current.click()} disabled={uploading}>
                  Insert Image
                </Button>
                {uploading && (
                  <Box sx={{ display: 'flex', alignItems: 'center', width: 240 }}>
                    <LinearProgress sx={{ flex: 1, mr: 2 }} variant="determinate" value={uploadProgress} />
                    <Typography variant="caption">{Math.round(uploadProgress)}%</Typography>
                  </Box>
                )}
              </Stack>
            </Box>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={() => navigate('/management/posts')}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={!canSave} startIcon={loading ? <CircularProgress size={16} /> : null}>
                Save
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Container>
  )
}
