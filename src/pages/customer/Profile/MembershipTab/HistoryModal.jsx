import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'
import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard'
import HistoryIcon from '@mui/icons-material/History'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import { useState } from 'react'

export default function HistoryModal({ open, onClose, pointHistories }) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const getTransactionIcon = (transactionType, description) => {
    if (description?.includes('Exchange coupon')) {
      return <CardGiftcardIcon sx={{ fontSize: '1.5rem', color: '#FF7043' }} />
    }
    if (transactionType === 'USED') {
      return <TrendingDownIcon sx={{ fontSize: '1.5rem', color: '#f44336' }} />
    }
    return <TrendingUpIcon sx={{ fontSize: '1.5rem', color: '#4caf50' }} />
  }

  const getTransactionColor = (transactionType) => {
    if (transactionType === 'USED') {
      return {
        bg: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
        border: '#f44336',
        text: '#d32f2f'
      }
    }
    return {
      bg: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
      border: '#4caf50',
      text: '#2e7d32'
    }
  }

  // Sort and paginate data
  const sortedHistories = pointHistories ? pointHistories.sort((a, b) => new Date(b.earnedAt) - new Date(a.earnedAt)) : []
  const totalPages = Math.ceil(sortedHistories.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentHistories = sortedHistories.slice(startIndex, endIndex)

  const handlePageChange = (event, page) => {
    setCurrentPage(page)
  }

  // Reset to first page when modal opens
  const handleOpen = () => {
    setCurrentPage(1)
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          maxHeight: '70vh'
        }
      }}
      onEntered={handleOpen}
    >
      <DialogTitle sx={{
        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 1.5,
        px: 2,
        borderRadius: '12px 12px 0 0'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <HistoryIcon sx={{ fontSize: '1.4rem' }} />
          <Box>
            <Typography variant="h6" sx={{
              fontWeight: 700,
              color: 'white',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
              fontSize: '1.1rem',
              letterSpacing: '0.5px'
            }}>
              REWARD POINTS HISTORY
            </Typography>
            <Typography variant="caption" sx={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: '0.875rem',
              mt: 0.25
            }}>
              {pointHistories && pointHistories.length > 0
                ? `Showing ${startIndex + 1}-${Math.min(endIndex, sortedHistories.length)} of ${sortedHistories.length} transactions`
                : 'Track point earning and usage history'
              }
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: 'white',
            backgroundColor: 'rgba(255,255,255,0.1)',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.2)',
              transform: 'scale(1.1)'
            },
            transition: 'all 0.3s ease',
            p: 0.5
          }}
        >
          <CloseIcon sx={{ fontSize: '1.2rem' }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {pointHistories && pointHistories.length > 0 ? (
          <Box sx={{ p: 1.5 }}>
            {currentHistories.map((pHistory) => {
              const colors = getTransactionColor(pHistory.transactionType)
              return (
                <Card key={pHistory.id} sx={{
                  mb: 1,
                  borderRadius: 2,
                  background: colors.bg,
                  border: `1px solid ${colors.border}20`,
                  boxShadow: `0 2px 8px ${colors.border}10`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: `0 4px 12px ${colors.border}20`,
                    border: `1px solid ${colors.border}30`
                  }
                }}>
                  <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Grid container spacing={1} alignItems="center">
                      <Grid size={{ xs: 12, sm: 1 }}>
                        <Box sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: '35px',
                          height: '35px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(255,255,255,0.3)',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                        }}>
                          {getTransactionIcon(pHistory.transactionType, pHistory.description)}
                        </Box>
                      </Grid>

                      <Grid size={{ xs: 12, sm: 3 }}>
                        <Typography variant="body2" sx={{
                          fontWeight: 600,
                          color: colors.text,
                          fontSize: '0.875rem',
                          mb: 0.25
                        }}>
                          {new Date(pHistory.earnedAt).toLocaleDateString('vi-VN', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </Typography>
                        <Typography variant="caption" sx={{
                          color: colors.text,
                          opacity: 0.8,
                          fontSize: '0.875rem'
                        }}>
                          {new Date(pHistory.earnedAt).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Typography>
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="body2" sx={{
                          fontWeight: 500,
                          color: colors.text,
                          fontSize: '0.875rem',
                          lineHeight: 1.2
                        }}>
                          {pHistory.description ||
                            (pHistory.transactionType === 'USED'
                              ? `Points used (${pHistory.pointsUsed || 0} points)`
                              : `Points from order ${pHistory.spentAmount?.toLocaleString()} VNĐ`
                            )
                          }
                        </Typography>
                        {pHistory.spentAmount && pHistory.transactionType !== 'USED' && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                            <ShoppingCartIcon sx={{ fontSize: '0.8rem', color: colors.text, opacity: 0.7 }} />
                            <Typography variant="caption" sx={{
                              color: colors.text,
                              opacity: 0.8,
                              fontSize: '0.875rem'
                            }}>
                              {pHistory.spentAmount?.toLocaleString()} VNĐ
                            </Typography>
                          </Box>
                        )}
                      </Grid>

                      <Grid size={{ xs: 12, sm: 2 }}>
                        <Box sx={{ textAlign: 'right' }}>
                          <Chip
                            label={`${pHistory.transactionType === 'USED' ? '-' : '+'}${Math.abs(pHistory.pointsEarned) || pHistory.pointsUsed || 0}`}
                            sx={{
                              fontWeight: 700,
                              fontSize: '0.875rem',
                              backgroundColor: 'rgba(255,255,255,0.9)',
                              color: colors.text,
                              border: `1px solid ${colors.border}`,
                              boxShadow: `0 1px 4px ${colors.border}20`,
                              px: 0.8,
                              py: 0.2,
                              height: 'auto',
                              '& .MuiChip-label': {
                                px: 0
                              }
                            }}
                          />
                          <Typography variant="caption" sx={{
                            color: colors.text,
                            opacity: 0.7,
                            fontSize: '0.875rem',
                            mt: 0.2,
                            display: 'block'
                          }}>
                            points
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              )
            })}

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 1.5,
                mb: 0.5,
                backgroundColor: 'rgba(255,255,255,0.8)',
                borderRadius: 2,
                p: 1,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="medium"
                  showFirstButton
                  showLastButton
                  renderItem={(item) => (
                    <PaginationItem
                      {...item}
                      components={{
                        previous: NavigateBeforeIcon,
                        next: NavigateNextIcon
                      }}
                      sx={{
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        minWidth: '32px',
                        height: '32px',
                        '&.Mui-selected': {
                          backgroundColor: '#1976d2',
                          color: 'white',
                          fontWeight: 700,
                          boxShadow: '0 2px 8px rgba(25,118,210,0.3)',
                          '&:hover': {
                            backgroundColor: '#1565c0'
                          }
                        },
                        '&:hover': {
                          backgroundColor: 'rgba(25,118,210,0.1)'
                        }
                      }}
                    />
                  )}
                />
              </Box>
            )}
          </Box>
        ) : (
          <Box sx={{
            textAlign: 'center',
            py: 4,
            px: 3,
            background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
            borderRadius: '0 0 12px 12px'
          }}>
            <Box sx={{
              fontSize: '3rem',
              mb: 1.5,
              opacity: 0.6,
              animation: 'bounce 2s infinite'
            }}>
              📊
            </Box>
            <Typography variant="h6" sx={{
              fontWeight: 600,
              color: '#666',
              mb: 0.5,
              fontSize: '1rem'
            }}>
              No point transaction history yet
            </Typography>
            <Typography variant="body2" sx={{
              color: '#888',
              fontSize: '0.875rem',
              maxWidth: '350px',
              mx: 'auto',
              lineHeight: 1.4
            }}>
              Start shopping to accumulate reward points and track your transaction history here!
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}
