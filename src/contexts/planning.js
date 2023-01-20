import React, { createContext, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import CustomMarker from '../components/atoms/CustomMarker'

import { findSpecificGoogleMarker } from '../helper/icons'
import { firestore } from './firebase'

export const PlanningContext = createContext()

const PlanningContextProvider = ({ children }) => {
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
  const [currentEventId, setCurrentEventId] = useState()
  const [needMapRefresh, setNeedMapRefresh] = useState(true)

  const planningMapRef = useRef(null)

  const planningBounds = new window.google.maps.LatLngBounds()

  const deleteStopoverOnEventCreator = (flights, flightId, setter) => {
    const tempFlights = structuredClone(flights)
    tempFlights.filter(flight => flight.tempId !== flightId)
    setter(tempFlights)
  }

  const deleteStopover = tripId => {
    firestore.collection('trips').doc(tripId).collection('planning')
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
            place?.photos?.length > 0 ? place.photos.map(photo => photo.getUrl()) : false
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
    const tempCurrentTransportMarkers = events.map(event =>
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

  const handleTempEventsMarkers = (location, eventType) => {
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
            icon={findSpecificGoogleMarker(eventType, false, eventType)}
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
        geocodeIndex < currentTransports.length * 2 - 1;
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
        deleteStopover,
        deleteStopoverOnEventCreator,
        currentEventId,
        setCurrentEventId,
      }}
    >
      {children}
    </PlanningContext.Provider>
  )
}

export default PlanningContextProvider
