import React, { useContext, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { makeStyles, useTheme } from '@mui/styles'
import { Remove } from '@mui/icons-material'

import DatePicker from '@mui/lab/DatePicker'
import Info from '@mui/icons-material/Info'
import { add, isSameDay, sub } from 'date-fns'
import { DateTimePicker } from '@mui/lab'

import { rCTFF } from '../../../helper/functions'
import { PlanningContext } from '../../../contexts/planning'
import { EVENT_TYPES } from '../../../helper/constants'

const useStyles = makeStyles(theme => ({
  gridContainer: {
    display: 'flex',
    flexDirection: 'column',
    gridGap: '20px',
    backgroundColor: theme.palette.grey.f7,
    borderRadius: '10px',
    padding: '30px 15px',
  },
  flightNumberInput: {
    maxHeight: '56px',
  },
  gridButton: {
    gridColumn: '1 / 3',
    color: 'white',
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      color: 'white',
      backgroundColor: theme.palette.primary.main,
    },
  },
  flightInfoTypo: {
    gridColumn: '1 / 3',
    color: theme.palette.grey['33'],
  },
  flightDataTextfield: {
    gridColumn: '1 / 3',
  },
  helperFlightFound: {
    backgroundColor: theme.palette.primary.ultraLight,
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: theme.spacing(2),
    gridColumn: '1 / 3',
    justifySelf: 'center',
    alignSelf: 'center',
    borderRadius: '10px',
  },
  helperFlightNotFound: {
    backgroundColor: theme.palette.secondary.ultraLight,
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: theme.spacing(2),
    gridColumn: '1 / 3',
    justifySelf: 'center',
    borderRadius: '10px',
  },
}))

const NewFlight = ({
  shouldHaveNumber,
  date,
  number,
  flights,
  setFlights,
  index,
  dateRange,
  fetchFlight,
  needFetch,
  flightData,
}) => {
  const classes = useStyles()
  const theme = useTheme()
  const [isFetching, setIsFetching] = useState(false)
  const [currentFlightData, setCurrentFlightData] = useState()
  const [displayHelperText, setDisplayHelperText] = useState('')

  useEffect(() => {
    if (flightData) {
      setCurrentFlightData(flightData)
    }
    console.log({ flightData })
  }, [flightData, isFetching])

  const handleChange = async (event, target) => {
    let tempFlights
    if (target === 'data') {
      setIsFetching(true)
      const resultData = await event
      setIsFetching(false)
      if (!resultData?.error) {
        tempFlights = resultData
        setDisplayHelperText('flightFound')
      } else {
        setDisplayHelperText('flightNotFound')
      }
    }

    setFlights(prevState => {
      const tempPrevState = [...prevState]
      if (target === 'date') {
        tempPrevState[index].date = event
        if (!tempPrevState[index].needFetch) {
          tempPrevState[index].needFetch = true
          setDisplayHelperText(false)
        }
      } else if (target === 'data') {
        if (tempFlights) {
          tempPrevState[index].data = tempFlights
          tempPrevState[index].needFetch = false
        } else {
          tempPrevState[index].data = ''
          tempPrevState[index].needFetch = false
        }
      } else {
        tempPrevState[index][target] = event.target.value
        if (!tempPrevState[index].needFetch) {
          tempPrevState[index].needFetch = true
          setDisplayHelperText(false)
        }
      }
      return tempPrevState
    })
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        {/* <Typography
          component="h3"
          sx={{
            fontSize: '28px',
            fontWeight: '400',
            fontFamily: 'Vesper Libre',
            [theme.breakpoints.down('sm')]: {
              fontFamily: theme.typography.fontFamily,
              fontSize: '28px',
            },
          }}
        >
          Vol{shouldHaveNumber && ` nº${index + 1}`}
        </Typography> */}
        {index > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              aria-label="delete flight"
              onClick={() =>
                setFlights(flights.filter((flight, flightIndex) => flightIndex !== index))
              }
              sx={{ padding: '0', mr: 2 }}
            >
              <Remove />
            </IconButton>
            <Typography
              sx={{ fontSize: '17px', [theme.breakpoints.down('sm')]: { fontSize: '14px' } }}
            >
              Retirer ce vol
            </Typography>
          </Box>
        )}
      </Box>
      <Box className={classes.gridContainer}>
        <DatePicker
          label="Date du vol"
          inputVariant="filled"
          placeholder="__/__/____"
          format="dd/MM/yyyy"
          minDate={rCTFF(dateRange[0])}
          maxDate={rCTFF(dateRange[1])}
          value={date}
          onChange={event => handleChange(event, 'date')}
          renderInput={params => <TextField {...params} />}
          DialogProps={{ sx: { zIndex: '10000' } }}
        />
        <TextField
          variant="filled"
          label="Numéro de vol"
          value={number}
          onChange={event => handleChange(event, 'number')}
          InputProps={{ classes: { root: classes.flightNumberInput } }}
        />
        {displayHelperText === 'flightFound' && currentFlightData ? (
          <Box className={classes.helperFlightFound}>
            <Info color="primary" sx={{ marginRight: theme.spacing(1) }} />
            <Typography
              variant="body2"
              sx={{ fontSize: '1rem', textAlign: 'center' }}
              className={classes.flightInfoTypo}
            >
              Vol trouvé
            </Typography>
          </Box>
        ) : (
          <Button
            onClick={() => handleChange(fetchFlight(index), 'data')}
            disabled={number.length < 3 || !needFetch}
            className={classes.gridButton}
            sx={{
              width: '140px',
              justifySelf: 'center',
              '&.Mui-disabled': {
                backgroundColor: theme.palette.grey.f7,
                border: '1px solid lightgrey',
              },
              alignSelf: 'center',
            }}
          >
            {isFetching ? <CircularProgress sx={{ color: 'white' }} size={24} /> : 'Valider le vol'}
          </Button>
        )}
        {displayHelperText === 'flightNotFound' && (
          <Box className={classes.helperFlightNotFound}>
            <Info color="secondary" sx={{ marginRight: theme.spacing(1) }} />
            <Typography
              variant="body2"
              sx={{ fontSize: '1rem', textAlign: 'center', color: theme.palette.secondary.main }}
              className={classes.flightInfoTypo}
            >
              Vol non trouvé
            </Typography>
          </Box>
        )}

        {currentFlightData && !needFetch && displayHelperText === 'flightFound' && (
          <>
            {/* <TextField
              readOnly
              value={currentFlightData.airports[0].label}
              label="Lieu de départ"
              className={classes.flightDataTextfield}
            />
            <DateTimePicker
              inputVariant="filled"
              placeholder="__/__/____ __:__"
              format="dd/MM/yyyy HH:mm"
              ampm={false}
              disableOpenPicker
              value={currentFlightData.timings[0]}
              label="Heure de départ"
              renderInput={params => (
                <TextField {...params} readOnly className={classes.flightDataTextfield} />
              )}
            /> */}
            {currentFlightData.legs.map((leg, legIndex) => (
              <>
                {legIndex === 0 && (
                  <TextField
                    readOnly
                    value={
                      flightData.airports
                        .map(airport => {
                          if (airport.iataCode === leg.departureIata) {
                            return airport.label
                          }
                          return ''
                        })
                        .filter(label => label !== '')[0]
                    }
                    label="Lieu d'escale"
                    className={classes.flightDataTextfield}
                  />
                )}
                <DateTimePicker
                  inputVariant="filled"
                  placeholder="__/__/____ __:__"
                  format="dd/MM/yyyy HH:mm"
                  ampm={false}
                  disableOpenPicker
                  value={leg.departure_time}
                  label="Heure de départ"
                  renderInput={params => (
                    <TextField {...params} readOnly className={classes.flightDataTextfield} />
                  )}
                />
                <DateTimePicker
                  inputVariant="filled"
                  placeholder="__/__/____ __:__"
                  format="dd/MM/yyyy HH:mm"
                  ampm={false}
                  disableOpenPicker
                  value={leg.arrival_time}
                  label="Heure d'arrivée"
                  renderInput={params => (
                    <TextField {...params} readOnly className={classes.flightDataTextfield} />
                  )}
                />
                <TextField
                  readOnly
                  value={
                    flightData.airports
                      .map(airport => {
                        if (airport.iataCode === leg.arrivalIata) {
                          return airport.label
                        }
                        return ''
                      })
                      .filter(label => label !== '')[0]
                  }
                  label="Lieu d'escale"
                  className={classes.flightDataTextfield}
                />
              </>
            ))}
            {/* <TextField
              readOnly
              value={currentFlightData.airports[currentFlightData.airports.length - 1].label}
              label="Lieu d'arrivée"
              className={classes.flightDataTextfield}
            />
            <DateTimePicker
              inputVariant="filled"
              placeholder="__/__/____ __:__"
              format="dd/MM/yyyy HH:mm"
              disableOpenPicker
              ampm={false}
              value={currentFlightData.timings[1]}
              label="Heure d'arrivée"
              renderInput={params => (
                <TextField {...params} readOnly className={classes.flightDataTextfield} />
              )}
            /> */}
          </>
        )}
      </Box>
    </Box>
  )
}

export default NewFlight
