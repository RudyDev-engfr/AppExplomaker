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

import EventCard from '../../pages/TripPage/components/EventCard'

import { PlanningContext } from '../../contexts/planning'
import { TripContext } from '../../contexts/trip'
import findIcon from '../../helper/icons'
import { dateToString, rCTFF, stringToDate } from '../../helper/functions'

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
  MuiTimelineConnectorDashed: {
    borderStyle: 'solid',
    borderWidth: '1px',
    borderImage:
      'repeating-linear-gradient(45deg, #666 0, #666 5px, transparent 5px, transparent 10px) !important',
  },
}))
const EventsTimeline = ({ currentEvents, canEdit, handleOpenDropdown }) => {
  const classes = useStyles()
  const { setEvent } = useContext(PlanningContext)
  const { setCurrentEvent } = useContext(TripContext)
  return (
    <Timeline position="right" sx={{ padding: '0 !important' }}>
      {currentEvents.events.map((event, eventIndex) => (
        <>
          <TimelineItem sx={{ '&::before': { display: 'none' } }}>
            <TimelineSeparator>
              <TimelineConnector classes={{ root: classes.MuiTimelineConnectorDashed }} />
              <Box sx={{ padding: '8px 0' }}>
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
                <Typography>
                  {event.startTime
                    ? dateToString(stringToDate(event.startTime, 'yyyy-MM-dd HH:mm'), 'HH:mm')
                    : dateToString(rCTFF(event.date), 'HH:mm')}
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
