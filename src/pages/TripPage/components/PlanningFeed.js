import React, { useContext, useEffect } from 'react'
import Box from '@mui/material/Box'
import { makeStyles, useTheme } from '@mui/styles'
import { IconButton, Typography, useMediaQuery } from '@mui/material'
import { format, isSameDay } from 'date-fns'
import frLocale from 'date-fns/locale/fr'
import capitalize from 'lodash.capitalize'
import { ManageSearch } from '@mui/icons-material'

import { PlanningContext } from '../../../contexts/planning'
import { dateToString, stringToDate } from '../../../helper/functions'
import MiniEventCard from '../../../components/atoms/MiniEventCard'
import { EVENT_TYPES } from '../../../helper/constants'

const useStyles = makeStyles({})

const PlanningFeed = ({ propsClasses, setCurrentView }) => {
  const classes = useStyles()
  const theme = useTheme()

  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))

  const { days, singleDayPlannedEvents, setSelectedDate, setIsNewDatesSectionOpen } =
    useContext(PlanningContext)

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
    console.log('la liste des events par jour finale', singleDayPlannedEvents)
  }, [singleDayPlannedEvents])

  return (
    <Box className={propsClasses} sx={{ padding: '20px' }}>
      {days?.length >= 1 &&
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
                  setSelectedDate(day)
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
            {singleDayPlannedEvents?.length >= 1 &&
              singleDayPlannedEvents
                .filter(
                  plannedEvent =>
                    isSameDay(
                      stringToDate(plannedEvent.fakeDate, 'yyyy-MM-dd HH:mm').getTime(),
                      stringToDate(dateToString(day), 'yyyy-MM-dd').getTime()
                    ) && !plannedEvent.isSurvey
                )
                .sort(compare)
                .map(plannedEvent => (
                  <MiniEventCard
                    plannedEvent={plannedEvent}
                    key={plannedEvent.title}
                    setCurrentView={setCurrentView}
                  />
                ))}
            {singleDayPlannedEvents?.length >= 1 &&
              singleDayPlannedEvents
                .filter(plannedEvent => plannedEvent.isSurvey)
                .map(plannedSurvey =>
                  plannedSurvey.propositions
                    .filter(plannedProposition =>
                      isSameDay(
                        stringToDate(plannedProposition.fakeDate, 'yyyy-MM-dd HH:mm').getTime(),
                        stringToDate(dateToString(day), 'yyyy-MM-dd').getTime()
                      )
                    )
                    .sort(compare)
                    .map(plannedProposition => (
                      <MiniEventCard
                        plannedEvent={plannedProposition}
                        key={plannedProposition.title}
                        setCurrentView={setCurrentView}
                        surveyId={plannedSurvey.id}
                      />
                    ))
                )}
          </Box>
        ))}
    </Box>
  )
}
export default PlanningFeed
