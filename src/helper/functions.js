/* eslint-disable prefer-const */
import {
  addMinutes,
  addHours,
  format,
  parseISO,
  subMinutes,
  subHours,
  intervalToDuration,
  formatDuration,
  isBefore,
} from 'date-fns'
import frLocale from 'date-fns/locale/fr'
import parse from 'date-fns/parse'
import { useEffect, useRef } from 'react'
import { firestore } from '../contexts/firebase'

import { EVENT_TYPES } from './constants'

/**
 * Return consistent timestamp from Firestore
 * @param arrayOfTimestamps Can be one element or an array of elements
 * @param {string} formatStr Optionnal
 * @returns {array} Date or Array of dates
 */
export function rCTFF(arrayOfTimestamps, formatStr) {
  let timestamps = []
  let tempArrayOfTimestamps = arrayOfTimestamps
  let isArray = true
  if (!Array.isArray(arrayOfTimestamps)) {
    isArray = false
    tempArrayOfTimestamps = [arrayOfTimestamps]
  }

  tempArrayOfTimestamps.forEach(timestamp => {
    let tempTimestamp
    if (typeof timestamp !== 'string' && 'toDate' in timestamp) {
      tempTimestamp = timestamp.toDate()
    } else if (typeof timestamp === 'string') {
      tempTimestamp = parseISO(timestamp)
    } else {
      tempTimestamp = new Date(timestamp.seconds * 1000)
    }
    timestamps.push(tempTimestamp)
  })

  if (formatStr) {
    timestamps = timestamps.map(timestamp => format(timestamp, formatStr, { locale: frLocale }))
  }

  if (!isArray) {
    return timestamps[0]
  }
  return timestamps
}

export function dateToString(date, displayFormat = 'yyyy-MM-dd') {
  const tempDate = date
  return format(tempDate, displayFormat, { locale: frLocale })
}

export function formatDateInTimezone(receivedTimestamp, timezone, formatString) {
  // // timestamp de Firebase
  // const firebaseTimestamp = receivedTimestamp

  // console.log('Firebase timestamp :', firebaseTimestamp)

  // // conversion en objet Date
  // const date = new Date(firebaseTimestamp.seconds * 1000 + firebaseTimestamp.nanoseconds / 1000000)
  const date = new Date(receivedTimestamp)

  console.log('Date :', date)

  // formatage de la date en string avec l'heure correspondant au fuseau horaire de base
  const dateString = format(date, 'yyyy-MM-dd HH:mm')

  console.log('Date formatée :', dateString) // affiche '2023-05-06 10:15'
}

export function dateTimeToString(dateTime) {
  const tempDateTime = dateTime
  return format(tempDateTime, 'yyyy-MM-dd HH:mm', { locale: frLocale })
}

export function stringToDate(string, formatString = 'yyyy-MM-dd HH:mm') {
  const tempString = string
  return parse(tempString, formatString, new Date(), { locale: frLocale })
}

export function arrayShuffle(array) {
  const tempArray = array
  let m = array.length
  let t
  let i

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    m -= 1
    i = Math.floor(Math.random() * m)
    // And swap it with the current element.
    t = tempArray[m]
    tempArray[m] = tempArray[i]
    tempArray[i] = t
  }

  return tempArray
}

export function returnFileSize(number) {
  if (number < 1024) {
    return `${number} octets`
  }
  if (number >= 1024 && number < 1048576) {
    return `${(number / 1024).toFixed(1)} Ko`
  }
  if (number >= 1048576) {
    return `${(number / 1048576).toFixed(1)} Mo`
  }
}

export function filterObjectByValue(object, value, notEqual = false) {
  return Object.fromEntries(
    Object.entries(object).filter(([, currentValue]) => {
      if (notEqual) {
        return currentValue !== value
      }
      return currentValue === value
    })
  )
}

export function onlyUnique(array) {
  return array.filter((value, index, self) => self.indexOf(value) === index)
}

export function getWidth() {
  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  )
}

export function getEventStartDate(event) {
  // eslint-disable-next-line default-case
  switch (event.type) {
    case EVENT_TYPES[0]:
      return stringToDate(event.startTime, 'yyyy-MM-dd HH:mm')
    case EVENT_TYPES[1]:
      return stringToDate(event.flights[0].date, 'yyyy-MM-dd')
    case EVENT_TYPES[2]:
      return stringToDate(event.startTime, 'yyyy-MM-dd HH:mm')
    case EVENT_TYPES[3]:
      return stringToDate(event.transports[0].startTime, 'yyyy-MM-dd HH:mm')
    case EVENT_TYPES[4]:
      return stringToDate(event.startTime, 'yyyy-MM-dd HH:mm')
  }
}

export const applyTimezoneOffsetFromAmadeus = (date, timezoneOffsetFromAmadeus) => {
  let tempDate = rCTFF(date)
  const offset = parseInt(timezoneOffsetFromAmadeus, 10) * 60
  const offsetSign = Math.sign(offset)

  if (offsetSign === -1) {
    tempDate = subMinutes(tempDate, Math.abs(offset))
  }
  if (offsetSign === 1) {
    tempDate = addMinutes(tempDate, offset)
  }
  return tempDate
}

/** Get the minimum or the maximum LngLat of an Array of LngLat
 * @function findBounds
 * @param {array} latLngArray
 * @param {bool} northEast
 * @typedef {Object} returnValue
 * @returns {returnValue}
 * @property {number} returnValue.lat
 * @property {number} returnValue.lng
 */
export function findBounds(latLngArray, northEast) {
  const latArray = []
  const lngArray = []
  latLngArray.forEach(({ lat, lng }) => {
    latArray.push(lat)
    lngArray.push(lng)
  })
  latArray.sort((a, b) => a - b)
  lngArray.sort((a, b) => a - b)
  if (typeof northEast !== 'undefined') {
    return { lat: latArray[latArray.length - 1], lng: lngArray[lngArray.length - 1] }
  }
  return { lat: latArray[0], lng: lngArray[0] }
}

/** Add or Sub a travel time, format the data with date-fns format() func, apply a timezone with applyTimezoneOffsetFromAmadeus func
 * @function addOrSubTravelTime
 * @param {date} departureDate
 * @param {Object} leg with {minutes: number, hours: number}
 * @param {stringFormat} string example : 'HH:mm'
 * @param {bool} add if true, add travelTime, if false, sub travelTime
 * @param {string} timezone timezoneOffset item from amadeus, example: '+10:00'
 * @returns {formattedDate}
 */
export const addOrSubTravelTime = (departureDate, leg, stringFormat, add, timezone) => {
  let finalTime
  if (add) {
    if (stringFormat && timezone) {
      finalTime = format(
        addMinutes(
          addHours(applyTimezoneOffsetFromAmadeus(departureDate, timezone), leg.hours),
          leg.minutes
        ),

        stringFormat
      )
    }
  }
  if (!add) {
    if (stringFormat && timezone) {
      finalTime = format(
        subMinutes(
          subHours(applyTimezoneOffsetFromAmadeus(departureDate, timezone), leg.hours),
          leg.minutes
        ),
        stringFormat
      )
    }
  }
  return finalTime
}

export const renderStopoverTime = (departureTime, arrivalTime, legs) => {
  const totalTravelTime = intervalToDuration({
    start: departureTime,
    end: arrivalTime,
  })

  const totalTravelTimestamp = totalTravelTime.hours * 60 + totalTravelTime.minutes

  let legMinutes = 0
  let legHours = 0
  legs.forEach(leg => {
    legMinutes += leg.minutes
    legHours += leg.hours
  })
  const legsTimestamp = legHours * 60 + legMinutes
  const stopOverTimestamp = totalTravelTimestamp - legsTimestamp
  let stopoverTime
  if (stopOverTimestamp > 60) {
    stopoverTime = {
      hours: Math.floor(stopOverTimestamp / 60),
      minutes: Math.floor(stopOverTimestamp % 60),
    }
  } else {
    stopoverTime = {
      hours: 0,
      minutes: Math.floor(stopOverTimestamp % 60),
    }
  }
  return stopoverTime
}

function usePrevious(value) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef()
  // Store current value in ref
  useEffect(() => {
    ref.current = value
  }, [value]) // Only re-run if value changes
  // Return previous value (happens before update in useEffect above)
  return ref.current
}

export const buildNotifications = async user => {
  const notifications = []
  const tripsIdArray = []
  const tempNotificationContent = []
  if (user.notifications) {
    user.notifications.forEach(
      ({ sejour, priority, state, type, creationDate, url, owner, tripId, image, id }) => {
        // if (tripId && !tripsIdArray.includes(tripId)) {
        //   tripsIdArray.push(tripId)
        //   tempNotificationContent.push({ tripId, owner, sejour })
        // }
        const singleNotif = {}
        singleNotif.id = id
        if (type === 'newTrip') {
          console.log('je suis un newtrip')
          singleNotif.content = `Votre nouveau voyage - ${sejour?.title} - a bien été créé`
          const tempTimer = intervalToDuration({
            start: new Date(rCTFF(creationDate)),
            end: new Date(),
          })
          singleNotif.timer = `il y a ${formatDuration(tempTimer, {
            format:
              tempTimer.days > 1
                ? ['days']
                : tempTimer.hours > 1
                ? ['hours']
                : tempTimer.minutes > 1
                ? ['minutes']
                : tempTimer.seconds >= 1 && ['seconds'],
          })}`
          singleNotif.state = state
          singleNotif.image = sejour?.mainPicture ?? ''

          notifications.push(singleNotif)
        } else if (type === 'jointrip') {
          console.log('je suis un jointrip')
          singleNotif.content = `Vous avez rejoint le voyage ${sejour?.title}`
          const tempTimer = intervalToDuration({
            start: new Date(rCTFF(creationDate)),
            end: new Date(),
          })
          singleNotif.timer = `il y a ${formatDuration(tempTimer, {
            format:
              tempTimer.days > 1
                ? ['days']
                : tempTimer.hours > 1
                ? ['hours']
                : tempTimer.minutes > 1
                ? ['minutes']
                : tempTimer.seconds >= 1 && ['seconds'],
          })}`
          singleNotif.state = state
          singleNotif.image = sejour?.mainPicture ?? ''

          notifications.push(singleNotif)
        } else if (type === 'dateUpdate') {
          console.log('je suis un updateDate')
          singleNotif.content = `Les dates de votre voyage ont été modifiées, elles sont désormais du ${rCTFF(
            sejour.dateRange[0],
            'dd/MM/yyyy'
          )} au ${rCTFF(sejour.dateRange[1], 'dd/MM/yyyy')}`
          const tempTimer = intervalToDuration({
            start: new Date(rCTFF(creationDate)),
            end: new Date(),
          })
          singleNotif.timer = `il y a ${formatDuration(tempTimer, {
            format:
              tempTimer.days > 1
                ? ['days']
                : tempTimer.hours > 1
                ? ['hours']
                : tempTimer.minutes > 1
                ? ['minutes']
                : tempTimer.seconds >= 1 && ['seconds'],
          })}`
          singleNotif.state = state
          singleNotif.url = url
          singleNotif.owner = owner
          singleNotif.image = sejour.mainPicture ?? ''

          notifications.push(singleNotif)
        }
      }
    )

    const userTripCollection = []
    const userTripRequest = await firestore
      .collection('users')
      .doc(user.id)
      .collection('trips')
      .get()

    userTripRequest.forEach(doc => userTripCollection.push(doc.id))

    const tempTripCollectionRequest = userTripCollection.map(async tripId => {
      // console.log('tripId', tripId)
      const tempRequest = await firestore.collection('trips').doc(tripId).get()
      return {
        tripId,
        tripData: tempRequest.data(),
      }
    })
    // console.log('request de voyages', tempTripCollectionRequest)
    const tempTripCollection = await Promise.all(tempTripCollectionRequest)

    // console.log('collection de voyages', tempTripCollection)
    // console.log('collection de trips', userTripCollection)
    const buildNotificationsPromises = tempTripCollection.map(({ tripId, tripData }) => {
      // console.log('tripId dans la collec', tripId)
      const singleNotif = {}
      let AssistantNotReadArrayLength = 0
      let messagesNotReadArrayLength = 0
      const tempMessagesArray = []
      let tempAssistantArray = []
      const notifArrayLength = user.notifications.filter(
        notification => notification.tripId === tripId && notification.state === 1
      ).length

      const messagesPromise = firestore.collection('trips').doc(tripId).collection('messages').get()

      const assistantPromise = firestore
        .collection('trips')
        .doc(tripId)
        .collection('Assistant')
        .get()

      return Promise.all([messagesPromise, assistantPromise]).then(
        ([messagesSnapshot, assistantSnapshot]) => {
          messagesSnapshot.forEach(doc => {
            tempMessagesArray.push(doc.data())
          })
          assistantSnapshot.forEach(doc => {
            tempAssistantArray.push(doc.data())
          })
          messagesNotReadArrayLength = tempMessagesArray?.filter(message =>
            message.notifications?.some(
              notification => notification.userId === user.id && !notification.hasSeen
            )
          ).length
          AssistantNotReadArrayLength = tempAssistantArray?.filter(message =>
            message.notifications?.some(
              notification => notification.userId === user.id && !notification.hasSeen
            )
          ).length
          // console.log('le compteur de messages', messagesNotReadArrayLength)
          singleNotif.redPings =
            notifArrayLength + messagesNotReadArrayLength + AssistantNotReadArrayLength
          // console.log('redPings', singleNotif.redPings)
          singleNotif.content = `il y a du nouveau sur le voyage - ${tripData?.title} -`
          singleNotif.url = `/tripPage/${tripId}`
          singleNotif.state = 1
          singleNotif.myTripsTripId = tripId
          singleNotif.image = tripData?.mainPicture ?? `../../images/inherit/Kenya 1.png`
          // console.log('compteur de notif', singleNotif.redPings)
          notifications.push(singleNotif)
          // console.log('le log des notifs', notifications)
        }
      )
    })
    return Promise.all(buildNotificationsPromises).then(() => {
      console.log('le log des notifs', notifications)
      return notifications
    })
  }
}

export const buildNotifTimerAndState = (creationDate, state) => {
  const tempTimer = intervalToDuration({
    start: new Date(rCTFF(creationDate)),
    end: new Date(),
  })
  const notifBody = {}

  notifBody.definitiveTimer = `il y a ${formatDuration(tempTimer, {
    format:
      tempTimer.days > 1
        ? ['days']
        : tempTimer.hours > 1
        ? ['hours']
        : tempTimer.minutes > 1
        ? ['minutes']
        : tempTimer.seconds >= 1 && ['seconds'],
  })}`
  notifBody.state = state
  return notifBody
}

export const buildNotificationsOnTripForUser = (user, tripId) => {
  const notifications = []
  if (user.notifications) {
    user.notifications
      .filter(
        notification =>
          notification.tripId === tripId && notification?.sejour?.travelersDetails?.length > 0
      )
      .forEach(({ sejour, priority, state, type, creationDate, owner, event, id }) => {
        const singleNotif = {}
        const notifBody = buildNotifTimerAndState(creationDate, state)
        singleNotif.id = id
        singleNotif.owner = owner
        singleNotif.priority = priority
        singleNotif.tripId = tripId
        if (event) {
          singleNotif.startTime = event.startTime
          singleNotif.event = event
        }
        // eslint-disable-next-line default-case
        switch (type) {
          case 'dateUpdate':
            console.log('je suis un dateUpdate')
            singleNotif.content = owner?.firstname
              ? `${owner.firstname} a modifié les dates du voyage. Elles sont désormais du ${rCTFF(
                  sejour.dateRange[0],
                  'dd/MM/yyyy'
                )} au ${rCTFF(sejour.dateRange[1], 'dd/MM/yyyy')}.`
              : `Les dates de votre voyage ont été modifiées, elles sont désormais du ${rCTFF(
                  sejour.dateRange[0],
                  'dd/MM/yyyy'
                )} au ${rCTFF(sejour.dateRange[1], 'dd/MM/yyyy')}.`
            singleNotif.timer = notifBody.definitiveTimer
            singleNotif.state = notifBody.state
            singleNotif.url = `/tripPage/${tripId}`
            singleNotif.type = 'dateUpdate'
            break

          case 'surveyCreate':
            console.log('je passe par le surveyCreate', event.propositions[0])
            singleNotif.content = owner?.firstname
              ? `${owner.firstname} a créé un sondage - ${
                  event?.type === 'accommodation'
                    ? 'Hébergement'
                    : event?.type === 'flight'
                    ? 'Vol'
                    : event?.type === 'restaurant'
                    ? 'Restaurant'
                    : event?.type === 'explore'
                    ? 'Exploration'
                    : event?.type === 'transport' && 'Transport'
                } -  sur la journée du ${
                  event.type === 'flight'
                    ? rCTFF(event.propositions[0].flights[0].date, 'dd/MM/yyyy')
                    : rCTFF(event.propositions[0].date, 'dd/MM/yyyy')
                }.`
              : `Un sondage - ${
                  event?.type === 'accommodation'
                    ? 'Hébergement'
                    : event?.type === 'flight'
                    ? 'Vol'
                    : event?.type === 'restaurant'
                    ? 'Restaurant'
                    : event?.type === 'explore'
                    ? 'Exploration'
                    : event?.type === 'transport' && 'Transport'
                } - a été créé sur la journée du ${
                  event.propositions && event.type === 'flight'
                    ? rCTFF(event.propositions[0].flights[0].date, 'dd/MM/yyyy')
                    : rCTFF(event.propositions[0].date, 'dd/MM/yyyy')
                }.`
            singleNotif.timer = notifBody.definitiveTimer
            singleNotif.state = notifBody.state
            singleNotif.icon = event.propositions[0].icon
            singleNotif.eventType = event.type
            singleNotif.url = `/tripPage/${tripId}/planning?survey=${event.id}`
            break

          case 'turnEventIntoSurvey':
            console.log('je passe par le surveyCreate', event.propositions[0])
            singleNotif.content = owner?.firstname
              ? `${owner.firstname} a créé un sondage -
              ${
                event?.type === 'accommodation'
                  ? 'Hébergement'
                  : event?.type === 'flight'
                  ? 'Vol'
                  : event?.type === 'restaurant'
                  ? 'Restaurant'
                  : event?.type === 'explore'
                  ? 'Exploration'
                  : event?.type === 'transport' && 'Transport'
              } - sur la journée du ${
                  event.propositions && rCTFF(event.propositions[0].date, 'dd/MM/yyyy')
                }.`
              : `Un sondage a été créé sur la journée du ${rCTFF(event.date, 'dd/MM/yyyy')}.`
            singleNotif.timer = notifBody.definitiveTimer
            singleNotif.state = notifBody.state
            singleNotif.icon = event.propositions[0].icon
            singleNotif.eventType = event.type
            singleNotif.url = `/tripPage/${tripId}/planning?survey=${event.id}`
            break

          case 'surveyClose':
            console.log('je passe par le surveyClose')
            singleNotif.content = owner?.firstname
              ? `${owner.firstname} a clôturé un sondage - ${
                  event?.type === 'accommodation'
                    ? 'Hébergement'
                    : event?.type === 'flight'
                    ? 'Vol'
                    : event?.type === 'restaurant'
                    ? 'Restaurant'
                    : event?.type === 'explore'
                    ? 'Exploration'
                    : event?.type === 'transport' && 'Transport'
                } - sur la journée du ${event.date && rCTFF(event.date, 'dd/MM/yyyy')}.`
              : `Un sondage - ${
                  event?.type === 'accommodation'
                    ? 'Hébergement'
                    : event?.type === 'flight'
                    ? 'Vol'
                    : event?.type === 'restaurant'
                    ? 'Restaurant'
                    : event?.type === 'explore'
                    ? 'Exploration'
                    : event?.type === 'transport' && 'Transport'
                } - a été clôturé sur la journée du ${rCTFF(event.date, 'dd/MM/yyyy')}.`
            singleNotif.timer = notifBody.definitiveTimer
            singleNotif.state = notifBody.state
            singleNotif.icon = event.icon
            singleNotif.eventType = event.type
            singleNotif.url = `/tripPage/${tripId}/planning`
            break

          case 'surveyPropositionChange':
            console.log('je passe par le surveyPropositionChange')
            singleNotif.content = owner?.firstname
              ? `${owner.firstname} a modifié un sondage sur la journée du ${
                  event.date && rCTFF(event.date, 'dd/MM/yyyy')
                }.`
              : `Un sondage a été modifié sur la journée du ${rCTFF(event.date, 'dd/MM/yyyy')}.`
            singleNotif.timer = notifBody.definitiveTimer
            singleNotif.state = notifBody.state
            singleNotif.icon = event.icon
            singleNotif.eventType = event.type
            singleNotif.url = `/tripPage/${tripId}/planning?survey=${event.id}`
            break

          case 'propositionAdd':
            console.log('je passe par le propositionAdd')
            singleNotif.content = owner?.firstname
              ? `${owner.firstname} a ajouté une proposition sur le sondage - ${
                  event?.type === 'accommodation'
                    ? 'Hébergement'
                    : event?.type === 'flight'
                    ? 'Vol'
                    : event?.type === 'restaurant'
                    ? 'Restaurant'
                    : event?.type === 'explore'
                    ? 'Exploration'
                    : event?.type === 'transport' && 'Transport'
                }
                 - pour la journée du ${
                   event.type === 'flight'
                     ? rCTFF(
                         event.propositions[event.propositions.length - 1].flights[0].date,
                         'dd/MM/yyyy'
                       )
                     : rCTFF(event.propositions[event.propositions.length - 1].date, 'dd/MM/yyyy')
                 }.`
              : `Une proposition a été ajouté sur le sondage pour la journée du ${rCTFF(
                  event.propositions[event.propositions.length - 1].date,
                  'dd/MM/yyyy'
                )}.`
            singleNotif.timer = notifBody.definitiveTimer
            singleNotif.state = notifBody.state
            singleNotif.icon = event.propositions[event.propositions.length - 1].icon
            singleNotif.eventType = event.type
            singleNotif.url = `/tripPage/${tripId}/planning?survey=${event.id}`
            break

          case 'eventCreate':
            console.log('je passe par le eventCreate')
            singleNotif.content = owner?.firstname
              ? `${owner.firstname} a créé un évènement - ${
                  event?.type === 'accommodation'
                    ? 'Hébergement'
                    : event?.type === 'flight'
                    ? 'Vol'
                    : event?.type === 'restaurant'
                    ? 'Restaurant'
                    : event?.type === 'explore'
                    ? 'Exploration'
                    : event?.type === 'transport' && 'Transport'
                } - pour la journée du ${
                  event.type === 'flight'
                    ? rCTFF(event.flights[0].date, 'dd/MM/yyyy')
                    : event.type === 'transport'
                    ? rCTFF(event.transports[0].date, 'dd/MM/yyyy')
                    : rCTFF(event.date, 'dd/MM/yyyy')
                }.`
              : `Un évènement a été créé sur la journée du ${
                  event.type === 'flight'
                    ? rCTFF(event.flights[0].date, 'dd/MM/yyyy')
                    : event.type === 'transport'
                    ? rCTFF(event.transports[0].date, 'dd/MM/yyyy')
                    : rCTFF(event.date, 'dd/MM/yyyy')
                }.`
            singleNotif.timer = notifBody.definitiveTimer
            singleNotif.state = notifBody.state
            singleNotif.icon = event.icon
            singleNotif.eventType = event.type
            singleNotif.url = `/tripPage/${tripId}/planning?event=${event.id}`
            break

          case 'eventUpdate':
            console.log('je passe par le eventUpdate')
            singleNotif.content = owner?.firstname
              ? `${owner.firstname} a modifié un évènement - ${
                  event?.type === 'accommodation'
                    ? 'Hébergement'
                    : event?.type === 'flight'
                    ? 'Vol'
                    : event?.type === 'restaurant'
                    ? 'Restaurant'
                    : event?.type === 'explore'
                    ? 'Exploration'
                    : event?.type === 'transport' && 'Transport'
                } - pour la journée du ${
                  event.type === 'flight'
                    ? rCTFF(event.flights[0].date, 'dd/MM/yyyy')
                    : rCTFF(event.date, 'dd/MM/yyyy')
                }.`
              : `Un évènement a été modifié sur la journée du ${
                  event.type === 'flight'
                    ? rCTFF(event.flights[0].date, 'dd/MM/yyyy')
                    : rCTFF(event.date, 'dd/MM/yyyy')
                }.`
            singleNotif.timer = notifBody.definitiveTimer
            singleNotif.state = notifBody.state
            singleNotif.icon = event.icon
            singleNotif.eventType = event.type
            singleNotif.url = `/tripPage/${tripId}/planning?event=${event.id}`
            break

          case 'destinationUpdate':
            console.log('je passe par le destinationUpdate')
            singleNotif.content = owner?.firstname
              ? `${owner.firstname} a modifié la destination du voyage qui est maintenant ${sejour.destination.label}.`
              : `La destination du voyage a été modifiée, vous partez pour ${sejour.destination.label}.`
            singleNotif.timer = notifBody.definitiveTimer
            singleNotif.state = notifBody.state
            // singleNotif.icon = event.icon
            // singleNotif.eventType = event.type
            singleNotif.url = `/tripPage/${tripId}`
            singleNotif.type = 'destinationUpdate'
            break

          case 'eventDelete':
            console.log('je passe par le eventDelete')
            singleNotif.content = owner?.firstname
              ? `${owner.firstname} a supprimé un évènement - ${
                  event?.type === 'accommodation'
                    ? 'Hébergement'
                    : event?.type === 'flight'
                    ? 'Vol'
                    : event?.type === 'restaurant'
                    ? 'Restaurant'
                    : event?.type === 'explore'
                    ? 'Exploration'
                    : event?.type === 'transport' && 'Transport'
                } - pour la journée du ${
                  event.type === 'flight'
                    ? rCTFF(event.flights[0].date, 'dd/MM/yyyy')
                    : rCTFF(event.date, 'dd/MM/yyyy')
                }.`
              : `Un évènement a été supprimé sur la journée du ${
                  event.type === 'flight'
                    ? rCTFF(event.flights[0].date, 'dd/MM/yyyy')
                    : rCTFF(event.date, 'dd/MM/yyyy')
                }.`
            singleNotif.timer = notifBody.definitiveTimer
            singleNotif.state = notifBody.state
            singleNotif.icon = event.icon
            singleNotif.eventType = event.type
            singleNotif.url = `/tripPage/${tripId}/planning`
            break
        }
        notifications.push(singleNotif)
      })
    console.log('notifs qui sont construites', notifications)
    return notifications
  }
}

export const buildLogSejour = (tripId, tripData) => {
  console.log('raconte moi où tas bobo', tripData.notifications)
  const notifications = []
  if (tripData?.notifications?.length > 0) {
    tripData.notifications
      .filter(notification => notification.tripId === tripId)
      .forEach(({ sejour, priority, state, type, creationDate, owner, event, id, previous }) => {
        const singleNotif = {}
        if (event) {
          singleNotif.startTime = event.startTime
        } else if (event && event?.propositions) {
          singleNotif.startTime = event.propositions[0].startTime
        } else {
          singleNotif.startTime = null
        }
        singleNotif.owner = owner
        singleNotif.id = id
        const notifBody = buildNotifTimerAndState(creationDate, state)
        // eslint-disable-next-line default-case
        switch (type) {
          case 'dateUpdate':
            console.log('je suis un dateUpdate')
            singleNotif.content = owner?.firstname
              ? `${owner.firstname} a modifié les dates du voyage. Elles sont désormais du ${rCTFF(
                  sejour.dateRange[0],
                  'dd/MM/yyyy'
                )} au ${rCTFF(sejour.dateRange[1], 'dd/MM/yyyy')}.`
              : `Les dates de votre voyage ont été modifiées, elles sont désormais du ${rCTFF(
                  sejour.dateRange[0],
                  'dd/MM/yyyy'
                )} au ${rCTFF(sejour.dateRange[1], 'dd/MM/yyyy')}.`
            singleNotif.timer = notifBody.definitiveTimer
            singleNotif.state = notifBody.state
            singleNotif.url = `/tripPage/${tripId}`
            if (previous !== undefined) {
              singleNotif.logs = {
                oldDate: `Du ${previous[0]} au ${previous[1]}`,
                newDate: `Du ${rCTFF(sejour.dateRange[0], 'E dd MMMM', {
                  locale: 'fr-FR',
                })} au ${rCTFF(sejour.dateRange[1], 'E dd MMMM', {
                  locale: 'fr-FR',
                })}`,
              }
            }
            break

          case 'surveyCreate':
            console.log('je passe par le surveyCreate', event.propositions[0])
            singleNotif.content = owner?.firstname
              ? `${owner.firstname} a créé un sondage - ${
                  event?.type === 'accommodation'
                    ? 'Hébergement'
                    : event?.type === 'flight'
                    ? 'Vol'
                    : event?.type === 'restaurant'
                    ? 'Restaurant'
                    : event?.type === 'explore'
                    ? 'Exploration'
                    : event?.type === 'transport' && 'Transport'
                } -  sur la journée du ${
                  event.propositions && rCTFF(event.propositions[0].date, 'dd/MM/yyyy')
                }.`
              : `Un sondage - ${
                  event?.type === 'accommodation'
                    ? 'Hébergement'
                    : event?.type === 'flight'
                    ? 'Vol'
                    : event?.type === 'restaurant'
                    ? 'Restaurant'
                    : event?.type === 'explore'
                    ? 'Exploration'
                    : event?.type === 'transport' && 'Transport'
                } - a été créé sur la journée du ${rCTFF(
                  event.propositions[0].date,
                  'dd/MM/yyyy'
                )}.`
            singleNotif.timer = notifBody.definitiveTimer
            singleNotif.state = notifBody.state
            singleNotif.icon = event.propositions[0].icon
            singleNotif.eventType = event.type
            singleNotif.url = `/tripPage/${tripId}/planning?survey=${event.id}`
            singleNotif.logs = {
              place:
                event.propositions[0].location.label ||
                event.propositions[0].startLocation.label ||
                event.propositions[0].flights[0].data.airports[0].label,
              date: rCTFF(event.propositions[0].date, 'dd/MM/yyyy'),
              eventName: event.propositions[0].title,
              participatingTravelers: event.propositions[0].participatingTravelers.map(
                traveler => traveler.name
              ),
            }
            break

          case 'turnEventIntoSurvey':
            console.log('je passe par le surveyCreate', event.propositions[0])
            singleNotif.content = owner?.firstname
              ? `${owner.firstname} a créé un sondage -
              ${
                event?.type === 'accommodation'
                  ? 'Hébergement'
                  : event?.type === 'flight'
                  ? 'Vol'
                  : event?.type === 'restaurant'
                  ? 'Restaurant'
                  : event?.type === 'explore'
                  ? 'Exploration'
                  : event?.type === 'transport' && 'Transport'
              } - sur la journée du ${
                  event.propositions && rCTFF(event.propositions[0].date, 'dd/MM/yyyy')
                }.`
              : `Un sondage a été créé sur la journée du ${rCTFF(event.date, 'dd/MM/yyyy')}.`
            singleNotif.timer = notifBody.definitiveTimer
            singleNotif.state = notifBody.state
            singleNotif.icon = event.propositions[0].icon
            singleNotif.eventType = event.type
            singleNotif.url = `/tripPage/${tripId}/planning?survey=${event.id}`
            break

          case 'surveyClose':
            console.log('je passe par le surveyClose')
            singleNotif.content = owner?.firstname
              ? `${owner.firstname} a clôturé un sondage - ${
                  event?.type === 'accommodation'
                    ? 'Hébergement'
                    : event?.type === 'flight'
                    ? 'Vol'
                    : event?.type === 'restaurant'
                    ? 'Restaurant'
                    : event?.type === 'explore'
                    ? 'Exploration'
                    : event?.type === 'transport' && 'Transport'
                } - sur la journée du ${event.date && rCTFF(event.date, 'dd/MM/yyyy')}.`
              : `Un sondage - ${
                  event?.type === 'accommodation'
                    ? 'Hébergement'
                    : event?.type === 'flight'
                    ? 'Vol'
                    : event?.type === 'restaurant'
                    ? 'Restaurant'
                    : event?.type === 'explore'
                    ? 'Exploration'
                    : event?.type === 'transport' && 'Transport'
                } - a été clôturé sur la journée du ${rCTFF(event.date, 'dd/MM/yyyy')}.`
            singleNotif.timer = notifBody.definitiveTimer
            singleNotif.state = notifBody.state
            singleNotif.icon = event.icon
            singleNotif.eventType = event.type
            singleNotif.url = `/tripPage/${tripId}/planning?event=${event.id}`
            break

          case 'surveyPropositionChange':
            console.log('je passe par le surveyPropositionChange')
            singleNotif.content = owner?.firstname
              ? `${owner.firstname} a modifié un sondage sur la journée du ${
                  event.date && rCTFF(event.date, 'dd/MM/yyyy')
                }.`
              : `Un sondage a été modifié sur la journée du ${rCTFF(event.date, 'dd/MM/yyyy')}.`
            singleNotif.timer = notifBody.definitiveTimer
            singleNotif.state = notifBody.state
            singleNotif.icon = event.icon
            singleNotif.eventType = event.type
            singleNotif.url = `/tripPage/${tripId}/planning?survey=${event.id}`
            break

          case 'propositionAdd':
            console.log('je passe par le propositionAdd')
            singleNotif.content = owner?.firstname
              ? `${owner.firstname} a ajouté une proposition sur le sondage - ${
                  event.type
                } - pour la journée du ${
                  event.propositions &&
                  rCTFF(event.propositions[event.propositions.length - 1].date, 'dd/MM/yyyy')
                }.`
              : `Une proposition a été ajouté sur le sondage pour la journée du ${rCTFF(
                  event.propositions[event.propositions.length - 1].date,
                  'dd/MM/yyyy'
                )}.`
            singleNotif.timer = notifBody.definitiveTimer
            singleNotif.state = notifBody.state
            singleNotif.icon = event.propositions[event.propositions.length - 1].icon
            singleNotif.eventType = event.type
            singleNotif.url = `/tripPage/${tripId}/planning?survey=${event.id}`
            break

          case 'eventCreate':
            console.log('je passe par le eventCreate')
            singleNotif.content = owner?.firstname
              ? `${owner.firstname} a créé un évènement - ${
                  event?.type === 'accommodation'
                    ? 'Hébergement'
                    : event?.type === 'flight'
                    ? 'Vol'
                    : event?.type === 'restaurant'
                    ? 'Restaurant'
                    : event?.type === 'explore'
                    ? 'Exploration'
                    : event?.type === 'transport' && 'Transport'
                } - pour la journée du ${
                  event.type === 'flight'
                    ? rCTFF(event.flights[0].date, 'dd/MM/yyyy')
                    : event.type === 'transport'
                    ? rCTFF(event.transports[0].date, 'dd/MM/yyyy')
                    : rCTFF(event.date, 'dd/MM/yyyy')
                }.`
              : `Un évènement a été créé sur la journée du ${
                  event.type === 'flight'
                    ? rCTFF(event.flights[0].date, 'dd/MM/yyyy')
                    : event.type === 'transport'
                    ? rCTFF(event.transports[0].date, 'dd/MM/yyyy')
                    : rCTFF(event.date, 'dd/MM/yyyy')
                }.`
            singleNotif.timer = notifBody.definitiveTimer
            singleNotif.state = notifBody.state
            singleNotif.icon = event.icon
            singleNotif.eventType = event.type
            singleNotif.url = `/tripPage/${tripId}/planning?event=${event.id}`
            singleNotif.logs = {
              place:
                event.type === 'flight'
                  ? event.flights[0].data.airports[0].label
                  : event.type === 'transport'
                  ? event.transports[0].start.label
                  : event.location.label,
              date: rCTFF(event.date, 'dd/MM/yyyy'),
              eventName: event.title,
              participatingTravelers: event.participatingTravelers.map(traveler => traveler.name),
            }
            break

          case 'eventUpdate':
            console.log('je passe par le eventUpdate')
            singleNotif.content = owner?.firstname
              ? `${owner.firstname} a modifié un évènement - ${
                  event?.type === 'accommodation'
                    ? 'Hébergement'
                    : event?.type === 'flight'
                    ? 'Vol'
                    : event?.type === 'restaurant'
                    ? 'Restaurant'
                    : event?.type === 'explore'
                    ? 'Exploration'
                    : event?.type === 'transport' && 'Transport'
                } - pour la journée du ${
                  event.type === 'flight'
                    ? rCTFF(event.flights[0].date, 'dd/MM/yyyy')
                    : rCTFF(event.date, 'dd/MM/yyyy')
                }.`
              : `Un évènement a été modifié sur la journée du ${
                  event.type === 'flight'
                    ? rCTFF(event.flights[0].date, 'dd/MM/yyyy')
                    : rCTFF(event.date, 'dd/MM/yyyy')
                }.`
            singleNotif.timer = notifBody.definitiveTimer
            singleNotif.state = notifBody.state
            singleNotif.icon = event.icon
            singleNotif.eventType = event.type
            singleNotif.url = `/tripPage/${tripId}/planning?event=${event.id}`
            break

          case 'destinationUpdate':
            console.log('je passe par le destinationUpdate')
            singleNotif.content = owner?.firstname
              ? `${owner.firstname} a modifié la destination du voyage qui est maintenant ${sejour.destination.label}.`
              : `La destination du voyage a été modifiée, vous partez pour ${sejour.destination.label}.`
            singleNotif.timer = notifBody.definitiveTimer
            singleNotif.state = notifBody.state
            // singleNotif.icon = event.icon
            // singleNotif.eventType = event.type
            singleNotif.url = `/tripPage/${tripId}`
            break

          case 'eventDelete':
            console.log('je passe par le eventDelete')
            singleNotif.content = owner?.firstname
              ? `${owner.firstname} a supprimé un évènement - ${
                  event?.type === 'accommodation'
                    ? 'Hébergement'
                    : event?.type === 'flight'
                    ? 'Vol'
                    : event?.type === 'restaurant'
                    ? 'Restaurant'
                    : event?.type === 'explore'
                    ? 'Exploration'
                    : event?.type === 'transport' && 'Transport'
                } - pour la journée du ${
                  event.type === 'flight'
                    ? rCTFF(event?.flights[0].date, 'dd/MM/yyyy')
                    : rCTFF(event?.date, 'dd/MM/yyyy')
                }.`
              : `Un évènement a été supprimé sur la journée du ${
                  event?.type === 'flight'
                    ? rCTFF(event?.flights[0].date, 'dd/MM/yyyy')
                    : rCTFF(event?.date, 'dd/MM/yyyy')
                }.`
            singleNotif.timer = notifBody.definitiveTimer
            singleNotif.state = notifBody.state
            singleNotif.icon = event?.icon
            singleNotif.eventType = event?.type
            singleNotif.url = `/tripPage/${tripId}/planning`
            singleNotif.logs = {
              place:
                event?.type === 'flight'
                  ? event?.flights[0].data.airports[0].label
                  : event?.type === 'transport'
                  ? event?.transports[0].start.label
                  : event?.location.label,
              date: rCTFF(event.date, 'dd/MM/yyyy'),
              eventName: event?.title,
              participatingTravelers: event?.participatingTravelers.map(traveler => traveler.name),
            }
        }
        console.log('cestfini la generation de notif')
        notifications.push(singleNotif)
      })
    console.log('notifs qui sont construites', notifications)
    return notifications
  }
}

/*
export const getLocationInfos = async location => {
  const tempLocation = { ...location }
  let locationDetails = await getPlaceDetails(location.value.place_id)
  if (locationDetails.status === 'OK') {
    locationDetails = locationDetails.result
    tempLocation.name = locationDetails.name || false
    tempLocation.phone = locationDetails.formatted_phone_number || false
    tempLocation.photos =
      locationDetails?.photos?.length > 0
        ? [locationDetails.photos[0], locationDetails.photos[1], locationDetails.photos[2]].filter(
            photo => typeof photo !== 'undefined'
          )
        : false
    tempLocation.openingHours = locationDetails.opening_hours?.periods || false
    tempLocation.businessStatus = locationDetails.business_status || false
    tempLocation.website = locationDetails.website || false
    tempLocation.priceLevel = locationDetails.price_level >= 0 ? locationDetails.price_level : false
    const { lat, lng } = locationDetails.geometry.location
    tempLocation.lat = lat
    tempLocation.lng = lng
    tempLocation.viewport = locationDetails.geometry.viewport

    return tempLocation
  }
} */

/*
Maybe display a banner indicating the current zoom and the target (1)

Math.round(window.devicePixelRatio * 100)
$(window).resize(function () {
  // your code
}) */
