import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { getSettingsAPI, saveSettingsBulkAPI } from '~/apis'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import SaveIcon from '@mui/icons-material/Save'
import { toast } from 'react-toastify'
import SettingsIcon from '@mui/icons-material/Settings'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'

const Settings = () => {
  const [settings, setSettings] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, setValue } = useForm({
    defaultValues: settings
  })

  // Load settings from API on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getSettingsAPI()
        setSettings(data)
        // Set form values directly - handle flat shipping settings
        Object.keys(data).forEach(key => {
          if (key.startsWith('shipping.')) {
            setValue(key, data[key])
          }
        })
      } catch (error) {
        toast.error('Error loading settings: ' + error.message)
      }
    }
    loadSettings()
  }, [setValue])


  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      // Transform nested settings to flat structure for API
      const flatSettings = flattenSettings(data)

      // Only handle shipping settings
      const shippingSettings = {}
      Object.entries(flatSettings).forEach(([key, value]) => {
        if (key.startsWith('shipping.')) {
          shippingSettings[key] = value
        }
      })

      // Save shipping settings to API - keep the shipping. prefix
      if (Object.keys(shippingSettings).length > 0) {
        await saveSettingsBulkAPI(shippingSettings, 'shipping')
      }

      // Update local state
      setSettings(data)
      toast.success('Settings saved successfully!')
    } catch (error) {
      toast.error('Error saving settings: ' + error.message)
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
            Application Settings
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
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3 }}>
        {/* Shipping Settings */}
        <Card>
          <CardHeader
            title="Shipping Settings"
            subheader="Manage shipping fees and delivery policies"
            avatar={<LocalShippingIcon />}
          />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Base Shipping Fee (VND)"
                  type="number"
                  {...register('shipping.baseFee')}
                  slotProps={{
                    inputLabel: { shrink: true }
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Free Shipping Threshold (VND)"
                  type="number"
                  {...register('shipping.freeShippingThreshold')}
                  slotProps={{
                    inputLabel: { shrink: true }
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Additional Fee Per KM (VND)"
                  type="number"
                  {...register('shipping.additionalFeePerKm')}
                  slotProps={{
                    inputLabel: { shrink: true }
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Maximum Distance (KM)"
                  type="number"
                  {...register('shipping.maxDistance')}
                  slotProps={{
                    inputLabel: { shrink: true }
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

      </Box>
    </Box>
  )
}

export default Settings
