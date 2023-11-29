import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  IconButton,
  Typography,
  useMediaQuery,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreRounded'
import FavoriteBorder from '@mui/icons-material/FavoriteBorder'
import Favorite from '@mui/icons-material/Favorite'
import { makeStyles, useTheme } from '@mui/styles'
import React, { useContext, useState } from 'react'
import { SessionContext } from '../../contexts/session'
import { TripContext } from '../../contexts/trip'
import { FirebaseContext } from '../../contexts/firebase'

const useStyles = makeStyles(theme => ({
  accordion: {},
}))

const TripGuideFavorites = ({ currentFavorites }) => {
  const classes = useStyles()
  const theme = useTheme()
  const { firestore } = useContext(FirebaseContext)
  const { user } = useContext(SessionContext)
  const { tripData } = useContext(TripContext)
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))

  const [expanded, setExpanded] = useState('')
  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : '')
  }

  // const handleGuideLike = async (event, index) => {
  // event.stopPropagation()
  //   const destinationId = tripData?.destination?.place_id
  //   const userId = user.id

  //   const docRef = firestore.collection('inspirations').doc(destinationId)

  //   try {
  //     // Get the current document
  //     const doc = await docRef.get()

  //     // Check if document exists
  //     if (!doc.exists) {
  //       console.log('No such document!')
  //       return
  //     }

  //     // Get document data
  //     const data = doc.data()
  //     console.log('docData', data)
  //     const propertyValue = data[currentItem.model]

  //     // Check if content exists and the key is valid
  //     if (!propertyValue.content || !propertyValue.content[index]) {
  //       console.log('Content or key does not exist!')
  //       return
  //     }

  //     // Add userId to userLikes array
  //     if (!propertyValue.content[index].userLikes) {
  //       propertyValue.content[index].userLikes = []
  //     }
  //     if (!propertyValue.content[index].userLikes.includes(userId)) {
  //       propertyValue.content[index].userLikes.push(userId)
  //     } else {
  //       propertyValue.content[index].userLikes = propertyValue.content[index].userLikes.filter(
  //         currentUser => currentUser !== user.id
  //       )
  //     }

  //     // Update the document with the new data
  //     await docRef.set(data, { merge: true })

  //     console.log('userId added to userLikes')
  //   } catch (error) {
  //     console.error('Error updating document:', error)
  //   }
  // }

  return currentFavorites.map(({ argumentation, titre }, itemIndex) => (
    <>
      <Accordion
        className={classes.accordion}
        expanded={expanded === `panel${itemIndex}`}
        onChange={handleChange(`panel${itemIndex}`)}
        key={titre}
      >
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon
              sx={{
                color: 'rgba(79, 79, 79, 0.5)',
                fontSize: '40px',
                position: 'relative',
                display: matchesXs && 'none',
              }}
            />
          }
        >
          <Typography
            className={classes.accordionTypo}
            dangerouslySetInnerHTML={{ __html: titre }}
            sx={{
              color: expanded === `panel${itemIndex}` && theme.palette.primary.main,
              fontWeight: 500,
              [theme.breakpoints.down('sm')]: {
                maxWidth: 'calc(100% - 50px)',
              },
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              right: '60px',
              [theme.breakpoints.down('sm')]: {
                right: '10px',
              },
            }}
          >
            {/* <IconButton
              sx={{ padding: '0', width: '40px', height: '40px', borderRadius: '50px' }}
              onClick={event => handleGuideLike(event, titre, itemIndex)}
            >
              {currentItem?.content[itemIndex]?.userLikes?.includes(user.id) ? (
                <Favorite sx={{ color: theme.palette.secondary.main, fontSize: '25px' }} />
              ) : (
                <FavoriteBorder sx={{ color: theme.palette.secondary.main, fontSize: '25px' }} />
              )}
            </IconButton> */}
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ position: 'relative', padding: '10px 20px 40px' }}>
          <Typography
            className={classes.accordionTypo}
            dangerouslySetInnerHTML={{ __html: argumentation }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: '15px',
              right: '15px',
            }}
          >
            {/* {!currentItem?.content[itemIndex]?.userReports?.some(
              report => report.userId === user.id
            ) ? (
              <Button
                sx={{
                  fontSize: '10px',
                  color: theme.palette.grey['33'],
                  padding: '0',
                  textDecoration: 'underline',
                }}
                onClick={() => {
                  setAlertModalTitle(titre)
                  setalertModalIndex(itemIndex)
                  setOpenAlertModal(true)
                }}
              >
                Signaler ce contenu
              </Button>
            ) : (
              <Typography sx={{ fontSize: '10px', color: theme.palette.grey['33'] }}>
                Vous avez signalé ce contenu
              </Typography>
            )} */}
          </Box>
        </AccordionDetails>
      </Accordion>
    </>
  ))
}
export default TripGuideFavorites
