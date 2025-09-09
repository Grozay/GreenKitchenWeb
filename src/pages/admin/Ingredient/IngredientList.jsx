import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid'
import { getIngredientsAPI, deleteIngredientsAPI } from '~/apis'
import { toast } from 'react-toastify'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import EditIcon from '@mui/icons-material/Edit'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'

const IngredientList = () => {
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
        const data = await getIngredientsAPI()
        const allIngredients = [
          ...(data.protein || []),
          ...(data.carbs || []),
          ...(data.side || []),
          ...(data.sauce || [])
        ]
        allIngredients.sort((a, b) => b.id - a.id)
        setRows(allIngredients)
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        toast.error('Failed to fetch ingredients')
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
      navigate(`/management/ingredients/${selectedRow.id}`)
      handleCloseMenu()
    }
  }

  const handleEditClick = () => {
    if (selectedRow) {
      navigate(`/management/ingredients/edit/${selectedRow.id}`)
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
        await deleteIngredientsAPI(selectedRow.id)
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
      width: 80,
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
    { field: 'title', headerName: 'Title', width: 200, editable: false },
    { field: 'description', headerName: 'Description', width: 270, editable: false },
    { field: 'calories', headerName: 'Calories', width: 80, type: 'number', editable: false },
    { field: 'protein', headerName: 'Protein', width: 60, type: 'number', editable: false },
    { field: 'carbs', headerName: 'Carbs', width: 60, type: 'number', editable: false },
    { field: 'fat', headerName: 'Fat', width: 60, type: 'number', editable: false },
    { field: 'price', headerName: 'Price', width: 80, type: 'number', editable: false },
    { field: 'stock', headerName: 'Stock', width: 60, type: 'number', editable: false },
    {
      field: 'type',
      headerName: 'Type',
      width: 100,
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
      width: 100,
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
        '& .actions': { color: 'text.secondary' },
        '& .textPrimary': { color: 'text.primary' }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Ingredient List
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/management/ingredients/create')}
          sx={{ fontWeight: 'bold' }}
        >
          Create New Ingredient
        </Button>
      </Box>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id}
        loading={loading}
        showToolbar
        sx={{
          boxShadow: 2,
          border: 1,
          borderColor: 'divider',
          borderRadius: 2
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

export default IngredientList