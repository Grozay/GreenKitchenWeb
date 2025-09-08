import React, { useState, useMemo } from 'react'
import {
  Box,
  Typography,
  List,
  ListItem,
  Divider,
  CircularProgress,
  TextField,
  InputAdornment,
  Button
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import CustomerInfo from '../pages/admin/Coupons/CustomerInfo'

const CustomerList = ({
  customers = [],
  loading = false,
  onCustomerSelect,
  onCustomerRemove,
  showRemove = false,
  emptyMessage = 'Không có khách hàng nào'
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showAll, setShowAll] = useState(false)

  // Filter customers based on search term
  const filteredCustomers = useMemo(() => {
    if (!searchTerm.trim()) return customers

    const term = searchTerm.toLowerCase()
    return customers.filter(customer =>
      customer.fullName?.toLowerCase().includes(term) ||
      customer.email?.toLowerCase().includes(term) ||
      customer.phone?.toLowerCase().includes(term)
    )
  }, [customers, searchTerm])

  // Show only 5 customers initially, or all if showAll is true
  const displayedCustomers = showAll ? filteredCustomers : filteredCustomers.slice(0, 5)
  const hasMoreCustomers = filteredCustomers.length > 5

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress size={24} />
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Search Field */}
      <TextField
        fullWidth
        size="small"
        placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'text.secondary' }} />
            </InputAdornment>
          )
        }}
      />

      {/* Customer List */}
      {filteredCustomers.length === 0 ? (
        <Box sx={{ textAlign: 'center', p: 3 }}>
          <Typography variant="body2" color="text.secondary">
            {searchTerm ? 'Không tìm thấy khách hàng nào' : emptyMessage}
          </Typography>
        </Box>
      ) : (
        <>
          <List sx={{ width: '100%', p: 0, maxWidth: '100%' }}>
            {displayedCustomers.map((customer, index) => (
              <React.Fragment key={customer.id}>
                <ListItem
                  sx={{
                    p: 0,
                    cursor: onCustomerSelect ? 'pointer' : 'default',
                    width: '100%',
                    '&:hover': {
                      backgroundColor: onCustomerSelect ? 'action.hover' : 'transparent'
                    }
                  }}
                  onClick={() => onCustomerSelect && onCustomerSelect(customer)}
                >
                  <CustomerInfo
                    customer={customer}
                    onRemove={onCustomerRemove}
                    showRemove={showRemove}
                  />
                </ListItem>
                {index < displayedCustomers.length - 1 && <Divider sx={{ my: 1 }} />}
              </React.Fragment>
            ))}
          </List>

          {/* Load More Button */}
          {hasMoreCustomers && !showAll && (
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setShowAll(true)}
                sx={{ minWidth: 120 }}
              >
                Xem thêm ({filteredCustomers.length - 5} khách hàng)
              </Button>
            </Box>
          )}

          {/* Show Less Button */}
          {showAll && hasMoreCustomers && (
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setShowAll(false)}
                sx={{ minWidth: 120 }}
              >
                Thu gọn
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  )
}

export default CustomerList
