import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'

const BannerManager = ({ banners, onChange, title }) => {
  const handleBannerChange = (bannerKey, field, value) => {
    onChange(bannerKey, field, value)
  }

  // Handle case when banners is undefined or null
  const bannerKeys = banners ? Object.keys(banners) : []

  return (
    <Card>
      <CardHeader title={title} />
      <Divider />
      <CardContent>
        <Grid container spacing={3}>
          {bannerKeys.length === 0 ? (
            <Grid size={{ xs: 12 }}>
              <Card variant="outlined">
                <CardContent>
                  <p>Không có banner nào được cấu hình</p>
                </CardContent>
              </Card>
            </Grid>
          ) : (
            bannerKeys.map((bannerKey) => {
              const banner = banners[bannerKey]
              return (
                <Grid size={{ xs: 12 }} key={bannerKey}>
                  <Card variant="outlined">
                    <CardHeader
                      title={bannerKey === 'homepageBanner' ? 'Banner Trang Chủ' : 'Banner Khuyến Mãi'}
                      action={
                        <FormControlLabel
                          control={
                            <Switch
                              checked={banner?.enabled || false}
                              onChange={(e) => handleBannerChange(bannerKey, 'enabled', e.target.checked)}
                            />
                          }
                          label="Hiển thị"
                        />
                      }
                    />
                    <Divider />
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            fullWidth
                            label="Tiêu đề"
                            value={banner?.title || ''}
                            onChange={(e) => handleBannerChange(bannerKey, 'title', e.target.value)}
                            disabled={!banner?.enabled}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            fullWidth
                            label="Phụ đề"
                            value={banner?.subtitle || ''}
                            onChange={(e) => handleBannerChange(bannerKey, 'subtitle', e.target.value)}
                            disabled={!banner?.enabled}
                          />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <TextField
                            fullWidth
                            label="URL hình ảnh"
                            value={banner?.imageUrl || ''}
                            onChange={(e) => handleBannerChange(bannerKey, 'imageUrl', e.target.value)}
                            disabled={!banner?.enabled}
                            placeholder="https://example.com/banner-image.jpg"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            fullWidth
                            label="Text nút"
                            value={banner?.buttonText || ''}
                            onChange={(e) => handleBannerChange(bannerKey, 'buttonText', e.target.value)}
                            disabled={!banner?.enabled}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            fullWidth
                            label="Link nút"
                            value={banner?.buttonLink || ''}
                            onChange={(e) => handleBannerChange(bannerKey, 'buttonLink', e.target.value)}
                            disabled={!banner?.enabled}
                            placeholder="https://example.com/page"
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              )
            })
          )}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default BannerManager
