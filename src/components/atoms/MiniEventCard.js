import React, { useContext, useEffect } from 'react'
import { Box, Button, Typography } from '@mui/material'
import { makeStyles, useTheme } from '@mui/styles'
import { format } from 'date-fns'
import { useHistory, useParams } from 'react-router-dom'
import { stringToDate } from '../../helper/functions'
import findIcon from '../../helper/icons'
import { EVENT_TYPES } from '../../helper/constants'
import { TripContext } from '../../contexts/trip'
import { PlanningContext } from '../../contexts/planning'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  miniaEventTypoContainer: {
    height: '40px',
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    padding: '8px 15px',
    alignItems: 'center',
    borderRadius: '10px',
    textTransform: 'none',
    color: theme.palette.grey['33'],
  },
  hourTypo: {
    marginRight: '15px',
    fontSize: '12px',
    color: theme.palette.grey['82'],
    whiteSpace: 'nowrap',
  },
  eventTitleTypo: {
    fontWeight: 400,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  iconContainer: {
    padding: '6px',
    borderRadius: '50px',
    width: '25px',
    height: '25px',
    backgroundColor: theme.palette.primary.main,
    display: 'flex',
    alignItems: 'center',
    marginRight: '15px',
  },
}))

const MiniEventCard = ({ plannedEvent, setCurrentView, surveyId, plannedSurvey, day }) => {
  const classes = useStyles()
  const history = useHistory()
  const theme = useTheme()
  const { tripId } = useParams()
  const { currentEventId, setCurrentEventId, setSurvey, setSelectedDateOnPlanning } =
    useContext(PlanningContext)
  const { setCurrentEvent } = useContext(TripContext)

  useEffect(() => {
    console.log('leventtoutseulplanifie', plannedEvent)
  }, [plannedEvent])

  const setEvent = event => {
    setCurrentEvent(event)
    history.push(`/tripPage/${tripId}/planning?event=${event.id}`)
    setCurrentView('preview')
  }

  return (
    <Box
      className={classes.root}
      onMouseEnter={() => {
        if (surveyId) {
          setCurrentEventId(surveyId)
        } else {
          setCurrentEventId(plannedEvent.id)
        }
      }}
      onMouseLeave={() => {
        setCurrentEventId()
      }}
    >
      <Box className={classes.iconContainer}>
        <Box
          component="img"
          src={findIcon(plannedEvent.icon, plannedEvent.type)}
          sx={{
            filter:
              'brightness(0) saturate(100%) invert(92%) sepia(95%) saturate(0%) hue-rotate(332deg) brightness(114%) contrast(100%)',
            width: '13px',
            height: '13px',
          }}
        />
      </Box>
      <Button
        className={classes.miniaEventTypoContainer}
        sx={{
          backgroundColor: surveyId ? `${theme.palette.primary.ultraLight} !important ` : 'white',
        }}
        onClick={() => {
          setSelectedDateOnPlanning(day)
          if (surveyId && plannedSurvey) {
            setSurvey(plannedSurvey)
          } else {
            setEvent(plannedEvent)
          }
        }}
      >
        <Typography className={classes.hourTypo}>
          {plannedEvent.itsAllDayLong && plannedEvent.type === EVENT_TYPES[0]
            ? 'Nuit'
            : plannedEvent.itsAllDayLong
            ? 'Jour'
            : format(stringToDate(plannedEvent.fakeDate, 'yyyy-MM-dd HH:mm'), "HH'h'mm")}
        </Typography>
        <Typography className={classes.eventTitleTypo}>{plannedEvent.title}</Typography>
      </Button>
    </Box>
  )
}
export default MiniEventCard
