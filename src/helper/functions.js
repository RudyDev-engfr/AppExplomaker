import {
  addMinutes,
  addHours,
  format,
  parseISO,
  subMinutes,
  subHours,
  intervalToDuration,
} from 'date-fns'
import frLocale from 'date-fns/locale/fr'
import parse from 'date-fns/parse'

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

export function dateToString(date) {
  const tempDate = date
  return format(tempDate, 'yyyy-MM-dd', { locale: frLocale })
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
      return stringToDate(event.arrivalDateTime, 'yyyy-MM-dd HH:mm')
    case EVENT_TYPES[1]:
      return stringToDate(event.flights[0].date, 'yyyy-MM-dd')
    case EVENT_TYPES[2]:
      return stringToDate(event.startTime, 'yyyy-MM-dd HH:mm')
    case EVENT_TYPES[3]:
      return stringToDate(event.transports[0].startDateTime, 'yyyy-MM-dd HH:mm')
    case EVENT_TYPES[4]:
      return stringToDate(event.startTime, 'yyyy-MM-dd HH:mm')
  }
}

export const applyTimezoneOffsetFromAmadeus = (date, timezoneOffsetFromAmadeus) => {
  let tempDate = rCTFF(date)
  const offset = parseInt(timezoneOffsetFromAmadeus.substr(0, 3), 10) * 60
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
