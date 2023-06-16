/* eslint-disable default-case */
import React, { useEffect, useState } from 'react'
import { makeStyles, useTheme } from '@mui/styles'
import Box from '@mui/material/Box'

import findIcon from '../../../helper/icons'

const useStyles = makeStyles(theme => ({
  container: {
    width: '60px',
    height: '60px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: theme.palette.primary.main,
    borderRadius: '10px',
  },
  icon: {
    alignContent: 'center',
    display: 'flex',
    justifyContent: 'center',
    filter:
      'brightness(0) saturate(100%) invert(92%) sepia(95%) saturate(0%) hue-rotate(332deg) brightness(114%) contrast(100%)',
  },
  photo: {
    borderRadius: '10px',
    objectFit: 'cover',
    objectPosition: '50% 50%',
  },
}))

const PlanningCardIcon = ({ icon, eventType, size = '30px', photo = false }) => {
  const classes = useStyles()

  const [currentIcon, setCurrentIcon] = useState()

  useEffect(() => {
    if (typeof eventType !== 'undefined') {
      setCurrentIcon(findIcon(icon, eventType))
    }
  }, [eventType])

  return (
    <Box className={classes.container}>
      <Box
        component="img"
        src={photo || currentIcon}
        alt={icon}
        className={photo ? classes.photo : classes.icon}
        sx={{
          width: photo ? '100%' : size,
          height: photo ? '100%' : size,
        }}
      />
    </Box>
  )
}

export default PlanningCardIcon
