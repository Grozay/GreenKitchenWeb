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
      title: '📋 Điều khoản sử dụng',
      icon: <PolicyIcon />,
      content: {
        sections: [
          {
            title: 'Điều khoản chung',
            items: [
              'Bằng việc sử dụng dịch vụ, bạn đồng ý tuân thủ các điều khoản này',
              'Chúng tôi có quyền thay đổi điều khoản mà không cần báo trước',
              'Mọi tranh chấp sẽ được giải quyết theo luật pháp Việt Nam'
            ]
          },
          {
            title: 'Quyền và nghĩa vụ',
            items: [
              'Bạn có quyền sử dụng dịch vụ một cách hợp pháp',
              'Không được sử dụng dịch vụ cho mục đích bất hợp pháp',
              'Bảo mật thông tin tài khoản của mình'
            ]
          }
        ]
      }
    },
    {
      id: 'panel2',
      title: '🔒 Chính sách bảo mật',
      icon: <SecurityIcon />,
      content: {
        sections: [
          {
            title: 'Thu thập thông tin',
            items: [
              'Thông tin cá nhân: tên, email, số điện thoại, địa chỉ',
              'Thông tin đơn hàng: món ăn, thời gian, địa điểm giao hàng',
              'Thông tin thanh toán: phương thức, số tiền (không lưu thông tin thẻ)'
            ]
          },
          {
            title: 'Sử dụng thông tin',
            items: [
              'Xử lý đơn hàng và giao hàng',
              'Gửi thông báo và cập nhật dịch vụ',
              'Cải thiện chất lượng dịch vụ và trải nghiệm người dùng'
            ]
          },
          {
            title: 'Bảo vệ thông tin',
            items: [
              'Mã hóa SSL/TLS cho mọi giao dịch',
              'Không chia sẻ thông tin với bên thứ ba',
              'Tuân thủ quy định GDPR và Luật Bảo vệ dữ liệu cá nhân'
            ]
          }
        ]
      }
    },
    {
      id: 'panel3',
      title: '🍽️ Chính sách đặt hàng',
      icon: <VerifiedUserIcon />,
      content: {
        sections: [
          {
            title: 'Quy trình đặt hàng',
            items: [
              'Chọn món ăn từ menu và thêm vào giỏ hàng',
              'Xác nhận địa chỉ giao hàng và thông tin thanh toán',
              'Nhận xác nhận đơn hàng qua email/SMS'
            ]
          },
          {
            title: 'Chính sách hủy đơn',
            items: [
              'Có thể hủy đơn hàng trong vòng 5 phút sau khi đặt',
              'Sau 5 phút, đơn hàng sẽ được xử lý và không thể hủy',
              'Liên hệ hotline để được hỗ trợ trong trường hợp đặc biệt'
            ]
          },
          {
            title: 'Thời gian giao hàng',
            items: [
              'Giao hàng trong vòng 30-60 phút tùy thuộc khoảng cách',
              'Thông báo trước 10 phút khi đến giao hàng',
              'Bồi thường nếu giao hàng trễ quá 15 phút so với cam kết'
            ]
          }
        ]
      }
    },
    {
      id: 'panel4',
      title: '💰 Chính sách thanh toán',
      icon: <GavelIcon />,
      content: {
        sections: [
          {
            title: 'Phương thức thanh toán',
            items: [
              'Tiền mặt khi nhận hàng',
              'Chuyển khoản ngân hàng',
              'Ví điện tử (MoMo, ZaloPay, VNPay)',
              'Thẻ tín dụng/ghi nợ (Visa, Mastercard)'
            ]
          },
          {
            title: 'Bảo mật thanh toán',
            items: [
              'Mã hóa SSL 256-bit cho mọi giao dịch',
              'Không lưu trữ thông tin thẻ tín dụng',
              'Tuân thủ tiêu chuẩn PCI DSS'
            ]
          },
          {
            title: 'Hoàn tiền và bồi thường',
            items: [
              'Hoàn tiền 100% nếu món ăn không đúng chất lượng',
              'Bồi thường nếu giao hàng trễ hoặc sai địa chỉ',
              'Xử lý hoàn tiền trong vòng 3-5 ngày làm việc'
            ]
          }
        ]
      }
    },
    {
      id: 'panel5',
      title: '🌟 Chính sách thành viên',
      icon: <PrivacyTipIcon />,
      content: {
        sections: [
          {
            title: 'Tích điểm thưởng',
            items: [
              'Tích 1 điểm cho mỗi 10,000 VNĐ chi tiêu',
              'Điểm có hiệu lực trong 12 tháng',
              'Đổi điểm lấy coupon giảm giá hoặc món ăn miễn phí'
            ]
          },
          {
            title: 'Hạng thành viên',
            items: [
              'ENERGY: Chi tiêu 0-2 triệu VNĐ/6 tháng',
              'VITALITY: Chi tiêu 2-5 triệu VNĐ/6 tháng',
              'RADIANCE: Chi tiêu trên 5 triệu VNĐ/6 tháng'
            ]
          },
          {
            title: 'Ưu đãi đặc biệt',
            items: [
              'Giảm giá theo hạng thành viên',
              'Ưu tiên giao hàng cho hạng cao',
              'Tặng món khai vị miễn phí cho hạng RADIANCE'
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
                Chính Sách Sử Dụng
              </Typography>
              <Typography variant="h6" sx={{
                opacity: 0.9,
                mb: 3
              }}>
                Thông tin chi tiết về quyền lợi và nghĩa vụ khi sử dụng dịch vụ
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Policy Summary */}
        <Grid size={12}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
                📋 Tóm tắt chính sách
              </Typography>
              <Grid container spacing={3}>
                {[
                  { icon: <CheckCircleIcon />, title: 'Đặt hàng dễ dàng', desc: 'Quy trình đơn giản, nhanh chóng' },
                  { icon: <SecurityIcon />, title: 'Bảo mật tuyệt đối', desc: 'Thông tin được mã hóa SSL/TLS' },
                  { icon: <VerifiedUserIcon />, title: 'Giao hàng đúng giờ', desc: 'Cam kết 30-60 phút' },
                  { icon: <PolicyIcon />, title: 'Hoàn tiền 100%', desc: 'Nếu không hài lòng về chất lượng' }
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
                📖 Chi tiết chính sách
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
                Lưu ý quan trọng
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
                      ⚠️ Điều khoản thay đổi
                    </Typography>
                    <Typography variant="body2" color="warning.dark">
                      Chúng tôi có quyền cập nhật chính sách này bất cứ lúc nào. 
                      Những thay đổi sẽ có hiệu lực ngay khi được đăng tải trên website.
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
                      ℹ️ Liên hệ hỗ trợ
                    </Typography>
                    <Typography variant="body2" color="info.dark">
                      Nếu bạn có thắc mắc về chính sách này, vui lòng liên hệ với chúng tôi qua:
                      Email: policy@greenkitchen.com hoặc Hotline: 1900-xxxx
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
                Phiên bản chính sách: v2.1
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Cập nhật lần cuối: 15/12/2024
              </Typography>
              <Typography variant="body2" color="text.secondary">
                © 2024 Green Kitchen. Tất cả quyền được bảo lưu.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
