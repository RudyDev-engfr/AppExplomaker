import React from 'react'
import ArrowRightAlt from '@mui/icons-material/ArrowRightAlt'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import makeStyles from '@mui/styles/makeStyles'

const useStyles = makeStyles(theme => ({
  buttonsCountryTiles: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'space-between',
    top: '-65px',
    left: '80%',
    zIndex: '3',
    width: '155px',
  },
  carouselArrow: {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.ultraLight,
    borderRadius: '5px',
    width: '70px',
    height: '45px',
    '&:hover': {
      backgroundColor: theme.palette.primary.ultraLight,
    },
  },
}))

const TrendingDestinationsGroupButton = ({ next, previous }) => {
  const classes = useStyles()
  return (
    <Box className={classes.buttonsCountryTiles}>
      <Button className={classes.carouselArrow} onClick={() => previous()}>
        <ArrowRightAlt style={{ transform: 'rotate(180deg)' }} fontSize="large" />
      </Button>
      <Button className={classes.carouselArrow} onClick={() => next()}>
        <ArrowRightAlt fontSize="large" />
      </Button>
    </Box>
  )
}
export default TrendingDestinationsGroupButton
