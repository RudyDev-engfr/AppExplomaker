import React, { useContext, useEffect } from 'react'
import { AppBar, Badge, Box, Drawer, IconButton, Toolbar, useMediaQuery } from '@mui/material'
import { Forum, ForumOutlined, Help } from '@mui/icons-material'
import { makeStyles, useTheme } from '@mui/styles'
import { useCollectionData } from 'react-firebase-hooks/firestore'

import { useLocation, useParams } from 'react-router-dom'
import { SessionContext } from '../../contexts/session'
import { TripContext } from '../../contexts/trip'
import NotificationArea from '../../components/molecules/NotificationArea'
import { FirebaseContext } from '../../contexts/firebase'

const useStyles = makeStyles(theme => ({
  AppBarRoot: {
    zIndex: 100000,
    top: '0',
    right: '0',
    width: '180px',
    boxShadow: 'unset',
    borderRadius: '0 0 0 20px',
  },
  planningAppBarRoot: {
    zIndex: 100000,
    top: '0',
    right: '0',
    width: '180px',
    boxShadow: 'unset',
  },
}))

const SocialNavbar = () => {
  const classes = useStyles()
  const theme = useTheme()
  const location = useLocation()
  const { tripId } = useParams()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  const {
    isChatOpen,
    setIsChatOpen,
    tripData,
    currentNotifications,
    setRefreshNotif,
    setSelectedDateOnPlanning,
    updateHasSeen,
  } = useContext(TripContext)
  const { user } = useContext(SessionContext)
  const { firestore } = useContext(FirebaseContext)
  const messagesRef = firestore.collection('trips').doc(tripId).collection('messages')
  const assistantRef = firestore.collection('trips').doc(tripId).collection('Assistant')
  const assistantQuery = assistantRef.orderBy('createdAt')
  const query = messagesRef.orderBy('createdAt')
  const [messages] = useCollectionData(query, { idField: 'messageId' })
  const [assistantMessages] = useCollectionData(assistantQuery, { idField: 'messageId' })

  useEffect(() => {
    console.log('assistantMessages', assistantMessages)
  }, [assistantMessages])

  useEffect(() => {
    console.log('messagesRef', messages)
    console.log(
      'le filtre',
      messages?.filter(message => {
        const hasUserSeen = message.notifications?.filter(notification => {
          if (notification.userId === user.id && !notification.hasSeen) {
            return true
          }
          return false
        })
        if (hasUserSeen?.length > 0) {
          return true
        }
        return false
      }).length
    )
  }, [messages])

  return (
    <AppBar
      position="fixed"
      anchor="top"
      classes={{
        root: location.pathname.includes('/planning')
          ? classes.planningAppBarRoot
          : classes.AppBarRoot,
      }}
    >
      <Toolbar>
        {/* <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="open drawer"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton> */}
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <IconButton
            size="large"
            color="inherit"
            onClick={() => {
              if (isChatOpen === 'AIChat') {
                setIsChatOpen('')
              } else {
                setIsChatOpen('AIChat')
                updateHasSeen('Assistant')
              }
            }}
            sx={{
              color: isChatOpen === 'AIChat' ? theme.palette.primary.main : 'white',
              backgroundColor: isChatOpen === 'AIChat' ? 'white' : theme.palette.primary.main,
              '&:hover': {
                color: isChatOpen === 'AIChat' ? theme.palette.primary.main : 'white',
                backgroundColor: isChatOpen === 'AIChat' ? 'white' : theme.palette.primary.main,
              },
              width: '42px',
              height: '42px',
            }}
          >
            <Badge
              color="secondary"
              badgeContent={
                assistantMessages?.length > 0 &&
                assistantMessages?.filter(message => {
                  const hasUserSeen = message.notifications?.filter(notification => {
                    if (notification.userId === user.id && !notification.hasSeen) {
                      return true
                    }
                    return false
                  })
                  if (hasUserSeen?.length > 0) {
                    return true
                  }
                  return false
                }).length
              }
              invisible={assistantMessages?.length < 1}
            >
              <Help />
            </Badge>
          </IconButton>

          <IconButton
            onClick={() => {
              if (isChatOpen === 'userChat') {
                setIsChatOpen('')
              } else {
                setIsChatOpen('userChat')
                updateHasSeen('messages')
              }
            }}
            color="inherit"
            sx={{
              color: isChatOpen === 'userChat' ? theme.palette.primary.main : 'white',
              backgroundColor: isChatOpen === 'userChat' ? 'white' : theme.palette.primary.main,
              '&:hover': {
                color: isChatOpen === 'userChat' ? theme.palette.primary.main : 'white',
                backgroundColor: isChatOpen === 'userChat' ? 'white' : theme.palette.primary.main,
              },
              width: '42px',
              height: '42px',
            }}
          >
            <Badge
              color="secondary"
              badgeContent={
                messages?.length > 0 &&
                messages?.filter(message => {
                  const hasUserSeen = message.notifications?.filter(notification => {
                    if (notification.userId === user.id && !notification.hasSeen) {
                      return true
                    }
                    return false
                  })
                  if (hasUserSeen?.length > 0) {
                    return true
                  }
                  return false
                }).length
              }
              invisible={messages?.length < 1}
            >
              <Forum />
            </Badge>
          </IconButton>

          <NotificationArea
            tripData={tripData}
            currentNotifications={currentNotifications}
            setRefreshNotif={setRefreshNotif}
            tripId={tripId}
            isChatOpen={isChatOpen}
            setIsChatOpen={setIsChatOpen}
            setSelectedDateOnPlanning={setSelectedDateOnPlanning}
          />
        </Box>
      </Toolbar>
    </AppBar>
  )
}
export default SocialNavbar
