import { useTheme } from '@mui/material/styles'

export default function TopBanner({ width = '325px', text = 'Free Shipping', duration = 18 }) {
  const theme = useTheme()
  text = 'Welcome back to Green Kitchen - Free Shipping for Order over 200k - Discount for members'
  const containerStyle = {
    width: typeof width === 'number' ? `${width}px` : width,
    overflow: 'hidden',
    background: theme.palette.primary.main,
    color: '#fff',
    borderRadius: 6,
    padding: '8px 12px',
    display: 'block',
    boxSizing: 'border-box'
  }

  return (
    <div style={containerStyle} role="status" aria-live="polite">
      <div style={{ overflow: 'hidden' }}>
        <div className="tk-marquee__inner" style={{ display: 'inline-flex', animation: `tk-scroll ${duration}s linear infinite` }}>
          <span className="tk-marquee__item" style={{ paddingRight: 32 }}>{text}</span>
          <span className="tk-marquee__item" style={{ paddingRight: 32 }}>{text}</span>
        </div>
      </div>
      <style>
        {`
          .tk-marquee__inner { white-space: nowrap; will-change: transform; }
          .tk-marquee__item { display: inline-block; color: #fff; font-weight: 600; }
          @keyframes tk-scroll {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
        `}
      </style>
    </div>
  )
}
