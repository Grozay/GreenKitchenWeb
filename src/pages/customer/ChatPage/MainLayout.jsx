import Grid from '@mui/material/Grid'
import MenuPanel from './MenuPanel'
import ChatPanel from './ChatPanel' // Giả sử bạn có component ChatPanel

export default function Layout({ menuProducts }) {
  return (
    <Grid container sx={{ height: '100vh' }}>
      <Grid item xs={12} md={5} sx={{ height: '100%', borderRight: '1px solid #eee', bgcolor: '#f9fbe7' }}>
        <MenuPanel menuProducts={menuProducts} />
      </Grid>
      <Grid item xs={12} md={7} sx={{ height: '100%' }}>
        <ChatPanel />
      </Grid>
    </Grid>
  )
}