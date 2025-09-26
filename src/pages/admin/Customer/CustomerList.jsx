import { useEffect, useState } from 'react'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { getCustomersFilteredAPI } from '~/apis'
import Pagination from '@mui/material/Pagination'
import { toast } from 'react-toastify'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import SearchIcon from '@mui/icons-material/Search'

export default function CustomerList() {
  const navigate = useNavigate()
  const [customers, setCustomers] = useState([])
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [searchText, setSearchText] = useState('')
  const [debouncedSearchText, setDebouncedSearchText] = useState('')
  const [searching, setSearching] = useState(false)
  const searchTimeout = useRef()
  const [loading, setLoading] = useState(false)
  const [showNoCustomersText, setShowNoCustomersText] = useState(false)

  // fetch customers when page/size/debouncedSearchText change
  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true)
      try {
        const res = await getCustomersFilteredAPI(
          page,
          size,
          undefined, // No gender filter
          debouncedSearchText || undefined
        )
        setCustomers(res.items)
        setTotal(res.total)
      } catch {
        toast.error('Failed to load customers')
      } finally {
        setLoading(false)
      }
    }
    fetchCustomers()
  }, [page, size, debouncedSearchText])

  // Debounce searchText
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current)
    setSearching(true)
    searchTimeout.current = setTimeout(() => {
      setDebouncedSearchText(searchText)
      setSearching(false)
    }, 500)
    return () => clearTimeout(searchTimeout.current)
  }, [searchText])

  // Delay showing "No customers found" text
  useEffect(() => {
    if (customers.length === 0) {
      const timer = setTimeout(() => {
        setShowNoCustomersText(true)
      }, 500)
      return () => clearTimeout(timer)
    } else {
      setShowNoCustomersText(false)
    }
  }, [customers.length])

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString()
  }

  const handleRowClick = (email) => {
    if (!email) return
    navigate(`/management/customers/${encodeURIComponent(email)}`)
  }

  return (
    <>
      <Container maxWidth="xl" sx={{ py: 2 }}>
        <Typography variant="h4" gutterBottom
          sx={{
            fontWeight: 'bold'
          }}
        >
          Customers Management
        </Typography>
        <Paper sx={{ p: 2, borderRadius: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <TextField
              label="Search Customers..."
              variant="outlined"
              size="small"
              value={searchText}
              onChange={e => { setSearchText(e.target.value); setPage(1) }}
              sx={{ width: '100%' }}
              slotProps={{
                input: {
                  startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
                  endAdornment: searching ? <CircularProgress size={20} /> : null
                }
              }}
            />
          </Stack>

          {loading && (
            <LinearProgress sx={{ mb: 1 }} />
          )}

          <TableContainer sx={{ borderRadius: 3, boxShadow: 1 }}>
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', width: 60 }}>Avatar</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Phone</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Gender</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Joined Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customers.map(customer => (
                  <TableRow
                    key={customer.id}
                    hover
                    sx={{
                      transition: 'background 0.2s',
                      '&:hover': { bgcolor: '#eaf0fb', cursor: 'pointer' }
                    }}
                    onClick={() => handleRowClick(customer.email)}
                  >
                    <TableCell>
                      <Avatar
                        src={customer.avatar}
                        alt='Green Kitchen'
                        sx={{ width: 40, height: 40 }}
                      >
                        {customer.fullName?.charAt(0)?.toUpperCase()}
                      </Avatar>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{customer.fullName || '-'}</TableCell>
                    <TableCell>{customer.email || '-'}</TableCell>
                    <TableCell>{customer.phone || '-'}</TableCell>
                    <TableCell>{customer.gender || '-'}</TableCell>
                    <TableCell>{formatDate(customer.createdAt)}</TableCell>
                  </TableRow>
                ))}
                {customers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      {!showNoCustomersText ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                          <CircularProgress size={40} />
                        </Box>
                      ) : (
                        <Box sx={{ py: 6, px: 4 }}>
                          <Typography
                            variant="h6"
                            color="text.secondary"
                            sx={{
                              fontSize: '1.2rem',
                              fontWeight: 500,
                              mb: 1
                            }}
                          >
                            No customers found
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: '0.9rem' }}
                          >
                            Try adjusting your search criteria
                          </Typography>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination & size option */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 2, gap: 2 }}>
            <TextField
              select
              label="Items/page"
              value={size}
              onChange={e => { setSize(Number(e.target.value)); setPage(1) }}
              size="small"
              sx={{ minWidth: 120 }}
            >
              {[10, 20, 50, 100].map(opt => (
                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
              ))}
            </TextField>
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
    </>
  )
}
