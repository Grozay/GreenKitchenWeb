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

export default function HistoryModal({ open, onClose, pointHistories }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{
        backgroundColor: theme => theme.palette.primary.main,
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h6" sx={{ color: 'white' }}>Lịch sử điểm thưởng</Typography>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        {pointHistories && pointHistories.length > 0 ? (
          <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
            {pointHistories.sort((a, b) => new Date(b.earnedAt) - new Date(a.earnedAt)).map((pHistory) => (
              <Card key={pHistory.id} sx={{ mb: 2, border: '1px solid #e0e0e0' }}>
                <CardContent sx={{ p: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
                        {new Date(pHistory.earnedAt).toLocaleDateString('vi-VN')}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(pHistory.earnedAt).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="body1">
                        {pHistory.description ||
                          (pHistory.transactionType === 'USED'
                            ? `Sử dụng điểm (${pHistory.pointsUsed || 0} điểm)`
                            : `Điểm từ đơn hàng ${pHistory.spentAmount?.toLocaleString()} VNĐ`
                          )
                        }
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <Chip
                        label={`${pHistory.transactionType === 'USED' ? '-' : '+'}${Math.abs(pHistory.pointsEarned) || pHistory.pointsUsed || 0} điểm`}
                        color={pHistory.transactionType === 'USED' ? 'error' : 'success'}
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              📝 Chưa có lịch sử giao dịch điểm
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}
