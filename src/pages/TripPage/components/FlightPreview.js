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
    margin: '1rem 0',
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
      {/* --------------------------- First Departure ------------------------------- */}
      <Box className={classes.flightGrid} justifyContent="space-between" sx={{ marginTop: '15px' }}>
        <Box className={classes.planeIconBack}>
          <FlightTakeoffIcon className={classes.planeIcon} />
        </Box>
        <Box>
          <Typography className={classes.airportLabelTypo}>
            {flightArray[0].data.airports[0].label}
          </Typography>
          <Box>
            <Typography className={classes.iataCodeTypo}>
              {flightArray[0].data.airports[0].iataCode}
            </Typography>
          </Box>
        </Box>
        <Box className={classes.fontRight}>
          <Typography component="h4" className={classes.hourTypo}>
            {dateToString(
              stringToDate(flightArray[0].data.timings[0], 'yyyy-MM-dd HH:mm'),
              'HH:mm'
            )}
          </Typography>
          <Typography variant="body2" className={classes.durationTypo}>
            Vol:
            {flightArray[0].data.legs.length > 1
              ? `${flightArray[0].data.legs[0].hours} h ${flightArray[0].data.legs[0].minutes} min`
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
          </Typography>
        </Box>
      </Box>
      <Box className={classes.line}>
        <img src={Line} alt="line" />
      </Box>
      {flightArray[0].data.airports.length > 2 &&
        flightArray[0].data.airports
          .filter((airport, airportIndex, currentAirports) => {
            if (airportIndex === currentAirports.length - 1) {
              return false
            }
            if (airportIndex === 0) {
              return false
            }
            return true
          })
          .map((airport, airportIndex) => (
            <>
              {/* ---------------------------Implicite Arrival ------------------------------- */}
              <Box className={classes.flightGrid} justifyContent="space-between">
                <Box className={classes.planebackgTransit1}>
                  <img
                    className={classes.planeIconTransit}
                    src={TransitPlane}
                    alt="transit plane"
                  />
                </Box>
                <Box>
                  <Typography className={classes.airportLabelTypo}>{airport.label}</Typography>
                  <Typography className={classes.iataCodeTypo}>{airport.iataCode}</Typography>
                </Box>
                <Box className={classes.fontRight}>
                  <Typography component="h4" className={classes.hourTypo}>
                    {addOrSubTravelTime(
                      firstFlightFirstDeparture,
                      flightArray[0].data.legs[0],
                      'HH:mm',
                      true,
                      airport.timeZoneOffset
                    )}
                  </Typography>
                  <Typography variant="body2" className={classes.durationTypo}>
                    {`Escale: ${formatDuration(
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
                      .replace('minute', 'min')}`}
                  </Typography>
                </Box>
              </Box>
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
                  <Typography className={classes.airportLabelTypo}>{airport.label}</Typography>
                  <Typography className={classes.iataCodeTypo}>{airport.iataCode}</Typography>
                </Box>
                <Box className={classes.fontRight}>
                  <Typography component="h4" className={classes.hourTypo}>
                    {addOrSubTravelTime(
                      flightArray[flightArray.length - 1].data.timings[1],
                      flightArray[flightArray.length - 1].data.legs[1],
                      'HH:mm',
                      false,
                      airport.timeZoneOffset
                    )}
                  </Typography>
                  <Typography variant="body2" className={classes.durationTypo}>
                    {`Vol: ${
                      flightArray[0].data.legs[flightArray[0].data.legs.length - 1].hours
                    } h ${
                      flightArray[0].data.legs[flightArray[0].data.legs.length - 1].minutes
                    } min`}
                  </Typography>
                </Box>
              </Box>
              <Box className={classes.line}>
                <img src={Line} alt="line" />
              </Box>
            </>
          ))}
      {flightArray.length > 1 && (
        <>
          {/* --------------------------- First Arrival ------------------------------- */}
          <Box className={classes.flightGrid} justifyContent="space-between">
            <Box className={classes.planebackgTransit1}>
              <img className={classes.planeIconTransit} src={TransitPlane} alt="transit plane" />
            </Box>
            <Box>
              <Typography>
                <Box component="span" fontWeight="bold">
                  {flightArray[0].data.airports[flightArray[0].data.airports.length - 1].iataCode}
                </Box>
              </Typography>
              <Typography>
                {flightArray[0].data.airports[flightArray[0].data.airports.length - 1].label}
              </Typography>
            </Box>
            <Box className={classes.fontRight}>
              <Typography component="h4" className={classes.hourTypo}>
                {rCTFF(flightArray[0].data.timings[1], 'HH:mm')}
              </Typography>
              <Typography variant="body2" className={classes.durationTypo}>
                {`Escale : 
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
              </Typography>
            </Box>
          </Box>

          {flightArray
            .filter((flight, flightIndex, currentFlights) => {
              if (flightIndex === currentFlights.length - 1) {
                return false
              }
              if (flightIndex === 0) {
                return false
              }
              return true
            })
            .map(({ data }, flightIndex, currentMapFlights) => (
              <>
                {/* --------------------------- Departure ------------------------------- */}
                <Box className={classes.flightGrid} justifyContent="space-between">
                  <Box className={classes.planebackgTransit2}>
                    <img
                      className={classes.planeIconTransit}
                      src={TransitPlane}
                      alt="transit plane"
                    />
                  </Box>
                  <Box>
                    <Typography>
                      <Box component="span" fontWeight="bold">
                        {data.airports[0].iataCode}
                      </Box>
                    </Typography>
                    <Typography>{data.airports[0].label}</Typography>
                  </Box>
                  <Box className={classes.fontRight}>
                    <Typography component="h4" className={classes.hourTypo}>
                      {(stringToDate(dateToString(data.timings[0])), 'HH:mm')}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Vol:
                      {formatDuration(
                        intervalToDuration({
                          start: rCTFF(data.timings[0]),
                          end: rCTFF(data.timings[1]),
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
                    </Typography>
                  </Box>
                </Box>
                <Box className={classes.line}>
                  <img src={Line} alt="line" />
                  <Checkbox />
                </Box>
                {data.airports.length > 2 &&
                  data.airports
                    .filter((airport, airportIndex, currentAirports) => {
                      if (airportIndex === currentAirports.length - 1) {
                        return false
                      }
                      if (airportIndex === 0) {
                        return false
                      }
                      return true
                    })
                    .map((airport, airportIndex) => (
                      <>
                        {/* ---------------------------Implicite Arrival ------------------------------- */}
                        <Box className={classes.flightGrid} justifyContent="space-between">
                          <Box className={classes.planebackgTransit1}>
                            <img
                              className={classes.planeIconTransit}
                              src={TransitPlane}
                              alt="transit plane"
                            />
                          </Box>
                          <Box>
                            <Typography>
                              <Box component="span" fontWeight="bold">
                                {airport.iataCode}
                              </Box>
                            </Typography>
                            <Typography>{airport.label}</Typography>
                          </Box>
                          <Box className={classes.fontRight}>
                            <Typography variant="h4">
                              <Box component="span" fontWeight="bold">
                                {addOrSubTravelTime(
                                  data.timings[0],
                                  data.legs[0],
                                  'HH:mm',
                                  true,
                                  airport.timeZoneOffset
                                )}
                              </Box>
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {`Escale: ${formatDuration(
                                renderStopoverTime(
                                  rCTFF(data.timings[0]),
                                  rCTFF(data.timings[1]),
                                  data.legs
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
                                .replace('minute', 'min')}`}
                            </Typography>
                          </Box>
                        </Box>
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
                            <Typography>
                              <Box component="span" fontWeight="bold">
                                {airport.iataCode}
                              </Box>
                            </Typography>
                            <Typography>{airport.label}</Typography>
                          </Box>
                          <Box className={classes.fontRight}>
                            <Typography variant="h4">
                              <Box component="span" fontWeight="bold">
                                {addOrSubTravelTime(
                                  data.timings[1],
                                  data.legs[1],
                                  'HH:mm',
                                  false,
                                  airport.timeZoneOffset
                                )}
                              </Box>
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Vol:
                              {formatDuration(
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
                            </Typography>
                          </Box>
                        </Box>
                        <Box className={classes.line}>
                          <img src={Line} alt="line" />
                          <Checkbox />
                        </Box>
                      </>
                    ))}
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
                    <Typography>
                      <Box component="span" fontWeight="bold">
                        {data.airports[1].iataCode}
                      </Box>
                    </Typography>
                    <Typography>{data.airports[1].label}</Typography>
                  </Box>
                  <Box className={classes.fontRight}>
                    <Typography variant="h4">
                      <Box component="span" fontWeight="bold">
                        {rCTFF(data.timings[1], 'HH:mm')}
                      </Box>
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {`Escale : 
                ${formatDuration(
                  intervalToDuration({
                    start: rCTFF(data.timings[1]),
                    end: rCTFF(
                      flightIndex !== currentMapFlights.length - 1
                        ? flightArray[flightIndex + 1].data.timings[0]
                        : flightArray[flightArray.length - 1].data.timings[0]
                    ),
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
                    </Typography>
                  </Box>
                </Box>
              </>
            ))}

          {/* --------------------------- Last departure------------------------------- */}
          <Box className={classes.flightGrid} justifyContent="space-between">
            <Box className={classes.planebackgTransit2}>
              <img className={classes.planeIconTransit} src={TransitPlane} alt="transit plane" />
            </Box>
            <Box>
              <Typography>
                <Box component="span" fontWeight="bold">
                  {lastAirportArray[0].iataCode}
                </Box>
              </Typography>
              <Typography>{lastAirportArray[0].label}</Typography>
            </Box>
            <Box className={classes.fontRight}>
              <Typography variant="h4">
                <Box component="span" fontWeight="bold">
                  {rCTFF(flightArray[flightArray.length - 1].data.timings[0], 'HH:mm')}
                </Box>
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Vol:
                {formatDuration(
                  intervalToDuration({
                    start: rCTFF(flightArray[flightArray.length - 1].data.timings[0]),
                    end: rCTFF(flightArray[flightArray.length - 1].data.timings[1]),
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
              </Typography>
            </Box>
          </Box>
          <Box className={classes.line}>
            <img src={Line} alt="line" />
          </Box>
        </>
      )}
      {flightArray[flightArray.length - 1].data.airports.length > 2 &&
        flightArray.length > 1 &&
        flightArray[flightArray.length - 1].data.airports
          .filter((airport, airportIndex, currentAirports) => {
            if (airportIndex === currentAirports.length - 1) {
              return false
            }
            if (airportIndex === 0) {
              return false
            }
            return true
          })
          .map((airport, airportIndex) => (
            <>
              {/* ---------------------------Implicite Arrival ------------------------------- */}
              <Box className={classes.flightGrid} justifyContent="space-between">
                <Box className={classes.planebackgTransit1}>
                  <img
                    className={classes.planeIconTransit}
                    src={TransitPlane}
                    alt="transit plane"
                  />
                </Box>
                <Box>
                  <Typography>
                    <Box component="span" fontWeight="bold">
                      {airport.iataCode}
                    </Box>
                  </Typography>
                  <Typography>{airport.label}</Typography>
                </Box>
                <Box className={classes.fontRight}>
                  <Typography variant="h4">
                    <Box component="span" fontWeight="bold">
                      {addOrSubTravelTime(
                        flightArray[flightArray.length - 1].data.timings[0],
                        flightArray[flightArray.length - 1].data.legs[0],
                        'HH:mm',
                        true,
                        airport.timeZoneOffset
                      )}
                    </Box>
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {`Escale: ${formatDuration(
                      renderStopoverTime(
                        rCTFF(flightArray[flightArray.length - 1].data.timings[0]),
                        rCTFF(flightArray[flightArray.length - 1].data.timings[1]),
                        flightArray[flightArray.length - 1].data.legs
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
                      .replace('minute', 'min')}`}
                  </Typography>
                </Box>
              </Box>
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
                  <Typography>
                    <Box component="span" fontWeight="bold">
                      {airport.iataCode}
                    </Box>
                  </Typography>
                  <Typography>{airport.label}</Typography>
                </Box>
                <Box className={classes.fontRight}>
                  <Typography variant="h4">
                    <Box component="span" fontWeight="bold">
                      {addOrSubTravelTime(
                        flightArray[flightArray.length - 1].data.timings[1],
                        flightArray[flightArray.length - 1].data.legs[1],
                        'HH:mm',
                        false,
                        airport.timeZoneOffset
                      )}
                    </Box>
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Vol:
                    {formatDuration(
                      intervalToDuration({
                        start: rCTFF(flightArray[flightArray.length - 1].data.timings[0]),
                        end: rCTFF(flightArray[flightArray.length - 1].data.timings[1]),
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
                  </Typography>
                </Box>
              </Box>
              <Box className={classes.line}>
                <img src={Line} alt="line" />
              </Box>
            </>
          ))}
      {/* --------------------------- Last Arrival ------------------------------- */}
      <Box className={classes.flightGrid} m="1rem 0" justifyContent="space-between">
        <Box className={classes.planeIconBack}>
          <FlightLandIcon className={classes.planeIcon} />
        </Box>
        <Box>
          <Typography className={classes.airportLabelTypo}>
            {
              flightArray[flightArray.length - 1].data.airports[
                flightArray[flightArray.length - 1].data.airports.length - 1
              ].label
            }
          </Typography>
          <Typography className={classes.iataCodeTypo}>
            {
              flightArray[flightArray.length - 1].data.airports[
                flightArray[flightArray.length - 1].data.airports.length - 1
              ].iataCode
            }
          </Typography>
        </Box>
        <Box className={classes.fontRight}>
          <Typography component="h4" className={classes.hourTypo}>
            {rCTFF(flightArray[flightArray.length - 1].data.timings[1], 'HH:mm')}
          </Typography>
        </Box>
      </Box>
    </>
  )
}
export default FlightPreview
