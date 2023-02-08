import React, { useState } from 'react'
import { Avatar, Box, IconButton, Menu, Paper, Typography } from '@mui/material'
import { makeStyles, useTheme } from '@mui/styles'
import { Notifications } from '@mui/icons-material'

const useStyles = makeStyles(theme => ({}))
const NotificationArea = ({ tripData, currentNotifications }) => {
  const classes = useStyles()
  const theme = useTheme()
  const [anchorElNotif, setAnchorElNotif] = useState(null)

  const openNotif = Boolean(anchorElNotif)

  const handleCloseNotif = event => {
    setAnchorElNotif(null)
  }
  const handleClickNotif = event => {
    setAnchorElNotif(event.currentTarget)

    // setNotificationsToConsulted(tripData)
  }

  return (
    <>
      <IconButton
        aria-label="more"
        id="notif-button"
        aria-controls={openNotif ? 'notif-menu' : undefined}
        aria-expanded={openNotif ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClickNotif}
        sx={{
          backgroundColor:
            tripData?.notifications?.filter(notification => notification.state === 1).length > 0 &&
            theme.palette.primary.ultraLight,
        }}
      >
        <Notifications />
      </IconButton>
      <Menu
        anchorEl={anchorElNotif}
        id="notif-menu"
        open={openNotif}
        onClose={handleCloseNotif}
        onClick={handleCloseNotif}
        disableScrollLock
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Paper sx={{ width: '470px', height: '740px', maxHeight: '740px', overflowY: 'auto' }}>
          {currentNotifications?.map(notification => (
            <Box
              sx={{
                width: '457px,',
                height: '85px',
                padding: '0 30px',
                display: 'grid',
                gridTemplate: '1fr / 110px 1fr',
                alignItems: 'center',
                marginBottom: '30px',
                backgroundColor:
                  notification.state === 1 ? theme.palette.primary.ultraLight : 'white',
              }}
              key={notification.content}
            >
              <Avatar sx={{ width: 80, height: 80 }} />
              <Box>
                <Typography sx={{ fontSize: '13px' }}>{notification.content}</Typography>
                <Typography sx={{ fontSize: '13px', color: theme.palette.primary.main }}>
                  {notification.timer}
                </Typography>
              </Box>
            </Box>
          ))}
        </Paper>
      </Menu>
    </>
  )
}
export default NotificationArea
