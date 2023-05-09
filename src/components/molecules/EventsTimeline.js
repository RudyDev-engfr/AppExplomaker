/* eslint-disable no-else-return */
import React, { useContext } from 'react'
import { Box, Typography } from '@mui/material'
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineItem,
  TimelineSeparator,
} from '@mui/lab'
import { makeStyles } from '@mui/styles'
import { isSameDay } from 'date-fns'

import EventCard from '../../pages/TripPage/components/EventCard'

import { PlanningContext } from '../../contexts/planning'
import { TripContext } from '../../contexts/trip'
import findIcon from '../../helper/icons'
import { dateToString, rCTFF, stringToDate } from '../../helper/functions'
import { EVENT_TYPES } from '../../helper/constants'

const useStyles = makeStyles(theme => ({
  iconContainer: {
    padding: '10px 12px',
    borderRadius: '50px',
    width: '40px',
    height: '40px',
    backgroundColor: theme.palette.primary.main,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '5px',
  },
  MuiTimelineConnectorDashed: {},
}))
const EventsTimeline = ({ currentEvents, canEdit, handleOpenDropdown }) => {
  const classes = useStyles()
  const { setEvent, selectedDateOnPlanning } = useContext(PlanningContext)
  const { setCurrentEvent } = useContext(TripContext)

  function compareDates(objet1, objet2) {
    const today = new Date(selectedDateOnPlanning)
    if (!objet1.startTime || !objet1.endTime || !objet2.startTime || !objet2.endTime) {
      // Si l'un des objets n'a pas de date de début ou de fin, le placer en dernier
      if (!objet1.startTime || !objet1.endTime) {
        return 1
      } else {
        return -1
      }
    } else {
      const start1 = new Date(objet1.startTime)
      const end1 = new Date(objet1.endTime)
      const start2 = new Date(objet2.startTime)
      const end2 = new Date(objet2.endTime)
      // Comparer la date de début et la date de fin avec la date d'aujourd'hui en utilisant isSameDay
      if (isSameDay(start1, today) || isSameDay(end1, today)) {
        if (isSameDay(start2, today) || isSameDay(end2, today)) {
          // Si les deux objets ont une date égale à celle du jour, les trier par leur date de début
          return start1 - start2
        } else {
          return -1
        }
      } else if (isSameDay(start2, today) || isSameDay(end2, today)) {
        return 1
      } else {
        return 0
      }
    }
  }

  return (
    <Timeline position="right" sx={{ padding: '0 !important' }}>
      {currentEvents.events.sort(compareDates).map((event, eventIndex) => (
        <>
          <TimelineItem sx={{ '&::before': { display: 'none' } }}>
            <TimelineSeparator>
              <TimelineConnector classes={{ root: classes.MuiTimelineConnectorDashed }} />
              <Box sx={{ padding: '8px 0' }}>
                <Typography sx={{ fontSize: '14px', textAlign: 'center', marginBottom: '10px' }}>
                  {event.type === EVENT_TYPES[1] &&
                    (isSameDay(
                      stringToDate(event?.startTime, 'yyyy-MM-dd HH:mm'),
                      selectedDateOnPlanning
                    )
                      ? isSameDay(
                          stringToDate(event?.endTime, 'yyyy-MM-dd HH:mm'),
                          selectedDateOnPlanning
                        )
                        ? dateToString(stringToDate(event?.startTime, 'yyyy-MM-dd HH:mm'), 'HH:mm')
                        : `Départ ${dateToString(
                            stringToDate(event?.startTime, 'yyyy-MM-dd HH:mm'),
                            'HH:mm'
                          )}`
                      : '')}
                </Typography>
                <Box className={classes.iconContainer}>
                  <Box
                    component="img"
                    src={findIcon(event.icon, event.type)}
                    sx={{
                      filter:
                        'brightness(0) saturate(100%) invert(92%) sepia(95%) saturate(0%) hue-rotate(332deg) brightness(114%) contrast(100%)',
                      width: '22px',
                      height: '22px',
                    }}
                  />
                </Box>
                <Typography sx={{ fontSize: '14px', textAlign: 'center' }}>
                  {event.type !== EVENT_TYPES[0] &&
                    event.type !== EVENT_TYPES[1] &&
                    (isSameDay(
                      stringToDate(event?.startTime, 'yyyy-MM-dd HH:mm'),
                      selectedDateOnPlanning
                    )
                      ? isSameDay(
                          stringToDate(event?.endTime, 'yyyy-MM-dd HH:mm'),
                          selectedDateOnPlanning
                        )
                        ? dateToString(stringToDate(event?.startTime, 'yyyy-MM-dd HH:mm'), 'HH:mm')
                        : 'Jour'
                      : '')}
                  {event.type === EVENT_TYPES[0] &&
                    (isSameDay(
                      stringToDate(event?.startTime, 'yyyy-MM-dd HH:mm'),
                      selectedDateOnPlanning
                    )
                      ? dateToString(stringToDate(event?.startTime, 'yyyy-MM-dd HH:mm'), 'HH:mm')
                      : isSameDay(
                          stringToDate(event?.endTime, 'yyyy-MM-dd HH:mm'),
                          selectedDateOnPlanning
                        )
                      ? dateToString(stringToDate(event?.endTime, 'yyyy-MM-dd HH:mm'), 'HH:mm')
                      : 'Nuit')}
                  {event.type === EVENT_TYPES[1] &&
                    (isSameDay(
                      stringToDate(event?.endTime, 'yyyy-MM-dd HH:mm'),
                      selectedDateOnPlanning
                    )
                      ? isSameDay(
                          stringToDate(event?.startTime, 'yyyy-MM-dd HH:mm'),
                          selectedDateOnPlanning
                        )
                        ? dateToString(stringToDate(event?.endTime, 'yyyy-MM-dd HH:mm'), 'HH:mm')
                        : `Arrivée ${dateToString(
                            stringToDate(event?.endTime, 'yyyy-MM-dd HH:mm'),
                            'HH:mm'
                          )}`
                      : '')}
                </Typography>
              </Box>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ paddingRight: '0 !important' }}>
              <EventCard
                key={event.id}
                currentEvent={event}
                currentEventIndex={eventIndex}
                setCurrentEvent={setCurrentEvent}
                setEvent={setEvent}
                canEdit={canEdit}
                handleOpenDropdown={handleOpenDropdown}
                eventType={event.type}
              />
            </TimelineContent>
          </TimelineItem>
          <TimelineSeparator />
        </>
      ))}
    </Timeline>
  )
}
export default EventsTimeline
