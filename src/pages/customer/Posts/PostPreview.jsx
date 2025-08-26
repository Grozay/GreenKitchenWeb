import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import MDEditor from '@uiw/react-md-editor'

export default function PostPreview({ post }) {
  if (!post) return null

  return (
    <Paper sx={{ p: 1, width: 360 }} elevation={3}>
      <Box data-color-mode="light" sx={{ maxHeight: 450, overflow: 'hidden' }}>
        <MDEditor.Markdown source={post.content || ''} />
      </Box>
    </Paper>
  )
}
