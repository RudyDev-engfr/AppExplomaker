import { Avatar, Box, IconButton, Paper, Typography, useMediaQuery } from '@mui/material'
import { makeStyles, useTheme } from '@mui/styles'
import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { SessionContext } from '../../contexts/session'
import { buildNotificationsOnTripForUser } from '../../helper/functions'

import arrowBack from '../../images/icons/arrow-back.svg'

const useStyles = makeStyles(theme => ({
  mobileTitleContainer: {
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'flex-start',
    padding: '57px 0 25px',
    alignItems: 'center',
  },
  mobileTitleTypo: {
    fontSize: '22px',
    fontWeight: '500',
  },
  mobileTitleIcon: {
    margin: '0 25px',
  },
  title: {
    fontFamily: theme.typography.h1.fontFamily,
    fontSize: '28px',
    fontWeight: '700',
    [theme.breakpoints.down('sm')]: {
      fontFamily: theme.typography.fontFamily,
      fontSize: '20px',
      fontWeight: '500',
    },
  },
  paper: {
    padding: '30px',
    margin: '20px 0',
    height: '90vh',
    [theme.breakpoints.down('sm')]: {
      margin: '20px',
      padding: '15px',
    },
  },
}))

const TripLogs = ({ tripData }) => {
  const classes = useStyles()
  const history = useHistory()
  const theme = useTheme()
  const { user } = useContext(SessionContext)
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))

  const [currentNotifications, setCurrentNotifications] = useState([])

  useEffect(() => {
    if (tripData && user) {
      const tempNotif = buildNotificationsOnTripForUser(user, tripData)
      console.log('tempnotif', tempNotif)
      setCurrentNotifications(tempNotif)
    }
    console.log('le voyage avec ses notifs', tripData.notifications)
  }, [tripData, user])

  return (
    <Box sx={{ marginBottom: '110px' }}>
      {matchesXs && (
        <Box className={classes.mobileTitleContainer}>
          <IconButton
            className={classes.mobileTitleIcon}
            size="large"
            onClick={() => history.goBack()}
          >
            <img src={arrowBack} alt="" />
          </IconButton>
          <Typography className={classes.mobileTitleTypo}>Logs du Séjour</Typography>
        </Box>
      )}
      <Paper className={classes.paper}>
        <Typography className={classes.title}>Logs du séjour</Typography>
        <Box my={2} sx={{ display: 'flex', flexDirection: 'column' }}>
          {currentNotifications?.map((notification, index) => (
            <Box
              sx={{
                width: '457px,',
                height: '105px',
                padding: '0 30px',
                display: 'grid',
                gridTemplate: '1fr / 110px 1fr',
                alignItems: 'center',
                marginBottom: '15px',
                borderRadius: '20px',
                backgroundColor: theme.palette.grey.f2,
              }}
              key={notification.content}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Avatar sx={{ width: 60, height: 60 }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: '17px' }}>{notification.content}</Typography>
                <Typography sx={{ fontSize: '17px', color: theme.palette.primary.main }}>
                  {notification.timer}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  )
}
export default TripLogs
