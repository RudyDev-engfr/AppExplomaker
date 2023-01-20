import React, { useEffect, useState } from 'react'
import makeStyles from '@mui/styles/makeStyles'
import Modal from '@mui/material/Modal'
import { Box, Divider, IconButton, Paper, Typography, useMediaQuery, useTheme } from '@mui/material'

import cross from '../../images/icons/cross.svg'

const useStyles = makeStyles(theme => ({
  modalRoot: {
    [theme.breakpoints.down('sm')]: {
      zIndex: '10001',
    },
  },
  paper: {
    display: 'grid',
    alignItems: 'start',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 600,
    paddingTop: '16px',
    gridTemplate: '58px max-content 1fr / 1fr',
    [theme.breakpoints.down('sm')]: {
      minWidth: '100vw',
      borderRadius: '30px 30px 0 0',
      top: '30px',
      left: '0',
      transform: 'unset',
      paddingTop: '0',
    },
  },
  title: {
    fontWeight: '700',
    fontSize: '28px',
    margin: '5px 0 0 25px',
    [theme.breakpoints.down('sm')]: {
      margin: '0 0 0 25px',
      fontSize: '22px',
      fontWeight: '500',
      fontFamily: theme.typography.fontFamily,
    },
  },
  boxTitle: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 32px 0',
    [theme.breakpoints.down('sm')]: {
      padding: '25px 32px 0',
    },
  },
  modalContent: {
    padding: '0 32px',
    overflowY: 'auto',
  },
}))

export default function ProfileModal({
  openModal,
  setOpenModal,
  title = 'Modification',
  modalName,
  submitHandler,
  children,
  ...rest
}) {
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  const [isOpen, setIsOpen] = useState(false)

  const handleClose = () => {
    setIsOpen(false)
    setOpenModal('')
  }

  const handleSubmit = event => {
    event.preventDefault()
    submitHandler()
    handleClose()
  }

  useEffect(() => {
    if (openModal === modalName) {
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }, [openModal])

  return (
    <Modal
      classes={{ root: classes.modalRoot }}
      hideBackdrop={matchesXs}
      open={isOpen}
      onClose={handleClose}
      {...rest}
    >
      <Paper component="form" onSubmit={handleSubmit} className={classes.paper} elevation={5}>
        <Box className={classes.boxTitle}>
          <Box flexGrow={1}>
            <Typography className={classes.title} variant="h4" align="center">
              {title}
            </Typography>
          </Box>
          <Box>
            <IconButton onClick={handleClose} size="large">
              <img src={cross} alt="" />
            </IconButton>
          </Box>
        </Box>
        <Box m={matchesXs ? '1.5rem 0 0' : '0'}>
          <Divider fullWidth />
        </Box>
        <Box
          className={classes.modalContent}
          sx={{
            maxHeight: 'calc(90vh - 102px)',
            marginBottom: '16px',
            [theme.breakpoints.down('sm')]: {
              maxHeight: 'calc(100vh - 115px)',
              maxWidth: '100vw',
              marginBottom: '0',
            },
          }}
        >
          <Box
            sx={{
              [theme.breakpoints.down('sm')]: {
                maxWidth: '100vw',
                paddingBottom: '0',
              },
            }}
          >
            {children}
          </Box>
        </Box>
      </Paper>
    </Modal>
  )
}
