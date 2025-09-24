import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid'
import { getMenuMealAPI, deleteMenuMealAPI } from '~/apis'
import { toast } from 'react-toastify'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import EditIcon from '@mui/icons-material/Edit'
import ContentCopyIcon from '@mui/icons-material/ContentCopy' // Thêm icon clone
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'

const MenuMealList = () => {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedRow, setSelectedRow] = useState(null)
  const [openConfirm, setOpenConfirm] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const data = await getMenuMealAPI()
        data.sort((a, b) => b.id - a.id)
        setRows(data)
      } catch {
        toast.error('Failed to fetch menu meals')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleMoreClick = (row) => (event) => {
    setAnchorEl(event.currentTarget)
    setSelectedRow(row)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
    // setSelectedRow(null)
  }

  const handleViewDetail = () => {
    if (selectedRow) {
      navigate(`/management/menu-meals/${selectedRow.slug}`)
      handleCloseMenu()
    }
  }

  const handleEditClick = () => {
    if (selectedRow) {
      navigate(`/management/menu-meals/edit/${selectedRow.slug}`)
      handleCloseMenu()
    }
  }

  const handleCloneClick = () => {
    if (selectedRow) {
      navigate(`/management/menu-meals/create?clone=${selectedRow.slug}`)
      handleCloseMenu()
    }
  }

  const handleAskDelete = () => {
    setOpenConfirm(true)
    setAnchorEl(null)
  }

  // Người dùng xác nhận xóa
  const handleDelete = async () => {
    if (selectedRow) {
      try {
        await deleteMenuMealAPI(selectedRow.id)
        setRows((prev) => prev.filter((row) => row.id !== selectedRow.id))
        toast.success('Deleted successfully!')
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Delete failed!')
      } finally {
        setOpenConfirm(false)
        setSelectedRow(null)
      }
    }
  }

  // Người dùng bấm Cancel
  const handleCancelDelete = () => {
    setOpenConfirm(false)
    setSelectedRow(null)
  }

  const columns = [
    {
      field: 'image',
      headerName: 'Image',
      minWidth: 80,
      flex: 0.5,
      renderCell: (params) => (
        <img
          src={params.value}
          alt={params.row.title}
          style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }}
        />
      ),
      sortable: false,
      filterable: false,
      editable: false
    },
    { field: 'title', headerName: 'Title', minWidth: 150, flex: 1.5, editable: false },
    { field: 'description', headerName: 'Description', minWidth: 200, flex: 2, editable: false },
    { field: 'calories', headerName: 'Calories', minWidth: 60, flex: 0.6, type: 'number', editable: false },
    { field: 'protein', headerName: 'Protein', minWidth: 60, flex: 0.6, type: 'number', editable: false },
    { field: 'carbs', headerName: 'Carbs', minWidth: 60, flex: 0.6, type: 'number', editable: false },
    { field: 'fat', headerName: 'Fat', minWidth: 60, flex: 0.6, type: 'number', editable: false },
    { field: 'price', headerName: 'Price', minWidth: 80, flex: 0.8, type: 'number', editable: false },
    { field: 'stock', headerName: 'Stock', minWidth: 60, flex: 0.6, type: 'number', editable: false },
    {
      field: 'type',
      headerName: 'Type',
      minWidth: 100,
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === 'BALANCE'
              ? 'primary'
              : params.value === 'HIGH'
                ? 'success'
                : params.value === 'LOW'
                  ? 'warning'
                  : 'default'
          }
          size="small"
        />
      ),
      editable: false
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      minWidth: 100,
      flex: 1,
      getActions: (params) => [
        <GridActionsCellItem
          key="more"
          icon={<MoreHorizIcon />}
          label="More"
          onClick={handleMoreClick(params.row)}
          color="inherit"
        />
      ]
    }
  ]

  return (
    <Box
      sx={{
        height: 'calc(100vh - 200px)',
        width: '100%',
        p: 3,
        overflowX: 'hidden',
        '& .actions': { color: 'text.secondary' },
        '& .textPrimary': { color: 'text.primary' }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Menu Meal List
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/management/menu-meals/create')}
          sx={{ fontWeight: 'bold' }}
        >
          Create New Menu Meal
        </Button>
      </Box>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id}
        loading={loading}
        showToolbar
        autoWidth
        sx={{
          boxShadow: 2,
          border: 1,
          borderColor: 'divider',
          borderRadius: 2,
          '& .MuiDataGrid-root': {
            overflowX: 'hidden'
          }
        }}
      />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleViewDetail}>
          <RemoveRedEyeIcon fontSize="small" sx={{ mr: 1, color: 'success.main' }} />
          View Detail
        </MenuItem>
        <MenuItem onClick={handleEditClick}>
          <EditIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleCloneClick}> {/* Thêm menu item Clone */}
          <ContentCopyIcon fontSize="small" sx={{ mr: 1, color: 'info.main' }} />
          Clone
        </MenuItem>
        <MenuItem onClick={handleAskDelete}>
          <DeleteIcon fontSize="small" sx={{ mr: 1, color: 'error.main' }} />
          Delete
        </MenuItem>
      </Menu>

      <Dialog
        open={openConfirm}
        onClose={handleCancelDelete}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <b>{selectedRow?.title}</b>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default MenuMealList