import React from 'react'
import ButtonBase from '@mui/material/ButtonBase'
import Box from '@mui/material/Box'
import makeStyles from '@mui/styles/makeStyles'
import clsx from 'clsx'

const useStyles = makeStyles(theme => ({
  indicatorsCountryGallery: {
    height: '3px',
    width: '47px',
    backgroundColor: theme.palette.primary.ultraLight,
  },
  activeColor: {
    backgroundColor: theme.palette.primary.main,
  },
  trendingDotBox: {
    display: 'flex',
    flexWrap: 'wrap',
    mt: 5,
    transform: 'translateY(50px)',
    zIndex: '10',
    alignSelf: 'flex-start',
  },
}))
const TrendingDestinationsDotBox = ({ carouselArray, onClick, ...rest }) => {
  const { active } = rest
  // onMove means if dragging or swiping in progress.
  // active is provided by this lib for checking if the item is active or not.
  const classes = useStyles()
  return (
    <Box className={classes.trendingDotBox}>
      <Box
        component={ButtonBase}
        onClick={() => onClick()}
        height="13px"
        mx={1}
        borderRadius="20px"
      >
        <Box
          className={clsx(classes.indicatorsCountryGallery, {
            [classes.activeColor]: active,
          })}
        />
      </Box>
    </Box>
  )
}
export default TrendingDestinationsDotBox
