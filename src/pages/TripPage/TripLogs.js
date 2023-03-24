import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  IconButton,
  Paper,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { makeStyles, useTheme } from '@mui/styles'
import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Launch } from '@mui/icons-material'

import { SessionContext } from '../../contexts/session'
import { buildLogSejour } from '../../helper/functions'

import arrowBack from '../../images/icons/arrow-back.svg'
import CustomAvatar from '../../components/atoms/CustomAvatar'
import EventAccordion from '../../components/atoms/EventAccordion'
import DateUpdateAccordion from '../../components/atoms/DateUpdateAccordion'

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

const TripLogs = ({ tripData, tripId }) => {
  const classes = useStyles()
  const history = useHistory()
  const theme = useTheme()
  const { user } = useContext(SessionContext)
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))

  const [currentNotifications, setCurrentNotifications] = useState([])

  useEffect(() => {
    console.log('tripData du triplog', tripData)
    if (tripData && tripId && user) {
      console.log('regarde il fonctionne ce tripData', tripData)
      console.log('il est beau le tripId', tripId)
      const tempNotif = buildLogSejour(tripId, tripData)
      console.log('tempnotif', tempNotif)
      setCurrentNotifications(tempNotif)
    }
    console.log('le voyage avec ses notifs', tripData.notifications)
  }, [tripData, user, tripId])

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
        <Box
          my={2}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto !important',
            maxHeight: 'calc(90vh - 118px)',
          }}
        >
          {currentNotifications
            ?.slice(0)
            .reverse()
            .map((notification, index) =>
              notification.logs ? (
                <Accordion
                  sx={{
                    marginBottom: '15px',
                    minHeight: '105px',
                    '&::before': {
                      display: 'none',
                      height: '0',
                    },
                    boxShadow: 'none',
                  }}
                  key={notification.id}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    sx={{
                      backgroundColor: theme.palette.grey.f2,
                      width: '457px,',
                      height: '115px',
                      padding: '0 30px',
                      borderRadius: '20px',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplate: '1fr / 110px 1fr',
                        alignItems: 'center',
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <CustomAvatar
                          isNotification
                          width={60}
                          height={60}
                          peopleIds={[notification?.owner?.id]}
                        />
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: '17px' }}>{notification.content}</Typography>
                        <Typography sx={{ fontSize: '17px', color: theme.palette.primary.main }}>
                          {notification.timer}
                        </Typography>
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    {notification.logs.eventName && <EventAccordion notification={notification} />}
                    {notification.logs.oldDate && (
                      <DateUpdateAccordion notification={notification} />
                    )}
                  </AccordionDetails>
                </Accordion>
              ) : (
                <Box
                  sx={{
                    width: '457px,',
                    height: '105px',
                    minHeight: '105px',
                    padding: '0 30px',
                    display: 'grid',
                    gridTemplate: '1fr / 110px 1fr 40px',
                    alignItems: 'center',
                    marginBottom: '15px',
                    borderRadius: '20px',
                    backgroundColor: theme.palette.grey.f2,
                  }}
                  key={notification.id}
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
                  <IconButton onClick={() => history.push(notification.url)}>
                    <Launch />
                  </IconButton>
                </Box>
              )
            )}
        </Box>
      </Paper>
    </Box>
  )
}
export default TripLogs
