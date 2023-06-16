import React from 'react'
import IconButton from '@mui/material/IconButton'
import useTheme from '@mui/styles/useTheme'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'

import { EVENT_TYPES } from '../../helper/constants'
import { accomodation, explore, restaurant, transport } from '../../helper/icons'

const IconSlider = ({ eventType, selectedIcon, setSelectedIcon, propsClasses }) => {
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Box
      sx={{
        display: 'flex',
        marginBottom: matchesXs ? '0' : '30px',
        overflowX: 'scroll',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      }}
      className={propsClasses}
    >
      {eventType === EVENT_TYPES[0] &&
        accomodation.map(currentIcon => (
          <IconButton
            size="large"
            key={currentIcon.value}
            sx={{
              margin: '8px',
              boxShadow:
                selectedIcon === currentIcon.value ? '0' : '0px 1px 3px rgba(0, 0, 0, 0.1)',
              backgroundColor: `${
                selectedIcon === currentIcon.value
                  ? theme.palette.primary.main
                  : theme.palette.primary.contrastText
              }!important`,
            }}
            onClick={() => setSelectedIcon(currentIcon.value)}
          >
            <Box
              sx={{
                width: '20px',
                height: '20px',
                alignContent: 'center',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Box
                component="img"
                src={currentIcon.icon}
                alt={currentIcon.value}
                sx={{
                  filter:
                    selectedIcon === currentIcon.value
                      ? 'brightness(0) saturate(100%) invert(92%) sepia(95%) saturate(0%) hue-rotate(332deg) brightness(114%) contrast(100%)'
                      : '',
                }}
              />
            </Box>
          </IconButton>
        ))}
      {eventType === EVENT_TYPES[2] &&
        explore.map(currentIcon => (
          <IconButton
            size="large"
            key={currentIcon.value}
            sx={{
              margin: '8px',
              boxShadow:
                selectedIcon === currentIcon.value ? '0' : '0px 1px 3px rgba(0, 0, 0, 0.1)',
              backgroundColor: `${
                selectedIcon === currentIcon.value
                  ? theme.palette.primary.main
                  : theme.palette.primary.contrastText
              }!important`,
            }}
            onClick={() => setSelectedIcon(currentIcon.value)}
          >
            <Box
              sx={{
                width: '20px',
                height: '20px',
                alignContent: 'center',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Box
                component="img"
                src={currentIcon.icon}
                alt={currentIcon.value}
                sx={{
                  filter:
                    selectedIcon === currentIcon.value
                      ? 'brightness(0) saturate(100%) invert(92%) sepia(95%) saturate(0%) hue-rotate(332deg) brightness(114%) contrast(100%)'
                      : '',
                }}
              />
            </Box>
          </IconButton>
        ))}
      {eventType === EVENT_TYPES[3] &&
        transport.map(currentIcon => (
          <IconButton
            size="large"
            key={currentIcon.value}
            sx={{
              margin: '8px',
              boxShadow:
                selectedIcon === currentIcon.value ? '0' : '0px 1px 3px rgba(0, 0, 0, 0.1)',
              backgroundColor: `${
                selectedIcon === currentIcon.value
                  ? theme.palette.primary.main
                  : theme.palette.primary.contrastText
              }!important`,
            }}
            onClick={() => setSelectedIcon({ target: { value: currentIcon.value } })}
          >
            <Box
              sx={{
                width: '20px',
                height: '20px',
                alignContent: 'center',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Box
                component="img"
                src={currentIcon.icon}
                alt={currentIcon.value}
                sx={{
                  filter:
                    selectedIcon === currentIcon.value
                      ? 'brightness(0) saturate(100%) invert(92%) sepia(95%) saturate(0%) hue-rotate(332deg) brightness(114%) contrast(100%)'
                      : '',
                }}
              />
            </Box>
          </IconButton>
        ))}
      {eventType === EVENT_TYPES[4] &&
        restaurant.map(currentIcon => (
          <IconButton
            size="large"
            key={currentIcon.value}
            sx={{
              margin: '8px',
              boxShadow:
                selectedIcon === currentIcon.value ? '0' : '0px 1px 3px rgba(0, 0, 0, 0.1)',
              backgroundColor: `${
                selectedIcon === currentIcon.value
                  ? theme.palette.primary.main
                  : theme.palette.primary.contrastText
              }!important`,
            }}
            onClick={() => setSelectedIcon(currentIcon.value)}
          >
            <Box
              sx={{
                width: '20px',
                height: '20px',
                alignContent: 'center',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Box
                component="img"
                src={currentIcon.icon}
                alt={currentIcon.value}
                sx={{
                  filter:
                    selectedIcon === currentIcon.value
                      ? 'brightness(0) saturate(100%) invert(92%) sepia(95%) saturate(0%) hue-rotate(332deg) brightness(114%) contrast(100%)'
                      : '',
                }}
              />
            </Box>
          </IconButton>
        ))}
    </Box>
  )
}

export default IconSlider
