import { useState } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import PolicyIcon from '@mui/icons-material/Policy'
import SecurityIcon from '@mui/icons-material/Security'
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip'
import GavelIcon from '@mui/icons-material/Gavel'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WarningIcon from '@mui/icons-material/Warning'
import InfoIcon from '@mui/icons-material/Info'

export default function PolicyTab({ customerDetails, setCustomerDetails }) {
  const [expandedAccordion, setExpandedAccordion] = useState('panel1')

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedAccordion(isExpanded ? panel : false)
  }

  const policies = [
    {
      id: 'panel1',
      title: '📋 Terms of Use',
      icon: <PolicyIcon />,
      content: {
        sections: [
          {
            title: 'General Terms',
            items: [
              'By using our service, you agree to comply with these terms',
              'We reserve the right to change terms without prior notice',
              'All disputes will be resolved according to Vietnamese law'
            ]
          },
          {
            title: 'Rights and Obligations',
            items: [
              'You have the right to use the service legally',
              'Service may not be used for illegal purposes',
              'Keep your account information secure'
            ]
          }
        ]
      }
    },
    {
      id: 'panel2',
      title: '🔒 Privacy Policy',
      icon: <SecurityIcon />,
      content: {
        sections: [
          {
            title: 'Information Collection',
            items: [
              'Personal information: name, email, phone number, address',
              'Order information: dishes, time, delivery location',
              'Payment information: method, amount (card information not stored)'
            ]
          },
          {
            title: 'Information Usage',
            items: [
              'Process orders and deliveries',
              'Send notifications and service updates',
              'Improve service quality and user experience'
            ]
          },
          {
            title: 'Information Protection',
            items: [
              'SSL/TLS encryption for all transactions',
              'No information sharing with third parties',
              'Compliance with GDPR and Personal Data Protection Law'
            ]
          }
        ]
      }
    },
    {
      id: 'panel3',
      title: '🍽️ Ordering Policy',
      icon: <VerifiedUserIcon />,
      content: {
        sections: [
          {
            title: 'Ordering Process',
            items: [
              'Select dishes from menu and add to cart',
              'Confirm delivery address and payment information',
              'Receive order confirmation via email/SMS'
            ]
          },
          {
            title: 'Cancellation Policy',
            items: [
              'Orders can be cancelled within 5 minutes after placing',
              'After 5 minutes, orders will be processed and cannot be cancelled',
              'Contact hotline for support in special cases'
            ]
          },
          {
            title: 'Delivery Time',
            items: [
              'Delivery within 30-60 minutes depending on distance',
              'Notification 10 minutes before delivery',
              'Compensation if delivery is more than 15 minutes late'
            ]
          }
        ]
      }
    },
    {
      id: 'panel4',
      title: '💰 Payment Policy',
      icon: <GavelIcon />,
      content: {
        sections: [
          {
            title: 'Payment Methods',
            items: [
              'Cash on delivery',
              'Bank transfer',
              'E-wallets (MoMo, ZaloPay, VNPay)',
              'Credit/debit cards (Visa, Mastercard)'
            ]
          },
          {
            title: 'Payment Security',
            items: [
              '256-bit SSL encryption for all transactions',
              'Credit card information not stored',
              'Compliance with PCI DSS standards'
            ]
          },
          {
            title: 'Refunds and Compensation',
            items: [
              '100% refund if food quality is not as expected',
              'Compensation for late delivery or wrong address',
              'Refund processing within 3-5 business days'
            ]
          }
        ]
      }
    },
    {
      id: 'panel5',
      title: '🌟 Membership Policy',
      icon: <PrivacyTipIcon />,
      content: {
        sections: [
          {
            title: 'Reward Points',
            items: [
              'Earn 1 point for every 10,000 VND spent',
              'Points valid for 12 months',
              'Redeem points for discount coupons or free dishes'
            ]
          },
          {
            title: 'Membership Tiers',
            items: [
              'ENERGY: Spend 0-2 million VND/6 months',
              'VITALITY: Spend 2-5 million VND/6 months',
              'RADIANCE: Spend over 5 million VND/6 months'
            ]
          },
          {
            title: 'Special Benefits',
            items: [
              'Discounts based on membership tier',
              'Priority delivery for higher tiers',
              'Free appetizer for RADIANCE tier'
            ]
          }
        ]
      }
    }
  ]

  return (
    <Box sx={{
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <Grid container spacing={3}>
        {/* Header Section */}
        <Grid size={12}>
          <Card sx={{
            background: 'linear-gradient(135deg, #9C27B0 0%, #673AB7 100%)',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(156, 39, 176, 0.3)',
            textAlign: 'center',
            color: 'white'
          }}>
            <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
              <PolicyIcon sx={{ fontSize: '80px', mb: 2, opacity: 0.9 }} />
              <Typography variant="h4" sx={{
                fontWeight: 'bold',
                mb: 2,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                Terms of Use
              </Typography>
              <Typography variant="h6" sx={{
                opacity: 0.9,
                mb: 3
              }}>
                Detailed information about rights and obligations when using the service
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Policy Summary */}
        <Grid size={12}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
                📋 Policy Summary
              </Typography>
              <Grid container spacing={3}>
                {[
                  { icon: <CheckCircleIcon />, title: 'Easy Ordering', desc: 'Simple and fast process' },
                  { icon: <SecurityIcon />, title: 'Absolute Security', desc: 'Information encrypted with SSL/TLS' },
                  { icon: <VerifiedUserIcon />, title: 'On-time Delivery', desc: '30-60 minutes commitment' },
                  { icon: <PolicyIcon />, title: '100% Refund', desc: 'If not satisfied with quality' }
                ].map((item, index) => (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Box sx={{ color: 'primary.main', mb: 1 }}>
                        {item.icon}
                      </Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.desc}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Detailed Policies */}
        <Grid size={12}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
                📖 Policy Details
              </Typography>
              
              {policies.map((policy) => (
                <Accordion
                  key={policy.id}
                  expanded={expandedAccordion === policy.id}
                  onChange={handleAccordionChange(policy.id)}
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                    '&:before': { display: 'none' },
                    '&.Mui-expanded': {
                      boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      backgroundColor: expandedAccordion === policy.id ? 'primary.light' : 'transparent',
                      borderRadius: 2,
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.04)'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ color: 'primary.main' }}>
                        {policy.icon}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {policy.title}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 3 }}>
                    <Grid container spacing={3}>
                      {policy.content.sections.map((section, sectionIndex) => (
                        <Grid size={{ xs: 12, sm: 6 }} key={sectionIndex}>
                          <Box sx={{
                            p: 3,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 2,
                            height: '100%'
                          }}>
                            <Typography variant="h6" sx={{ 
                              fontWeight: 600, 
                              mb: 2, 
                              color: 'primary.main',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1
                            }}>
                              <InfoIcon fontSize="small" />
                              {section.title}
                            </Typography>
                            <List dense>
                              {section.items.map((item, itemIndex) => (
                                <ListItem key={itemIndex} sx={{ px: 0 }}>
                                  <ListItemIcon sx={{ minWidth: 32 }}>
                                    <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={item}
                                    primaryTypographyProps={{
                                      variant: 'body2',
                                      color: 'text.primary'
                                    }}
                                  />
                                </ListItem>
                              ))}
                            </List>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Important Notices */}
        <Grid size={12}>
          <Card sx={{ 
            borderRadius: 3, 
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            border: '2px solid',
            borderColor: 'warning.main'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 600, 
                mb: 3, 
                textAlign: 'center',
                color: 'warning.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1
              }}>
                <WarningIcon />
                Important Notes
              </Typography>
              
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{
                    p: 3,
                    backgroundColor: 'warning.light',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'warning.main'
                  }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'warning.dark' }}>
                      ⚠️ Terms Changes
                    </Typography>
                    <Typography variant="body2" color="warning.dark">
                      We reserve the right to update this policy at any time. 
                      Changes will take effect immediately upon posting on the website.
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{
                    p: 3,
                    backgroundColor: 'info.light',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'info.main'
                  }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'info.dark' }}>
                      ℹ️ Contact Support
                    </Typography>
                    <Typography variant="body2" color="info.dark">
                      If you have questions about this policy, please contact us via:
                      Email: policy@greenkitchen.com or Hotline: 1900-xxxx
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Policy Version and Last Updated */}
        <Grid size={12}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Policy Version: v2.1
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Last Updated: 15/12/2024
              </Typography>
              <Typography variant="body2" color="text.secondary">
                © 2024 Green Kitchen. All rights reserved.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
