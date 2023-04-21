import React, { useContext } from 'react'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import MoreHoriz from '@mui/icons-material/MoreHoriz'
import Room from '@mui/icons-material/Room'
import makeStyles from '@mui/styles/makeStyles'
import { useTheme } from '@mui/material'
import clsx from 'clsx'
import { format, isSameDay } from 'date-fns'
import frLocale from 'date-fns/locale/fr'

import PlanningCardIcon from './PlanningCardIcon'
import CustomAvatar from '../../../components/atoms/CustomAvatar'
import { EVENT_TYPES } from '../../../helper/constants'
import { dateToString, rCTFF, stringToDate } from '../../../helper/functions'
import { PlanningContext } from '../../../contexts/planning'

const useStyles = makeStyles(theme => ({
  cardPlan: {
    cursor: 'pointer',
    margin: '1rem 0',
    borderRadius: '10px',
  },
  hoveredEvent: {
    backgroundColor: theme.palette.primary.ultraLight,
  },
  cardGrid: {
    display: 'grid',
    gridTemplate: '1fr / 1fr',
    gridGap: '15px',
    width: '100%',
  },
  avatarGroup: {
    '& > div > div': {
      height: '30px',
      width: '30px',
    },
  },
  date: { fontSize: '14px' },
  title: {
    fontSize: '18px',
    fontWeight: '500',
    marginBottom: theme.spacing(1),
  },
}))

const EventCard = ({
  currentEvent,
  setCurrentEvent,
  setEvent,
  canEdit,
  handleOpenDropdown,
  eventType,
  isWithoutDate = false,
}) => {
  const classes = useStyles()
  const theme = useTheme()
  const { currentEventId, setCurrentEventId } = useContext(PlanningContext)

  return (
    <Card
      className={clsx(classes.cardPlan, {
        [classes.hoveredEvent]: currentEvent.id === currentEventId,
      })}
      onMouseEnter={() => {
        setCurrentEventId(currentEvent.id)
      }}
      onMouseLeave={() => {
        setCurrentEventId()
      }}
    >
      <CardActionArea onClick={() => setEvent(currentEvent)}>
        <CardContent sx={{ padding: '15px' }}>
          <Box className={classes.cardGrid}>
            {/* <PlanningCardIcon
              icon={currentEvent.icon}
              eventType={eventType}
              photo={currentEvent?.location?.photos?.length > 0 && currentEvent.location.photos[0]}
            /> */}
            <Box>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplate: '1fr / 1fr min-content',
                  alignItems: 'center',
                  height: '24px',
                  position: 'relative',
                  top: '-6px',
                }}
              >
                <Box>
                  {currentEvent.startTime &&
                    currentEvent.endTime &&
                    !isSameDay(
                      stringToDate(currentEvent.startTime, 'yyyy-MM-dd HH:mm'),
                      stringToDate(currentEvent.endTime, 'yyyy-MM-dd HH:mm')
                    ) && (
                      <Typography color="primary" className={classes.date}>
                        {`${format(stringToDate(currentEvent.startTime), 'd MMMM', {
                          locale: frLocale,
                        })} - ${format(stringToDate(currentEvent.endTime), 'd MMMM', {
                          locale: frLocale,
                        })}`}
                      </Typography>
                    )}
                  {/* {currentEvent.startTime && (
                    <Typography color="primary" className={classes.date}>
                      {isWithoutDate &&
                        `${format(stringToDate(currentEvent.startTime), 'd MMMM', {
                          locale: frLocale,
                        })} | `}
                      {`${format(stringToDate(currentEvent.startTime), 'HH:mm', {
                        locale: frLocale,
                      })} - ${format(stringToDate(currentEvent.endTime), 'HH:mm', {
                        locale: frLocale,
                      })}`}
                    </Typography>
                  )} */}
                </Box>
                {/* {eventType === EVENT_TYPES[1] && (
                  <Typography color="primary" className={classes.date}>
                    {isSameDay(
                      rCTFF(currentEvent.flights[0].date),
                      rCTFF(currentEvent.flights[currentEvent.flights.length - 1].data.timings[1])
                    )
                      ? `${rCTFF(
                          currentEvent.flights[0].data.timings[0],
                          isWithoutDate ? 'd MMMM | HH:mm' : 'HH:mm'
                        )} - ${rCTFF(
                          currentEvent.flights[currentEvent.flights.length - 1].data.timings[1],
                          'HH:mm'
                        )}`
                      : `${rCTFF(currentEvent.flights[0].date, 'd MMMM')} - ${rCTFF(
                          currentEvent.flights[currentEvent.flights.length - 1].data.timings[1],
                          'd MMMM'
                        )}`}
                  </Typography>
                )} */}
                {eventType === EVENT_TYPES[3] && (
                  <Typography color="primary" className={classes.date}>
                    {isSameDay(
                      stringToDate(currentEvent.transports[0].startTime),
                      stringToDate(
                        currentEvent.transports[currentEvent.transports.length - 1].endTime
                      )
                    )
                      ? `${format(
                          stringToDate(currentEvent.transports[0].startTime),
                          isWithoutDate ? 'd MMMM | HH:mm' : 'HH:mm',
                          {
                            locale: frLocale,
                          }
                        )} - ${format(
                          stringToDate(
                            currentEvent.transports[currentEvent.transports.length - 1].endTime
                          ),
                          'HH:mm',
                          {
                            locale: frLocale,
                          }
                        )}`
                      : `${format(stringToDate(currentEvent.transports[0].startTime), 'd MMMM', {
                          locale: frLocale,
                        })} - ${format(
                          stringToDate(
                            currentEvent.transports[currentEvent.transports.length - 1].endTime
                          ),
                          'd MMMM',
                          {
                            locale: frLocale,
                          }
                        )}`}
                  </Typography>
                )}
                {canEdit && (
                  <CardActions sx={{ padding: '0' }}>
                    <IconButton
                      size="small"
                      onClick={event => {
                        event.stopPropagation()
                        setCurrentEvent(currentEvent)
                        handleOpenDropdown(event)
                      }}
                    >
                      <MoreHoriz />
                    </IconButton>
                  </CardActions>
                )}
              </Box>
              {currentEvent.title && (
                <Typography className={classes.title}>
                  {currentEvent.title.length > 39
                    ? `${currentEvent.title.substring(0, 39)}...`
                    : currentEvent.title}
                </Typography>
              )}
              {currentEvent?.description && (
                <Typography
                  sx={{ fontSize: '14px', color: 'inherit', marginBottom: theme.spacing(1) }}
                >
                  {currentEvent.description}
                </Typography>
              )}
              {currentEvent.location?.label && (
                <Box
                  display="flex"
                  alignItems="start"
                  sx={{ color: theme.palette.grey['4f'], marginBottom: theme.spacing(1) }}
                >
                  <Room
                    fontSize="small"
                    color="inherit"
                    sx={{ position: 'relative', left: '-3px' }}
                  />
                  <Typography sx={{ fontSize: '14px', color: 'inherit' }}>
                    {currentEvent.location.label}
                  </Typography>
                </Box>
              )}
              {eventType === EVENT_TYPES[1] && (
                <Box sx={{ marginBottom: theme.spacing(1) }}>
                  <Typography className={classes.title} sx={{ marginBottom: '0!important' }}>
                    {currentEvent.flights.length > 1
                      ? `${currentEvent.flights.length - 1} escale${
                          currentEvent.flights.length - 1 > 1 ? 's' : ''
                        }`
                      : 'Vol direct'}
                  </Typography>
                  <Typography>{`Arrivée prévue : ${
                    currentEvent.flights[currentEvent.flights.length - 1].data.timings[1]
                      ? rCTFF(
                          currentEvent.flights[currentEvent.flights.length - 1].data?.timings[1],
                          'HH:mm'
                        )
                      : "Heure d'arrivée non disponible"
                  }`}</Typography>
                </Box>
              )}
              <CustomAvatar
                propsClasses={classes.avatarGroup}
                peopleIds={currentEvent.participatingTravelers}
              />
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default EventCard
