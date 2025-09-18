import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { getSettingsAPI, saveSettingsBulkAPI } from '~/apis'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import TextField from '@mui/material/TextField'
import Switch from '@mui/material/Switch'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import FormControlLabel from '@mui/material/FormControlLabel'
import SaveIcon from '@mui/icons-material/Save'
import SettingsIcon from '@mui/icons-material/Settings'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import DiscountIcon from '@mui/icons-material/Discount'
import CampaignIcon from '@mui/icons-material/Campaign'
import WebIcon from '@mui/icons-material/Web'
import ShareIcon from '@mui/icons-material/Share'
import SearchIcon from '@mui/icons-material/Search'
import BannerManager from './BannerManager'

const Settings = () => {
  const [settings, setSettings] = useState({})
  const [activeTab, setActiveTab] = useState(0)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: settings
  })

  // Load settings from API on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getSettingsAPI()
        setSettings(data)
        // Set form values directly
        Object.keys(data).forEach(key => {
          if (data[key] && typeof data[key] === 'object') {
            Object.keys(data[key]).forEach(subKey => {
              setValue(`${key}.${subKey}`, data[key][subKey])
            })
          } else {
            setValue(key, data[key])
          }
        })
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Lỗi khi tải cài đặt: ' + error.message,
          severity: 'error'
        })
      }
    }
    loadSettings()
  }, [setValue])

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      // Transform nested settings to flat structure for API
      const flatSettings = flattenSettings(data)

      // Group settings by type
      const settingsByType = {
        shipping: {},
        discounts: {},
        banners: {},
        promotions: {},
        pagefly: {},
        socialMedia: {},
        seo: {}
      }

      // Categorize settings
      Object.entries(flatSettings).forEach(([key, value]) => {
        if (key.startsWith('shipping.')) {
          settingsByType.shipping[key] = value
        } else if (key.startsWith('discounts.')) {
          settingsByType.discounts[key] = value
        } else if (key.startsWith('banners.')) {
          settingsByType.banners[key] = value
        } else if (key.startsWith('promotions.')) {
          settingsByType.promotions[key] = value
        } else if (key.startsWith('pagefly.')) {
          settingsByType.pagefly[key] = value
        } else if (key.startsWith('socialMedia.')) {
          settingsByType.socialMedia[key] = value
        } else if (key.startsWith('seo.')) {
          settingsByType.seo[key] = value
        }
      })

      // Save each type of settings to API
      const savePromises = Object.entries(settingsByType)
        .filter(([, settings]) => Object.keys(settings).length > 0)
        .map(([type, settings]) => saveSettingsBulkAPI(settings, type))

      await Promise.all(savePromises)

      // Update local state
      setSettings(data)
      setSnackbar({
        open: true,
        message: 'Cài đặt đã được lưu thành công!',
        severity: 'success'
      })
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Lỗi khi lưu cài đặt: ' + error.message,
        severity: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to flatten nested object
  const flattenSettings = (obj, prefix = '') => {
    let flattened = {}

    for (let key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        let newKey = prefix ? `${prefix}.${key}` : key

        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          Object.assign(flattened, flattenSettings(obj[key], newKey))
        } else {
          flattened[newKey] = obj[key]
        }
      }
    }

    return flattened
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  const TabPanel = ({ children, value, index }) => (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Header */}
      <Box sx={{
        bgcolor: 'white',
        borderBottom: 1,
        borderColor: 'divider',
        px: 3,
        py: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <SettingsIcon sx={{ fontSize: 28, color: '#4C082A' }} />
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#2c2c2c' }}>
            Cài đặt ứng dụng
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
            sx={{
              bgcolor: '#4C082A',
              '&:hover': { bgcolor: '#3a0620' },
              '&:disabled': { bgcolor: '#ccc' }
            }}
          >
            {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'white' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              minHeight: 64,
              textTransform: 'none',
              fontSize: '0.9rem',
              fontWeight: 500
            }
          }}
        >
          <Tab icon={<LocalShippingIcon />} label="Vận chuyển" />
          <Tab icon={<DiscountIcon />} label="Giảm giá" />
          <Tab icon={<CampaignIcon />} label="Banner" />
          <Tab icon={<WebIcon />} label="PageFly" />
          <Tab icon={<ShareIcon />} label="Mạng xã hội" />
          <Tab icon={<SearchIcon />} label="SEO" />
        </Tabs>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3 }}>

        {/* Shipping Settings */}
        <TabPanel value={activeTab} index={0}>
          <Card>
            <CardHeader
              title="Cài đặt vận chuyển"
              subheader="Quản lý phí ship và chính sách giao hàng"
            />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Phí ship cơ bản (VND)"
                    type="number"
                    {...register('shipping.baseFee')}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Miễn phí ship từ (VND)"
                    type="number"
                    {...register('shipping.freeShippingThreshold')}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Phí thêm mỗi km (VND)"
                    type="number"
                    {...register('shipping.additionalFeePerKm')}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Khoảng cách tối đa (km)"
                    type="number"
                    {...register('shipping.maxDistance')}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Discount Settings */}
        <TabPanel value={activeTab} index={1}>
          <Card>
            <CardHeader
              title="Cài đặt giảm giá"
              subheader="Quản lý các chương trình giảm giá"
            />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    label="Giảm giá toàn bộ (%)"
                    type="number"
                    {...register('discounts.globalDiscount')}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    label="Giảm giá đơn đầu (%)"
                    type="number"
                    {...register('discounts.firstOrderDiscount')}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    label="Giảm giá thành viên (%)"
                    type="number"
                    {...register('discounts.loyaltyDiscount')}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        {...register('discounts.enabled')}
                      />
                    }
                    label="Bật tính năng giảm giá"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <BannerManager
            banners={watch('banners')}
            onChange={(bannerKey, field, value) => {
              setValue(`banners.${bannerKey}.${field}`, value)
            }}
            title="Quản lý Banner"
          />
        </TabPanel>

        {/* PageFly Settings */}
        <TabPanel value={activeTab} index={3}>
          <Card>
            <CardHeader
              title="Cài đặt PageFly"
              subheader="Tích hợp với PageFly để quản lý trang"
            />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        {...register('pagefly.enabled')}
                      />
                    }
                    label="Bật tích hợp PageFly"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="API Key"
                    {...register('pagefly.apiKey')}
                    type="password"
                    disabled={!watch('pagefly.enabled')}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Store ID"
                    {...register('pagefly.storeId')}
                    disabled={!watch('pagefly.enabled')}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Theme ID"
                    {...register('pagefly.themeId')}
                    disabled={!watch('pagefly.enabled')}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Social Media Settings */}
        <TabPanel value={activeTab} index={4}>
          <Card>
            <CardHeader
              title="Mạng xã hội"
              subheader="Liên kết đến các trang mạng xã hội"
            />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Facebook"
                    {...register('socialMedia.facebook')}
                    placeholder="https://facebook.com/yourpage"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Instagram"
                    {...register('socialMedia.instagram')}
                    placeholder="https://instagram.com/youraccount"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Twitter"
                    {...register('socialMedia.twitter')}
                    placeholder="https://twitter.com/youraccount"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="YouTube"
                    {...register('socialMedia.youtube')}
                    placeholder="https://youtube.com/yourchannel"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="TikTok"
                    {...register('socialMedia.tiktok')}
                    placeholder="https://tiktok.com/@youraccount"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>

        {/* SEO Settings */}
        <TabPanel value={activeTab} index={5}>
          <Card>
            <CardHeader
              title="Cài đặt SEO"
              subheader="Tối ưu hóa công cụ tìm kiếm"
            />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Meta Title"
                    {...register('seo.metaTitle')}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Meta Description"
                    multiline
                    rows={3}
                    {...register('seo.metaDescription')}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Keywords"
                    {...register('seo.keywords')}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="OG Image URL"
                    {...register('seo.ogImage')}
                    placeholder="https://yourdomain.com/og-image.jpg"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Settings
