import { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Chip from '@mui/material/Chip'
import { getAllCouponsAPI, deleteCouponAPI } from '~/apis'
import { toast } from 'react-toastify'
import Typography from '@mui/material/Typography'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import CreateCouponModal from './CreateCouponModal'
import ViewCouponModal from './ViewCouponModal'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

export default function Coupons() {
  const [allCoupons, setAllCoupons] = useState([])
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [searchText, setSearchText] = useState('')
  const [loading, setLoading] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, coupon: null })
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [updateModalOpen, setUpdateModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedCouponId, setSelectedCouponId] = useState(null)
  const [activeTab, setActiveTab] = useState(0) // 0: General, 1: Specific Customer

  // TabPanel component
  const TabPanel = ({ children, value, index, ...other }) => {
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`coupon-tabpanel-${index}`}
        aria-labelledby={`coupon-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    )
  }

  // Fetch all coupons on component mount
  useEffect(() => {
    const fetchAllCoupons = async () => {
      setLoading(true)
      try {
        const res = await getAllCouponsAPI()
        setAllCoupons(res)
      } catch {
        toast.error('Failed to load coupons')
      } finally {
        setLoading(false)
      }
    }
    fetchAllCoupons()
  }, [])

  // Filter coupons based on search, type, and status filters
  const filterCoupons = (coupons, searchText, typeFilter, statusFilter, applicability = null) => {
    let filtered = coupons

    // Apply applicability filter if specified
    if (applicability) {
      filtered = filtered.filter(coupon => coupon.applicability === applicability)
    }

    // Apply status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(coupon => coupon.status === statusFilter)
    }

    // Apply type filter
    if (typeFilter) {
      filtered = filtered.filter(coupon => coupon.type === typeFilter)
    }

    // Apply search filter
    if (searchText) {
      const searchLower = searchText.toLowerCase()
      filtered = filtered.filter(coupon =>
        coupon.code.toLowerCase().includes(searchLower) ||
        coupon.name.toLowerCase().includes(searchLower) ||
        (coupon.description && coupon.description.toLowerCase().includes(searchLower))
      )
    }

    return filtered
  }

  // Get general coupons
  const getGeneralCoupons = () => {
    return filterCoupons(allCoupons, searchText, typeFilter, statusFilter, 'GENERAL')
  }

  // Get specific customer coupons
  const getSpecificCustomerCoupons = () => {
    return filterCoupons(allCoupons, searchText, typeFilter, statusFilter, 'SPECIFIC_CUSTOMER')
  }

  const handleDelete = async (coupon) => {
    setDeleteDialog({ open: true, coupon })
  }

  const confirmDelete = async () => {
    try {
      await toast.promise(
        deleteCouponAPI(deleteDialog.coupon.id),
        { pending: 'Deleting coupon...', success: 'Coupon deleted successfully', error: 'Failed to delete coupon' }
      )
      // Refresh all coupons data
      const res = await getAllCouponsAPI()
      setAllCoupons(res)
      setDeleteDialog({ open: false, coupon: null })
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to delete coupon', e)
    }
  }

  const handleView = (couponId) => {
    setSelectedCouponId(couponId)
    setViewModalOpen(true)
  }

  const handleEdit = (couponId) => {
    setSelectedCouponId(couponId)
    setUpdateModalOpen(true)
  }

  const handleCreateSuccess = async () => {
    // Refresh all coupons data
    const res = await getAllCouponsAPI()
    setAllCoupons(res)
  }

  const handleUpdateSuccess = async () => {
    // Refresh all coupons data
    const res = await getAllCouponsAPI()
    setAllCoupons(res)
  }

  const getStatusColor = (status) => {
    switch (status) {
    case 'ACTIVE': return 'success'
    case 'INACTIVE': return 'warning'
    case 'EXPIRED': return 'error'
    default: return 'default'
    }
  }

  const renderCouponActions = (coupon) => {
    const isSpecificCustomer = coupon.applicability === 'SPECIFIC_CUSTOMER'

    return (
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
        <Button
          size="small"
          onClick={() => isSpecificCustomer ? handleView(coupon.id) : handleEdit(coupon.id)}
          sx={{
            opacity: isSpecificCustomer ? 1 : 1,
            '&:hover': {
              bgcolor: isSpecificCustomer ? 'info.main' : 'primary.main'
            }
          }}
        >
          {isSpecificCustomer ? 'View' : 'Edit'}
        </Button>
        <IconButton
          size="small"
          color="error"
          onClick={() => handleDelete(coupon)}
          sx={{ '&:hover': { bgcolor: 'error.light', color: 'white' } }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    )
  }

  const formatDiscount = (coupon) => {
    if (coupon.type === 'PERCENTAGE') {
      return `${coupon.discountValue}%`
    } else {
      return `$${coupon.discountValue}`
    }
  }

  return (
    <>
      <Container maxWidth="xl" sx={{ py: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: { xs: '2rem', sm: '2.5rem' } }}>
            Coupon Management
          </Typography>
          <Button variant="contained" onClick={() => setCreateModalOpen(true)}>
            Create Coupon
          </Button>
        </Box>
        <Paper sx={{ p: 2, borderRadius: 2 }}>
          <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <FormControl sx={{ width: '100%' }} size="small">
                <InputLabel id="type-filter-label">Type</InputLabel>
                <Select
                  labelId="type-filter-label"
                  label="Type"
                  value={typeFilter}
                  onChange={(e) => { setTypeFilter(e.target.value) }}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="PERCENTAGE">Percentage</MenuItem>
                  <MenuItem value="FIXED_AMOUNT">Fixed Amount</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <FormControl sx={{ width: '100%' }} size="small">
                <InputLabel id="status-filter-label">Status</InputLabel>
                <Select
                  labelId="status-filter-label"
                  label="Status"
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value) }}
                >
                  <MenuItem value="ALL">All</MenuItem>
                  <MenuItem value="ACTIVE">Active</MenuItem>
                  <MenuItem value="INACTIVE">Inactive</MenuItem>
                  <MenuItem value="EXPIRED">Expired</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 12, md: 4 }}>
              <TextField
                label="Search Coupons..."
                variant="outlined"
                size="small"
                value={searchText}
                onChange={e => { setSearchText(e.target.value) }}
                sx={{ width: '100%' }}
              />
            </Grid>
          </Grid>

          {loading && (
            <LinearProgress sx={{ mb: 1 }} />
          )}

          {/* Tabs for coupon types */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} aria-label="coupon tabs">
              <Tab label="General Coupons" id="coupon-tab-0" aria-controls="coupon-tabpanel-0" />
              <Tab label="Specific Customer Coupons" id="coupon-tab-1" aria-controls="coupon-tabpanel-1" />
            </Tabs>
          </Box>

          {/* General Coupons Tab */}
          <TabPanel value={activeTab} index={0}>
            <TableContainer sx={{ borderRadius: 3, boxShadow: 1 }}>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Code</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Discount</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Points Required</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Valid Until</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getGeneralCoupons().map(coupon => (
                    <TableRow key={coupon.id} hover sx={{ transition: 'background 0.2s', '&:hover': { bgcolor: '#eaf0fb' } }}>
                      <TableCell sx={{ fontWeight: 'bold', fontFamily: 'monospace' }}>{coupon.code}</TableCell>
                      <TableCell sx={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {coupon.name}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={coupon.type === 'PERCENTAGE' ? 'Percentage' : 'Fixed Amount'}
                          size="small"
                          color={coupon.type === 'PERCENTAGE' ? 'primary' : 'secondary'}
                        />
                      </TableCell>
                      <TableCell>{formatDiscount(coupon)}</TableCell>
                      <TableCell>{coupon.pointsRequired}</TableCell>
                      <TableCell>{new Date(coupon.validUntil).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Chip label={coupon.status} size="small" color={getStatusColor(coupon.status)} />
                      </TableCell>
                      <TableCell align="right">
                        {renderCouponActions(coupon)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {getGeneralCoupons().length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} align="center">No general coupons found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* Specific Customer Coupons Tab */}
          <TabPanel value={activeTab} index={1}>
            <TableContainer sx={{ borderRadius: 3, boxShadow: 1 }}>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Code</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Discount</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Points Required</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Valid Until</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getSpecificCustomerCoupons().map(coupon => (
                    <TableRow key={coupon.id} hover sx={{ transition: 'background 0.2s', '&:hover': { bgcolor: '#eaf0fb' } }}>
                      <TableCell sx={{ fontWeight: 'bold', fontFamily: 'monospace' }}>{coupon.code}</TableCell>
                      <TableCell sx={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {coupon.name}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={coupon.type === 'PERCENTAGE' ? 'Percentage' : 'Fixed Amount'}
                          size="small"
                          color={coupon.type === 'PERCENTAGE' ? 'primary' : 'secondary'}
                        />
                      </TableCell>
                      <TableCell>{formatDiscount(coupon)}</TableCell>
                      <TableCell>{coupon.pointsRequired}</TableCell>
                      <TableCell>{new Date(coupon.validUntil).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Chip label={coupon.status} size="small" color={getStatusColor(coupon.status)} />
                      </TableCell>
                      <TableCell align="right">
                        {renderCouponActions(coupon)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {getSpecificCustomerCoupons().length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} align="center">No specific customer coupons found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* Pagination & size option */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 2, gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Showing {activeTab === 0 ? getGeneralCoupons().length : getSpecificCustomerCoupons().length} coupons
            </Typography>
          </Box>
        </Paper>
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, coupon: null })}
      >
        <DialogTitle>Delete Coupon</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete coupon &quot;{deleteDialog.coupon?.code}&quot;?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, coupon: null })}>
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Coupon Modal */}
      <ViewCouponModal
        open={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false)
          setSelectedCouponId(null)
        }}
        couponId={selectedCouponId}
        allCoupons={allCoupons}
      />

      {/* Create/Update Coupon Modal */}
      <CreateCouponModal
        open={createModalOpen || updateModalOpen}
        onClose={() => {
          setCreateModalOpen(false)
          setUpdateModalOpen(false)
          setSelectedCouponId(null)
        }}
        onSuccess={updateModalOpen ? handleUpdateSuccess : handleCreateSuccess}
        isUpdate={updateModalOpen}
        couponId={selectedCouponId}
      />
    </>
  )
}
