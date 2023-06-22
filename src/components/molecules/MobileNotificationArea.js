import { ArrowForward, Notifications } from '@mui/icons-material'
import { Avatar, Badge, Box, Drawer, IconButton, Modal, Paper, Typography } from '@mui/material'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { makeStyles, useTheme } from '@mui/styles'
import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { isSameDay } from 'date-fns'

import { FirebaseContext } from '../../contexts/firebase'
import { SessionContext } from '../../contexts/session'
import { TripContext } from '../../contexts/trip'

import findIcon from '../../helper/icons'
import CustomAvatar from '../atoms/CustomAvatar'
import { stringToDate } from '../../helper/functions'

const useStyles = makeStyles(theme => ({
  notificationTitle: {
    fontSize: '28px',
    lineHeight: '32px',
    fontFamily: 'Vesper Libre',
  },
}))

const MobileNotificationArea = ({
  isMyTrips = false,
  tripId,
  currentNotifications,
  setRefreshNotif,
}) => {
  const classes = useStyles()
  const theme = useTheme()

  const { user } = useContext(SessionContext)
  const { setNotificationsToNewStateOnTrip } = useContext(FirebaseContext)
  const { days, setSelectedDateOnPlanning, isChatOpen, setIsChatOpen } = useContext(TripContext)

  const [open, setOpen] = useState(false)
  const handleOpen = () => {
    if (isMyTrips) {
      setOpen(true)
    } else {
      setIsChatOpen('notifications')
    }
  }

  return (
    <>
      <IconButton
        onClick={() => {
          setRefreshNotif(true)
          handleOpen()
          setNotificationsToNewStateOnTrip(user, tripId, 2)
        }}
        // sx={{
        //   backgroundColor:
        //     user?.notifications?.filter(notification => notification.state === 1).length > 0
        //       ? theme.palette.primary.ultraLight
        //       : 'white',
        //   '&:hover': {
        //     backgroundColor:
        //       user?.notifications?.filter(notification => notification.state === 1).length > 0
        //         ? theme.palette.primary.ultraLight
        //         : 'white',
        //   },
        // }}
      >
        <Badge
          badgeContent={
            isMyTrips
              ? currentNotifications.filter(
                  notification => notification.myTripsTripId && notification.redPings > 0
                ).length
              : user?.notifications.filter(
                  notification => notification?.tripId === tripId && notification?.state === 1
                ).length
          }
          color="secondary"
        >
          <Notifications sx={{ fontSize: '35px' }} />
        </Badge>
      </IconButton>
      <MobileNotificationModal
        open={open}
        setOpen={setOpen}
        currentNotifications={currentNotifications}
        setNotificationsToNewStateOnTrip={setNotificationsToNewStateOnTrip}
        user={user}
        days={days}
        setSelectedDateOnPlanning={setSelectedDateOnPlanning}
        isChatOpen={isChatOpen}
        setIsChatOpen={setIsChatOpen}
        isMyTrips={isMyTrips}
      />
    </>
  )
}

export const MobileNotificationModal = ({
  open,
  setOpen,
  currentNotifications,
  setNotificationsToNewStateOnTrip,
  user,
  days,
  setSelectedDateOnPlanning,
  isChatOpen,
  setIsChatOpen,
  isMyTrips,
}) => {
  const classes = useStyles()
  const theme = useTheme()
  const history = useHistory()

  const { setCurrentView, setCurrentEventId, setCurrentEvent, setCurrentEventType } =
    useContext(TripContext)

  const handleClose = () => {
    if (isMyTrips) {
      setOpen(false)
    } else {
      setIsChatOpen(false)
    }
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
    handleClose()
  }

  return (
    <Drawer
      open={isMyTrips ? open : isChatOpen === 'notifications'}
      onClose={handleClose}
      anchor="right"
      aria-labelledby="modal-notifications"
      aria-describedby="modal-show-notifications"
    >
      <Paper
        sx={{
          width: '100vw',
          height: 'calc(100vh - 60px)',
          padding: '15px 15px 30px 15px',
          zIndex: 9999,
          borderRadius: 0,
          overflowY: 'auto',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 15px',
            borderBottom: '2px solid #F7F7F7',
            width: '100%',
          }}
        >
          <Typography variant="h4" sx={{ paddingLeft: '15px', fontSize: '25px' }}>
            Notifications
          </Typography>
          <Box position="absolute" left="20px">
            <IconButton
              aria-label="back"
              edge="start"
              onClick={() => {
                handleClose()
              }}
            >
              <ArrowBackIosIcon sx={{ transform: 'translate(5px ,-5px)' }} />
            </IconButton>
          </Box>
        </Box>
        {currentNotifications.length > 0 ? (
          currentNotifications
            ?.slice(0)
            .reverse()
            .map(notification => (
              <Box
                sx={{
                  width: 'calc(100vw - 30px),',
                  height: '113px',
                  padding: '0 30px',
                  display: 'grid',
                  gridTemplate: '1fr / 110px 1fr',
                  alignItems: 'center',
                  marginBottom: '10px',
                  borderRadius: '20px',
                  backgroundColor:
                    notification.state === 1 ? theme.palette.primary.ultraLight : 'white',
                }}
                key={notification.id}
                onClick={() => onClickNotif(notification)}
              >
                <Box sx={{ position: 'relative' }}>
                  <CustomAvatar
                    width={54}
                    height={54}
                    peopleIds={[notification.owner]}
                    isNotification
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: '-5px ',
                      right: '50px',
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
      </Paper>
    </Drawer>
  )
}

export default MobileNotificationArea
