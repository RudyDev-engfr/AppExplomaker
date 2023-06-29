import React, { Fragment, useContext, useEffect, useState } from 'react'
import { makeStyles, useTheme } from '@mui/styles'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import RoomRoundedIcon from '@mui/icons-material/RoomRounded'
import MoreHoriz from '@mui/icons-material/MoreHoriz'
import DeleteIcon from '@mui/icons-material/Delete'
import CreateIcon from '@mui/icons-material/Create'
import RoomIcon from '@mui/icons-material/Room'
import { Icon } from '@iconify/react'
import copySolid from '@iconify-icons/clarity/copy-solid'
import PublicIcon from '@mui/icons-material/Public'
import PhoneIcon from '@mui/icons-material/Phone'
import EuroIcon from '@mui/icons-material/Euro'
import { v4 as uuidv4 } from 'uuid'
import { ArrowBack, ArrowForward, Close, Info } from '@mui/icons-material'
import { toast } from 'react-toastify'
import Carousel from 'react-material-ui-carousel'
import { useHistory } from 'react-router-dom'
import { format, formatDuration, intervalToDuration, isSameDay } from 'date-fns'
import frLocale from 'date-fns/locale/fr'

import { EVENT_TYPES } from '../../../helper/constants'
import { rCTFF, stringToDate } from '../../../helper/functions'
import { FirebaseContext } from '../../../contexts/firebase'
import PlanningCardIcon from './PlanningCardIcon'

import LineFull from '../../../images/LineFull.svg'
import findIcon from '../../../helper/icons'
import mainWhite from '../../../images/eventCreator/flight/mainWhite.svg'
import FlightPreview from './FlightPreview'
import { PlanningContext } from '../../../contexts/planning'
import { SessionContext } from '../../../contexts/session'
import { TripContext } from '../../../contexts/trip'
import CardMenu from '../../../components/atoms/CardMenu'

const useStyles = makeStyles(theme => ({
  iconBackground: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '210px',
    backgroundColor: theme.palette.primary.main,
    borderRadius: '10px',
  },
  photo: {
    width: '100%',
    height: '210px',
    objectFit: 'cover',
    objectPosition: '50% 50%',
  },
  iconFlight: {
    width: '10vh',
    height: '10vh',
    backgroundColor: theme.palette.primary.main,
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  planeIconBack: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.ultraLight,
    color: theme.palette.primary.main,
  },

  transportGrid: {
    // marginRight: '2rem',
    display: 'grid',
    gridTemplateColumns: '20% 60% 20%',
    height: '60px',
    alignItems: 'center',
  },
  fontRight: {
    direction: 'rtl',
    textAlign: 'start',
  },
  line: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '50px',
    padding: '25px 0 5px 0',
  },
  participantsBox: {
    color: '#FFFFFF',
    backgroundColor: '#000000',
    margin: '0.25rem',
    padding: '8px 15px',
    borderRadius: '5px',
  },
  deleteBtn: {
    backgroundColor: theme.palette.secondary.ultraLight,
    padding: '15px',
    color: theme.palette.secondary.main,
    '&:hover': {
      backgroundColor: theme.palette.secondary.ultraLight,
    },
  },
  greyBtn: {
    backgroundColor: theme.palette.grey.f7,
    padding: '15px',
  },
  deleteDialogTitle: {
    textAlign: 'center',
  },
  deleteDialogActionsContainer: {
    padding: '40px',
    display: 'grid',
    gridTemplate: '72px / 1fr 1fr',
    gridGap: '26px',
    '& button': {
      height: '100%',
    },
  },
  warningContainer: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: '5px',
    backgroundColor: theme.palette.secondary.ultraLight,
    padding: '10px',
    '& p': {
      fontSize: '14px',
      marginLeft: '15px',
      color: theme.palette.grey['33'],
    },
  },
  carousel: { height: '100%', width: '100%', borderRadius: '10px' },
  carouselIndicatorsContainer: {
    position: 'absolute',
    zIndex: '2',
    bottom: '20px',
    '& svg': {
      color: theme.palette.grey.df,
      width: '12px',
      height: '12px',
    },
  },
  carouselActiveIndicator: {
    '& svg': {
      width: '20px',
      height: '20px',
      color: 'white',
    },
  },
  borderRadiusMobile: {
    [theme.breakpoints.down('sm')]: {
      borderRadius: '0',
    },
  },
  hourTypo: {
    fontSize: '24px',
    fontWeight: 400,
    lineHeight: 1.25,
    fontFamily: 'Vesper Libre',
  },
}))

const openingHours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']

const EventPreview = ({
  currentEvent,
  setCurrentEvent,
  propsClasses,
  tripId,
  previousEvent,
  setPreviousEvent,
  selectedPropositionIndex,
  setSelectedPropositionIndex,
  setEventType,
}) => {
  const classes = useStyles()
  const history = useHistory()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  const { firestore, createNotificationsOnTrip } = useContext(FirebaseContext)
  const { user } = useContext(SessionContext)
  const { setNeedMapRefresh, days, selectedDateOnPlanning, setSelectedDateOnPlanning } =
    useContext(PlanningContext)
  const { currentEventType, setCurrentEventType, canEdit, setCurrentView, setEditMode } =
    useContext(TripContext)

  const [isLoading, setIsLoading] = useState(false)
  const [tripData, setTripData] = useState()
  const [currentOptions, setCurrentOptions] = useState([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  // Menu Button Logic
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleCloseDropdown = () => {
    setAnchorEl(null)
  }
  // End of Menu Button Logic

  useEffect(() => {
    firestore
      .collection('trips')
      .doc(tripId)
      .onSnapshot(doc => {
        const tempDoc = doc.data()
        setTripData(tempDoc)
        setIsLoading(false)
      })
  }, [tripId])

  useEffect(() => {
    setNeedMapRefresh(true)
  }, [])

  useEffect(() => {
    if (currentEvent && days) {
      days.forEach(day => {
        if (isSameDay(stringToDate(currentEvent?.startTime), day)) {
          setSelectedDateOnPlanning(day)
        }
      })
    }
  }, [currentEvent, days])

  useEffect(() => {
    console.log('currentEventType', currentEventType)
  }, [currentEventType])

  useEffect(() => {
    if (currentEvent.type) {
      setCurrentEventType(currentEvent.type)
    }
    if (previousEvent?.isSurvey) {
      setCurrentEventType(previousEvent.type)
    }
  }, [currentEvent, previousEvent])

  const handleDelete = () => {
    if (canEdit) {
      setIsLoading(true)
      if (previousEvent?.isSurvey) {
        const tempPropositions = previousEvent.propositions.filter(
          (proposition, currentIndex) => currentIndex !== selectedPropositionIndex
        )
        if (tempPropositions.length > 0) {
          firestore
            .collection('trips')
            .doc(tripId)
            .collection('planning')
            .doc(previousEvent.id)
            .set({ propositions: tempPropositions }, { merge: true })
            .then(() => {
              const tempEvent = { ...previousEvent, propositions: tempPropositions }
              setCurrentEvent({ ...tempEvent })
              setSelectedPropositionIndex()
              setPreviousEvent()
              history.replace(`/tripPage/${tripId}/planning?survey=${previousEvent.id}`)
              setCurrentView('survey')
            })
        } else {
          firestore
            .collection('trips')
            .doc(tripId)
            .collection('planning')
            .doc(previousEvent.id)
            .delete()
            .then(() => {
              setPreviousEvent()
              history.replace(`/tripPage/${tripId}/planning`)
              setSelectedPropositionIndex()
              createNotificationsOnTrip(user, tripData, tripId, 'eventDelete', 2, currentEvent)
              setCurrentView('planning')
              setCurrentEvent()
            })
        }
      } else {
        firestore
          .collection('trips')
          .doc(tripId)
          .collection('planning')
          .doc(currentEvent.id)
          .delete()
          .then(() => {
            setCurrentView('planning')
            history.replace(`/tripPage/${tripId}/planning`)
            setCurrentEvent()
          })
      }
    }
  }
  const changeIntoSurvey = () => {
    let tempDoc = {
      type: currentEvent.type,
      createdBy: user.id,
    }
    const tempPropositions = [{ ...currentEvent, likes: [] }]
    delete tempPropositions[0].type
    delete tempPropositions[0].id
    tempDoc = {
      ...tempDoc,
      isSurvey: true,
      propositions: tempPropositions,
    }
    firestore
      .collection('trips')
      .doc(tripId)
      .collection('planning')
      .doc(currentEvent.id)
      .set({ ...tempDoc })
      .then(() => {
        setCurrentView('planning')
        const tempEvent = { ...tempDoc, id: currentEvent.id }
        setCurrentEvent(tempEvent)
        history.push(`/tripPage/${tripId}/planning?survey=${currentEvent.id}&proposition=0`)
      })
  }

  const surveyOptions = [
    {
      label: 'Modifier',
      callback: () => {
        setEventType(previousEvent ? previousEvent.type : currentEventType)
        setEditMode(true)
        setCurrentView('creator')
      },
    },
    {
      label: 'Retirer',
      callback: () => {
        firestore
          .collection('trips')
          .doc(tripId)
          .collection('planning')
          .doc(currentEvent.id)
          .set({ needNewDates: true }, { merge: true })
        setCurrentEvent('')
        setCurrentView('planning')
      },
      isRemoved: !!currentEvent?.needNewDates,
    },
    { label: 'Supprimer', callback: () => setIsDeleteDialogOpen(true) },
  ]
  const eventOptions = [
    {
      label: 'Modifier',
      callback: () => {
        setEventType(previousEvent ? previousEvent.type : currentEventType)
        setEditMode(true)
        setCurrentView('creator')
      },
    },
    {
      label: 'Proposer en sondage',
      callback: changeIntoSurvey,
      isRemoved: !!currentEvent?.needNewDates,
    },
    {
      label: 'Retirer',
      callback: () => {
        firestore
          .collection('trips')
          .doc(tripId)
          .collection('planning')
          .doc(currentEvent.id)
          .set({ needNewDates: true }, { merge: true })
        setCurrentEvent('')
        setCurrentView('planning')
      },
      isRemoved: !!currentEvent?.needNewDates,
    },
    { label: 'Supprimer', callback: () => setIsDeleteDialogOpen(true) },
  ]

  useEffect(() => {
    if (previousEvent?.isSurvey) {
      setCurrentOptions(surveyOptions)
    } else {
      setCurrentOptions(eventOptions)
    }
  }, [previousEvent])

  return isLoading ? (
    <></>
  ) : (
    <>
      <Box className={propsClasses}>
        <Paper className={classes.borderRadiusMobile}>
          <Box sx={{ position: matchesXs && 'sticky', top: '0px', zIndex: 10000 }}>
            <Box
              sx={{
                backgroundColor: 'white',
                padding: '15px 30px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
              }}
            >
              <Box position="absolute" left="20px">
                <IconButton
                  aria-label="back"
                  edge="start"
                  onClick={() => {
                    if (previousEvent) {
                      history.push(`/tripPage/${tripId}/planning?survey=${previousEvent.id}`)
                      setCurrentEvent(previousEvent)
                      setPreviousEvent()
                      setCurrentView('survey')
                    } else {
                      history.push(`/tripPage/${tripId}/planning`)
                      setCurrentEvent()
                      setCurrentView('planning')
                    }
                  }}
                >
                  <ArrowBackIosIcon sx={{ transform: 'translate(5px ,0)' }} />
                </IconButton>
              </Box>
              <Typography variant="h5">
                <Box fontWeight="bold" component="span">
                  {currentEventType === EVENT_TYPES[0]
                    ? 'Hébergement'
                    : currentEventType === EVENT_TYPES[1]
                    ? 'Vol'
                    : currentEventType === EVENT_TYPES[2]
                    ? 'Exploration'
                    : currentEventType === EVENT_TYPES[3]
                    ? 'Transport'
                    : currentEventType === EVENT_TYPES[4] && 'Restaurant'}
                </Box>
              </Typography>
              {canEdit && (
                <Box position="absolute" right="20px">
                  <IconButton
                    size="large"
                    id="basic-button"
                    aria-controls="basic-menu"
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                  >
                    <MoreHoriz />
                  </IconButton>
                  <CardMenu
                    anchorEl={anchorEl}
                    handleCloseDropdown={handleCloseDropdown}
                    options={currentOptions}
                  />
                </Box>
              )}
            </Box>
            <Divider />
          </Box>
          <Container sx={{ position: 'inherit', zIndex: 2 }} disableGutters>
            <Box sx={{ padding: matchesXs ? '30px 15px 30px 30px' : '15px', marginBottom: '20px' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box sx={{ marginBottom: '20px' }}>
                  <Typography component="h1" sx={{ fontSize: '28px' }}>
                    {currentEvent?.title}
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" alignItems="center">
                <RoomRoundedIcon fontSize="small" color="disabled" sx={{ marginRight: '5px' }} />
                <Typography>
                  {(currentEventType === EVENT_TYPES[0] ||
                    currentEventType === EVENT_TYPES[2] ||
                    currentEventType === EVENT_TYPES[4]) &&
                    currentEvent.location.label}
                  {currentEventType === EVENT_TYPES[1] && (
                    <Link
                      href={`http://maps.google.com/?q=${currentEvent.flights[0].data.airports[0].geocode.latitude},${currentEvent.flights[0].data.airports[0].geocode.longitude}`}
                      target="_blank"
                      color="primary"
                    >
                      {currentEvent.flights[0].data.airports[0].label}
                    </Link>
                  )}
                  {currentEventType === EVENT_TYPES[3] && currentEvent.transports[0].start.label}
                </Typography>
                {/* {currentEventType === EVENT_TYPES[1] && (
                  <Typography sx={{ paddingLeft: '15px' }}>
                    
                      Itinéraire
                    
                  </Typography>
                )} */}
              </Box>
              {currentEventType !== EVENT_TYPES[1] && (
                <Box
                  m="1rem 0"
                  className={classes.iconBackground}
                  display="flex"
                  justifyContent="flex-start"
                  flexWrap="wrap"
                >
                  {currentEvent?.location?.photos?.length > 0 ? (
                    <Carousel
                      swipe
                      animation="slide"
                      className={classes.carousel}
                      PrevIcon={<ArrowBack />}
                      NextIcon={<ArrowForward />}
                      indicatorContainerProps={{ className: classes.carouselIndicatorsContainer }}
                      activeIndicatorIconButtonProps={{
                        className: classes.carouselActiveIndicator,
                      }}
                      navButtonsWrapperProps={{
                        style: {
                          height: '100%',
                        },
                      }}
                    >
                      {currentEvent.location.photos
                        .filter((photo, index) => index < 4)
                        .map(photo => (
                          <img key={photo} className={classes.photo} src={photo} alt="" />
                        ))}
                    </Carousel>
                  ) : (
                    <Box className={classes.cardIconContainer}>
                      <PlanningCardIcon
                        icon={currentEvent.icon}
                        eventType={currentEventType}
                        size="100px"
                      />
                    </Box>
                  )}
                </Box>
              )}
              {currentEventType === EVENT_TYPES[3] && (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ paddingBottom: '32px' }}
                >
                  <Box>
                    <Typography variant="h5">
                      <Box component="span" fontWeight="bold">
                        Transport
                      </Box>
                    </Typography>
                    <Typography>
                      {format(stringToDate(currentEvent.transports[0].startTime), 'EEEE dd MMMM', {
                        locale: frLocale,
                      })}
                    </Typography>
                  </Box>
                  {currentEvent?.website && (
                    <Button
                      className={classes.greyBtn}
                      startIcon={<PublicIcon />}
                      href={
                        currentEvent.website.startsWith('http')
                          ? currentEvent.website
                          : `https://${currentEvent.website}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      color="inherit"
                    >
                      Site Web
                    </Button>
                  )}
                </Box>
              )}
              {(currentEventType === EVENT_TYPES[0] ||
                currentEventType === EVENT_TYPES[2] ||
                currentEventType === EVENT_TYPES[4]) && (
                <Box display="flex" justifyContent="space-between">
                  {currentEvent.location.website && !currentEvent.website && (
                    <Button
                      className={classes.greyBtn}
                      startIcon={<PublicIcon />}
                      href={currentEvent.location.website}
                      target="_blank"
                      rel="noreferrer"
                      color="inherit"
                    >
                      Site web
                    </Button>
                  )}
                  {currentEvent.location.phone && (
                    <Button
                      className={classes.greyBtn}
                      startIcon={<PhoneIcon />}
                      href={`tel:${currentEvent.location.phone}`}
                      color="inherit"
                    >
                      Téléphone
                    </Button>
                  )}
                  {currentEvent.location.label && (
                    <Button
                      className={classes.greyBtn}
                      startIcon={<RoomIcon />}
                      href={`http://maps.google.com/?q=${currentEvent.location.label.replace(
                        ' ',
                        '+'
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      color="inherit"
                    >
                      Itinéraire
                    </Button>
                  )}
                  {currentEvent.website && (
                    <Button
                      href={
                        currentEvent.website.startsWith('http')
                          ? currentEvent.website
                          : `https://${currentEvent.website}`
                      }
                      target="_blank"
                      startIcon={<PublicIcon />}
                      className={classes.greyBtn}
                      color="inherit"
                      rel="noreferrer"
                    >
                      Site Web
                    </Button>
                  )}
                </Box>
              )}
              {(currentEventType === EVENT_TYPES[2] || currentEventType === EVENT_TYPES[4]) && (
                <>
                  <Box pt={2} display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="textSecondary">
                      Date
                    </Typography>
                  </Box>
                  <Box mb="1rem">
                    <Typography>
                      {`${format(
                        stringToDate(currentEvent.startTime, 'yyyy-MM-dd HH:mm'),
                        'EEEE dd MMMM',
                        {
                          locale: frLocale,
                        }
                      )} • ${format(stringToDate(currentEvent.startTime), 'HH:mm', {
                        locale: frLocale,
                      })} - ${format(stringToDate(currentEvent.endTime), 'HH:mm', {
                        locale: frLocale,
                      })}`}
                    </Typography>
                  </Box>
                </>
              )}
              {currentEventType === EVENT_TYPES[0] && (
                <Box py={4}>
                  <Box sx={{ display: 'grid', gridTemplate: '1fr / 1fr 1fr' }}>
                    <Box pt={1.5}>
                      <Typography variant="caption" color="textSecondary">
                        Arrivée
                      </Typography>
                      <Box mt={1}>
                        <Typography sx={{ fontWeight: 'bold' }}>
                          {format(stringToDate(currentEvent.startTime), 'EEE dd MMM', {
                            locale: frLocale,
                          })}
                        </Typography>
                        <Typography>
                          {format(stringToDate(currentEvent.startTime), 'HH:mm', {
                            locale: frLocale,
                          })}
                        </Typography>
                      </Box>
                    </Box>
                    <Box pt={1.5} display="flex">
                      <Divider orientation="vertical" flexItem />
                      <Box ml={2}>
                        <Typography variant="caption" color="textSecondary">
                          Départ
                        </Typography>
                        <Box mt={1}>
                          <Typography sx={{ fontWeight: 'bold' }}>
                            {format(stringToDate(currentEvent.endTime), 'EEE dd MMM', {
                              locale: frLocale,
                            })}
                          </Typography>
                          <Typography>
                            {format(stringToDate(currentEvent.endTime), 'HH:mm', {
                              locale: frLocale,
                            })}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}
              {currentEventType === EVENT_TYPES[1] && (
                <Box mb={1}>
                  {currentEvent.flights.map(({ data, number }) => (
                    <Box display="flex" alignItems="center" key={data.timings[0]}>
                      <Box className={classes.iconFlight}>
                        <img src={mainWhite} alt="avion" />
                      </Box>
                      <Box m="1.5rem">
                        <Typography>
                          <Box component="span" fontWeight="bold">
                            Vol {number}
                            {/* TODO récupérer la compagnie aérienne */}
                          </Box>
                        </Typography>
                        <Typography>
                          {!isSameDay(rCTFF(data.timings[0]), rCTFF(data.timings[1]))
                            ? `du ${rCTFF(data.timings[0], 'eeee dd MMMM')} au 
                        ${rCTFF(data.timings[1], 'eeee dd MMMM')}`
                            : rCTFF(data.timings[0], 'eeee dd MMMM')}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
              {(currentEventType === EVENT_TYPES[1] ||
                currentEventType === EVENT_TYPES[2] ||
                currentEventType === EVENT_TYPES[3] ||
                currentEventType === EVENT_TYPES[4]) && <Divider />}
              {currentEventType === EVENT_TYPES[3] && (
                <>
                  {/* ------------------First Bus Line--------------- */}
                  {currentEvent.transports.map(
                    ({ start, end, startTime, endTime, description, icon }, transportIndex) => (
                      <Fragment key={startTime}>
                        <Box
                          className={classes.transportGrid}
                          sx={{ paddingTop: '20px' }}
                          justifyContent="space-between"
                        >
                          <Box className={classes.planeIconBack}>
                            <Box
                              sx={{
                                width: '34px',
                                height: '34px',
                                alignContent: 'center',
                                display: 'flex',
                                justifyContent: 'center',
                              }}
                            >
                              <Box
                                component="img"
                                src={findIcon(icon, currentEventType)}
                                sx={{
                                  filter:
                                    'brightness(0) saturate(100%) invert(30%) sepia(78%) saturate(1841%) hue-rotate(152deg) brightness(102%) contrast(101%)',
                                }}
                              />
                            </Box>
                          </Box>
                          <Box>
                            <Typography>
                              <Box component="span" fontWeight="bold">
                                {start.label}
                              </Box>
                            </Typography>
                            {/* <Typography>{currentEvent.departureCity}</Typography> */}
                            <Typography>
                              <Link href="https://www.google.com" target="_blank" color="primary">
                                Itinéraire
                              </Link>
                            </Typography>
                          </Box>
                          <Box className={classes.fontRight}>
                            <Typography variant="h4" className={classes.hourTypo}>
                              {format(stringToDate(startTime), 'HH:mm', {
                                locale: frLocale,
                              })}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Trajet :{' '}
                              {formatDuration(
                                intervalToDuration({
                                  start: stringToDate(startTime),
                                  end: stringToDate(endTime),
                                }),
                                {
                                  format: ['days', 'hours', 'minutes'],
                                  locale: frLocale,
                                }
                              )
                                .replace('jours', 'j')
                                .replace('jour', 'j')
                                .replace('heures', 'h')
                                .replace('heure', 'h')
                                .replace('minutes', 'min')
                                .replace('minute', 'min')}
                            </Typography>
                          </Box>
                        </Box>
                        <Box className={classes.line}>
                          <img src={LineFull} alt="line" />
                        </Box>
                        {/* ------------------Second Bus Line--------------- */}
                        <Box
                          className={classes.transportGrid}
                          justifyContent="space-between"
                          mb={2}
                        >
                          <Box className={classes.planeIconBack}>
                            <Box
                              sx={{
                                width: '34px',
                                height: '34px',
                                alignContent: 'center',
                                display: 'flex',
                                justifyContent: 'center',
                              }}
                            >
                              <Box
                                component="img"
                                src={findIcon(icon, currentEventType)}
                                sx={{
                                  filter:
                                    'brightness(0) saturate(100%) invert(30%) sepia(78%) saturate(1841%) hue-rotate(152deg) brightness(102%) contrast(101%)',
                                }}
                              />
                            </Box>
                          </Box>
                          <Box>
                            <Typography sx={{ fontWeight: 'bold' }}>{end.label}</Typography>
                            {/* <Typography>{currentEvent.departureCity}</Typography> */}
                          </Box>
                          <Box className={classes.fontRight}>
                            <Typography variant="h4" className={classes.hourTypo}>
                              {format(stringToDate(endTime), 'HH:mm', {
                                locale: frLocale,
                              })}
                            </Typography>
                          </Box>
                        </Box>
                        {description && (
                          <Box
                            bgcolor="grey.f7"
                            borderRadius="10px"
                            mb={3}
                            sx={{ padding: '5px 16px 16px 16px' }}
                          >
                            <Typography variant="caption" color="textSecondary">
                              Description
                            </Typography>
                            <Typography>{description}</Typography>
                          </Box>
                        )}
                        <Divider>
                          {currentEvent.transports[transportIndex + 1] && (
                            <Box
                              bgcolor="vertclair.main"
                              borderRadius="10px"
                              p={2}
                              width="max-content"
                              display="flex"
                              justifyContent="center"
                            >
                              <Typography color="primary">
                                Correspondance :{' '}
                                {formatDuration(
                                  intervalToDuration({
                                    start: stringToDate(endTime),
                                    end: stringToDate(
                                      currentEvent.transports[transportIndex + 1].startTime
                                    ),
                                  }),
                                  {
                                    format: ['days', 'hours', 'minutes'],
                                    locale: frLocale,
                                  }
                                )
                                  .replace('jours', 'j')
                                  .replace('jour', 'j')
                                  .replace('heures', 'h')
                                  .replace('heure', 'h')
                                  .replace('minutes', 'min')
                                  .replace('minute', 'min')}
                              </Typography>
                            </Box>
                          )}
                        </Divider>
                      </Fragment>
                    )
                  )}
                </>
              )}
              {(currentEventType === EVENT_TYPES[0] ||
                currentEventType === EVENT_TYPES[2] ||
                currentEventType === EVENT_TYPES[4]) &&
                currentEvent.description.length > 0 && (
                  <Box mt={2}>
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        Description
                      </Typography>
                    </Box>
                    <Box mb={1}>
                      <Typography>{currentEvent.description}</Typography>
                    </Box>
                  </Box>
                )}
              {currentEventType === EVENT_TYPES[1] && (
                <FlightPreview flightArray={currentEvent.flights} />
              )}
            </Box>
          </Container>
        </Paper>
        <Paper elevation={1} className={classes.borderRadiusMobile}>
          <Container disableGutters>
            <Box p={4} mb={3}>
              <Box pb={0.7}>
                <Typography variant="h5">
                  <Box component="span" fontWeight="bold">
                    Qui participe ?
                  </Box>
                </Typography>
              </Box>
              <Typography variant="body2" color="textSecondary">
                {currentEvent.participatingTravelers.length} sélectionné
                {currentEvent.participatingTravelers.length > 1 && 's'}
              </Typography>
              <Box pt={1.5} display="flex" justifyContent="flex-start" flexWrap="wrap">
                {currentEvent.participatingTravelers.map(participatingTraveler => (
                  <Box key={uuidv4()} className={classes.participantsBox}>
                    {participatingTraveler.name}
                  </Box>
                ))}
              </Box>
            </Box>
          </Container>
        </Paper>
        {(currentEventType === EVENT_TYPES[0] ||
          currentEventType === EVENT_TYPES[1] ||
          currentEventType === EVENT_TYPES[2] ||
          currentEventType === EVENT_TYPES[3]) &&
          (currentEvent.price || currentEvent.location?.priceLevel) && (
            <Paper elevation={1} className={classes.borderRadiusMobile}>
              <Container disableGutters>
                <Box p={4} mb={3}>
                  <Typography variant="h5">
                    <Box pb={1.5} component="span" fontWeight="bold">
                      Combien ça coûte ?
                    </Box>
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplate: '1fr / 1fr 1fr' }}>
                    <Box pt={1.5}>
                      <Typography variant="caption" color="textSecondary">
                        Prix total
                      </Typography>
                      <Box mt={1}>
                        <Typography variant="h4">
                          <Box component="span" fontWeight="bold">
                            {Math.floor(currentEvent.price * 100) / 100} €
                          </Box>
                        </Typography>
                      </Box>
                      {(currentEventType === EVENT_TYPES[2] ||
                        currentEventType === EVENT_TYPES[3]) && (
                        <Box mt={1}>
                          <Typography variant="h6" color="primary">
                            ≈ {currentEvent.totalPriceEuro} {/* TODO API conversion */}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    <Box pt={1.5} display="flex">
                      <Divider orientation="vertical" flexItem />
                      <Box ml={2}>
                        <Typography variant="caption" color="textSecondary">
                          Prix par personne
                        </Typography>
                        <Box mt={1}>
                          <Typography variant="h4">
                            <Box component="span" fontWeight="bold">
                              {Math.floor(
                                (currentEvent.price / currentEvent.participatingTravelers.length) *
                                  100
                              ) / 100}{' '}
                              €
                            </Box>
                          </Typography>
                        </Box>
                        {(currentEventType === EVENT_TYPES[2] ||
                          currentEventType === EVENT_TYPES[3]) && (
                          <Box mt={1}>
                            <Typography variant="h6" color="primary">
                              ≈ {currentEvent.totalPerPersoneEuro}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Container>
            </Paper>
          )}
        {currentEventType === EVENT_TYPES[4] && currentEvent.priceLevel && (
          <Paper elevation={1} className={classes.borderRadiusMobile}>
            <Container disableGutters>
              <Box p={4} mb={3}>
                <Box pb={2.5}>
                  <Typography variant="h5">
                    <Box component="span" fontWeight="bold">
                      Combien ça coûte ?
                    </Box>
                  </Typography>
                </Box>
                <Box pb={1} display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="textSecondary">
                    Classification Google
                  </Typography>
                </Box>
                <Box>
                  <EuroIcon />
                </Box>
              </Box>
            </Container>
          </Paper>
        )}
        <Paper className={classes.borderRadiusMobile}>
          <Container disableGutters>
            <Box p={4} mb={3}>
              <Box pb={1.5}>
                <Typography variant="h5">
                  <Box component="span" fontWeight="bold">
                    Comment y aller ?
                  </Box>
                </Typography>
              </Box>
              <Box pb={1.5} display="flex" alignItems="center">
                <RoomRoundedIcon fontSize="inherit" color="disabled" />
                <Typography variant="body2" color="textSecondary">
                  {(currentEventType === EVENT_TYPES[0] ||
                    currentEventType === EVENT_TYPES[2] ||
                    currentEventType === EVENT_TYPES[4]) &&
                    currentEvent.location.label}
                </Typography>
              </Box>
              {currentEvent.location && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gridGap: '10px' }}>
                  <Button
                    className={classes.greyBtn}
                    color="inherit"
                    startIcon={<Icon icon={copySolid} />}
                    disableElevation
                    onClick={() => {
                      navigator.clipboard.writeText(currentEvent.location.label)
                      toast.success('Adresse copiée !')
                    }}
                  >
                    Copier l’adresse
                  </Button>
                  <Button
                    className={classes.greyBtn}
                    startIcon={<RoomIcon />}
                    disableElevation
                    color="inherit"
                    href={`http://maps.google.com/?q=${currentEvent.location.label.replace(
                      ' ',
                      '+'
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Obtenir l’itinéraire
                  </Button>
                </Box>
              )}
            </Box>
          </Container>
        </Paper>
        {(currentEventType === EVENT_TYPES[0] ||
          currentEventType === EVENT_TYPES[2] ||
          currentEventType === EVENT_TYPES[4]) &&
          currentEvent.location.openingHours && (
            <Paper className={classes.borderRadiusMobile}>
              <Container disableGutters>
                <Box p={4}>
                  <Box pb={2} display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5">
                      <Box component="span" fontWeight="bold">
                        Horaires
                      </Box>
                    </Typography>
                    {currentEvent.location.businessStatus !== 'OPERATIONAL' && (
                      <Box className={classes.warningContainer}>
                        <Box>
                          <Info color="secondary" />
                        </Box>
                        <Typography>
                          Attention cet endroit est{' '}
                          {currentEvent.location.businessStatus === 'CLOSED_TEMPORARILY' &&
                            'temporairement '}
                          fermé !
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  {openingHours.map((day, dayIndex) => (
                    <Box
                      key={day}
                      p={2}
                      display="flex"
                      justifyContent="space-between"
                      sx={
                        dayIndex % 2 === 0
                          ? { backgroundColor: '#F7F7F7', borderRadius: '5px' }
                          : {}
                      }
                    >
                      <Typography>{day}</Typography>
                      <Typography>
                        {currentEvent.location.openingHours[dayIndex]?.open &&
                        currentEvent.location.openingHours[dayIndex]?.close
                          ? `${[
                              currentEvent.location.openingHours[dayIndex].open?.time.slice(0, 2),
                              'H',
                              currentEvent.location.openingHours[dayIndex].open?.time.slice(2),
                            ].join('')} - ${[
                              currentEvent.location.openingHours[dayIndex].close?.time.slice(0, 2),
                              'H',
                              currentEvent.location.openingHours[dayIndex].close?.time.slice(2),
                            ].join('')}`
                          : "Pas d'information"}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Container>
            </Paper>
          )}
        {canEdit && (
          <Paper className={classes.borderRadiusMobile}>
            <Container disableGutters>
              <Box p={4} my={3}>
                <Typography variant="h5">
                  <Box component="span" fontWeight="bold">
                    Gérer l’événement
                  </Box>
                </Typography>
                <Box
                  sx={{
                    marginTop: '10px',
                    display: 'flex',
                    gridGap: '10px',
                    flexDirection: 'column',
                  }}
                >
                  <Button
                    className={classes.greyBtn}
                    startIcon={<CreateIcon />}
                    disableElevation
                    color="inherit"
                    onClick={() => {
                      setEventType(previousEvent ? previousEvent.type : currentEventType)
                      setEditMode(true)
                      setCurrentView('creator')
                    }}
                  >
                    Modifier l&rsquo;événement
                  </Button>
                  <Button
                    startIcon={<DeleteIcon />}
                    disableElevation
                    className={classes.deleteBtn}
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    Supprimer l&apos;événement
                  </Button>
                </Box>
              </Box>
            </Container>
          </Paper>
        )}
      </Box>
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle className={classes.deleteDialogTitle}>Supprimer l&apos;événement</DialogTitle>
        <Box position="absolute" top="2%" right="2%">
          <IconButton onClick={() => setIsDeleteDialogOpen(false)} size="large">
            <Close />
          </IconButton>
        </Box>
        <Box mb={5}>
          <Divider />
        </Box>
        <DialogContent>
          <DialogContentText variant="h4" align="center" color="textPrimary" component="h3">
            Veux-tu vraiment supprimer cet événement&nbsp;?
          </DialogContentText>
          <DialogContentText align="center">
            Cet événement sera supprimé définitivement.
          </DialogContentText>
        </DialogContent>
        <DialogActions classes={{ root: classes.deleteDialogActionsContainer }}>
          <Button
            onClick={() => setIsDeleteDialogOpen(false)}
            variant="contained"
            autoFocus
            disableElevation
          >
            Retour
          </Button>
          <Button onClick={handleDelete} color="secondary" variant="contained" disableElevation>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default EventPreview
