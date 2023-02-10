import React, { useState } from 'react'
import { Avatar, Badge, Box, IconButton, Menu, Paper, Typography } from '@mui/material'
import { makeStyles, useTheme } from '@mui/styles'
import { Notifications } from '@mui/icons-material'
import { useHistory } from 'react-router-dom'
import findIcon from '../../helper/icons'

const useStyles = makeStyles(theme => ({}))
const NotificationArea = ({ tripData, tripid, currentNotifications, setRefreshNotif }) => {
  const classes = useStyles()
  const theme = useTheme()
  const history = useHistory()
  const [anchorElNotif, setAnchorElNotif] = useState(null)

  const openNotif = Boolean(anchorElNotif)

  const handleCloseNotif = event => {
    setAnchorElNotif(null)
  }
  const handleClickNotif = event => {
    setAnchorElNotif(event.currentTarget)
    setRefreshNotif(true)

    // setNotificationsToConsulted(tripData)
  }

  return (
    <>
      <Badge
        badgeContent={
          currentNotifications
            .filter(notification => notification.tripid === tripid)
            .filter(notification => notification.state === 1).length
        }
        color="secondary"
      >
        <IconButton
          aria-label="more"
          id="notif-button"
          aria-controls={openNotif ? 'notif-menu' : undefined}
          aria-expanded={openNotif ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleClickNotif}
          sx={{
            backgroundColor:
              tripData?.notifications?.filter(notification => notification.state === 1).length >
                0 && theme.palette.primary.ultraLight,
          }}
        >
          <Notifications />
        </IconButton>
      </Badge>
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
        <Paper sx={{ width: '470px', height: '740px', maxHeight: '740px' }}>
          <Box sx={{ padding: '30px' }}>
            <Typography
              component="h5"
              variant="h5"
              align="left"
              sx={{ fontFamily: 'Vesper Libre' }}
            >
              Mes Notifications
            </Typography>
          </Box>
          <Box sx={{ overflowY: 'auto', maxHeight: '630px' }}>
            {currentNotifications
              ?.slice(0)
              .reverse()
              .map(notification => (
                <Box
                  sx={{
                    width: '457px,',
                    height: '105px',
                    padding: '0 30px',
                    display: 'grid',
                    gridTemplate: '1fr / 110px 1fr',
                    alignItems: 'center',
                    marginBottom: '10px',
                    backgroundColor:
                      notification.state === 1 ? theme.palette.primary.ultraLight : 'white',
                    cursor: 'pointer',
                  }}
                  key={notification.content}
                  onClick={() => history.push(notification.url)}
                >
                  <Box sx={{ position: 'relative' }}>
                    <Avatar sx={{ width: 80, height: 80 }} />
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: '-5px ',
                        right: '30px',
                        padding: '6px',
                        borderRadius: '50px',
                        width: '32px',
                        height: '32px',
                        backgroundColor: theme.palette.primary.main,
                      }}
                    >
                      <Box
                        component="img"
                        src={findIcon(notification.icon, notification.eventType)}
                        sx={{
                          filter:
                            'brightness(0) saturate(100%) invert(92%) sepia(95%) saturate(0%) hue-rotate(332deg) brightness(114%) contrast(100%)',
                          width: '20px',
                          height: '20px',
                        }}
                      />
                    </Box>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '13px' }}>{notification.content}</Typography>
                    <Typography sx={{ fontSize: '13px', color: theme.palette.primary.main }}>
                      {notification.timer}
                    </Typography>
                  </Box>
                </Box>
              ))}
          </Box>
        </Paper>
      </Menu>
    </>
  )
}
export default NotificationArea
