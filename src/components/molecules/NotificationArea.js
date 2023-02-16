import React, { useContext, useState } from 'react'
import { Avatar, Badge, Box, IconButton, Menu, Paper, Typography } from '@mui/material'
import { makeStyles, useTheme } from '@mui/styles'
import { Notifications } from '@mui/icons-material'
import { useHistory } from 'react-router-dom'
import findIcon from '../../helper/icons'
import { SessionContext } from '../../contexts/session'
import { FirebaseContext } from '../../contexts/firebase'
import CustomAvatar from '../atoms/CustomAvatar'

const useStyles = makeStyles(theme => ({}))
const NotificationArea = ({ tripData, tripId, currentNotifications, setRefreshNotif }) => {
  const classes = useStyles()
  const theme = useTheme()
  const history = useHistory()
  const { setNotificationsToNewState, setNotificationsToNewStateOnTrip } =
    useContext(FirebaseContext)
  const { user } = useContext(SessionContext)
  const [anchorElNotif, setAnchorElNotif] = useState(null)

  const openNotif = Boolean(anchorElNotif)

  const handleCloseNotif = event => {
    setAnchorElNotif(null)
  }
  const handleClickNotif = event => {
    setAnchorElNotif(event.currentTarget)
    setRefreshNotif(true)
    setNotificationsToNewStateOnTrip(user, tripId, 2)
  }

  return (
    <>
      <Badge
        badgeContent={
          currentNotifications?.filter(
            notification => notification?.tripId === tripId && notification?.state === 1
          ).length
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
            '&:hover': {
              backgroundColor:
                tripData?.notifications?.filter(notification => notification.state === 1).length >
                  0 && theme.palette.primary.ultraLight,
            },
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
            // filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
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
        <Paper
          sx={{
            width: '470px',
            height: currentNotifications?.length > 0 ? '740px' : 'fit-content',
            maxHeight: currentNotifications?.length > 0 ? '740px' : 'fit-content',
          }}
        >
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
          <Box
            sx={{
              overflowY: currentNotifications?.length > 0 ? 'auto' : 'none',
              maxHeight: '630px',
            }}
          >
            {currentNotifications?.length > 0 ? (
              currentNotifications
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
                      position: 'relative',
                    }}
                    key={notification.content}
                    onClick={() => {
                      setNotificationsToNewState(user, 3, notification.id)
                      history.push(notification.url)
                    }}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <CustomAvatar width={80} height={80} peopleIds={[notification?.owner]} />
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
                    <Box sx={{ maxWdith: '280px' }}>
                      <Typography sx={{ fontSize: '13px' }}>{notification.content}</Typography>
                      <Typography sx={{ fontSize: '13px', color: theme.palette.primary.main }}>
                        {notification.timer}
                      </Typography>
                    </Box>
                    {notification.state !== 3 && (
                      <Box
                        sx={{
                          position: 'absolute',
                          right: '20px',
                          top: '50px',
                          width: '12px',
                          height: '12px',
                          borderRadius: '50px',
                          backgroundColor: theme.palette.primary.main,
                        }}
                      />
                    )}
                  </Box>
                ))
            ) : (
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <Typography
                  component="h5"
                  variant="h5"
                  align="left"
                  sx={{ fontFamily: 'Vesper Libre' }}
                >
                  Pas de notification
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Menu>
    </>
  )
}
export default NotificationArea
