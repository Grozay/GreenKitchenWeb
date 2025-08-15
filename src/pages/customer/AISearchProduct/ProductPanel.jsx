import Box from '@mui/material/Box'
import ProductListPanel from './ProductListPanel'

function ProductPanel({ status, products }) {
  // Hiện thông báo nếu panel chưa có filter
  const renderPanelNotify = () => (
    <Box sx={{ p: 3, textAlign: 'center', color: 'grey.600', fontStyle: 'italic', fontSize: 15 }}>
      🥗 Bạn hãy nhập yêu cầu về món ăn, ví dụ: <b>“Tôi cần món bò”</b> hoặc <b>“Gợi ý món cho người tập gym”</b>
    </Box>
  )

  return (
    <Box sx={{
      flex: 1.3,
      minWidth: 320,
      maxWidth: 450,
      bgcolor: 'background.paper',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
        {status === 'INIT' && renderPanelNotify()}
        {status === 'FILTERED' && <ProductListPanel dishes={products} />}
        {status === 'IDLE' && (
          <Box sx={{ p: 3, textAlign: 'center', color: 'grey.500', fontSize: 15 }}>
            <span>Tiếp tục trò chuyện hoặc tìm món khác...</span>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default ProductPanel
