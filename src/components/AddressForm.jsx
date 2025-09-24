import React, { useEffect, useState } from 'react'
import { Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography, Alert } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import { toast } from 'react-toastify'

const AddressForm = ({ onAddressReady, restaurantName = '', autoSave = false }) => {
  // State cho danh sách
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])
  
  // State cho lựa chọn
  const [selectedProvince, setSelectedProvince] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [selectedWard, setSelectedWard] = useState('')
  const [street, setStreet] = useState('')
  
  // State cho kết quả
  const [fullAddress, setFullAddress] = useState('')
  const [geocodedAddress, setGeocodedAddress] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [loading, setLoading] = useState(false)
  
  const hereApiKey = import.meta.env.VITE_HERE_MAPS_API_KEY

  // Fetch provinces khi component mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch('https://provinces.open-api.vn/api/p/')
        const data = await response.json()
        setProvinces(data || [])
      } catch (error) {
        toast.error('Error loading provinces/cities list')
      }
    }
    fetchProvinces()
  }, [])

  // Fetch districts khi province thay đổi
  useEffect(() => {
    if (selectedProvince) {
      console.log('Fetching districts for province:', selectedProvince)
      const fetchDistricts = async () => {
        try {
          // Sửa URL: thêm province code vào path thay vì query param
          const response = await fetch(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
          const data = await response.json()
          console.log('Province data:', data)
          
          // Lấy districts từ data.districts
          const districtsData = data?.districts || []
          console.log('Districts loaded:', districtsData.length)
          setDistricts(districtsData)
          
          // Reset district và ward khi đổi province
          setSelectedDistrict('')
          setSelectedWard('')
          setWards([])
        } catch (error) {
          console.error('Error fetching districts:', error)
          toast.error('Error loading districts list')
        }
      }
      fetchDistricts()
    } else {
      console.log('No province selected, clearing districts and wards')
      setDistricts([])
      setWards([])
      setSelectedDistrict('')
      setSelectedWard('')
    }
  }, [selectedProvince])

  // Fetch wards khi district thay đổi
  useEffect(() => {
    if (selectedDistrict) {
      console.log('Fetching wards for district:', selectedDistrict)
      const fetchWards = async () => {
        try {
          // Sửa URL: sử dụng district code trong path
          const response = await fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`)
          const data = await response.json()
          console.log('District data:', data)
          
          // Lấy wards từ data.wards
          const wardsData = data?.wards || []
          console.log('Wards loaded:', wardsData.length)
          setWards(wardsData)
          
          // Reset ward khi đổi district
          setSelectedWard('')
        } catch (error) {
          console.error('Error fetching wards:', error)
          toast.error('Error loading wards list')
        }
      }
      fetchWards()
    } else {
      console.log('No district selected, clearing wards')
      setWards([])
      setSelectedWard('')
    }
  }, [selectedDistrict])

  // Cập nhật full address khi có thay đổi
  useEffect(() => {
    const address = getFullAddress()
    setFullAddress(address)
  }, [street, selectedWard, selectedDistrict, selectedProvince])

  // Hàm tạo địa chỉ đầy đủ
  const getFullAddress = () => {
    if (!street.trim() || !selectedWard || !selectedDistrict || !selectedProvince) {
      return ''
    }

    const wardName = wards.find(w => w.code === selectedWard)?.name || ''
    const districtName = districts.find(d => d.code === selectedDistrict)?.name || ''
    const provinceName = provinces.find(p => p.code === selectedProvince)?.name || ''

    return `${street.trim()}, ${wardName}, ${districtName}, ${provinceName}, Việt Nam`
  }

  // Hàm gọi HERE Geocode API để lấy tọa độ
  const handleCheckAddress = async () => {
    if (!fullAddress.trim()) {
      toast.error('Please enter complete address information')
      return
    }

    if (!hereApiKey) {
      toast.error('Missing HERE Maps API Key')
      return
    }

    setLoading(true)
    try {
      const encodedAddress = encodeURIComponent(fullAddress)
      const url = `https://geocode.search.hereapi.com/v1/geocode?q=${encodedAddress}&apiKey=${hereApiKey}`
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (!data.items || data.items.length === 0) {
        toast.error('No suitable address found')
        return
      }

      const item = data.items[0]
      const title = item.title || ''
      const lat = item.position?.lat || ''
      const lng = item.position?.lng || ''

      setGeocodedAddress(title)
      setLatitude(lat)
      setLongitude(lng)

      toast.success('Address has been standardized successfully')

      // Chỉ gọi callback nếu autoSave = true
      if (autoSave && onAddressReady) {
        onAddressReady({
          name: restaurantName || 'Restaurant Name',
          address: title,
          latitude: lat,
          longitude: lng
        })
      }

    } catch (error) {
      toast.error('Error calling HERE Geocode API')
    } finally {
      setLoading(false)
    }
  }

  // Hàm lưu vào database (chỉ gọi khi user bấm nút Save)
  const handleSaveToDatabase = () => {
    if (!geocodedAddress || !latitude || !longitude) {
      toast.error('Please check address before saving')
      return
    }

    // Validate và convert latitude/longitude sang number
    const lat = parseFloat(latitude)
    const lng = parseFloat(longitude)
    
    if (isNaN(lat) || isNaN(lng)) {
      toast.error('Invalid coordinates')
      return
    }

    if (lat < -90 || lat > 90) {
      toast.error('Latitude must be between -90 and 90')
      return
    }

    if (lng < -180 || lng > 180) {
      toast.error('Longitude must be between -180 and 180')
      return
    }

    if (onAddressReady) {
      // Validate tên nhà hàng
      if (!restaurantName.trim()) {
        toast.error('Please enter restaurant name before saving')
        return
      }

      const payload = {
        name: restaurantName.trim() || 'Restaurant Name',
        address: geocodedAddress,
        latitude: lat,
        longitude: lng,
        isActive: true
      }
      console.log('Sending data to BE:', payload)
      onAddressReady(payload)
      toast.success('Saved to database')
    }
  }

  // Reset form
  const handleReset = () => {
    setSelectedProvince('')
    setSelectedDistrict('')
    setSelectedWard('')
    setStreet('')
    setFullAddress('')
    setGeocodedAddress('')
    setLatitude('')
    setLongitude('')
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight={700} mb={3}>
        Vietnam Address Entry Form
      </Typography>

      <Stack spacing={3}>
        {/* Chọn Tỉnh/Thành phố (Autocomplete để gõ tìm nhanh) */}
        <Autocomplete
          fullWidth
          options={provinces}
          getOptionLabel={(opt) => opt?.name || ''}
          isOptionEqualToValue={(opt, val) => opt?.code === val?.code}
          value={provinces.find(p => p.code === selectedProvince) || null}
          onChange={(_, newValue) => {
            const code = newValue?.code || ''
            console.log('Province changed to:', code)
            setSelectedProvince(code)
          }}
          renderInput={(params) => (
            <TextField {...params} label="Province/City" placeholder="Type to search quickly..." />
          )}
        />

        {/* Chọn Quận/Huyện (Autocomplete để gõ tìm nhanh) */}
        <Autocomplete
          fullWidth
          disabled={!selectedProvince}
          options={districts}
          getOptionLabel={(opt) => opt?.name || ''}
          isOptionEqualToValue={(opt, val) => opt?.code === val?.code}
          value={districts.find(d => d.code === selectedDistrict) || null}
          onChange={(_, newValue) => {
            const code = newValue?.code || ''
            console.log('District changed to:', code)
            setSelectedDistrict(code)
          }}
          renderInput={(params) => (
            <TextField {...params} label="District" placeholder="Type to search quickly..." />
          )}
        />

        {/* Chọn Phường/Xã (Autocomplete để gõ tìm nhanh) */}
        <Autocomplete
          fullWidth
          disabled={!selectedDistrict}
          options={wards}
          getOptionLabel={(opt) => opt?.name || ''}
          isOptionEqualToValue={(opt, val) => opt?.code === val?.code}
          value={wards.find(w => w.code === selectedWard) || null}
          onChange={(_, newValue) => {
            const code = newValue?.code || ''
            console.log('Ward changed to:', code)
            setSelectedWard(code)
          }}
          renderInput={(params) => (
            <TextField {...params} label="Ward" placeholder="Type to search quickly..." />
          )}
        />

        {/* Nhập số nhà + tên đường */}
        <TextField
          label="House Number + Street Name"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          fullWidth
          placeholder="e.g. 123 Nguyen Trai"
        />

      
        {/* Preview full address */}
        {fullAddress && (
          <Alert severity="success">
            <Typography variant="body2">
              <strong>Full Address:</strong> {fullAddress}
            </Typography>
          </Alert>
        )}

        {/* Buttons */}
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            onClick={handleCheckAddress}
            disabled={loading || !fullAddress.trim()}
            sx={{ minWidth: 150 }}
          >
            {loading ? 'Checking...' : 'Get Coordinates'}
          </Button>
          {geocodedAddress && latitude && longitude && (
            <Button
              variant="contained"
              color="success"
              onClick={handleSaveToDatabase}
              disabled={loading}
              sx={{ minWidth: 150 }}
            >
              Save to DB
            </Button>
          )}
          <Button
            variant="outlined"
            onClick={handleReset}
            disabled={loading}
          >
            Reset
          </Button>
        </Stack>

        {/* HERE Geocode Results */}
        {geocodedAddress && (
          <Alert severity="success">
            <Typography variant="body2" fontWeight={700} mb={2}>
              ✅ Standardized results from HERE API:
            </Typography>
            <Typography variant="body2" mb={1}>
              <strong>📍 Standard Address:</strong> {geocodedAddress}
            </Typography>
            <Typography variant="body2" mb={1}>
              <strong>🌍 Coordinates:</strong> 
            </Typography>
            <Box sx={{ ml: 2, p: 1, bgcolor: 'rgba(0,0,0,0.05)', borderRadius: 1 }}>
              <Typography variant="body2" fontFamily="monospace">
                <strong>Latitude:</strong> {latitude}
              </Typography>
              <Typography variant="body2" fontFamily="monospace">
                <strong>Longitude:</strong> {longitude}
              </Typography>
            </Box>
          </Alert>
        )}

        {/* Display copy-able coordinates */}
        {latitude && longitude && (
          <Alert severity="info">
            <Typography variant="body2" fontWeight={700} mb={1}>
              📋 Coordinates to copy:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                value={`${latitude}, ${longitude}`}
                size="small"
                fullWidth
                InputProps={{
                  readOnly: true,
                  sx: { fontFamily: 'monospace', fontSize: '0.875rem' }
                }}
              />
              <Button
                size="small"
                variant="outlined"
                onClick={() => {
                  navigator.clipboard.writeText(`${latitude}, ${longitude}`)
                  toast.success('Coordinates copied!')
                }}
              >
                Copy
              </Button>
            </Box>
          </Alert>
        )}
      </Stack>
    </Paper>
  )
}

export default AddressForm
