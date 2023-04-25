import React, { useContext, useEffect, useState } from 'react'
import { Box, Button, CircularProgress, TextField, Typography, useTheme } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import DatePicker from '@mui/lab/DatePicker'
import Info from '@mui/icons-material/Info'
import { add, isSameDay, sub } from 'date-fns'
import { DateTimePicker } from '@mui/lab'

import { rCTFF } from '../../../helper/functions'
import { PlanningContext } from '../../../contexts/planning'
import { EVENT_TYPES } from '../../../helper/constants'

const useStyles = makeStyles(theme => ({
  marginBottom: {
    marginBottom: theme.spacing(4),
  },
  gridContainer: {
    display: 'grid',
    gridTemplate: 'auto / 1fr 1fr',
    gridGap: theme.spacing(2.5),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey.f7,
    borderRadius: '10px',
  },
  flightNumberInput: {
    maxHeight: '56px',
  },
  bold: {
    fontWeight: 'bold',
  },
  gridButton: {
    gridColumn: '1 / 3',
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
    <Box className={classes.marginBottom}>
      <Typography variant="h3" className={classes.bold}>
        Vol{shouldHaveNumber && ` nº${index + 1}`}
      </Typography>
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
              className={classes.gridButton}
            >
              Vol trouvé
            </Typography>
          </Box>
        ) : (
          <Button
            onClick={() => handleChange(fetchFlight(index), 'data')}
            disabled={number.length < 3 || !needFetch}
            className={classes.gridButton}
          >
            {isFetching ? <CircularProgress color="primary" size={24} /> : 'Valider le vol'}
          </Button>
        )}
        {displayHelperText === 'flightNotFound' && (
          <Box className={classes.helperFlightNotFound}>
            <Info color="secondary" sx={{ marginRight: theme.spacing(1) }} />
            <Typography
              variant="body2"
              sx={{ fontSize: '1rem', textAlign: 'center', color: theme.palette.secondary.main }}
              className={classes.gridButton}
            >
              Vol non trouvé
            </Typography>
          </Box>
        )}

        {currentFlightData && !needFetch && displayHelperText === 'flightFound' && (
          <>
            <TextField
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
            />
            {currentFlightData.airports.length > 2 &&
              currentFlightData.airports
                .filter(
                  (airport, airportIndex, airportArray) =>
                    airportIndex !== 0 && airportIndex !== airportArray.length - 1
                )
                .map(airport => (
                  <>
                    <DateTimePicker
                      inputVariant="filled"
                      placeholder="__/__/____ __:__"
                      format="dd/MM/yyyy HH:mm"
                      ampm={false}
                      disableOpenPicker
                      value={add(rCTFF(currentFlightData.timings[0]), {
                        hours: currentFlightData.legs[0].hours,
                        minutes: currentFlightData.legs[0].minutes,
                      })}
                      label="Heure d'arrivée"
                      renderInput={params => (
                        <TextField {...params} readOnly className={classes.flightDataTextfield} />
                      )}
                    />
                    <TextField
                      readOnly
                      value={airport.label}
                      label="Lieu d'escale"
                      className={classes.flightDataTextfield}
                    />
                    <DateTimePicker
                      inputVariant="filled"
                      placeholder="__/__/____ __:__"
                      format="dd/MM/yyyy HH:mm"
                      ampm={false}
                      disableOpenPicker
                      value={sub(rCTFF(currentFlightData.timings[1]), {
                        hours: currentFlightData.legs[1].hours,
                        minutes: currentFlightData.legs[1].minutes,
                      })}
                      label="Heure de départ"
                      renderInput={params => (
                        <TextField {...params} readOnly className={classes.flightDataTextfield} />
                      )}
                    />
                  </>
                ))}
            <TextField
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
            />
          </>
        )}
      </Box>
    </Box>
  )
}

export default NewFlight
