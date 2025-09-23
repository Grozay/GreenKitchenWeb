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
// removed spinner icon per user preference
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'
// not using IconButton; prefer Button text-only
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import MDEditor from '@uiw/react-md-editor'
import { createPostAPI, getPostByIdAPI, updatePostAPI, getPostCategoriesAPI, uploadPostImageAPI, generateAIContentAPI, generateAITitleAPI, generateAIContentOnlyAPI, suggestAITopicsAPI } from '~/apis'
import { toast } from 'react-toastify'
// removed MUI icons per user preference
import { useConfirm } from 'material-ui-confirm'


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
  const [postPriority, setPostPriority] = useState('normal')
  const thumbInputRef = useRef(null)
  const confirm = useConfirm()
  
  // AI Content Generation states
  const [aiLoading, setAiLoading] = useState(false)
  const [aiTopic, setAiTopic] = useState('')
  const [aiStyle, setAiStyle] = useState('friendly')
  const [aiTargetAudience, setAiTargetAudience] = useState('customers')
  const [aiWordCount, setAiWordCount] = useState(500)
  const [aiLanguage, setAiLanguage] = useState('vi')
  const [aiInstructions, setAiInstructions] = useState('')
  const [topicSuggestions, setTopicSuggestions] = useState([])
  const [loadingTopics, setLoadingTopics] = useState(false)

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) {
      toast.error('Please select a file to upload')
      return
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      setError('Only JPG and PNG files are accepted')
      return
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      setError('File size must not exceed 5MB')
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
      setError(err?.message || 'An error occurred while uploading the image')
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
      setError('Only JPG and PNG files are accepted')
      return
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      setError('File size must not exceed 5MB')
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
      setError(err.message || 'An error occurred while uploading the image')
      // eslint-disable-next-line no-console
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
      if (thumbInputRef.current) thumbInputRef.current.value = ''
    }
  }

  const canSave = title.trim().length > 0 && content && !loading

  // AI Content Generation functions
  const generateAIContent = async () => {
    if (!aiTopic.trim()) {
      toast.error('Please enter a topic to generate content')
      return
    }

    setAiLoading(true)
    try {
      const requestData = {
        topic: aiTopic,
        category: categories.find(c => c.id === selectedCategoryId)?.name || '',
        style: aiStyle,
        targetAudience: aiTargetAudience,
        wordCount: aiWordCount,
        language: aiLanguage,
        additionalInstructions: aiInstructions
      }

      const response = await generateAIContentAPI(requestData)
      
      if (response.status === 'success') {
        if (response.title) setTitle(response.title)
        if (response.content) setContent(response.content)
        if (response.slug) setSlug(response.slug)
        toast.success('Content generated successfully!')
      } else {
        toast.error(response.message || 'An error occurred while generating content')
      }
    } catch (error) {
      toast.error('Error generating content: ' + error.message)
    } finally {
      setAiLoading(false)
    }
  }

  const fetchTopicSuggestions = async () => {
    setLoadingTopics(true)
    try {
      const categoryName = categories.find(c => c.id === selectedCategoryId)?.name || ''
      const resp = await suggestAITopicsAPI({ category: categoryName, style: aiStyle, audience: aiTargetAudience, count: 10, language: aiLanguage })
      if (resp?.status === 'success' && Array.isArray(resp.topics)) {
        setTopicSuggestions(resp.topics)
        if (resp.topics.length > 0) toast.success('Suggested topics generated')
        else toast.info('No suitable suggestions')
      } else {
        toast.error(resp?.message || 'Unable to suggest topics')
      }
    } catch (e) {
      toast.error('Topic suggestion error: ' + (e?.message || 'Unknown'))
    } finally {
      setLoadingTopics(false)
    }
  }

  const generateAITitle = async () => {
    if (!aiTopic.trim()) {
      toast.error('Please enter a topic to generate a title')
      return
    }

    setAiLoading(true)
    try {
      const requestData = {
        topic: aiTopic,
        category: categories.find(c => c.id === selectedCategoryId)?.name || '',
        style: aiStyle,
        targetAudience: aiTargetAudience
      }

      const response = await generateAITitleAPI(requestData)
      
      if (response.status === 'success' && response.title) {
        setTitle(response.title)
        if (response.slug) setSlug(response.slug)
        toast.success('Title generated successfully!')
      } else {
        toast.error(response.message || 'An error occurred while generating the title')
      }
    } catch (error) {
      toast.error('Error generating title: ' + error.message)
    } finally {
      setAiLoading(false)
    }
  }

  const generateAIContentOnly = async () => {
    if (!aiTopic.trim()) {
      toast.error('Please enter a topic to generate content')
      return
    }

    setAiLoading(true)
    try {
      const requestData = {
        topic: aiTopic,
        category: categories.find(c => c.id === selectedCategoryId)?.name || '',
        style: aiStyle,
        targetAudience: aiTargetAudience,
        wordCount: aiWordCount,
        language: aiLanguage,
        additionalInstructions: aiInstructions
      }

      const response = await generateAIContentOnlyAPI(requestData)
      
      if (response.status === 'success' && response.content) {
        setContent(response.content)
        toast.success('Content generated successfully!')
      } else {
        toast.error(response.message || 'An error occurred while generating content')
      }
    } catch (error) {
      toast.error('Error generating content: ' + error.message)
    } finally {
      setAiLoading(false)
    }
  }

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
        setPostPriority(p.priority || 'normal')
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
        setPostPriority(p.priority || 'normal')
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
    const getPostCategories = async () => {
      try {
        const cats = await getPostCategoriesAPI()
        setCategories(cats || [])
      } catch (err) {
        // ignore but reference err to avoid unused variable lint
        void err
      }
    }
    getPostCategories()
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
        priority: postPriority,
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
      navigate('/management/posts')
    } catch (err) {
      setError(err.message || 'Failed to save post')
    } finally {
      setLoading(false)
    }
  }

  const handleBackToPosts = async () => {
    const { confirmed } = await confirm({
      title: 'Confirm Post Navigation',
      description: 'Are you sure you want to go back to the post list? All your unsaved changes will be lost.',
      confirmationText: 'Yes, Go Back',
      cancellationText: 'No, Stay Here'
    })
    if (!confirmed) return

    await navigate('/management/posts')
  }

  const handleCancelPost = async () => {
    const { confirmed } = await confirm({
      title: 'Confirm Post Cancellation',
      description: 'Are you sure you want to cancel this post? All your unsaved changes will be lost.',
      confirmationText: 'Yes, Cancel Post',
      cancellationText: 'No, Stay Here'
    })
    if (!confirmed) return

    await navigate('/management/posts')
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ mb: 2 }}>
        <Button
          variant="text"
          onClick={handleBackToPosts}
          sx={{ minWidth: 'auto', px: 1 }}
        >
          ← Back to Post List
        </Button>
      </Box>
      <Paper sx={{ p: 3 }} elevation={2}>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography variant="h4" sx={{ flexGrow: 1 }}>{isEdit ? 'Edit Post' : 'Create Post'}</Typography>
              {isEdit && (
                <Chip label={postStatus} color={postStatus === 'PUBLISHED' ? 'success' : 'default'} size="small" />
              )}
              <Stack direction="row" spacing={2} sx={{ minWidth: 250 }}>
                <FormControl sx={{ minWidth: 200 }}>
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
                
                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel id="post-type-label">Type</InputLabel>
                  <Select
                    labelId="post-type-label"
                    label="Type"
                    value={postStatus}
                    onChange={(e) => setPostStatus(e.target.value)}
                  >
                    <MenuItem value="DRAFT">Draft</MenuItem>
                    <MenuItem value="PUBLISHED">Published</MenuItem>
                    <MenuItem value="ARCHIVED">Archived</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel id="post-priority-label">Priority</InputLabel>
                  <Select
                    labelId="post-priority-label"
                    label="Priority"
                    value={postPriority}
                    onChange={(e) => setPostPriority(e.target.value)}
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="normal">Normal</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="urgent">Urgent</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Box>

            {error && <Alert severity="error">{error}</Alert>}

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <TextField
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                required
              />
              <Button
                variant="outlined"
                onClick={generateAITitle}
                disabled={aiLoading || !aiTopic.trim()}
                sx={{ minWidth: 'auto', px: 2 }}
              >
                AI Title
              </Button>
            </Box>

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


            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Box sx={{ flex: 1 }}>
                <TextField
                  label="Thumbnail URL"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  fullWidth
                  placeholder="Enter image URL or upload image"
                />
                <input ref={thumbInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleThumbChange} />
                <Button
                  variant="outlined"
                  onClick={() => thumbInputRef.current.click()}
                  disabled={uploading}
                  sx={{ mt: 1 }}
                >
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </Button>
              </Box>

              {imageUrl && (
                <Box sx={{ position: 'relative' }}>
                  <Box
                    component="img"
                    src={imageUrl}
                    alt="Post thumbnail"
                    sx={{
                      width: 120,
                      height: 80,
                      objectFit: 'cover',
                      borderRadius: 1,
                      border: '2px solid #e0e0e0',
                      boxShadow: 1
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none'
                      toast.error('Invalid image URL')
                    }}
                  />
                  <Button
                    size="small"
                    onClick={() => setImageUrl('')}
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      minWidth: 0,
                      p: '2px 6px',
                      bgcolor: 'error.main',
                      color: 'white',
                      '&:hover': { bgcolor: 'error.dark' }
                    }}
                    title="Remove thumbnail"
                  >
                    ×
                  </Button>
                </Box>
              )}
            </Box>

            {/* Publish controls replaced by action buttons below */}

            {/* AI Content Generation Panel */}
            <Paper sx={{ p: 2, bgcolor: '#f8f9fa' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                AI Content Generation
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Topic"
                    value={aiTopic}
                    onChange={(e) => setAiTopic(e.target.value)}
                    fullWidth
                    placeholder="Enter a topic for the post..."
                    helperText="E.g., Benefits of green vegetables; Healthy cooking tips..."
                  />
                  {topicSuggestions?.length > 0 && (
                    <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {topicSuggestions.map((t) => (
                        <Chip key={t} label={t} onClick={() => setAiTopic(t)} clickable variant="outlined" />
                      ))}
                    </Box>
                  )}
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Style</InputLabel>
                    <Select
                      value={aiStyle}
                      onChange={(e) => setAiStyle(e.target.value)}
                      label="Style"
                    >
                      <MenuItem value="friendly">Friendly</MenuItem>
                      <MenuItem value="formal">Formal</MenuItem>
                      <MenuItem value="casual">Casual</MenuItem>
                      <MenuItem value="professional">Professional</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Audience</InputLabel>
                    <Select
                      value={aiTargetAudience}
                      onChange={(e) => setAiTargetAudience(e.target.value)}
                      label="Audience"
                    >
                      <MenuItem value="customers">Customers</MenuItem>
                      <MenuItem value="general">General</MenuItem>
                      <MenuItem value="employees">Employees</MenuItem>
                      <MenuItem value="business">Partners</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Word Count"
                    type="number"
                    value={aiWordCount}
                    onChange={(e) => setAiWordCount(Number(e.target.value))}
                    fullWidth
                    inputProps={{ min: 100, max: 2000 }}
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Language</InputLabel>
                    <Select
                      value={aiLanguage}
                      onChange={(e) => setAiLanguage(e.target.value)}
                      label="Language"
                    >
                      <MenuItem value="vi">Vietnamese</MenuItem>
                      <MenuItem value="en">English</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      onClick={fetchTopicSuggestions}
                      disabled={loadingTopics}
                      sx={{ flex: 1 }}
                    >
                      {loadingTopics ? 'Suggesting...' : 'Suggest topics'}
                    </Button>
                    <Button
                      variant="contained"
                      onClick={generateAIContent}
                      disabled={aiLoading || !aiTopic.trim()}
                      sx={{ flex: 1 }}
                    >
                      {aiLoading ? 'Generating...' : 'Generate all'}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={generateAIContentOnly}
                      disabled={aiLoading || !aiTopic.trim()}
                      sx={{ flex: 1 }}
                    >
                      Content only
                    </Button>
                  </Stack>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    label="Additional instructions"
                    value={aiInstructions}
                    onChange={(e) => setAiInstructions(e.target.value)}
                    fullWidth
                    multiline
                    rows={8}
                    placeholder="Add specific instructions for AI..."
                    helperText="E.g., Focus on health benefits, include recipes, friendly tone, add real facts..."
                    sx={{
                      '& .MuiInputBase-root': {
                        alignItems: 'flex-start'
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>

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
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => { navigator.clipboard?.writeText(u); toast.success('Copied!') }}
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          minWidth: 0,
                          p: '2px 6px',
                          bgcolor: 'rgba(0,0,0,0.6)',
                          color: '#fff',
                          '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' }
                        }}
                      >
                        Copy
                      </Button>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={handleCancelPost}>Cancel</Button>
              <Button variant="outlined" disabled={!canSave} onClick={() => submitPost('DRAFT')}>Save as Draft</Button>
              <Button variant="contained" disabled={!canSave} onClick={() => submitPost('PUBLISHED')}>
                {loading ? 'Publishing...' : 'Publish'}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>

    </Container>
  )
}


