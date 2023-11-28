import React, { useContext, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Accordion from '@mui/material/Accordion'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import AccordionSummary from '@mui/material/AccordionSummary'
import Typography from '@mui/material/Typography'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreRounded'
import FavoriteBorder from '@mui/icons-material/FavoriteBorder'
import Favorite from '@mui/icons-material/Favorite'
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded'
import { makeStyles, useTheme } from '@mui/styles'
import { useMediaQuery } from '@mui/material'

import arrowBack from '../images/icons/arrow-back.svg'

import { TripContext } from '../contexts/trip'
import MobileTripPageHeader from './molecules/MobileTripPageHeader'
import { SessionContext } from '../contexts/session'
import { FirebaseContext } from '../contexts/firebase'
import TripGuideAlertModal from './molecules/TripGuideAlertModal'

const useStyles = makeStyles(theme => ({
  mainContainer: {
    width: 'calc(100vw - 350px)',
    backgroundColor: theme.palette.grey.f7,
    padding: '30px',
    [theme.breakpoints.down('sm')]: {
      width: '100vw',
      padding: 'unset',
      paddingTop: '30px',
      paddingBottom: '90px',
    },
  },
  breadcrumbsContent: { margin: '20px 0' },
  breadcrumbsBtn: {
    textTransform: 'none',
    fontSize: '20px',
    fontWeight: 500,
    lineHeight: 1.5,
    color: theme.palette.grey['33'],
    padding: '0',
    minWidth: 'unset',
  },
  titleTypo: {
    color: theme.palette.grey['33'],
    fontSize: '20px',
    fontWeight: 700,
    lineHeight: '36px',
  },
  accordionContainer: {
    [theme.breakpoints.down('sm')]: {
      padding: '0',
    },
  },
}))
const TripGuideItem = ({ currentItem, setItemData }) => {
  const classes = useStyles()
  const theme = useTheme()
  const { tripId, itemName } = useParams()
  const history = useHistory()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  const { tripData, setCurrentSelectedTripGuideButton } = useContext(TripContext)
  const { user } = useContext(SessionContext)
  const { firestore, FieldValue } = useContext(FirebaseContext)

  const [openAlertModal, setOpenAlertModal] = useState(false)
  const [expanded, setExpanded] = useState('')
  const [alertModalTitle, setAlertModalTitle] = useState('')
  const [alertModalIndex, setalertModalIndex] = useState()

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : '')
  }

  const handleGuideLike = async (event, contentTitle, index) => {
    event.stopPropagation()
    const destinationId = tripData?.destination?.place_id
    const userId = user.id

    const docRef = firestore.collection('inspirations').doc(destinationId)

    try {
      // Get the current document
      const doc = await docRef.get()

      // Check if document exists
      if (!doc.exists) {
        console.log('No such document!')
        return
      }

      // Get document data
      const data = doc.data()
      console.log('docData', data)
      const propertyValue = data[currentItem.model]

      // Check if content exists and the key is valid
      if (!propertyValue.content || !propertyValue.content[index]) {
        console.log('Content or key does not exist!')
        return
      }

      // Add userId to userLikes array
      if (!propertyValue.content[index].userLikes) {
        propertyValue.content[index].userLikes = []
      }
      if (!propertyValue.content[index].userLikes.includes(userId)) {
        propertyValue.content[index].userLikes.push(userId)
      } else {
        propertyValue.content[index].userLikes = propertyValue.content[index].userLikes.filter(
          currentUser => currentUser !== user.id
        )
      }

      // Update the document with the new data
      await docRef.set(data, { merge: true })

      console.log('userId added to userLikes')
    } catch (error) {
      console.error('Error updating document:', error)
    }

    // const tempGuideLikes = user?.guideLikes || []
    // const currentItemTitle = `${contentTitle}___${currentItem.id}`
    // const finalGuideLikesArray = { guideLikes: [] }
    // if (tempGuideLikes.includes(currentItemTitle)) {
    //   finalGuideLikesArray.guideLikes = tempGuideLikes.filter(title => title !== currentItemTitle)
    // } else {
    //   tempGuideLikes.push(currentItemTitle)
    //   finalGuideLikesArray.guideLikes = tempGuideLikes
    // }

    // firestore
    //   .collection('users')
    //   .doc(user.id)
    //   .set({ ...finalGuideLikesArray }, { merge: true })
  }

  return (
    <>
      <Box className={classes.mainContainer}>
        {matchesXs && <MobileTripPageHeader />}
        <Box sx={{ display: 'flex', columnGap: '15px', margin: matchesXs && '30px 0' }}>
          <IconButton
            className={classes.mobileTitleIcon}
            size="large"
            onClick={() => {
              setItemData(null)
              setCurrentSelectedTripGuideButton(null)
              history.push(`/tripPage/${tripId}/tripguide`)
            }}
          >
            <img src={arrowBack} alt="" />
          </IconButton>
          <Typography className={classes.titleTypo}>
            {!matchesXs
              ? `Guide de voyage : ${tripData?.destination?.label}`
              : `${currentItem?.name}`}
          </Typography>
        </Box>
        {!matchesXs && (
          <Box sx={{ display: 'flex' }}>
            <Breadcrumbs
              className={classes.breadcrumbsContent}
              separator={<NavigateNextRoundedIcon sx={{ fontSize: '30px' }} />}
              aria-label="breadcrumb"
            >
              <Button
                className={classes.breadcrumbsBtn}
                onClick={() => {
                  setItemData(null)
                  setCurrentSelectedTripGuideButton(null)
                  history.push(`/tripPage/${tripId}/tripguide`)
                }}
              >
                {currentItem?.category}
              </Button>
              <Button className={classes.breadcrumbsBtn}>{currentItem?.name}</Button>
            </Breadcrumbs>
          </Box>
        )}
        <Box className={classes.accordionContainer}>
          {currentItem?.content?.map(({ argumentation, titre }, itemIndex) => (
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
                    <IconButton
                      sx={{ padding: '0', width: '40px', height: '40px', borderRadius: '50px' }}
                      onClick={event => handleGuideLike(event, titre, itemIndex)}
                    >
                      {currentItem?.content[itemIndex]?.userLikes?.includes(user.id) ? (
                        <Favorite sx={{ color: theme.palette.secondary.main, fontSize: '25px' }} />
                      ) : (
                        <FavoriteBorder
                          sx={{ color: theme.palette.secondary.main, fontSize: '25px' }}
                        />
                      )}
                    </IconButton>
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
                    {!currentItem?.content[itemIndex]?.userReports?.some(
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
                    )}
                  </Box>
                </AccordionDetails>
              </Accordion>
            </>
          ))}
        </Box>
      </Box>
      <TripGuideAlertModal
        openState={openAlertModal}
        setterOpenState={setOpenAlertModal}
        currentItem={currentItem}
        titre={alertModalTitle}
        itemIndex={alertModalIndex}
      />
    </>
  )
}
export default TripGuideItem
