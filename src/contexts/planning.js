/* eslint-disable no-use-before-define */
import { eachDayOfInterval, isAfter, isSameDay, isWithinInterval, startOfDay } from 'date-fns'
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import CustomMarker from '../components/atoms/CustomMarker'
import { EVENT_TYPES } from '../helper/constants'
import { dateToString, getEventStartDate, rCTFF, stringToDate } from '../helper/functions'

import { findGoogleMarker, findSpecificGoogleMarker } from '../helper/icons'
import { firestore } from './firebase'
import { TripContext } from './trip'

export const PlanningContext = createContext()

const PlanningContextProvider = ({ children }) => {
  const history = useHistory()
  const { tripId } = useParams()
  const {
    currentEvent,
    setCurrentEvent,
    days,
    setDays,
    selectedDateOnPlanning,
    setSelectedDateOnPlanning,
    currentView,
    setCurrentView,
    eventType,
    setEventType,
    setTypeCreator,
  } = useContext(TripContext)
  const [currentMarkers, setCurrentMarkers] = useState([])
  const [transportMarkers, setTransportMarkers] = useState({
    transportMarkers: [],
    transportCoordinates: [],
  })
  const [tempTransportMarkers, setTempTransportMarkers] = useState({
    transportMarkers: [],
    transportCoordinates: [],
  })
  const [tempEventMarkers, setTempEventMarkers] = useState([])
  const [geometry, setGeometry] = useState()

  // used for Planning
  const [plannedEvents, setPlannedEvents] = useState([])
  const [currentEvents, setCurrentEvents] = useState({ surveys: [], events: [] })
  const [withoutDatesEvents, setWithoutDatesEvents] = useState({ surveys: [], events: [] })
  const [previousEvent, setPreviousEvent] = useState()
  const [selectedPropositionIndex, setSelectedPropositionIndex] = useState()

  // used for planningFeed && Planning
  const [isNewDatesSectionOpen, setIsNewDatesSectionOpen] = useState(false)

  // used to construct planningFeed
  const [singleDayPlannedEvents, setSingleDayPlannedEvents] = useState()

  const [currentEventId, setCurrentEventId] = useState()
  const [needMapRefresh, setNeedMapRefresh] = useState(true)

  const planningMapRef = useRef(null)

  const planningBounds = new window.google.maps.LatLngBounds()

  useEffect(() => {
    console.log('ma date sélectionné', selectedDateOnPlanning)
  }, [selectedDateOnPlanning])

  useEffect(() => {
    console.log('currentevents avec un s', currentEvents)
  }, [currentEvents])

  useEffect(() => {
    const tempEvents = { surveys: [], events: [] }
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
                transportIndex < plannedEvent.flights?.length;
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
                transportIndex < plannedEvent.transports?.length;
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
          } else if (
            plannedEvent.type === EVENT_TYPES[0] ||
            plannedEvent.type === EVENT_TYPES[2] ||
            plannedEvent.type === EVENT_TYPES[4]
          ) {
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
              isSameDay(
                selectedDateOnPlanning,
                stringToDate(plannedEvent.startTime, 'yyyy-MM-dd HH:mm')
              )
            ) {
              tempEvents.events.push(plannedEvent)
            }
          }
        })
    }
    tempEvents.events = tempEvents.events
      .sort((a, b) => getEventStartDate(a) - getEventStartDate(b))
      .filter(event => !event.needNewDates)
    setCurrentEvents(tempEvents)
  }, [selectedDateOnPlanning, plannedEvents, isNewDatesSectionOpen])

  useEffect(() => {
    if (currentView === 'chronoFeed' && singleDayPlannedEvents?.length > 1) {
      const uniqueIds = new Set()
      setCurrentEvents({
        surveys: plannedEvents.filter(plannedEvent => {
          if (plannedEvent.isSurvey) {
            return true
          }
          return false
        }),
        events: singleDayPlannedEvents.filter(
          plannedEvent => !plannedEvent.itsAllDayLong && !plannedEvent.isSurvey
        ),
      })
    }
  }, [currentView, singleDayPlannedEvents])

  useEffect(() => {
    const tempMarkers = []
    if (isNewDatesSectionOpen) {
      if (withoutDatesEvents.surveys?.length < 1 && withoutDatesEvents.events?.length < 1) {
        setIsNewDatesSectionOpen(false)
      } else {
        const tempCurrentTransportMarkers = []
        const tempTransportCoordinates = []
        let tempFlightIndex = 0
        const tempWithoutDateSurveyMarkers = []
        withoutDatesEvents.surveys.forEach(survey =>
          survey.propositions.forEach((proposition, propositionIndex) => {
            if (
              survey.type === EVENT_TYPES[0] ||
              survey.type === EVENT_TYPES[2] ||
              survey.type === EVENT_TYPES[4]
            ) {
              tempWithoutDateSurveyMarkers.push(
                <CustomMarker
                  key={proposition.location.value.place_id}
                  position={{ lat: proposition.location?.lat, lng: proposition.location?.lng }}
                  viewport={proposition.location.viewport}
                  clickable
                  onClick={() => {
                    if (currentView !== 'preview') {
                      if (currentView === 'survey') {
                        setPreviousEvent(survey)
                        setSelectedPropositionIndex(propositionIndex)
                        setEvent(proposition)
                      } else {
                        setSurvey(survey)
                      }
                    }
                  }}
                  onMouseOver={() => setCurrentEventId(survey.id)}
                  onMouseOut={() => setCurrentEventId()}
                  icon={findGoogleMarker(survey.type, survey.id === currentEventId)}
                />
              )
            }
            if (survey.type === EVENT_TYPES[1]) {
              proposition.flights.forEach(currentFlight =>
                tempWithoutDateSurveyMarkers.push(
                  <CustomMarker
                    key={currentFlight.data.airports[0].iataCode} // TODO better key
                    position={{
                      lat: currentFlight.data.airports[0].geocode.latitude,
                      lng: currentFlight.data.airports[0].geocode.longitude,
                    }}
                    clickable
                    onClick={() => {
                      if (currentView !== 'preview') {
                        if (currentView === 'survey') {
                          setPreviousEvent(survey)
                          setSelectedPropositionIndex(propositionIndex)
                          setEvent(proposition)
                        } else {
                          setSurvey(survey)
                        }
                      }
                    }}
                    onMouseOver={() => setCurrentEventId(survey.id)}
                    onMouseOut={() => setCurrentEventId()}
                    icon={findGoogleMarker(survey.type, survey.id === currentEventId)} // TODO proposition.icon
                  />
                )
              )
            }
            if (survey.type === EVENT_TYPES[3]) {
              proposition.transports.forEach(currentTransport => {
                const startPos = {
                  lat: currentTransport.startLocation.lat,
                  lng: currentTransport.startLocation.lng,
                }
                const endPos = {
                  lat: currentTransport.endLocation.lat,
                  lng: currentTransport.endLocation.lng,
                }
                tempTransportCoordinates.push([{ ...startPos }, { ...endPos }])
                tempCurrentTransportMarkers.push(
                  <CustomMarker
                    key={currentTransport.start.value.place_id}
                    position={{ ...startPos }}
                    clickable
                    onClick={() => {
                      if (currentView !== 'preview') {
                        if (currentView === 'survey') {
                          setPreviousEvent(survey)
                          setSelectedPropositionIndex(propositionIndex)
                          setEvent(proposition)
                        } else {
                          setSurvey(survey)
                        }
                      }
                    }}
                    onMouseOver={() => setCurrentEventId(survey.id)}
                    onMouseOut={() => setCurrentEventId()}
                    icon={findGoogleMarker(survey.type, survey.id === currentEventId)}
                  />,
                  <CustomMarker
                    key={currentTransport.end.value.place_id}
                    position={{ ...endPos }}
                    clickable
                    onClick={() => {
                      if (currentView !== 'preview') {
                        if (currentView === 'survey') {
                          setPreviousEvent(survey)
                          setSelectedPropositionIndex(propositionIndex)
                          setEvent(proposition)
                        } else {
                          setSurvey(survey)
                        }
                      }
                    }}
                    onMouseOver={() => setCurrentEventId(survey.id)}
                    onMouseOut={() => setCurrentEventId()}
                    icon={findGoogleMarker(survey.type, survey.id === currentEventId)}
                  />
                )
              })
            }
          })
        )
        const withoutDateEventMarkers = []
        withoutDatesEvents.events.forEach(event => {
          if (
            event.type === EVENT_TYPES[0] ||
            event.type === EVENT_TYPES[2] ||
            event.type === EVENT_TYPES[4]
          ) {
            withoutDateEventMarkers.push(
              <CustomMarker
                key={event.id}
                position={{ lat: event.location.lat, lng: event.location.lng }}
                clickable
                onClick={() => {
                  if (currentView !== 'preview') {
                    setEvent(event)
                  }
                }}
                onMouseOver={() => setCurrentEventId(event.id)}
                onMouseOut={() => setCurrentEventId()}
                viewport={event.location.viewport}
                icon={findSpecificGoogleMarker(event.icon, event.id === currentEventId, event.type)}
              />
            )
          } else if (event.type === EVENT_TYPES[1]) {
            event.flights.forEach(flight => {
              const currentFlightIndex = tempFlightIndex
              tempTransportCoordinates.push([])
              tempFlightIndex += 1

              flight.data.airports.forEach(airport => {
                tempTransportCoordinates[currentFlightIndex].push({
                  lat: airport.geocode.latitude,
                  lng: airport.geocode.longitude,
                })

                withoutDateEventMarkers.push(
                  <CustomMarker
                    key={event.id}
                    position={{
                      lat: airport.geocode.latitude,
                      lng: airport.geocode.longitude,
                    }}
                    clickable
                    onClick={() => {
                      if (currentView !== 'preview') {
                        setEvent(event)
                      }
                    }}
                    onMouseOver={() => setCurrentEventId(event.id)}
                    onMouseOut={() => setCurrentEventId()}
                    icon={findSpecificGoogleMarker(
                      event.icon,
                      event.id === currentEventId,
                      event.type
                    )}
                  />
                )
              })
            })
          } else if (event.type === EVENT_TYPES[3]) {
            event.transports.forEach(transport => {
              const startPos = {
                lat: transport.startLocation.lat,
                lng: transport.startLocation.lng,
              }
              const endPos = { lat: transport.endLocation.lat, lng: transport.endLocation.lng }
              const currentIcon = findSpecificGoogleMarker(
                transport.icon,
                event.id === currentEventId,
                EVENT_TYPES[3]
              )

              tempTransportCoordinates.push([{ ...startPos }, { ...endPos }])
              tempCurrentTransportMarkers.push(
                <CustomMarker
                  key={`${transport.start.value.place_id}-${event.id}`}
                  position={{ ...startPos }}
                  clickable
                  onClick={() => {
                    if (currentView !== 'preview') {
                      setEvent(event)
                    }
                  }}
                  onMouseOver={() => setCurrentEventId(event.id)}
                  onMouseOut={() => setCurrentEventId()}
                  icon={currentIcon}
                />,
                <CustomMarker
                  key={`${transport.end.value.place_id}-${event.id}`}
                  position={{ ...endPos }}
                  clickable
                  onClick={() => {
                    if (currentView !== 'preview') {
                      setEvent(event)
                    }
                  }}
                  onMouseOver={() => setCurrentEventId(event.id)}
                  onMouseOut={() => setCurrentEventId()}
                  icon={currentIcon}
                />
              )
            })
          }
        })
        tempMarkers.push(tempWithoutDateSurveyMarkers, withoutDateEventMarkers)
        setTransportMarkers({
          transportMarkers: tempCurrentTransportMarkers,
          transportCoordinates: tempTransportCoordinates,
        })
      }
    } else {
      const tempCurrentTransportMarkers = []
      const tempTransportCoordinates = []
      let tempFlightIndex = 0

      const tempSurveyMarkers = currentEvents?.surveys
        .filter(
          survey =>
            survey.type === EVENT_TYPES[0] ||
            survey.type === EVENT_TYPES[2] ||
            survey.type === EVENT_TYPES[4]
        )
        .map(survey =>
          survey.propositions.map((proposition, propositionIndex) => (
            <CustomMarker
              key={proposition.location.value.place_id}
              position={{ lat: proposition.location?.lat, lng: proposition.location?.lng }}
              clickable
              onClick={() => {
                if (currentView !== 'preview') {
                  if (currentView === 'survey') {
                    setPreviousEvent(survey)
                    setSelectedPropositionIndex(propositionIndex)
                    setEvent(proposition)
                  } else {
                    setSurvey(survey)
                  }
                }
              }}
              onMouseOver={() => setCurrentEventId(survey.id)}
              onMouseOut={() => setCurrentEventId()}
              viewport={proposition.location?.viewport}
              icon={findGoogleMarker(survey.type, survey.id === currentEventId)}
            />
          ))
        )
        .flat()
      const tempSurveyFlightMarkers = currentEvents?.surveys
        .filter(survey => survey.type === EVENT_TYPES[1])
        .map(survey =>
          survey.propositions.map((flightProposition, flightPropositionIndex) =>
            flightProposition.flights.map(flight => {
              const currentFlightIndex = tempFlightIndex
              tempTransportCoordinates.push([])
              tempFlightIndex += 1
              return flight.data.airports.map(airport => {
                tempTransportCoordinates[currentFlightIndex].push({
                  lat: airport.geocode.latitude,
                  lng: airport.geocode.longitude,
                })
                return (
                  <CustomMarker
                    key={flightProposition.id}
                    position={{
                      lat: airport.geocode.latitude,
                      lng: airport.geocode.longitude,
                    }}
                    clickable
                    onClick={() => {
                      if (currentView !== 'preview') {
                        if (currentView === 'survey') {
                          setPreviousEvent(survey)
                          setSelectedPropositionIndex(flightPropositionIndex)
                          setEvent(flightProposition)
                        } else {
                          setSurvey(survey)
                        }
                      }
                    }}
                    onMouseOver={() => setCurrentEventId(survey.id)}
                    onMouseOut={() => setCurrentEventId()}
                    icon={findGoogleMarker(survey.type, survey.id === currentEventId)}
                  />
                )
              })
            })
          )
        )
        .flat()

      const tempFlightMarkers = currentEvents?.events
        .filter(event => event.type === EVENT_TYPES[1])
        .map(event =>
          event.flights.map(flight => {
            const currentFlightIndex = tempFlightIndex
            tempTransportCoordinates.push([])
            tempFlightIndex += 1
            return flight.data.airports.map((airport, airportIndex) => {
              tempTransportCoordinates[currentFlightIndex].push({
                lat: airport.geocode.latitude,
                lng: airport.geocode.longitude,
              })

              return (
                <CustomMarker
                  key={`${event.id}-${flight.data.airports[airportIndex].iataCode}`}
                  position={{
                    lat: airport.geocode.latitude,
                    lng: airport.geocode.longitude,
                  }}
                  clickable
                  onClick={() => {
                    if (currentView !== 'preview') {
                      setEvent(event)
                    }
                  }}
                  onMouseOver={() => setCurrentEventId(event.id)}
                  onMouseOut={() => setCurrentEventId()}
                  icon={findSpecificGoogleMarker(
                    event.icon,
                    event.id === currentEventId,
                    event.type
                  )}
                />
              )
            })
          })
        )
        .flat()
      const tempCurrentEventMarkers = currentEvents?.events
        .filter(
          event =>
            event.type === EVENT_TYPES[0] ||
            event.type === EVENT_TYPES[2] ||
            event.type === EVENT_TYPES[4]
        )
        .map(event => (
          <CustomMarker
            key={event.id}
            position={{ lat: event.location?.lat, lng: event.location?.lng }}
            clickable
            onClick={() => {
              if (currentView !== 'preview') {
                setEvent(event)
              }
            }}
            onMouseOver={() => setCurrentEventId(event.id)}
            onMouseOut={() => setCurrentEventId()}
            viewport={event.location.viewport}
            icon={findSpecificGoogleMarker(event.icon, event.id === currentEventId, event.type)}
          />
        ))
      tempMarkers.push(tempSurveyMarkers, tempCurrentEventMarkers)
      tempCurrentTransportMarkers.push(
        tempFlightMarkers,
        tempSurveyFlightMarkers,
        handleTransportMarkers(
          currentEvents?.events.filter(event => event.type === EVENT_TYPES[3]),
          false
        )
      )
      const tempCoordinates = handleTransportMarkers(
        currentEvents?.events.filter(event => event.type === EVENT_TYPES[3]),
        true
      )
      currentEvents?.surveys
        .filter(survey => survey.type === EVENT_TYPES[3])
        .forEach(survey => {
          tempCurrentTransportMarkers.push(handleTransportMarkers(survey.propositions, false))
          tempCoordinates.push(handleTransportMarkers(survey.propositions, true).flat())
        })
      setTransportMarkers({
        transportMarkers: tempCurrentTransportMarkers,
        transportCoordinates: [tempTransportCoordinates.flat(), ...tempCoordinates],
      })
    }
    setCurrentMarkers(tempMarkers.flat())
  }, [currentEvents, isNewDatesSectionOpen, withoutDatesEvents, currentView, currentEventId])

  useEffect(() => {
    if (plannedEvents?.length > 0) {
      const singleDayEventsArray = []
      let singleDate
      plannedEvents
        .filter(plannedEvent => !plannedEvent.needNewDates)
        .forEach(plannedEvent => {
          if (plannedEvent.isSurvey) {
            const tempPropositions = []
            const tempPlannedSurvey = structuredClone(plannedEvent)
            if (plannedEvent.propositions?.length > 0) {
              plannedEvent.propositions.forEach(proposition => {
                const plannedEventInterval = eachDayOfInterval({
                  start: stringToDate(proposition.startTime, 'yyyy-MM-dd HH:mm'),
                  end: stringToDate(proposition.endTime, 'yyyy-MM-dd HH:mm'),
                })

                if (plannedEventInterval?.length > 0) {
                  plannedEventInterval.forEach(eachDayOfEvent => {
                    const tempPlannedProposition = structuredClone(proposition)
                    if (
                      isSameDay(
                        stringToDate(tempPlannedProposition.startTime, 'yyyy-MM-dd HH:mm'),
                        eachDayOfEvent
                      )
                    ) {
                      singleDate = tempPlannedProposition.startTime
                    } else if (
                      isSameDay(
                        stringToDate(tempPlannedProposition.endTime, 'yyyy-MM-dd HH:mm'),
                        eachDayOfEvent
                      )
                    ) {
                      singleDate = tempPlannedProposition.endTime
                    } else {
                      singleDate = dateToString(eachDayOfEvent, 'yyyy-MM-dd HH:mm')
                      tempPlannedProposition.itsAllDayLong = true
                    }
                    tempPlannedProposition.fakeDate = singleDate
                    tempPlannedProposition.type = plannedEvent.type
                    tempPlannedProposition.isSurvey = true
                    tempPropositions.push(tempPlannedProposition)
                    singleDayEventsArray.push(tempPlannedProposition)
                  })
                }
              })
            }
            // tempPlannedSurvey.propositions = tempPropositions
          } else {
            const plannedEventInterval = eachDayOfInterval({
              start: stringToDate(plannedEvent.startTime, 'yyyy-MM-dd HH:mm'),
              end: stringToDate(plannedEvent.endTime, 'yyyy-MM-dd HH:mm'),
            })
            if (plannedEventInterval?.length > 0) {
              plannedEventInterval.forEach(eachDayOfEvent => {
                const tempPlannedEvent = structuredClone(plannedEvent)
                if (
                  isSameDay(
                    stringToDate(tempPlannedEvent.startTime, 'yyyy-MM-dd HH:mm'),
                    eachDayOfEvent
                  )
                ) {
                  singleDate = tempPlannedEvent.startTime
                } else if (
                  isSameDay(
                    stringToDate(tempPlannedEvent.endTime, 'yyyy-MM-dd HH:mm'),
                    eachDayOfEvent
                  )
                ) {
                  singleDate = tempPlannedEvent.endTime
                } else {
                  singleDate = dateToString(eachDayOfEvent, 'yyyy-MM-dd HH:mm')
                  tempPlannedEvent.itsAllDayLong = true
                }
                tempPlannedEvent.fakeDate = singleDate
                singleDayEventsArray.push(tempPlannedEvent)
              })
            }
          }

          if (singleDayEventsArray?.length > 0) {
            setSingleDayPlannedEvents(singleDayEventsArray)
          }
        })
    }
  }, [plannedEvents])

  const deleteStopoverOnEventCreator = (flights, flightId, setter) => {
    const tempFlights = structuredClone(flights)
    tempFlights.filter(flight => flight.tempId !== flightId)
    setter(tempFlights)
  }

  const deleteImpliciteStopover = () => {}

  const deleteImpliciteStopoverOnEventCreator = (flight, stopoverIndex, setter) => {
    const tempFlight = structuredClone(flight)
    tempFlight.data.airports.filter((airport, airportIndex) => airportIndex !== stopoverIndex)
    tempFlight.data.legs.filter((leg, legIndex) => legIndex !== stopoverIndex)
    setter(tempFlight)
  }

  const getPlaceDetails = placeId =>
    new Promise(resolve => {
      const placesService = new window.google.maps.places.PlacesService(planningMapRef.current)
      placesService.getDetails(
        {
          placeId,
          fields: [
            'name',
            'formatted_phone_number',
            'photo', // getUrl
            'opening_hours',
            'business_status',
            'website',
            'price_level', // 0: Free, 1: Inexpensive, 2: Moderate, 3: Expensive, 4: Very Expensive
            'geometry',
          ],
        },
        place => {
          const tempLocation = {
            label: place.name,
            value: { place_id: placeId },
            viewport: { northeast: {}, southwest: {} },
          }
          tempLocation.name = place.name || false
          tempLocation.phone = place.formatted_phone_number || false
          tempLocation.photos =
            place?.photos?.length > 0
              ? place.photos
                  .filter((photo, photoIndex) => photoIndex < 4)
                  .map(photo => photo.getUrl())
              : false
          tempLocation.openingHours = place.opening_hours?.periods || false
          tempLocation.businessStatus = place.business_status || false
          tempLocation.website = place.website || false
          tempLocation.priceLevel = place.price_level >= 0 ? place.price_level : false
          const { lat, lng } = place.geometry.location
          tempLocation.lat = lat()
          tempLocation.lng = lng()

          const viewportKeys = Object.keys(place.geometry.viewport)
          const latKey = viewportKeys[0]
          const lngKey = viewportKeys[1]
          const cornerKeys = Object.keys(place.geometry.viewport[lngKey])
          const northeastKey = cornerKeys[0]
          const southwestKey = cornerKeys[1]

          tempLocation.viewport.northeast.lng = place.geometry.viewport[lngKey][northeastKey]
          tempLocation.viewport.southwest.lng = place.geometry.viewport[lngKey][southwestKey]
          tempLocation.viewport.northeast.lat = place.geometry.viewport[latKey][northeastKey]
          tempLocation.viewport.southwest.lat = place.geometry.viewport[latKey][southwestKey]

          resolve(tempLocation)
        }
      )
    })

  const getPlaceGeometry = placeId =>
    new Promise(resolve => {
      const placesService = new window.google.maps.places.PlacesService(planningMapRef.current)
      placesService.getDetails(
        {
          placeId,
          fields: ['geometry'],
        },
        place => {
          resolve(place)
        }
      )
    })

  const handleTransportMarkers = (events, isForCoordinates) => {
    const tempTransportCoordinates = []
    const transportPoints = []
    let lastTransportPoint
    let tempTransportIndex = 0
    const tempCurrentTransportMarkers = events?.map(event =>
      event.transports.map(transport => {
        const currentTransportIndex = tempTransportIndex
        tempTransportCoordinates.push([])
        tempTransportIndex += 1
        if (transport.start.value.place_id !== lastTransportPoint) {
          transportPoints.push(
            { lat: transport.startLocation.lat, lng: transport.startLocation.lng },
            { lat: transport.endLocation.lat, lng: transport.endLocation.lng }
          )
        } else {
          transportPoints.push({ lat: transport.endLocation.lat, lng: transport.endLocation.lng })
        }
        tempTransportCoordinates[currentTransportIndex].push(
          { lat: transport.startLocation.lat, lng: transport.startLocation.lng },
          { lat: transport.endLocation.lat, lng: transport.endLocation.lng }
        )
        lastTransportPoint = transport.end.value.place_id

        return transportPoints
          .filter(
            (transportPoint, transportPointIndex) =>
              transportPoints.indexOf(transportPoint) === transportPointIndex
          )
          .map((transportPoint, transportPointIndex) => (
            <CustomMarker
              key={`${transport.tempId}-${transportPointIndex % 2 === 0 ? 'start' : 'end'}`}
              position={{
                lat: transportPoint.lat,
                lng: transportPoint.lng,
              }}
              onMouseOver={() => setCurrentEventId(event.id)}
              onMouseOut={() => setCurrentEventId()}
              icon={findSpecificGoogleMarker(
                transport.icon ?? 'transport',
                event.id === currentEventId,
                'transport'
              )}
              viewport={transportPoint.viewport}
            />
          ))
      })
    )
    if (isForCoordinates) {
      return tempTransportCoordinates
    }
    return tempCurrentTransportMarkers
  }

  const handleTempEventsMarkers = (location, functionEventType) => {
    if (location?.value?.place_id) {
      const tempViewport = { northeast: { lat: 0, lng: 0 }, southwest: { lat: 0, lng: 0 } }
      getPlaceGeometry(location.value.place_id).then(({ geometry: currentGeometry }) => {
        const viewportKeys = Object.keys(currentGeometry.viewport)
        const latKey = viewportKeys[0]
        const lngKey = viewportKeys[1]
        const cornerKeys = Object.keys(currentGeometry.viewport[lngKey])
        const northeastKey = cornerKeys[0]
        const southwestKey = cornerKeys[1]

        tempViewport.northeast.lng = currentGeometry.viewport[lngKey][northeastKey]
        tempViewport.southwest.lng = currentGeometry.viewport[lngKey][southwestKey]
        tempViewport.northeast.lat = currentGeometry.viewport[latKey][northeastKey]
        tempViewport.southwest.lat = currentGeometry.viewport[latKey][southwestKey]

        setTempEventMarkers([
          <CustomMarker
            key={uuidv4()}
            position={{
              lat: currentGeometry.location.lat(),
              lng: currentGeometry.location.lng(),
            }}
            icon={findSpecificGoogleMarker(functionEventType, false, functionEventType)}
            viewport={tempViewport}
          />,
        ])
        setNeedMapRefresh(true)
      })
    }
  }

  const handleTempTransportMarkers = transportArray => {
    const promisesArray = []
    const currentTransports = transportArray.filter(
      transport => transport?.start?.value?.place_id && transport?.end?.value?.place_id
    )
    const transportIcon = currentTransports[0].icon

    currentTransports.forEach(transport => {
      promisesArray.push(
        getPlaceGeometry(transport.start.value.place_id),
        getPlaceGeometry(transport.end.value.place_id)
      )
    })

    let tempTransportIndex = 0
    Promise.all(promisesArray).then(responseArray => {
      const markersArray = []
      const tempTransportCoordinates = []
      for (
        let geocodeIndex = 0;
        geocodeIndex < currentTransports?.length * 2 - 1;
        geocodeIndex += 2
      ) {
        const currentTransportIndex = tempTransportIndex
        tempTransportCoordinates.push([])
        tempTransportIndex += 1
        const currentStart = responseArray[geocodeIndex].geometry
        const currentEnd = responseArray[geocodeIndex + 1].geometry

        markersArray.push(
          <CustomMarker
            position={{
              lat: currentStart.location.lat(),
              lng: currentStart.location.lng(),
            }}
            icon={findSpecificGoogleMarker(transportIcon ?? 'transportMain', false, 'transport')}
          />,
          <CustomMarker
            position={{
              lat: currentEnd.location.lat(),
              lng: currentEnd.location.lng(),
            }}
            icon={findSpecificGoogleMarker(transportIcon ?? 'transportMain', false, 'transport')}
          />
        )
        tempTransportCoordinates[currentTransportIndex].push(
          {
            lat: currentStart.location.lat(),
            lng: currentStart.location.lng(),
          },
          {
            lat: currentEnd.location.lat(),
            lng: currentEnd.location.lng(),
          }
        )
      }

      setTempTransportMarkers({
        transportMarkers: [...markersArray],
        transportCoordinates: [...tempTransportCoordinates],
      })
      setNeedMapRefresh(true)
    })
  }

  const handleTempFlightMarkers = flightArray => {
    const tempTransportCoordinates = []
    let tempFlightIndex = 0
    const tempFlightMarkers = flightArray
      .filter(flight => flight?.data?.airports)
      .map(flight => {
        const currentFlightIndex = tempFlightIndex
        tempTransportCoordinates.push([])
        tempFlightIndex += 1

        return flight.data.airports.map(airport => {
          tempTransportCoordinates[currentFlightIndex].push({
            lat: airport.geocode.latitude,
            lng: airport.geocode.longitude,
          })

          return (
            <CustomMarker
              key={`${flight.tempId}-${airport.iataCode}`}
              position={{
                lat: airport.geocode.latitude,
                lng: airport.geocode.longitude,
              }}
              icon={findSpecificGoogleMarker('flight', false, 'flight')}
            />
          )
        })
      })

    setTempTransportMarkers({
      transportMarkers: [...tempFlightMarkers.flat()],
      transportCoordinates: [...tempTransportCoordinates],
    })
  }

  const setEvent = event => {
    setCurrentEvent(event)
    history.push(`/tripPage/${tripId}/planning?event=${event.id}`)
    setCurrentView('preview')
  }

  const setSurvey = survey => {
    setCurrentEvent(survey)
    history.push(`/tripPage/${tripId}/planning?survey=${survey.id}`)
    setCurrentView('survey')
  }

  return (
    <PlanningContext.Provider
      value={{
        currentMarkers,
        setCurrentMarkers,
        transportMarkers,
        setTransportMarkers,
        tempEventMarkers,
        setTempEventMarkers,
        tempTransportMarkers,
        setTempTransportMarkers,
        handleTempTransportMarkers,
        handleTempFlightMarkers,
        handleTransportMarkers,
        handleTempEventsMarkers,
        getPlaceDetails,
        getPlaceGeometry,
        geometry,
        setGeometry,
        planningMapRef,
        planningBounds,
        needMapRefresh,
        setNeedMapRefresh,
        deleteStopoverOnEventCreator,
        currentEventId,
        setCurrentEventId,
        days,
        setDays,
        singleDayPlannedEvents,
        setSingleDayPlannedEvents,
        plannedEvents,
        setPlannedEvents,
        selectedDateOnPlanning,
        setSelectedDateOnPlanning,
        isNewDatesSectionOpen,
        setIsNewDatesSectionOpen,
        currentEvents,
        setCurrentEvents,
        withoutDatesEvents,
        setWithoutDatesEvents,
        currentView,
        setCurrentView,
        setEvent,
        setSurvey,
        previousEvent,
        setPreviousEvent,
        selectedPropositionIndex,
        setSelectedPropositionIndex,
        eventType,
        setEventType,
        setTypeCreator,
      }}
    >
      {children}
    </PlanningContext.Provider>
  )
}

export default PlanningContextProvider
