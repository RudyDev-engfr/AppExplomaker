import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'
import { GoogleMap, Marker, Polyline } from '@react-google-maps/api'

import { PlanningContext } from '../../../contexts/planning'
import usePrevious from '../../../hooks/usePrevious'

const mapStyle = [
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#d8f8f9',
      },
      {
        lightness: 0,
      },
    ],
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [
      {
        color: '#ffffff',
      },
      {
        lightness: 0,
      },
    ],
  },
  {
    featureType: 'road.highway',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [
      {
        color: '#D2E4E3',
      },
      {
        lightness: 0,
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'geometry',
    stylers: [
      {
        color: '#D2E4E3',
      },
      {
        lightness: 0,
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      {
        color: '#E6F5F4',
      },
      {
        lightness: 0,
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        visibility: 'on',
      },
      {
        color: '#ffffff',
      },
      {
        lightness: 0,
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#3E6964',
      },
      {
        lightness: 0,
      },
    ],
  },
  {
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [
      {
        color: '#f2f2f2',
      },
      {
        lightness: 19,
      },
    ],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#fefefe',
      },
      {
        lightness: 20,
      },
    ],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#fefefe',
      },
      {
        lightness: 17,
      },
      {
        weight: 1.2,
      },
    ],
  },
]

const lineSymbol = {
  path: 'M 0,1 L 0,4, M 0,6 L 0,7',
  strokeOpacity: 1,
  scale: 4,
}

const containerStyle = {
  width: '100%',
  height: '100%',
  zIndex: '0',
}

const PlanningMap = ({ latitude, longitude, zoom = 5, planningMapRef, isDraggable = true }) => {
  const {
    currentMarkers,
    transportMarkers,
    tempTransportMarkers,
    tempEventMarkers,
    planningBounds,
    needMapRefresh,
    setNeedMapRefresh,
  } = useContext(PlanningContext)
  const [map, setMap] = useState(null)
  const [markersContainer, setMarkersContainer] = useState([])
  const prevMarkersContainer = usePrevious(markersContainer)
  const [transportMarkersCoordinates, setTransportMarkersCoordinates] = useState([])
  const [center, setCenter] = useState({ lat: 0, lng: 0 })
  const [latLngMarkersArray, setLatLngMarkersArray] = useState([])

  useLayoutEffect(() => {
    const tempCoordinates = []
    if (
      currentMarkers.length > 0 ||
      transportMarkers.transportMarkers.length > 0 ||
      tempTransportMarkers.transportMarkers.length > 0 ||
      tempEventMarkers > 0
    ) {
      const totalMarkers = [
        currentMarkers,
        transportMarkers.transportMarkers,
        tempTransportMarkers.transportMarkers,
        tempEventMarkers,
      ].flat()
      totalMarkers.forEach(markerOrArrayMarker => {
        if (Array.isArray(markerOrArrayMarker)) {
          markerOrArrayMarker.forEach(arrayMarker =>
            arrayMarker.forEach(singleMarkerOrTransportArrayMarker => {
              if (Array.isArray(singleMarkerOrTransportArrayMarker)) {
                singleMarkerOrTransportArrayMarker.forEach(singleTransportMarker => {
                  if (typeof singleTransportMarker.props?.viewport !== 'undefined') {
                    tempCoordinates.push({
                      ...singleTransportMarker.props.viewport.northeast,
                    })
                    tempCoordinates.push({
                      ...singleTransportMarker.props.viewport.southwest,
                    })
                  }
                  if (typeof singleTransportMarker.props?.position !== 'undefined') {
                    tempCoordinates.push(singleTransportMarker.props.position)
                  }
                })
              }
              if (typeof singleMarkerOrTransportArrayMarker.props?.viewport !== 'undefined') {
                tempCoordinates.push({
                  ...singleMarkerOrTransportArrayMarker.props.viewport.northeast,
                })
                tempCoordinates.push({
                  ...singleMarkerOrTransportArrayMarker.props.viewport.southwest,
                })
              }
              if (typeof singleMarkerOrTransportArrayMarker.props?.position !== 'undefined') {
                tempCoordinates.push(singleMarkerOrTransportArrayMarker.props.position)
              }
            })
          )
        } else {
          if (typeof markerOrArrayMarker?.props?.viewport !== 'undefined') {
            tempCoordinates.push({ ...markerOrArrayMarker.props.viewport.northeast })
            tempCoordinates.push({ ...markerOrArrayMarker.props.viewport.southwest })
          }
          if (typeof markerOrArrayMarker?.props?.position !== 'undefined') {
            tempCoordinates.push(markerOrArrayMarker.props.position)
          }
        }
      })
      setLatLngMarkersArray(
        tempCoordinates.filter(
          coordinate =>
            typeof coordinate.lat !== 'undefined' || typeof coordinate.lng !== 'undefined'
        )
      )
      setMarkersContainer(totalMarkers)
    } else {
      setMarkersContainer([])
      setLatLngMarkersArray([])
    }
    if (
      transportMarkers?.transportCoordinates?.length > 0 ||
      tempTransportMarkers?.transportCoordinates?.length > 0
    ) {
      setTransportMarkersCoordinates(
        [transportMarkers.transportCoordinates, tempTransportMarkers.transportCoordinates].flat()
      )
    } else {
      setTransportMarkersCoordinates([])
    }
  }, [currentMarkers, transportMarkers, tempTransportMarkers, tempEventMarkers])

  // useEffect(() => {
  //   console.log({ markersContainer })
  //   console.log({ latLngMarkersArray })
  // }, [markersContainer, latLngMarkersArray])

  useEffect(() => {
    const willNeedRefresh = markersContainer.some((markerOrArrayMarker, index) => {
      const isPrevArray = Array.isArray(prevMarkersContainer[index])
      const isNextArray = Array.isArray(markerOrArrayMarker)

      if (isPrevArray && isNextArray) {
        return markerOrArrayMarker.length !== prevMarkersContainer[index].length
      }
      if ((isPrevArray && !isNextArray) || (!isPrevArray && isNextArray)) {
        return true
      }
      return false
    })

    if (willNeedRefresh) {
      setNeedMapRefresh(true)
    }
  }, [markersContainer, prevMarkersContainer])

  useEffect(() => {
    setCenter({ lat: latitude, lng: longitude })
  }, [latitude, longitude])

  const onLoad = useCallback(
    currentMap => {
      // eslint-disable-next-line no-unused-vars
      const bounds = new window.google.maps.LatLngBounds({ lat: latitude, lng: longitude })
      currentMap.setZoom(zoom)
      setMap(currentMap)
    },
    [latitude, longitude, zoom]
  )

  useLayoutEffect(() => {
    if (latLngMarkersArray.length > 0 && needMapRefresh) {
      latLngMarkersArray.forEach(bound => planningBounds.extend(bound))
      map.fitBounds(planningBounds, 25)
      setNeedMapRefresh(false)
    }
  }, [latLngMarkersArray, needMapRefresh])

  // eslint-disable-next-line no-unused-vars
  const onUnmount = useCallback(currentMap => {
    setMap(null)
  }, [])

  useEffect(() => {
    if (map && planningMapRef) {
      // eslint-disable-next-line no-param-reassign
      planningMapRef.current = map
    }
  }, [map])

  return useMemo(
    () => (
      <GoogleMap
        mapContainerStyle={containerStyle}
        zoom={zoom}
        fitBounds
        center={center}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{ disableDefaultUI: true, styles: mapStyle }}
      >
        {markersContainer.length < 1 ? (
          <Marker position={{ lat: latitude, lng: longitude }} clickable={false} />
        ) : (
          markersContainer
        )}
        {transportMarkersCoordinates &&
          transportMarkersCoordinates
            .filter(coordinates => coordinates.length > 0)
            .map((coordinates, coordinatesIndex) => {
              const tempKey = `${coordinates[0]}${coordinates[1]}${coordinates[2]}${coordinates[3]}-${coordinatesIndex}`

              return (
                <Polyline
                  key={tempKey}
                  path={coordinates} // Réception d'un tableau non limité de lat/lng
                  geodesic={false}
                  options={{
                    strokeColor: '#006A75',
                    strokeOpacity: 0.1,
                    strokeWeight: 1,
                    icons: [
                      {
                        icon: lineSymbol,
                        repeat: '35px',
                      },
                    ],
                  }}
                  onUnmount={polyline => {
                    polyline.setVisible(false)
                    // eslint-disable-next-line no-param-reassign
                    polyline.icons = []
                  }}
                />
              )
            })}
      </GoogleMap>
    ),
    [
      latitude,
      longitude,
      markersContainer,
      transportMarkersCoordinates,
      latLngMarkersArray,
      zoom,
      center,
      isDraggable,
      onLoad,
      onUnmount,
    ]
  )
}

export default PlanningMap
