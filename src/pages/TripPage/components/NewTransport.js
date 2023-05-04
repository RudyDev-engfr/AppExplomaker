import React, { useState } from 'react'
import { Box, TextField, Typography, useMediaQuery, useTheme } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import GooglePlacesAutocomplete, { geocodeByAddress } from 'react-google-places-autocomplete'
import DateTimePicker from '@mui/lab/DateTimePicker'
import { add } from 'date-fns'

import { rCTFF } from '../../../helper/functions'
import IconSlider from '../../../components/atoms/IconSlider'
import { EVENT_TYPES } from '../../../helper/constants'
import IconModal from '../../../components/atoms/IconModal'

const useStyles = makeStyles(theme => ({
  marginBottom: {
    marginBottom: theme.spacing(4),
  },
  gridContainer: {
    display: 'grid',
    gridTemplate: 'auto / repeat(4, 1fr)',
    gridGap: theme.spacing(2.5),
    backgroundColor: theme.palette.grey.f7,
    borderRadius: '10px',
    padding: theme.spacing(2),
  },
  description: {
    gridColumn: '1 / 4',
    [theme.breakpoints.down('sm')]: {
      width: 'unset',
      gridColumn: '1 / 5',
    },
  },
  filledInput: {
    height: 'unset',
    backgroundColor: 'red',
    [theme.breakpoints.down('sm')]: {
      height: 'unset',
    },
  },
  rootMultilineInput: {
    [theme.breakpoints.down('sm')]: {
      height: 'unset',
    },
  },
  iconSlider: {
    [theme.breakpoints.down('sm')]: {
      gridColumn: '1 / 5',
    },
  },
  iconModal: {
    alignSelf: 'center',
  },
}))

const NewTransport = ({
  setTransports,
  index,
  description,
  start,
  end,
  startTime,
  endTime,
  icon,
  shouldHaveNumber,
  dateRange,
}) => {
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  const [openIconModal, setOpenIconModal] = useState(false)

  const handleChange = (event, target) => {
    setTransports(prevState => {
      const tempPrevState = [...prevState]
      if (target === 'startTime' || target === 'endTime') {
        tempPrevState[index][target] = event
        if (target === 'startTime') {
          tempPrevState[index].endTime = add(event, { hours: 2 })
        }
      } else {
        tempPrevState[index][target] = event.target.value
      }
      return tempPrevState
    })
  }

  return (
    <Box className={classes.marginBottom}>
      <Typography
        variant="h3"
        sx={{
          fontSize: '30px',
          fontWeight: '500',
          [theme.breakpoints.down('sm')]: {
            fontFamily: theme.typography.fontFamily,
            fontSize: '28px',
            marginBottom: '20px',
          },
        }}
      >
        Transport{shouldHaveNumber && ` nº${index + 1}`}
      </Typography>
      <Box className={classes.gridContainer}>
        {matchesXs && (
          <IconSlider
            eventType={EVENT_TYPES[3]}
            selectedIcon={icon}
            setSelectedIcon={event => handleChange(event, 'icon')}
            propsClasses={classes.iconSlider}
          />
        )}
        <GooglePlacesAutocomplete
          minLengthAutocomplete={3}
          selectProps={{
            placeholder: 'De',
            value: start,
            onChange: (event, { action }) => {
              if (action === 'clear') {
                handleChange({ target: { value: '' } }, 'start')
              } else {
                geocodeByAddress(event.value.description).then(results => {
                  const destination = { ...event }
                  const shortCountryNameRef = results[0].address_components.filter(address =>
                    address.types.includes('country')
                  )
                  if (shortCountryNameRef.length > 0) {
                    destination.shortCountryName = shortCountryNameRef[0].short_name
                  }
                  handleChange({ target: { value: { ...destination } } }, 'start')
                })
              }
            },
            isClearable: true,
            styles: {
              container: provided => ({
                ...provided,
                width: '100%',
                gridColumn: '1 / 5',
              }),
              control: provided => ({
                ...provided,
                cursor: 'pointer',
                zIndex: '2',
                height: '60px',
              }),
              menu: provided => ({
                ...provided,
                zIndex: '3',
              }),
              singleValue: provided => ({
                ...provided,
                color: theme.palette.primary.main,
              }),
            },
          }}
        />
        <DateTimePicker
          label="Date"
          placeholder="__/__/____ __:__"
          format="dd/MM/yyyy HH:mm"
          minDate={rCTFF(dateRange[0])}
          maxDate={rCTFF(dateRange[1])}
          value={startTime}
          onChange={event => {
            /* if (!isValid(event) || isPast(event)) {
                  setDateError(true)
                } else if (dateError) {
                  setDateError(false)
                } */
            handleChange(event, 'startTime')
          }}
          renderInput={params => <TextField {...params} sx={{ gridColumn: '1 / 5' }} />}
          DialogProps={{ sx: { zIndex: '10000' } }}
        />
        <GooglePlacesAutocomplete
          minLengthAutocomplete={3}
          selectProps={{
            placeholder: 'À',
            value: end,
            onChange: (event, { action }) => {
              if (action === 'clear') {
                handleChange({ target: { value: '' } }, 'end')
              } else {
                geocodeByAddress(event.value.description).then(results => {
                  const destination = { ...event }
                  const shortCountryNameRef = results[0].address_components.filter(address =>
                    address.types.includes('country')
                  )
                  if (shortCountryNameRef.length > 0) {
                    destination.shortCountryName = shortCountryNameRef[0].short_name
                  }
                  handleChange({ target: { value: { ...destination } } }, 'end')
                })
              }
            },
            isClearable: true,
            styles: {
              container: provided => ({
                ...provided,
                width: '100%',
                gridColumn: '1 / 5',
              }),
              control: provided => ({
                ...provided,
                cursor: 'pointer',
                zIndex: '2',
                height: '60px',
              }),
              menu: provided => ({
                ...provided,
                zIndex: '3',
              }),
              singleValue: provided => ({
                ...provided,
                color: theme.palette.primary.main,
              }),
            },
          }}
        />
        <DateTimePicker
          label="Date"
          placeholder="__/__/____ __:__"
          format="dd/MM/yyyy HH:mm"
          minDate={rCTFF(dateRange[0])}
          maxDate={rCTFF(dateRange[1])}
          value={endTime}
          onChange={event => {
            /* if (!isValid(event) || isPast(event)) {
                  setDateError(true)
                } else if (dateError) {
                  setDateError(false)
                } */
            handleChange(event, 'endTime')
          }}
          renderInput={params => <TextField {...params} sx={{ gridColumn: '1 / 5' }} />}
          DialogProps={{ sx: { zIndex: '10000' } }}
        />
        <TextField
          label="Description - optionnel"
          variant="filled"
          multiline
          fullWidth
          value={description}
          onChange={event => handleChange(event, 'description')}
          className={classes.description}
          maxRows={4}
          InputProps={{
            classes: { root: classes.rootMultilineInput, filledInput: classes.filledInput },
          }}
        />
        {!matchesXs && (
          <IconModal
            openIconModal={() => setOpenIconModal(true)}
            open={openIconModal}
            onClose={() => setOpenIconModal(false)}
            selectedIcon={icon}
            setSelectedIcon={handleChange}
            eventType={EVENT_TYPES[3]}
            btnClasses={classes.iconModal}
          />
        )}
      </Box>
    </Box>
  )
}

export default NewTransport
