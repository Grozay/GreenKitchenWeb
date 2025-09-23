import { useState, useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
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
import { getStoresAPI } from '~/apis'
import AppBar from '~/components/AppBar/AppBar'
import Footer from '~/components/Footer/Footer'
import theme from '~/theme'

export default function StoreLocation() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStore, setSelectedStore] = useState(null)
  const [storeDetailOpen, setStoreDetailOpen] = useState(false)
  const [stores, setStores] = useState([])
  const [filteredStores, setFilteredStores] = useState([])
  const [userLocation, setUserLocation] = useState(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])

  // Fetch stores from API
  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getStoresAPI()
        
        // Transform API data to match component structure
        const transformedStores = data.map(store => ({
          id: store.id,
          name: store.name,
          address: store.address,
          phone: '028-1234-5678', // Default phone - có thể thêm vào DB sau
          rating: 4.5, // Default rating - có thể thêm vào DB sau
          reviewCount: 100, // Default review count - có thể thêm vào DB sau
          distance: 'N/A', // Will be calculated based on user location
          openHours: '7:00 - 22:00', // Default hours - có thể thêm vào DB sau
          status: store.isActive ? 'OPEN' : 'CLOSED',
          features: ['Delivery', 'Takeaway', 'Dine-in'], // Default features - có thể thêm vào DB sau
          coordinates: { lat: store.latitude, lng: store.longitude }
        }))
        
        setStores(transformedStores)
        setFilteredStores(transformedStores)
      } catch (err) {
        console.error('Error fetching stores:', err)
        setError('Unable to load store list')
        toast.error('Error loading store list')
      } finally {
        setLoading(false)
      }
    }

    fetchStores()
  }, [])

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
  }, [searchQuery, stores])

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
      script.onerror = () => toast.error('Unable to load map')
      document.head.appendChild(script)
    }

    loadLeaflet()
  }, [])

  // Initialize map when Leaflet is loaded and stores are available
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !window.L || stores.length === 0) return

    const initMap = () => {
      // Use first store as center, or default to HCMC
      const centerLat = stores.length > 0 ? stores[0].coordinates.lat : 10.7769
      const centerLng = stores.length > 0 ? stores[0].coordinates.lng : 106.7009
      
      const map = window.L.map(mapRef.current).setView([centerLat, centerLng], 12)

      // Add OpenStreetMap tiles
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map)

      mapInstanceRef.current = map

      // Add markers for all stores
      addStoreMarkers(map, stores)
    }

    initMap()
  }, [mapLoaded, stores])

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
              .bindPopup('Your location')
            
            // Use custom icon for user location
            userMarker.setIcon(window.L.divIcon({
              className: 'user-location-marker',
              html: '<div style="background: #2196F3; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>',
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            }))
          }
          
          toast.success('Your location has been determined!')
        },
        (error) => {
          toast.error('Unable to determine your location')
        }
      )
    } else {
      toast.error('Browser does not support geolocation')
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
    toast.success(`Opening Google Maps for directions to ${store.name}`)
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
      case 'OPEN': return 'Open'
      case 'CLOSED': return 'Closed'
      case 'BUSY': return 'Busy'
      default: return 'Unknown'
    }
  }

  return (
    <Box>
      <AppBar />
      <Box sx={{
        mt: { xs: '95px', md: '127px' }, // 95px AppBar + 32px TopAppBar on desktop
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        py: 3
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
                Find Stores
              </Typography>
              <Typography variant="h6" sx={{
                opacity: 0.9,
                mb: 3
              }}>
                Discover the nearest Green Kitchen stores
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Search Section */}
        <Grid size={12}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
                🔍 Search Stores
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter store name, address or features..."
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
                {['Delivery', 'Takeaway', 'Dine-in', 'Parking', 'Drive-thru'].map((feature) => (
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
                🏪 Store List ({filteredStores.length})
              </Typography>
              
              {loading ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CircularProgress size={40} sx={{ mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Loading store list...
                  </Typography>
                </Box>
              ) : error ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" color="error" gutterBottom>
                    {error}
                  </Typography>
                  <Button 
                    variant="outlined" 
                    onClick={() => window.location.reload()}
                    sx={{ mt: 2 }}
                  >
                    Try Again
                  </Button>
                </Box>
              ) : filteredStores.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No stores found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Try searching with different keywords
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
                              Features:
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
                              Directions
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
                              Call
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
        {!loading && !error && stores.length > 0 && (
          <Grid size={12}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    🗺️ Store Map
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<MyLocationIcon />}
                    onClick={getUserLocation}
                    disabled={!mapLoaded}
                    sx={{ borderRadius: 2 }}
                  >
                    My Location
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
                        Loading map...
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
                    💡 Click on markers on the map to view detailed store information
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
        )}
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
                      ({selectedStore.reviewCount} reviews)
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    📍 Address
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {selectedStore.address}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    📞 Phone
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {selectedStore.phone}
                  </Typography>
                </Grid>

                <Grid size={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    🕒 Opening Hours
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {selectedStore.openHours}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    📏 Distance
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {selectedStore.distance}
                  </Typography>
                </Grid>

                <Grid size={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    ✨ Features
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
                    📍 Coordinates
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Latitude: {selectedStore.coordinates.lat}, Longitude: {selectedStore.coordinates.lng}
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
                Directions
              </Button>
              <Button
                variant="outlined"
                startIcon={<PhoneIcon />}
                onClick={() => handleCall(selectedStore.phone)}
              >
                Call
              </Button>
              <Button
                variant="contained"
                onClick={() => setStoreDetailOpen(false)}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      </Box>
      <Footer />
    </Box>
  )
}
