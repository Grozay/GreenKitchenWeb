import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Autocomplete from '@mui/material/Autocomplete'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import FormHelperText from '@mui/material/FormHelperText'
import CircularProgress from '@mui/material/CircularProgress'
import Chip from '@mui/material/Chip'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import dayjs from 'dayjs'
import { useState, useEffect, useCallback } from 'react'

// Mock store locations in Ho Chi Minh City
const MOCK_STORES = [
  {
    id: 1,
    name: 'Green Kitchen District 1',
    address: '123 Nguyen Hue, District 1, Ho Chi Minh City',
    lat: 10.7769,
    lng: 106.7009
  },
  {
    id: 2,
    name: 'Green Kitchen District 3',
    address: '456 Vo Van Tan, District 3, Ho Chi Minh City',
    lat: 10.7886,
    lng: 106.6917
  },
  {
    id: 3,
    name: 'Green Kitchen District 7',
    address: '789 Nguyen Thi Thap, District 7, Ho Chi Minh City',
    lat: 10.7378,
    lng: 106.7208
  },
  {
    id: 4,
    name: 'Green Kitchen Binh Thanh',
    address: '321 Xo Viet Nghe Tinh, Binh Thanh District, Ho Chi Minh City',
    lat: 10.8014,
    lng: 106.7147
  },
  {
    id: 5,
    name: 'Green Kitchen Tan Binh',
    address: '555 Cong Hoa, Tan Binh District, Ho Chi Minh City',
    lat: 10.8014,
    lng: 106.6547
  },
  {
    id: 6,
    name: 'Green Kitchen Thu Duc',
    address: '777 Vo Van Ngan, Thu Duc District, Ho Chi Minh City',
    lat: 10.8496,
    lng: 106.7538
  },
  {
    id: 7,
    name: 'Green Kitchen Go Vap',
    address: '888 Quang Trung, Go Vap District, Ho Chi Minh City',
    lat: 10.8386,
    lng: 106.6657
  },
  {
    id: 8,
    name: 'Green Kitchen Phu Nhuan',
    address: '999 Nguyen Van Troi, Phu Nhuan District, Ho Chi Minh City',
    lat: 10.7992,
    lng: 106.6809
  },
  {
    id: 9,
    name: 'Green Kitchen District 10',
    address: '111 Su Van Hanh, District 10, Ho Chi Minh City',
    lat: 10.7731,
    lng: 106.6679
  }
]

// Haversine formula to calculate distance between two coordinates
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371 // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  const distance = R * c
  return Math.round(distance * 100) / 100 // Round to 2 decimal places
}

// Geocoding function using HERE Maps API
const geocodeAddress = async (street, ward, district, city) => {
  try {
    // Build full address - only include non-empty parts
    let fullAddress = street
    if (ward) fullAddress += ` ${ward}`
    if (district) fullAddress += ` ${district}`
    if (city) fullAddress += ` ${city}`
    else fullAddress += ' TP. Hồ Chí Minh' // Default city if not provided

    // Get HERE Maps API key from environment
    const apiKey = import.meta.env.VITE_HERE_MAPS_API_KEY
    if (!apiKey) {
      // eslint-disable-next-line no-console
      console.warn('HERE Maps API key not found')
      return { lat: 10.7769, lng: 106.7009 }
    }

    // Use HERE Maps Geocoding API
    const response = await fetch(
      `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(fullAddress)}&apiKey=${apiKey}&limit=1&lang=vi&at=10.8231,106.6297`
    )

    if (!response.ok) {
      throw new Error(`HERE Maps API error: ${response.status}`)
    }

    const data = await response.json()

    if (data && data.items && data.items.length > 0) {
      const item = data.items[0]
      return {
        lat: item.position.lat,
        lng: item.position.lng
      }
    } else {
      // Fallback to default coordinates
      return { lat: 10.7769, lng: 106.7009 }
    }
  } catch {
    // Fallback to default coordinates
    return { lat: 10.7769, lng: 106.7009 }
  }
}

const DeliveryInfoForm = ({
  deliveryInfo,
  setDeliveryInfo,
  errors,
  customerDetails,
  onStoreSelect
}) => {
  const [showCustomForm, setShowCustomForm] = useState(false)

  // State cho quận/huyện và phường/xã
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])
  const [addressSuggestions, setAddressSuggestions] = useState([])
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [storesWithDistance, setStoresWithDistance] = useState([])
  const [selectedStore, setSelectedStore] = useState(null)
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false)
  const [showStoreSelector, setShowStoreSelector] = useState(false)
  const [isLoadingDefaultAddress, setIsLoadingDefaultAddress] = useState(false)

  // Calculate distances to all stores when address changes
  const calculateStoreDistances = useCallback(async () => {
    if (!deliveryInfo.street || !deliveryInfo.ward || !deliveryInfo.district || !deliveryInfo.city) {
      setStoresWithDistance([])
      setSelectedStore(null)
      return
    }

    setIsCalculatingDistance(true)
    try {
      // Get coordinates for customer address
      const customerCoords = await geocodeAddress(
        deliveryInfo.street,
        deliveryInfo.ward,
        deliveryInfo.district,
        deliveryInfo.city
      )

      // Calculate distances to all stores
      const storesWithDistanceData = MOCK_STORES.map(store => ({
        ...store,
        distance: calculateDistance(
          customerCoords.lat,
          customerCoords.lng,
          store.lat,
          store.lng
        )
      }))

      // Sort stores by distance (nearest first)
      storesWithDistanceData.sort((a, b) => a.distance - b.distance)

      setStoresWithDistance(storesWithDistanceData)

      // Auto-select nearest store if none selected
      if (!selectedStore && storesWithDistanceData.length > 0) {
        setSelectedStore(storesWithDistanceData[0])
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error calculating store distances:', error)
      setStoresWithDistance([])
      setSelectedStore(null)
    } finally {
      setIsCalculatingDistance(false)
    }
  }, [deliveryInfo.street, deliveryInfo.ward, deliveryInfo.district, deliveryInfo.city, selectedStore])
  const [selectedDistrict, setSelectedDistrict] = useState(null)
  const [selectedWard, setSelectedWard] = useState(null)
  const [loadingDistricts, setLoadingDistricts] = useState(false)
  const [loadingWards, setLoadingWards] = useState(false)

  // Fetch quận/huyện của TP.HCM (code: 79)
  const fetchDistricts = async () => {
    setLoadingDistricts(true)
    try {
      const response = await fetch('https://provinces.open-api.vn/api/p/79?depth=2')
      const data = await response.json()
      setDistricts(data.districts || [])
    } catch {
      setDistricts([])
    } finally {
      setLoadingDistricts(false)
    }
  }

  // Fetch phường/xã dựa trên quận/huyện
  const fetchWards = async (districtCode) => {
    setLoadingWards(true)
    try {
      const response = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
      const data = await response.json()
      setWards(data.wards || [])
    } catch {
      setWards([])
    } finally {
      setLoadingWards(false)
    }
  }

  useEffect(() => {
    fetchDistricts()
    // Set default city to TP. Hồ Chí Minh if not set
    if (!deliveryInfo.city) {
      setDeliveryInfo(prev => ({
        ...prev,
        city: 'TP. Hồ Chí Minh'
      }))
    }
  }, [deliveryInfo.city, setDeliveryInfo])

  // Auto-calculate store distances when default address is loaded
  useEffect(() => {
    const defaultAddress = customerDetails?.addresses?.find(addr => addr.isDefault === true)

    // If we have default address and it's not showing custom form, auto-geocode and calculate
    if (defaultAddress &&
        !showCustomForm &&
        storesWithDistance.length === 0 &&
        !isCalculatingDistance &&
        !isLoadingDefaultAddress) {

      // Set loading state
      setIsLoadingDefaultAddress(true)

      // Geocode the default address and calculate distances
      geocodeAddress(
        defaultAddress.street,
        defaultAddress.ward,
        defaultAddress.district,
        defaultAddress.city || 'TP. Hồ Chí Minh'
      ).then(customerCoords => {
        // Calculate distances to all stores
        const storesWithDistanceData = MOCK_STORES.map(store => ({
          ...store,
          distance: calculateDistance(
            customerCoords.lat,
            customerCoords.lng,
            store.lat,
            store.lng
          )
        }))

        // Sort stores by distance (nearest first)
        storesWithDistanceData.sort((a, b) => a.distance - b.distance)

        setStoresWithDistance(storesWithDistanceData)

        // Auto-select nearest store
        if (storesWithDistanceData.length > 0) {
          setSelectedStore(storesWithDistanceData[0])
        }
      }).catch(error => {
        // eslint-disable-next-line no-console
        console.error('Error geocoding default address:', error)
        setStoresWithDistance([])
        setSelectedStore(null)
      }).finally(() => {
        setIsLoadingDefaultAddress(false)
      })
    }
  }, [customerDetails, showCustomForm, storesWithDistance.length, isCalculatingDistance, isLoadingDefaultAddress])

  // Auto-calculate distances when user inputs change (for custom address)
  useEffect(() => {
    if (showCustomForm &&
        deliveryInfo.street &&
        deliveryInfo.ward &&
        deliveryInfo.district &&
        deliveryInfo.city &&
        !isCalculatingDistance &&
        !isLoadingDefaultAddress) {

      // Debounce the calculation
      const timeoutId = setTimeout(() => {
        calculateStoreDistances()
      }, 1000) // Wait 1 second after user stops typing

      return () => clearTimeout(timeoutId)
    }
  }, [deliveryInfo.street, deliveryInfo.ward, deliveryInfo.district, deliveryInfo.city, showCustomForm, calculateStoreDistances, isCalculatingDistance, isLoadingDefaultAddress])

  // Auto-recalculate when address changes and we have complete address
  useEffect(() => {
    if (showCustomForm &&
        deliveryInfo.street &&
        deliveryInfo.ward &&
        deliveryInfo.district &&
        deliveryInfo.city &&
        storesWithDistance.length === 0 &&
        !isCalculatingDistance &&
        !isLoadingDefaultAddress) {

      // Trigger distance calculation when address is complete but no stores calculated yet
      const timeoutId = setTimeout(() => {
        calculateStoreDistances()
      }, 500) // Shorter delay for address changes

      return () => clearTimeout(timeoutId)
    }
  }, [deliveryInfo.street, deliveryInfo.ward, deliveryInfo.district, deliveryInfo.city, showCustomForm, storesWithDistance.length, calculateStoreDistances, isCalculatingDistance, isLoadingDefaultAddress])

  // Notify parent component when store is selected
  useEffect(() => {
    if (onStoreSelect && selectedStore) {
      onStoreSelect(selectedStore)
    }
  }, [selectedStore, onStoreSelect])

  // Fetch address suggestions when user types - Using HERE Maps API
  const fetchAddressSuggestions = useCallback(async (streetInput) => {
    if (!streetInput || !deliveryInfo.ward || !deliveryInfo.district || !deliveryInfo.city || streetInput.length < 3) {
      setAddressSuggestions([])
      return
    }

    setIsLoadingSuggestions(true)
    try {
      // Get HERE Maps API key from environment
      const apiKey = import.meta.env.VITE_HERE_MAPS_API_KEY
      if (!apiKey) {
        // eslint-disable-next-line no-console
        console.warn('HERE Maps API key not found')
        setAddressSuggestions([])
        return
      }

      // Build search query with context - include ward and district for better results
      const searchQuery = streetInput
        ? `${streetInput}, ${deliveryInfo.ward}, ${deliveryInfo.district}, ${deliveryInfo.city}`
        : `${deliveryInfo.ward}, ${deliveryInfo.district}, ${deliveryInfo.city}`

      // Use HERE Maps Autosuggest API with Ho Chi Minh City coordinates for Vietnam focus
      const response = await fetch(
        `https://autosuggest.search.hereapi.com/v1/autosuggest?q=${encodeURIComponent(searchQuery)}&apiKey=${apiKey}&limit=5&lang=vi&at=10.8231,106.6297`
      )

      if (response.ok) {
        const data = await response.json()

        if (data && data.items && data.items.length > 0) {
          // Filter suggestions to only show addresses in the selected district
          const filteredSuggestions = data.items.filter(item => {
            const itemDistrict = item.address?.district || item.address?.county || ''
            const itemWard = item.address?.subdistrict || item.address?.city || ''

            // If we have selected district, only show suggestions from that district
            if (deliveryInfo.district) {
              // Check if the suggestion's district matches our selected district
              const districtMatch = itemDistrict.toLowerCase().includes(deliveryInfo.district.toLowerCase()) ||
                                   deliveryInfo.district.toLowerCase().includes(itemDistrict.toLowerCase())

              if (!districtMatch) {
                return false
              }
            }

            // If we have selected ward, prefer suggestions from that ward
            if (deliveryInfo.ward && itemWard) {
              const wardMatch = itemWard.toLowerCase().includes(deliveryInfo.ward.toLowerCase()) ||
                               deliveryInfo.ward.toLowerCase().includes(itemWard.toLowerCase())
              return wardMatch
            }

            return true
          })

          // Convert filtered HERE Maps results to our format
          const suggestions = filteredSuggestions.map((item, index) => ({
            id: index,
            street: item.title || streetInput,
            address: item.address?.label || item.title || '',
            lat: item.position?.lat || 0,
            lng: item.position?.lng || 0,
            district: item.address?.district || item.address?.county || '',
            ward: item.address?.subdistrict || item.address?.city || ''
          }))

          setAddressSuggestions(suggestions)
        } else {
          setAddressSuggestions([])
        }
      } else {
        setAddressSuggestions([])
      }
    } catch {
      setAddressSuggestions([])
    } finally {
      setIsLoadingSuggestions(false)
    }
  }, [deliveryInfo.ward, deliveryInfo.district, deliveryInfo.city])

  // Debounced address search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchAddressSuggestions(deliveryInfo.street)
    }, 500) // Wait 500ms after user stops typing

    return () => clearTimeout(timeoutId)
  }, [deliveryInfo.street, fetchAddressSuggestions])

  // Calculate store distances with exact coordinates (for address suggestions)
  const calculateStoreDistancesWithCoords = useCallback(async (lat, lng) => {
    setIsCalculatingDistance(true)
    try {
      // Calculate distances to all stores
      const storesWithDistanceData = MOCK_STORES.map(store => ({
        ...store,
        distance: calculateDistance(lat, lng, store.lat, store.lng)
      }))

      // Sort stores by distance (nearest first)
      storesWithDistanceData.sort((a, b) => a.distance - b.distance)

      setStoresWithDistance(storesWithDistanceData)

      // Auto-select nearest store if none selected
      if (!selectedStore && storesWithDistanceData.length > 0) {
        setSelectedStore(storesWithDistanceData[0])
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error calculating store distances:', error)
      setStoresWithDistance([])
      setSelectedStore(null)
    } finally {
      setIsCalculatingDistance(false)
    }
  }, [selectedStore])

  // Đồng bộ selectedWard khi wards data thay đổi
  useEffect(() => {
    if (wards.length > 0 && deliveryInfo.ward) {
      const selectedWardOption = wards.find(w => w.name === deliveryInfo.ward)
      if (selectedWardOption && !selectedWard) {
        setSelectedWard(selectedWardOption)
      }
    }
  }, [wards, deliveryInfo.ward, selectedWard])

  const handleChange = (field) => (event) => {
    setDeliveryInfo(prev => ({
      ...prev,
      [field]: event.target.value
    }))

    // Clear store selection when address changes
    if (field === 'district' || field === 'ward' || field === 'street') {
      setSelectedStore(null)
      setStoresWithDistance([])
    }
  }

  const handleDateChange = (newDate) => {
    if (newDate && deliveryInfo.deliveryTime) {
      // Keep the time, update the date
      const currentTime = dayjs(deliveryInfo.deliveryTime)
      const newDateTime = newDate
        .hour(currentTime.hour())
        .minute(currentTime.minute())

      setDeliveryInfo(prev => ({
        ...prev,
        deliveryTime: newDateTime
      }))
    } else if (newDate) {
      // Set default time to current time + 30 minutes if no time set
      const defaultTime = dayjs().add(30, 'minute')
      const newDateTime = newDate
        .hour(defaultTime.hour())
        .minute(defaultTime.minute())

      setDeliveryInfo(prev => ({
        ...prev,
        deliveryTime: newDateTime
      }))
    }
  }

  const handleTimeChange = (newTime) => {
    if (newTime && deliveryInfo.deliveryTime) {
      // Keep the date, update the time
      const currentDate = dayjs(deliveryInfo.deliveryTime)
      const newDateTime = currentDate
        .hour(newTime.hour())
        .minute(newTime.minute())

      setDeliveryInfo(prev => ({
        ...prev,
        deliveryTime: newDateTime
      }))
    } else if (newTime) {
      // Set default date to today if no date set
      const defaultDate = dayjs()
      const newDateTime = defaultDate
        .hour(newTime.hour())
        .minute(newTime.minute())

      setDeliveryInfo(prev => ({
        ...prev,
        deliveryTime: newDateTime
      }))
    }
  }

  // Check if customer has default address and deliveryInfo is filled
  const defaultAddress = customerDetails?.addresses?.find(addr => addr.isDefault === true)
  const hasDefaultAddressData = defaultAddress &&
    deliveryInfo.recipientName &&
    deliveryInfo.street &&
    deliveryInfo.ward &&
    deliveryInfo.district &&
    deliveryInfo.city

  const handleDifferentAddress = () => {
    setShowCustomForm(true)
    // Clear address fields but keep name and phone, set default city
    setDeliveryInfo(prev => ({
      ...prev,
      street: '',
      ward: '',
      district: '',
      city: 'TP. Hồ Chí Minh'
    }))

    // Clear store selection when switching to custom address
    setSelectedStore(null)
    setStoresWithDistance([])
    setSelectedDistrict(null)
    setSelectedWard(null)
    setAddressSuggestions([])
  }

  const handleUseDefaultAddress = () => {
    setShowCustomForm(false)
    // Clear current store selection before loading new address
    setSelectedStore(null)
    setStoresWithDistance([])
    setAddressSuggestions([])

    // Restore default address
    if (defaultAddress) {
      setDeliveryInfo(prev => ({
        ...prev,
        recipientName: defaultAddress.recipientName || customerDetails.fullName || '',
        recipientPhone: defaultAddress.recipientPhone || customerDetails.phone || '',
        street: defaultAddress.street || '',
        ward: defaultAddress.ward || '',
        district: defaultAddress.district || '',
        city: defaultAddress.city || 'TP. Hồ Chí Minh'
      }))

      // Set selected values for autocomplete
      const selectedDist = districts.find(d => d.name === defaultAddress.district)
      setSelectedDistrict(selectedDist || null)

      if (selectedDist) {
        fetchWards(selectedDist.code).then(() => {
          setTimeout(() => {
            const selectedWardOption = wards.find(w => w.name === defaultAddress.ward)
            setSelectedWard(selectedWardOption || null)
          }, 100)
        })
      }

      // Trigger distance calculation for default address
      setIsLoadingDefaultAddress(true)
      geocodeAddress(
        defaultAddress.street,
        defaultAddress.ward,
        defaultAddress.district,
        defaultAddress.city || 'TP. Hồ Chí Minh'
      ).then(customerCoords => {
        // Calculate distances to all stores
        const storesWithDistanceData = MOCK_STORES.map(store => ({
          ...store,
          distance: calculateDistance(
            customerCoords.lat,
            customerCoords.lng,
            store.lat,
            store.lng
          )
        }))

        // Sort stores by distance (nearest first)
        storesWithDistanceData.sort((a, b) => a.distance - b.distance)

        setStoresWithDistance(storesWithDistanceData)

        // Auto-select nearest store
        if (storesWithDistanceData.length > 0) {
          setSelectedStore(storesWithDistanceData[0])
        }
      }).catch(error => {
        // eslint-disable-next-line no-console
        console.error('Error geocoding default address:', error)
        setStoresWithDistance([])
        setSelectedStore(null)
      }).finally(() => {
        setIsLoadingDefaultAddress(false)
      })
    }
  }

  return (
    <Box sx={{
      bgcolor: 'white',
      borderRadius: 5,
      border: '1px solid #e0e0e0',
      overflow: 'hidden',
      mb: 3
    }}>
      {/* Header */}
      <Box sx={{
        bgcolor: '#f8f9fa',
        px: 3,
        py: 2,
        borderBottom: '1px solid #e0e0e0'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c2c2c' }}>
          THÔNG TIN GIAO HÀNG
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3 }}>
        {/* Display default address info or form */}
        {hasDefaultAddressData && !showCustomForm ? (
          <>
            {/* Default Address Display */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 2, color: '#2c2c2c' }}>
                Thông tin giao hàng
              </Typography>

              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#2c2c2c', mb: 1 }}>
                    {deliveryInfo.recipientName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                    {deliveryInfo.recipientPhone}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    {deliveryInfo.street}, {deliveryInfo.ward}, {deliveryInfo.district}, {deliveryInfo.city}
                  </Typography>
                  <Typography variant="caption" sx={{
                    color: '#4C082A',
                    fontWeight: 500,
                    display: 'block',
                    mt: 1
                  }}>
                    ✓ Địa chỉ mặc định
                  </Typography>
                </CardContent>
              </Card>

              <Button
                variant="outlined"
                onClick={handleDifferentAddress}
                sx={{
                  color: '#4C082A',
                  borderColor: '#4C082A',
                  '&:hover': {
                    bgcolor: 'rgba(76, 8, 42, 0.1)',
                    borderColor: '#4C082A'
                  }
                }}
              >
                Different Address
              </Button>
            </Box>
          </>
        ) : (
          <>
            {/* Custom Address Form */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 2, color: '#2c2c2c' }}>
                Thông tin người nhận
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  label="Họ và tên người nhận"
                  value={deliveryInfo.recipientName || ''}
                  onChange={handleChange('recipientName')}
                  error={!!errors.recipientName}
                  helperText={errors.recipientName}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  value={deliveryInfo.recipientPhone || ''}
                  onChange={handleChange('recipientPhone')}
                  error={!!errors.recipientPhone}
                  helperText={errors.recipientPhone}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
              </Box>

              {defaultAddress && (
                <Button
                  variant="text"
                  onClick={handleUseDefaultAddress}
                  sx={{
                    color: '#4C082A',
                    p: 0,
                    fontSize: '0.875rem',
                    textTransform: 'none',
                    mb: 2,
                    '&:hover': {
                      bgcolor: 'transparent',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  ← Use Default Address
                </Button>
              )}
            </Box>

            {/* Địa chỉ giao hàng */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 2, color: '#2c2c2c' }}>
                Địa chỉ giao hàng
              </Typography>

              {/* 1. Thành phố */}
              <FormControl
                fullWidth
                error={!!errors.city}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              >
                <InputLabel>Tỉnh/Thành phố</InputLabel>
                <Select
                  value={deliveryInfo.city || 'TP. Hồ Chí Minh'}
                  onChange={handleChange('city')}
                  label="Tỉnh/Thành phố"
                >
                  <MenuItem value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</MenuItem>
                </Select>
                {errors.city && <FormHelperText>{errors.city}</FormHelperText>}
              </FormControl>

              {/* 2. Quận/Huyện */}
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Autocomplete
                  fullWidth
                  options={districts}
                  getOptionLabel={(option) => option.name}
                  value={selectedDistrict}
                  loading={loadingDistricts}
                  onChange={(event, newValue) => {
                    setSelectedDistrict(newValue)
                    setDeliveryInfo(prev => ({
                      ...prev,
                      district: newValue ? newValue.name : ''
                    }))
                    if (newValue) {
                      fetchWards(newValue.code)
                      setSelectedWard(null)
                      setDeliveryInfo(prev => ({
                        ...prev,
                        ward: ''
                      }))
                    } else {
                      setWards([])
                      setSelectedWard(null)
                      setDeliveryInfo(prev => ({
                        ...prev,
                        ward: ''
                      }))
                    }
                    // Clear store selection when district changes
                    setSelectedStore(null)
                    setStoresWithDistance([])
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Quận/Huyện"
                      error={!!errors.district}
                      helperText={errors.district}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2
                        }
                      }}
                    />
                  )}
                />

                {/* 3. Phường/Xã */}
                <Autocomplete
                  fullWidth
                  options={wards}
                  getOptionLabel={(option) => option.name}
                  value={selectedWard}
                  loading={loadingWards}
                  disabled={!selectedDistrict}
                  onChange={(event, newValue) => {
                    setSelectedWard(newValue)
                    setDeliveryInfo(prev => ({
                      ...prev,
                      ward: newValue ? newValue.name : ''
                    }))
                    // Clear store selection when ward changes
                    setSelectedStore(null)
                    setStoresWithDistance([])
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Phường/Xã"
                      error={!!errors.ward}
                      helperText={errors.ward || (!selectedDistrict ? 'Vui lòng chọn quận/huyện trước' : '')}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2
                        }
                      }}
                    />
                  )}
                />
              </Box>

              {/* 4. Địa chỉ cụ thể */}
              <Autocomplete
                fullWidth
                freeSolo
                options={addressSuggestions}
                getOptionLabel={(option) => typeof option === 'string' ? option : option.street}
                value={deliveryInfo.street || ''}
                loading={isLoadingSuggestions}
                disabled={!deliveryInfo.ward}
                onInputChange={(event, newInputValue) => {
                  setDeliveryInfo(prev => ({
                    ...prev,
                    street: newInputValue
                  }))
                  // Clear store selection when street changes
                  if (newInputValue !== deliveryInfo.street) {
                    setSelectedStore(null)
                    setStoresWithDistance([])
                  }
                }}
                onChange={(event, newValue) => {
                  if (newValue && typeof newValue === 'object') {
                    setDeliveryInfo(prev => ({
                      ...prev,
                      street: newValue.street
                    }))
                    setAddressSuggestions([])
                    // Calculate distance and show nearest store when address is selected
                    calculateStoreDistancesWithCoords(newValue.lat, newValue.lng)
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Địa chỉ cụ thể (Số nhà, tên đường)"
                    error={!!errors.street}
                    helperText={errors.street || 'Nhập ít nhất 3 ký tự để tìm gợi ý địa chỉ'}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2
                      }
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        📍 {option.street}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                        {option.address}
                      </Typography>
                    </Box>
                  </li>
                )}
                filterOptions={(x) => x} // Disable built-in filtering
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
            </Box>
          </>
        )}

        {/* Thời gian giao hàng */}
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 2, color: '#2c2c2c' }}>
            Thời gian giao hàng mong muốn
          </Typography>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <DatePicker
                label="Chọn ngày"
                value={deliveryInfo.deliveryTime}
                onChange={handleDateChange}
                minDate={dayjs()}
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
                slotProps={{
                  textField: {
                    error: !!errors.deliveryTime,
                    helperText: errors.deliveryTime
                  }
                }}
              />
              <TimePicker
                label="Chọn giờ"
                value={deliveryInfo.deliveryTime}
                onChange={handleTimeChange}
                minTime={dayjs().isSame(deliveryInfo.deliveryTime, 'day') ? dayjs().add(30, 'minute') : undefined}
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
                slotProps={{
                  textField: {
                    error: !!errors.deliveryTime && !deliveryInfo.deliveryTime,
                    helperText: !!errors.deliveryTime && !deliveryInfo.deliveryTime ? errors.deliveryTime : ''
                  }
                }}
              />
            </Box>
          </LocalizationProvider>
        </Box>

        {/* Store Selection */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{
            color: '#4C082A',
            fontWeight: 600,
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            🏪 Chọn cửa hàng
            {(isCalculatingDistance || isLoadingDefaultAddress) && (
              <>
                <CircularProgress size={16} />
                <Typography variant="caption" color="text.secondary">
                  {isLoadingDefaultAddress ? 'Đang tải địa chỉ mặc định...' : 'Đang tính khoảng cách...'}
                </Typography>
              </>
            )}
          </Typography>

          {selectedStore ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Selected Store Display */}
              <Card
                sx={{
                  border: 2,
                  borderColor: '#4C082A',
                  backgroundColor: '#f8f9fa'
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label="Đã chọn"
                        color="primary"
                        size="small"
                        sx={{ fontSize: '0.7rem' }}
                      />
                      <Typography variant="subtitle1" sx={{
                        fontWeight: 700,
                        color: '#4C082A'
                      }}>
                        {selectedStore.name}
                      </Typography>
                    </Box>
                    <Chip
                      label={`${selectedStore.distance} km`}
                      color="primary"
                      size="small"
                      sx={{
                        backgroundColor: '#4C082A',
                        color: 'white',
                        fontWeight: 600
                      }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    📍 {selectedStore.address}
                  </Typography>
                </CardContent>
              </Card>

              {/* Button to show other stores */}
              <Button
                variant="outlined"
                onClick={() => setShowStoreSelector(!showStoreSelector)}
                sx={{
                  height: 40,
                  width: 'fit-content',
                  color: '#4C082A',
                  borderColor: '#4C082A',
                  '&:hover': {
                    bgcolor: 'rgba(76, 8, 42, 0.1)',
                    borderColor: '#4C082A'
                  }
                }}
              >
                {showStoreSelector ? 'Ẩn cửa hàng khác' : 'Chọn cửa hàng khác'}
              </Button>

              {/* Store selector when button is clicked */}
              {showStoreSelector && storesWithDistance.length > 1 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 2, color: '#2c2c2c' }}>
                    Chọn cửa hàng khác:
                  </Typography>
                  <Autocomplete
                    fullWidth
                    options={storesWithDistance.filter(store => store.id !== selectedStore.id)}
                    getOptionLabel={(option) => `${option.name} (${option.distance} km)`}
                    onChange={(event, newValue) => {
                      if (newValue) {
                        setSelectedStore(newValue)
                        setShowStoreSelector(false)
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Chọn cửa hàng"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            🏪 {option.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            📍 {option.address} • {option.distance} km
                          </Typography>
                        </Box>
                      </li>
                    )}
                  />
                </Box>
              )}
            </Box>
          ) : storesWithDistance.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {storesWithDistance.length} cửa hàng được tìm thấy
                </Typography>
                <Button
                  size="small"
                  onClick={calculateStoreDistances}
                  disabled={isCalculatingDistance}
                  sx={{ color: '#4C082A' }}
                >
                  🔄 Tính lại
                </Button>
              </Box>

              {storesWithDistance.map((store, index) => (
                <Card
                  key={store.id}
                  sx={{
                    border: 2,
                    borderColor: selectedStore?.id === store.id ? '#4C082A' : '#ddd',
                    backgroundColor: selectedStore?.id === store.id ? '#f8f9fa' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: '#4C082A',
                      backgroundColor: '#f8f9fa'
                    }
                  }}
                  onClick={() => setSelectedStore(store)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {index === 0 && (
                          <Chip
                            label="Gần nhất"
                            color="success"
                            size="small"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        )}
                        <Typography variant="subtitle1" sx={{
                          fontWeight: selectedStore?.id === store.id ? 700 : 600,
                          color: selectedStore?.id === store.id ? '#4C082A' : 'inherit'
                        }}>
                          {store.name}
                        </Typography>
                      </Box>
                      <Chip
                        label={`${store.distance} km`}
                        color={selectedStore?.id === store.id ? 'primary' : 'default'}
                        size="small"
                        sx={{
                          backgroundColor: selectedStore?.id === store.id ? '#4C082A' : '#e0e0e0',
                          color: selectedStore?.id === store.id ? 'white' : '#666',
                          fontWeight: 600
                        }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      📍 {store.address}
                    </Typography>
                    {selectedStore?.id === store.id && (
                      <Typography variant="caption" sx={{
                        color: '#4C082A',
                        fontWeight: 600,
                        display: 'block',
                        mt: 1
                      }}>
                        ✓ Đã chọn cửa hàng này
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            <Box sx={{
              p: 2,
              border: 1,
              borderColor: '#ddd',
              borderRadius: 2,
              backgroundColor: '#f5f5f5',
              textAlign: 'center'
            }}>
              <Typography color="text.secondary">
                {isLoadingDefaultAddress
                  ? 'Đang tải và tính toán khoảng cách từ địa chỉ mặc định...'
                  : !deliveryInfo.street || !deliveryInfo.ward || !deliveryInfo.district
                    ? 'Vui lòng nhập đầy đủ địa chỉ để hiển thị các cửa hàng'
                    : 'Đang tính toán khoảng cách đến các cửa hàng...'
                }
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default DeliveryInfoForm
