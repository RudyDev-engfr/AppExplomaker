import React, { useState } from 'react'
import Badge from '@mui/material/Badge'
import IconButton from '@mui/material/IconButton'
import {
  Avatar,
  Box,
  Paper,
  Grow,
  ClickAwayListener,
  MenuItem,
  MenuList,
  Typography,
  Popper,
  useTheme,
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import { v4 as uuidv4 } from 'uuid'
import { Notifications } from '@mui/icons-material'

const useStyles = makeStyles(theme => ({
  notifsBtn: {
    backgroundColor: theme.palette.primary.ultraLight,
    transform: 'rotate(-15deg)',
    '&:hover': {
      backgroundColor: theme.palette.primary.ultraLight,
    },
  },
  notifItem: {
    whiteSpace: 'normal',
  },
}))

const NotificationButton = ({ data }) => {
  const classes = useStyles()
  const theme = useTheme()
  const anchorRef = React.useRef(null)
  const [isNotificationsMenuOpen, setIsNotificationMenuOpen] = useState(false)

  /*   let nbUnread = 0

  data.forEach(element => {
    if (element.unread) {
      nbUnread += 1
    }
  }) */

  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return
    }

    setIsNotificationMenuOpen(false)
  }

  const handleListKeyDown = event => {
    if (event.key === 'Tab') {
      event.preventDefault()
      setIsNotificationMenuOpen(false)
    }
  }

  return (
    <Box position="absolute" top="20px" right="20px" zIndex="20">
      <Badge badgeContent={/* nbUnread */ 0} color="secondary" overlap="circular">
        <IconButton
          ref={anchorRef}
          onClick={() => setIsNotificationMenuOpen(!isNotificationsMenuOpen)}
          className={classes.notifsBtn}
          color="primary"
          size="large"
          disabled
          sx={{ backgroundColor: `${theme.palette.grey.bd}!important` }}
        >
          <Notifications />
        </IconButton>
      </Badge>
      <Popper
        open={isNotificationsMenuOpen}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        placement="bottom-end"
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} sx={{ transformOrigin: 'right top', maxWidth: '400px' }}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={isNotificationsMenuOpen} onKeyDown={handleListKeyDown}>
                  {data.map(notif => (
                    <MenuItem key={uuidv4()} className={classes.notifItem}>
                      <Avatar src={notif.avatar} />
                      <Box ml={2}>
                        <Typography variant="body2">{notif.message}</Typography>
                        <Typography variant="body2">{notif.createdAt}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Box>
  )
}

export default NotificationButton
