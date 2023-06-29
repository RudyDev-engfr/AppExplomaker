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
  const [currentCategory, setCurrentCategory] = useState()

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
                currentSelectedButton={currentSelectedButton}
                setCurrentSelectedButton={setCurrentSelectedButton}
                model={item?.model}
              />
            ) : (
              <Box sx={{ width: '100%', marginBottom: '15px', marginTop: '15px' }}>
                <Typography sx={{ fontSize: '20px', fontWeight: 500 }} key={item.category}>
                  {item?.category}
                </Typography>
              </Box>
            )
          )}
      </Box>
    </Box>
  )
}
export default TripGuide
