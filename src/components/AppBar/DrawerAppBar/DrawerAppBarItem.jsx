import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { Link } from 'react-router-dom'

const DrawerAppBarItem = ({ toggleDrawer, navItemStyle, t, label, path }) => {
  return (
    <>
      <ListItem disablePadding>
        <ListItemButton
          component={Link}
          to={path}
          onClick={toggleDrawer(false)}
          sx={navItemStyle}
        >
          <ListItemText sx={{ color: (theme) => theme.palette.text.primary }} primary={t('navBar.' + label)} />
        </ListItemButton>
      </ListItem>
    </>
  )
}

export default DrawerAppBarItem