import React, { useContext } from 'react'
import { Box, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { TripContext } from '../../contexts/trip'

const useStyles = makeStyles(theme => ({
  mainHeaderContainer: {
    backgroundColor: theme.palette.primary.main,
    width: '100vw',
    height: '150px',
    zIndex: 10002,
    position: 'relative',
  },
}))
const MobileTripPageHeader = () => {
  const classes = useStyles()
  const { tripData } = useContext(TripContext)

  return (
    <Box className={classes.mainHeaderContainer}>
      <Typography>{tripData.title}</Typography>
    </Box>
  )
}
export default MobileTripPageHeader
