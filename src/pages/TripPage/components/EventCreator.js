/* eslint-disable no-case-declarations */
import React, { Fragment, useContext, useEffect, useState } from 'react'
import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ClearRoundedIcon from '@mui/icons-material/ClearRounded'
import AddIcon from '@mui/icons-material/Add'
import { v4 as uuidv4 } from 'uuid'
import GooglePlacesAutocomplete, { geocodeByAddress } from 'react-google-places-autocomplete'
import DatePicker from '@mui/lab/DatePicker'
import DateTimePicker from '@mui/lab/DateTimePicker'
import TimePicker from '@mui/lab/TimePicker'
import {
  add,
  isBefore,
  isValid,
  intervalToDuration,
  isWithinInterval,
  format,
  getHours,
  getMinutes,
  setMinutes,
  setHours,
  startOfDay,
} from 'date-fns'
import clsx from 'clsx'
import { useHistory } from 'react-router-dom'

import { CURRENCIES, EVENT_TYPES } from '../../../helper/constants'
import {
  dateTimeToString,
  dateToString,
  filterObjectByValue,
  rCTFF,
  stringToDate,
} from '../../../helper/functions'
import NewTransport from './NewTransport'
import NewFlight from './NewFlight'
import { FirebaseContext } from '../../../contexts/firebase'
import { SessionContext } from '../../../contexts/session'
import IconSlider from '../../../components/atoms/IconSlider'
import IconModal from '../../../components/atoms/IconModal'
import { PlanningContext } from '../../../contexts/planning'

import plusCircle from '../../../images/icons/plusCircle.svg'

const useStyles = makeStyles(theme => ({
  marginBottom: {
    marginBottom: theme.spacing(4),
  },
  travelerBtn: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
    backgroundColor: theme.palette.grey.f7,
    color: 'black',
    padding: '5px 15px',
    borderRadius: '5px',
    '&:hover': {
      backgroundColor: theme.palette.grey.f7,
    },
  },
  selectedTravelerBtn: {
    backgroundColor: 'black',
    color: 'white',
    '&:hover': {
      backgroundColor: 'black',
    },
  },
  gridContainer: {
    display: 'grid',
    gridTemplate: '1fr 1fr / 1fr 1fr',
    gridGap: '15px',
  },
  secondRowGrid: {
    gridColumn: '1 / 3',
    '& button': {
      width: '100%',
    },
  },
  priceOptionOutlined: {
    color: theme.palette.grey['82'],
    border: '1px solid #BDBDBD',
    borderRadius: '10px',
  },
  priceOptionContained: {
    borderRadius: '10px',
  },
  submitBtn: { padding: '14px 0 ', borderRadius: '5px' },
  filledInput: {
    height: 'unset',
    [theme.breakpoints.down('sm')]: {
      height: 'unset',
    },
  },
  rootMultilineInput: {
    [theme.breakpoints.down('sm')]: {
      height: 'unset',
    },
  },
  selectDeviceInput: {
    [theme.breakpoints.down('sm')]: {
      minWidth: '100%',
    },
  },
  titleInput: {
    [theme.breakpoints.down('sm')]: {
      height: '55px',
    },
  },
  textFieldLabel: {
    [theme.breakpoints.down('sm')]: {
      paddingTop: '5px',
    },
  },
  durationAccomodation: {
    backgroundColor: theme.palette.grey.f2,
    height: '36px',
    padding: '8px 12px',
    borderRadius: '5px',
    marginBottom: '30px',
    alignSelf: 'flex-start',
  },

  durationAccomodationText: {
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '20px',
  },
  dateTimePicker: {
    marginBottom: '20px',
  },
  dateTimeContainer: {
    display: 'grid',
    gridTemplate: '1fr 1fr / 1fr 1fr',
    gridGap: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      gridTemplate: '1fr 1fr / 1fr 1fr',
      gridGap: '20px',
      placeItems: 'start',
    },
  },
}))

const priceOption = [
  {
    value: 'people',
    label: 'Par personne',
  },
  {
    value: 'total',
    label: 'Prix total',
  },
]

const initialTransport = date => ({
  start: '',
  end: '',
  startTime: date,
  endTime: add(date, { hours: 2 }),
  description: '',
  icon: 'main',
  tempId: uuidv4(),
})

const initialFlight = date => ({
  date,
  number: '',
  tempId: uuidv4(),
  data: '',
  needFetch: true,
})

const EventCreator = ({
  eventType,
  propsClasses,
  setCurrentView,
  setEventType,
  tripId,
  travelers,
  dateRange,
  selectedDateFromPlanning,
  isNewProposition,
  setIsNewProposition,
  currentEvent,
  setCurrentEvent,
  previousEvent,
  setPreviousEvent,
  selectedPropositionIndex,
  editMode,
  setEditMode,
  buildFlightTitle,
}) => {
  const classes = useStyles()
  const theme = useTheme()
  const history = useHistory()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))

  const { user } = useContext(SessionContext)
  const { firestore, timestampRef, createNotificationsOnTrip } = useContext(FirebaseContext)
  const {
    handleTempFlightMarkers,
    handleTempTransportMarkers,
    handleTempEventsMarkers,
    getPlaceDetails,
    tempEventsMarkers,
  } = useContext(PlanningContext)

  const tripStartDate = rCTFF(dateRange[0])
  const tripEndDate = rCTFF(dateRange[1])
  const [daysInterval, setDaysInterval] = useState(0)
  const [monthsInterval, setMonthsInterval] = useState(0)
  const [title, setTitle] = useState('')
  const [flights, setFlights] = useState([
    { ...initialFlight(selectedDateFromPlanning || tripStartDate) },
  ])
  const [transports, setTransports] = useState([
    {
      ...initialTransport(selectedDateFromPlanning || tripStartDate),
    },
  ])
  const [selectedArrivalDateTime, setSelectedArrivalDateTime] = useState(
    selectedDateFromPlanning || tripStartDate
  )
  const [arrivalDateTimeError, setArrivalDateTimeError] = useState(false)
  const [selectedDepartureDateTime, setSelectedDepartureDateTime] = useState(
    selectedDateFromPlanning || tripStartDate
  )
  const [departureDateTimeError, setDepartureDateTimeError] = useState(false)
  const [selectedDate, setSelectedDate] = useState(selectedDateFromPlanning || tripStartDate)
  const [dateError, setDateError] = useState(false)
  const [website, setWebsite] = useState('')
  const [selectedStartTime, setSelectedStartTime] = useState(new Date())
  const [startTimeError, setStartTimeError] = useState(false)
  const [selectedEndTime, setSelectedEndTime] = useState(new Date())
  const [endTimeError, setEndTimeError] = useState(false)
  const [location, setLocation] = useState()
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(0)
  const [currency, setCurrency] = useState(CURRENCIES[0].value)
  const [totalPriceMode, setTotalPriceMode] = useState(priceOption[0].value)
  const [participatingTravelers, setParticipatingTravelers] = useState([])
  const [isSurvey, setIsSurvey] = useState(false)
  const [selectedIcon, setSelectedIcon] = useState('main')
  const [isPropositionInEdition, setIsPropositionInEdition] = useState(false)
  const [openModalIconSlider, setOpenModalIconSlider] = useState(false)
  const [tripData, setTripData] = useState()

  const generateParticipatingTravelers = () => {
    const tempTravelers = travelers
      .filter(traveler => !traveler.isNotTraveler)
      .map(traveler => {
        if (
          !editMode ||
          (editMode &&
            currentEvent.participatingTravelers.some(
              participatingTraveler => participatingTraveler.travelerId === traveler.travelerId
            ))
        ) {
          return true
        }
        return false
      })

    setParticipatingTravelers(tempTravelers)
  }

  useEffect(() => {
    if (eventType === EVENT_TYPES[1]) {
      handleTempFlightMarkers(flights)
    }
  }, [flights])

  useEffect(() => {
    if (
      eventType === EVENT_TYPES[3] &&
      transports.some(
        transport => transport?.end?.value?.place_id && transport?.start?.value?.place_id
      )
    ) {
      handleTempTransportMarkers(transports)
    }
  }, [transports])

  useEffect(() => {
    generateParticipatingTravelers()
  }, [])

  useEffect(() => {
    firestore
      .collection('trips')
      .doc(tripId)
      .onSnapshot(doc => {
        const tempDoc = doc.data()
        setTripData(tempDoc)
      })
  }, [tripId])

  useEffect(() => {
    if (isValid(selectedArrivalDateTime) && isValid(selectedDepartureDateTime)) {
      const formattedArrivalDateTime = startOfDay(selectedArrivalDateTime)
      const formattedDepartureDateTime = startOfDay(selectedDepartureDateTime)
      const dateInterval = intervalToDuration({
        start: formattedArrivalDateTime,
        end: formattedDepartureDateTime,
      })
      setDaysInterval(dateInterval.days)
      setMonthsInterval(dateInterval.months)
    } else {
      setDaysInterval(0)
      setMonthsInterval(0)
    }
  }, [selectedArrivalDateTime, selectedDepartureDateTime])

  useEffect(() => {
    if (!editMode) {
      setSelectedDepartureDateTime(add(selectedArrivalDateTime, { hours: 16 }))
    }
  }, [selectedArrivalDateTime])

  useEffect(() => {
    if (selectedDateFromPlanning && eventType === EVENT_TYPES[0] && !editMode) {
      setSelectedArrivalDateTime(add(selectedDateFromPlanning, { hours: 18 }))
    } else {
      setSelectedArrivalDateTime(add(tripStartDate, { hours: 18 }))
    }
  }, [selectedDateFromPlanning])

  useEffect(() => {
    if (!editMode) {
      setSelectedEndTime(add(selectedStartTime, { hours: 2 }))
    }
  }, [selectedStartTime])

  useEffect(() => {
    const startTime = { hours: getHours(selectedStartTime), minutes: getMinutes(selectedStartTime) }
    const endTime = { hours: getHours(selectedEndTime), minutes: getMinutes(selectedEndTime) }
    const startDate = selectedDate
    const endDate = selectedDate
    const startDateTime = setHours(setMinutes(startDate, startTime.minutes), startTime.hours)
    const endDateTime = setHours(setMinutes(endDate, endTime.minutes), endTime.hours)
    setSelectedStartTime(startDateTime)
    setSelectedEndTime(endDateTime)
  }, [selectedDate, location])

  useEffect(() => {
    if (editMode) {
      generateParticipatingTravelers()
      setTitle(currentEvent.title)
      setWebsite(currentEvent.website)
      if (previousEvent?.isSurvey) {
        setIsPropositionInEdition(true)
      }
      if (eventType === EVENT_TYPES[0]) {
        setSelectedArrivalDateTime(stringToDate(currentEvent.startTime))
        setSelectedDepartureDateTime(stringToDate(currentEvent.endTime))
        setLocation({ ...currentEvent.location })
        setDescription(currentEvent?.description)
        setPrice(currentEvent.price / currentEvent.participatingTravelers.length)
        setCurrency(currentEvent.currency)
        setSelectedIcon(currentEvent.icon)
      } else if (eventType === EVENT_TYPES[1]) {
        setFlights(
          currentEvent.flights.map(flight => ({
            ...flight,
            date: rCTFF(flight.date),
            data: { ...flight.data, timings: flight.data.timings.map(timing => rCTFF(timing)) },
          }))
        )
        setPrice(currentEvent.price / currentEvent.participatingTravelers.length)
        setCurrency(currentEvent.currency)
      } else if (eventType === EVENT_TYPES[2]) {
        setSelectedDate(stringToDate(currentEvent.date, 'yyyy-MM-dd'))
        setSelectedStartTime(stringToDate(currentEvent.startTime))
        setSelectedEndTime(stringToDate(currentEvent.endTime))
        setLocation({ ...currentEvent.location })
        setDescription(currentEvent?.description)
        setPrice(currentEvent.price / currentEvent.participatingTravelers.length)
        setCurrency(currentEvent.currency)
        setSelectedIcon(currentEvent.icon)
      } else if (eventType === EVENT_TYPES[3]) {
        setTransports(
          currentEvent.transports.map(transport => ({
            ...transport,
            startTime: stringToDate(transport.startTime),
            endTime: stringToDate(transport.endTime),
          }))
        )
        setPrice(currentEvent.price / currentEvent.participatingTravelers.length)
        setCurrency(currentEvent.currency)
      } else if (eventType === EVENT_TYPES[4]) {
        setSelectedDate(stringToDate(currentEvent.date, 'yyyy-MM-dd'))
        setSelectedStartTime(stringToDate(currentEvent.startTime))
        setSelectedEndTime(stringToDate(currentEvent.endTime))
        setLocation({ ...currentEvent.location })
        setDescription(currentEvent?.description)
        setWebsite(currentEvent.website)
        setSelectedIcon(currentEvent.icon)
      }
    }
  }, [editMode])

  useEffect(() => {
    if (price < 0) {
      setPrice(0)
    }
  }, [price])

  useEffect(() => {
    console.log('proutTransport', transports)
  }, [transports])

  useEffect(() => {
    if (location?.label && !editMode) {
      setTitle(location.label)
    }
  }, [location])

  useEffect(() => {
    if (
      flights[0]?.data?.airports?.length > 0 &&
      flights[flights?.length - 1]?.data?.airports?.length
    ) {
      setTitle(buildFlightTitle(flights))
    }
  }, [flights])

  useEffect(() => {
    if (!editMode && transports[0]?.start.label && transports[transports?.length - 1]?.end?.label) {
      setTitle(`De ${transports[0].start.label} à ${transports[transports.length - 1].end.label}`)
    }
  }, [transports])

  const isFormValid = () => {
    let tempErrors = {
      travelers: !participatingTravelers.some(traveler => traveler),
    }
    // eslint-disable-next-line default-case
    switch (eventType) {
      case EVENT_TYPES[0]:
        tempErrors = {
          ...tempErrors,
          startTime: arrivalDateTimeError,
          endTime: departureDateTimeError,
          location: !location,
        }
        if (!isValid(selectedDepartureDateTime)) {
          tempErrors.departureDateTimeIsInvalid = true
        } else if (!isValid(selectedArrivalDateTime)) {
          tempErrors.arrivalDateTimeIsInvalid = true
        } else {
          if (isBefore(selectedDepartureDateTime, selectedArrivalDateTime)) {
            tempErrors.isBefore = true
          }
          if (
            !isWithinInterval(selectedArrivalDateTime, {
              start: rCTFF(dateRange[0]),
              end: rCTFF(dateRange[1]),
            })
          ) {
            tempErrors.arrivalDateTimeIsNotInInterval = true
          }
          if (
            !isWithinInterval(selectedDepartureDateTime, {
              start: rCTFF(dateRange[0]),
              end: add(rCTFF(dateRange[1]), { days: 1 }),
            })
          ) {
            tempErrors.departureDateTimeIsNotInInterval = true
          }
        }
        break
      case EVENT_TYPES[1]:
        let flightsError = false
        const tempFlightsErrors = flights.map(flight => {
          if (flight.number.length < 1) {
            if (!flightsError) {
              flightsError = true
            }
            return { number: true }
          }
          if (flight.needFetch) {
            if (!flightsError) {
              flightsError = true
            }
            return { needFetch: true }
          }
          if (!flight.data) {
            if (!flightsError) {
              flightsError = true
            }
            return { data: true }
          }
          return { number: false }
        })
        tempErrors = { ...tempErrors, flights: tempFlightsErrors, flightsError }
        break
      case EVENT_TYPES[2]:
        tempErrors = {
          ...tempErrors,
          location: !location,
        }
        if (!isValid(selectedDate)) {
          tempErrors.dateIsInvalid = true
        } else if (
          !isWithinInterval(selectedDate, {
            start: rCTFF(dateRange[0]),
            end: add(rCTFF(dateRange[1]), { days: 1 }),
          })
        ) {
          tempErrors.selectedDateIsNotInInterval = true
        }
        break
      case EVENT_TYPES[3]:
        let transportsError = false
        const recordTransportError = () => {
          if (!transportsError) {
            transportsError = true
          }
        }
        const tempTransportsErrors = transports.map(transport => {
          const currentErrors = {
            start: false,
            end: false,
            startDateTimeIsInvalid: false,
            startDateTimeIsNotInInterval: false,
            endDateTimeIsInvalid: false,
            endDateTimeIsNotInInterval: false,
          }
          if (!transport.start) {
            recordTransportError()
            currentErrors.start = true
          }
          if (!isValid(transport.startTime)) {
            currentErrors.startDateTimeIsInvalid = true
            recordTransportError()
          } else if (
            !isWithinInterval(transport.startTime, {
              start: rCTFF(dateRange[0]),
              end: rCTFF(dateRange[1]),
            })
          ) {
            currentErrors.startDateTimeIsNotInInterval = true
            recordTransportError()
          }
          if (!transport.end) {
            recordTransportError()
            currentErrors.end = true
          }
          if (!isValid(transport.endTime)) {
            currentErrors.endDateTimeIsInvalid = true
            recordTransportError()
          } else if (
            !isWithinInterval(transport.endTime, {
              start: rCTFF(dateRange[0]),
              end: add(rCTFF(dateRange[1]), { days: 1 }),
            })
          ) {
            currentErrors.endDateTimeIsNotInInterval = true
            recordTransportError()
          }
          return currentErrors
        })
        tempErrors = { ...tempErrors, transports: tempTransportsErrors, transportsError }
        break
      case EVENT_TYPES[4]:
        tempErrors = {
          ...tempErrors,
          location: !location,
        }
        if (!isValid(selectedDate)) {
          tempErrors.dateIsInvalid = true
        } else if (
          !isWithinInterval(selectedDate, {
            start: rCTFF(dateRange[0]),
            end: rCTFF(dateRange[1]),
          })
        ) {
          tempErrors.selectedDateIsNotInInterval = true
        }
        break
    }
    const formErrors = filterObjectByValue(tempErrors, true)
    const fieldErrors = Object.keys(formErrors)
    if (fieldErrors.length < 1) {
      return true
    }
    // TODO display errors ?
    return false
  }

  useEffect(() => {
    if (location && eventType) {
      handleTempEventsMarkers(location, eventType)
    }
  }, [location])

  useEffect(() => {
    console.log('location', location)
  }, [location])

  const handleSubmit = async event => {
    event.preventDefault()
    let currentPlaceDetails
    if (
      eventType === EVENT_TYPES[0] ||
      eventType === EVENT_TYPES[2] ||
      eventType === EVENT_TYPES[4]
    ) {
      currentPlaceDetails = await getPlaceDetails(location?.value.place_id)
    }
    if (eventType === EVENT_TYPES[3]) {
      const tempLocationArray = []
      const locationArray = []
      transports.forEach(singleTransport => {
        console.log('transporttoutseul', singleTransport)
        const startPlaceDetails = singleTransport.start.value.place_id
        const endPlaceDetails = singleTransport.end.value.place_id
        tempLocationArray.push({ start: startPlaceDetails, end: endPlaceDetails })
      })
      console.log('locationArray', tempLocationArray)
      if (tempLocationArray.length > 0) {
        await Promise.all(
          tempLocationArray.map(async singleLocation => {
            const startSingleDetails = await getPlaceDetails(singleLocation.start)
            const endSingleDetails = await getPlaceDetails(singleLocation.end)
            locationArray.push({ start: startSingleDetails, end: endSingleDetails })
          })
        )
      }
      currentPlaceDetails = locationArray
    }
    console.log('details ======>', currentPlaceDetails)

    const tempParticipatingTravelers = []
    participatingTravelers.forEach((isTravelerParticipating, travelerIndex) => {
      if (isTravelerParticipating) {
        tempParticipatingTravelers.push({
          ...travelers.filter(traveler => !traveler.isNotTraveler)[travelerIndex],
        })
      }
    })

    let tempDoc = {
      type: eventType,
      title,
      participatingTravelers: tempParticipatingTravelers,
      icon: selectedIcon,
    }

    const tempDate = dateToString(selectedDate)
    const tempStartTime = dateTimeToString(selectedStartTime)
    const tempEndTime = dateTimeToString(selectedEndTime)
    // eslint-disable-next-line default-case
    switch (eventType) {
      case EVENT_TYPES[0]:
        const tempArrivalDateTime = dateTimeToString(selectedArrivalDateTime)
        const tempDepartureDateTime = dateTimeToString(selectedDepartureDateTime)
        tempDoc = {
          ...tempDoc,
          date: tempArrivalDateTime,
          startTime: tempArrivalDateTime,
          endTime: tempDepartureDateTime,
          location: currentPlaceDetails,
          description,
          price:
            totalPriceMode === priceOption[0].value
              ? price *
                participatingTravelers.filter(isTravelerParticipating => isTravelerParticipating)
                  .length
              : price,
          currency,
          website,
        }
        break
      case EVENT_TYPES[1]:
        const tempFlights = flights.map(flight => {
          const tempData = { ...flight.data }
          tempData.timings[0] = new timestampRef.fromDate(new Date(tempData.timings[0])) // DepartureDateTime
          tempData.timings[1] = new timestampRef.fromDate(new Date(tempData.timings[1])) // ArrivalDateTime
          return {
            ...flight,
            date: dateToString(rCTFF(flight.data.timings[0]), 'yyyy-MM-dd HH:mm'),
            data: tempData, // DepartureDateTime, ArrivalDateTime, DepartureAirport, ArrivalAirport
            website,
          }
        })
        tempDoc = {
          ...tempDoc,
          flights: tempFlights,
          price:
            totalPriceMode === priceOption[0].value
              ? price *
                participatingTravelers.filter(isTravelerParticipating => isTravelerParticipating)
                  .length
              : price,
          currency,
          totalPriceMode,
          website,
          date: tempFlights[0].date,
          startTime: dateToString(rCTFF(flights[0].data.timings[0]), 'yyyy-MM-dd HH:mm'),
          endTime: dateToString(
            rCTFF(flights[flights.length - 1].data.timings[1]),
            'yyyy-MM-dd HH:mm'
          ),
        }
        break
      case EVENT_TYPES[2]:
        tempDoc = {
          ...tempDoc,
          date: tempDate,
          startTime: tempStartTime,
          endTime: tempEndTime,
          location: currentPlaceDetails,
          description,
          price:
            totalPriceMode === priceOption[0].value
              ? price *
                participatingTravelers.filter(isTravelerParticipating => isTravelerParticipating)
                  .length
              : price,
          currency,
          website,
        }
        break
      case EVENT_TYPES[3]:
        const tempTransports = transports.map((transport, transportIndex) => ({
          ...transport,
          date: dateTimeToString(transport.startTime),
          startTime: dateTimeToString(transport.startTime),
          endTime: dateTimeToString(transport.endTime),
          website,
          startLocation: currentPlaceDetails[transportIndex].start,
          endLocation: currentPlaceDetails[transportIndex].end,
        }))
        tempDoc = {
          ...tempDoc,
          transports: tempTransports,
          price:
            totalPriceMode === priceOption[0].value
              ? price *
                participatingTravelers.filter(isTravelerParticipating => isTravelerParticipating)
                  .length
              : price,
          currency,
          website,
          date: dateTimeToString(transports[0].startTime),
          startTime: dateTimeToString(transports[0].startTime),
          endTime: dateTimeToString(transports[transports.length - 1].endTime),
        }
        break
      case EVENT_TYPES[4]:
        tempDoc = {
          ...tempDoc,
          date: tempDate,
          startTime: tempStartTime,
          endTime: tempEndTime,
          location: currentPlaceDetails,
          description,
          website,
          price:
            totalPriceMode === priceOption[0].value
              ? price *
                participatingTravelers.filter(isTravelerParticipating => isTravelerParticipating)
                  .length
              : price,
        }
        break
    }
    if (isSurvey) {
      const tempPropositions = [{ ...tempDoc, likes: [] }]
      delete tempPropositions[0].type
      tempDoc = {
        isSurvey,
        type: tempDoc.type,
        propositions: tempPropositions,
        createdBy: user.id,
      }
    }
    if (editMode) {
      if (isPropositionInEdition) {
        const tempPropositions = [...previousEvent.propositions]
        delete tempDoc.type
        tempPropositions[selectedPropositionIndex] = { ...tempDoc, likes: [] }
        firestore
          .collection('trips')
          .doc(tripId)
          .collection('planning')
          .doc(previousEvent.id)
          .set({ propositions: tempPropositions, needNewDates: false }, { merge: true })
          .then(() => {
            setEditMode(false)
            setPreviousEvent({ ...previousEvent, propositions: tempPropositions })
            setCurrentEvent(tempPropositions[selectedPropositionIndex])
            createNotificationsOnTrip(
              user,
              tripData,
              tripId,
              'surveyPropositionChange',
              2,
              currentEvent
            )
            setCurrentView('preview')
          })
      } else {
        firestore
          .collection('trips')
          .doc(tripId)
          .collection('planning')
          .doc(currentEvent.id)
          .set({ ...tempDoc, needNewDates: false }, { merge: true })
          .then(() => {
            const tempEvent = { ...tempDoc, id: currentEvent.id }
            setEditMode(false)
            setCurrentEvent(tempEvent)
            if (isSurvey) {
              setCurrentView('survey')
              createNotificationsOnTrip(user, tripData, tripId, 'turnEventIntoSurvey', 2, tempEvent)
            } else {
              setCurrentView('preview')
              createNotificationsOnTrip(user, tripData, tripId, 'eventUpdate', 2, currentEvent)
            }
          })
      }
    } else if (isNewProposition) {
      const tempPropositions = currentEvent.propositions
      delete tempDoc.type
      tempPropositions.push({ ...tempDoc, likes: [] })
      firestore
        .collection('trips')
        .doc(tripId)
        .collection('planning')
        .doc(currentEvent.id)
        .set({ propositions: tempPropositions }, { merge: true })
      setIsNewProposition(false)
      setCurrentView('survey')
      createNotificationsOnTrip(user, tripData, tripId, 'propositionAdd', 2, currentEvent)
    } else {
      firestore
        .collection('trips')
        .doc(tripId)
        .collection('planning')
        .add({ ...tempDoc })
        .then(docRef => {
          const tempEvent = { ...tempDoc, id: docRef.id }
          setCurrentEvent(tempEvent)
          if (isSurvey) {
            history.replace(`/tripPage/${tripId}/planning?survey=${docRef.id}`)
            setCurrentView('survey')
            createNotificationsOnTrip(user, tripData, tripId, 'surveyCreate', 2, tempEvent)
          } else {
            createNotificationsOnTrip(user, tripData, tripId, 'eventCreate', 2, tempEvent)
            setCurrentView('planning')
          }
        })
    }
    // history.push(
    //   `/tripPage/${tripId}/planning?${isSurvey ? 'survey=' : 'event='}${currentEvent.id}`
    // )
    setEventType('')
  }

  const fetchFlight = async flightIndex => {
    const urlencoded = new URLSearchParams()
    const flightId = flights[flightIndex].number.trim()
    const carrierCode = flightId.substring(0, 2).toUpperCase()
    const flightNumber = flightId.substring(2).trim()
    urlencoded.append('carrierCode', carrierCode) // 2-3 char
    urlencoded.append('flightNumber', flightNumber) // 1-4 char
    urlencoded.append('departureDate', format(flights[flightIndex].date, 'yyyy-MM-dd')) // format: YYYY-MM-DD

    const requestOptions = {
      method: 'POST',
      body: urlencoded,
      redirect: 'follow',
    }

    const results = await fetch(
      window.location.hostname === 'localhost'
        ? 'http://localhost:5001/explomaker-3010b/us-central1/checkFlightNumber'
        : 'https://us-central1-explomaker-3010b.cloudfunctions.net/checkFlightNumber',
      requestOptions
    )
    const data = await results.json()
    return data
  }

  return (
    <Paper className={propsClasses}>
      <Box
        sx={{
          [theme.breakpoints.down('sm')]: {
            position: 'fixed',
            zIndex: '100',
            backgroundColor: 'white',
            borderRadius: '30px 30px 0 0',
            width: '100%',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 2rem',
          }}
        >
          {matchesXs ? (
            <Box sx={{ width: '36px', height: '48px' }} />
          ) : (
            <IconButton
              aria-label="back"
              edge="start"
              onClick={() => {
                setEventType('')
                if (editMode) {
                  setEditMode(false)
                  setCurrentView('preview')
                } else if (isNewProposition) {
                  setIsNewProposition(false)
                  setCurrentView('survey')
                } else {
                  setCurrentView('add')
                }
              }}
              size="large"
            >
              <ArrowBackIosIcon style={{ transform: 'translate(5px ,0)' }} />
            </IconButton>
          )}
          <Typography variant="h5" align="center" sx={{ fontWeight: 'bold' }}>
            {editMode ? 'Modifier' : 'Ajouter'} un
            {isNewProposition || isPropositionInEdition
              ? "e proposition d'"
              : eventType === EVENT_TYPES[2]
              ? 'e '
              : ' '}
            {eventType === EVENT_TYPES[0]
              ? 'hébergement'
              : eventType === EVENT_TYPES[1]
              ? 'vol'
              : eventType === EVENT_TYPES[2]
              ? 'exploration'
              : eventType === EVENT_TYPES[3]
              ? 'transport'
              : 'restaurant'}
          </Typography>
          <IconButton
            aria-label="delete"
            edge="end"
            onClick={() => {
              if (editMode) {
                setEditMode(false)
                history.push(`/tripPage/${tripId}/planning`)
              } else if (isNewProposition) {
                setIsNewProposition(false)
              }
              setEventType('')
              setCurrentView('planning')
            }}
            size="large"
          >
            <CloseRoundedIcon />
          </IconButton>
        </Box>
        <Divider />
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          [theme.breakpoints.down('sm')]: {
            marginTop: '90px',
          },
        }}
      >
        <Box
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
          sx={{
            [theme.breakpoints.down('sm')]: {
              maxWidth: '100vw',
            },
          }}
        >
          <Box
            sx={{
              margin: '2rem 2rem',
              [theme.breakpoints.down('sm')]: {
                margin: '20px 30px',
              },
            }}
          >
            {(eventType === EVENT_TYPES[0] ||
              eventType === EVENT_TYPES[2] ||
              eventType === EVENT_TYPES[4]) && (
              <>
                {matchesXs && (
                  <IconSlider
                    eventType={eventType}
                    selectedIcon={selectedIcon}
                    setSelectedIcon={setSelectedIcon}
                  />
                )}
                <Box display="flex" alignItems="center" className={classes.marginBottom}>
                  <GooglePlacesAutocomplete
                    minLengthAutocomplete={3}
                    selectProps={{
                      placeholder: 'Emplacement',
                      value: location,
                      onChange: (event, { action }) => {
                        if (action === 'clear') {
                          setLocation('')
                        } else {
                          geocodeByAddress(event.value.description).then(results => {
                            const destination = { ...event }
                            const shortCountryNameRef = results[0].address_components.filter(
                              address => address.types.includes('country')
                            )
                            if (shortCountryNameRef.length > 0) {
                              destination.shortCountryName = shortCountryNameRef[0].short_name
                            }
                            setLocation({ ...destination })
                          })
                        }
                      },
                      isClearable: true,
                      styles: {
                        container: provided => ({ ...provided, width: '100%' }),
                        control: provided => ({
                          ...provided,
                          cursor: 'pointer',
                          zIndex: '2',
                          height: '60px',
                        }),
                        menu: provided => ({
                          ...provided,
                          zIndex: '2',
                        }),
                        singleValue: provided => ({
                          ...provided,
                          color: theme.palette.primary.main,
                        }),
                      },
                    }}
                  />
                  <Box
                    ml={2}
                    sx={{
                      [theme.breakpoints.down('sm')]: {
                        display: 'none',
                      },
                    }}
                  >
                    {typeof eventType !== 'undefined' && (
                      <IconModal
                        openIconModal={() => {
                          if (!openModalIconSlider) {
                            setOpenModalIconSlider(true)
                          }
                        }}
                        open={openModalIconSlider}
                        onClose={() => setOpenModalIconSlider(false)}
                        selectedIcon={selectedIcon}
                        setSelectedIcon={setSelectedIcon}
                        eventType={eventType}
                      />
                    )}
                  </Box>
                </Box>
              </>
            )}
            {(eventType === EVENT_TYPES[2] || eventType === EVENT_TYPES[4]) && (
              <Box
                display={matchesXs ? 'grid' : 'flex'}
                className={clsx(classes.marginBottom, classes.dateTimeContainer)}
              >
                <Box gridColumn="1 / 3" width="100%">
                  <DatePicker
                    label="Date"
                    inputVariant="filled"
                    placeholder="__/__/____"
                    format="dd/MM/yyyy"
                    minDate={tripStartDate}
                    maxDate={tripEndDate}
                    value={selectedDate}
                    onChange={event => {
                      if (!isValid(event)) {
                        setDateError(true)
                      } else if (dateError) {
                        setDateError(false)
                      }
                      setSelectedDate(event)
                    }}
                    fullWidth
                    renderInput={params => <TextField {...params} fullWidth />}
                    DialogProps={{ sx: { zIndex: '10000' } }}
                  />
                </Box>
                <Box>
                  <TimePicker
                    label="Début"
                    placeholder="__:__"
                    value={selectedStartTime}
                    onChange={event => {
                      if (!isValid(event)) {
                        setStartTimeError(true)
                      } else if (startTimeError) {
                        setStartTimeError(false)
                      }
                      setSelectedStartTime(event)
                    }}
                    steps={5}
                    renderInput={params => <TextField {...params} />}
                    DialogProps={{ sx: { zIndex: '10000' } }}
                  />
                </Box>
                <Box>
                  <TimePicker
                    label="Fin"
                    placeholder="__:__"
                    value={selectedEndTime}
                    onChange={event => {
                      if (!isValid(event)) {
                        setEndTimeError(true)
                      } else if (endTimeError) {
                        setEndTimeError(false)
                      }
                      setSelectedEndTime(event)
                    }}
                    steps={5}
                    renderInput={params => <TextField {...params} />}
                    DialogProps={{ sx: { zIndex: '10000' } }}
                  />
                </Box>
              </Box>
            )}
            {eventType === EVENT_TYPES[0] && (
              <>
                <Box display="flex" flexDirection="column">
                  <DateTimePicker
                    label="Arrivée"
                    inputVariant="filled"
                    placeholder="__/__/____ __:__"
                    format="dd/MM/yyyy HH:mm"
                    ampm={false}
                    minDate={tripStartDate}
                    maxDate={tripEndDate}
                    value={selectedArrivalDateTime}
                    onChange={event => {
                      if (!isValid(event)) {
                        setArrivalDateTimeError(true)
                      } else if (arrivalDateTimeError) {
                        setArrivalDateTimeError(false)
                      }
                      setSelectedArrivalDateTime(event)
                    }}
                    renderInput={params => (
                      <TextField
                        {...params}
                        fullWidth={matchesXs}
                        sx={{
                          marginBottom: '30px',
                          [theme.breakpoints.down('sm')]: { marginBottom: '35px' },
                        }}
                      />
                    )}
                    DialogProps={{ sx: { zIndex: '10000' } }}
                  />
                  <DateTimePicker
                    label="Départ"
                    inputVariant="filled"
                    placeholder="__/__/____ __:__"
                    format="dd/MM/yyyy HH:mm"
                    className={classes.dateTimePicker}
                    ampm={false}
                    minDate={add(selectedArrivalDateTime, { days: 1 })}
                    maxDate={tripEndDate}
                    value={selectedDepartureDateTime}
                    onChange={event => {
                      if (!isValid(event)) {
                        setDepartureDateTimeError(true)
                      } else if (departureDateTimeError) {
                        setDepartureDateTimeError(false)
                      }
                      setSelectedDepartureDateTime(event)
                    }}
                    renderInput={params => (
                      <TextField
                        {...params}
                        fullWidth={matchesXs}
                        sx={{
                          marginBottom: '30px',
                          [theme.breakpoints.down('sm')]: { marginBottom: '20px' },
                        }}
                      />
                    )}
                    DialogProps={{ sx: { zIndex: '10000' } }}
                  />
                  {daysInterval > 0 && (
                    <Box className={classes.durationAccomodation}>
                      <Typography className={classes.durationAccomodationText}>
                        Durée :&nbsp;{monthsInterval > 0 && `${monthsInterval} mois et `}
                        {daysInterval}&nbsp; nuit{daysInterval > 1 ? 's' : ''}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </>
            )}
            <TextField
              label="Titre"
              variant="filled"
              fullWidth
              value={title}
              onChange={event => setTitle(event.target.value)}
              className={clsx(classes.titleInput, classes.marginBottom)}
              InputLabelProps={{ className: classes.textFieldLabel }}
            />
            {(eventType === EVENT_TYPES[0] ||
              eventType === EVENT_TYPES[2] ||
              eventType === EVENT_TYPES[4]) && (
              <TextField
                label="Description - optionnel"
                fullWidth
                className={classes.marginBottom}
                value={description}
                onChange={event => setDescription(event.target.value)}
                multiline
                maxRows={4}
                variant="filled"
                InputProps={{
                  classes: { root: classes.rootMultilineInput, filledInput: classes.filledInput },
                }}
              />
            )}
            <TextField
              label="Site Web - optionnel"
              variant="filled"
              className={classes.marginBottom}
              value={website}
              fullWidth
              onChange={event => setWebsite(event.target.value)}
              type="url"
            />
            {eventType === EVENT_TYPES[1] && (
              <>
                {matchesXs && (
                  <IconSlider
                    eventType={eventType}
                    selectedIcon={selectedIcon}
                    setSelectedIcon={setSelectedIcon}
                  />
                )}
                <Box className={classes.marginBottom}>
                  {flights.map((flight, flightIndex) => (
                    <NewFlight
                      key={flight.tempId}
                      shouldHaveNumber={flights.length > 1}
                      date={flight.date}
                      number={flight.number}
                      setFlights={setFlights}
                      index={flightIndex}
                      dateRange={dateRange}
                      fetchFlight={fetchFlight}
                      needFetch={flight.needFetch}
                      flightData={flight.data}
                    />
                  ))}
                </Box>
                <Box className={classes.marginBottom} display="flex" alignItems="center">
                  <IconButton
                    aria-label="add flight"
                    onClick={() =>
                      setFlights([
                        ...flights,
                        { ...initialFlight(selectedDateFromPlanning || tripStartDate) },
                      ])
                    }
                    sx={{ padding: '0', mr: 2 }}
                  >
                    <img src={plusCircle} alt="" />
                  </IconButton>
                  <Typography
                    sx={{ fontSize: '17px', [theme.breakpoints.down('sm')]: { fontSize: '14px' } }}
                  >
                    Ajout d&apos;une escale
                  </Typography>
                </Box>
                <Divider className={classes.marginBottom} />
              </>
            )}
            {eventType === EVENT_TYPES[3] && (
              <>
                <Box className={classes.marginBottom}>
                  {transports.map((transport, index) => (
                    <NewTransport
                      key={transport.tempId}
                      setTransports={setTransports}
                      index={index}
                      description={transport.description}
                      start={transport.start}
                      end={transport.end}
                      startTime={transport.startTime}
                      endTime={transport.endTime}
                      icon={transport.icon}
                      shouldHaveNumber={transports.length > 1}
                      dateRange={dateRange}
                    />
                  ))}
                </Box>
                <Box className={classes.marginBottom} sx={{ gridColumn: '1 / 3' }}>
                  <Button
                    aria-label="add transport"
                    onClick={() =>
                      setTransports([
                        ...transports,
                        { ...initialTransport(transports[transports.length - 1].endTime) },
                      ])
                    }
                    startIcon={<AddIcon />}
                  >
                    Ajouter un transport
                  </Button>
                </Box>
                <Divider className={classes.marginBottom} />
              </>
            )}
            {(eventType === EVENT_TYPES[0] ||
              eventType === EVENT_TYPES[1] ||
              eventType === EVENT_TYPES[2] ||
              eventType === EVENT_TYPES[3] ||
              eventType === EVENT_TYPES[4]) && (
              <Box className={clsx(classes.marginBottom, classes.gridContainer)}>
                <TextField
                  label="Prix - optionnel"
                  variant="filled"
                  value={price}
                  onChange={event => setPrice(event.target.value)}
                  type="number"
                />
                <Box>
                  <FormControl hiddenLabel sx={{ minWidth: '100%' }}>
                    <Select
                      variant="filled"
                      value={currency}
                      onChange={event => setCurrency(event.target.value)}
                      sx={{
                        minWidth: '150px',
                      }}
                      InputProps={{ classes: { inputBase: classes.selectDeviceInput } }}
                    >
                      {CURRENCIES.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <ButtonGroup value={totalPriceMode} className={classes.secondRowGrid}>
                  {priceOption.map(option => (
                    <Button
                      key={option.value}
                      value={option.value}
                      variant={totalPriceMode === option.value ? 'contained' : 'outlined'}
                      onClick={event => setTotalPriceMode(event.target.value)}
                      fullWidth
                      classes={{
                        outlined: classes.priceOptionOutlined,
                        contained: classes.priceOptionContained,
                      }}
                    >
                      {option.label}
                    </Button>
                  ))}
                </ButtonGroup>
              </Box>
            )}
            <Typography gutterBottom>
              <Box fontWeight="bold" component="span">
                Participants
              </Box>
            </Typography>
            <Box mb={2}>
              <Typography variant="body2" color="textSecondary">
                {
                  participatingTravelers.filter(isTravelerParticipating => isTravelerParticipating)
                    .length
                }{' '}
                sélectionné
                {participatingTravelers.filter(isTravelerParticipating => isTravelerParticipating)
                  .length > 1 && 's'}{' '}
                <Button
                  onClick={() =>
                    setParticipatingTravelers(travelers.filter(traveler => !traveler.isNotTraveler))
                  }
                  sx={{ textTransform: 'none', color: theme.palette.grey.black }}
                  disableRipple
                >
                  - Tous
                </Button>{' '}
                <Button
                  onClick={() => setParticipatingTravelers([])}
                  sx={{ textTransform: 'none', color: theme.palette.grey.black }}
                  disableRipple
                >
                  - Aucun
                </Button>
              </Typography>
            </Box>
            <Box display="flex" flexWrap="wrap" pb={5}>
              {travelers
                .filter(traveler => !traveler.isNotTraveler)
                .map((traveler, travelerIndex) => (
                  <Fragment key={uuidv4()}>
                    <Button
                      variant="contained"
                      endIcon={
                        participatingTravelers[travelerIndex] ? <ClearRoundedIcon /> : <AddIcon />
                      }
                      className={clsx(classes.travelerBtn, {
                        [classes.selectedTravelerBtn]: participatingTravelers[travelerIndex],
                      })}
                      onClick={() => {
                        const tempParticipatingTravelers = [...participatingTravelers]
                        tempParticipatingTravelers[travelerIndex] =
                          !participatingTravelers[travelerIndex]
                        setParticipatingTravelers(tempParticipatingTravelers)
                      }}
                    >
                      {traveler.name}
                    </Button>
                  </Fragment>
                ))}
            </Box>
          </Box>
          <Divider />
          <Box
            sx={{
              margin: '2rem 2rem',
              [theme.breakpoints.down('sm')]: {
                margin: '0 30px 30px 30px',
              },
            }}
            pt={5}
          >
            {!isNewProposition && !isPropositionInEdition && (
              <FormControlLabel
                className={classes.marginBottom}
                control={
                  <Checkbox
                    checked={isSurvey}
                    onChange={() => setIsSurvey(!isSurvey)}
                    color="primary"
                    sx={{ position: 'relative', left: '-10px' }}
                  />
                }
                label="Proposer d’autres options pour cet évènement (jusqu’à 3 options). Les participants pourront voter pour leur option préférée."
                sx={{ position: 'relative', left: '20px', alignItems: 'flex-start' }}
              />
            )}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={!isFormValid()}
              className={classes.submitBtn}
            >
              {editMode ? 'Modifier' : 'Créer'} l
              {isNewProposition || isPropositionInEdition
                ? 'a proposition'
                : isSurvey
                ? 'e sondage'
                : "'évènement"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  )
}

export default EventCreator
