import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import ProductList from './ProductList'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'

export default function MenuPanel({ menuProducts }) {
  const noMenu = !menuProducts || menuProducts.length === 0

  return (
    <Box
      sx={{
        p: { xs: 2.5, sm: 3 },
        borderRadius: 3,
        bgcolor: 'background.paper',
        boxShadow: 1,
        border: '1px solid',
        borderColor: 'grey.100',
        transition: 'all 0.3s ease'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <RestaurantMenuIcon color="success" sx={{ mr: 1 }} />
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{
            color: 'text.primary',
            fontSize: { xs: '17px', sm: '18px' }
          }}
        >
          Danh sách món gợi ý
        </Typography>
      </Box>

      {noMenu ? (
        <Box
          sx={{
            mt: 3,
            p: 2.5,
            textAlign: 'center',
            borderRadius: 2,
            bgcolor: '#f1f8e9',
            border: '1px dashed #c5e1a5'
          }}
        >
          <Typography variant="body1" color="success.main" fontWeight={500}>
            Hãy nhập nhu cầu vào khung chat – ví dụ:{' '}
            <Box component="span" fontStyle="italic" fontWeight={400}>
              &quot;món bò&quot;, &quot;cơm gà&quot;, &quot;ăn chay&quot;...
            </Box>
          </Typography>
        </Box>
      ) : (
        <ProductList products={menuProducts} />
      )}
    </Box>
  )
}
