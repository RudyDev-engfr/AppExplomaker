import React from 'react'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

import makeStyles from '@mui/styles/makeStyles'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'

import EventCircleSelect from './EventCircleSelect'

const useStyles = makeStyles({
  paperAddEvent: {
    gridArea: 'previewArea',
    margin: '20px 20px 0',
    borderRadius: '10px 10px 0 0',
    display: 'grid',
    gridTemplate: `auto
                  1fr
                  / 1fr`,
    placeItems: 'center',
  },
  absoluteDivider: {
    bottom: '-1px',
  },
})

const EventAdd = ({ setEventType, setCurrentView }) => {
  const classes = useStyles()

  return (
    <Paper className={classes.paperAddEvent}>
      <Box
        width="100%"
        position="relative"
        minHeight="80px"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="h5" align="center">
          <Box fontWeight="bold" component="span">
            Ajouter un événement
          </Box>
        </Typography>
        <Box position="absolute" top="20.5%" right="10px">
          <IconButton
            aria-label="delete"
            edge="end"
            onClick={() => setCurrentView('planning')}
            size="large"
          >
            <CloseRoundedIcon />
          </IconButton>
        </Box>
        <Divider absolute className={classes.absoluteDivider} />
      </Box>
      <EventCircleSelect setEventType={setEventType} setCurrentView={setCurrentView} />
    </Paper>
  )
}

export default EventAdd
