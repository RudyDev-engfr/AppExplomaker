import React, { useContext, useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { makeStyles, useTheme } from '@mui/styles'
import { useHistory } from 'react-router-dom'
import { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete'
import { Info } from '@mui/icons-material'

import { NewTripContext } from '../../contexts/newTrip'
import TripWrapper from './TripWrapper'
import GooglePlacesAutocomplete from '../../components/atoms/GooglePlacesAutocomplete'

const useStyles = makeStyles(theme => ({
  btnsContainer: {
    display: 'grid',
    gridTemplate: '1fr / 1fr 1fr',
    gap: '40px',
    alignItems: 'center',
    paddingBottom: '106px',
    [theme.breakpoints.down('sm')]: {
      position: 'fixed',
      bottom: '0',
      gridAutoFlow: 'dense',
      backgroundColor: 'white',
      padding: '15px 30px',
      borderTop: 'thin solid #DFDFDF ',
      width: '100vw',
      marginLeft: '-30px',
      '& > button:nth-child(1)': {
        gridColumn: '2 / 3',
      },
      '& > button:nth-child(2)': {
        gridColumn: '1 / 2',
      },
    },
  },
  btnNext: {
    padding: '24px 61px',
    fontSize: '18px',
    fontWeight: '900',
    fontFamily: theme.typography.h1.fontFamily,
    [theme.breakpoints.down('sm')]: {
      padding: '17px 25px',
      fontSize: '20px',
      fontFamily: theme.typography.fontFamily,
      fontWeight: '500',
      textTransform: 'capitalize',
    },
  },
}))

const TripFirst = () => {
  const theme = useTheme()
  const classes = useStyles()
  const history = useHistory()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))

  const { newTrip, setNewTrip, newTripSpot } = useContext(NewTripContext)

  const [currentDestination, setCurrentDestination] = useState(newTrip.destination)
  const [latitude, setLatitude] = useState(newTrip.latitude)
  const [longitude, setLongitude] = useState(newTrip.longitude)
  const [fewWords, setFewWords] = useState('')

  useEffect(() => {
    setNewTrip({ ...newTrip, latitude, longitude, noDestination: false })
  }, [latitude, longitude])

  useEffect(() => {
    if (newTripSpot?.few_words) {
      setFewWords(newTripSpot.few_words)
    } else {
      setFewWords('')
    }
  }, [newTripSpot])

  const handleSelect = event => {
    if (event?.label) {
      setCurrentDestination(event)

      geocodeByAddress(event.value.description)
        .then(results => {
          const destination = { ...event }
          const shortCountryNameRef = results[0].address_components.filter(address =>
            address.types.includes('country')
          )
          if (shortCountryNameRef.length > 0) {
            destination.shortCountryName = shortCountryNameRef[0].short_name
          }
          setNewTrip({ ...newTrip, destination })
          return getLatLng(results[0])
        })
        .then(({ lat, lng }) => {
          setLatitude(lat)
          setLongitude(lng)
        })
    } else {
      setCurrentDestination()
      setFewWords('')
    }
  }

  return (
    <TripWrapper
      latLng={{ latitude, longitude }}
      currentStep="1"
      title={matchesXs ? 'Où veux-tu aller ?' : 'Où souhaites-tu partir ?'}
      subtitle="Pour commencer, choisis ta destination. Et si tu n'es pas encore fixé, aucun problème. Tu trouveras comme d'habitude dans ton séjour une page d'inspiration qui lui est 100% dédiée."
      backURL="/"
    >
      <GooglePlacesAutocomplete
        value={currentDestination}
        setter={handleSelect}
        onClear={() => {
          setNewTrip({ ...newTrip, destination: '' })
          setLatitude(46.2276)
          setLongitude(2.2137)
          setCurrentDestination()
          setFewWords('')
        }}
      />
      <Box
        display="flex"
        alignItems="center"
        my={2}
        p={2}
        bgcolor="primary.ultraLight"
        borderRadius="10px"
      >
        <Info color="primary" style={{ marginRight: '16px' }} />
        <Typography>
          Pour la destination, tu peux rechercher un continent, un pays, une région, une ville, un
          lieu ...
        </Typography>
      </Box>
      {newTripSpot && fewWords.length > 0 && (
        <Box my={2} p={2} bgcolor="primary.ultraLight" borderRadius="10px">
          <Typography variant="h4" sx={{ fontSize: '28px', fontWeight: '700' }}>
            {newTripSpot?.title}
            {newTripSpot?.gps.country_short && ` (${newTripSpot.gps.country_short})`}
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontSize: '22px', fontWeight: '700', color: theme.palette.grey['82'] }}
          >
            En quelques mots
          </Typography>
          <Typography
            sx={{ fontSize: '14px', fontWeight: '400', lineHeight: '24px' }}
            dangerouslySetInnerHTML={{ __html: fewWords }}
          />
        </Box>
      )}
      <Box className={classes.btnsContainer}>
        <Button
          className={classes.btnNext}
          color="primary"
          variant="contained"
          onClick={() => history.push('/newtrip/tripSecond')}
          disabled={!currentDestination}
        >
          Continuer
        </Button>
        <Button
          disabled={!!currentDestination}
          onClick={() => {
            setNewTrip({
              ...newTrip,
              noDestination: true,
            })
            history.push('/newtrip/tripSecond')
          }}
        >
          Je ne sais pas encore
        </Button>
      </Box>
    </TripWrapper>
  )
}

export default TripFirst
