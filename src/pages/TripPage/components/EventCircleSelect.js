import React from 'react'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import AirplanemodeActiveRoundedIcon from '@mui/icons-material/AirplanemodeActiveRounded'
import ExploreRoundedIcon from '@mui/icons-material/ExploreRounded'
import CommuteRoundedIcon from '@mui/icons-material/CommuteRounded'
import RestaurantMenuRoundedIcon from '@mui/icons-material/RestaurantMenuRounded'
import { Box, IconButton, Typography } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'

import { EVENT_TYPES } from '../../../helper/constants'

const eventTypes = [
  {
    value: EVENT_TYPES[2],
    icon: <ExploreRoundedIcon fontSize="large" />,
    label: 'Exploration',
  },
  {
    value: EVENT_TYPES[4],
    icon: <RestaurantMenuRoundedIcon fontSize="large" />,
    label: 'Restaurant',
  },
  {
    value: EVENT_TYPES[3],
    icon: <CommuteRoundedIcon fontSize="large" />,
    label: 'Transports',
  },
  {
    value: EVENT_TYPES[1],
    icon: <AirplanemodeActiveRoundedIcon fontSize="large" />,
    label: 'Vols',
  },
  { value: EVENT_TYPES[0], icon: <HomeRoundedIcon fontSize="large" />, label: 'Hébergement' },
]

const nbEventTypes = eventTypes.length
const hasMid = 0
const imagesOnCircle = nbEventTypes - hasMid
const tan = Math.tan(Math.PI / imagesOnCircle)

const useStyles = makeStyles(theme => ({
  container: {
    '--m': imagesOnCircle,
    '--tan': +tan.toFixed(2),
    '--d': '130px',
    '--rel': '.75',
    '--r': 'calc(.5 * (1 + var(--rel)) * var(--d) / var(--tan))',
    '--s': 'calc(2 * var(--r) + var(--d))',
    bottom: '2%',
    position: 'relative',
    width: 'var(--s)',
    height: 'var(--s)',
    transform: 'rotate(-18deg)',
    overflow: 'hidden',
  },
  box: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    margin: 'calc(-.5 * var(--d))',
    width: 'var(--d)',
    height: 'var(--d)',
    '--az': 'calc(var(--i) * 1turn / var(--m))',
    transform: `rotate(var(--az)) 
      translate(var(--r))
      rotate(calc(-1 * var(--az)))
      rotate(18deg)`,
  },
  button: {
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.primary.ultraLight,
    color: theme.palette.primary.ultraDark,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: 'white',
    },
  },
}))

const EventCircleSelect = ({ setEventType, setCurrentView }) => {
  const classes = useStyles()

  return (
    <Box className={classes.container}>
      {eventTypes.map((type, index) => (
        <Box
          key={type.label}
          style={index - hasMid >= 0 ? { '--i': index } : { transform: 'rotate(18deg)' }}
          className={classes.box}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          {type.icon && (
            <IconButton
              onClick={() => {
                setEventType(type.value)
                setCurrentView('creator')
              }}
              color="primary"
              className={classes.button}
              size="large"
            >
              {type.icon}
            </IconButton>
          )}
          <Typography
            variant={index - hasMid >= 0 ? 'body1' : 'h5'}
            align="center"
            color={index - hasMid >= 0 ? 'initial' : 'primary'}
          >
            {type.label}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}

export default EventCircleSelect
