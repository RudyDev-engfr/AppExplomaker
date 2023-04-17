import React, { useContext, useEffect } from 'react'
import Box from '@mui/material/Box'
import { makeStyles, useTheme } from '@mui/styles'
import { Typography, useMediaQuery } from '@mui/material'
import { format, isSameDay } from 'date-fns'
import frLocale from 'date-fns/locale/fr'
import capitalize from 'lodash.capitalize'
import { PlanningContext } from '../../../contexts/planning'
import { dateToString, rCTFF, stringToDate } from '../../../helper/functions'
import MiniEventCard from '../../../components/atoms/MiniEventCard'
import { EVENT_TYPES } from '../../../helper/constants'

const useStyles = makeStyles({})

const PlanningFeed = ({ plannedEvents, propsClasses }) => {
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))

  const { days, setDays } = useContext(PlanningContext)

  useEffect(() => {
    console.log('les jours', days)
  }, [days])

  useEffect(() => {
    console.log('les events planifiés', plannedEvents)
  }, [plannedEvents])

  return matchesXs ? (
    <Box className={classes.mobileMainContainer}>
      {days.map(day => (
        <Box key={day}>
          <Typography>{dateToString(day)}</Typography>
          {plannedEvents
            .filter(
              plannedEvent => !plannedEvent.needNewDates && stringToDate(plannedEvent.date) === day
            )
            .map(event => (
              <Box>{event.title}</Box>
            ))}
        </Box>
      ))}
    </Box>
  ) : (
    <Box className={propsClasses} sx={{ padding: '35px 30px 15px 50px' }}>
      {days.map(day => (
        <Box key={day} sx={{ marginBottom: '15px' }}>
          <Typography
            sx={{ fontSize: '28px', fontWeight: 500, lineHeight: '33px', marginBottom: '10px' }}
          >
            {capitalize(format(day, 'EEEE dd MMMM', { locale: frLocale }))}
          </Typography>
          {plannedEvents
            .filter(plannedEvent =>
              isSameDay(
                stringToDate(
                  plannedEvent.date,
                  plannedEvent.type === EVENT_TYPES[0] ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd'
                ).getTime(),
                stringToDate(dateToString(day), 'yyyy-MM-dd').getTime()
              )
            )
            .map(plannedEvent => {
              console.log(
                'cestlememejour',
                isSameDay(
                  stringToDate(
                    plannedEvent.date,
                    plannedEvent.type === EVENT_TYPES[0]
                      ? 'yyyy-MM-dd HH:mm'
                      : plannedEvent.type === EVENT_TYPES[3]
                      ? 'yyyy-MM-dd HH:mm'
                      : 'yyyy-MM-dd'
                  ).getTime(),
                  stringToDate(dateToString(day), 'yyyy-MM-dd').getTime()
                )
              )
              return <MiniEventCard plannedEvent={plannedEvent} key={plannedEvent.title} />
            })}
        </Box>
      ))}
    </Box>
  )
}
export default PlanningFeed
