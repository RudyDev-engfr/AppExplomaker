import { useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/styles'
import React, { useState, useEffect, createContext, useContext, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { buildNotificationsOnTripForUser, rCTFF } from '../helper/functions'

import { FirebaseContext } from './firebase'
import { SessionContext } from './session'

export const TripContext = createContext()

const TripContextProvider = ({ children }) => {
  // const { delNotificationsFromAnEventDeleted, refreshTripData, createNotificationsOnTrip } =
  //   useContext(FirebaseContext)
  // const { user } = useContext(SessionContext)
  // const { tripId } = useParams()
  const theme = useTheme()
  const { tripId } = useParams()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  const matches1600 = useMediaQuery('(max-width:1600px)')
  const { user } = useContext(SessionContext)
  const { getUserById, firestore } = useContext(FirebaseContext)
  const [deleteEventNotifications, setDeleteEventNotifications] = useState(false)
  const [hasClicked, setHasClicked] = useState(false)
  const [tripData, setTripData] = useState()

  // use to handle Notifications
  const [currentNotifications, setCurrentNotifications] = useState([])
  const [refreshNotif, setRefreshNotif] = useState(false)

  // use to handle events
  const [eventType, setEventType] = useState()
  const [currentEventId, setCurrentEventId] = useState()
  const [currentEventType, setCurrentEventType] = useState('')

  // used to handle date from events Notifications
  const [days, setDays] = useState([])
  const [currentView, setCurrentView] = useState('chronoFeed')
  const [selectedDateOnPlanning, setSelectedDateOnPlanning] = useState('')

  const [isChatOpen, setIsChatOpen] = useState('')

  const [currentEvent, setCurrentEvent] = useState()
  const [openModal, setOpenModal] = useState('')

  // used to handle planning
  const [location, setLocation] = useState()
  const planningMapRef = useRef(null)
  const [isAssistantGuided, setIsAssistantGuided] = useState(false)
  const [currentPlaceId, setCurrentPlaceId] = useState('')

  // used in preview, desktopPreview
  const [currentDateRange, setCurrentDateRange] = useState(['', ''])
  const [currentActiveTab, setCurrentActiveTab] = useState('')
  const [currentActiveMobileNavTab, setCurrentActiveMobileNavTab] = useState('preview')
  const [currentTravelers, setCurrentTravelers] = useState([])

  const setTypeCreator = type => () => {
    setEventType(type)
    setCurrentView('creator')
  }

  const handleEventCreation = eventDescription => {
    const tempEventDescription = structuredClone(eventDescription)
    if (tempEventDescription.place_id) {
      return ''
    }
  }

  const getPlaceTown = placeId =>
    new Promise(resolve => {
      const placesService = new window.google.maps.places.PlacesService(planningMapRef.current)
      placesService.getDetails(
        {
          placeId,
          fields: ['ALL'],
        },
        place => {
          resolve(place)
        }
      )
    })

  const updateTravelers = () => {
    const batchGetUsers = []
    tripData?.travelersDetails
      .filter(traveler => traveler.id)
      .forEach(peopleId => {
        if (peopleId?.id) {
          batchGetUsers.push(getUserById(peopleId.id))
        } else if (peopleId?.name) {
          batchGetUsers.push(new Promise(resolve => resolve({ firstname: peopleId.name })))
        } else {
          batchGetUsers.push(getUserById(peopleId))
        }
      })
    Promise.all(batchGetUsers).then(response => {
      if (response.length > 0) {
        const tempTravelers = response.map(({ firstname, avatar, id }) => ({
          firstname,
          avatar,
          id,
        }))
        setCurrentTravelers(tempTravelers)
      }
    })
  }

  async function updateHasSeen(chatCollection) {
    const batch = firestore.batch()

    const collection = await firestore
      .collection('trips')
      .doc(tripId)
      .collection(chatCollection)
      .get()

    if (collection.empty) {
      console.log('No matching documents.')
      return
    }

    collection.forEach(doc => {
      const data = doc.data()
      console.log('data', data)
      const tempNotifications = data.notifications
      let needsUpdate = false

      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < tempNotifications?.length; i++) {
        if (tempNotifications[i].userId === user.id && !tempNotifications[i].hasSeen) {
          tempNotifications[i].hasSeen = true
          needsUpdate = true
        }
      }

      if (needsUpdate) {
        const docRef = firestore
          .collection('trips')
          .doc(tripId)
          .collection(chatCollection)
          .doc(doc.id)
        batch.set(docRef, { ...data, notifications: tempNotifications }, { merge: true })
      }
    })

    await batch.commit()
    console.log('Batch update completed')
  }

  useEffect(() => {
    updateTravelers()
  }, [tripData])

  useEffect(() => {
    firestore
      .collection('trips')
      .doc(tripId)
      .onSnapshot(doc => {
        const tempDoc = doc.data()
        setTripData(tempDoc)
      })
  }, [tripId])

  // const [allowDeleteNotif, setAllowDeleteNotif] = useState(false)
  // const [timingRefresh, setTimingRefresh] = useState(false)

  // useEffect(() => {
  //   console.log(deleteEventNotifications, 'si cest true je peux supprimer')
  // }, [deleteEventNotifications])

  // useEffect(() => {
  //   if (deleteEventNotifications) {
  //     console.log('je suis rentré là')
  //     delNotificationsFromAnEventDeleted(tripData, tripId, currentEvent)
  //     setTimingRefresh(true)
  //     setDeleteEventNotifications(false)
  //   }
  //   if (timingRefresh) {
  //     setTimeout(() => {
  //       refreshTripData(tripId, setTripData, setAllowDeleteNotif)
  //       setAllowDeleteNotif(true)
  //       setTimingRefresh(false)
  //     }, 2000)
  //   }
  // }, [deleteEventNotifications, timingRefresh])

  // useEffect(() => {
  //   console.log('leventcourant', currentEvent)
  // }, [currentEvent])

  // const handleCreateDeleteNotif = () => {
  //   if (allowDeleteNotif) {
  //     setTimeout(() => {
  //       createNotificationsOnTrip(user, tripData, tripId, 'eventDelete', 2, currentEvent)
  //     }, 2000)
  //     setTimeout(() => {
  //       setCurrentEvent()
  //     }, 2000)
  //     toast.success('Evenement supprime')
  //     setAllowDeleteNotif(false)
  //   }
  // }

  // useEffect(() => {
  //   if (allowDeleteNotif === 'ok') {
  //     handleCreateDeleteNotif()
  //     setAllowDeleteNotif(false)
  //   }
  // }, [allowDeleteNotif])
  useEffect(() => {
    if (tripData && user && refreshNotif) {
      const tempNotif = buildNotificationsOnTripForUser(user, tripId)
      setCurrentNotifications(tempNotif)
      setRefreshNotif(false)
    }
    console.log('le voyage avec ses notifs', user.notifications)
  }, [tripData, user, refreshNotif])

  useEffect(() => {
    if (
      tripData?.dateRange &&
      tripData?.dateRange.length &&
      tripData?.dateRange[0] !== '' &&
      tripData?.dateRange[1] !== ''
    ) {
      setCurrentDateRange(rCTFF(tripData.dateRange, 'dd MMMM'))
    } else {
      setCurrentDateRange(['', ''])
    }
  }, [tripData])

  useEffect(() => {
    if (hasClicked) {
      setTimeout(() => {
        setHasClicked(false)
      }, 2000)
    }
  }, [hasClicked])

  useEffect(() => {
    console.log('showmelestate1', selectedDateOnPlanning)
  }, [selectedDateOnPlanning])

  useEffect(() => {
    console.log('showmelestate2', days)
  }, [days])

  return (
    <TripContext.Provider
      value={{
        deleteEventNotifications,
        setDeleteEventNotifications,
        currentEvent,
        setCurrentEvent,
        tripData,
        setTripData,
        openModal,
        setOpenModal,
        currentDateRange,
        setCurrentDateRange,
        days,
        setDays,
        selectedDateOnPlanning,
        setSelectedDateOnPlanning,
        currentView,
        setCurrentView,
        matches1600,
        isChatOpen,
        setIsChatOpen,
        setTypeCreator,
        eventType,
        setEventType,
        currentActiveTab,
        setCurrentActiveTab,
        currentActiveMobileNavTab,
        setCurrentActiveMobileNavTab,
        currentNotifications,
        setCurrentNotifications,
        refreshNotif,
        setRefreshNotif,
        currentEventId,
        setCurrentEventId,
        hasClicked,
        setHasClicked,
        currentEventType,
        setCurrentEventType,
        currentTravelers,
        updateTravelers,
        updateHasSeen,
        handleEventCreation,
        location,
        setLocation,
        getPlaceTown,
        planningMapRef,
        isAssistantGuided,
        setIsAssistantGuided,
        currentPlaceId,
        setCurrentPlaceId,
      }}
    >
      {children}
    </TripContext.Provider>
  )
}
export default TripContextProvider
