import React, { useContext, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { makeStyles } from '@mui/styles'

import TripGuideButton from '../../../components/atoms/TripGuideButton'
import { TripContext } from '../../../contexts/trip'
import TripGuideItem from '../../../components/TripGuideItem'

const useStyles = makeStyles(theme => ({
  mainContainer: {
    width: 'calc(100vw - 350px)',
    height: '100vh',
  },
  titleContainer: {
    height: '65px',
    display: 'flex',
    paddingLeft: '30px',
    paddingTop: '50px',
  },
  titleTypo: {
    color: theme.palette.grey['33'],
    fontSize: '28px',
    fontWeight: 700,
    lineHeight: '36px',
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
  const { tripData, tripGuideData } = useContext(TripContext)

  const [itemData, setItemData] = useState(null)
  const [currentSelectedButton, setCurrentSelectedButton] = useState(null)
  const [localItemData, setLocalItemData] = useState(itemData)

  useEffect(() => {
    setLocalItemData(itemData)
  }, [itemData])

  useEffect(() => {
    if (currentSelectedButton !== null) {
      const tempData = tripGuideData.find(data => data.model === currentSelectedButton)
      setItemData(tempData)
    }
  }, [currentSelectedButton])

  if (localItemData !== null) {
    return (
      <TripGuideItem
        currentItem={itemData}
        setCurrentSelectedButton={setCurrentSelectedButton}
        setItemData={setItemData}
      />
    )
  }

  return (
    <Box className={classes.mainContainer}>
      <Box className={classes.titleContainer}>
        <Typography
          className={classes.titleTypo}
        >{`Guide de voyage : ${tripData?.destination?.label}`}</Typography>
      </Box>
      <Box className={classes.tripGuideButtonsContainer}>
        {tripGuideData
          ?.filter(data => data.name)
          .map(singleData => (
            <TripGuideButton
              itemName={singleData?.name}
              logo={singleData?.logo}
              currentSelectedButton={currentSelectedButton}
              setCurrentSelectedButton={setCurrentSelectedButton}
              model={singleData?.model}
            />
          ))}
      </Box>
    </Box>
  )
}
export default TripGuide
