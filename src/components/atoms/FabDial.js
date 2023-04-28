import React, { useState } from 'react'
import { Backdrop, SpeedDial, SpeedDialAction, useTheme } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import Box from '@mui/material/Box'
import SpeedDialIcon from '@mui/material/SpeedDialIcon'
import { useHistory } from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  tooltip: {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.ultraLight,
  },
  planningSpeedDial: {
    position: 'fixed',
    top: 'unset',
    right: '50%',
    bottom: '120px',
    transform: 'translateX(50%)',
    '& .MuiSpeedDialAction-staticTooltipLabel ': {
      color: theme.palette.grey[33],
      fontWeight: '500',
    },
  },
  speedDial: {
    position: 'fixed',
    right: '50%',
    bottom: '15px',
    transform: 'translateX(50%)',
    top: 'unset',
    '& button': {
      width: '50px',
      height: '50px',
      boxShadow: 'none',
    },
  },
}))

const FabDial = ({ actions, isPlanning = false, tripId }) => {
  const classes = useStyles()
  const theme = useTheme()
  const history = useHistory()
  const [open, setOpen] = useState(false)

  const handleOpen = (event, reason) => {
    if (reason === 'toggle') {
      setOpen(true)
    }
  }

  const handleClose = () => setOpen(false)

  return (
    <Box>
      <Backdrop open={open} sx={{ zIndex: '100' }} />
      <SpeedDial
        ariaLabel="Add event"
        className={isPlanning ? classes.planningSpeedDial : classes.speedDial}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
        FabProps={{
          sx: {
            backgroundColor: `${
              open ? theme.palette.secondary.likes : theme.palette.primary.main
            }!important`,
          },
        }}
      >
        {actions.map(action => (
          <SpeedDialAction
            icon={action.icon}
            key={action.name}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={() => {
              action.callback()
              history.push(`/tripPage/${tripId}/planning`)
            }}
            tooltipPlacement="right"
            FabProps={{ className: classes.tooltip }}
          />
        ))}
      </SpeedDial>
    </Box>
  )
}

export default FabDial
