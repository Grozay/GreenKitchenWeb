import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar'
import PersonIcon from '@mui/icons-material/Person'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import LockIcon from '@mui/icons-material/Lock'
import GoogleIcon from '@mui/icons-material/Google'

export default function AccountTab() {
  const addressCount = 3 // Có thể thay đổi thành 0 để test

  return (
    <Box sx={{
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <Grid container spacing={3}>
        {/* Phần 1: Thông tin cá nhân */}
        <Grid size={12}>
          <Card sx={{
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
              }}>
                <Typography variant="h6" component="h2" sx={{
                  fontWeight: 600,
                  color: '#2e7d32'
                }}>
                  Thông tin cá nhân
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    backgroundColor: '#4caf50',
                    '&:hover': { backgroundColor: '#45a049' }
                  }}
                >
                  Cập nhật
                </Button>
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#666' }}>
                      Họ tên:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 400 }}>
                      Nguyen Van A
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#666' }}>
                      Số điện thoại:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 400 }}>
                      0123456789
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#666' }}>
                      Email:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 400 }}>
                      nguyenvana@gmail.com
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#666' }}>
                      Giới tính:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 400 }}>
                      Nam
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#666' }}>
                      Ngày sinh:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 400 }}>
                      1/1/2000
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#666' }}>
                      Địa chỉ mặc định:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 400, textAlign: 'right' }}>
                      123 Đường ABC, Quận XYZ, TP HCM
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Phần 2: Hình đại diện và Số địa chỉ */}
        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
          <Card sx={{
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            height: '100%'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2
              }}>
                <Typography variant="h6" component="h3" sx={{
                  fontWeight: 600,
                  color: '#2e7d32'
                }}>
                  Hình đại diện
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: '#4caf50',
                    color: '#4caf50',
                    '&:hover': {
                      borderColor: '#45a049',
                      backgroundColor: 'rgba(76, 175, 80, 0.04)'
                    }
                  }}
                >
                  Thay đổi
                </Button>
              </Box>

              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}>
                <Avatar sx={{
                  width: 60,
                  height: 60,
                  backgroundColor: '#4caf50'
                }}>
                  <PersonIcon sx={{ fontSize: 30 }} />
                </Avatar>
                <Typography variant="body2" sx={{
                  color: '#4caf50',
                  fontWeight: 500
                }}>
                  Tải lên ảnh đại diện của bạn
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
          <Card sx={{
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            height: '100%'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2
              }}>
                <Typography variant="h6" component="h3" sx={{
                  fontWeight: 600,
                  color: '#2e7d32'
                }}>
                  Số địa chỉ
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: '#4caf50',
                    color: '#4caf50',
                    '&:hover': {
                      borderColor: '#45a049',
                      backgroundColor: 'rgba(76, 175, 80, 0.04)'
                    }
                  }}
                >
                  Quản lý
                </Button>
              </Box>

              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}>
                <LocationOnIcon sx={{
                  fontSize: 40,
                  color: '#4caf50'
                }} />
                <Box>
                  <Typography variant="h4" sx={{
                    fontWeight: 700,
                    color: '#4caf50',
                    lineHeight: 1
                  }}>
                    {addressCount}
                  </Typography>
                  <Typography variant="body2" sx={{
                    color: '#4caf50',
                    fontWeight: 500
                  }}>
                    {addressCount > 0 ? 'địa chỉ giao hàng' : 'Không có địa chỉ'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Phần 3: Mật khẩu và Liên kết tài khoản */}
        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
          <Card sx={{
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            height: '100%'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2
              }}>
                <Typography variant="h6" component="h3" sx={{
                  fontWeight: 600,
                  color: '#2e7d32'
                }}>
                  Mật khẩu
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: '#4caf50',
                    color: '#4caf50',
                    '&:hover': {
                      borderColor: '#45a049',
                      backgroundColor: 'rgba(76, 175, 80, 0.04)'
                    }
                  }}
                >
                  Đổi mật khẩu
                </Button>
              </Box>

              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}>
                <LockIcon sx={{
                  fontSize: 40,
                  color: '#4caf50'
                }} />
                <Box>
                  <Typography variant="body2" sx={{
                    color: '#4caf50',
                    fontWeight: 500
                  }}>
                    Thay đổi mật khẩu tài khoản
                  </Typography>
                  <Typography variant="body2" sx={{
                    color: '#666',
                    fontStyle: 'italic',
                    fontSize: '0.75rem'
                  }}>
                    Cập nhật lần cuối: 2 tuần trước
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
          <Card sx={{
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            height: '100%'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2
              }}>
                <Typography variant="h6" component="h3" sx={{
                  fontWeight: 600,
                  color: '#2e7d32'
                }}>
                  Liên kết Google
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(244, 67, 54, 0.04)'
                    }
                  }}
                >
                  Hủy liên kết
                </Button>
              </Box>

              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}>
                <GoogleIcon sx={{
                  fontSize: 40,
                  color: '#4caf50'
                }} />
                <Box>
                  <Typography variant="body2" sx={{
                    color: '#4caf50',
                    fontWeight: 500
                  }}>
                    Đăng nhập nhanh với Google
                  </Typography>
                  <Typography variant="body2" sx={{
                    color: '#4caf50',
                    fontWeight: 600,
                    fontSize: '0.875rem'
                  }}>
                    ✓ Đã liên kết
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
