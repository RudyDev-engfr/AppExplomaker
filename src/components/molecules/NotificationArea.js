import React, { useContext, useState } from 'react'
import {
  Avatar,
  Badge,
  Box,
  Drawer,
  IconButton,
  Menu,
  Paper,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { makeStyles, useTheme } from '@mui/styles'
import { Notifications } from '@mui/icons-material'
import { isSameDay } from 'date-fns'
import { useHistory } from 'react-router-dom'
import findIcon from '../../helper/icons'
import { SessionContext } from '../../contexts/session'
import { FirebaseContext } from '../../contexts/firebase'
import CustomAvatar from '../atoms/CustomAvatar'
import kenya1 from '../../images/inherit/Kenya 1.png'
import { stringToDate } from '../../helper/functions'
import { TripContext } from '../../contexts/trip'

const useStyles = makeStyles(theme => ({
  notificationImage: {
    width: '60px',
    height: '60px',
    borderRadius: '50px',
  },
  badgeRoot: {},
}))
const NotificationArea = ({
  tripId,
  currentNotifications,
  isMyTrips = false,
  setRefreshNotif,
  days,
  isChatOpen,
  setIsChatOpen,
  setSelectedDateOnPlanning,
}) => {
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
    setRefreshNotif(true)
    setNotificationsToNewStateOnTrip(user, tripId, 2)
    if (!isMyTrips) {
      if (isChatOpen === 'notifications') {
        setIsChatOpen('')
      } else {
        setIsChatOpen('notifications')
      }
    }
    if (isMyTrips) {
      setAnchorElNotif(event.currentTarget)
    }
  }

  if (isMyTrips) {
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
            backgroundColor: isMyTrips
              ? user?.notifications?.filter(notification => notification.state === 1).length > 0
                ? theme.palette.primary.main
                : 'white'
              : user?.notifications?.filter(
                  notification => notification?.state === 1 && notification?.tripId === tripId
                ).length > 0
              ? theme.palette.primary.main
              : 'white',
            '&:hover': {
              backgroundColor: isMyTrips
                ? user?.notifications?.filter(notification => notification.state === 1).length > 0
                  ? theme.palette.primary.main
                  : 'white'
                : user?.notifications?.filter(
                    notification => notification?.state === 1 && notification?.tripId === tripId
                  ).length > 0
                ? theme.palette.primary.main
                : 'white',
            },
          }}
        >
          <Badge
            badgeContent={
              isMyTrips
                ? user.notifications?.filter(notification => notification?.state === 1).length
                : user.notifications?.filter(
                    notification => notification?.tripId === tripId && notification?.state === 1
                  ).length
            }
            color="secondary"
          >
            <Notifications
              sx={{
                color: isMyTrips
                  ? user?.notifications?.filter(notification => notification.state === 1).length >
                      0 && 'white'
                  : user?.notifications?.filter(
                      notification => notification.state === 1 && notification.tripId === tripId
                    ).length > 0 && 'white',
              }}
            />
          </Badge>
        </IconButton>
        <Menu
          anchorEl={anchorElNotif}
          id="notif-menu"
          open={openNotif}
          onClose={handleCloseNotif}
          onClick={handleCloseNotif}
          disableScrollLock
          MenuListProps={{
            sx: {
              paddingBottom: '0',
            },
          }}
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
              height: 'fit-content',
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
                  .map((notification, index) => (
                    <Box
                      sx={{
                        width: '457px,',
                        height: '105px',
                        padding: '0 30px',
                        display: 'grid',
                        gridTemplate: '1fr / 110px 1fr',
                        alignItems: 'center',
                        backgroundColor:
                          notification.state === 1 ? theme.palette.primary.ultraLight : 'white',
                        cursor: 'pointer',
                        position: 'relative',
                        borderBottom: '1px solid lightgrey',
                        borderTop: index === 0 && '1px solid lightgrey',
                      }}
                      key={notification.id}
                      onClick={() => {
                        if (notification.id) {
                          setNotificationsToNewState(user, 3, notification.id)
                        }
                        history.push(notification.url)
                        if (notification?.eventType && !isMyTrips) {
                          days.forEach(day => {
                            if (
                              isSameDay(
                                stringToDate(notification.startTime, 'yyyy-MM-dd HH:mm'),
                                day
                              )
                            ) {
                              setSelectedDateOnPlanning(day)
                            }
                          })
                        }
                      }}
                    >
                      {isMyTrips ? (
                        <Box sx={{ position: 'relative' }}>
                          <Box sx={{ height: '60px', width: '60px' }}>
                            <img
                              src={notification.image ? `${notification?.image}` : kenya1}
                              alt="trip main pic"
                              className={classes.notificationImage}
                            />
                          </Box>
                          {notification.redPings && (
                            <Box
                              sx={{
                                position: 'absolute',
                                bottom: '-5px ',
                                right: '30px',
                                padding: '6px',
                                borderRadius: '50px',
                                width: '32px',
                                height: '32px',
                                backgroundColor: theme.palette.secondary.main,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              <Typography sx={{ fontSize: '20px', color: 'white' }}>
                                {notification.redPings}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      ) : (
                        <Box sx={{ position: 'relative' }}>
                          <CustomAvatar
                            isNotification
                            width={60}
                            height={60}
                            peopleIds={[notification?.owner?.id]}
                          />
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
                            {notification.icon ? (
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
                            ) : (
                              <Notifications sx={{ color: 'white', fontSize: '20px' }} />
                            )}
                          </Box>
                        </Box>
                      )}

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
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    paddingBottom: '15px',
                  }}
                >
                  <Typography>Pas de notification</Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Menu>
      </>
    )
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
          color: isChatOpen === 'notifications' ? theme.palette.primary.main : 'white',
          backgroundColor: isChatOpen === 'notifications' ? 'white' : theme.palette.primary.main,
          '&:hover': {
            color: isChatOpen === 'notifications' ? theme.palette.primary.main : 'white',
            backgroundColor: isChatOpen === 'notifications' ? 'white' : theme.palette.primary.main,
          },
          width: '42px',
          height: '42px',
        }}
      >
        <Badge
          badgeContent={
            isMyTrips
              ? user.notifications?.filter(
                  notification => notification?.state === 1 && !notification.tripId
                ).length
              : user.notifications?.filter(
                  notification => notification?.tripId === tripId && notification?.state === 1
                ).length
          }
          color="secondary"
          classes={{ badge: classes.badgeRoot }}
        >
          <Notifications />
        </Badge>
      </IconButton>
      <NotificationAreaDrawer
        openNotif={openNotif}
        anchorElNotif={anchorElNotif}
        setAnchorElNotif={setAnchorElNotif}
        currentNotifications={currentNotifications}
        setNotificationsToNewState={setNotificationsToNewState}
        user={user}
        isMyTrips={isMyTrips}
        days={days}
        setSelectedDateOnPlanning={setSelectedDateOnPlanning}
        isChatOpen={isChatOpen}
        setIsChatOpen={setIsChatOpen}
      />
    </>
  )
}

const NotificationAreaDrawer = ({
  openNotif,
  anchorElNotif,
  setAnchorElNotif,
  currentNotifications,
  setNotificationsToNewState,
  user,
  isMyTrips,
  days,
  setSelectedDateOnPlanning,
  isChatOpen,
  setIsChatOpen,
}) => {
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  const history = useHistory()
  const { setCurrentEventType, setCurrentEvent, setCurrentView, setNotificationsToNewStateOnTrip } =
    useContext(TripContext)

  const handleCloseNotif = event => {
    setAnchorElNotif(null)
    setIsChatOpen('')
  }

  const onClickNotif = notification => {
    history.push(notification.url)
    if (notification?.startTime || notification?.event?.propositions[0]?.startTime) {
      days.forEach(day => {
        const tempTime = notification.startTime || notification.event.propositions[0].startTime
        console.log('tempTime', tempTime)
        if (isSameDay(stringToDate(tempTime, 'yyyy-MM-dd HH:mm'), day)) {
          setSelectedDateOnPlanning(day)
        }
      })
    }
    if (notification?.event?.type) {
      setCurrentEventType(notification.event?.type)
    } else {
      setCurrentEventType(notification?.eventType)
    }
    setCurrentEvent(notification.event)
    // setCurrentEventId(notification.event.id)
    if (notification.event.isSurvey) {
      setCurrentView('survey')
      console.log('je suis un survey')
    } else {
      setCurrentView('preview')
      console.log('je suis un preview')
    }
    if (notification.id) {
      setNotificationsToNewStateOnTrip(user, 3, notification.id)
    }
  }

  return (
    <Drawer
      position="fixed"
      anchor="right"
      id="notif-menu"
      open={isChatOpen === 'notifications'}
      onClose={handleCloseNotif}
      onClick={handleCloseNotif}
      disableScrollLock
      MenuListProps={{
        sx: {
          paddingBottom: '0',
        },
      }}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: 'visible',
          // filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      {!matchesXs && (
        <Box
          sx={{
            height: '65px',
            borderBottom: '1px solid white',
            width: '100%',
            backgroundColor: theme.palette.primary.main,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingLeft: '30px',
            paddingTop: '10px',
            color: theme.palette.secondary.contrastText,
          }}
        >
          <Typography
            component="h4"
            variant="h4"
            align="center"
            sx={{
              fontFamily: 'Vesper Libre',
              fontWeight: 400,
              fontSize: '28px',
              lineHeight: 1.17,
            }}
          >
            Mes Notifications
          </Typography>
        </Box>
      )}
      <Paper
        sx={{
          width: '500px',
          borderRadius: 'unset',
          boxShadow: 'none',
        }}
      >
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
              .map((notification, index) => (
                <Box
                  sx={{
                    width: '457px,',
                    height: '105px',
                    padding: '0 30px',
                    display: 'grid',
                    gridTemplate: '1fr / 110px 1fr',
                    alignItems: 'center',
                    backgroundColor:
                      notification.state === 1 ? theme.palette.primary.ultraLight : 'white',
                    cursor: 'pointer',
                    position: 'relative',
                    borderBottom: '1px solid lightgrey',
                    borderTop: index === 0 && '1px solid lightgrey',
                  }}
                  key={notification.id}
                  onClick={() => onClickNotif(notification)}
                >
                  {isMyTrips ? (
                    <Box sx={{ position: 'relative' }}>
                      <Box sx={{ height: '60px', width: '60px' }}>
                        <img
                          src={notification.image ? `${notification?.image}` : kenya1}
                          alt="trip main pic"
                          className={classes.notificationImage}
                        />
                      </Box>
                      {notification.redPings && (
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: '-5px ',
                            right: '30px',
                            padding: '6px',
                            borderRadius: '50px',
                            width: '32px',
                            height: '32px',
                            backgroundColor: theme.palette.secondary.main,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Typography sx={{ fontSize: '20px', color: 'white' }}>
                            {notification.redPings}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  ) : (
                    <Box sx={{ position: 'relative' }}>
                      <CustomAvatar
                        isNotification
                        width={60}
                        height={60}
                        peopleIds={[notification?.owner?.id]}
                      />
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
                        {notification.icon ? (
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
                        ) : (
                          <Notifications sx={{ color: 'white', fontSize: '20px' }} />
                        )}
                      </Box>
                    </Box>
                  )}

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
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                paddingTop: '15px',
                paddingBottom: '15px',
              }}
            >
              <Typography>Pas d&apos;activité pour le moment</Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Drawer>
  )
}

export default NotificationArea
