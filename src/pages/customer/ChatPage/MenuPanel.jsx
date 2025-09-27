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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ClearIcon from '@mui/icons-material/Clear'
import SearchIcon from '@mui/icons-material/Search'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Collapse from '@mui/material/Collapse'

// Component hiển thị grid sản phẩm tối ưu cho 40% width
function ProductGrid({ products }) {
  if (!products || products.length === 0) return null

  return (
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: {
        xs: '1fr', // Mobile: 1 cột (full width)
        sm: '1fr', // Small tablet: 1 cột
        md: '1fr', // Medium: 1 cột (40% width - tối ưu với 1 cột)
        lg: 'repeat(2, 1fr)', // Large: 2 cột (40% có thể fit 2 cột nhỏ)
        xl: 'repeat(2, 1fr)' // XL: 2 cột
      },
      gap: {
        xs: 1.5, // Giảm gap trên mobile
        sm: 2,
        md: 1.5, // Gap nhỏ hơn cho 40% width
        lg: 2
      },
      width: '100%',
      p: {
        xs: 1,
        sm: 1.5,
        md: 1, // Padding nhỏ hơn cho 40% width
        lg: 1.5
      }
    }}>
      {products.map((product, idx) => (
        <Box
          key={product.id || `product-${idx}`}
          sx={{
            width: '100%',
            height: 'auto',
            minHeight: { xs: 180, md: 160, lg: 180 }, // Chiều cao tối thiểu linh hoạt
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <ProductCard
            product={product}
            showActions
            variant="compact" // Sử dụng variant compact cho không gian nhỏ
            onAddToCart={() => console.log('Add to cart:', product)}
            onToggleFavorite={() => console.log('Toggle favorite:', product)}
            isFavorited={false}
          />
        </Box>
      ))}
    </Box>
  )
}

// Component Filter compact cho 40% width
function CompactFilter({
  label,
  icon,
  color,
  minValue,
  maxValue,
  sliderValue,
  onMinChange,
  onMaxChange,
  onSliderChange,
  sliderMin = 0,
  sliderMax = 100,
  sliderStep = 1,
  unit = '',
  disabled = false
}) {
  return (
    <Box sx={{
      p: { xs: 1, sm: 1.5 }, // Padding nhỏ hơn
      border: '1px solid',
      borderColor: disabled ? 'action.disabled' : 'divider',
      borderRadius: 2,
      bgcolor: disabled ? 'action.hover' : 'background.paper',
      opacity: disabled ? 0.6 : 1,
      transition: 'all 0.2s ease',
      '&:hover': disabled ? {} : {
        borderColor: color,
        transform: 'translateY(-1px)',
        boxShadow: `0 2px 8px ${color}15` // Shadow nhẹ hơn
      }
    }}>
      <Typography
        variant="caption"
        fontWeight={600}
        color={disabled ? 'text.disabled' : color}
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 1,
          fontSize: { xs: '0.7rem', sm: '0.75rem' } // Font size nhỏ hơn
        }}
      >
        {icon} {label}
      </Typography>

      <Stack spacing={1}>
        <Stack direction="row" spacing={0.5}> {/* Spacing nhỏ hơn */}
          <TextField
            size="small"
            placeholder="Min"
            type="number"
            value={minValue}
            onChange={(e) => onMinChange(e.target.value)}
            disabled={disabled}
            sx={{
              flex: 1,
              '& .MuiOutlinedInput-root': {
                fontSize: '0.7rem',
                height: '28px' // Chiều cao nhỏ hơn
              },
              '& .MuiOutlinedInput-input': {
                padding: '2px 6px' // Padding nhỏ hơn
              }
            }}
          />
          <TextField
            size="small"
            placeholder="Max"
            type="number"
            value={maxValue}
            onChange={(e) => onMaxChange(e.target.value)}
            disabled={disabled}
            sx={{
              flex: 1,
              '& .MuiOutlinedInput-root': {
                fontSize: '0.7rem',
                height: '28px'
              },
              '& .MuiOutlinedInput-input': {
                padding: '2px 6px'
              }
            }}
          />
        </Stack>

        <Slider
          value={sliderValue}
          min={sliderMin}
          max={sliderMax}
          step={sliderStep}
          onChange={(_, v) => onSliderChange(v)}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${value}${unit}`}
          disabled={disabled}
          sx={{
            color: color,
            height: 3, // Slider mỏng hơn
            '& .MuiSlider-thumb': {
              width: 14,
              height: 14
            },
            '& .MuiSlider-track': {
              height: 3
            },
            '& .MuiSlider-rail': {
              height: 3,
              opacity: 0.3
            }
          }}
        />
      </Stack>
    </Box>
  )
}

export default function MenuPanel({ menuProducts, chatMessages }) {
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Price filter
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [priceSlider, setPriceSlider] = useState([0, 1000000])

  // Nutrition filters
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
  const isSmallPanel = useMediaQuery(theme.breakpoints.down('lg')) // Detect nhỏ hơn lg (40% width context)

  // Đếm số filter đang active
  const activeFilters = useMemo(() => {
    let count = 0
    if (search) count++
    if (priceMin || priceMax || priceSlider[0] > 0 || priceSlider[1] < 1000000) count++
    if (fatMin || fatMax || fatSlider[0] > 0 || fatSlider[1] < 100) count++
    if (carbMin || carbMax || carbSlider[0] > 0 || carbSlider[1] < 100) count++
    if (proteinMin || proteinMax || proteinSlider[0] > 0 || proteinSlider[1] < 100) count++
    if (caloMin || caloMax || caloSlider[0] > 0 || caloSlider[1] < 1000) count++
    return count
  }, [search, priceMin, priceMax, priceSlider, fatMin, fatMax, fatSlider, carbMin, carbMax, carbSlider, proteinMin, proteinMax, proteinSlider, caloMin, caloMax, caloSlider])

  // Reset filters
  const resetFilters = () => {
    setSearch('')
    setPriceMin('')
    setPriceMax('')
    setPriceSlider([0, 1000000])
    setFatMin('')
    setFatMax('')
    setFatSlider([0, 100])
    setCarbMin('')
    setCarbMax('')
    setCarbSlider([0, 100])
    setProteinMin('')
    setProteinMax('')
    setProteinSlider([0, 100])
    setCaloMin('')
    setCaloMax('')
    setCaloSlider([0, 1000])
  }

  // Filter products
  const filteredProducts = useMemo(() => {
    if (!menuProducts || menuProducts.length === 0) return []

    return menuProducts.filter(product => {
      // Name filter
      const matchesName = !search ||
        product.title?.toLowerCase().includes(search.toLowerCase()) ||
        product.description?.toLowerCase().includes(search.toLowerCase())

      // Price filter
      const matchesPrice =
        (priceMin === '' || (typeof product.price === 'number' && product.price >= Number(priceMin))) &&
        (priceMax === '' || (typeof product.price === 'number' && product.price <= Number(priceMax))) &&
        (typeof product.price === 'number' ? (product.price >= priceSlider[0] && product.price <= priceSlider[1]) : true)

      // Nutrition filters
      const matchesFat =
        (fatMin === '' || (typeof product.fat === 'number' && product.fat >= Number(fatMin))) &&
        (fatMax === '' || (typeof product.fat === 'number' && product.fat <= Number(fatMax))) &&
        (typeof product.fat === 'number' ? (product.fat >= fatSlider[0] && product.fat <= fatSlider[1]) : true)

      const carb = typeof product.carb === 'number'
        ? product.carb
        : (
          typeof product.calories === 'number' &&
          typeof product.protein === 'number' &&
          typeof product.fat === 'number'
            ? Math.max(0, Math.round((product.calories - (product.protein * 4 + product.fat * 9)) / 4))
            : null
        )

      const matchesCarb =
        (carbMin === '' || (typeof carb === 'number' && carb >= Number(carbMin))) &&
        (carbMax === '' || (typeof carb === 'number' && carb <= Number(carbMax))) &&
        (typeof carb === 'number' ? (carb >= carbSlider[0] && carb <= carbSlider[1]) : true)

      const matchesProtein =
        (proteinMin === '' || (typeof product.protein === 'number' && product.protein >= Number(proteinMin))) &&
        (proteinMax === '' || (typeof product.protein === 'number' && product.protein <= Number(proteinMax))) &&
        (typeof product.protein === 'number' ? (product.protein >= proteinSlider[0] && product.protein <= proteinSlider[1]) : true)

      const calories = typeof product.calories === 'number'
        ? product.calories
        : (
          typeof product.carb === 'number' &&
          typeof product.protein === 'number' &&
          typeof product.fat === 'number'
            ? Math.round(product.carb * 4 + product.protein * 4 + product.fat * 9)
            : null
        )

      const matchesCalo =
        (caloMin === '' || (typeof calories === 'number' && calories >= Number(caloMin))) &&
        (caloMax === '' || (typeof calories === 'number' && calories <= Number(caloMax))) &&
        (typeof calories === 'number' ? (calories >= caloSlider[0] && calories <= caloSlider[1]) : true)

      return matchesName && matchesPrice && matchesFat && matchesCarb && matchesProtein && matchesCalo
    })
  }, [menuProducts, search, priceMin, priceMax, priceSlider, fatMin, fatMax, fatSlider, carbMin, carbMax, carbSlider, proteinMin, proteinMax, proteinSlider, caloMin, caloMax, caloSlider])

  const hasProducts = filteredProducts && filteredProducts.length > 0
  const hasMenuProducts = menuProducts && menuProducts.length > 0

  return (
    <Box sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: '#fafafa',
      overflow: 'hidden',
      // Tối ưu cho 40% width
      minWidth: { xs: '100%', md: 320, lg: 360 }, // Đảm bảo width tối thiểu
      maxWidth: '100%'
    }}>
      {/* Header - Tối ưu cho 40% width */}
      <Box sx={{
        p: { xs: 2, sm: 2, md: 1.5, lg: 2 }, // Padding linh hoạt
        bgcolor: 'white',
        borderBottom: '1px solid #e0e0e0',
        flexShrink: 0
      }}>
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{
            fontSize: { xs: '1.25rem', sm: '1.3rem', md: '1.1rem', lg: '1.25rem' }, // Font size linh hoạt
            color: 'primary.main',
            mb: { xs: 1, md: 0.5, lg: 1 },
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          🍽️ Food Suggestions
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: { xs: '0.875rem', md: '0.8rem', lg: '0.875rem' } }}
        >
          {hasProducts ? `${filteredProducts.length} dishes found` :
            hasMenuProducts ? 'Use filters to find suitable dishes' :
              'Chat to get food suggestions'}
        </Typography>
      </Box>

      {/* Search & Filters - Tối ưu cho không gian hẹp */}
      {hasMenuProducts && (
        <Box sx={{
          p: { xs: 2, sm: 2, md: 1.5, lg: 2 },
          bgcolor: 'white',
          borderBottom: '1px solid #e0e0e0',
          flexShrink: 0
        }}>
          {/* Search */}
          <TextField
            fullWidth
            placeholder="Search dishes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small" // Size nhỏ hơn cho 40% width
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: search && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setSearch('')}
                    edge="end"
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{
              mb: 1.5,
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                fontSize: { xs: '0.875rem', md: '0.8rem', lg: '0.875rem' }
              }
            }}
          />

          {/* Filter Toggle */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: showFilters ? 1.5 : 0,
            flexWrap: 'wrap',
            gap: 1
          }}>
            <Button
              startIcon={<FilterListIcon fontSize="small" />}
              endIcon={<ExpandMoreIcon fontSize="small" sx={{
                transform: showFilters ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease'
              }} />}
              onClick={() => setShowFilters(!showFilters)}
              variant="outlined"
              size="small"
              sx={{
                borderRadius: 2,
                fontSize: { xs: '0.75rem', md: '0.7rem', lg: '0.75rem' },
                minWidth: 'auto'
              }}
            >
              Filters {activeFilters > 0 && `(${activeFilters})`}
            </Button>

            {activeFilters > 0 && (
              <Button
                startIcon={<ClearIcon fontSize="small" />}
                onClick={resetFilters}
                size="small"
                color="error"
                variant="text"
                sx={{ fontSize: { xs: '0.75rem', md: '0.7rem', lg: '0.75rem' } }}
              >
                Clear
              </Button>
            )}
          </Box>

          {/* Filters - 2 bộ lọc mỗi hàng */}
          <Collapse in={showFilters} timeout="auto">
            <Box sx={{ pt: 1.5 }}>
              <Grid container spacing={{ xs: 1.5, sm: 2, md: 1, lg: 1.5 }}>
                {/* Hàng 1: Price & Calories */}
                <Grid item xs={12} sm={6}>
                  <CompactFilter
                    label="Price"
                    icon={<AttachMoneyIcon sx={{ mr: 0.5, fontSize: '0.9rem' }} />}
                    color="primary.main"
                    minValue={priceMin}
                    maxValue={priceMax}
                    sliderValue={priceSlider}
                    onMinChange={setPriceMin}
                    onMaxChange={setPriceMax}
                    onSliderChange={setPriceSlider}
                    sliderMin={0}
                    sliderMax={1000000}
                    sliderStep={10000}
                    unit="đ"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <CompactFilter
                    label="Calories"
                    icon={<WhatshotIcon sx={{ mr: 0.5, fontSize: '0.9rem' }} />}
                    color="error.main"
                    minValue={caloMin}
                    maxValue={caloMax}
                    sliderValue={caloSlider}
                    onMinChange={setCaloMin}
                    onMaxChange={setCaloMax}
                    onSliderChange={setCaloSlider}
                    sliderMin={0}
                    sliderMax={1000}
                    sliderStep={10}
                    unit="kcal"
                  />
                </Grid>

                {/* Hàng 2: Carb & Protein */}
                <Grid item xs={12} sm={6}>
                  <CompactFilter
                    label="Carbs"
                    icon={<GrainIcon sx={{ mr: 0.5, fontSize: '0.9rem' }} />}
                    color="info.main"
                    minValue={carbMin}
                    maxValue={carbMax}
                    sliderValue={carbSlider}
                    onMinChange={setCarbMin}
                    onMaxChange={setCarbMax}
                    onSliderChange={setCarbSlider}
                    unit="g"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <CompactFilter
                    label="Protein"
                    icon={<FitnessCenterIcon sx={{ mr: 0.5, fontSize: '0.9rem' }} />}
                    color="success.main"
                    minValue={proteinMin}
                    maxValue={proteinMax}
                    sliderValue={proteinSlider}
                    onMinChange={setProteinMin}
                    onMaxChange={setProteinMax}
                    onSliderChange={setProteinSlider}
                    unit="g"
                  />
                </Grid>

                {/* Hàng 3: Fat (chiếm 1 cột, cột còn lại để trống để cân bằng) */}
                <Grid item xs={12} sm={6}>
                  <CompactFilter
                    label="Fat"
                    icon={<LocalPizzaIcon sx={{ mr: 0.5, fontSize: '0.9rem' }} />}
                    color="warning.main"
                    minValue={fatMin}
                    maxValue={fatMax}
                    sliderValue={fatSlider}
                    onMinChange={setFatMin}
                    onMaxChange={setFatMax}
                    onSliderChange={setFatSlider}
                    unit="g"
                  />
                </Grid>

                {/* Cột trống để cân bằng layout */}
                <Grid item xs={12} sm={6} sx={{ display: { xs: 'none', sm: 'block' } }}>
                  {/* Có thể thêm filter mới ở đây sau này */}
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </Box>
      )}

      {/* Product Grid */}
      <Box sx={{
        flex: 1,
        overflow: 'auto',
        minHeight: 0
      }}>
        {!hasMenuProducts ? (
          // Empty state - no products from chat (tối ưu cho 40% width)
          <Box sx={{
            p: { xs: 3, sm: 4, md: 2, lg: 3 },
            textAlign: 'center',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Box sx={{ maxWidth: { xs: 300, md: 250, lg: 280 } }}>
              <Typography
                variant="h6"
                color="text.secondary"
                fontWeight={500}
                sx={{
                  mb: 2,
                  fontSize: { xs: '1.125rem', md: '1rem', lg: '1.125rem' }
                }}
              >
                🤖 No food suggestions yet
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  mb: 3,
                  fontSize: { xs: '0.875rem', md: '0.8rem', lg: '0.875rem' },
                  lineHeight: 1.4
                }}
              >
                Chat with AI to get food suggestions that suit your needs
              </Typography>
              <Box sx={{
                p: { xs: 2, md: 1.5, lg: 2 },
                bgcolor: 'primary.50',
                borderRadius: 2,
                border: '1px dashed',
                borderColor: 'primary.200'
              }}>
                <Typography
                  variant="body2"
                  color="primary.main"
                  sx={{
                    fontStyle: 'italic',  
                    fontSize: { xs: '0.75rem', md: '0.7rem', lg: '0.75rem' }
                  }}
                >
                  Example: &quot;I want low calorie dishes&quot;, &quot;Suggest Vietnamese food&quot;
                </Typography>
              </Box>
            </Box>
          </Box>
        ) : !hasProducts ? (
          // Empty state - no results after filtering (tối ưu cho 40% width)
          <Box sx={{
            p: { xs: 3, sm: 4, md: 2, lg: 3 },
            textAlign: 'center',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Box sx={{ maxWidth: { xs: 280, md: 240, lg: 280 } }}>
              <Typography
                variant="h6"
                color="text.secondary"
                fontWeight={500}
                sx={{
                  mb: 2,
                  fontSize: { xs: '1.125rem', md: '1rem', lg: '1.125rem' }
                }}
              >
                🔍 No dishes found
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  mb: 2,
                  fontSize: { xs: '0.875rem', md: '0.8rem', lg: '0.875rem' },
                  lineHeight: 1.4
                }}
              >
                No dishes match current filters
              </Typography>
              <Button
                variant="outlined"
                onClick={resetFilters}
                startIcon={<ClearIcon fontSize="small" />}
                size="small"
                sx={{
                  fontSize: { xs: '0.75rem', md: '0.7rem', lg: '0.75rem' },
                  borderRadius: 2
                }}
              >
                Clear filters
              </Button>
            </Box>
          </Box>
        ) : (
          // Product grid
          <ProductGrid products={filteredProducts} />
        )}
      </Box>
    </Box>
  )
}