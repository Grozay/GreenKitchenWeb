import { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Stack from '@mui/material/Stack'
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
import Pagination from '@mui/material/Pagination'
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
import UpdateCouponModal from './UpdateCouponModal'

export default function Coupons() {
  const [coupons, setCoupons] = useState([])
  const [allCoupons, setAllCoupons] = useState([])
  const [page, setPage] = useState(1)
  const [size] = useState(10)
  const [total, setTotal] = useState(0)
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [searchText, setSearchText] = useState('')
  const [loading, setLoading] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, coupon: null })
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [updateModalOpen, setUpdateModalOpen] = useState(false)
  const [selectedCouponId, setSelectedCouponId] = useState(null)

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
  const filterCoupons = (coupons, searchText, typeFilter, statusFilter) => {
    let filtered = coupons

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

  // Apply filters and pagination when filters change
  useEffect(() => {
    const filteredCoupons = filterCoupons(allCoupons, searchText, typeFilter, statusFilter)

    // Apply pagination
    const startIndex = (page - 1) * size
    const endIndex = startIndex + size
    const paginatedCoupons = filteredCoupons.slice(startIndex, endIndex)

    setCoupons(paginatedCoupons)
    setTotal(filteredCoupons.length)

    // Reset to first page if current page exceeds total pages
    const totalPages = Math.ceil(filteredCoupons.length / size)
    if (page > totalPages && totalPages > 0) {
      setPage(1)
    }
  }, [allCoupons, searchText, typeFilter, statusFilter, page, size])

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

  const handleEdit = (couponId) => {
    setSelectedCouponId(couponId)
    setUpdateModalOpen(true)
  }

  const handleCreateSuccess = async () => {
    // Refresh all coupons data
    const res = await getAllCouponsAPI()
    setAllCoupons(res)
    setPage(1) // Reset to first page
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

  const formatDiscount = (coupon) => {
    if (coupon.type === 'PERCENTAGE') {
      return `${coupon.discountValue}%`
    } else {
      return `$${coupon.discountValue}`
    }
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Typography variant="h4" gutterBottom
          sx= {{
            fontWeight: 'bold'
          }}
        >
          Coupons Management
        </Typography>
        <Paper sx={{ p: 2, borderRadius: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <FormControl sx={{ minWidth: 160 }} size="small">
              <InputLabel id="type-filter-label">Type</InputLabel>
              <Select
                labelId="type-filter-label"
                label="Type"
                value={typeFilter}
                onChange={(e) => { setTypeFilter(e.target.value); setPage(1) }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="PERCENTAGE">Percentage</MenuItem>
                <MenuItem value="FIXED_AMOUNT">Fixed Amount</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 160 }} size="small">
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                label="Status"
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
              >
                <MenuItem value="ALL">All</MenuItem>
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="INACTIVE">Inactive</MenuItem>
                <MenuItem value="EXPIRED">Expired</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Search Coupons..."
              variant="outlined"
              size="small"
              value={searchText}
              onChange={e => { setSearchText(e.target.value); setPage(1) }}
              sx={{ minWidth: 220 }}
            />
            <Box sx={{ flex: 1 }} />
            <Button variant="contained" onClick={() => setCreateModalOpen(true)}>Create Coupon</Button>
          </Stack>

          {loading && (
            <LinearProgress sx={{ mb: 1 }} />
          )}

          <TableContainer sx={{ borderRadius: 3, boxShadow: 1 }}>
            <Table size='small'>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f0f2f5' }}>
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
                {coupons.map(coupon => (
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
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button size="small" onClick={() => handleEdit(coupon.id)}>
                          Edit
                        </Button>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(coupon)}
                          sx={{ '&:hover': { bgcolor: 'error.light', color: 'white' } }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {coupons.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">No coupons found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination & size option */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 2, gap: 2 }}>
            <Pagination
              count={Math.max(1, Math.ceil(total / size))}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
              shape="rounded"
              showFirstButton
              showLastButton
            />
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

      {/* Create Coupon Modal */}
      <CreateCouponModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* Update Coupon Modal */}
      <UpdateCouponModal
        open={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        onSuccess={handleUpdateSuccess}
        couponId={selectedCouponId}
      />
    </>
  )
}
