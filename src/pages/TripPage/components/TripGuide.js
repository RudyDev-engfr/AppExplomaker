import React, { useContext, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
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
    padding: '30px',
    gridGap: '15px',
    display: 'flex',
    flexWrap: 'wrap',
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
  }, [currentSelectedTripGuideButton])

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
        {tripGuideData
          ?.filter(data => data?.name && data?.category)
          .sort((a, b) => {
            if (a.category < b.category) {
              return -1
            }
            if (a.category > b.category) {
              return 1
            }
            return 0
          })
          .reduce((acc, singleData) => {
            const lastCategory = acc[acc.length - 1]?.category
            if (lastCategory !== singleData.category) {
              acc.push({ category: singleData.category })
            }
            acc.push(singleData)
            return acc
          }, [])
          .map(item =>
            item?.name ? (
              <TripGuideButton
                key={item.name}
                itemName={item?.name}
                logo={item?.logo}
                currentSelectedTripGuideButton={currentSelectedTripGuideButton}
                setCurrentSelectedTripGuideButton={setCurrentSelectedTripGuideButton}
                model={item?.model}
              />
            ) : (
              <Box sx={{ width: '100%', marginTop: '30px', marginBottom: '5px' }}>
                <Typography sx={{ fontSize: '20px', fontWeight: 500 }} key={item.category}>
                  {item?.category.replace('_', '')}
                </Typography>
              </Box>
            )
          )}
      </Box>
    </Box>
  )
}
export default TripGuide
