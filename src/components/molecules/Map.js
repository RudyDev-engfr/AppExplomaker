/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { GoogleMap, Marker, Polyline } from '@react-google-maps/api'

import mainMarker from '../../images/googleMapsIcons/main-marker.svg'
import activeMainMarker from '../../images/googleMapsIcons/main-marker-active.svg'

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
    featureType: 'administrative.locality',
    elementType: 'labels',
    stylers: [
      {
        visibility: 'on',
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

const Map = ({ latitude, longitude, zoom, planningMapRef, isDraggable = true, markers }) => {
  const [map, setMap] = useState(null)
  const [markersContainer, setMarkersContainer] = useState([])
  const [center, setCenter] = useState({ lat: 46.2276, lng: 2.2137 })

  useEffect(() => {
    if (markers) {
      setMarkersContainer(markers)
    }
  }, [markers])

  useEffect(() => {
    setCenter({ lat: latitude, lng: longitude })
  }, [latitude, longitude])

  const onLoad = useCallback(
    currentMap => {
      const bounds = new window.google.maps.LatLngBounds({ lat: latitude, lng: longitude })
      currentMap.setZoom(zoom)
      setMap(currentMap)
    },
    [latitude, longitude, zoom]
  )

  const onUnmount = useCallback(currentMap => {
    setMap(null)
  }, [])

  useEffect(() => {
    if (map && planningMapRef) {
      // eslint-disable-next-line no-param-reassign
      planningMapRef.current = map
    }
  }, [map])

  const memoMap = useMemo(() => {
    const containerStyle = {
      width: '100%',
      height: '100%',
      zIndex: '0',
    }

    return (
      <GoogleMap
        mapContainerStyle={containerStyle}
        zoom={zoom}
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
      </GoogleMap>
    )
  }, [latitude, longitude, markersContainer, zoom, center, isDraggable, onLoad, onUnmount])

  return <>{memoMap}</>
}

export default Map
