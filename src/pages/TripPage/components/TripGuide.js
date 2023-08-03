import React, { useContext, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { makeStyles, useTheme } from '@mui/styles'
import { useMediaQuery } from '@mui/material'

import TripGuideButton from '../../../components/atoms/TripGuideButton'
import { TripContext } from '../../../contexts/trip'
import TripGuideItem from '../../../components/TripGuideItem'
import MobileTripPageHeader from '../../../components/molecules/MobileTripPageHeader'

const useStyles = makeStyles(theme => ({
  mainContainer: {
    width: 'calc(100vw - 350px)',
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
      height: 'unset',
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
      paddingTop: 0,
    },
  },
}))
const TripGuide = () => {
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  const { tripData, tripGuideData } = useContext(TripContext)
  const {
    currentSelectedTripGuideButton,
    setCurrentSelectedTripGuideButton,
    itemData,
    setItemData,
  } = useContext(TripContext)

  const [localItemData, setLocalItemData] = useState(itemData)

  useEffect(() => {
    setLocalItemData(itemData)
  }, [itemData])

  useEffect(() => {
    if (currentSelectedTripGuideButton !== null) {
      const tempData = tripGuideData.find(data => data.model === currentSelectedTripGuideButton)
      setItemData(tempData)
    }
  }, [currentSelectedTripGuideButton, tripGuideData])

  if (localItemData !== null) {
    return (
      <TripGuideItem
        currentItem={itemData}
        setCurrentSelectedTripGuideButton={setCurrentSelectedTripGuideButton}
        setItemData={setItemData}
      />
    )
  }

  return (
    <Box className={classes.mainContainer}>
      {matchesXs && <MobileTripPageHeader />}
      <Box className={classes.titleContainer}>
        <Typography
          className={classes.titleTypo}
        >{`Guide de voyage : ${tripData?.destination?.label}`}</Typography>
      </Box>
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
          ).map(([category, items]) => (
            <Accordion
              key={category}
              sx={{
                width: 'calc(100vw - 350px)',
                // borderRadius: '20px',
                [theme.breakpoints.down('sm')]: { width: '100vw', padding: 0 },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{}} />}
                aria-controls="panel-content"
                id="panel-header"
              >
                <Typography sx={{ fontWeight: 600, fontSize: '22px', lineHeight: 1.5 }}>
                  {category.replace('_', '')}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
                  {items.map(item => (
                    <TripGuideButton
                      key={item.name}
                      itemName={item?.name}
                      logo={item?.logo}
                      currentSelectedTripGuideButton={currentSelectedTripGuideButton}
                      setCurrentSelectedTripGuideButton={setCurrentSelectedTripGuideButton}
                      model={item?.model}
                      item_picture={item?.item_picture}
                    />
                  ))}
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
      </Box>
    </Box>
  )
}
export default TripGuide
