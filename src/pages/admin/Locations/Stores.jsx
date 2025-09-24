import React, { useEffect, useState } from 'react'
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
  InputAdornment
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

  useEffect(() => {
    loadStores()
  }, [])

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
              <Typography variant="h6" fontWeight={600} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <MapIcon color="primary" />
                Store Map
              </Typography>
              
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
              ) : (
                <Box sx={{
                  height: 500,
                  bgcolor: 'background.default',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px dashed',
                  borderColor: 'divider'
                }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <MapIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Map will be integrated here
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stores.length} stores have been added
                    </Typography>
                  </Box>
                </Box>
              )}
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
