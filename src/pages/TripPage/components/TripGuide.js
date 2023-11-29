import React, { useCallback, useContext, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { makeStyles, useTheme } from '@mui/styles'
import { useHistory, useLocation } from 'react-router-dom'
import { Button, useMediaQuery } from '@mui/material'
import { Favorite } from '@mui/icons-material'

import TripGuideButton from '../../../components/atoms/TripGuideButton'
import { TripContext } from '../../../contexts/trip'
import TripGuideItem from '../../../components/TripGuideItem'
import MobileTripPageHeader from '../../../components/molecules/MobileTripPageHeader'
import TripGuideFavorites from '../../../components/molecules/TripGuideFavorites'

const useStyles = makeStyles(theme => ({
  mainContainer: {
    width: 'calc(100vw - 350px)',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      width: '100vw',
      paddingBottom: '90px',
    },
  },
  titleContainer: {
    height: '65px',
    display: 'flex',
    paddingLeft: '30px',
    paddingTop: '50px',
    [theme.breakpoints.down('sm')]: {
      height: '200px',
      width: '100vw',
    },
  },
  titleTypo: {
    color: theme.palette.grey['33'],
    fontSize: '28px',
    fontWeight: 700,
    lineHeight: '36px',
    [theme.breakpoints.down('sm')]: {
      marginBottom: '30px',
      fontSize: '20px',
    },
  },
  tripGuideButtonsContainer: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    padding: '30px',
    paddingTop: '50px',
    [theme.breakpoints.down('sm')]: {
      padding: 0,
      paddingTop: 0,
    },
  },
}))
const TripGuide = () => {
  const classes = useStyles()
  const theme = useTheme()
  const location = useLocation()
  const history = useHistory()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  const {
    tripData,
    tripGuideData,
    setOpenModal,
    currentSelectedTripGuideButton,
    itemData,
    setItemData,
    tripGuideExpanded,
    setTripGuideExpanded,
    tripGuideFavoriteItems,
    setTripGuideFavoriteItems,
  } = useContext(TripContext)

  const [localItemData, setLocalItemData] = useState(itemData)

  const handleChange = useCallback(
    panel => (event, isExpanded) => {
      setTripGuideExpanded(isExpanded ? panel : '')
    },
    []
  )

  useEffect(() => {
    console.log('tripGuideData', tripGuideData)
    console.log('currentSelectedTRipGuideB', currentSelectedTripGuideButton)
    if (currentSelectedTripGuideButton !== null && tripGuideData !== null) {
      const tempData = tripGuideData.find(data => {
        console.log('data', data.model)
        return data.model === currentSelectedTripGuideButton
      })
      setItemData(tempData)
    }
  }, [currentSelectedTripGuideButton, tripGuideData])

  useEffect(() => {
    const travelersGroup = tripData.travelersDetails
      ?.filter(traveler => traveler?.id)
      ?.map(traveler => traveler.id)
    console.log('groupe de voyage', travelersGroup)
    const tempFavoritesData = tripGuideData?.map(data => data?.content)
    console.log('tempfavoritesdata', tempFavoritesData)
    const tempFavoriteDataFiltered = tempFavoritesData
      ?.filter(contentArray => contentArray?.length) // Filtrer pour s'assurer que le contenu n'est pas vide
      .flatMap(contentArray =>
        contentArray.filter(content =>
          content?.userLikes?.some(userLike => travelersGroup.includes(userLike))
        )
      )
    console.log('tempFavoritesDataFiltered', tempFavoriteDataFiltered)
    setTripGuideFavoriteItems(tempFavoriteDataFiltered)
  }, [tripGuideData])

  useEffect(() => {
    console.log('favoris des gens', tripGuideFavoriteItems)
  }, [tripGuideFavoriteItems])

  useEffect(() => {
    console.log('itemData', itemData)
    setLocalItemData(itemData)
  }, [itemData, tripGuideData])

  useEffect(() => {
    console.log('montremoilebutton', currentSelectedTripGuideButton)
  }, [currentSelectedTripGuideButton])

  if (localItemData !== null) {
    return <TripGuideItem currentItem={itemData} setItemData={setItemData} />
  }

  return (
    <Box className={classes.mainContainer}>
      {matchesXs && <MobileTripPageHeader />}
      <Box className={classes.titleContainer}>
        <Typography className={classes.titleTypo}>
          {tripData?.destination?.label && `Guide de voyage : ${tripData?.destination?.label}`}
        </Typography>
      </Box>
      {!tripData?.destination?.label && (
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            [theme.breakpoints.down('xs')]: {
              left: 'unset',
              top: 'unset',
              transform: 'none',
              padding: '0 30px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            },
          }}
        >
          <Typography sx={{ [theme.breakpoints.down('xs')]: { textAlign: 'center' } }}>
            Une destination doit être renseignée dans le séjour.
          </Typography>
          <Button
            variant="text"
            onClick={() => setOpenModal('editDestination')}
            sx={{ textTransform: 'none', textDecoration: 'outlined' }}
          >
            Choisir une destination
          </Button>
        </Box>
      )}
      {tripGuideFavoriteItems?.length > 0 && (
        <Accordion
          expanded
          sx={{
            width: 'calc(100vw - 350px)',
            // borderRadius: '20px',
            [theme.breakpoints.down('sm')]: { width: '100vw', padding: 0 },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{}} />}
            aria-controls="panel-content"
            id="panel-0"
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Favorite sx={{ color: theme.palette.primary.main, marginRight: '15px' }} />
              <Typography sx={{ fontWeight: 600, fontSize: '22px', lineHeight: 1.5 }}>
                Favoris
              </Typography>
            </Box>
          </AccordionSummary>
          <TripGuideFavorites currentFavorites={tripGuideFavoriteItems} />
        </Accordion>
      )}
      <Box className={classes.tripGuideButtonsContainer}>
        {tripGuideData?.length > 1 &&
          Object.entries(
            tripGuideData
              ?.filter(data => data?.name && data?.category)
              ?.sort((a, b) => (a.category < b.category ? -1 : a.category > b.category ? 1 : 0))
              ?.reduce((acc, singleData) => {
                if (!acc[singleData.category]) {
                  acc[singleData.category] = []
                }
                acc[singleData.category].push(singleData)
                return acc
              }, {})
          ).map(([category, items], index) => (
            <>
              <Accordion
                key={category}
                expanded={tripGuideExpanded === `panel${category}`}
                onChange={handleChange(`panel${category}`)}
                sx={{
                  width: 'calc(100vw - 350px)',
                  // borderRadius: '20px',
                  [theme.breakpoints.down('sm')]: { width: '100vw', padding: 0 },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{}} />}
                  aria-controls="panel-content"
                  id={`panel${category}`}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: '22px', lineHeight: 1.5 }}>
                    {category.replace('_', '')}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'flex-start',
                      gridGap: '15px',
                    }}
                  >
                    {items.map(item => (
                      <TripGuideButton
                        key={item.name}
                        itemName={item?.name}
                        model={item?.model}
                        item_picture={item?.item_picture}
                      />
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>
            </>
          ))}
      </Box>
    </Box>
  )
}
export default TripGuide
