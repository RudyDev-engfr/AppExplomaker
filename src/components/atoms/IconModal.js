import React, { useEffect, useState } from 'react'
import { makeStyles } from '@mui/styles'
import MuiModal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import { Fade, useTheme } from '@mui/material'
import clsx from 'clsx'

import { EVENT_TYPES } from '../../helper/constants'
import findIcon, { accomodation, explore, restaurant, transport } from '../../helper/icons'

const useStyles = makeStyles(theme => ({
  iconSelector: {
    color: theme.palette.vertclair.main,
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      color: theme.palette.primary.main,
      backgroundColor: theme.palette.vertclair.main,
    },
    [theme.breakpoints.down('sm')]: {
      marginBottom: '30px',
    },
  },
  tooltip: {
    backgroundColor: theme.palette.primary.main,
    borderRadius: '5px',
  },
  arrow: {
    color: theme.palette.primary.main,
  },
}))

const IconModal = ({
  openIconModal,
  eventType,
  selectedIcon,
  setSelectedIcon,
  btnClasses,
  modalClasses,
  open,
  onClose,
}) => {
  const classes = useStyles()
  const theme = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (open) {
      setIsOpen(true)
    }
  }, [open])

  const handleClose = () => {
    setIsOpen(false)
    onClose()
  }

  return (
    <>
      <Tooltip
        placement="top"
        title="Icône"
        arrow
        classes={{ tooltip: classes.tooltip, arrow: classes.arrow }}
        TransitionComponent={Fade}
      >
        <IconButton
          className={clsx(classes.iconSelector, btnClasses)}
          size="large"
          onClick={() => openIconModal()}
          sx={{
            boxShadow: '0',
            backgroundColor: `${theme.palette.primary.main}!important`,
            padding: '15px',
            placeSelf: 'self-start center',
          }}
        >
          <Box
            sx={{
              width: '24px',
              height: '24px',
              alignContent: 'center',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Box
              component="img"
              src={findIcon(selectedIcon, eventType)}
              sx={{
                filter:
                  'brightness(0) saturate(100%) invert(92%) sepia(95%) saturate(0%) hue-rotate(332deg) brightness(114%) contrast(100%)',
              }}
            />
          </Box>
        </IconButton>
      </Tooltip>
      <MuiModal open={isOpen} onClose={handleClose}>
        <Paper
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: theme.palette.secondary.contrastText,
            boxShadow: 24,
            p: 3,
          }}
          className={modalClasses}
        >
          <Typography
            variant="h3"
            sx={{
              fontSize: '25px',
              fontWeight: '500',
              lineHeight: '32px',
              textAlign: 'center',
              marginBottom: '30px',
            }}
          >
            Choisissez une icône
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
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
                  onClick={() => {
                    setSelectedIcon(currentIcon.value)
                    handleClose()
                  }}
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
                  onClick={() => {
                    setSelectedIcon(currentIcon.value)
                    handleClose()
                  }}
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
                  onClick={() => {
                    setSelectedIcon({ target: { value: currentIcon.value } }, 'icon') // Based on handleChange from NewTransport
                    handleClose()
                  }}
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
                  onClick={() => {
                    setSelectedIcon(currentIcon.value)
                    handleClose()
                  }}
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
        </Paper>
      </MuiModal>
    </>
  )
}
export default IconModal
