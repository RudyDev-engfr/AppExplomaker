import React, { useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { format } from 'date-fns'
import { stringToDate } from '../../helper/functions'
import findIcon from '../../helper/icons'
import { EVENT_TYPES } from '../../helper/constants'

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
    backgroundColor: 'white',
    borderRadius: '10px',
  },
  hourTypo: {
    marginRight: '15px',
    fontSize: '12px',
    color: theme.palette.grey['82'],
  },
  eventTitleTypo: {
    fontWeight: 400,
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
const MiniEventCard = ({ plannedEvent }) => {
  const classes = useStyles()

  useEffect(() => {
    console.log('leventtoutseulplanifie', plannedEvent)
  }, [plannedEvent])

  return (
    <Box className={classes.root}>
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
      <Box className={classes.miniaEventTypoContainer}>
        <Typography className={classes.hourTypo}>
          {plannedEvent.itsAllDayLong && plannedEvent.type === EVENT_TYPES[0]
            ? 'Nuit'
            : plannedEvent.itsAllDayLong
            ? 'Jour'
            : format(stringToDate(plannedEvent.fakeDate, 'yyyy-MM-dd HH:mm'), "HH 'h' mm")}
        </Typography>
        <Typography className={classes.eventTitleTypo}>{plannedEvent.title}</Typography>
      </Box>
    </Box>
  )
}
export default MiniEventCard
