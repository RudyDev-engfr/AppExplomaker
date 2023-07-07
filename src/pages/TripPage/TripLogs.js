import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

import { makeStyles, useTheme } from '@mui/styles'
import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Launch } from '@mui/icons-material'
import { isSameDay } from 'date-fns'

import { SessionContext } from '../../contexts/session'
import { buildLogSejour, stringToDate } from '../../helper/functions'

import arrowBack from '../../images/icons/arrow-back.svg'
import CustomAvatar from '../../components/atoms/CustomAvatar'
import EventAccordion from '../../components/atoms/EventAccordion'
import DateUpdateAccordion from '../../components/atoms/DateUpdateAccordion'
import { TripContext } from '../../contexts/trip'
import MobileTripPageHeader from '../../components/molecules/MobileTripPageHeader'

const useStyles = makeStyles(theme => ({
  title: {
    fontFamily: theme.typography.h1.fontFamily,
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '15px',
    [theme.breakpoints.down('sm')]: {
      fontFamily: theme.typography.fontFamily,
      fontSize: '20px',
      fontWeight: '500',
    },
  },
  paper: {
    padding: '30px',
    overflowY: 'auto',
    [theme.breakpoints.down('sm')]: {
      padding: '30px',
      paddingBottom: '120px',
      overflowY: 'auto',
    },
  },
  accordionDetailsRoot: {
    borderRadius: '0 0 20px 20px',
  },
}))

const TripLogs = ({ tripData, tripId, canEdit }) => {
  const classes = useStyles()
  const history = useHistory()
  const theme = useTheme()
  const { user } = useContext(SessionContext)
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  const { days, setSelectedDateOnPlanning, setCurrentView } = useContext(TripContext)

  const [currentNotifications, setCurrentNotifications] = useState([])

  useEffect(() => {
    if (!canEdit) {
      history.push(`/tripPage/${tripId}`)
    }
  }, [canEdit])

  useEffect(() => {
    if (tripData && tripId && user) {
      const tempNotif = buildLogSejour(tripId, tripData)
      setCurrentNotifications(tempNotif)
    }
  }, [tripData, user, tripId])

  return (
    <Box
      sx={{
        marginBottom: '110px',
        [theme.breakpoints.up('sm')]: {
          padding: '30px',
          paddingTop: '50px',
        },
      }}
    >
      {matchesXs && <MobileTripPageHeader />}
      <Paper className={classes.paper}>
        {!matchesXs && <Typography className={classes.title}>Logs du séjour</Typography>}
        <Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {currentNotifications
              ?.filter(notification => notification.state !== 4)
              .slice(0)
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
                        borderRadius: '20px',
                        padding: matchesXs && '0 5px 0 0 !important',
                        paddingRight: !matchesXs && '15px',
                        '&.Mui-expanded': {
                          borderRadius: '20px 20px 0 0 !important',
                        },
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
                          <Typography sx={{ fontSize: !matchesXs ? '17px' : '14px' }}>
                            {notification.content}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: !matchesXs ? '17px' : '14px',
                              color: theme.palette.primary.main,
                            }}
                          >
                            {notification.timer}
                          </Typography>
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails
                      sx={{ backgroundColor: theme.palette.grey.f7 }}
                      classes={{ root: classes.accordionDetailsRoot }}
                    >
                      {notification.logs.date && (
                        <EventAccordion
                          notification={notification}
                          setCurrentView={setCurrentView}
                          days={days}
                          setSelectedDateOnPlanning={setSelectedDateOnPlanning}
                        />
                      )}
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
                      display: 'grid',
                      gridTemplate: '1fr / 110px 1fr 40px',
                      alignItems: 'center',
                      marginBottom: '15px',
                      borderRadius: '20px',
                      backgroundColor: theme.palette.grey.f2,
                      paddingRight: !matchesXs && '15px',
                    }}
                    key={notification.id}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Avatar sx={{ width: 60, height: 60 }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: !matchesXs ? '17px' : '14px' }}>
                        {notification.content}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: !matchesXs ? '17px' : '14px',
                          color: theme.palette.primary.main,
                        }}
                      >
                        {notification.timer}
                      </Typography>
                    </Box>
                    <IconButton
                      onClick={() => {
                        history.push(notification.url)
                      }}
                    >
                      <Launch />
                    </IconButton>
                  </Box>
                )
              )}
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}
export default TripLogs
