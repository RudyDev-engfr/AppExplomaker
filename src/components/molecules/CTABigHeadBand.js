import React, { useContext } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { makeStyles, useTheme } from '@mui/styles'
import { useHistory, useParams } from 'react-router-dom'

import ownerImage from '../../images/ctaDashboard/ownerCTA.png'
import { TripContext } from '../../contexts/trip'
import { openInNewTab } from '../../helper/functions'
import { SessionContext } from '../../contexts/session'
import { FirebaseContext } from '../../contexts/firebase'

const useStyles = makeStyles(theme => ({
  componentContainer: {
    width: '650px',
    height: '250px',
    position: 'relative',
    borderRadius: '20px',
    backgroundColor: '#FCE8EB',
    [theme.breakpoints.down('lg')]: {
      width: '100%',
    },
    [theme.breakpoints.down('xs')]: {
      width: 'calc(100vw - 60px)',
      backgroundColor: '#EFEFEF',
      minHeight: '520px',
    },
    '@media (min-width: 1800px)': {
      width: 'calc(66%)',
    },
  },
  imageContainer: {
    position: 'absolute',
    left: '0',
    top: '0',
    maxWidth: '270px',
  },
  textContainer: {
    position: 'absolute',
    left: '260px',
    top: '40px',
    [theme.breakpoints.down('xs')]: {
      top: '230px',
      left: '15px',
      width: 'calc(100% - 30px)',
    },
  },
  buttonContainer: {
    position: 'absolute',
    left: '260px',
    bottom: '20px',
    [theme.breakpoints.down('xs')]: {
      left: '50%',
      transform: 'translateX(-50%)',
      width: '200px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
  },
  img: {
    maxWidth: '260px',
    objectFit: 'cover',
    backgroundPosition: 'top-left',
    maxHeight: '100%',
    borderRadius: '20px',
  },
}))
const CTABigHeadBand = ({ isOwner }) => {
  const classes = useStyles()
  const theme = useTheme()
  // const history = useHistory()
  const { tripId } = useParams()
  const { firestore } = useContext(FirebaseContext)
  const { setCurrentActiveTab, setOpenModal } = useContext(TripContext)

  const handleTripUpdate = data => {
    firestore
      .collection('trips')
      .doc(tripId)
      .set(
        {
          ...data,
        },
        { merge: true }
      )
      .then(() => true)
  }

  return (
    <Box className={classes.componentContainer}>
      <Box className={classes.imageContainer}>
        <img src={ownerImage} alt="CTA_illustration" className={classes.img} />
      </Box>
      <Box className={classes.textContainer}>
        <Typography
          variant="h3"
          sx={{
            fontSize: '28px',
            lineHeight: 1.5,
            fontWeight: 700,
            [theme.breakpoints.down('sm')]: {
              fontSize: '25px',
              textAlign: 'center',
            },
            marginBottom: '10px',
          }}
        >
          {isOwner ? 'Commences ton aventure !' : 'Partage tes envies'}
        </Typography>
        <Typography
          sx={{ fontSize: '14px', [theme.breakpoints.down('sm')]: { textAlign: 'center' } }}
        >
          {isOwner
            ? 'Votre voyage commence maintenant. Renseignez les premiers détails : destination, date, participants'
            : 'Tu as une idée de ce que tu veux vivre lors de ce séjour ? Partage tes envies ici, discutez-en tous ensemble et laissez Explomaker personnaliser votre expérience'}
        </Typography>
      </Box>
      <Box className={classes.buttonContainer}>
        <Button
          variant="contained"
          sx={{
            padding: '15px 45px',
            borderRadius: '50px',
            marginRight: '20px',
            textDecoration: 'none',
            textTransform: 'none',
            [theme.breakpoints.down('xs')]: { marginRight: 'unset', width: '200px' },
          }}
          onClick={() => {
            if (isOwner) {
              handleTripUpdate({ hasHandledTrip: 'ok' })
              setOpenModal('general')
            } else {
              setCurrentActiveTab('envies')
            }
          }}
        >
          Démarrer
        </Button>
        <Button
          variant="text"
          sx={{
            textDecoration: 'none',
            textTransform: 'none',
            color: 'black',
            fontWeight: 600,
            marginTop: '10px',
          }}
          onClick={() => {
            openInNewTab('https://www.explomaker.fr/results')
          }}
        >
          Trouver une destination
        </Button>
      </Box>
    </Box>
  )
}
export default CTABigHeadBand
