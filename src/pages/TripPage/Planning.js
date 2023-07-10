/* eslint-disable no-restricted-syntax */
/* eslint-disable no-labels */
import React, { Fragment, useContext, useEffect, useState } from 'react'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonBase from '@mui/material/ButtonBase'
import Container from '@mui/material/Container'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import Fab from '@mui/material/Fab'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { makeStyles, useTheme } from '@mui/styles'
import { alpha } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import AirplanemodeActiveRounded from '@mui/icons-material/AirplanemodeActiveRounded'
import ArrowBackIos from '@mui/icons-material/ArrowBackIos'
import Close from '@mui/icons-material/Close'
import DirectionsBusFilled from '@mui/icons-material/DirectionsBusFilled'
import ExploreRounded from '@mui/icons-material/ExploreRounded'
import HomeRounded from '@mui/icons-material/HomeRounded'
import RestaurantMenuRounded from '@mui/icons-material/RestaurantMenuRounded'
import UpdateRounded from '@mui/icons-material/UpdateRounded'
import {
  eachDayOfInterval,
  format,
  formatDuration,
  intervalToDuration,
  isAfter,
  isSameDay,
  isToday,
  isWithinInterval,
  startOfDay,
} from 'date-fns'

import frLocale from 'date-fns/locale/fr'
import TimeLineIcon from '@mui/icons-material/Timeline'
import { v4 as uuidv4 } from 'uuid'
import clsx from 'clsx'
import { useHistory, useLocation } from 'react-router-dom'
import queryString from 'query-string'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import capitalize from 'lodash.capitalize'

import { getEventStartDate, getWidth, rCTFF, stringToDate } from '../../helper/functions'
import EventCreator from './components/EventCreator'
import CardMenu from '../../components/atoms/CardMenu'
import CustomAvatar from '../../components/atoms/CustomAvatar'
import EventPreview from './components/EventPreview'
import { EVENT_TYPES } from '../../helper/constants'
import Map from './components/PlanningMap'
import { FirebaseContext } from '../../contexts/firebase'
import { SessionContext } from '../../contexts/session'
import { PlanningContext } from '../../contexts/planning'
import EventAdd from './components/EventAdd'
import SurveyPreview from './components/SurveyPreview'
import FabDial from '../../components/atoms/FabDial'
import findIcon, { findGoogleMarker, findSpecificGoogleMarker } from '../../helper/icons'
import CustomMarker from '../../components/atoms/CustomMarker'
import EventCard from './components/EventCard'

import mixedIcon from '../../images/eventCreator/transport/mixed.svg'
import lineMobile from '../../images/icons/lineMobile.svg'
import { TripContext } from '../../contexts/trip'
import PlanningFeed from './components/PlanningFeed'
import EventsTimeline from '../../components/molecules/EventsTimeline'
import MobileTripPageHeader from '../../components/molecules/MobileTripPageHeader'

const useStyles = makeStyles(theme => ({
  calendarArea: {
    gridArea: 'calendarArea',
    display: 'grid',
    gridTemplate: '64px / 1fr 180px',
    columnGap: '20px',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    overflowY: 'auto',
    border: 'none',
    boxShadow:
      '0px 2px 1px -1px rgb(220 220 220 / 20%), 0px 2px 1px 0px rgb(220 220 220 / 14%), 0px 2px 1px 0px rgb(220 220 220 / 12%)',
    zIndex: '2',
    [theme.breakpoints.down('sm')]: {
      position: 'sticky',
      top: '-140px',
      zIndex: '10',
      borderRadius: '40px 40px 0 0',
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.08), 0px 1px 3px rgba(0, 0, 0, 0.1)',
      alignItems: 'center',
      gridTemplate: 'min-content 1fr/ auto',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
  },
  mobilePlanningTitle: {
    [theme.breakpoints.down('sm')]: {
      gridColumn: '1 / 3',
      alignSelf: 'stretch',
    },
  },
  boxPlanning: {
    width: '100%',
    height: '100vh',
    display: 'grid',
    gridTemplateColumns: '200px 200px 1fr',
    gridTemplateRows: '64px 1fr',
    gridTemplateAreas: `
    "calendarArea calendarArea calendarArea"
    "previewArea previewArea mapArea"
    `,
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
      height: 'unset',
      gridTemplateRows: '460px max-content 1fr',
      gridTemplateAreas: `
      "mapArea" 
      "calendarArea" 
      "previewArea"
      `,
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
  },
  calendarTitle: {
    backgroundColor: '#F7F7F7',
    height: '50px',
    borderRadius: '10px',
    cursor: 'pointer',
    minWidth: '50px',
    transition: 'all .2s',
    margin: '0 8px',
    '&:hover': {
      backgroundColor: '#DFDFDF',
    },
    '& .MuiTouchRipple-root': {
      borderRadius: '30px',
    },
  },
  mobileCalendarTitle: {
    [theme.breakpoints.down('sm')]: {
      margin: '0 4px',
    },
  },
  activeCalendarTitle: {
    backgroundColor: '#009D8C!important',
    color: '#FFFFFF',
  },
  map: {
    gridArea: 'mapArea',
    [theme.breakpoints.down('sm')]: {
      position: 'fixed',
      top: '-10px',
      left: '0',
      width: '100%',
      height: '480px',
    },
  },
  eventCreator: {
    gridArea: 'previewArea',
    overflowY: 'auto',
    overflowX: 'hidden',
    minHeight: 'calc(100vh - 64px)',
    maxHeight: 'calc(100vh - 64px)',
    padding: '20px 20px 0',
    placeItems: 'center',
    borderRadius: '10px 10px 0 0',
    backgroundColor: 'white',
    [theme.breakpoints.down('sm')]: {
      gridRowStart: 'mapArea',
      gridRowEnd: 'previewArea',
      minHeight: '100vh',
      maxHeight: '100vh',
      zIndex: '10000',
      margin: '0',
      padding: '0',
      paddingBottom: '80px',
      backgroundColor: 'white',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
  },
  chronoFeed: {
    gridArea: 'previewArea',
    overflowY: 'auto',
    overflowX: 'hidden',
    minHeight: 'calc(100vh - 64px)',
    maxHeight: 'calc(100vh - 64px)',
    placeItems: 'center',
    backgroundColor: theme.palette.grey.f7,
    zIndex: '1000',
    [theme.breakpoints.down('sm')]: {
      // gridRowStart: 'mapArea',
      // gridRowEnd: 'previewArea',
      gridTemplateAreas: `
      "mapArea" 
      "calendarArea" 
      "previewArea"`,
      marginTop: 'unset',
      borderRadius: 'unset',
      // minHeight: 'calc(100vh - 260px)',
      minHeight: 'unset',
      // maxHeight: 'calc(100vh - 260px)',
      maxHeight: 'unset',
      zIndex: '1',
      margin: '0',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
      paddingBottom: '100px',
    },
  },
  previewPaper: {
    gridArea: 'previewArea',
    position: 'relative',
    borderRadius: '10px 10px 0 0',
    overflowY: 'auto',
    backgroundColor: theme.palette.grey.f2,
    [theme.breakpoints.down('sm')]: {
      borderRadius: '0',
      overflowY: 'unset',
      paddingBottom: '200px',
      zIndex: '9',
    },
  },
  FabClass: {
    position: 'absolute',
    top: '15px',
    right: '25px',
    [theme.breakpoints.down('sm')]: {
      position: 'fixed',
      top: 'unset',
      right: '50%',
      bottom: '120px',
      transform: 'translateX(50%)',
    },
  },
  surveyPaper: {
    backgroundColor: theme.palette.primary.ultraLight,
    borderRadius: '10px',
    padding: '20px',
    margin: '10px 0',
    '& button': {
      textTransform: 'unset',
      fontWeight: 'bold',
    },
    [theme.breakpoints.down('sm')]: {
      backgroundColor: theme.palette.grey.df,
    },
  },
  hoveredSurvey: {
    backgroundColor: alpha(theme.palette.primary.light, 0.4),
    [theme.breakpoints.down('sm')]: {
      backgroundColor: theme.palette.grey.df,
    },
  },
  propositionPaper: {
    borderRadius: '10px',
    display: 'grid',
    gridTemplate: '1fr / 60px 1fr',
    padding: '20px',
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      gridTemplate: '1fr / 60px 1fr 45px',
      padding: '15px',
    },
  },
  propositionAvatars: {
    placeSelf: 'end',
    gridColumn: '1 / 3',
  },
  daysCarousel: {
    height: '100%',
    [theme.breakpoints.down('sm')]: {
      marginBottom: 'none',
      padding: '15px 0',
      height: 'unset',
    },
  },
  surveyCardPrice: {
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '27px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '22px',
      lineHeight: '26px',
    },
  },
  eventPreview: {
    [theme.breakpoints.down('sm')]: {
      backgroundColor: theme.palette.grey.f7,
      zIndex: '1000',
    },
  },
  mobileDateCardTitle: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '14px',
      fontWeight: '400',
      lineHeight: '20px',
    },
  },
}))

const Planning = ({ tripData, tripId }) => {
  const classes = useStyles()
  const history = useHistory()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  const location = useLocation()

  const { user } = useContext(SessionContext)
  const { firestore } = useContext(FirebaseContext)
  const {
    setDeleteEventNotifications,
    currentEvent,
    setCurrentEvent,
    editMode,
    setEditMode,
    canEdit,
  } = useContext(TripContext)
  const {
    setCurrentMarkers,
    setTransportMarkers,
    tempTransportMarkers,
    setTempTransportMarkers,
    handleTransportMarkers,
    planningMapRef,
    tempEventMarkers,
    setTempEventMarkers,
    currentEventId,
    setCurrentEventId,
    setNeedMapRefresh,
    currentMarkers,
    plannedEvents,
    setPlannedEvents,
    setSelectedDateOnPlanning,
    isNewDatesSectionOpen,
    setIsNewDatesSectionOpen,
    currentEvents,
    setCurrentEvents,
    withoutDatesEvents,
    setWithoutDatesEvents,
    currentView,
    setCurrentView,
    previousEvent,
    setPreviousEvent,
    setEvent,
    setSurvey,
    selectedPropositionIndex,
    setSelectedPropositionIndex,
    eventType,
    setEventType,
    setTypeCreator,
    getPlaceTown,
  } = useContext(PlanningContext)
  const { days, setDays, selectedDateOnPlanning } = useContext(TripContext)

  const [isMounted, setIsMounted] = useState(false)
  const [currentDateRange, setCurrentDateRange] = useState([])
  const [anchorEl, setAnchorEl] = useState(null)
  const [isNewProposition, setIsNewProposition] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const buildFlightTitle = flights =>
    `Vol de ${flights[0].data.airports[0].label} vers ${
      flights[flights.length - 1].data.airports[
        flights[flights.length - 1].data.airports.length - 1
      ].label
    }`

  useEffect(() => {
    if (days.length > 0 && typeof selectedDateOnPlanning !== 'undefined') {
      days.forEach(day => {
        if (isSameDay(selectedDateOnPlanning, day)) {
          setSelectedDateOnPlanning(day)
        }
      })
    }
  }, [])

  useEffect(() => {
    if (tripId) {
      firestore
        .collection('trips')
        .doc(tripId)
        .collection('planning')
        .onSnapshot(querySnapshot => {
          const events = []
          querySnapshot.forEach(doc => {
            events.push({ ...doc.data(), id: doc.id })
          })
          setPlannedEvents(events)
        })
    }
  }, [tripId])

  useEffect(() => {
    if (
      tripData.dateRange &&
      tripData.dateRange.length &&
      tripData.dateRange[0] !== '' &&
      tripData.dateRange[1] !== ''
    ) {
      setCurrentDateRange(rCTFF(tripData.dateRange, 'dd MMMM'))
      const tempInterval = rCTFF(tripData.dateRange)
      if (
        days.length < 1 ||
        !isSameDay(tempInterval[0], days[0]) ||
        !isSameDay(tempInterval[1], days[days.length - 1])
      ) {
        setDays(
          eachDayOfInterval({
            start: tempInterval[0],
            end: tempInterval[1],
          })
        )
      }
    }
  }, [tripData.dateRange])

  // useEffect(() => {
  //   if (days.length && plannedEvents.length) {
  //     days.forEach(day => {
  //       if (isToday(day) && !isMounted && planningMapRef.current) {
  //         setSelectedDateOnPlanning(day)
  //         setCurrentView('planning')
  //       }
  //     })
  //   }
  // }, [days, plannedEvents, planningMapRef])

  useEffect(() => {
    const tempWithoutDatesEvents = { surveys: [], events: [] }
    const filteredWithoutDatesEvents = plannedEvents.filter(
      plannedEvent => plannedEvent.needNewDates
    )
    filteredWithoutDatesEvents.forEach(withoutDateEvent => {
      if (withoutDateEvent.isSurvey) {
        tempWithoutDatesEvents.surveys.push(withoutDateEvent)
      } else {
        tempWithoutDatesEvents.events.push(withoutDateEvent)
      }
    })
    setWithoutDatesEvents(tempWithoutDatesEvents)

    const tempEvents = { surveys: [], events: [] }
    // Preview
    if (selectedDateOnPlanning === '' && !isNewDatesSectionOpen) {
      plannedEvents
        .filter(plannedEvent => !plannedEvent?.needNewDates)
        .forEach(plannedEvent => {
          if (plannedEvent.type === EVENT_TYPES[0]) {
            if (plannedEvent.isSurvey) {
              tempEvents.surveys.push(plannedEvent)
            } else {
              tempEvents.events.push(plannedEvent)
            }
          }
          if (plannedEvent.type === EVENT_TYPES[1]) {
            if (plannedEvent.isSurvey) {
              plannedEvent.propositions.some(proposition => {
                proposition.flights.some(flight => {
                  const currentFlightDate = rCTFF(flight.date)
                  if (
                    isSameDay(days[0], currentFlightDate) ||
                    isSameDay(days[days.length - 1], currentFlightDate)
                  ) {
                    tempEvents.surveys.push(plannedEvent)
                    return true
                  }
                  return false
                })
                return false
              })
            } else {
              for (
                let transportIndex = 0;
                transportIndex < plannedEvent.flights.length;
                transportIndex += 1
              ) {
                const currentFlightDate = rCTFF(plannedEvent.flights[transportIndex].date)
                if (
                  isSameDay(days[0], currentFlightDate) ||
                  isSameDay(days[days.length - 1], currentFlightDate)
                ) {
                  tempEvents.events.push(plannedEvent)
                  break
                }
              }
            }
          }
          if (plannedEvent.type === EVENT_TYPES[3]) {
            if (plannedEvent.isSurvey) {
              plannedEvent.propositions.some(proposition => {
                proposition.transports.some(transport => {
                  const zonedTimeStart = stringToDate(transport.startTime, 'yyyy-MM-dd HH:mm')
                  const zonedTimeEnd = stringToDate(transport.endTime, 'yyyy-MM-dd HH:mm')
                  if (
                    isSameDay(days[0], zonedTimeStart) ||
                    isSameDay(days[days.length - 1], zonedTimeEnd)
                  ) {
                    tempEvents.surveys.push(plannedEvent)
                    return true
                  }
                  return false
                })
                return false
              })
            } else {
              for (
                let transportIndex = 0;
                transportIndex < plannedEvent.transports.length;
                transportIndex += 1
              ) {
                const currentStartDateTime = stringToDate(
                  plannedEvent.transports[transportIndex].startTime,
                  'yyyy-MM-dd HH:mm'
                )
                const currentEndDateTime = stringToDate(
                  plannedEvent.transports[transportIndex].endTime,
                  'yyyy-MM-dd HH:mm'
                )
                if (
                  isSameDay(days[0], currentStartDateTime) ||
                  isSameDay(days[days.length - 1], currentEndDateTime)
                ) {
                  tempEvents.events.push(plannedEvent)
                  break
                }
              }
            }
          }
        })
    }
    // Dynamic days
    if (selectedDateOnPlanning) {
      plannedEvents
        .filter(plannedEvent => !plannedEvent?.needNewDates)
        .forEach(plannedEvent => {
          if (plannedEvent.type === EVENT_TYPES[0]) {
            if (plannedEvent.isSurvey) {
              for (
                let propositionIndex = 0;
                propositionIndex < plannedEvent.propositions?.length;
                propositionIndex += 1
              ) {
                const currentArrivalDateTime = startOfDay(
                  stringToDate(
                    plannedEvent.propositions[propositionIndex].startTime,
                    'yyyy-MM-dd HH:mm'
                  )
                )
                const currentDepartureDateTime = startOfDay(
                  stringToDate(
                    plannedEvent.propositions[propositionIndex].endTime,
                    'yyyy-MM-dd HH:mm'
                  )
                )
                if (
                  isAfter(currentDepartureDateTime, currentArrivalDateTime) &&
                  isWithinInterval(selectedDateOnPlanning, {
                    start: currentArrivalDateTime,
                    end: currentDepartureDateTime,
                  })
                ) {
                  tempEvents.surveys.push(plannedEvent)
                  break
                }
              }
            } else {
              const currentArrivalDateTime = startOfDay(
                stringToDate(plannedEvent.startTime, 'yyyy-MM-dd HH:mm')
              )
              const currentDepartureDateTime = startOfDay(
                stringToDate(plannedEvent.endTime, 'yyyy-MM-dd HH:mm')
              )
              if (
                isAfter(currentDepartureDateTime, currentArrivalDateTime) &&
                isWithinInterval(selectedDateOnPlanning, {
                  start: currentArrivalDateTime,
                  end: currentDepartureDateTime,
                })
              ) {
                tempEvents.events.push(plannedEvent)
              }
            }
          } else if (plannedEvent.type === EVENT_TYPES[1]) {
            if (plannedEvent.isSurvey) {
              plannedEvent.propositions.some(proposition => {
                proposition.flights.some(flight => {
                  if (isSameDay(selectedDateOnPlanning, rCTFF(flight.date))) {
                    tempEvents.surveys.push(plannedEvent)
                    return true
                  }
                  return false
                })
                return false
              })
            } else {
              for (
                let transportIndex = 0;
                transportIndex < plannedEvent.flights.length;
                transportIndex += 1
              ) {
                if (
                  isSameDay(
                    selectedDateOnPlanning,

                    rCTFF(plannedEvent.flights[transportIndex].date)
                  )
                ) {
                  tempEvents.events.push(plannedEvent)
                  break
                } else if (
                  isSameDay(
                    selectedDateOnPlanning,

                    rCTFF(plannedEvent.flights[transportIndex].data.timings[1])
                  ) &&
                  !isSameDay(
                    rCTFF(plannedEvent.flights[transportIndex].date),

                    rCTFF(plannedEvent.flights[transportIndex].data.timings[1])
                  )
                ) {
                  tempEvents.events.push(plannedEvent)
                  break
                }
              }
            }
          } else if (plannedEvent.type === EVENT_TYPES[3]) {
            if (plannedEvent.isSurvey) {
              plannedEvent.propositions.some(proposition => {
                proposition.transports.some(transport => {
                  if (
                    isAfter(
                      stringToDate(transport.endTime, 'yyyy-MM-dd HH:mm'),
                      stringToDate(transport.startTime, 'yyyy-MM-dd HH:mm')
                    )
                      ? eachDayOfInterval({
                          start: stringToDate(transport.startTime, 'yyyy-MM-dd HH:mm'),
                          end: stringToDate(transport.endTime, 'yyyy-MM-dd HH:mm'),
                        }).some(day => isSameDay(day, selectedDateOnPlanning))
                      : eachDayOfInterval({
                          start: stringToDate(transport.endTime, 'yyyy-MM-dd HH:mm'),
                          end: stringToDate(transport.startTime, 'yyyy-MM-dd HH:mm'),
                        }).some(day => isSameDay(day, selectedDateOnPlanning))
                  ) {
                    tempEvents.surveys.push(plannedEvent)
                    return true
                  }
                  return false
                })
                return false
              })
            } else {
              for (
                let transportIndex = 0;
                transportIndex < plannedEvent.transports.length;
                transportIndex += 1
              ) {
                const currentStartDateTime = startOfDay(
                  stringToDate(
                    plannedEvent.transports[transportIndex].startTime,
                    'yyyy-MM-dd HH:mm'
                  )
                )
                const currentEndDateTime = startOfDay(
                  stringToDate(plannedEvent.transports[transportIndex].endTime, 'yyyy-MM-dd HH:mm')
                )
                if (
                  (isAfter(currentEndDateTime, currentStartDateTime) &&
                    isWithinInterval(selectedDateOnPlanning, {
                      start: currentStartDateTime,
                      end: currentEndDateTime,
                    })) ||
                  (isSameDay(selectedDateOnPlanning, currentStartDateTime) &&
                    isSameDay(currentStartDateTime, currentEndDateTime))
                ) {
                  tempEvents.events.push(plannedEvent)
                  break
                }
              }
            }
          } else if (plannedEvent.type === EVENT_TYPES[2] || plannedEvent.type === EVENT_TYPES[4]) {
            if (plannedEvent.isSurvey) {
              if (
                plannedEvent.propositions.some(proposition =>
                  isSameDay(
                    selectedDateOnPlanning,
                    stringToDate(proposition.startTime, 'yyyy-MM-dd HH:mm')
                  )
                )
              ) {
                tempEvents.surveys.push(plannedEvent)
              }
            } else if (
              isSameDay(selectedDateOnPlanning, stringToDate(plannedEvent.date, 'yyyy-MM-dd'))
            ) {
              tempEvents.events.push(plannedEvent)
            }
          }
        })
    }
    tempEvents.events = tempEvents.events.sort(
      (a, b) => getEventStartDate(a) - getEventStartDate(b)
    )
    setCurrentEvents(tempEvents)
  }, [selectedDateOnPlanning, plannedEvents, isNewDatesSectionOpen])

  useEffect(() => {
    if (!currentEventId) {
      setNeedMapRefresh(true)
    }
  }, [currentMarkers, currentEventId])

  useEffect(() => {
    if (!isMounted && plannedEvents?.length) {
      setIsMounted(true)
      const queries = queryString.parse(location.search)
      const { event: eventId, survey: surveyId, proposition: propositionIndex } = queries
      if (surveyId && propositionIndex) {
        setCurrentEvent(
          plannedEvents.filter(currentPlannedEvent => currentPlannedEvent.id === surveyId)[0]
            .propositions[propositionIndex]
        )
        setPreviousEvent(
          plannedEvents.filter(currentPlannedEvent => currentPlannedEvent.id === surveyId)[0]
        )
        setCurrentView('preview')
      } else if (surveyId) {
        setSurvey(
          plannedEvents.filter(currentPlannedEvent => currentPlannedEvent.id === surveyId)[0]
        )
      } else if (eventId) {
        setEvent(plannedEvents.filter(currentPlannedEvent => currentPlannedEvent.id === eventId)[0])
      } else {
        history.push(`/tripPage/${tripId}/planning`)
      }
    }
  }, [currentEvent, plannedEvents])

  // useEffect(() => {
  //   const queries = queryString.parse(location.search)
  //   const { event: eventId, survey: surveyId, proposition: propositionIndex } = queries
  //   if (!eventId && !surveyId && !propositionIndex) {
  //     setIsNewDatesSectionOpen(false)
  //     setSelectedDateOnPlanning('')
  //     setCurrentView('chronoFeed')
  //   }
  // }, [location.search])

  useEffect(() => {
    if (
      currentView !== 'creator' &&
      (tempTransportMarkers.transportMarkers.length > 0 ||
        tempTransportMarkers.transportCoordinates.length > 0)
    ) {
      setTempTransportMarkers({ transportMarkers: [], transportCoordinates: [] })
    }
    if (currentView !== 'creator' && tempEventMarkers.length > 0) {
      setTempEventMarkers([])
    }
  }, [currentView])

  const handleOpenDropdown = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseDropdown = () => {
    setAnchorEl(null)
  }

  const addActions = [
    {
      icon: <HomeRounded />,
      name: 'Hébergement',
      callback: setTypeCreator(EVENT_TYPES[0]),
    },
    { icon: <AirplanemodeActiveRounded />, name: 'Vols', callback: setTypeCreator(EVENT_TYPES[1]) },
    { icon: <DirectionsBusFilled />, name: 'Transports', callback: setTypeCreator(EVENT_TYPES[3]) },
    {
      icon: <RestaurantMenuRounded />,
      name: 'Restaurant',
      callback: setTypeCreator(EVENT_TYPES[4]),
    },
    { icon: <ExploreRounded />, name: 'Exploration', callback: setTypeCreator(EVENT_TYPES[2]) },
  ]

  const handleDelete = () => {
    firestore
      .collection('trips')
      .doc(tripId)
      .collection('planning')
      .doc(currentEvent.id)
      .delete()
      .then(() => {
        setIsDeleteDialogOpen(false)
        setDeleteEventNotifications(true)
      })
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
        const tempEvent = { ...tempDoc, id: currentEvent.id }
        setCurrentEvent(tempEvent)
      })
  }

  return (
    <>
      <Box className={classes.boxPlanning}>
        {currentView === 'chronoFeed' && (
          <PlanningFeed propsClasses={classes.chronoFeed} setCurrentView={setCurrentView} />
        )}
        {canEdit && currentView === 'add' && (
          <EventAdd setEventType={setEventType} setCurrentView={setCurrentView} />
        )}
        {canEdit && currentView === 'creator' && (
          <EventCreator
            propsClasses={classes.eventCreator}
            eventType={eventType}
            setCurrentView={setCurrentView}
            setEventType={setEventType}
            tripId={tripId}
            travelers={tripData.travelersDetails}
            dateRange={tripData.dateRange}
            selectedDateFromPlanning={selectedDateOnPlanning}
            setSelectedDateFromPlanning={setSelectedDateOnPlanning}
            isNewProposition={isNewProposition}
            setIsNewProposition={setIsNewProposition}
            currentEvent={currentEvent}
            setCurrentEvent={setCurrentEvent}
            previousEvent={previousEvent}
            setPreviousEvent={setPreviousEvent}
            selectedPropositionIndex={selectedPropositionIndex}
            planningMapRef={planningMapRef}
            buildFlightTitle={buildFlightTitle}
          />
        )}
        {currentView === 'preview' && typeof currentEvent !== 'undefined' && (
          <EventPreview
            currentEvent={currentEvent}
            setCurrentEvent={setCurrentEvent}
            setCurrentView={setCurrentView}
            propsClasses={clsx(classes.eventCreator, classes.eventPreview)}
            tripId={tripId}
            previousEvent={previousEvent}
            setPreviousEvent={setPreviousEvent}
            selectedPropositionIndex={selectedPropositionIndex}
            setSelectedPropositionIndex={setSelectedPropositionIndex}
            setEventType={setEventType}
          />
        )}
        <Paper variant="outlined" square className={classes.calendarArea}>
          {matchesXs && <MobileTripPageHeader />}
          <Box
            sx={{
              display: 'grid',
              gridTemplate: '1fr / min-content 1fr',
            }}
            p
          >
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Paper
                component={ButtonBase}
                onClick={() => {
                  setIsNewDatesSectionOpen(false)
                  setSelectedDateOnPlanning('')
                  setCurrentView('chronoFeed')
                }}
                elevation={0}
                className={clsx(classes.calendarTitle)}
                style={
                  selectedDateOnPlanning === '' && !isNewDatesSectionOpen
                    ? {
                        backgroundColor: '#009D8C',
                        color: '#FFFFFF',
                      }
                    : {}
                }
              >
                <Box
                  sx={{
                    padding: '0',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                  }}
                >
                  <TimeLineIcon sx={{ fontSize: '30px' }} />
                </Box>
              </Paper>
              {(withoutDatesEvents.surveys.length > 0 || withoutDatesEvents.events.length > 0) && (
                <Paper
                  component={ButtonBase}
                  onClick={() => {
                    setIsNewDatesSectionOpen(true)
                    setSelectedDateOnPlanning('')
                    setCurrentView('planning')
                  }}
                  elevation={0}
                  className={clsx(classes.calendarTitle, {
                    [classes.activeCalendarTitle]: isNewDatesSectionOpen,
                    [classes.mobileCalendarTitle]: matchesXs,
                  })}
                >
                  <Box
                    sx={{
                      padding: '0',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                    }}
                  >
                    <UpdateRounded sx={{ fontSize: '30px' }} />
                  </Box>
                </Paper>
              )}
            </Box>
            <Carousel
              removeArrowOnDeviceType="mobile"
              autoPlay={false}
              infinite={false}
              shouldResetAutoplay={false}
              responsive={{
                bigDesktop: {
                  breakpoint: {
                    max: 8000,
                    min: 1301,
                  },
                  items: Math.floor((getWidth() - 700) / 67), // TODO replace getWidth by a hook to optimize
                  slidesToSlide: 7,
                },
                tablet: {
                  breakpoint: {
                    max: 1300,
                    min: 641,
                  },
                  items: Math.floor((getWidth() - 350) / 67), // TODO replace getWidth by a hook to optimize
                  slidesToSlide: 7,
                },
                mobile: {
                  breakpoint: {
                    max: 640,
                    min: 0,
                  },
                  items: Math.floor(getWidth() / 73), // TODO replace getWidth by a hook to optimize
                  slidesToSlide: 7,
                },
              }}
              className={classes.daysCarousel}
            >
              {days.map(day => (
                <Paper
                  key={day}
                  component={ButtonBase}
                  onClick={() => {
                    setSelectedDateOnPlanning(day)
                    setNeedMapRefresh(day)
                    setIsNewDatesSectionOpen(false)
                    setCurrentView('planning')
                  }}
                  elevation={0}
                  className={clsx(classes.calendarTitle, {
                    [classes.activeCalendarTitle]: selectedDateOnPlanning === day,
                  })}
                >
                  <Box
                    sx={{
                      padding: '0',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '12px',
                        color: selectedDateOnPlanning === day ? 'inherit' : theme.palette.grey[33],
                      }}
                    >
                      <Box component="span" fontWeight="400">
                        {format(day, 'EEE', {
                          locale: frLocale,
                        }).replace('.', '')}
                      </Box>
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '20px',
                        fontWeight: '500',
                        color: selectedDateOnPlanning === day ? 'inherit' : theme.palette.grey[33],
                      }}
                    >
                      {format(day, 'dd', {
                        locale: frLocale,
                      })}
                    </Typography>
                    {/* <Typography
                      sx={{
                        fontSize: '12px',
                        color: selectedDateOnPlanning === day ? 'inherit' : '#7B7B7B',
                      }}
                    >
                      {format(day, 'MMM', {
                        locale: frLocale,
                      }).replace('.', '')}
                    </Typography> */}
                  </Box>
                </Paper>
              ))}
            </Carousel>
          </Box>
        </Paper>

        {currentView === 'planning' && (
          <>
            <Paper className={classes.previewPaper}>
              <Container sx={{ paddingLeft: '15px !important' }}>
                <Box sx={{ margin: '32px 0', display: 'flex', alignItems: 'center' }}>
                  <IconButton
                    onClick={() => {
                      setCurrentView('chronoFeed')
                      setSelectedDateOnPlanning('')
                      setIsNewDatesSectionOpen(false)
                    }}
                    sx={{ marginRight: '15px' }}
                  >
                    <ArrowBackIos />
                  </IconButton>
                  <Typography
                    component="h5"
                    sx={{
                      fontSize: '20px',
                      fontWeight: 500,
                      lineHeight: '33px',
                    }}
                  >
                    {isNewDatesSectionOpen
                      ? 'Archives'
                      : selectedDateOnPlanning === ''
                      ? 'Aperçu de ton séjour'
                      : capitalize(
                          format(selectedDateOnPlanning, 'EEEE dd MMMM', { locale: frLocale })
                        )}
                  </Typography>
                </Box>
                {typeof currentDateRange[0] === 'undefined' ? (
                  <Typography>
                    Commence par choisir des dates de sejour pour pouvoir le plannifier
                  </Typography>
                ) : isNewDatesSectionOpen ? (
                  <>
                    {withoutDatesEvents.surveys.map(survey => (
                      <Paper
                        className={clsx(classes.surveyPaper, {
                          [classes.hoveredSurvey]: currentEventId === survey.id,
                        })}
                        key={survey.id}
                        onMouseEnter={() => setCurrentEventId(survey.id)}
                        onMouseLeave={() => setCurrentEventId()}
                      >
                        {survey.propositions
                          .sort((a, b) => b.likes.length - a.likes.length)
                          .map(proposition => {
                            const tempArrivalDateTime = stringToDate(
                              proposition?.startTime,
                              'yyyy-MM-dd HH:mm'
                            )
                            return (
                              <Paper className={classes.propositionPaper} key={uuidv4()}>
                                <Box
                                  sx={{
                                    backgroundColor: `${theme.palette.primary.main}!important`,
                                    padding: '8px',
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50px',
                                    alignContent: 'center',
                                    display: 'flex',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <Box
                                    component="img"
                                    src={findIcon(proposition.icon, survey.type)}
                                    sx={{
                                      filter:
                                        'brightness(0) saturate(100%) invert(92%) sepia(95%) saturate(0%) hue-rotate(332deg) brightness(114%) contrast(100%)',
                                    }}
                                  />
                                </Box>
                                <Box>
                                  <Typography
                                    color="primary"
                                    className={classes.mobileDateCardTitle}
                                  >
                                    {survey.type === EVENT_TYPES[0]
                                      ? `${format(tempArrivalDateTime, 'dd MMMM')} - ${format(
                                          stringToDate(proposition.endTime),
                                          'dd MMMM'
                                        )}`
                                      : survey.type === EVENT_TYPES[1]
                                      ? rCTFF(proposition.flights[0].date, 'dd MMMM')
                                      : survey.type === EVENT_TYPES[3]
                                      ? `${format(
                                          stringToDate(proposition.transports[0].startTime),
                                          'dd MMMM',
                                          {
                                            locale: frLocale,
                                          }
                                        )} - ${format(
                                          stringToDate(
                                            proposition.transports[
                                              proposition.transports.length - 1
                                            ].endTime
                                          ),
                                          'dd MMMM',
                                          {
                                            locale: frLocale,
                                          }
                                        )}`
                                      : (survey.type === EVENT_TYPES[2] ||
                                          survey.type === EVENT_TYPES[4]) &&
                                        `${format(stringToDate(proposition.startTime), 'HH:mm', {
                                          locale: frLocale,
                                        })} - ${format(stringToDate(proposition.endTime), 'HH:mm', {
                                          locale: frLocale,
                                        })}`}
                                  </Typography>
                                  <Typography variant="subtitle1">
                                    <Box fontWeight="bold" component="span">
                                      {survey.type === EVENT_TYPES[0] ||
                                      survey.type === EVENT_TYPES[2] ||
                                      survey.type === EVENT_TYPES[4]
                                        ? proposition.title.length > 39
                                          ? `${proposition.title.substring(0, 39)}...`
                                          : proposition.title
                                        : survey.type === EVENT_TYPES[1]
                                        ? `Vol`
                                        : survey.type === EVENT_TYPES[3] &&
                                          `De ${proposition.transports[0].start.label} a ${
                                            proposition.transports[
                                              proposition.transports.length - 1
                                            ].end.label
                                          }`}
                                    </Box>
                                  </Typography>
                                  <Typography className={classes.surveyCardPrice}>
                                    {proposition.price === 0
                                      ? 'Pas de prix mentionné'
                                      : proposition.price /
                                        proposition.participatingTravelers.length}{' '}
                                    €{' '}
                                    <Typography
                                      component="span"
                                      className={classes.surveyCardPrice}
                                      sx={{
                                        [theme.breakpoints.down('sm')]: {
                                          fontSize: '14px!important',
                                          lineHeight: '20px!important',
                                        },
                                      }}
                                    >
                                      / pers
                                    </Typography>
                                  </Typography>
                                  <Typography>
                                    {survey.type === EVENT_TYPES[3] &&
                                      formatDuration(
                                        intervalToDuration({
                                          start: stringToDate(proposition.transports[0].startTime),
                                          end: stringToDate(
                                            proposition.transports[
                                              proposition.transports.length - 1
                                            ].endTime
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
                                <CustomAvatar
                                  peopleIds={proposition.likes}
                                  propsClasses={classes.propositionAvatars}
                                  isLike
                                  isVertical={matchesXs}
                                />
                              </Paper>
                            )
                          })}
                        <Button
                          key={uuidv4()}
                          variant="contained"
                          color="primary"
                          fullWidth
                          onClick={() => setSurvey(survey)}
                        >
                          Voir le sondage
                        </Button>
                      </Paper>
                    ))}
                    {withoutDatesEvents.events.map(event => (
                      <EventCard
                        key={event.id}
                        currentEvent={event}
                        setCurrentEvent={setCurrentEvent}
                        setEvent={setEvent}
                        canEdit={canEdit}
                        handleOpenDropdown={handleOpenDropdown}
                        eventType={event.type}
                        isWithoutDate
                      />
                    ))}
                  </>
                ) : (
                  <>
                    {currentEvents.surveys.length > 0 && (
                      <>
                        <Typography variant="h6">Propositions</Typography>
                        {currentEvents.surveys.map(survey => (
                          <Paper
                            className={clsx(classes.surveyPaper, {
                              [classes.hoveredSurvey]: survey.id === currentEventId,
                            })}
                            key={survey.id}
                            onMouseEnter={() => setCurrentEventId(survey.id)}
                            onMouseLeave={() => setCurrentEventId()}
                          >
                            {survey.propositions
                              .sort((a, b) => b.likes.length - a.likes.length)
                              .map(proposition => (
                                <Paper className={classes.propositionPaper} key={uuidv4()}>
                                  <Box
                                    sx={{
                                      backgroundColor: `${theme.palette.primary.main}!important`,
                                      padding: '8px',
                                      width: '40px',
                                      height: '40px',
                                      borderRadius: '50px',
                                      alignContent: 'center',
                                      display: 'flex',
                                      justifyContent: 'center',
                                    }}
                                  >
                                    <Box
                                      component="img"
                                      src={
                                        survey.type === EVENT_TYPES[3] &&
                                        proposition.transports.length > 1
                                          ? mixedIcon
                                          : findIcon(
                                              survey.type === EVENT_TYPES[3]
                                                ? proposition.transports[0].icon
                                                : proposition.icon,
                                              survey.type
                                            )
                                      }
                                      sx={{
                                        filter:
                                          'brightness(0) saturate(100%) invert(92%) sepia(95%) saturate(0%) hue-rotate(332deg) brightness(114%) contrast(100%)',
                                      }}
                                    />
                                  </Box>
                                  <Box>
                                    <Typography
                                      color="primary"
                                      className={classes.mobileDateCardTitle}
                                    >
                                      {survey.type === EVENT_TYPES[0]
                                        ? `${format(
                                            stringToDate(proposition.startTime),
                                            'HH:mm'
                                          )} - ${format(
                                            stringToDate(proposition.endTime),
                                            'dd MMMM'
                                          )}`
                                        : survey.type === EVENT_TYPES[1]
                                        ? rCTFF(proposition.flights[0].date, 'dd MMMM')
                                        : survey.type === EVENT_TYPES[3]
                                        ? `${format(
                                            stringToDate(proposition.transports[0].startTime),
                                            'dd MMMM'
                                          )} - ${format(
                                            stringToDate(
                                              proposition.transports[
                                                proposition.transports.length - 1
                                              ].endTime
                                            ),
                                            'dd MMMM'
                                          )}`
                                        : (survey.type === EVENT_TYPES[2] ||
                                            survey.type === EVENT_TYPES[4]) &&
                                          `${format(
                                            stringToDate(proposition.startTime),
                                            'HH:mm'
                                          )} - ${format(
                                            stringToDate(proposition.endTime),
                                            'HH:mm'
                                          )}`}
                                    </Typography>
                                    <Typography variant="subtitle1">
                                      <Box fontWeight="bold" component="span">
                                        {proposition.title.length > 39
                                          ? `${proposition.title.substring(0, 39)}...`
                                          : proposition.title}
                                      </Box>
                                    </Typography>
                                    {proposition.price !== 0 && (
                                      <Typography className={classes.surveyCardPrice}>
                                        {`${
                                          proposition.price /
                                          proposition.participatingTravelers.length
                                        } €`}
                                        {proposition.price > 0 && (
                                          <Typography
                                            component="span"
                                            className={classes.surveyCardPrice}
                                            sx={{
                                              [theme.breakpoints.down('sm')]: {
                                                fontSize: '14px!important',
                                                lineHeight: '20px!important',
                                              },
                                            }}
                                          >
                                            / pers
                                          </Typography>
                                        )}
                                      </Typography>
                                    )}
                                    <Typography>
                                      {survey.type === EVENT_TYPES[3] &&
                                        formatDuration(
                                          intervalToDuration({
                                            start: rCTFF(proposition.transports[0].startTime),
                                            end: rCTFF(
                                              proposition.transports[
                                                proposition.transports.length - 1
                                              ].endTime
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
                                  <CustomAvatar
                                    peopleIds={proposition.likes}
                                    propsClasses={classes.propositionAvatars}
                                    isLike
                                    isVertical={matchesXs}
                                  />
                                </Paper>
                              ))}
                            <Button
                              variant="contained"
                              color="primary"
                              fullWidth
                              onClick={() => setSurvey(survey)}
                            >
                              Voir le sondage
                            </Button>
                          </Paper>
                        ))}
                      </>
                    )}
                    {/* {currentEvents.events.map((event, eventIndex) => (
                      <EventCard
                        key={event.id}
                        currentEvent={event}
                        currentEventIndex={eventIndex}
                        setCurrentEvent={setCurrentEvent}
                        setEvent={setEvent}
                        canEdit={canEdit}
                        handleOpenDropdown={handleOpenDropdown}
                        eventType={event.type}
                      />
                    ))} */}
                    <EventsTimeline
                      currentEvents={currentEvents}
                      canEdit={canEdit}
                      handleOpenDropdown={handleOpenDropdown}
                    />
                    {currentEvents.events.length < 1 && (
                      <Typography>
                        {selectedDateOnPlanning === '' && !isNewDatesSectionOpen
                          ? 'Pas encore de transports prévus'
                          : "Pas encore d'évenement ce jour la"}
                      </Typography>
                    )}
                  </>
                )}
              </Container>
              {canEdit && !matchesXs && typeof currentDateRange[0] !== 'undefined' && (
                <Fab
                  className={classes.FabClass}
                  color="primary"
                  onClick={() => setCurrentView('add')}
                >
                  <AddIcon fontSize="large" />
                </Fab>
              )}
            </Paper>
            {/* {canEdit && matchesXs && typeof currentDateRange[0] !== 'undefined' && (
              <FabDial actions={addActions} isPlanning />
            )} */}
          </>
        )}
        {!previousEvent && currentView === 'survey' && (
          <SurveyPreview
            setCurrentView={setCurrentView}
            currentEvent={currentEvent}
            setCurrentEvent={setCurrentEvent}
            tripId={tripId}
            setIsNewProposition={setIsNewProposition}
            setEventType={setEventType}
            setPreviousEvent={setPreviousEvent}
            setSelectedPropositionIndex={setSelectedPropositionIndex}
            canEdit={canEdit}
          />
        )}
        <Box className={classes.map}>
          <Map
            latitude={tripData.latitude}
            longitude={tripData.longitude}
            planningMapRef={planningMapRef}
          />
        </Box>
      </Box>
      <CardMenu
        anchorEl={anchorEl}
        handleCloseDropdown={handleCloseDropdown}
        options={[
          {
            label: 'Modifier',
            callback: () => {
              setEventType(currentEvent.type)
              setEditMode(true)
              setCurrentView('creator')
              history.push(`/tripPage/${tripId}/planning?event=${currentEvent.id}`)
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
            },
            isRemoved: !!currentEvent?.needNewDates,
          },
          { label: 'Supprimer', callback: () => setIsDeleteDialogOpen(true) },
        ]}
      />
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
            Veux-tu vraiment supprimer cet évènement&nbsp;?
          </DialogContentText>
          <DialogContentText align="center">
            Cet évènement sera supprimé définitivement.
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

export default Planning
