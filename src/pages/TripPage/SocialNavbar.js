import React, { useContext } from 'react'
import AppBar from '@mui/material/AppBar'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import useMediaQuery from '@mui/material/useMediaQuery'

import { Forum, ForumOutlined } from '@mui/icons-material'
import ExploreIcon from '@mui/icons-material/Explore'
import { makeStyles, useTheme } from '@mui/styles'

import { useLocation, useParams } from 'react-router-dom'
import { SessionContext } from '../../contexts/session'
import { TripContext } from '../../contexts/trip'
import NotificationArea from '../../components/molecules/NotificationArea'

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
  } = useContext(TripContext)
  const { user } = useContext(SessionContext)

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
              }
            }}
            sx={{
              color: isChatOpen === 'AIChat' ? theme.palette.primary.main : 'white',
              backgroundColor: isChatOpen === 'AIChat' ? 'white' : theme.palette.primary.main,
              '&:hover': {
                color: isChatOpen === 'AIChat' ? theme.palette.primary.main : 'white',
                backgroundColor: isChatOpen === 'AIChat' ? 'white' : theme.palette.primary.main,
              },
              width: '48px',
              height: '48px',
            }}
          >
            <Badge color="error">
              <ExploreIcon />
            </Badge>
          </IconButton>
          <IconButton
            onClick={() => {
              if (isChatOpen === 'userChat') {
                setIsChatOpen('')
              } else {
                setIsChatOpen('userChat')
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
              width: '48px',
              height: '48px',
            }}
          >
            <Forum />
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
