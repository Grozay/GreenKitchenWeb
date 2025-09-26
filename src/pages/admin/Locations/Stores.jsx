import React, { useEffect, useState, useRef } from 'react'
import { 
  Box, 
  Paper, 
  Stack, 
  TextField, 
  Typography, 
  Button, 
  Tabs, 
  Tab, 
  Container,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Divider,
  FormControlLabel,
  Switch,
  InputAdornment,
  CircularProgress
} from '@mui/material'
import { createStoreAPI, getStoresAPI, updateStoreAPI, deleteStoreAPI } from '~/apis'
import { toast } from 'react-toastify'
import AddressForm from '~/components/AddressForm'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import StorefrontIcon from '@mui/icons-material/Storefront'
import MapIcon from '@mui/icons-material/Map'
import MyLocationIcon from '@mui/icons-material/MyLocation'

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`store-tabpanel-${index}`}
      aria-labelledby={`store-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

export default function Stores() {
  const [stores, setStores] = useState([])
  const [restaurantName, setRestaurantName] = useState('')
  const [autoAddGreenKitchen, setAutoAddGreenKitchen] = useState(true)
  const [activeTab, setActiveTab] = useState(0)
  const [loading, setLoading] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, store: null })
  const [editStore, setEditStore] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)
  
  // Map states
  const [mapLoaded, setMapLoaded] = useState(false)
  const [userLocation, setUserLocation] = useState(null)
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])

  useEffect(() => {
    loadStores()
  }, [])

  // Load Leaflet (OpenStreetMap) - Miễn phí và không cần API key
  useEffect(() => {
    const loadLeaflet = async () => {
      try {
        if (window.L) {
          setMapLoaded(true)
          return
        }

        // Load CSS first
        if (!document.querySelector('link[href*="leaflet"]')) {
          const link = document.createElement('link')
          link.rel = 'stylesheet'
          link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css'
          document.head.appendChild(link)
          
          // Wait for CSS to load
          await new Promise(resolve => setTimeout(resolve, 100))
        }

        // Load JS
        if (!document.querySelector('script[src*="leaflet"]')) {
          const script = document.createElement('script')
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js'
          
          script.onload = () => {
            // Wait a bit more for Leaflet to be fully ready
            setTimeout(() => {
              setMapLoaded(true)
            }, 200)
          }
          
          script.onerror = (error) => {
            toast.error('Không thể tải bản đồ')
          }
          
          document.head.appendChild(script)
        } else {
          // Script exists, wait for window.L
          let attempts = 0
          const checkLeaflet = () => {
            if (window.L) {
              setMapLoaded(true)
            } else if (attempts < 10) {
              attempts++
              setTimeout(checkLeaflet, 200)
            }
          }
          checkLeaflet()
        }
      } catch (error) {
        toast.error('Error loading map library')
      }
    }

    loadLeaflet()
  }, [])

  // Initialize map when Leaflet is loaded and stores are available
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !window.L || activeTab !== 2) {
      return
    }

    const initMap = () => {
      try {
        // Clear any existing map
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove()
          mapInstanceRef.current = null
        }
        
        // Ensure the map container has dimensions
        const mapContainer = mapRef.current
        if (mapContainer.offsetWidth === 0 || mapContainer.offsetHeight === 0) {
          setTimeout(initMap, 200)
          return
        }
        
        // Use first store as center, or default to HCMC
        const centerLat = stores.length > 0 ? stores[0].latitude : 10.7769
        const centerLng = stores.length > 0 ? stores[0].longitude : 106.7009
        
        const map = window.L.map(mapContainer, {
          center: [centerLat, centerLng],
          zoom: 12,
          zoomControl: true
        })

        // Add OpenStreetMap tiles
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(map)

        mapInstanceRef.current = map

        // Add markers for all stores
        if (stores.length > 0) {
          addStoreMarkers(map, stores)
        } else {
          // Add a default marker for HCMC when no stores
          const defaultMarker = window.L.marker([10.7769, 106.7009])
            .addTo(map)
            .bindPopup(`
              <div style="padding: 10px; max-width: 200px;">
                <h3 style="margin: 0 0 8px 0; color: #4CAF50;">Ho Chi Minh City</h3>
                <p style="margin: 0; font-size: 12px;">Default location</p>
              </div>
            `)
          markersRef.current.push(defaultMarker)
        }
        
        // Force a resize to ensure map renders properly
        setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize()
          }
        }, 100)
      } catch (error) {
        toast.error('Error loading map: ' + error.message)
      }
    }

    // Add a delay to ensure DOM is ready and visible
    setTimeout(initMap, 300)
  }, [mapLoaded, stores, activeTab])

  const addStoreMarkers = (map, stores) => {
    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove())
    markersRef.current = []

    stores.forEach(store => {
      const marker = window.L.marker([store.latitude, store.longitude])
        .addTo(map)
        .bindPopup(`
          <div style="padding: 10px; max-width: 200px;">
            <h3 style="margin: 0 0 8px 0; color: #4CAF50;">${store.name}</h3>
            <p style="margin: 0 0 5px 0; font-size: 12px;">${store.address}</p>
            <p style="margin: 0; font-size: 12px;">Status: ${store.isActive ? 'Active' : 'Inactive'}</p>
          </div>
        `)

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

  const loadStores = async () => {
    try {
      setLoading(true)
      const data = await getStoresAPI()
      setStores(Array.isArray(data) ? data : [])
    } catch (e) {
      toast.error('Error loading stores list')
    } finally {
      setLoading(false)
    }
  }

  const handleAddressReady = async (addressData) => {
    try {
      // Validation: Kiểm tra tên nhà hàng
      const baseName = restaurantName.trim()
      if (!baseName) {
        toast.error('Please enter restaurant name')
        return
      }
      
      // Tự động thêm "GreenKitchen" nếu option được bật
      const finalName = autoAddGreenKitchen && !baseName.toLowerCase().includes('greenkitchen')
        ? `GreenKitchen ${baseName}`
        : baseName

      const finalData = {
        ...addressData,
        name: finalName
      }

      if (isEditMode && editStore) {
        // Cập nhật chi nhánh hiện có
        const updated = await updateStoreAPI(editStore.id, finalData)
        setStores((prev) => prev.map(store => 
          store.id === editStore.id ? updated : store
        ))
        toast.success('Store updated successfully')
        setIsEditMode(false)
        setEditStore(null)
        setRestaurantName('')
      } else {
        // Tạo chi nhánh mới
        const created = await createStoreAPI(finalData)
        setStores((prev) => [created, ...prev])
        toast.success('Store saved successfully')
      }
      
      setActiveTab(1) // Chuyển sang tab danh sách
    } catch (e) {
      const errorMessage = e?.response?.data?.message || 
                          e?.response?.data || 
                          e?.message || 
                          'Error saving store'
      
      toast.error(`Error: ${errorMessage}`)
    }
  }

  const handleDeleteStore = async () => {
    if (!deleteDialog.store) return
    
    try {
      await deleteStoreAPI(deleteDialog.store.id)
      setStores(prev => prev.filter(s => s.id !== deleteDialog.store.id))
      toast.success('Store deleted successfully')
      setDeleteDialog({ open: false, store: null })
    } catch (e) {
      toast.error('Error deleting store')
    }
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
    // Reset edit mode khi chuyển tab
    if (newValue !== 0) {
      setIsEditMode(false)
      setEditStore(null)
      setRestaurantName('')
    }
  }

  const handleEditStore = (store) => {
    setEditStore(store)
    setIsEditMode(true)
    setRestaurantName(store.name)
    setActiveTab(0) // Chuyển sang tab thêm/sửa
  }

  const handleCancelEdit = () => {
    setIsEditMode(false)
    setEditStore(null)
    setRestaurantName('')
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="xl">
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
          Store Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Add and manage Green Kitchen stores
        </Typography>
      </Box>

      {/* Tabs */}
      <Paper sx={{ borderRadius: 2, boxShadow: 1 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="store management tabs">
            <Tab 
              icon={<AddIcon />} 
              label="Add Store" 
              iconPosition="start"
              sx={{ minHeight: 64 }}
            />
            <Tab 
              icon={<StorefrontIcon />} 
              label="Store List" 
              iconPosition="start"
              sx={{ minHeight: 64 }}
            />
            <Tab 
              icon={<MapIcon />} 
              label="Store Map" 
              iconPosition="start"
              sx={{ minHeight: 64 }}
            />
          </Tabs>
        </Box>

        {/* Tab 1: Add Store */}
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            <Grid size={12}>
              <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    {isEditMode ? <EditIcon color="primary" /> : <AddIcon color="primary" />}
                    {isEditMode ? 'Edit Store' : 'Store Information'}
                  </Typography>
                  
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid size={12}>
                      <TextField
                        label="Restaurant Name"
                        value={restaurantName}
                        onChange={(e) => setRestaurantName(e.target.value)}
                        fullWidth
                        placeholder="e.g. Nguyen Trai"
                        InputProps={{
                          startAdornment: autoAddGreenKitchen ? (
                            <InputAdornment position="start">
                              <Chip 
                                label="GreenKitchen" 
                                size="small" 
                                color="primary" 
                                variant="outlined"
                              />
                            </InputAdornment>
                          ) : null
                        }}
                        helperText={autoAddGreenKitchen 
                          ? 'Name will automatically add GreenKitchen at the beginning'
                          : 'Enter the full name of the store'
                        }
                      />
                    </Grid>
                    <Grid size={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={autoAddGreenKitchen}
                            onChange={(e) => setAutoAddGreenKitchen(e.target.checked)}
                            color="primary"
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              Auto add GreenKitchen
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Enable to automatically add GreenKitchen to the beginning of store name
                            </Typography>
                          </Box>
                        }
                        sx={{ alignItems: 'flex-start' }}
                      />
                    </Grid>
                  </Grid>

                  {isEditMode && (
                    <Box sx={{ mb: 3, p: 2, bgcolor: 'info.main', borderRadius: 2 }}>
                      <Typography variant="body2" sx={{ color: 'text.primary' }} fontWeight={500}>
                        📝 Editing: {editStore?.name}
                      </Typography>
                      <Typography variant="caption" color="info.dark">
                        Change address information and click Save to DB to update
                      </Typography>
                    </Box>
                  )}

                  <AddressForm 
                    onAddressReady={handleAddressReady}
                    restaurantName={restaurantName}
                    autoSave={false}
                  />

                  {isEditMode && (
                    <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                      <Button
                        variant="outlined"
                        onClick={handleCancelEdit}
                        sx={{ borderRadius: 2 }}
                      >
                        Cancel Edit
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab 2: Danh sách Chi nhánh */}
        <TabPanel value={activeTab} index={1}>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight={600}>
                Store List ({stores.length})
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setActiveTab(0)}
                sx={{ borderRadius: 2 }}
              >
                Add Store
              </Button>
            </Box>

            {loading ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography>Loading...</Typography>
              </Box>
            ) : stores.length === 0 ? (
              <Card sx={{ textAlign: 'center', py: 4 }}>
                <CardContent>
                  <StorefrontIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No stores yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Add your first store to get started
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setActiveTab(0)}
                  >
                    Add Store
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'background.paper' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Store Name</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Address</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Coordinates</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stores.map((store) => (
                      <TableRow key={store.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              <StorefrontIcon />
                            </Avatar>
                            <Box>
                              <Typography fontWeight={600}>{store.name}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                ID: {store.id}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" sx={{ maxWidth: 300 }}>
                              {store.address}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontFamily="monospace">
                            {store.latitude?.toFixed(6)}, {store.longitude?.toFixed(6)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                            <Chip
                              label={store.isActive ? 'Active' : 'Inactive'}
                              color={store.isActive ? 'success' : 'default'}
                              size="small"
                            />
                        </TableCell>
                        <TableCell align="center">
                          <Stack direction="row" spacing={1} justifyContent="center">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleEditStore(store)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => setDeleteDialog({ open: true, store })}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </TabPanel>

        {/* Tab 3: Bản đồ Chi nhánh */}
        <TabPanel value={activeTab} index={2}>
          <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MapIcon color="primary" />
                  Store Map ({stores.length} stores)
                </Typography>
                {stores.length > 0 && (
                  <Button
                    variant="outlined"
                    startIcon={<MyLocationIcon />}
                    onClick={getUserLocation}
                    disabled={!mapLoaded}
                    sx={{ borderRadius: 2 }}
                  >
                    My Location
                  </Button>
                )}
              </Box>
              
              {stores.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <MapIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No stores to display
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Add stores to view on map
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setActiveTab(0)}
                  >
                    Add Store
                  </Button>
                </Box>
              ) : !mapLoaded ? (
                <Box sx={{
                  height: 500,
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
                    <Button 
                      variant="outlined" 
                      onClick={() => {
                        setMapLoaded(false)
                        setTimeout(() => setMapLoaded(true), 1000)
                      }}
                      sx={{ mt: 2 }}
                    >
                      Retry Loading Map
                    </Button>
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
              
              {stores.length > 0 && mapLoaded && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    💡 Click on markers on the map to view detailed store information
                  </Typography>
                </Box>
              )}
              
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
        </TabPanel>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, store: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete store <strong>{deleteDialog.store?.name}</strong>?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, store: null })}>
            Cancel
          </Button>
          <Button onClick={handleDeleteStore} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      </Container>
    </Box>
  )
}
