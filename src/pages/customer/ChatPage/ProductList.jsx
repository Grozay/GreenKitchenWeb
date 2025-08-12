import Grid from '@mui/material/Grid'
import ProductCard from './ProductCard'

export default function ProductList({ products }) {
  return (
    <Grid container spacing={2}>
      {products.map(product => (
        <Grid item xs={12} sm={6} key={product.id}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  )
}
