import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'

const RememberMeCheckbox = ({ checked, onChange, ...props }) => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          onChange={onChange}
          color="primary"
          size="small"
        />
      }
      label="Remember me"
      sx={{
        '& .MuiFormControlLabel-label': {
          fontSize: '0.875rem',
          color: 'text.secondary'
        }
      }}
      {...props}
    />
  )
}

export default RememberMeCheckbox
