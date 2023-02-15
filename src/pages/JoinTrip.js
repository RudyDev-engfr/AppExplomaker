import React, { useContext, useEffect, useState } from 'react'
import { makeStyles } from '@mui/styles'
import { Box, Button, Typography, useMediaQuery } from '@mui/material'
import { useTheme } from '@emotion/react'
import { CheckCircleRounded, RadioButtonUncheckedRounded } from '@mui/icons-material'
import clsx from 'clsx'
import Carousel from 'react-material-ui-carousel'
import { useHistory, useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

import { FirebaseContext } from '../contexts/firebase'
import { SessionContext } from '../contexts/session'
import { onlyUnique, rCTFF } from '../helper/functions'
import { ROLES } from '../helper/constants'
import AuthModals from '../components/molecules/AuthModals'
import Loader from '../components/Loader'
import TripRecapCard from '../components/molecules/TripRecapCard'
import Head from '../components/molecules/Head'

const useStyles = makeStyles(theme => ({
  mainContainer: {
    position: 'relative',
    display: 'grid',
    gridTemplate: '100vh / 2fr 3fr',
    [theme.breakpoints.down('sm')]: {
      gridTemplate: '100vh / 100%',
    },
  },
  contentWrapper: {
    maxHeight: '100%',
    overflowY: 'auto',
    paddingBottom: theme.spacing(5),
    [theme.breakpoints.down('sm')]: {
      backgroundColor: theme.palette.primary.main,
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
  },
  contentCtn: {
    marginLeft: theme.spacing(10),
    maxWidth: '630px',
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
      maxWidth: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      color: theme.palette.primary.contrastText,
      padding: '0 30px',
    },
  },
  nameCtn: {
    display: 'grid',
    gridTemplate: '1fr / 310px 310px',
    gridAutoRows: '1fr',
    gridGap: '20px',
    marginTop: '30px',
    [theme.breakpoints.down('sm')]: {
      gridTemplate: '80px / 150px 150px',
      gridAutoRows: '80px',
      gridGap: '12px',
    },
  },
  nameBtn: {
    border: `1px solid ${theme.palette.grey.f7}`,
    padding: '25px 0',
    borderRadius: '10px',
    fontSize: '22px',
    textTransform: 'none',
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
    [theme.breakpoints.down('sm')]: {
      border: 'none',
      boxShadow: 'none',
      backgroundColor: theme.palette.primary.light,
    },
  },
  activeNameBtn: {
    border: `1px solid ${theme.palette.primary.main}`,
    backgroundColor: theme.palette.primary.ultraLight,
    boxShadow: 'none',
    [theme.breakpoints.down('sm')]: {
      border: 'none',
      backgroundColor: theme.palette.primary.contrastText,
      '&:hover': {
        backgroundColor: theme.palette.primary.contrastText,
      },
    },
  },
  icon: {
    fontSize: '30px!important',
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

const JoinTrip = () => {
  const history = useHistory()
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  const { tripId } = useParams()
  const { user, setNeedRedirectTo, setJoinCallback } = useContext(SessionContext)
  const { firestore, timestampRef, getUserById, getSpotByDestination } = useContext(FirebaseContext)

  const [isLoading, setIsLoading] = useState(true)
  const [tripData, setTripData] = useState()
  const [selectedTraveler, setSelectedTraveler] = useState('')
  const [openModal, setOpenModal] = useState('')
  const [dateRange, setDateRange] = useState(['', ''])
  const [currentTripSpot, setCurrentTripSpot] = useState([])
  // eslint-disable-next-line no-unused-vars
  const [currentTripImages, setCurrentTripImages] = useState(0)

  useEffect(() => {
    firestore
      .collection('trips')
      .doc(tripId)
      .onSnapshot(doc => {
        const tempDoc = doc.data()
        tempDoc.travelersDetails.forEach(traveler => {
          if (typeof traveler.id !== 'undefined' && traveler.id === user.id) {
            history.push(`/tripPage/${tripId}`)
          }
        })
        setTripData(tempDoc)
        setIsLoading(false)
      })
  }, [tripId])

  useEffect(() => {
    if (tripData) {
      setIsLoading(false)
      let currentDateRange
      if (tripData.dateRange && tripData.dateRange[0] !== '' && tripData.dateRange[1] !== '') {
        currentDateRange = rCTFF(tripData.dateRange, 'dd LLL')
      }
      setDateRange(currentDateRange)
      getSpotByDestination(tripData.destination, setCurrentTripSpot)
    }
  }, [tripData])

  useEffect(() => {
    if (user.isLoggedIn && tripData) {
      tripData.travelersDetails.forEach(traveler => {
        if (typeof traveler.id !== 'undefined' && traveler.id === user.id) {
          history.push(`/tripPage/${tripId}`)
        }
      })
    }
  }, [user])

  const updateTraveler = async (userId, isTraveler) => {
    const tempData = { editors: onlyUnique([...tripData.editors, userId]) }
    let travelerName
    if (isTraveler) {
      const tempTravelers = tripData.travelersDetails.map(traveler => {
        const tempTraveler = traveler
        tempTraveler.travelerId = uuidv4()
        if (tempTraveler.name === selectedTraveler) {
          tempTraveler.id = userId
          tempTraveler.role = ROLES.Read
        }
        return tempTraveler
      })
      tempData.travelersDetails = tempTravelers
    } else {
      const tempTravelers = [...tripData.travelersDetails]
      travelerName = (await getUserById(userId)).firstname
      tempTravelers.push({
        id: userId,
        travelerId: uuidv4(),
        role: ROLES.Read,
        name: travelerName,
        isNotTraveler: true,
      })
      tempData.travelersDetails = tempTravelers
    }

    firestore
      .collection('trips')
      .doc(tripId)
      .update({ ...tempData })

    firestore
      .collection('trips')
      .doc(tripId)
      .collection('messages')
      .add({
        text: `${
          selectedTraveler !== '' ? selectedTraveler : travelerName
        } vient de rejoindre le voyage, dites lui bonjour 👋`,
        createdAt: new timestampRef.fromDate(new Date()),
        userId,
      })

    return tripId
  }

  const handleTravelerSelection = (isTraveler = true) => {
    if (user.isLoggedIn) {
      updateTraveler(user.id, isTraveler)
      history.push(`/welcomeTrip`)
    } else {
      setOpenModal('login')
    }
  }

  return isLoading ? (
    <>
      <Head
        description="Rejoindre un séjour"
        url={`https://${window.location.href.split('/')[2]}/join/`}
      />
      <Loader />
    </>
  ) : (
    <>
      <Head
        title={tripData.title}
        description={`Rejoindre le séjour | ${
          dateRange?.length > 0 ? `${dateRange[0]} - ${dateRange[1]}` : 'Je ne sais pas encore'
        }`}
        url={`https://${window.location.href.split('/')[2]}/join/${tripId}`}
        thumbnail={tripData?.mainPicture}
      />
      <Box className={classes.mainContainer}>
        {!matchesXs && (
          <>
            <Box sx={{ overflowY: 'hidden' }}>
              {currentTripSpot.length > 0 && (
                <Carousel
                  time={5000}
                  indicators={false}
                  navButtonsAlwaysInvisible
                  index={currentTripImages}
                  // onChange={currentIndex => setCurrentTripImages(currentIndex)}
                  autoPlay={false}
                >
                  {currentTripSpot.map(({ src, title: imageTitle }) => (
                    <Box key={src}>
                      <Box
                        sx={{ maxWidth: '100%', minHeight: '100vh', objectFit: 'cover' }}
                        component="img"
                        src={src}
                      />
                      <Box className={classes.pictureDescription}>{imageTitle}</Box>
                    </Box>
                  ))}
                </Carousel>
              )}
            </Box>
            {/* <Box className={classes.arrows}>
              <Button
                sx={{ marginBottom: 1 }}
                className={classes.squaredIconBtn}
                size="large"
                onClick={() => {
                  let previousIndex
                  if (currentTripImages > 0) {
                    previousIndex = currentTripImages - 1
                  } else {
                    previousIndex = tripImages.length - 1
                  }
                  setCurrentTripImages(previousIndex)
                  console.log(currentTripImages)
                }}
              >
                <ArrowBackRounded color="primary" />
              </Button>
              <Button
                className={classes.squaredIconBtn}
                size="large"
                onClick={() =>
                  setCurrentTripImages(
                    currentTripImages < tripImages.length - 1 ? currentTripImages + 1 : 0
                  )
                }
              >
                <ArrowForwardRounded color="primary" />
              </Button>
            </Box> */}
          </>
        )}
        <Box className={classes.contentWrapper}>
          <Box className={classes.contentCtn}>
            {matchesXs && (
              <Typography fontSize="65px" sx={{ marginTop: '80px' }}>
                👋
              </Typography>
            )}
            <Typography
              variant="h1"
              sx={{
                marginTop: '120px',
                fontWeight: '700',
                fontSize: '54px',
                [theme.breakpoints.down('sm')]: {
                  fontSize: '28px',
                  marginTop: '20px',
                },
              }}
              align={matchesXs ? 'center' : 'left'}
              color={matchesXs ? 'inherit' : 'default'}
            >
              Bienvenue sur “{tripData.title}”
            </Typography>
            {tripData.travelersDetails.filter(traveler => typeof traveler.id === 'undefined')
              .length > 0 ? (
              <>
                <Typography
                  variant="h4"
                  color={matchesXs ? 'inherit' : 'primary'}
                  sx={{
                    marginTop: '60px',
                    fontWeight: '700',
                    fontSize: '28px',
                    [theme.breakpoints.down('sm')]: {
                      marginTop: '40px',
                      fontWeight: '400',
                      fontSize: '22px',
                      fontFamily: theme.typography.fontFamily,
                    },
                  }}
                >
                  Qui es-tu ?
                </Typography>
                <Box className={classes.nameCtn}>
                  {tripData.travelersDetails
                    .filter(traveler => typeof traveler.id === 'undefined')
                    .map(traveler => (
                      <Button
                        key={traveler.name}
                        startIcon={
                          !matchesXs &&
                          (selectedTraveler === traveler.name ? (
                            <CheckCircleRounded className={classes.icon} />
                          ) : (
                            <RadioButtonUncheckedRounded
                              className={classes.icon}
                              color="disabled"
                            />
                          ))
                        }
                        onClick={() => setSelectedTraveler(traveler.name)}
                        className={clsx(classes.nameBtn, {
                          [classes.activeNameBtn]: selectedTraveler === traveler.name,
                        })}
                      >
                        <Box
                          component="span"
                          sx={{
                            color: theme.palette.grey.black,
                            [theme.breakpoints.down('sm')]: {
                              color:
                                selectedTraveler === traveler.name
                                  ? theme.palette.primary.main
                                  : theme.palette.primary.contrastText,
                            },
                          }}
                        >
                          {!matchesXs && 'Je suis '}
                          {traveler.name}
                        </Box>
                      </Button>
                    ))}
                </Box>
                <Button
                  sx={{
                    textTransform: 'none',
                    color: theme.palette.grey['82'],
                    fontSize: '17px',
                    fontWeight: '400',
                    textDecoration: 'underline',
                    marginTop: '50px',
                    transition: 'color .2s ease-out',
                    '&:hover': {
                      backgroundColor: 'unset',
                      textDecoration: 'underline',
                      color: theme.palette.grey['33'],
                    },
                    [theme.breakpoints.down('sm')]: {
                      color: theme.palette.primary.contrastText,
                      '&:hover': {
                        backgroundColor: 'unset',
                        textDecoration: 'underline',
                        color: theme.palette.primary.contrastText,
                      },
                    },
                  }}
                  onClick={() => handleTravelerSelection(false)}
                >
                  Je ne suis pas l&quot;un des voyageur de ce séjour
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    width: '250px',
                    display: 'flex',
                    padding: '20px 0 14px',
                    fontSize: '18px',
                    marginTop: '60px',
                    borderRadius: '5px',
                    [theme.breakpoints.down('sm')]: {
                      borderRadius: '50px',
                      backgroundColor: theme.palette.primary.contrastText,
                      color: theme.palette.primary.main,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.contrastText,
                      },
                    },
                  }}
                  disabled={!selectedTraveler}
                  disableElevation={matchesXs}
                  onClick={() => handleTravelerSelection()}
                >
                  Confirmer
                </Button>
              </>
            ) : (
              <TripRecapCard
                tripData={tripData}
                dateRange={dateRange}
                onClick={() => handleTravelerSelection(false)}
                isJoin
              />
            )}
          </Box>
        </Box>
      </Box>
      <AuthModals
        modalState={openModal}
        modalStateSetter={setOpenModal}
        redirectFunction={() => {
          setNeedRedirectTo('afterJoin')
          setJoinCallback(() => userId => updateTraveler(userId))
        }}
      />
    </>
  )
}

export default JoinTrip
