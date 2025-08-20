// TrungQuanDev: https://youtube.com/@trungquandev
import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import LockIcon from '@mui/icons-material/Lock'
import Typography from '@mui/material/Typography'
import { Card as MuiCard } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import TextField from '@mui/material/TextField'
import Zoom from '@mui/material/Zoom'
import { useForm } from 'react-hook-form'
import {
  EMAIL_RULE_MESSAGE,
  PASSWORD_RULE_MESSAGE,
  FIELD_REQUIRED_MESSAGE,
  EMAIL_RULE,
  PASSWORD_RULE
} from '~/utils/validators'

function RegisterForm() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm()

  const submitRegister = (data) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(submitRegister)}>
      <Zoom in={true} style={{ transitionDelay: '200ms' }}>
        <MuiCard sx={{ minWidth: 380, maxWidth: 380, marginTop: '6em' }}>
          <Box sx={{
            margin: '1em',
            display: 'flex',
            justifyContent: 'center',
            gap: 1
          }}>
            <Typography variant="h4">Register</Typography>
          </Box>
          <Box sx={{ padding: '0 1em 1em 1em' }}>
            <Box sx={{ marginTop: '1em' }}>
              <TextField
                // autoComplete="nope"
                autoFocus
                fullWidth
                label="Enter Email..."
                type="text"
                variant="outlined"
                {...register('email', { required: FIELD_REQUIRED_MESSAGE, pattern: EMAIL_RULE })}
                error={!!errors.email}
                helperText={errors.email?.type === 'required' ? FIELD_REQUIRED_MESSAGE : errors.email?.type === 'pattern' ? EMAIL_RULE_MESSAGE : ''}
              />
            </Box>
            <Box sx={{ marginTop: '1em' }}>
              <TextField
                fullWidth
                label="Enter Password..."
                type="password"
                variant="outlined"
                {...register('password', { required: FIELD_REQUIRED_MESSAGE, pattern: PASSWORD_RULE })}
                error={!!errors.password}
                helperText={errors.password?.type === 'required' ? FIELD_REQUIRED_MESSAGE : errors.password?.type === 'pattern' ? PASSWORD_RULE_MESSAGE : ''}
              />
            </Box>
            <Box sx={{ marginTop: '1em' }}>
              <TextField
                fullWidth
                label="Enter Password Confirmation..."
                type="password"
                variant="outlined"
                {...register('password_confirmation', {
                  required: FIELD_REQUIRED_MESSAGE,
                  validate: (value) => {
                    if (value === watch('password')) return true
                    return 'Password Confirmation is not match'
                  }
                })}
                error={!!errors['password_confirmation']}
                helperText={errors['password_confirmation']?.type === 'required' ? FIELD_REQUIRED_MESSAGE : errors['password_confirmation']?.type === 'validate' ? 'Password Confirmation is not match' : ''}
              />
            </Box>
          </Box>
          <CardActions sx={{ padding: '0 1em 1em 1em' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
            >
              Register
            </Button>
          </CardActions>
          <Box sx={{ padding: '0 1em 1em 1em', textAlign: 'center' }}>
            <Typography>Already have an account?</Typography>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Typography sx={{ color: 'primary.main', '&:hover': { color: '#ffbb39' } }}>Log in!</Typography>
            </Link>
          </Box>
        </MuiCard>
      </Zoom>
    </form>
  )
}

export default RegisterForm
