import React, { useState } from 'react'

import GooglePlacesAutocomplete, { geocodeByAddress } from 'react-google-places-autocomplete'
import { makeStyles, useTheme } from '@mui/styles'
import search from '../../images/icons/search.svg'
import loc2 from '../../images/icons/location2.svg'
import loc3 from '../../images/icons/location3.svg'
import loc4 from '../../images/icons/location4.svg'

const CustomGooglePlacesAutocomplete = ({ value, setter, onClear = false }) => {
  const theme = useTheme()

  const [isGooglePlacesOpen, setIsGooglePlacesOpen] = useState(false)

  return (
    <GooglePlacesAutocomplete
      minLengthAutocomplete={3}
      selectProps={{
        value,

        onChange: (event, { action }) => {
          if (action === 'clear') {
            if (onClear) {
              onClear()
            } else {
              setter('')
            }
          } else {
            geocodeByAddress(event.value.description).then(results => {
              const destination = { ...event }
              const shortCountryNameRef = results[0].address_components.filter(address =>
                address.types.includes('country')
              )
              if (shortCountryNameRef.length > 0) {
                destination.shortCountryName = shortCountryNameRef[0].short_name
              }
              setter({ ...destination })
            })
          }
        },
        isClearable: true,
        placeholder: 'Destination',
        loadingMessage: () => 'Chargement...',
        onMenuOpen: () => setIsGooglePlacesOpen(true),
        onMenuClose: () => setIsGooglePlacesOpen(false),
        noOptionsMessage: ({ inputValue }) =>
          inputValue.length < 3
            ? 'Veuillez rentrer au moins 3 lettres'
            : `Pas de destination avec ${inputValue}`,
        styles: {
          placeholder: provided => ({
            ...provided,
            color: theme.palette.grey[82],
            fontSize: '20px',
            left: '60px',
            fontFamily: theme.typography.fontFamily,
          }),
          control: provided => ({
            ...provided,
            cursor: 'pointer',
            borderRadius: isGooglePlacesOpen ? '35px 35px 0 0' : '50px',
            height: '66px',
            borderColor: theme.palette.grey.bd,
            backgroundColor: 'unset',
            boxShadow: 'unset',
            '&:hover': {
              borderColor: theme.palette.grey.black,
            },
            '&:active': {
              borderColor: 'unset',
              boxShadow: 'unset',
            },
            [theme.breakpoints.down('sm')]: {
              borderRadius: '50px',
              backgroundColor: theme.palette.grey.f2,
              border: 'unset',
              borderColor: 'unset',
              boxShadow: 'unset',
              marginTop: '30px',
              '&:hover': {
                borderColor: 'unset',
                boxShadow: 'unset',
              },
            },
          }),
          dropdownIndicator: provided => ({
            ...provided,
            display: 'none',
          }),
          indicatorSeparator: provided => ({
            ...provided,
            display: 'none',
          }),
          menu: provided => ({
            ...provided,
            color: theme.palette.grey[33],
            fontSize: '22px',
            top: '58px',
            backgroundColor: 'unset',
            boxShadow: 'unset',
            '&:hover': {
              backgroundColor: 'unset',
            },
            '& > div': {
              backgroundColor: theme.palette.grey.f7,
              borderRadius: '0 0 35px 35px',
              borderColor: 'unset',
            },
            [theme.breakpoints.down('sm')]: {
              fontFamily: theme.typography.fontFamily,
              boxShadow: 'none',
              fontSize: '16px',
              top: '66px',
              '& > div': {
                maxHeight: 'unset',
                backgroundColor: 'white',
              },
            },
          }),
          option: provided => ({
            ...provided,
            position: 'relative',
            color: theme.palette.grey[33],
            fontSize: '16px',
            padding: '10px 75px 15px',
            fontFamily: theme.typography.fontFamily,
            backgroundColor: 'unset',
            '&::before': {
              content: "''",
              background: `url("${loc3}") no-repeat`,
              objectFit: 'contain',
              width: '40px',
              height: '40px',
              position: 'absolute',
              left: '15px',
            },
            '&:active': {
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              '&::before': {
                background: `url("${loc4}") no-repeat`,
              },
            },
            [theme.breakpoints.down('sm')]: {
              '&::before': {
                background: `url("${loc2}") no-repeat`,
              },
            },
          }),
          noOptionsMessage: provided => ({
            ...provided,
            color: theme.palette.primary.main,
            fontSize: '20px',
            fontFamily: theme.typography.fontFamily,
          }),
          input: provided => ({
            ...provided,
            color: theme.palette.grey[33],
            fontSize: '20px',
            left: '50px',
            position: 'relative',
            '&::before': {
              content: "''",
              background: `url("${search}") no-repeat`,
              objectFit: 'contain',
              width: '30px',
              height: '30px',
              left: '-40px',
              position: 'absolute',
            },
          }),
          singleValue: provided => ({
            ...provided,
            color: theme.palette.grey[33],
            fontSize: '20px',
            left: '60px',
          }),
          loadingMessage: provided => ({
            ...provided,
            color: theme.palette.primary.main,
            fontSize: '20px',
          }),
          loadingIndicator: provided => ({
            ...provided,
            color: theme.palette.primary.main,
            fontSize: '8px',
            marginRight: '10px',
          }),
          clearIndicator: provided => ({
            ...provided,
            marginRight: '10px',
          }),
        },
      }}
    />
  )
}

export default CustomGooglePlacesAutocomplete
