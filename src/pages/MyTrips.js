import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { makeStyles, useTheme } from '@mui/styles'
import { AddCircle } from '@mui/icons-material'
import { isPast, isSameYear, isWithinInterval } from 'date-fns'

import Carousel from 'react-material-ui-carousel'

import StarIcon from '@mui/icons-material/Star'
import { FirebaseContext, useAuth } from '../contexts/firebase'
import Nav from '../components/molecules/Nav'
import TripCard from '../components/molecules/TripCard'
import { SessionContext } from '../contexts/session'
import { rCTFF } from '../helper/functions'
// import Footer from '../components/molecules/Footer'
import AuthModals from '../components/molecules/AuthModals'
import Loader from '../components/Loader'
import TrendingDestinations from '../components/molecules/trendingDestinations/TrendingDestinations'
import Head from '../components/molecules/Head'
import { ROLES } from '../helper/constants'

import kenya1 from '../images/inherit/Kenya 1.png'
/* import tripModalImg from '../images/inherit/tripmodalimg.png' */

const useStyles = makeStyles(theme => ({
  addSejour: {
    flexDirection: 'column',
    textTransform: 'none',
    boxShadow: '0px 4px 25px rgba(0, 0, 0, 0.2), inset 0px 0px 30px rgba(0, 0, 0, 0.15)',
    borderRadius: '20px',
    padding: `${theme.spacing(10)} ${theme.spacing(3)}`,
    [theme.breakpoints.down('sm')]: {
      maxWidth: '300px',
    },
  },
  addIcon: {
    fontSize: '60px',
    marginBottom: theme.spacing(4),
  },
  // paper: {
  //   position: 'absolute',
  //   top: '50%',
  //   left: '50%',
  //   transform: 'translate(-50%, -50%)',
  //   width: 600,
  // },
  title: {
    marginTop: '32px',
    fontSize: '54px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '38px',
    },
  },
  tripGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, 360px)',
    gridAutoRows: 'max-content',
    gridGap: '60px',
    paddingBottom: '20px',
    [theme.breakpoints.down('sm')]: {
      placeItems: 'center',
      gridTemplateColumns: 'unset',
      gridGap: 'unset',
    },
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(3),
  },
  xsTripPage: {
    backgroundColor: theme.palette.primary.vertPerse,
    [theme.breakpoints.down('sm')]: {
      padding: '30px',
      margin: '0',
      paddingBottom: '30px',
    },
  },
  xsTitle: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '22px',
      fontWeight: 'bold',
    },
  },
  nextTripsCarousel: {
    height: '100%',
    width: '100%',
  },
}))

const MyTrips = () => {
  const history = useHistory()
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  const { firestore, getTrendingDestinations } = useContext(FirebaseContext)
  const { user, setNeedRedirectTo } = useContext(SessionContext)
  const { initializing } = useAuth()
  const [StateOfMyTrip, setStateOfMyTrip] = useState('inexistant')
  const [openModal, setOpenModal] = useState('')
  const [tripsData, setTripsData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [nextTrips, setNextTrips] = useState([])
  const [pastTrips, setPastTrips] = useState([])
  const [trendingDestinations, setTrendingDestinations] = useState([])
  const [currentTripSelected, setCurrentTripSelected] = useState(0)

  useEffect(() => {
    if (trendingDestinations.length < 1) {
      getTrendingDestinations(setTrendingDestinations)
    }
  }, [trendingDestinations])

  useEffect(() => {
    if (user.isLoggedIn && !initializing) {
      firestore
        .collection('trips')
        .where('editors', 'array-contains', user.id)
        .onSnapshot(querySnapshot => {
          const trips = []
          querySnapshot.forEach(doc => {
            trips.push({ ...doc.data(), id: doc.id })
          })
          const tempNextTrips = []
          const tempPastTrips = []

          trips.sort((a, b) => {
            const dateA = new Date(rCTFF(a.dateRange[0]))
            const dateB = new Date(rCTFF(b.dateRange[0]))
            return dateA - dateB
          })

          trips.forEach(tripData => {
            let currentDateRange
            // let startDate
            let endDate
            if (
              tripData.dateRange &&
              tripData.dateRange[0] !== '' &&
              tripData.dateRange[1] !== ''
            ) {
              currentDateRange = isWithinInterval(new Date(), {
                start: rCTFF(tripData.dateRange[0]),
                end: rCTFF(tripData.dateRange[1]),
              })
                ? rCTFF(tripData.dateRange, 'dd LLL')
                : rCTFF(tripData.dateRange, 'dd LLL yyyy')
              // startDate = rCTFF(tripData.dateRange[0])
              endDate = rCTFF(tripData.dateRange[1])
            }
            const currentPeopleIds = []
            tripData.travelersDetails
              .filter(traveler => traveler.role !== ROLES.Removed)
              .forEach(traveler => {
                if (traveler.id) {
                  currentPeopleIds.push(traveler.id)
                }
              })

            const currentTrip = (
              <TripCard
                key={tripData.id}
                tripId={tripData.id}
                bgImg={tripData?.mainPicture || kenya1}
                people={currentPeopleIds}
                title={tripData.title}
                premium={tripData.premium}
                date={
                  currentDateRange ? `${currentDateRange[0]} - ${currentDateRange[1]}` : 'À définir'
                }
                startDate={tripData.dateRange ? tripData.dateRange[0] : ''}
                endDate={tripData.dateRange ? tripData.dateRange[1] : ''}
                destination={
                  tripData.noDestination ? 'Je ne sais pas encore' : tripData.destination.label
                }
              />
            )

            if (isPast(endDate)) {
              tempPastTrips.push(currentTrip)
            } else {
              tempNextTrips.push(currentTrip)
            }
          })
          setNextTrips(tempNextTrips)
          setPastTrips(tempPastTrips)
          setTripsData(trips)
          setIsLoading(false)
        })
    } else if (!initializing) {
      setTripsData([])
      setIsLoading(false)
    }
  }, [user, initializing])

  return isLoading ? (
    <Loader />
  ) : (
    <>
      <Head title="Mes Séjours" />
      <Nav setOpenModal={setOpenModal} />
      <Box
        maxWidth="1200px"
        minHeight="calc(100vh  - 81px)"
        className={classes.xsTripPage}
        sx={{ marginX: 'auto', marginTop: '81px', paddingTop: '40px' }}
      >
        <Box component="section">
          <Box mb={!user.isLoggedIn || nextTrips.length < 1 ? 5 : 0}>
            <Typography variant="h1" className={classes.title}>
              Séjours
            </Typography>
          </Box>
          {user.isLoggedIn ? (
            <>
              <Box mt={5} mb={10} py={nextTrips.length > 0 ? '20px' : '0'}>
                {nextTrips.length > 0 ? (
                  <Box margin="auto">
                    <Box className={classes.row}>
                      <Typography variant="h4" className={classes.xsTitle}>
                        À venir
                      </Typography>
                      <Button
                        color="primary"
                        variant="contained"
                        onClick={() => {
                          history.push('/newtrip/tripFirst')
                        }}
                      >
                        Créer un séjour
                      </Button>
                    </Box>
                    <Box className={classes.tripGrid}>
                      {matchesXs ? (
                        <Carousel
                          index={currentTripSelected}
                          onChange={currentIndex => setCurrentTripSelected(currentIndex)}
                          animation="slide"
                          autoPlay={false}
                          navButtonsAlwaysInvisible="true"
                          indicatorContainerProps={{ style: { textAlign: 'unset' } }}
                          indicatorIconButtonProps={{
                            sx: {
                              padding: '16px',
                              color: '#E6F5F4',
                              '& svg': { width: '8px' },
                            },
                          }}
                          activeIndicatorIconButtonProps={{
                            style: {
                              color: '#009D8C',
                            },
                          }}
                          className={classes.nextTripsCarousel}
                        >
                          {nextTrips}
                        </Carousel>
                      ) : (
                        nextTrips
                      )}
                    </Box>
                  </Box>
                ) : (
                  <Box>
                    <Box className={classes.row} />
                    <Box className={classes.tripGrid}>
                      <Button
                        className={classes.addSejour}
                        color="primary"
                        variant="contained"
                        onClick={() => {
                          history.push('/newtrip/tripFirst')
                        }}
                      >
                        <AddCircle className={classes.addIcon} />
                        <Typography variant="h4">Créer un séjour</Typography>
                        <Typography>
                          Plannifie ton prochain voyage de A à Z, entièrement gratuitement !
                        </Typography>
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>
              {pastTrips.length > 0 && (
                <Box my={10}>
                  <Box className={classes.row}>
                    <Typography variant="h4" className={classes.xsTitle}>
                      Terminés
                    </Typography>
                  </Box>
                  <Box className={classes.tripGrid}>
                    {matchesXs ? (
                      <Carousel
                        index={currentTripSelected}
                        onChange={currentIndex => setCurrentTripSelected(currentIndex)}
                        animation="slide"
                        autoPlay={false}
                        navButtonsAlwaysInvisible="true"
                        indicatorContainerProps={{ style: { textAlign: 'unset' } }}
                        indicatorIconButtonProps={{
                          sx: {
                            padding: '16px',
                            color: '#E6F5F4',
                            '& svg': { width: '8px' },
                          },
                        }}
                        activeIndicatorIconButtonProps={{
                          style: {
                            color: '#009D8C',
                          },
                        }}
                        className={classes.nextTripsCarousel}
                      >
                        {pastTrips}
                      </Carousel>
                    ) : (
                      pastTrips
                    )}
                  </Box>
                </Box>
              )}
            </>
          ) : (
            <Box>
              <Box className={classes.row} />
              <Box className={classes.tripGrid}>
                <Button
                  className={classes.addSejour}
                  color="primary"
                  variant="contained"
                  onClick={() => {
                    setOpenModal('login')
                    setNeedRedirectTo('newTrip')
                  }}
                >
                  <AddCircle className={classes.addIcon} />
                  <Typography variant="h4">Créer un séjour</Typography>
                  <Typography>
                    Plannifie ton prochain voyage de A à Z, entièrement gratuitement !
                  </Typography>
                </Button>
              </Box>
            </Box>
          )}
        </Box>
        {/* {tripsData.length < 1 && (
          <Box component="section" mt={6} mb={10}>
            <TrendingDestinations
              trendingDestinationsItems={trendingDestinations}
              dotListClass={classes.customDotListClass}
            />
          </Box>
        )} */}
      </Box>
      {/*       <Modal open={openModal === 'newTrip'} onClose={() => setOpenModal('')}>
        <Paper className={classes.paper}>
          <Box position="absolute" top="2%" right="2%">
            <IconButton onClick={() => setOpenModal('')}>
              <Close />
            </IconButton>
          </Box>
          <img className={classes.newTripImg} src={tripModalImg} alt="" />
          <Box my={4} mx={8}>
            <Typography variant="h4" align="center">
              Laisse nous te plannifier le séjour de tes rêves 💫
            </Typography>
            <Box my={4}>
              <Typography align="center">
                Hébergements, vols, activités, explorations, transports sur place, nourriture ... On
                s’occuppe de toutes les recherches en prenant en compte tes envies, et celles de tes
                partenaires !
              </Typography>
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              alignItems="center"
              mt={4}
            >
              <Box flexShrink={0} mb={2}>
                <Button color="primary" size="large" variant="contained">
                  ok c&apos;est parti
                </Button>
              </Box>
              <Box flexShrink={0}>
                <Button
                  color="inherit"
                  variant="text"
                  size="large"
                  onClick={() => {
                    if (user.isLoggedIn) {
                      history.push('/newtrip/tripFirst')
                    } else {
                      setOpenModal('login')
                    }
                  }}
                >
                  Non merci, je veux le plannifier moi-même.
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Modal> */}
      <AuthModals modalState={openModal} modalStateSetter={setOpenModal} />
      {/* <Footer /> */}
    </>
  )
}

export default MyTrips
