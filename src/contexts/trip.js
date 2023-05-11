import { useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/styles'
import React, { useState, useEffect, createContext, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
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
  const [deleteEventNotifications, setDeleteEventNotifications] = useState(false)
  const [tripData, setTripData] = useState()

  // use to handle Notifications
  const [currentNotifications, setCurrentNotifications] = useState([])
  const [refreshNotif, setRefreshNotif] = useState(false)

  // use to handle events
  const [eventType, setEventType] = useState()

  // used to handle date from events Notifications
  const [days, setDays] = useState([])
  const [currentView, setCurrentView] = useState('chronoFeed')
  const [selectedDateOnPlanning, setSelectedDateOnPlanning] = useState('')

  const [isChatOpen, setIsChatOpen] = useState('')

  const [currentEvent, setCurrentEvent] = useState()
  const [openModal, setOpenModal] = useState('')

  // used in preview, desktopPreview
  const [currentDateRange, setCurrentDateRange] = useState(['', ''])
  const [currentActiveTab, setCurrentActiveTab] = useState('')
  const [currentActiveMobileNavTab, setCurrentActiveMobileNavTab] = useState('preview')

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
      }}
    >
      {children}
    </TripContext.Provider>
  )
}
export default TripContextProvider
