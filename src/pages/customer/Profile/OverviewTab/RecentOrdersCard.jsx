import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'
import Avatar from '@mui/material/Avatar'
import Grid from '@mui/material/Grid'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import MuiLink from '@mui/material/Link'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import Divider from '@mui/material/Divider'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { selectCurrentLanguage } from '~/redux/translations/translationsSlice'

export default function RecentOrdersCard({ recentOrders, getStatusLabel, getStatusColor, formatVND }) {
  const { t } = useTranslation()
  const currentLang = useSelector(selectCurrentLanguage)
  
  return (
    <Card sx={{ borderRadius: 2, boxShadow: 2, minHeight: 280 }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocalShippingIcon sx={{ fontSize: 20, mr: 0.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {t('profile.overviewTab.recentOrders.title')}
            </Typography>
          </Box>
          <Button
            component={Link}
            to="/profile/order-history"
            size="medium"
            variant="text"
            color="primary"
            sx={{
              px: 0.5,
              minWidth: 'auto',
              color: 'primary.main',
              '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
              '&:visited': { color: 'primary.main' }
            }}
          >
            {t('profile.overviewTab.recentOrders.viewAll')}
          </Button>
        </Box>
        {recentOrders.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {recentOrders.map(o => (
              <Box 
                key={o.id}
                sx={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  p: 1
                }}>
                <Grid size={8}>
                  <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{t('profile.overviewTab.recentOrders.orderLabel')}: #{o.id}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t('profile.overviewTab.recentOrders.orderDate')}: {new Date(o.createdAt || o.deliveryTime).toLocaleDateString(currentLang === 'vi' ? 'vi-VN' : 'en-US')}
                    </Typography>
                  </Box>
                  {/* Items preview: show up to 2 product images + names */}
                  {!!(o.orderItems && o.orderItems.length) && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                      {o.orderItems.slice(0, 2).map((item, idx) => (
                        <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, maxWidth: 180 }}>
                          <Avatar
                            src={item.image}
                            alt={item.title}
                            variant="rounded"
                            sx={{ width: 22, height: 22, backgroundColor: 'primary.main' }}
                          >
                            {!item.image && (item.itemType === 'MENU_MEAL' ? 'M' : 'C')}
                          </Avatar>
                          <Typography
                            variant="caption"
                            sx={{
                              display: '-webkit-box',
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              maxWidth: 150
                            }}
                            title={item.title}
                          >
                            {item.title || t('profile.overviewTab.recentOrders.defaultItemName')}
                          </Typography>
                        </Box>
                      ))}
                      {o.orderItems.length > 2 && (
                        <Typography variant="caption" color="text.secondary">
                          +{o.orderItems.length - 2} {t('profile.overviewTab.recentOrders.moreItems')}
                        </Typography>
                      )}
                    </Box>
                  )}
                </Grid>

                <Grid size={4} sx={{ ml: 'auto', textAlign: 'right' }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: 'success.main', whiteSpace: 'nowrap', textAlign: 'right', minWidth: 96 }}
                  >
                    {formatVND(o.totalAmount)}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 0.5 }}>
                    <MuiLink
                      component={Link}
                      to={`/profile/order-history/${o.id}`}
                      underline="hover"
                      color="primary"
                      sx={{
                        fontSize: 12,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.25,
                        color: 'primary.main',
                        '&:visited': { color: 'primary.main' }
                      }}
                    >
                      {t('profile.overviewTab.recentOrders.viewDetails')}
                      <KeyboardArrowRightIcon sx={{ fontSize: 14, ml: 0.25 }} />
                    </MuiLink>
                  </Box>
                </Grid>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">{t('profile.overviewTab.recentOrders.noOrders')}</Typography>
        )}
      </CardContent>
    </Card>
  )
}
