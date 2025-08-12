import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import ProductList from './ProductList'

export default function MenuPanel({ menuProducts }) {
  const noMenu = !menuProducts || menuProducts.length === 0
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight={700} mb={2}>
        Danh sách món gợi ý
      </Typography>
      {noMenu ? (
        <Box sx={{ p: 2.5, mt: 3, textAlign: 'center', bgcolor: '#e8f5e9', borderRadius: 2 }}>
          <Typography variant="body1" color="primary">
            Bạn hãy nhập yêu cầu vào khung chat (ví dụ: "cần món bò", "cơm gà", "salad chay"...) để AI gợi ý các món phù hợp!
          </Typography>
        </Box>
      ) : (
        <ProductList products={menuProducts} />
      )}
    </Box>
  )
}
