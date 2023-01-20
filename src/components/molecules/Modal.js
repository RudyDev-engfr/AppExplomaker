import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import makeStyles from '@mui/styles/makeStyles'
import Modal from '@mui/material/Modal'
import {
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { ArrowBackIos } from '@mui/icons-material'

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
    maxHeight: '90vh',
    paddingTop: '16px',
    [theme.breakpoints.down('sm')]: {
      minWidth: '100vw',
      maxHeight: 'unset',
      borderRadius: '30px 30px 0 0',
      top: '30px',
      left: '0',
      transform: 'unset',
      height: 'calc(100vh - 30px)',
      paddingTop: '0',
    },
  },
  iconBack: {
    transform: 'translate(5px ,0)',
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
  validation: {
    [theme.breakpoints.down('sm')]: {
      width: '100vw',
      position: 'absolute',
      left: '0',
      bottom: '0',
      paddingBottom: '10px',
      backgroundColor: theme.palette.secondary.contrastText,
    },
  },
  validationBtnContainer: {
    marginBottom: '40px',
    padding: '20px 32px 0',
    '& button': {
      padding: '24px 213px 14px',
      fontSize: '18px',
      borderRadius: '5px',
      fontWeight: '900',
      fontFamily: theme.typography.h1.fontFamily,
      letterSpacing: '3px',
    },
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      padding: '0 32px',
      marginBottom: '0',
      '& button': {
        padding: '17px 18.5px',
        fontSize: '20px',
        textTransform: 'unset',
        borderRadius: '10px',
      },
    },
  },
  modalContent: {
    padding: '0 32px',
    overflowY: 'auto',
  },
  noOverflowY: {
    overflowY: 'visible',
  },
  gradiantBackground: {
    [theme.breakpoints.up('sm')]: {
      minWidth: 600,
      height: '89px',
      position: 'fixed',
      bottom: '90px',
      background:
        'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.8) 50%, #FFFFFF 100%)',
    },
  },
}))

export default function SimpleModal({
  openModal,
  setOpenModal,
  title = 'Modification',
  modalName,
  modalBack = false,
  hasValidation = true,
  submitHandler,
  preventCloseOnSubmit = false,
  isValid = true,
  customHeader = false,
  children,
  hasNotOverflowY = false,
  contentMinHeight = false,
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

  const handleBack = () => {
    setIsOpen(false)
    setOpenModal('general')
  }

  const handleSubmit = event => {
    event.preventDefault()
    submitHandler()
    if (!preventCloseOnSubmit) {
      handleClose()
    }
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
      <Paper
        component="form"
        onSubmit={handleSubmit}
        className={classes.paper}
        elevation={5}
        sx={{
          gridTemplate: hasValidation
            ? '58px max-content 1fr 110px / 1fr'
            : '58px max-content 1fr / 1fr',
        }}
      >
        {customHeader || (
          <Box className={classes.boxTitle}>
            {modalBack && (
              <Box top="4%" left="2%">
                <IconButton onClick={handleBack} size="large">
                  <ArrowBackIos className={classes.iconBack} />
                </IconButton>
              </Box>
            )}
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
        )}
        <Box m={matchesXs ? '1.5rem 0 0' : '1.5rem 0'}>
          <Divider fullWidth />
        </Box>
        <Box
          className={clsx(classes.modalContent, { [classes.noOverflowY]: hasNotOverflowY })}
          sx={{
            minHeight: contentMinHeight || '',
            maxHeight: hasValidation ? 'calc(90vh - 212px)' : 'calc(90vh - 102px)',
            marginBottom: '40px',
            [theme.breakpoints.down('sm')]: {
              maxHeight: hasValidation ? 'calc(100vh - 30px - 70px - 102px)' : 'calc(100vh - 30px)',
              maxWidth: '100vw',
              marginBottom: '0',
            },
          }}
        >
          <Box
            sx={{
              [theme.breakpoints.down('sm')]: {
                maxWidth: '100vw',
                paddingBottom: '20px',
              },
            }}
          >
            {children}
          </Box>
          {matchesXs && hasValidation && (
            <Box className={classes.validation}>
              <Box pb="10px">
                <Divider fullWidth />
              </Box>
              <Box className={classes.validationBtnContainer}>
                <Button type="submit" variant="contained" color="primary" disabled={!isValid}>
                  Enregistrer
                </Button>
              </Box>
            </Box>
          )}
        </Box>
        {!matchesXs && (modalName === 'editEditors' || modalName === 'editTravelers') && (
          <Box className={classes.gradiantBackground} />
        )}
        {!matchesXs && hasValidation && (
          <Box className={classes.validation}>
            <Box className={classes.validationBtnContainer}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={!isValid}
              >
                Valider
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Modal>
  )
}
