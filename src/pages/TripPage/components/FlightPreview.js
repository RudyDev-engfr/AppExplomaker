import React, { useEffect } from 'react'
import makeStyles from '@mui/styles/makeStyles'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import { Checkbox, useTheme } from '@mui/material'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import FlightLandIcon from '@mui/icons-material/FlightLand'
import { format, formatDuration, intervalToDuration } from 'date-fns'
import frLocale from 'date-fns/locale/fr'

import {
  addOrSubTravelTime,
  applyTimezoneOffsetFromAmadeus,
  dateToString,
  formatDateInTimezone,
  rCTFF,
  renderStopoverTime,
  stringToDate,
} from '../../../helper/functions'

import TransitPlane from '../../../images/transitPlane.svg'
import Line from '../../../images/Line.svg'

const useStyles = makeStyles(theme => ({
  line: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '50px',
    padding: '5px 0',
  },
  planeIcon: {
    fontSize: '30px',
    color: theme.palette.primary.main,
  },
  planebackgTransit1: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '50px',
    height: '60px',
    backgroundColor: theme.palette.primary.ultraLight,
    borderRadius: '50% 50% 0 0',
  },
  planebackgTransit2: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '50px',
    height: '60px',
    backgroundColor: theme.palette.primary.ultraLight,
    borderRadius: '0 0 50% 50%',
  },
  planeIconTransit: {
    width: '40px',
    height: '40px',
  },
  planeIconBack: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.ultraLight,
    color: theme.palette.primary.main,
  },
  flightGrid: {
    display: 'grid',
    gridTemplateColumns: '20% 60% 20%',
    height: '60px',
    // columnGap: '10px',
    alignItems: 'center',
  },
  airportLabelTypo: {
    fontSize: '14px',
    fontWeight: 700,
  },
  iataCodeTypo: {
    fontSize: '12px',
  },
  hourTypo: {
    fontSize: '24px',
    fontWeight: 400,
    lineHeight: 1.25,
    fontFamily: 'Vesper Libre',
  },
  durationTypo: {
    fontSize: '12px',
    color: theme.palette.grey['82'],
  },
}))

const FlightPreview = ({ flightArray }) => {
  const classes = useStyles()
  const theme = useTheme()
  const lastAirportArray = flightArray[flightArray.length - 1].data.airports
  const firstFlightFirstDeparture = flightArray[0].data.timings[0]
  const lastFlightLastArrival = flightArray[flightArray.length - 1].data.timings[1]

  return (
    <>
      {flightArray.map((flight, flightIndex, currentFlightArray) =>
        flight.data.legs.map((leg, legIndex, legArray) => (
          <Box key={leg.departure_time}>
            {flightIndex === 0 && legIndex === 0 && (
              <>
                {/* --------------------------- First Departure ------------------------------- */}
                <Box
                  className={classes.flightGrid}
                  justifyContent="space-between"
                  sx={{ marginTop: '15px' }}
                >
                  <Box className={classes.planeIconBack}>
                    <FlightTakeoffIcon className={classes.planeIcon} />
                  </Box>
                  <Box>
                    <Typography className={classes.airportLabelTypo}>
                      {
                        flight.data.airports
                          .map(airport => {
                            if (airport.iataCode === leg.departureIata) {
                              return airport.label
                            }
                            return ''
                          })
                          .filter(label => label !== '')[0]
                      }
                    </Typography>
                    <Box>
                      <Typography className={classes.iataCodeTypo}>{leg.departureIata}</Typography>
                    </Box>
                  </Box>
                  <Box className={classes.fontRight}>
                    <Typography component="h4" className={classes.hourTypo}>
                      {dateToString(stringToDate(leg.departure_time, 'yyyy-MM-dd HH:mm'), 'HH:mm')}
                    </Typography>
                    {/* <Typography variant="body2" className={classes.durationTypo}>
                      Vol:
                      {flightArray[0].data.legs.length > 1
              ? `${flightArray[0].data.legs[0].duration.hours} h ${flightArray[0].data.legs[0].duration.minutes} min`
              : formatDuration(
                  intervalToDuration({
                    start: rCTFF(flightArray[0].data.timings[0]),
                    end: rCTFF(flightArray[0].data.timings[1]),
                  }),
                  {
                    format: ['days', 'hours', 'minutes'],
                    locale: frLocale,
                  }
                )
                  .replace('jours', 'j')
                  .replace('jour', 'j')
                  .replace('heures', 'h')
                  .replace('heure', 'h')
                  .replace('minutes', 'min')
                  .replace('minute', 'min')}
                    </Typography> */}
                    {/* TODO A modifier */}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box className={classes.line} sx={{ marginRight: '15px' }}>
                    <img src={Line} alt="line" />
                  </Box>
                  <Box>
                    <Typography className={classes.durationTypo}>
                      temps de vol: {leg.duration.hours} h {leg.duration.minutes} min
                    </Typography>
                  </Box>
                </Box>
              </>
            )}
            {(flight.data.legs.length > 1 || currentFlightArray.length > 1) &&
              legIndex === 0 &&
              flightIndex === 0 && (
                <Box className={classes.flightGrid} justifyContent="space-between">
                  {/* ---------------------------Implicite Arrival ------------------------------- */}
                  <Box className={classes.planebackgTransit1}>
                    <img
                      className={classes.planeIconTransit}
                      src={TransitPlane}
                      alt="transit plane"
                    />
                  </Box>
                  <Box>
                    <Typography className={classes.airportLabelTypo}>
                      {
                        flight.data.airports
                          .map(airport => {
                            if (airport.iataCode === leg.arrivalIata) {
                              return airport.label
                            }
                            return ''
                          })
                          .filter(label => label !== '')[0]
                      }
                    </Typography>
                    <Typography className={classes.iataCodeTypo}>{leg.arrivalIata}</Typography>
                  </Box>
                  <Box className={classes.fontRight}>
                    <Typography component="h4" className={classes.hourTypo}>
                      {dateToString(stringToDate(leg.arrival_time, 'yyyy-MM-dd HH:mm'), 'HH:mm')}
                    </Typography>
                    <Typography variant="body2" className={classes.durationTypo}>
                      {/* {`Escale: ${formatDuration(
                      renderStopoverTime(
                        rCTFF(firstFlightFirstDeparture),
                        rCTFF(lastFlightLastArrival),
                        flightArray[0].data.legs
                      ),
                      {
                        format: ['days', 'hours', 'minutes'],
                        locale: frLocale,
                      }
                    )
                      .replace('jours', 'j')
                      .replace('jour', 'j')
                      .replace('heures', 'h')
                      .replace('heure', 'h')
                      .replace('minutes', 'min')
                      .replace('minute', 'min')}`} */}
                      {/* TODO à modifier */}
                    </Typography>
                  </Box>
                </Box>
              )}
            {currentFlightArray.length > 1 &&
              flightArray[0].data.legs.length === 1 &&
              flightIndex > 0 && (
                <>
                  {/* ---------------------------  Implicite Departure ------------------------------- */}
                  <Box className={classes.flightGrid} justifyContent="space-between">
                    <Box className={classes.planebackgTransit2}>
                      <img
                        className={classes.planeIconTransit}
                        src={TransitPlane}
                        alt="transit plane"
                      />
                    </Box>
                    <Box>
                      <Typography className={classes.airportLabelTypo}>
                        {
                          flight.data.airports
                            .map(airport => {
                              if (airport.iataCode === leg.departureIata) {
                                return airport.label
                              }
                              return ''
                            })
                            .filter(label => label !== '')[0]
                        }
                      </Typography>
                      <Typography className={classes.iataCodeTypo}>{leg.departureIata}</Typography>
                    </Box>
                    <Box className={classes.fontRight}>
                      <Typography component="h4" className={classes.hourTypo}>
                        {dateToString(
                          stringToDate(leg.departure_time, 'yyyy-MM-dd HH:mm'),
                          'HH:mm'
                        )}
                      </Typography>
                      <Typography variant="body2" className={classes.durationTypo}>
                        {/* {`Vol: ${flightArray[0].data.legs[flightArray[0].data.legs.length - 1].hours} h ${
                      flightArray[0].data.legs[flightArray[0].data.legs.length - 1].minutes
                    } min`} */}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box className={classes.line} sx={{ marginRight: '15px' }}>
                      <img src={Line} alt="line" />
                    </Box>
                    <Box>
                      <Typography className={classes.durationTypo}>
                        temps de vol: {leg.duration.hours} h {leg.duration.minutes} min
                      </Typography>
                    </Box>
                  </Box>
                </>
              )}
            {legIndex !== 0 && (
              <>
                {/* ---------------------------  Implicite Departure ------------------------------- */}
                <Box className={classes.flightGrid} justifyContent="space-between">
                  <Box className={classes.planebackgTransit2}>
                    <img
                      className={classes.planeIconTransit}
                      src={TransitPlane}
                      alt="transit plane"
                    />
                  </Box>
                  <Box>
                    <Typography className={classes.airportLabelTypo}>
                      {
                        flight.data.airports
                          .map(airport => {
                            if (airport.iataCode === leg.departureIata) {
                              return airport.label
                            }
                            return ''
                          })
                          .filter(label => label !== '')[0]
                      }
                    </Typography>
                    <Typography className={classes.iataCodeTypo}>{leg.departureIata}</Typography>
                  </Box>
                  <Box className={classes.fontRight}>
                    <Typography component="h4" className={classes.hourTypo}>
                      {dateToString(stringToDate(leg.departure_time, 'yyyy-MM-dd HH:mm'), 'HH:mm')}
                    </Typography>
                    <Typography variant="body2" className={classes.durationTypo}>
                      {/* {`Vol: ${flightArray[0].data.legs[flightArray[0].data.legs.length - 1].hours} h ${
                    flightArray[0].data.legs[flightArray[0].data.legs.length - 1].minutes
                  } min`} */}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box className={classes.line} sx={{ marginRight: '15px' }}>
                    <img src={Line} alt="line" />
                  </Box>
                  <Box>
                    <Typography className={classes.durationTypo}>
                      temps de vol: {leg.duration.hours > 0 && `${leg.duration.hours} h`}{' '}
                      {leg.duration.minutes > 0 && `${leg.duration.minutes} min`}
                    </Typography>
                  </Box>
                </Box>
              </>
            )}

            {legIndex !== legArray.length - 1 && legIndex !== 0 && (
              <>
                {/* --------------------------- Arrival ------------------------------- */}
                <Box className={classes.flightGrid} justifyContent="space-between">
                  <Box className={classes.planebackgTransit1}>
                    <img
                      className={classes.planeIconTransit}
                      src={TransitPlane}
                      alt="transit plane"
                    />
                  </Box>
                  <Box>
                    <Typography className={classes.airportLabelTypo}>
                      {
                        flight.data.airports
                          .map(airport => {
                            if (airport.iataCode === leg.arrivalIata) {
                              return airport.label
                            }
                            return ''
                          })
                          .filter(label => label !== '')[0]
                      }
                    </Typography>
                    <Typography>
                      <Box className={classes.iataCodeTypo}>{leg.arrivalIata}</Box>
                    </Typography>
                  </Box>
                  <Box className={classes.fontRight}>
                    <Typography component="h4" className={classes.hourTypo}>
                      {dateToString(stringToDate(leg.arrival_time, 'yyyy-MM-dd HH:mm'), 'HH:mm')}
                    </Typography>
                    <Typography variant="body2" className={classes.durationTypo}>
                      {/* {`Escale : 
                ${formatDuration(
                  intervalToDuration({
                    start: rCTFF(flightArray[0].data.timings[1]),
                    end: rCTFF(flightArray[1].data.timings[0]),
                  }),
                  {
                    format: ['days', 'hours', 'minutes'],
                    locale: frLocale,
                  }
                )
                  .replace('jours', 'j')
                  .replace('jour', 'j')
                  .replace('heures', 'h')
                  .replace('heure', 'h')
                  .replace('minutes', 'min')
                  .replace('minute', 'min')}`} 
                  TODO A MODIFIER */}
                    </Typography>
                  </Box>
                </Box>
              </>
            )}

            {flightIndex === currentFlightArray.length - 1 && legIndex === legArray.length - 1 && (
              <>
                {/* --------------------------- Last Arrival ------------------------------- */}
                <Box className={classes.flightGrid} justifyContent="space-between">
                  <Box className={classes.planeIconBack}>
                    <FlightLandIcon className={classes.planeIcon} />
                  </Box>
                  <Box>
                    <Typography className={classes.airportLabelTypo}>
                      {
                        flightArray[flightArray.length - 1].data.airports
                          .map(airport => {
                            if (
                              airport.iataCode ===
                              flightArray[flightArray.length - 1].data.legs[
                                flightArray[flightArray.length - 1].data.legs.length - 1
                              ].arrivalIata
                            ) {
                              return airport.label
                            }
                            return ''
                          })
                          .filter(label => label !== '')[0]
                      }
                    </Typography>
                    <Typography className={classes.iataCodeTypo}>
                      {
                        flightArray[flightArray.length - 1].data.legs[
                          flightArray[flightArray.length - 1].data.legs.length - 1
                        ].arrivalIata
                      }
                    </Typography>
                  </Box>
                  <Box className={classes.fontRight}>
                    <Typography component="h4" className={classes.hourTypo}>
                      {dateToString(stringToDate(leg.arrival_time, 'yyyy-MM-dd HH:mm'), 'HH:mm')}
                    </Typography>
                  </Box>
                </Box>
              </>
            )}
            {/* <Typography>
              vol {flightIndex} trajet {legIndex} non conditionné
            </Typography> */}
          </Box>
        ))
      )}
    </>
  )
}
export default FlightPreview
