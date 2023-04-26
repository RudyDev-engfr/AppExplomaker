import { useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/styles'
import React, { useState, useEffect, createContext, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { rCTFF } from '../helper/functions'

import { FirebaseContext } from './firebase'
import { SessionContext } from './session'

export const TripContext = createContext()

const TripContextProvider = ({ children }) => {
  // const { delNotificationsFromAnEventDeleted, refreshTripData, createNotificationsOnTrip } =
  //   useContext(FirebaseContext)
  // const { user } = useContext(SessionContext)
  // const { tripId } = useParams()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  const matches1600 = useMediaQuery('(max-width:1600px)')
  const [deleteEventNotifications, setDeleteEventNotifications] = useState(false)
  const [tripData, setTripData] = useState()

  // use to handle events
  const [eventType, setEventType] = useState()

  // used to handle date from events Notifications
  const [days, setDays] = useState([])
  const [currentView, setCurrentView] = useState('chronoFeed')
  const [selectedDateOnPlanning, setSelectedDateOnPlanning] = useState('')

  const [isChatOpen, setIsChatOpen] = useState(!matchesXs && !matches1600)

  const [currentEvent, setCurrentEvent] = useState()
  const [openModal, setOpenModal] = useState('')

  // used in preview, desktopPreview
  const [currentDateRange, setCurrentDateRange] = useState(['', ''])

  const setTypeCreator = type => () => {
    setEventType(type)
    setCurrentView('creator')
  }

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
    if (
      tripData?.dateRange &&
      tripData?.dateRange.length &&
      tripData?.dateRange[0] !== '' &&
      tripData?.dateRange[1] !== ''
    ) {
      setCurrentDateRange(rCTFF(tripData.dateRange, 'E dd MMMM'))
    } else {
      setCurrentDateRange(['', ''])
    }
  }, [tripData])

  useEffect(() => {
    console.log('les dates du voyage dans le trip context', currentDateRange)
  }, [currentDateRange])

  useEffect(() => {
    console.log('tripData du useEffect planning', tripData)
  }, [tripData])

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
      }}
    >
      {children}
    </TripContext.Provider>
  )
}
export default TripContextProvider
