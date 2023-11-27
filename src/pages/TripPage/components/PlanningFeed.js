import React, { useContext, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { makeStyles, useTheme } from '@mui/styles'
import { Fab, useMediaQuery } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

import { format } from 'date-fns'
import frLocale from 'date-fns/locale/fr'
import capitalize from 'lodash.capitalize'
import { ManageSearch } from '@mui/icons-material'
import { v4 as uuidv4 } from 'uuid'

import { PlanningContext } from '../../../contexts/planning'
import { stringToDate } from '../../../helper/functions'
import MiniEventCard from '../../../components/atoms/MiniEventCard'
import { TripContext } from '../../../contexts/trip'

const useStyles = makeStyles(theme => ({
  FabClass: {
    position: 'absolute',
    top: '15px',
    right: '25px',
    [theme.breakpoints.down('sm')]: {
      position: 'fixed',
      top: 'unset',
      right: '50%',
      bottom: '120px',
      transform: 'translateX(50%)',
    },
  },
}))

const PlanningFeed = ({ propsClasses, setCurrentView, currentDateRange }) => {
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  const [eventsByDay, setEventsByDay] = useState([])

  const { days, singleDayPlannedEvents, setSelectedDateOnPlanning, setIsNewDatesSectionOpen } =
    useContext(PlanningContext)
  const { currentView, canEdit } = useContext(TripContext)

  function compare(a, b) {
    // Met les itsAllDayLong : true en dernier
    if (a.itsAllDayLong && !b.itsAllDayLong) {
      return 1
    }
    if (!a.itsAllDayLong && b.itsAllDayLong) {
      return -1
    }

    // Trie par date
    const dateA = new Date(a.fakeDate)
    const dateB = new Date(b.fakeDate)

    if (dateA < dateB) {
      return -1
    }
    if (dateA > dateB) {
      return 1
    }
    return 0
  }

  useEffect(() => {
    if (singleDayPlannedEvents?.length >= 1) {
      const tempEventsByDay = singleDayPlannedEvents.reduce((acc, plannedEvent) => {
        const dateKey = format(
          stringToDate(plannedEvent.fakeDate, 'yyyy-MM-dd HH:mm'),
          'yyyy-MM-dd'
        )
        if (!acc[dateKey]) {
          acc[dateKey] = { propositions: [], events: [] }
        }
        if (plannedEvent.isSurvey) {
          acc[dateKey].propositions.push(plannedEvent)
        } else {
          acc[dateKey].events.push(plannedEvent)
        }
        return acc
      }, {})

      Object.keys(eventsByDay).forEach(dateKey => {
        tempEventsByDay[dateKey].propositions.sort(compare)
        tempEventsByDay[dateKey].events.sort(compare)
      })

      setEventsByDay(tempEventsByDay)
    }
  }, [singleDayPlannedEvents, currentView])

  return (
    <Box className={propsClasses} sx={{ padding: '20px' }}>
      {canEdit && !matchesXs && typeof currentDateRange[0] !== 'undefined' && (
        <Fab className={classes.FabClass} color="primary" onClick={() => setCurrentView('add')}>
          <AddIcon fontSize="large" />
        </Fab>
      )}
      {days?.length >= 1 &&
        days.map(day => {
          const dateKey = format(day, 'yyyy-MM-dd')
          const dayEvents = eventsByDay[dateKey]?.events || []
          const dayPropositions = eventsByDay[dateKey]?.propositions || []
          return (
            <Box key={day} sx={{ marginBottom: '25px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography
                  sx={{
                    fontSize: '20px',
                    fontWeight: 500,
                    lineHeight: '33px',
                    marginBottom: '10px',
                    paddingLeft: '40px',
                  }}
                >
                  {capitalize(format(day, 'EEEE dd MMMM', { locale: frLocale }))}
                </Typography>
                <IconButton
                  onClick={() => {
                    setSelectedDateOnPlanning(day)
                    setIsNewDatesSectionOpen(false)
                    setCurrentView('planning')
                  }}
                  variant="contained"
                  sx={{
                    width: '25px',
                    height: '25px',
                    borderRadius: '10px',
                  }}
                >
                  <ManageSearch />
                </IconButton>
              </Box>
              {dayEvents.map(plannedEvent => (
                <MiniEventCard
                  plannedEvent={plannedEvent}
                  key={`${uuidv4()}-${plannedEvent.title}`}
                  setCurrentView={setCurrentView}
                  day={day}
                />
              ))}
              {dayPropositions.map(plannedProposition => (
                <MiniEventCard
                  plannedEvent={plannedProposition}
                  key={plannedProposition.title}
                  setCurrentView={setCurrentView}
                  eventId={plannedProposition.id}
                  day={day}
                />
              ))}
            </Box>
          )
        })}
      {/* {days?.length >= 1 &&
        days.map(day => (
          <Box key={day} sx={{ marginBottom: '25px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography
                sx={{
                  fontSize: '20px',
                  fontWeight: 500,
                  lineHeight: '33px',
                  marginBottom: '10px',
                  paddingLeft: '40px',
                }}
              >
                {capitalize(format(day, 'EEEE dd MMMM', { locale: frLocale }))}
              </Typography>
              <IconButton
                onClick={() => {
                  setSelectedDateOnPlanning(day)
                  setIsNewDatesSectionOpen(false)
                  setCurrentView('planning')
                }}
                variant="contained"
                sx={{
                  width: '25px',
                  height: '25px',
                  borderRadius: '10px',
                }}
              >
                <ManageSearch />
              </IconButton>
            </Box>
            {singleDayEvents
              ?.filter(plannedEvent =>
                isSameDay(
                  stringToDate(plannedEvent.fakeDate, 'yyyy-MM-dd HH:mm').getTime(),
                  stringToDate(dateToString(day), 'yyyy-MM-dd').getTime()
                )
              )
              .map(plannedEvent => (
                <MiniEventCard
                  plannedEvent={plannedEvent}
                  key={`${uuidv4()}-${plannedEvent.title}`}
                  setCurrentView={setCurrentView}
                  day={day}
                />
              ))}
            {singleDayPropositions
              .filter(plannedProposition =>
                isSameDay(
                  stringToDate(plannedProposition.fakeDate, 'yyyy-MM-dd HH:mm').getTime(),
                  stringToDate(dateToString(day), 'yyyy-MM-dd').getTime()
                )
              )
              .map(plannedProposition => (
                <MiniEventCard
                  plannedEvent={plannedProposition}
                  key={plannedProposition.title}
                  setCurrentView={setCurrentView}
                  eventId={plannedProposition.id}
                  day={day}
                />
              ))}
          </Box>
        ))} */}
    </Box>
  )
}
export default PlanningFeed
