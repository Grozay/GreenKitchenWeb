import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'

const SkeletonLoadingAdminDetail = () => {
  return (
    <Box sx={{ p: 4, maxWidth: '900px', margin: '0 auto' }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Skeleton variant="circular" width={100} height={100} sx={{ mr: 3 }} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width={220} height={40} />
            <Skeleton variant="text" width={180} height={28} />
            <Skeleton variant="rounded" width={80} height={28} sx={{ mt: 1 }} />
          </Box>
        </Box>
        <Divider sx={{ mb: 4 }} />
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
              <Skeleton variant="text" width={120} height={32} sx={{ mb: 2 }} />
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} variant="text" width="80%" height={28} sx={{ mb: 1 }} />
              ))}
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
              <Skeleton variant="text" width={120} height={32} sx={{ mb: 2 }} />
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} variant="text" width="80%" height={28} sx={{ mb: 1 }} />
              ))}
            </Paper>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Skeleton variant="text" width={120} height={32} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="90%" height={28} />
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}

export default SkeletonLoadingAdminDetail
