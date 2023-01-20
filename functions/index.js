/* eslint-disable no-else-return */
const functions = require('firebase-functions')
const admin = require('firebase-admin')
const fetch = require('node-fetch')
const cors = require('cors')({ origin: true })

admin.initializeApp()

/**
 * Get the value of a querystring
 * @param  {String} field The field to get the value of
 * @param  {String} url   The URL to get the value from
 * @return {String}       The field value
 */
const getQueryString = (field, url) => {
  const reg = new RegExp(`[?&]${field}=([^&#]*)`, 'i')
  const string = reg.exec(url)
  return string ? string[1] : null
}

function arrayShuffle(array) {
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

exports.checkFlightNumber = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    if (request.method === 'OPTIONS') {
      response.end()
    } else {
      const { carrierCode, flightNumber, departureDate } = request.body

      const urlencoded = new URLSearchParams()
      urlencoded.append('client_id', ' tmCv9VmVoupRsX1z8mfMAYqz8TzBlMd1')
      urlencoded.append('client_secret', 'ACGgSJgCHAU1LOGH')
      urlencoded.append('grant_type', 'client_credentials')

      fetch('https://api.amadeus.com/v1/security/oauth2/token', {
        method: 'POST',
        body: urlencoded,
        redirect: 'follow',
      })
        .then(fetchResponse => fetchResponse.text())
        .then(result => {
          const JWT = JSON.parse(result).access_token
          const nextRequestOptions = {
            headers: {
              Authorization: `Bearer ${JWT}`,
            },
            method: 'GET',
            redirect: 'follow',
          }

          fetch(
            `https://api.amadeus.com/v2/schedule/flights?carrierCode=${carrierCode.toUpperCase()}&flightNumber=${flightNumber}&scheduledDepartureDate=${departureDate}`,
            nextRequestOptions
          )
            .then(nextResponse => nextResponse.text())
            .then(results => {
              const parsedResults = JSON.parse(results).data[0]
              if (typeof parsedResults.flightPoints !== 'undefined') {
                const airportsIataCodes = []
                const legs = []
                const departureDateTime = parsedResults.flightPoints[0].departure.timings[0].value
                const arrivalDateTime = parsedResults.flightPoints[1].arrival.timings[0].value
                parsedResults.legs.forEach(leg => {
                  const tempDuration = {}
                  airportsIataCodes.push(leg.boardPointIataCode)
                  airportsIataCodes.push(leg.offPointIataCode)
                  if (
                    leg.scheduledLegDuration.includes('M') &&
                    leg.scheduledLegDuration.includes('H')
                  ) {
                    leg.scheduledLegDuration
                      .substring(2)
                      .substring(0, leg.scheduledLegDuration.length - 3)
                      .split('H')
                      .forEach((unit, unitIndex) => {
                        if (unitIndex === 0) {
                          tempDuration.hours = parseInt(unit, 10)
                        }
                        if (unitIndex === 1) {
                          tempDuration.minutes = parseInt(unit, 10)
                        }
                      })
                    legs.push(tempDuration)
                  } else if (
                    leg.scheduledLegDuration.includes('M') &&
                    !leg.scheduledLegDuration.includes('H')
                  ) {
                    legs.push({
                      minutes: parseInt(
                        leg.scheduledLegDuration
                          .substring(2)
                          .substring(0, leg.scheduledLegDuration.length - 3),
                        10
                      ),
                    })
                  } else if (
                    leg.scheduledLegDuration.includes('H') &&
                    !leg.scheduledLegDuration.includes('M')
                  ) {
                    legs.push({
                      hours: parseInt(
                        leg.scheduledLegDuration
                          .substring(2)
                          .substring(0, leg.scheduledLegDuration.length - 3),
                        10
                      ),
                    })
                  }
                })

                const airportPromises = []
                airportsIataCodes
                  .filter((iataCode, index) => airportsIataCodes.indexOf(iataCode) === index)
                  .map(iataCode =>
                    airportPromises.push(
                      fetch(
                        `https://api.amadeus.com/v1/reference-data/locations?subType=AIRPORT&keyword=${iataCode}`,
                        nextRequestOptions
                      )
                    )
                  )
                Promise.all(airportPromises).then(datas => {
                  const textPromises = []
                  datas.forEach(data => {
                    textPromises.push(data.text())
                  })
                  Promise.all(textPromises).then(textData => {
                    const airports = textData.map(currentData => {
                      const parsedData = JSON.parse(currentData)
                      const currentIataCode = getQueryString('keyword', parsedData.meta.links.self)
                      const currentParsedData = parsedData.data.filter(
                        airport => airport.iataCode === currentIataCode
                      )[0]
                      return {
                        label: currentParsedData.name,
                        geocode: currentParsedData.geoCode,
                        timeZoneOffset: currentParsedData.timeZoneOffset,
                        iataCode: currentIataCode,
                      }
                    })
                    response.status(200).send(
                      JSON.stringify({
                        airports,
                        timings: [departureDateTime, arrivalDateTime],
                        legs,
                      })
                    )
                  })
                })
              } else {
                response.status(404).send(JSON.stringify({ error: 'No data' }))
              }
            })
            .catch(error => {
              // eslint-disable-next-line no-console
              console.error('error', error)
              response.status(400).send(JSON.stringify({ error }))
            })
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.error('error', error)
          response.status(400).send(JSON.stringify({ error }))
        })
    }
  })
})

exports.createUser = functions.firestore.document('users/{userId}').onCreate(snap =>
  snap.ref.set(
    {
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
      lastSeenAt: admin.firestore.Timestamp.now(),
    },
    { merge: true }
  )
)

exports.onUserStatusChanged = functions.database
  .ref('/status/{userId}') // Reference to the Firebase RealTime database key
  .onUpdate((change, context) => {
    const usersRef = admin.firestore().collection('/users') // Create a reference to the Firestore Collection
    return change.after.ref
      .get('value')
      .then(statusSnapshot => statusSnapshot.val()) // Get the latest value from the Firebase Realtime database
      .then(status => {
        // check if the value is 'offline'
        if (status === 'offline') {
          // Set the Firestore's document's online value to false
          usersRef.doc(context.params.userId).set(
            {
              online: false,
              lastSeenAt: admin.firestore.Timestamp.now(),
            },
            { merge: true }
          )
        }
      })
  })

exports.updateTrip = functions.firestore.document('trips/{tripId}').onUpdate(change => {
  const previousValue = change.before.data()
  const newValue = change.after.data()

  const previousDestination = previousValue?.destination
  const newDestination = newValue?.destination

  if (!(previousDestination?.place_id === newDestination?.place_id)) {
    admin
      .database()
      .ref('content/spots')
      .orderByChild('gps/google_place_id')
      .equalTo(newDestination?.place_id)
      .on('value', snapshot => {
        if (snapshot.exists()) {
          const spotDoc = snapshot.val()
          const currentDoc = spotDoc[Object.keys(spotDoc)[0]]
          if (currentDoc?.picture_slider) {
            const spotImages = currentDoc.picture_slider.map(({ src, title }) => ({
              src: `https://storage.googleapis.com/stateless-www-explomaker-fr/${src.original}`,
              title,
            }))
            return change.after.ref.set(
              {
                mainPicture: arrayShuffle(spotImages)[0]?.src,
              },
              { merge: true }
            )
          } else {
            return change.after.ref.set(
              {
                mainPicture: '',
              },
              { merge: true }
            )
          }
        } else {
          return change.after.ref.set(
            {
              mainPicture: '',
            },
            { merge: true }
          )
        }
      })
  } else {
    return null
  }
})
