import React, { createContext, useEffect, useState } from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firebase-firestore'
import 'firebase/storage'
import 'firebase/database'
import 'firebase/analytics'
import getTime from 'date-fns/getTime'

import facebook from '../images/signIn/Facebook.svg'
import google from '../images/signIn/Google.svg'

export const FirebaseContext = createContext()

const firebaseConfig = {
  apiKey: 'AIzaSyAgeZlnX0NxeuHRjVylQMGLZOla4zWE9p8',
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
              original: `https://storage.googleapis.com/stateless-www-explomaker-fr/${picture.src.original}`,
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
                    original: `https://storage.googleapis.com/stateless-www-explomaker-fr/${picture.src.original}`,
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
    if (destination.value?.place_id) {
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
                  original: `https://storage.googleapis.com/stateless-www-explomaker-fr/${picture.src.original}`,
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

  const createNotifications = async (currentUser, tripData, type, priority) => {
    const tempTrip = structuredClone(tripData)
    Reflect.deleteProperty(tempTrip, 'travelersDetails')
    const user = await firestore.collection('users').doc(currentUser.id).get()
    const tempNotifs = user.data().notifications || []
    const updateData = {}
    tempNotifs.push({
      sejour: tempTrip,
      type,
      priority,
      state: 1,
      creationDate: new Date(),
    })

    updateData.notifications = structuredClone(tempNotifs)
    console.log('données qui vont être persistées', updateData)
    firestore
      .collection('users')
      .doc(user.id)
      .set({ ...updateData }, { merge: true })
  }

  const setNotificationsToConsulted = (user, tripData) => {
    const updateData = {}

    if (user) {
      const tempNotifs = user.notifications || []
      const consultedNotif = tempNotifs.map(singleNotif => {
        const tempSingleNotif = singleNotif
        if (tempSingleNotif.state === 1) {
          tempSingleNotif.state = 2
        }
        return tempSingleNotif
      })
      updateData.notifications = consultedNotif

      firestore
        .collection('users')
        .doc(user.id)
        .set({ ...updateData }, { merge: true })
    }
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

  const createNotificationsOnTrip = (currentUser, tripData, tripid, type, priority, event) => {
    let tempEvent
    const { notifications, ...tempTrip } = structuredClone(tripData)
    if (event) {
      tempEvent = structuredClone(event)
    }
    console.log('tripData', tripData)
    console.log('tripid', tripid)
    console.log('currentUser', currentUser)
    console.log('tempEvent', tempEvent)

    console.log(`je crée une notif de type ${type}`, tempTrip)
    const tempTripNotif = tripData.notifications || []
    const tempUserGroup = tempTrip.travelersDetails
      .filter(traveler => traveler.id !== currentUser.id)
      .map(traveler => traveler?.id)
    console.log('tempUserGroup', tempUserGroup)
    const tempUserGroupNotif = tempUserGroup.map(user => {
      const tempUser = {}
      tempUser.id = user
      tempUser.notifications = []
      return tempUser
    })

    let updateDataSingleNotif = {}
    const updateDataTrip = {}
    if (
      type === 'dateUpdate' ||
      type === 'surveyCreate' ||
      type === 'surveyClose' ||
      type === 'turnEventIntoSurvey' ||
      type === 'surveyPropositionChange' ||
      type === 'propositionAdd' ||
      type === 'eventCreate' ||
      type === 'eventUpdate'
    ) {
      tempTripNotif.push({
        sejour: tempTrip,
        creationDate: new Date(),
        type,
        state: 1,
        priority,
        owner: {
          id: currentUser.id,
          firstname: currentUser.firstname,
        },
        event,
      })
      tempUserGroupNotif.forEach(user =>
        user.notifications.push({
          creationDate: new Date(),
          tripId: tripid,
          sejour: tempTrip,
          type,
          priority,
          state: 1,
        })
      )
      updateDataSingleNotif = {
        creationDate: new Date(),
        tripId: tripid,
        sejour: tempTrip,
        type,
        priority,
        state: 1,
        owner: {
          id: currentUser.id,
          firstname: currentUser.firstname,
        },
        event,
      }
      console.log(tempUserGroupNotif, 'tout le monde a sa notif')
      console.log(tempTripNotif)
      updateDataTrip.notifications = tempTripNotif
      firestore
        .collection('trips')
        .doc(tripid)
        .set({ ...updateDataTrip }, { merge: true })
      tempUserGroup.forEach(singleUser =>
        firestore
          .collection('users')
          .doc(singleUser)
          .update({
            notifications: firebase.firestore.FieldValue.arrayUnion(updateDataSingleNotif),
          })
      )
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
        setNotificationsToConsulted,
        createNotificationsOnTrip,
        handleUsersGroupInATrip,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  )
}

export default FirebaseContextProvider
