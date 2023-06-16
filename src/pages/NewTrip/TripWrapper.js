import React, { useContext, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import useTheme from '@mui/material/'

import makeStyles from '@mui/styles/makeStyles'
import { useHistory } from 'react-router-dom'
import { ArrowBackIos } from '@mui/icons-material'
import Carousel from 'react-material-ui-carousel'

import { NewTripContext } from '../../contexts/newTrip'
import { FirebaseContext } from '../../contexts/firebase'
import Map from '../../components/molecules/Map'
import CustomMarker from '../../components/atoms/CustomMarker'
import Head from '../../components/molecules/Head'

import leftBg from '../../images/signIn/bg.png'
import lineMobile from '../../images/icons/lineMobile.svg'

const useStyles = makeStyles(theme => ({
  wrapperContainer: {
    display: 'grid',
    gridTemplate: `1fr / 1fr 2fr`,
    backgroundColor: 'white',
    [theme.breakpoints.down('sm')]: {
      display: 'block',
    },
  },
  left: {
    background: `url(${leftBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center bottom',
    backgroundRepeat: 'no-repeat',
    height: '100vh',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      position: 'fixed',
      top: '0',
      left: '0',
      height: '100vh',
    },
  },
  right: {
    padding: '30px 80px',
    width: '100%',
    overflowX: 'auto',
    maxHeight: '100vh',
    [theme.breakpoints.down('sm')]: {
      maxHeight: 'unset',
      position: 'relative',
      top: '70vh',
      left: '0',
      minHeight: '700px',
      padding: '10px 30px 120px 30px',
      background: 'white',
      boxShadow: '0px 0px 30px rgba(0, 0, 0, 0.1)',
      borderRadius: '40px 40px 0 0',
    },
  },
  arrowBack: {
    transform: 'translate(5px, 0)',
  },
  map: {
    width: '100%',
    height: '100vh',
  },
  title: {
    margin: '30px 0 20px',
    fontSize: '54px',
    fontWeight: '700',
    lineHeight: '55px',
    fontFamily: theme.typography.h1.fontFamily,
    [theme.breakpoints.down('sm')]: {
      margin: `${theme.spacing(4)} 0 ${theme.spacing(2)}`,
      fontSize: '28px',
      textAlign: 'center',
      color: theme.palette.grey[33],
      lineHeight: '30px',
    },
  },
  subtitle: {
    fontSize: '17px',
    fontFamily: theme.typography.h1.fontFamily,
    [theme.breakpoints.down('sm')]: {
      fontSize: '14px',
      textAlign: 'center',
      fontFamily: theme.typography.fontFamily,
      color: theme.palette.grey[33],
    },
  },
  form: {
    margin: `${theme.spacing(3)} 0 ${theme.spacing(3)}`,
  },
  newTripCarousel: {
    height: '100vh',
    width: '100%',
    zIndex: '3',
  },
  pictureDescription: {
    position: 'absolute',
    bottom: '25px',
    left: '30px',
    backgroundColor: theme.palette.primary.ultraLight,
    color: theme.palette.primary.main,
    borderRadius: '5px',
    padding: '6px 12px',
    fontSize: '11px',
  },
}))

const TripWrapper = ({ latLng, currentStep, title, subtitle, backURL, handleSubmit, children }) => {
  const history = useHistory()
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  const { newTrip, currentSpot, setCurrentSpot } = useContext(NewTripContext)
  const { getSpotByDestination, genericSpot } = useContext(FirebaseContext)

  useEffect(() => {
    if (newTrip.destination.value?.place_id) {
      getSpotByDestination(newTrip.destination, setCurrentSpot)
      console.log('its ok le spot est trouvé')
    } else {
      setCurrentSpot(genericSpot)
    }
  }, [newTrip])

  const wrapperSubmit = event => {
    event.preventDefault()
    handleSubmit(event)
  }

  return (
    <>
      <Head title="Nouveau Voyage" />
      <Box component="section" className={classes.wrapperContainer}>
        <Box className={classes.left}>
          {currentStep === '1' && (
            <Box className={classes.map}>
              <Map latitude={latLng.latitude} longitude={latLng.longitude} zoom={4}>
                <CustomMarker position={{ lat: latLng.latitude, lng: latLng.longitude }} />
              </Map>
            </Box>
          )}
          {currentStep > 1 && currentSpot?.picture_slider?.length > 1 && (
            <Box className={classes.newTripCarousel}>
              <Carousel
                time={5000}
                indicators={false}
                navButtonsAlwaysInvisible
                className={classes.newTripCarousel}
              >
                {currentSpot.picture_slider.map(({ src, title: imageTitle }) => (
                  <Box key={src.original}>
                    <Box
                      sx={{ maxWidth: '100%', height: '100vh', objectFit: 'cover' }}
                      component="img"
                      src={src.original}
                    />
                    <Box className={classes.pictureDescription}>{imageTitle}</Box>
                  </Box>
                ))}
              </Carousel>
            </Box>
          )}
        </Box>
        <Box className={classes.right}>
          <Box maxWidth="800px">
            {matchesXs && (
              <Box display="flex" justifyContent="center">
                <img src={lineMobile} alt="" />
              </Box>
            )}
            <Box
              display={matchesXs ? 'none' : 'flex'}
              justifyContent="space-between"
              alignItems="center"
            >
              {backURL && (
                <Button
                  startIcon={<ArrowBackIos className={classes.arrowBack} />}
                  onClick={() => history.push(backURL)}
                >
                  Retour{backURL === '/' && ' à l’accueil'}
                </Button>
              )}
              {currentStep <= 5 && (
                <Typography variant="subtitle1">Étape {currentStep} / 5</Typography>
              )}
            </Box>
            <Typography className={classes.title}>{title}</Typography>
            {subtitle && <Typography className={classes.subtitle}>{subtitle}</Typography>}
            <form onSubmit={wrapperSubmit} className={classes.form}>
              {children}
            </form>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default TripWrapper
