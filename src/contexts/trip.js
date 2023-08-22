import React, { useState, useEffect, createContext, useContext, useRef } from 'react'
import { useMediaQuery } from '@mui/material'
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
  const { tripId } = useParams()
  const matches1600 = useMediaQuery('(max-width:1600px)')
  const { user } = useContext(SessionContext)
  const { getUserById, firestore } = useContext(FirebaseContext)
  const [deleteEventNotifications, setDeleteEventNotifications] = useState(false)
  const [hasClicked, setHasClicked] = useState(false)
  const [tripData, setTripData] = useState()
  const [canEdit, setCanEdit] = useState(false)

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

  // used to handle eventCreator
  const [editMode, setEditMode] = useState(false)
  const [currentLocation, setCurrentLocation] = useState(null)

  // used in preview, desktopPreview
  const [currentDateRange, setCurrentDateRange] = useState(['', ''])
  const [currentActiveTab, setCurrentActiveTab] = useState('')
  const [currentActiveMobileNavTab, setCurrentActiveMobileNavTab] = useState('preview')
  const [currentTravelers, setCurrentTravelers] = useState([])

  // used to handle tripGuide page
  const [tripGuideData, setTripGuideData] = useState(null)
  const [currentSelectedTripGuideButton, setCurrentSelectedTripGuideButton] = useState(null)
  const [itemData, setItemData] = useState(null)
  const [tripGuideExpanded, setTripGuideExpanded] = useState('')

  // used to handle EditTravelersModal
  const [nbTravelers, setNbTravelers] = useState(1)

  // used for preview page
  const [modalTravelers, setModalTravelers] = useState([])

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
        const role = peopleId?.role
        if (peopleId?.id) {
          batchGetUsers.push(
            getUserById(peopleId.id).then(currentUser => ({
              ...currentUser,
              role: role || user.role,
            }))
          )
        } else if (peopleId?.name) {
          batchGetUsers.push(new Promise(resolve => resolve({ firstname: peopleId.name, role })))
        } else {
          batchGetUsers.push(
            getUserById(peopleId).then(currentUser => ({
              ...currentUser,
              role: role || user.role,
            }))
          )
        }
      })
    Promise.all(batchGetUsers).then(response => {
      if (response.length > 0) {
        const tempTravelers = response.map(({ firstname, avatar, id, role }) => ({
          firstname,
          avatar,
          id,
          role,
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
      // eslint-disable-next-line no-console
      console.info('No matching documents.')
      return
    }

    collection.forEach(doc => {
      const data = doc.data()
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
    // eslint-disable-next-line no-console
    console.info('=== Batch update completed')
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

  useEffect(() => {
    console.log('vue actuelle', currentView)
    console.log('currentEvent', currentEvent)
  }, [currentView, currentEvent])

  useEffect(() => {
    if (
      (tripGuideData === null || typeof tripGuideData === 'undefined') &&
      tripData?.destination?.place_id
    ) {
      firestore
        .collection('inspirations')
        .doc(tripData?.destination?.place_id)
        .onSnapshot(doc => {
          if (doc.exists) {
            const tempDoc = doc.data()
            const tripGuideDataKeys = Object.keys(tempDoc)
            const tempTripGuideData = tripGuideDataKeys.map(currentKey => tempDoc[currentKey])
            const buildTripGuideData = tempTripGuideData.filter(
              (item, index, array) =>
                array.findIndex(t => t.category === item.category && t.name === item.name) === index
            )
            setTripGuideData(buildTripGuideData)
          } else {
            firestore
              .collection('inspirations')
              .doc(tripData?.destination?.place_id)
              .set({
                place_id: tripData?.destination?.place_id,
                createdAt: new Date(),
                userId: user.id,
              })
              .then(() => {
                // eslint-disable-next-line no-console
                console.info('=== Document successfully written! ===')
              })
              .catch(error => {
                // eslint-disable-next-line no-console
                console.error('=== Error writing document: ', error)
              })
          }
        })
    }
  }, [tripGuideData, tripData])

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
        editMode,
        setEditMode,
        canEdit,
        setCanEdit,
        currentLocation,
        setCurrentLocation,
        tripGuideData,
        setTripGuideData,
        currentSelectedTripGuideButton,
        setCurrentSelectedTripGuideButton,
        itemData,
        setItemData,
        nbTravelers,
        setNbTravelers,
        modalTravelers,
        setModalTravelers,
        tripGuideExpanded,
        setTripGuideExpanded,
      }}
    >
      {children}
    </TripContext.Provider>
  )
}
export default TripContextProvider
