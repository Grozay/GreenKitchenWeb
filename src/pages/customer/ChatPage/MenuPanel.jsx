import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import ProductCard from './ProductCard'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import GrainIcon from '@mui/icons-material/Grain'
import LocalPizzaIcon from '@mui/icons-material/LocalPizza'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import WhatshotIcon from '@mui/icons-material/Whatshot'
import Slider from '@mui/material/Slider'
import { useState, useMemo } from 'react'
import Button from '@mui/material/Button'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import FilterListIcon from '@mui/icons-material/FilterList'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

// Component đơn giản để hiển thị menu products
function MenuGrid({ products }) {
  if (!products || products.length === 0) return null

  return (
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: {
        xs: '1fr',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(2, 1fr)',
        lg: 'repeat(3, 1fr)'
      },
      gap: { xs: 1, sm: 2, md: 3 },
      width: '100%',
      alignItems: 'stretch'
    }}>
      {products.map((product, idx) => (
        <Box
          key={product.id || idx}
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            minWidth: 0,
            minHeight: 0
          }}
        >
          <ProductCard
            product={product}
            showActions
            variant="default"
            onAddToCart={() => {}}
            onToggleFavorite={() => {}}
            isFavorited={false}
          />
        </Box>
      ))}
    </Box>
  )
}

export default function MenuPanel({ menuProducts }) {
  const [search, setSearch] = useState('')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [priceSlider, setPriceSlider] = useState([0, 1000000])
  const [fatMin, setFatMin] = useState('')
  const [fatMax, setFatMax] = useState('')
  const [fatSlider, setFatSlider] = useState([0, 100])
  const [carbMin, setCarbMin] = useState('')
  const [carbMax, setCarbMax] = useState('')
  const [carbSlider, setCarbSlider] = useState([0, 100])
  const [proteinMin, setProteinMin] = useState('')
  const [proteinMax, setProteinMax] = useState('')
  const [proteinSlider, setProteinSlider] = useState([0, 100])
  const [caloMin, setCaloMin] = useState('')
  const [caloMax, setCaloMax] = useState('')
  const [caloSlider, setCaloSlider] = useState([0, 1000])
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [filterOpen, setFilterOpen] = useState(false)

  // Filter products
  const filteredProducts = useMemo(() => {
    if (!menuProducts) return []
    return menuProducts.filter(p => {
      const matchesName = p.title?.toLowerCase().includes(search.toLowerCase())
      const matchesPrice =
        (priceMin === '' || p.price >= Number(priceMin)) &&
        (priceMax === '' || p.price <= Number(priceMax)) &&
        (typeof p.price === 'number' ? (p.price >= priceSlider[0] && p.price <= priceSlider[1]) : true)
      const matchesFat =
        (fatMin === '' || (typeof p.fat === 'number' && p.fat >= Number(fatMin))) &&
        (fatMax === '' || (typeof p.fat === 'number' && p.fat <= Number(fatMax))) &&
        (typeof p.fat === 'number' ? (p.fat >= fatSlider[0] && p.fat <= fatSlider[1]) : true)
      const matchesCarb =
        (carbMin === '' || (typeof p.carb === 'number' && p.carb >= Number(carbMin))) &&
        (carbMax === '' || (typeof p.carb === 'number' && p.carb <= Number(carbMax))) &&
        (typeof p.carb === 'number' ? (p.carb >= carbSlider[0] && p.carb <= carbSlider[1]) : true)
      const matchesProtein =
        (proteinMin === '' || (typeof p.protein === 'number' && p.protein >= Number(proteinMin))) &&
        (proteinMax === '' || (typeof p.protein === 'number' && p.protein <= Number(proteinMax))) &&
        (typeof p.protein === 'number' ? (p.protein >= proteinSlider[0] && p.protein <= proteinSlider[1]) : true)
      const matchesCalo =
        (caloMin === '' || (typeof p.calo === 'number' && p.calo >= Number(caloMin))) &&
        (caloMax === '' || (typeof p.calo === 'number' && p.calo <= Number(caloMax))) &&
        (typeof p.calo === 'number' ? (p.calo >= caloSlider[0] && p.calo <= caloSlider[1]) : true)
      return matchesName && matchesPrice && matchesFat && matchesCarb && matchesProtein && matchesCalo
    })
  }, [
    menuProducts, search,
    priceMin, priceMax, priceSlider,
    fatMin, fatMax, fatSlider,
    carbMin, carbMax, carbSlider,
    proteinMin, proteinMax, proteinSlider,
    caloMin, caloMax, caloSlider
  ])

  const noMenu = !filteredProducts || filteredProducts.length === 0

  return (
    <Box sx={{
      p: { xs: 1, sm: 2, md: 2.5, lg: 3 },
      height: '100%',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Typography
        variant="h6"
        fontWeight={700}
        mb={2}
        sx={{
          fontSize: { xs: '1rem', sm: '1.05rem', md: '1.1rem', lg: '1.15rem' },
          flexShrink: 0
        }}
      >
        Danh sách món gợi ý
      </Typography>
      <Paper
        elevation={2}
        sx={{
          p: { xs: 1, sm: 1.5, md: 2, lg: 2.5 },
          mb: { xs: 1, sm: 2 },
          borderRadius: 3,
          bgcolor: '#f9fbe7',
          flexShrink: 0
        }}
      >
        {isMobile ? (
          <>
            <Stack direction="row" spacing={1}>
              <TextField
                label="🔍 Tìm theo tên món"
                variant="outlined"
                size="small"
                fullWidth
                value={search}
                onChange={e => setSearch(e.target.value)}
                sx={{ bgcolor: 'white', borderRadius: 2, fontWeight: 500, fontSize: '0.85rem' }}
                InputProps={{ style: { fontSize: '0.85rem' } }}
                InputLabelProps={{ style: { fontSize: '0.85rem' } }}
              />
              <Button
                variant="outlined"
                startIcon={<FilterListIcon />}
                onClick={() => setFilterOpen(v => !v)}
                sx={{ minWidth: 40, px: 1, borderRadius: 2 }}
              >
                Bộ lọc
              </Button>
            </Stack>
            <Accordion expanded={filterOpen} onChange={() => setFilterOpen(v => !v)} sx={{ mt: 1 }}>
              <AccordionSummary>
                <Typography variant="subtitle2" fontWeight={600}>Bộ lọc nâng cao</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  {/* Giá */}
                  <Grid item xs={12}>
                    <Typography variant="caption" fontWeight={600} color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5, fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>
                      <AttachMoneyIcon fontSize="small" sx={{ mr: 0.5 }} /> Giá (VNĐ)
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="center">
                      <TextField
                        label="Từ"
                        type="number"
                        size="small"
                        value={priceMin}
                        onChange={e => setPriceMin(e.target.value)}
                        sx={{ width: { xs: '100%', sm: 70 }, bgcolor: 'white', borderRadius: 2 }}
                        InputProps={{ style: { fontSize: '0.8rem' } }}
                        InputLabelProps={{ style: { fontSize: '0.8rem' } }}
                      />
                      <TextField
                        label="Đến"
                        type="number"
                        size="small"
                        value={priceMax}
                        onChange={e => setPriceMax(e.target.value)}
                        sx={{ width: { xs: '100%', sm: 70 }, bgcolor: 'white', borderRadius: 2 }}
                        InputProps={{ style: { fontSize: '0.8rem' } }}
                        InputLabelProps={{ style: { fontSize: '0.8rem' } }}
                      />
                      <Slider
                        value={priceSlider}
                        min={0}
                        max={1000000}
                        step={10000}
                        onChange={(_, v) => setPriceSlider(v)}
                        valueLabelDisplay="auto"
                        sx={{ width: { xs: '100%', sm: 120 }, ml: { xs: 0, sm: 1 } }}
                      />
                    </Stack>
                  </Grid>
                  {/* Carb */}
                  <Grid item xs={12}>
                    <Typography variant="caption" fontWeight={600} color="info.main" sx={{ display: 'flex', alignItems: 'center', mb: 0.5, fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>
                      <GrainIcon fontSize="small" sx={{ mr: 0.5 }} /> Carb (g)
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="center">
                      <TextField
                        label="Từ"
                        type="number"
                        size="small"
                        value={carbMin}
                        onChange={e => setCarbMin(e.target.value)}
                        sx={{ width: { xs: '100%', sm: 60 }, bgcolor: 'white', borderRadius: 2 }}
                        InputProps={{ style: { fontSize: '0.8rem' } }}
                        InputLabelProps={{ style: { fontSize: '0.8rem' } }}
                      />
                      <TextField
                        label="Đến"
                        type="number"
                        size="small"
                        value={carbMax}
                        onChange={e => setCarbMax(e.target.value)}
                        sx={{ width: { xs: '100%', sm: 60 }, bgcolor: 'white', borderRadius: 2 }}
                        InputProps={{ style: { fontSize: '0.8rem' } }}
                        InputLabelProps={{ style: { fontSize: '0.8rem' } }}
                      />
                      <Slider
                        value={carbSlider}
                        min={0}
                        max={100}
                        step={1}
                        onChange={(_, v) => setCarbSlider(v)}
                        valueLabelDisplay="auto"
                        sx={{ width: { xs: '100%', sm: 90 }, ml: { xs: 0, sm: 1 }, color: 'info.main' }}
                      />
                    </Stack>
                  </Grid>
                  {/* Fat */}
                  <Grid item xs={12}>
                    <Typography variant="caption" fontWeight={600} color="warning.main" sx={{ display: 'flex', alignItems: 'center', mb: 0.5, fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>
                      <LocalPizzaIcon fontSize="small" sx={{ mr: 0.5 }} /> Fat (g)
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="center">
                      <TextField
                        label="Từ"
                        type="number"
                        size="small"
                        value={fatMin}
                        onChange={e => setFatMin(e.target.value)}
                        sx={{ width: { xs: '100%', sm: 60 }, bgcolor: 'white', borderRadius: 2 }}
                        InputProps={{ style: { fontSize: '0.8rem' } }}
                        InputLabelProps={{ style: { fontSize: '0.8rem' } }}
                      />
                      <TextField
                        label="Đến"
                        type="number"
                        size="small"
                        value={fatMax}
                        onChange={e => setFatMax(e.target.value)}
                        sx={{ width: { xs: '100%', sm: 60 }, bgcolor: 'white', borderRadius: 2 }}
                        InputProps={{ style: { fontSize: '0.8rem' } }}
                        InputLabelProps={{ style: { fontSize: '0.8rem' } }}
                      />
                      <Slider
                        value={fatSlider}
                        min={0}
                        max={100}
                        step={1}
                        onChange={(_, v) => setFatSlider(v)}
                        valueLabelDisplay="auto"
                        sx={{ width: { xs: '100%', sm: 90 }, ml: { xs: 0, sm: 1 }, color: 'warning.main' }}
                      />
                    </Stack>
                  </Grid>
                  {/* Protein */}
                  <Grid item xs={12}>
                    <Typography variant="caption" fontWeight={600} color="success.main" sx={{ display: 'flex', alignItems: 'center', mb: 0.5, fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>
                      <FitnessCenterIcon fontSize="small" sx={{ mr: 0.5 }} /> Protein (g)
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="center">
                      <TextField
                        label="Từ"
                        type="number"
                        size="small"
                        value={proteinMin}
                        onChange={e => setProteinMin(e.target.value)}
                        sx={{ width: { xs: '100%', sm: 60 }, bgcolor: 'white', borderRadius: 2 }}
                        InputProps={{ style: { fontSize: '0.8rem' } }}
                        InputLabelProps={{ style: { fontSize: '0.8rem' } }}
                      />
                      <TextField
                        label="Đến"
                        type="number"
                        size="small"
                        value={proteinMax}
                        onChange={e => setProteinMax(e.target.value)}
                        sx={{ width: { xs: '100%', sm: 60 }, bgcolor: 'white', borderRadius: 2 }}
                        InputProps={{ style: { fontSize: '0.8rem' } }}
                        InputLabelProps={{ style: { fontSize: '0.8rem' } }}
                      />
                      <Slider
                        value={proteinSlider}
                        min={0}
                        max={100}
                        step={1}
                        onChange={(_, v) => setProteinSlider(v)}
                        valueLabelDisplay="auto"
                        sx={{ width: { xs: '100%', sm: 90 }, ml: { xs: 0, sm: 1 }, color: 'success.main' }}
                      />
                    </Stack>
                  </Grid>
                  {/* Calo */}
                  <Grid item xs={12}>
                    <Typography variant="caption" fontWeight={600} color="error.main" sx={{ display: 'flex', alignItems: 'center', mb: 0.5, fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>
                      <WhatshotIcon fontSize="small" sx={{ mr: 0.5 }} /> Calo
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="center">
                      <TextField
                        label="Từ"
                        type="number"
                        size="small"
                        value={caloMin}
                        onChange={e => setCaloMin(e.target.value)}
                        sx={{ width: { xs: '100%', sm: 60 }, bgcolor: 'white', borderRadius: 2 }}
                        InputProps={{ style: { fontSize: '0.8rem' } }}
                        InputLabelProps={{ style: { fontSize: '0.8rem' } }}
                      />
                      <TextField
                        label="Đến"
                        type="number"
                        size="small"
                        value={caloMax}
                        onChange={e => setCaloMax(e.target.value)}
                        sx={{ width: { xs: '100%', sm: 60 }, bgcolor: 'white', borderRadius: 2 }}
                        InputProps={{ style: { fontSize: '0.8rem' } }}
                        InputLabelProps={{ style: { fontSize: '0.8rem' } }}
                      />
                      <Slider
                        value={caloSlider}
                        min={0}
                        max={1000}
                        step={10}
                        onChange={(_, v) => setCaloSlider(v)}
                        valueLabelDisplay="auto"
                        sx={{ width: { xs: '100%', sm: 90 }, ml: { xs: 0, sm: 1 }, color: 'error.main' }}
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </>
        ) : (
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                label="🔍 Tìm theo tên món"
                variant="outlined"
                size="small"
                fullWidth
                value={search}
                onChange={e => setSearch(e.target.value)}
                sx={{
                  bgcolor: 'white',
                  borderRadius: 2,
                  fontWeight: 500,
                  fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' }
                }}
                InputProps={{ style: { fontSize: '0.85rem' } }}
                InputLabelProps={{ style: { fontSize: '0.85rem' } }}
              />
            </Grid>
            <Grid item xs={12} md={9}>
              <Grid container spacing={2}>
                {/* Giá */}
                <Grid item xs={12} sm={6} md={4} lg={2}>
                  <Typography variant="caption" fontWeight={600} color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5, fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>
                    <AttachMoneyIcon fontSize="small" sx={{ mr: 0.5 }} /> Giá (VNĐ)
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="center">
                    <TextField
                      label="Từ"
                      type="number"
                      size="small"
                      value={priceMin}
                      onChange={e => setPriceMin(e.target.value)}
                      sx={{ width: { xs: '100%', sm: 70 }, bgcolor: 'white', borderRadius: 2 }}
                      InputProps={{ style: { fontSize: '0.8rem' } }}
                      InputLabelProps={{ style: { fontSize: '0.8rem' } }}
                    />
                    <TextField
                      label="Đến"
                      type="number"
                      size="small"
                      value={priceMax}
                      onChange={e => setPriceMax(e.target.value)}
                      sx={{ width: { xs: '100%', sm: 70 }, bgcolor: 'white', borderRadius: 2 }}
                      InputProps={{ style: { fontSize: '0.8rem' } }}
                      InputLabelProps={{ style: { fontSize: '0.8rem' } }}
                    />
                    <Slider
                      value={priceSlider}
                      min={0}
                      max={1000000}
                      step={10000}
                      onChange={(_, v) => setPriceSlider(v)}
                      valueLabelDisplay="auto"
                      sx={{ width: { xs: '100%', sm: 120 }, ml: { xs: 0, sm: 1 } }}
                    />
                  </Stack>
                </Grid>
                {/* Carb */}
                <Grid item xs={12} sm={6} md={4} lg={2}>
                  <Typography variant="caption" fontWeight={600} color="info.main" sx={{ display: 'flex', alignItems: 'center', mb: 0.5, fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>
                    <GrainIcon fontSize="small" sx={{ mr: 0.5 }} /> Carb (g)
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="center">
                    <TextField
                      label="Từ"
                      type="number"
                      size="small"
                      value={carbMin}
                      onChange={e => setCarbMin(e.target.value)}
                      sx={{ width: { xs: '100%', sm: 60 }, bgcolor: 'white', borderRadius: 2 }}
                      InputProps={{ style: { fontSize: '0.8rem' } }}
                      InputLabelProps={{ style: { fontSize: '0.8rem' } }}
                    />
                    <TextField
                      label="Đến"
                      type="number"
                      size="small"
                      value={carbMax}
                      onChange={e => setCarbMax(e.target.value)}
                      sx={{ width: { xs: '100%', sm: 60 }, bgcolor: 'white', borderRadius: 2 }}
                      InputProps={{ style: { fontSize: '0.8rem' } }}
                      InputLabelProps={{ style: { fontSize: '0.8rem' } }}
                    />
                    <Slider
                      value={carbSlider}
                      min={0}
                      max={100}
                      step={1}
                      onChange={(_, v) => setCarbSlider(v)}
                      valueLabelDisplay="auto"
                      sx={{ width: { xs: '100%', sm: 90 }, ml: { xs: 0, sm: 1 }, color: 'info.main' }}
                    />
                  </Stack>
                </Grid>
                {/* Fat */}
                <Grid item xs={12} sm={6} md={4} lg={2}>
                  <Typography variant="caption" fontWeight={600} color="warning.main" sx={{ display: 'flex', alignItems: 'center', mb: 0.5, fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>
                    <LocalPizzaIcon fontSize="small" sx={{ mr: 0.5 }} /> Fat (g)
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="center">
                    <TextField
                      label="Từ"
                      type="number"
                      size="small"
                      value={fatMin}
                      onChange={e => setFatMin(e.target.value)}
                      sx={{ width: { xs: '100%', sm: 60 }, bgcolor: 'white', borderRadius: 2 }}
                      InputProps={{ style: { fontSize: '0.8rem' } }}
                      InputLabelProps={{ style: { fontSize: '0.8rem' } }}
                    />
                    <TextField
                      label="Đến"
                      type="number"
                      size="small"
                      value={fatMax}
                      onChange={e => setFatMax(e.target.value)}
                      sx={{ width: { xs: '100%', sm: 60 }, bgcolor: 'white', borderRadius: 2 }}
                      InputProps={{ style: { fontSize: '0.8rem' } }}
                      InputLabelProps={{ style: { fontSize: '0.8rem' } }}
                    />
                    <Slider
                      value={fatSlider}
                      min={0}
                      max={100}
                      step={1}
                      onChange={(_, v) => setFatSlider(v)}
                      valueLabelDisplay="auto"
                      sx={{ width: { xs: '100%', sm: 90 }, ml: { xs: 0, sm: 1 }, color: 'warning.main' }}
                    />
                  </Stack>
                </Grid>
                {/* Protein */}
                <Grid item xs={12} sm={6} md={4} lg={2}>
                  <Typography variant="caption" fontWeight={600} color="success.main" sx={{ display: 'flex', alignItems: 'center', mb: 0.5, fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>
                    <FitnessCenterIcon fontSize="small" sx={{ mr: 0.5 }} /> Protein (g)
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="center">
                    <TextField
                      label="Từ"
                      type="number"
                      size="small"
                      value={proteinMin}
                      onChange={e => setProteinMin(e.target.value)}
                      sx={{ width: { xs: '100%', sm: 60 }, bgcolor: 'white', borderRadius: 2 }}
                      InputProps={{ style: { fontSize: '0.8rem' } }}
                      InputLabelProps={{ style: { fontSize: '0.8rem' } }}
                    />
                    <TextField
                      label="Đến"
                      type="number"
                      size="small"
                      value={proteinMax}
                      onChange={e => setProteinMax(e.target.value)}
                      sx={{ width: { xs: '100%', sm: 60 }, bgcolor: 'white', borderRadius: 2 }}
                      InputProps={{ style: { fontSize: '0.8rem' } }}
                      InputLabelProps={{ style: { fontSize: '0.8rem' } }}
                    />
                    <Slider
                      value={proteinSlider}
                      min={0}
                      max={100}
                      step={1}
                      onChange={(_, v) => setProteinSlider(v)}
                      valueLabelDisplay="auto"
                      sx={{ width: { xs: '100%', sm: 90 }, ml: { xs: 0, sm: 1 }, color: 'success.main' }}
                    />
                  </Stack>
                </Grid>
                {/* Calo */}
                <Grid item xs={12} sm={6} md={4} lg={2}>
                  <Typography variant="caption" fontWeight={600} color="error.main" sx={{ display: 'flex', alignItems: 'center', mb: 0.5, fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>
                    <WhatshotIcon fontSize="small" sx={{ mr: 0.5 }} /> Calo
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="center">
                    <TextField
                      label="Từ"
                      type="number"
                      size="small"
                      value={caloMin}
                      onChange={e => setCaloMin(e.target.value)}
                      sx={{ width: { xs: '100%', sm: 60 }, bgcolor: 'white', borderRadius: 2 }}
                      InputProps={{ style: { fontSize: '0.8rem' } }}
                      InputLabelProps={{ style: { fontSize: '0.8rem' } }}
                    />
                    <TextField
                      label="Đến"
                      type="number"
                      size="small"
                      value={caloMax}
                      onChange={e => setCaloMax(e.target.value)}
                      sx={{ width: { xs: '100%', sm: 60 }, bgcolor: 'white', borderRadius: 2 }}
                      InputProps={{ style: { fontSize: '0.8rem' } }}
                      InputLabelProps={{ style: { fontSize: '0.8rem' } }}
                    />
                    <Slider
                      value={caloSlider}
                      min={0}
                      max={1000}
                      step={10}
                      onChange={(_, v) => setCaloSlider(v)}
                      valueLabelDisplay="auto"
                      sx={{ width: { xs: '100%', sm: 90 }, ml: { xs: 0, sm: 1 }, color: 'error.main' }}
                    />
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Paper>
      <Box sx={{
        flex: 1,
        overflow: 'auto',
        minHeight: 0
      }}>
        {noMenu ? (
          <Box sx={{
            p: { xs: 2, sm: 3 },
            textAlign: 'center',
            bgcolor: '#e8f5e9',
            borderRadius: 2
          }}>
            <Typography
              variant="body1"
              color="primary"
              sx={{
                fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' },
                lineHeight: 1.4
              }}
            >
              Bạn hãy nhập yêu cầu vào khung chat (ví dụ: &quot;cần món bò&quot;, &quot;cơm gà&quot;, &quot;salad chay&quot;...) để AI gợi ý các món phù hợp!
            </Typography>
          </Box>
        ) : (
          <MenuGrid products={filteredProducts} />
        )}
      </Box>
    </Box>
  )
}

