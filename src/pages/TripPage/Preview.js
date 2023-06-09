/* eslint-disable array-callback-return */
import React, { Fragment, useContext, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import InfoIcon from '@mui/icons-material/Info'
import PersonIcon from '@mui/icons-material/Person'
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import Paper from '@mui/material/Paper'
import { Box, IconButton, Typography, useMediaQuery, useTheme, Button } from '@mui/material'
import Carousel from 'react-material-ui-carousel'
import makeStyles from '@mui/styles/makeStyles'
import clsx from 'clsx'

import { buildNotificationsOnTripForUser, rCTFF } from '../../helper/functions'
import { FirebaseContext } from '../../contexts/firebase'
import EditBtn from '../../components/atoms/EditBtn'
import Loader from '../../components/Loader'
import { ROLES } from '../../helper/constants'

import calendar from '../../images/icons/calendar.svg'
import location from '../../images/icons/location.svg'
import person from '../../images/icons/person.svg'
import NotificationArea from '../../components/molecules/NotificationArea'
import { SessionContext } from '../../contexts/session'
import MobileNotificationArea from '../../components/molecules/MobileNotificationArea'
import DesktopPreview from './DesktopPreview'
import { TripContext } from '../../contexts/trip'
import MobileTripPageHeader from '../../components/molecules/MobileTripPageHeader'
import AddCollaboratorsButton from '../../components/atoms/AddCollaboratorsButton'

const useStyles = makeStyles(theme => ({
  slides: {
    width: '100%',
    '& img': {
      width: '100%',
      height: '420px',
      objectFit: 'cover',
      borderRadius: '0 0 20px 20px',
      [theme.breakpoints.down('sm')]: {
        minHeight: '480px',
        height: 'unset',
        borderRadius: 'unset',
        objectFit: 'cover',
      },
    },
  },
  infotitle: {
    color: theme.palette.grey[82],
    fontSize: '16px',
  },
  infobody: {
    fontWeight: '500',
    fontSize: '20px',
  },
  titleIcon: {
    color: theme.palette.primary.main,
    fontSize: '34px',
    marginRight: theme.spacing(1),
    paddingBottom: '0.1rem',
  },
  carousel: { zIndex: '0', [theme.breakpoints.down('sm')]: { minHeight: '100vh' } },
  squaredIconBtn: {
    backgroundColor: theme.palette.primary.ultraLight,
    padding: '5px 15px',
    borderRadius: '5px',
    '&:hover': {
      backgroundColor: `${theme.palette.primary.ultraLight} !important`,
      opacity: '100% !important',
    },
  },
  arrow: { width: '70px', height: '45px' },
  prevArrow: { top: '20px' },
  nextArrow: { top: '80px' },
  sliderBox: {
    position: 'relative',
    backgroundColor: 'white',
    [theme.breakpoints.down('sm')]: {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100vh',
    },
  },
  // sliderCaption: {
  //   width: '100%',
  //   position: 'absolute',
  //   bottom: '0',
  //   left: '0',
  //   borderRadius: '0 0 20px 20px',
  //   background: theme.palette.primary.main,
  //   padding: '9px 30px',
  //   fontWeight: '500',
  //   fontSize: '14px',
  //   color: '#ffffff',
  //   [theme.breakpoints.down('sm')]: {
  //     left: '50%',
  //     top: '55%',
  //     bottom: 'unset',
  //     width: '250px',
  //     whiteSpace: 'wrap',
  //     textOverflow: 'ellipsis',
  //     padding: '8px 15px',
  //     background: '#f4fbfa',
  //     boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
  //     borderRadius: '30px',
  //     fontSize: '12px',
  //     textAlign: 'center',
  //     color: theme.palette.primary.main,
  //     transform: 'translateX(-50%)',
  //   },
  // },
  descriptionPaper: {
    background: '#fff',
    borderRadius: '20px',
    marginBottom: '20px',
    padding: '30px 30px 70px',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  doubleCol: {
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  doubleColPaper: {
    width: 'calc(50% - 10px)',
    '&:first-child': { marginRight: '20px' },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      '&:first-child': { marginRight: '0' },
      marginBottom: '20px',
    },
  },
  colPaperTrav: {
    width: 'calc(50% - 10px)',
    '&:first-child': { marginRight: '20px' },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginBottom: '120px',
      '&:first-child': { marginRight: '0' },
    },
  },
  boxInfo: {
    padding: '30px',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      margin: '10px 20px',
      padding: '20px',
    },
  },
  mobileContainer: {
    [theme.breakpoints.down('sm')]: {
      position: 'relative',
      top: '460px',
      width: '100vw',
      borderRadius: '40px 40px 0 0',
      transition: '0.2s linear',
      backgroundColor: theme.palette.grey.f2,
    },
  },
  mobileIcon: {
    marginRight: '15px',
  },
  mobileHeader: {
    display: 'none',
    [theme.breakpoints.down('sm')]: {
      display: 'block',
      paddingTop: '10px',
      background: '#fff',
      boxShadow: '-3px 12px 30px -8px rgba(78, 56, 56, 0.1)',
      width: '100%',
    },
  },
  mobileHeaderInner: {
    [theme.breakpoints.down('sm')]: {
      padding: '20px 30px',
    },
  },
  mobileHeaderInnerHeader: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  },
  mobileHeaderInnerTitle: {
    [theme.breakpoints.down('sm')]: {
      fontWeight: 'bold',
      fontSize: '28px',
      color: '#000000',
    },
  },
  mobileHeaderRow: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      alignItems: 'center',
      margin: '6px 0',
      fontSize: '14px',
      color: '#000000',
    },
  },
  mobileContent: {
    [theme.breakpoints.down('sm')]: {
      height: 'calc(100% - 300px)',
      backgroundColor: 'white !important',
    },
  },
  // mobilePaperContent: {
  //   marginTop: '20px',
  //   padding: '20px 30px 30px',
  //   position: 'relative',
  //   [theme.breakpoints.down('sm')]: {
  //     display: 'none',
  //   },
  // },
  titlePapers: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '22px',
      fontWeight: '1000',
    },
  },
}))

const Preview = ({
  tripData,
  setOpenModal,
  dataNotifications,
  canEdit,
  carouselImages,
  tripId,
}) => {
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))

  const { dictionary } = useContext(FirebaseContext)
  const { user } = useContext(SessionContext)
  const {
    currentDateRange,
    setCurrentDateRange,
    days,
    setSelectedDateOnPlanning,
    currentNotifications,
    setCurrentNotifications,
    refreshNotif,
    setRefreshNotif,
  } = useContext(TripContext)

  const [generatedAvatars, setGeneratedAvatars] = useState([])

  useEffect(() => {
    console.log('les notifs que je veux afficher', currentNotifications)
  }, [currentNotifications])

  useEffect(() => {
    const tempAvatars = []
    tripData.travelersDetails
      .filter(traveler => traveler.role !== ROLES.Removed)
      .forEach(traveler => {
        if (traveler.id) {
          tempAvatars.push(traveler.id)
        }
      })
    setGeneratedAvatars(tempAvatars)
  }, [tripData])

  const displayTripContext = context => {
    switch (context) {
      case 'friends':
        return 'Entre amis'
      case 'lovers':
        return 'En amoureux'
      case 'family':
        return 'En famille'
      case 'solo':
        return 'Seul'
      default:
        return 'Entre amis'
    }
  }

  return !tripData.title ? (
    <Loader />
  ) : (
    <>
      <Box className={classes.sliderBox}>
        {carouselImages?.length > 0 ? (
          <Carousel
            className={classes.carousel}
            animation={matchesXs ? 'slide' : 'fade'}
            swipe
            indicators={false}
            duration={matchesXs ? 500 : 1000}
            interval={10000}
            navButtonsAlwaysVisible={!matchesXs}
            navButtonsAlwaysInvisible={matchesXs}
            navButtonsWrapperProps={{
              style: {
                right: 'unset',
                left: '15px',
                height: '45px',
              },
            }}
            NavButton={({ onClick, next, prev }) => (
              <IconButton
                className={clsx(classes.squaredIconBtn, classes.arrow, {
                  [classes.prevArrow]: prev,
                  [classes.nextArrow]: next,
                })}
                onClick={onClick}
                size="large"
              >
                {prev && <ArrowBackRoundedIcon color="primary" />}
                {next && <ArrowForwardRoundedIcon color="primary" />}
              </IconButton>
            )}
          >
            {carouselImages.map(image => (
              <Box key={uuidv4()} className={classes.slides}>
                <img src={image.src.original} alt="" />
                {/* <Typography
                  className={classes.sliderCaption}
                  dangerouslySetInnerHTML={{ __html: image.title }}
                /> */}
              </Box>
            ))}
          </Carousel>
        ) : (
          <Box sx={{ height: '70px' }} />
        )}
      </Box>
      <Box className={classes.mobileContainer}>
        {/* main header block */}
        {matchesXs && <MobileTripPageHeader />}
        <Box className={classes.mobileHeader}>
          <Box className={classes.mobileHeaderInner}>
            <Box className={classes.mobileHeaderInnerHeader}>
              <Typography className={classes.mobileHeaderInnerTitle}>{tripData.title}</Typography>
              {canEdit && <EditBtn type="button" onClick={() => setOpenModal('general')} />}
            </Box>
            <div>
              <Box display="flex" alignItems="center">
                <img src={calendar} alt="" className={classes.mobileIcon} />
                {currentDateRange[0] !== '' ? (
                  <Button
                    onClick={() => setOpenModal('editDate')}
                    sx={{
                      textDecoration: 'none',
                      textTransform: 'none',
                      color: theme.palette.grey['33'],
                    }}
                  >
                    <Typography component="h4" className={classes.subtitle}>
                      {currentDateRange[0]} - {currentDateRange[1]}
                    </Typography>
                  </Button>
                ) : (
                  <Button
                    onClick={() => setOpenModal('editDate')}
                    sx={{
                      textDecoration: 'none',
                      textTransform: 'none',
                      color: theme.palette.grey['33'],
                    }}
                  >
                    A définir
                  </Button>
                )}
              </Box>
              <Box className={classes.mobileHeaderRow}>
                <img src={location} alt="" className={classes.mobileIcon} />
                {!tripData.noDestination ? (
                  <Button
                    onClick={() => setOpenModal('editDestination')}
                    sx={{
                      textDecoration: 'none',
                      textTransform: 'none',
                      color: theme.palette.grey['33'],
                    }}
                  >
                    <Typography component="h4" className={classes.subtitle}>
                      {tripData.destination.label}
                    </Typography>
                  </Button>
                ) : (
                  <Button
                    onClick={() => setOpenModal('editDestination')}
                    sx={{
                      textDecoration: 'none',
                      textTransform: 'none',
                      color: theme.palette.grey['33'],
                    }}
                  >
                    A définir
                  </Button>
                )}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box className={classes.mobileHeaderRow}>
                  <img src={person} alt="" className={classes.mobileIcon} />
                  <Button
                    onClick={() => setOpenModal('editEditors')}
                    sx={{
                      textDecoration: 'none',
                      textTransform: 'none',
                      color: theme.palette.grey['33'],
                    }}
                  >
                    <Typography className={classes.subtitle} component="h4">
                      {tripData.editors.length} contributeur{tripData.editors.length > 1 ? 's' : ''}
                    </Typography>
                  </Button>
                </Box>
                <Box sx={{ paddingRight: '10px' }}>
                  <AddCollaboratorsButton tripId={tripId} size="30px" iconSize="20px" />
                </Box>
              </Box>
            </div>
          </Box>
        </Box>
        <Box className={classes.mobileContent}>
          {!matchesXs && <DesktopPreview tripData={tripData} generatedAvatars={generatedAvatars} />}
          <Box
            sx={{
              padding: '20px 30px',
              borderRadius: '20px 20px 0 0',
              backgroundColor: theme.palette.grey.f7,
            }}
            className={classes.informationsContainer}
          >
            <Paper className={classes.descriptionPaper}>
              {canEdit && <EditBtn onClick={() => setOpenModal('editDescription')} />}
              <Box display="flex">
                <ChatBubbleRoundedIcon className={classes.titleIcon} />
                <Typography variant="h4" className={classes.titlePapers}>
                  Le projet
                </Typography>
              </Box>
              <Box fontSize="14px" color="#000000">
                {tripData.description}
              </Box>
            </Paper>
            <Box display="flex" alignItems="stretch" className={classes.doubleCol}>
              <Paper className={classes.doubleColPaper}>
                <Box className={classes.boxInfo}>
                  {canEdit && <EditBtn onClick={() => setOpenModal('editInfo')} />}
                  <Box display="flex">
                    <InfoIcon className={classes.titleIcon} />
                    <Typography variant="h4" className={classes.titlePapers}>
                      Informations
                    </Typography>
                  </Box>
                  <Box m="15px 0">
                    <Typography className={classes.infotitle}>Contexte</Typography>
                    <Typography className={classes.infobody}>
                      {displayTripContext(tripData.context)}
                    </Typography>
                  </Box>
                  <Box m="15px 0">
                    <Typography className={classes.infotitle}>Budget</Typography>
                    <Typography className={classes.infobody}>
                      {tripData.budget === 'low'
                        ? 'Faible'
                        : tripData.budget === 'medium'
                        ? 'Moyen'
                        : 'Élevé'}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
              <Paper className={classes.colPaperTrav}>
                <Box p="30px" position="relative">
                  {canEdit && <EditBtn onClick={() => setOpenModal('editTravelers')} />}
                  <Box display="flex">
                    <PersonIcon className={classes.titleIcon} />
                    <Typography variant="h4" className={classes.titlePapers}>
                      Les voyageurs
                    </Typography>
                  </Box>
                  <Box m="15px 0">
                    {tripData &&
                      [...dictionary.travelers_age].reverse().map(travelerAge => (
                        <Fragment key={uuidv4()}>
                          {tripData.travelersDetails.some(
                            ({ age }) => age === travelerAge.value
                          ) && <Typography>{travelerAge.label}</Typography>}
                          {tripData.travelersDetails
                            .filter(({ age }) => age === travelerAge.value)
                            .map(traveler => (
                              <Typography key={uuidv4()} className={classes.infobody}>
                                {traveler.name}
                              </Typography>
                            ))}
                        </Fragment>
                      ))}
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default Preview
