import React, { createContext, useEffect, useState } from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firebase-firestore'
import 'firebase/storage'
import 'firebase/database'
import 'firebase/analytics'
import getTime from 'date-fns/getTime'
import { v4 as uuidv4 } from 'uuid'

import facebook from '../images/signIn/Facebook.svg'
import google from '../images/signIn/Google.svg'

export const FirebaseContext = createContext()

const firebaseConfig = {
  apiKey: 'AIzaSyAMv0fBbPMuXvvi2IvfbFuEd4wm0Wmd8Iw',
  authDomain: 'explomaker-3010b.firebaseapp.com',
  databaseURL: 'https://explomaker-3010b.firebaseio.com',
  projectId: 'explomaker-3010b',
  storageBucket: 'explomaker-3010b.appspot.com',
  messagingSenderId: '607806486683',
  appId: '1:607806486683:web:9faddae9a305f878f0ae3e',
  measurementId: 'G-154BFD5KW3',
}

firebase.initializeApp(firebaseConfig)

const initEmulators = url => {
  // eslint-disable-next-line no-console
  console.warn('Using local Firestore')
  firebase.firestore().settings({
    host: `${url}:8080`,
    ssl: false,
  })
  // eslint-disable-next-line no-console
  console.warn('Using local Auth')
  firebase.auth().useEmulator(`http://${url}:9099/`, { disableWarnings: true })
  // eslint-disable-next-line no-console
  console.warn('Using local Storage')
  firebase.storage().useEmulator(url, 9199)
  // eslint-disable-next-line no-console
  console.warn('Using local Realtime Database')
  firebase.database().useEmulator(url, 9000)
}

if (window.location.hostname === 'localhost' || window.location.hostname === '10.0.2.2') {
  initEmulators(window.location.hostname)
}

export const firestore = firebase.firestore()
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
export const auth = firebase.auth()
export const storage = firebase.storage()
export const database = firebase.database()
// eslint-disable-next-line no-unused-vars
const analytics = firebase.analytics()

export const timestampRef = firebase.firestore.Timestamp

export const fieldValueRef = firebase.firestore.FieldValue

export const emailAuthProvider = firebase.auth.EmailAuthProvider

export const uiConfig = {
  signInFlow: 'popup',
  signInOptions: [
    {
      provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      fullLabel: 'Continuer avec Facebook',
      iconUrl: facebook,
    },
    {
      provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      fullLabel: 'Continuer avec Google',
      iconUrl: google,
    },
  ],
}

export const signInWithEmailAndPassword = async (email, password) => {
  const response = await auth.signInWithEmailAndPassword(email, password)
  return response
}

export const useAuth = () => {
  const [state, setState] = useState(() => {
    const firebaseUser = auth.currentUser
    return { initializing: !firebaseUser, firebaseUser }
  })

  function onChange(firebaseUser) {
    setState({ initializing: false, firebaseUser })
  }

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(onChange)
    return () => unsubscribe()
  }, [])

  return state
}

const imgRef = database.ref().child('picture_library')

const getFaq = setter => {
  database
    .ref()
    .child('faq')
    .get()
    .then(async snapshot => {
      if (snapshot.exists()) {
        setter(snapshot.val())
      }
    })
}

const getGenericSpot = setter => {
  database
    .ref('content/spots')
    .child('explomaker')
    .get()
    .then(snapshot => {
      if (snapshot.exists()) {
        const currentDoc = snapshot.val()
        if (currentDoc?.picture_slider) {
          currentDoc.picture_slider = currentDoc.picture_slider.map(picture => ({
            ...picture,
            src: {
              ...picture.src,
              original: `https://storage.googleapis.com/explomaker-data-stateless/${picture.src.original}`,
            },
          }))
        }
        setter(currentDoc)
      }
    })
}

const getDictionnary = (setter, setLoader) => {
  database
    .ref()
    .child('dictionary')
    .get()
    .then(async snapshot => {
      if (snapshot.exists()) {
        const tempDictionnary = snapshot.val()
        if (tempDictionnary.meta_name_envies_sport) {
          const arrayOfEnviesSport = Object.entries(tempDictionnary.meta_name_envies_sport)
          tempDictionnary.meta_name_envies_sport = arrayOfEnviesSport.map(like => ({
            value: like[0],
            label: like[1].name,
            icon: like[1].logo,
            picture: like[1].picture,
          }))
          const enviesSport = await Promise.all(
            arrayOfEnviesSport.map(like => {
              if (like[1].picture.id) {
                return imgRef.child(like[1].picture.id).get()
              }
              return false
            })
          )
          enviesSport.forEach((picture, pictureIndex) => {
            if (picture && picture.exists()) {
              tempDictionnary.meta_name_envies_sport[pictureIndex].picture = `${
                tempDictionnary.library_source
              }${picture.val().thumbnail}`
            }
          })
        }
        setter(tempDictionnary)
        setLoader(true)
      }
    })
}

const getTrendingDestinations = setter => {
  database
    .ref()
    .child('page_structure/accueil/destinations_du_moment')
    .get()
    .then(async snapshot => {
      if (snapshot.exists()) {
        const tempTrendingDestinations = snapshot.val()
        setter(tempTrendingDestinations)
      }
    })
}

const updateTrip = (tripId, data) => {
  firestore
    .collection('trips')
    .doc(tripId)
    .set({ ...data }, { merge: true })
}

const FirebaseContextProvider = ({ children }) => {
  const [users, setUsers] = useState([])
  const [dictionary, setDictionary] = useState({})
  const [isDictionaryLoaded, setIsDictionaryLoaded] = useState(false)
  const [faq, setFaq] = useState([])
  const [genericSpot, setGenericSpot] = useState({})

  const getSpotByCountryName = (countryName, spotSetter) => {
    database
      .ref('content/spots')
      .orderByChild('sub_type')
      .equalTo('pays')
      .on('value', snapshot => {
        if (snapshot.exists()) {
          const countryDocs = snapshot.val()
          const countryDocsKeys = Object.keys(countryDocs)
          let currentCountrySpot
          const hasMatch = countryDocsKeys.some(key => {
            if (countryDocs[key].gps?.country_short === countryName) {
              currentCountrySpot = { ...countryDocs[key] }
              return true
            }
            return false
          })
          if (hasMatch) {
            if (currentCountrySpot?.picture_slider) {
              currentCountrySpot.picture_slider = currentCountrySpot.picture_slider.map(
                picture => ({
                  ...picture,
                  src: {
                    ...picture.src,
                    original: `https://storage.googleapis.com/explomaker-data-stateless/${picture.src.original}`,
                  },
                })
              )
              spotSetter(currentCountrySpot)
            }
          } else {
            spotSetter(genericSpot)
          }
        } else {
          spotSetter(genericSpot)
        }
      })
  }

  const getSpotByDestination = (destination, spotSetter) => {
    if (destination?.value?.place_id) {
      database
        .ref('content/spots')
        .orderByChild('gps/google_place_id')
        .equalTo(destination.value.place_id)
        .on('value', snapshot => {
          console.log(snapshot.val())
          if (snapshot.exists()) {
            const spotDoc = snapshot.val()
            const currentDoc = spotDoc[Object.keys(spotDoc)[0]]
            if (currentDoc?.picture_slider) {
              currentDoc.picture_slider = currentDoc.picture_slider.map(picture => ({
                ...picture,
                src: {
                  ...picture.src,
                  original: `https://storage.googleapis.com/explomaker-data-stateless/${picture.src.original}`,
                },
              }))
            }
            spotSetter(currentDoc)
          } else if (destination?.shortCountryName) {
            getSpotByCountryName(destination.shortCountryName, spotSetter)
          } else {
            spotSetter(genericSpot)
          }
        })
    } else {
      spotSetter(genericSpot)
    }
  }

  const testUniqueSpot = setter => {
    database
      .ref('content/spots')
      .orderByChild('gps/google_place_id')
      .equalTo('ChIJAVkDPzdOqEcRcDteW0YgIQQ')
      .on('value', snapshot => {
        const currentSpot = snapshot.val()
        setter(currentSpot)
      })
  }

  const getUserById = async uid => {
    const localUser = users.filter(user => user.id === uid)
    if (localUser.length > 0) {
      return localUser[0]
    }
    const userRef = await firestore.collection('users').doc(uid).get()
    if (userRef.exists) {
      const userDoc = { ...userRef.data(), id: userRef.id }
      setUsers([...users, { ...userDoc, fetchedAt: getTime(new Date()) }])
      return userDoc
    }
    return false
  }

  useEffect(() => {
    if (Object.keys(dictionary).length < 1) {
      getDictionnary(setDictionary, setIsDictionaryLoaded)
    }
    if (faq.length < 1) {
      getFaq(setFaq)
    }
    if (Object.keys(genericSpot).length < 1) {
      getGenericSpot(setGenericSpot)
    }
  })

  const refreshTripData = (tripId, setter) => {
    if (tripId) {
      firestore
        .collection('trips')
        .doc(tripId)
        .onSnapshot(doc => {
          const tempDoc = doc.data()
          setter(tempDoc)
        })
    }
  }

  const delNotificationsFromAnEventDeleted = async (tripData, tripId, event) => {
    const definitiveUserGroup = []
    const tempPromisesUser = []
    const tempTrip = structuredClone(tripData)
    console.log('tripdata ça passe')
    const tempEvent = structuredClone(event)
    console.log('tempevent ça passe')
    // const tempNotifs = tempTrip.notifications || []
    // console.log('je te montre tempNotifs', tempNotifs)
    // const tempTripNotifFiltered = tempNotifs.filter(
    //   notification => notification?.event?.id !== tempEvent.id
    // )
    const tempUserGroup = tempTrip.travelersDetails.map(traveler => traveler.id)
    console.log('les id du départ', tempUserGroup)
    tempUserGroup.forEach(user =>
      tempPromisesUser.push(
        new Promise((resolve, reject) => {
          resolve(firestore.collection('users').doc(user).get())
        })
      )
    )

    console.log('les id de firestore', tempPromisesUser)

    Promise.all(tempPromisesUser)
      .then(datas => {
        console.log('datas', datas)

        datas.forEach((data, index) => {
          definitiveUserGroup.push({ ...data.data(), id: tempUserGroup[index] })
        })
      })
      .then(() => {
        console.log('utilisateurs définitifs', definitiveUserGroup)
        // console.log('tableau de notif filtrés pour le voyage', tempTripNotifFiltered)

        const finalUsers = definitiveUserGroup?.map(definitiveUser => {
          const tempDefinitiveUser = structuredClone(definitiveUser)
          console.log('tempDefinitiveUser', tempDefinitiveUser)
          tempDefinitiveUser.notifications =
            definitiveUser.notifications?.filter(
              notification => notification?.event?.id !== event?.id
            ) || []
          return tempDefinitiveUser
        })

        console.log('les utilisateurs finaux avec les tableaux filtrés', finalUsers)

        // const mergedNotifications = tempTripNotifFiltered
        // console.log('mergedNotifications', mergedNotifications)
        // firestore
        //   .collection('trips')
        //   .doc(tripId)
        //   .set({ notifications: mergedNotifications }, { merge: true })

        const promises = finalUsers?.forEach(singleUser => {
          console.log('chaque utilisateur', singleUser)
          if (singleUser.notifications.length > 0) {
            firebase
              .firestore()
              .collection('users')
              .doc(singleUser.id)
              .update({
                notifications: singleUser.notifications || [],
              })
              .then(() => {
                console.log(`notification updated for ${singleUser?.firstname}`)
              })
          }
        })
      })
  }

  const createNotifications = async (currentUser, tripData, tripId, type, priority) => {
    const tempTrip = {
      mainPicture: tripData.mainPicture,
      dateRange: tripData.dateRange,
      destination: { label: tripData.destination.label },
      title: tripData.title,
    }

    const user = await firestore.collection('users').doc(currentUser.id).get()
    const tempNotifs = user.data().notifications || []
    const updateData = {}
    tempNotifs.push({
      id: uuidv4(),
      sejour: tempTrip,
      type,
      priority,
      state: 1,
      tripId,
      creationDate: new Date(),
    })

    updateData.notifications = structuredClone(tempNotifs)
    console.log('données qui vont être persistées', updateData)

    firestore
      .collection('users')
      .doc(user.id)
      .set({ ...updateData }, { merge: true })
  }

  const setNotificationsToNewState = (user, state, notifId) => {
    const updateData = {}

    if (user) {
      const tempNotifs = user.notifications || []
      const newStateNotif = tempNotifs.map(singleNotif => {
        const tempSingleNotif = singleNotif
        if (tempSingleNotif.state < 3 && tempSingleNotif.state !== state && !notifId) {
          tempSingleNotif.state = state
        }
        if (
          notifId &&
          tempSingleNotif.id === notifId &&
          tempSingleNotif.state < 3 &&
          tempSingleNotif.state !== state
        ) {
          tempSingleNotif.state = state
        }
        console.log('chaque notif modifiée', tempSingleNotif)
        return tempSingleNotif
      })
      updateData.notifications = newStateNotif

      firestore
        .collection('users')
        .doc(user.id)
        .set({ ...updateData }, { merge: true })
    }
  }

  const setNotificationsToNewStateOnTrip = (user, tripId, state) => {
    const updateData = {}

    if (user && tripId) {
      const tempNotifs =
        user?.notifications?.filter(notification => notification.tripId === tripId) || []
      const newStateNotif = tempNotifs.map(singleNotif => {
        const tempSingleNotif = singleNotif
        if (tempSingleNotif.state !== state && tempSingleNotif.state < 3) {
          tempSingleNotif.state = state
        }
        return tempSingleNotif
      })
      updateData.notifications = newStateNotif

      firestore
        .collection('users')
        .doc(user.id)
        .set({ ...updateData }, { merge: true })
    }
  }

  const UpdateNotificationsStateBasedOnEventDeleted = (tripData, eventId) => {
    const tempTrip = structuredClone(tripData)
    const tempUserGroupId = tripData.travelersDetails.map(traveler => traveler.id)
  }

  const handleUsersGroupInATrip = tripData => {
    const tempTrip = structuredClone(tripData)
    const tempUserGroup = tempTrip?.travelersDetails?.map(traveler => traveler?.id)
    const tempUserGroupNotif = tempUserGroup.map(user => {
      const tempUser = {}
      tempUser.id = user
      tempUser.notifications = []
      return tempUser
    })
    console.log('group duser temp', tempUserGroupNotif)
  }

  const createNotificationsOnTrip = async (
    currentUser,
    tripData,
    tripId,
    type,
    priority,
    event,
    previous
  ) => {
    try {
      const tempTrip = {
        mainPicture: tripData.mainPicture,
        dateRange: tripData.dateRange,
        destination: { label: tripData.destination.label },
        travelersDetails: tripData.travelersDetails,
        title: tripData.title,
      }
      const tempPrevious = previous ?? null
      console.log('tempTrip', tempTrip)
      const tempEvent = event ? structuredClone(event) : null
      console.log('showmetempevent', tempEvent)
      const tempUserGroup = tempTrip.travelersDetails
        .filter(traveler => traveler.id !== currentUser.id)
        .map(traveler => traveler.id)
      const tempUserGroupNotif = tempUserGroup.map(user => ({ id: user, notifications: [] }))
      const tempTripNotif = tripData.notifications || []

      if (
        [
          'dateUpdate',
          'surveyCreate',
          'surveyClose',
          'turnEventIntoSurvey',
          'surveyPropositionChange',
          'propositionAdd',
          'eventCreate',
          'eventUpdate',
          'destinationUpdate',
          'eventDelete',
        ].includes(type)
      ) {
        const id = uuidv4()
        const creationDate = new Date()
        const owner = { id: currentUser.id, firstname: currentUser.firstname }

        const notification = {
          id,
          creationDate,
          tripId,
          sejour: tempTrip,
          type,
          priority,
          state: 1,
          owner,
          event: tempEvent,
          previous: tempPrevious,
        }

        const userNotification = {
          id,
          creationDate,
          tripId,
          sejour: tempTrip,
          type,
          priority,
          state: 1,
          event: tempEvent,
          previous: tempPrevious,
        }

        tempTripNotif.push(notification)
        tempUserGroupNotif.forEach(user => user.notifications.push(userNotification))

        const updateDataSingleNotif = { ...notification }
        // delete updateDataSingleNotif.sejour
        // delete updateDataSingleNotif.event

        const updateDataTrip = { notifications: tempTripNotif }
        console.log(
          'le tableau de notif avant création du nouveau tableau de notif avec la new notif',
          updateDataTrip
        )
        await firestore.collection('trips').doc(tripId).set(updateDataTrip, { merge: true })

        tempUserGroup.forEach(singleUser => {
          firestore
            .collection('users')
            .doc(singleUser)
            .update({
              notifications: firebase.firestore.FieldValue.arrayUnion(updateDataSingleNotif),
            })
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <FirebaseContext.Provider
      value={{
        auth,
        firestore,
        database,
        storage,
        uiConfig,
        signInWithEmailAndPassword,
        timestampRef,
        getUserById,
        localUsers: users,
        setLocalUsers: setUsers,
        dictionary,
        isDictionaryLoaded,
        faq,
        updateTrip,
        getTrendingDestinations,
        getSpotByDestination,
        genericSpot,
        testUniqueSpot,
        createNotifications,
        setNotificationsToNewState,
        setNotificationsToNewStateOnTrip,
        createNotificationsOnTrip,
        handleUsersGroupInATrip,
        delNotificationsFromAnEventDeleted,
        refreshTripData,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  )
}

export default FirebaseContextProvider
