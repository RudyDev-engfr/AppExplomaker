/* eslint-disable array-callback-return */
import React, { Fragment, useContext, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import InfoIcon from '@mui/icons-material/Info'
import PersonIcon from '@mui/icons-material/Person'
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded'
import RoomRoundedIcon from '@mui/icons-material/RoomRounded'
import TodayRoundedIcon from '@mui/icons-material/TodayRounded'
import EventRoundedIcon from '@mui/icons-material/EventRounded'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import Paper from '@mui/material/Paper'
import { Box, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material'
import Carousel from 'react-material-ui-carousel'
import makeStyles from '@mui/styles/makeStyles'
import clsx from 'clsx'

import { rCTFF } from '../../helper/functions'
import NotificationButton from '../../components/molecules/NotificationButton'
import { FirebaseContext } from '../../contexts/firebase'
import CustomAvatar from '../../components/atoms/CustomAvatar'
import EditBtn from '../../components/atoms/EditBtn'
import Loader from '../../components/Loader'
import { ROLES } from '../../helper/constants'

import lineMobile from '../../images/icons/lineMobile.svg'
import calendar from '../../images/icons/calendar.svg'
import location from '../../images/icons/location.svg'
import person from '../../images/icons/person.svg'

const useStyles = makeStyles(theme => ({
  slides: {
    width: '100%',
    '& img': {
      width: '100%',
      height: '420px',
      objectFit: 'cover',
      borderRadius: '0 0 20px 20px',
      [theme.breakpoints.down('sm')]: {
        minHeight: '100vh',
        height: 'unset',
        borderRadius: 'unset',
      },
    },
  },
  smallTitle: {
    fontWeight: '500',
    fontSize: '16px',
    color: theme.palette.primary.main,
  },
  smalltitleIcon: {
    color: theme.palette.primary.main,
    fontSize: '16px',
    marginRight: theme.spacing(0.5),
  },
  subtitle: {
    fontWeight: '500',
    fontSize: '20px',
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
  carousel: { zIndex: '0' },
  squaredIconBtn: {
    backgroundColor: theme.palette.primary.ultraLight,
    padding: '5px 15px',
    borderRadius: '5px',
    '&:hover': {
      backgroundColor: theme.palette.primary.ultraLight,
    },
  },
  arrow: { width: '70px', height: '45px' },
  prevArrow: { top: '20px' },
  nextArrow: { top: '80px' },
  sliderBox: {
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100vh',
    },
  },
  sliderCaption: {
    width: '100%',
    position: 'absolute',
    bottom: '0',
    left: '0',
    borderRadius: '0 0 20px 20px',
    background: theme.palette.primary.main,
    padding: '9px 30px',
    fontWeight: '500',
    fontSize: '14px',
    color: '#ffffff',
    [theme.breakpoints.down('sm')]: {
      left: '50%',
      top: '55%',
      bottom: 'unset',
      width: '250px',
      whiteSpace: 'wrap',
      textOverflow: 'ellipsis',
      padding: '8px 15px',
      background: '#f4fbfa',
      boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
      borderRadius: '30px',
      fontSize: '12px',
      textAlign: 'center',
      color: theme.palette.primary.main,
      transform: 'translateX(-50%)',
    },
  },
  descriptionPaper: {
    background: '#fff',
    borderRadius: '20px',
    margin: '20px 0',
    padding: '30px 30px 70px',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      width: 'calc(100% - 40px)',
      margin: '0 20px 30px',
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
      width: 'calc(100% - 40px)',
      margin: '0 20px 30px',
      '&:first-child': { marginRight: '0' },
    },
  },
  colPaperTrav: {
    width: 'calc(50% - 10px)',
    '&:first-child': { marginRight: '20px' },
    [theme.breakpoints.down('sm')]: {
      width: 'calc(100% - 40px)',
      margin: '0 20px 120px',
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
      top: '481px',
      width: '100%',
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
      borderRadius: '40px 40px 0 0',
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
      marginTop: '25px',
    },
  },
  mobilePaperContent: {
    marginTop: '20px',
    padding: '20px 30px 30px',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  titlePapers: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '22px',
      fontWeight: '1000',
    },
  },
}))

const Preview = ({ tripData, setOpenModal, dataNotifications, canEdit, carouselImages }) => {
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))

  const { dictionary } = useContext(FirebaseContext)

  const [currentDateRange, setCurrentDateRange] = useState(['', ''])
  const [generatedAvatars, setGeneratedAvatars] = useState([])

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

  useEffect(() => {
    if (
      tripData.dateRange &&
      tripData.dateRange.length &&
      tripData.dateRange[0] !== '' &&
      tripData.dateRange[1] !== ''
    ) {
      setCurrentDateRange(rCTFF(tripData.dateRange, 'E dd MMMM'))
    } else {
      setCurrentDateRange(['', ''])
    }
  }, [tripData.dateRange])

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
        <Box position="absolute" top="0" right="0">
          <NotificationButton data={dataNotifications} />
        </Box>
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
                <Typography
                  className={classes.sliderCaption}
                  dangerouslySetInnerHTML={{ __html: image.title }}
                />
              </Box>
            ))}
          </Carousel>
        ) : (
          <Box sx={{ height: '70px' }} />
        )}
      </Box>
      <Box className={classes.mobileContainer}>
        {/* main header block */}
        <Box className={classes.mobileHeader}>
          <Box display="flex" justifyContent="center">
            <img src={lineMobile} alt="" />
          </Box>
          <Box className={classes.mobileHeaderInner}>
            <Box className={classes.mobileHeaderInnerHeader}>
              <Typography className={classes.mobileHeaderInnerTitle}>{tripData.title}</Typography>
              {canEdit && <EditBtn type="button" onClick={() => setOpenModal('general')} />}
            </Box>
            <div>
              <Box className={classes.mobileHeaderRow}>
                <img src={calendar} alt="" className={classes.mobileIcon} /> {currentDateRange[0]}
                {' - '}
                {currentDateRange[1]}
              </Box>
              <Box className={classes.mobileHeaderRow}>
                <img src={location} alt="" className={classes.mobileIcon} />
                {!tripData.noDestination && tripData.destination.label}
              </Box>
              <Box className={classes.mobileHeaderRow}>
                <img src={person} alt="" className={classes.mobileIcon} /> {tripData.editors.length}{' '}
                contributeurs
              </Box>
            </div>
          </Box>
        </Box>
        <Box className={classes.mobileContent}>
          <Paper className={classes.mobilePaperContent}>
            {canEdit && <EditBtn onClick={() => setOpenModal('general')} />}
            <Box
              display="flex"
              alignItems="flex-start"
              justifyContent="space-between"
              width="calc(100% - 50px)"
              mb="20px"
            >
              <Typography variant="h1">{tripData.title}</Typography>
              <CustomAvatar peopleIds={generatedAvatars} />
            </Box>
            <div>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <div>
                  <Box display="flex" alignItems="center">
                    <RoomRoundedIcon className={classes.smalltitleIcon} />
                    <Typography className={classes.smallTitle}>Destination</Typography>
                  </Box>
                  <Typography className={classes.subtitle}>
                    {!tripData.noDestination && tripData.destination.label}
                  </Typography>
                </div>
                <div>
                  <Box display="flex" alignItems="center">
                    <TodayRoundedIcon className={classes.smalltitleIcon} />
                    <Typography className={classes.smallTitle}>Arrivée</Typography>
                  </Box>
                  {currentDateRange && (
                    <Typography className={classes.subtitle}>{currentDateRange[0]}</Typography>
                  )}
                </div>
                <div>
                  <Box display="flex" alignItems="center">
                    <EventRoundedIcon className={classes.smalltitleIcon} />
                    <Typography className={classes.smallTitle}>Départ</Typography>
                  </Box>
                  {currentDateRange && (
                    <Typography className={classes.subtitle}>{currentDateRange[1]}</Typography>
                  )}
                </div>
              </Box>
            </div>
          </Paper>
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
                        {tripData.travelersDetails.some(({ age }) => age === travelerAge.value) && (
                          <Typography>{travelerAge.label}</Typography>
                        )}
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
    </>
  )
}

export default Preview
