import { useState, useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'
import SearchIcon from '@mui/icons-material/Search'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PhoneIcon from '@mui/icons-material/Phone'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import DirectionsIcon from '@mui/icons-material/Directions'
import StorefrontIcon from '@mui/icons-material/Storefront'
import StarIcon from '@mui/icons-material/Star'
import MyLocationIcon from '@mui/icons-material/MyLocation'
import { toast } from 'react-toastify'

export default function StoreLocationTab({ customerDetails, setCustomerDetails }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStore, setSelectedStore] = useState(null)
  const [storeDetailOpen, setStoreDetailOpen] = useState(false)
  const [filteredStores, setFilteredStores] = useState([])
  const [userLocation, setUserLocation] = useState(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])

  // Mock data - trong thực tế sẽ lấy từ API
  const stores = [
    {
      id: 1,
      name: 'Green Kitchen Quận 1',
      address: '123 Đường Nguyễn Huệ, Quận 1, TP.HCM',
      phone: '028-1234-5678',
      rating: 4.8,
      reviewCount: 156,
      distance: '0.5 km',
      openHours: '7:00 - 22:00',
      status: 'OPEN',
      features: ['Giao hàng', 'Mang đi', 'Dine-in', 'Parking'],
      coordinates: { lat: 10.7769, lng: 106.7009 }
    },
    {
      id: 2,
      name: 'Green Kitchen Quận 3',
      address: '456 Đường Võ Văn Tần, Quận 3, TP.HCM',
      phone: '028-1234-5679',
      rating: 4.6,
      reviewCount: 89,
      distance: '1.2 km',
      openHours: '7:00 - 22:00',
      status: 'OPEN',
      features: ['Giao hàng', 'Mang đi', 'Dine-in'],
      coordinates: { lat: 10.7829, lng: 106.7009 }
    },
    {
      id: 3,
      name: 'Green Kitchen Quận 7',
      address: '789 Đường Nguyễn Thị Thập, Quận 7, TP.HCM',
      phone: '028-1234-5680',
      rating: 4.7,
      reviewCount: 203,
      distance: '3.8 km',
      openHours: '7:00 - 22:00',
      status: 'OPEN',
      features: ['Giao hàng', 'Mang đi', 'Dine-in', 'Parking', 'Drive-thru'],
      coordinates: { lat: 10.7329, lng: 106.7009 }
    },
    {
      id: 4,
      name: 'Green Kitchen Thủ Đức',
      address: '321 Đường Võ Văn Ngân, TP. Thủ Đức, TP.HCM',
      phone: '028-1234-5681',
      rating: 4.5,
      reviewCount: 67,
      distance: '8.5 km',
      openHours: '7:00 - 22:00',
      status: 'OPEN',
      features: ['Giao hàng', 'Mang đi', 'Dine-in'],
      coordinates: { lat: 10.8329, lng: 106.7009 }
    }
  ]

  useEffect(() => {
    // Filter stores based on search query
    if (searchQuery.trim() === '') {
      setFilteredStores(stores)
    } else {
      const filtered = stores.filter(store =>
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.features.some(feature => 
          feature.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
      setFilteredStores(filtered)
    }
  }, [searchQuery])

  // Load Leaflet (OpenStreetMap) - Miễn phí và không cần API key
  useEffect(() => {
    const loadLeaflet = () => {
      if (window.L) {
        setMapLoaded(true)
        return
      }

      // Load Leaflet CSS
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css'
      document.head.appendChild(link)

      // Load Leaflet JS
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js'
      script.onload = () => setMapLoaded(true)
      script.onerror = () => toast.error('Không thể tải bản đồ')
      document.head.appendChild(script)
    }

    loadLeaflet()
  }, [])

  // Initialize map when Leaflet is loaded
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !window.L) return

    const initMap = () => {
      const map = window.L.map(mapRef.current).setView([10.7769, 106.7009], 12)

      // Add OpenStreetMap tiles
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map)

      mapInstanceRef.current = map

      // Add markers for all stores
      addStoreMarkers(map, stores)
    }

    initMap()
  }, [mapLoaded])

  // Update map when filtered stores change
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) return

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove())
    markersRef.current = []

    // Add new markers for filtered stores
    addStoreMarkers(mapInstanceRef.current, filteredStores)
  }, [filteredStores])

  const addStoreMarkers = (map, stores) => {
    stores.forEach(store => {
      const marker = window.L.marker([store.coordinates.lat, store.coordinates.lng])
        .addTo(map)
        .bindPopup(`
          <div style="padding: 10px; max-width: 200px;">
            <h3 style="margin: 0 0 8px 0; color: #4CAF50;">${store.name}</h3>
            <p style="margin: 0 0 5px 0; font-size: 12px;">${store.address}</p>
            <p style="margin: 0 0 5px 0; font-size: 12px;">⭐ ${store.rating} (${store.reviewCount})</p>
            <p style="margin: 0; font-size: 12px;">🕒 ${store.openHours}</p>
          </div>
        `)

      marker.on('click', () => {
        setSelectedStore(store)
        setStoreDetailOpen(true)
      })

      markersRef.current.push(marker)
    })
  }

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation({ lat: latitude, lng: longitude })
          
          if (mapInstanceRef.current && window.L) {
            mapInstanceRef.current.setView([latitude, longitude], 15)
            
            // Add user location marker
            const userMarker = window.L.marker([latitude, longitude])
              .addTo(mapInstanceRef.current)
              .bindPopup('Vị trí của bạn')
            
            // Use custom icon for user location
            userMarker.setIcon(window.L.divIcon({
              className: 'user-location-marker',
              html: '<div style="background: #2196F3; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>',
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            }))
          }
          
          toast.success('Đã xác định vị trí của bạn!')
        },
        (error) => {
          toast.error('Không thể xác định vị trí của bạn')
        }
      )
    } else {
      toast.error('Trình duyệt không hỗ trợ định vị')
    }
  }

  const handleStoreClick = (store) => {
    setSelectedStore(store)
    setStoreDetailOpen(true)
  }

  const handleDirections = (store) => {
    const { lat, lng } = store.coordinates
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`
    window.open(directionsUrl, '_blank')
    toast.success(`Mở Google Maps để chỉ đường đến ${store.name}`)
  }

  const handleCall = (phone) => {
    window.open(`tel:${phone}`)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN': return 'success'
      case 'CLOSED': return 'error'
      case 'BUSY': return 'warning'
      default: return 'default'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'OPEN': return 'Đang mở'
      case 'CLOSED': return 'Đã đóng'
      case 'BUSY': return 'Bận rộn'
      default: return 'Không xác định'
    }
  }

  return (
    <Box sx={{
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <Grid container spacing={3}>
        {/* Header Section */}
        <Grid size={12}>
          <Card sx={{
            background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(76, 175, 80, 0.3)',
            textAlign: 'center',
            color: 'white'
          }}>
            <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
              <StorefrontIcon sx={{ fontSize: '80px', mb: 2, opacity: 0.9 }} />
              <Typography variant="h4" sx={{
                fontWeight: 'bold',
                mb: 2,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                Tìm Kiếm Cửa Hàng
              </Typography>
              <Typography variant="h6" sx={{
                opacity: 0.9,
                mb: 3
              }}>
                Khám phá các cửa hàng Green Kitchen gần bạn nhất
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Search Section */}
        <Grid size={12}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
                🔍 Tìm kiếm cửa hàng
              </Typography>
              <TextField
                fullWidth
                placeholder="Nhập tên cửa hàng, địa chỉ hoặc tính năng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 3, fontSize: '1.1rem' }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main'
                    }
                  }
                }}
              />
              <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                {['Giao hàng', 'Mang đi', 'Dine-in', 'Parking', 'Drive-thru'].map((feature) => (
                  <Chip
                    key={feature}
                    label={feature}
                    variant={searchQuery === feature ? 'filled' : 'outlined'}
                    color={searchQuery === feature ? 'primary' : 'default'}
                    onClick={() => setSearchQuery(feature)}
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Store List */}
        <Grid size={12}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
                🏪 Danh sách cửa hàng ({filteredStores.length})
              </Typography>
              
              {filteredStores.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Không tìm thấy cửa hàng nào
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Hãy thử tìm kiếm với từ khóa khác
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {filteredStores.map((store) => (
                    <Grid size={{ xs: 12, sm: 6, md: 6 }} key={store.id}>
                      <Card
                        sx={{
                          height: '100%',
                          borderRadius: 3,
                          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 8px 24px rgba(76, 175, 80, 0.2)'
                          }
                        }}
                        onClick={() => handleStoreClick(store)}
                      >
                        <CardContent sx={{ p: 3 }}>
                          {/* Store Header */}
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Box>
                              <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
                                {store.name}
                              </Typography>
                              <Chip
                                label={getStatusLabel(store.status)}
                                color={getStatusColor(store.status)}
                                size="small"
                                sx={{ mb: 1 }}
                              />
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {store.distance}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <StarIcon sx={{ fontSize: 16, color: '#FFD700' }} />
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {store.rating}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  ({store.reviewCount})
                                </Typography>
                              </Box>
                            </Box>
                          </Box>

                          {/* Store Info */}
                          <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="body2" sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              }}>
                                {store.address}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="body2">{store.phone}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="body2">{store.openHours}</Typography>
                            </Box>
                          </Box>

                          {/* Features */}
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                              Tính năng:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {store.features.slice(0, 3).map((feature, index) => (
                                <Chip
                                  key={index}
                                  label={feature}
                                  size="small"
                                  variant="outlined"
                                  color="primary"
                                />
                              ))}
                              {store.features.length > 3 && (
                                <Chip
                                  label={`+${store.features.length - 3}`}
                                  size="small"
                                  variant="outlined"
                                />
                              )}
                            </Box>
                          </Box>

                          {/* Action Buttons */}
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<DirectionsIcon />}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDirections(store)
                              }}
                              sx={{ flex: 1 }}
                            >
                              Chỉ đường
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<PhoneIcon />}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleCall(store.phone)
                              }}
                              sx={{ flex: 1 }}
                            >
                              Gọi điện
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>

                 {/* Interactive Map */}
         <Grid size={12}>
           <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
             <CardContent sx={{ p: 4 }}>
               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                 <Typography variant="h6" sx={{ fontWeight: 600 }}>
                   🗺️ Bản đồ cửa hàng
                 </Typography>
                 <Button
                   variant="outlined"
                   startIcon={<MyLocationIcon />}
                   onClick={getUserLocation}
                   disabled={!mapLoaded}
                   sx={{ borderRadius: 2 }}
                 >
                   Vị trí của tôi
                 </Button>
               </Box>
               
               {!mapLoaded ? (
                 <Box sx={{
                   height: 400,
                   backgroundColor: '#f5f5f5',
                   borderRadius: 2,
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center',
                   border: '2px dashed #ccc'
                 }}>
                   <Box sx={{ textAlign: 'center' }}>
                     <CircularProgress size={40} sx={{ mb: 2 }} />
                     <Typography variant="h6" color="text.secondary" gutterBottom>
                       Đang tải bản đồ...
                     </Typography>
                   </Box>
                 </Box>
               ) : (
                 <Box
                   ref={mapRef}
                   sx={{
                     height: 500,
                     borderRadius: 2,
                     border: '1px solid',
                     borderColor: 'divider',
                     overflow: 'hidden'
                   }}
                 />
               )}
               
                                <Box sx={{ mt: 2, textAlign: 'center' }}>
                   <Typography variant="body2" color="text.secondary">
                     💡 Click vào marker trên bản đồ để xem thông tin chi tiết cửa hàng
                   </Typography>
                 </Box>
                 
                 {/* Custom CSS for user location marker */}
                 <style>
                   {`
                     .user-location-marker {
                       background: transparent !important;
                       border: none !important;
                     }
                   `}
                 </style>
             </CardContent>
           </Card>
         </Grid>
      </Grid>

      {/* Store Detail Dialog */}
      <Dialog
        open={storeDetailOpen}
        onClose={() => setStoreDetailOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        {selectedStore && (
          <>
            <DialogTitle sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              pb: 1
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <StorefrontIcon sx={{ color: 'primary.main' }} />
                <Typography variant="h6">
                  {selectedStore.name}
                </Typography>
              </Box>
              <Chip
                label={getStatusLabel(selectedStore.status)}
                color={getStatusColor(selectedStore.status)}
              />
            </DialogTitle>

            <DialogContent sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                <Grid size={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <StarIcon sx={{ color: '#FFD700' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {selectedStore.rating}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ({selectedStore.reviewCount} đánh giá)
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    📍 Địa chỉ
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {selectedStore.address}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    📞 Điện thoại
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {selectedStore.phone}
                  </Typography>
                </Grid>

                <Grid size={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    🕒 Giờ mở cửa
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {selectedStore.openHours}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    📏 Khoảng cách
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {selectedStore.distance}
                  </Typography>
                </Grid>

                <Grid size={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    ✨ Tính năng
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedStore.features.map((feature, index) => (
                      <Chip
                        key={index}
                        label={feature}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Grid>

                <Grid size={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    📍 Tọa độ
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Vĩ độ: {selectedStore.coordinates.lat}, Kinh độ: {selectedStore.coordinates.lng}
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
              <Button
                variant="outlined"
                startIcon={<DirectionsIcon />}
                onClick={() => handleDirections(selectedStore)}
              >
                Chỉ đường
              </Button>
              <Button
                variant="outlined"
                startIcon={<PhoneIcon />}
                onClick={() => handleCall(selectedStore.phone)}
              >
                Gọi điện
              </Button>
              <Button
                variant="contained"
                onClick={() => setStoreDetailOpen(false)}
              >
                Đóng
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  )
}
