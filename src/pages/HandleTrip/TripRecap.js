import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { makeStyles, useTheme } from '@mui/styles'
import { FileCopyOutlined } from '@mui/icons-material'
import { toast } from 'react-toastify'

import TripWrapper from './TripWrapper'
import { FirebaseContext } from '../../contexts/firebase'
import { SessionContext } from '../../contexts/session'
import { rCTFF } from '../../helper/functions'

import TripRecapCard from '../../components/molecules/TripRecapCard'

const useStyles = makeStyles(theme => ({
  btnsContainer: {
    [theme.breakpoints.down('sm')]: {
      position: 'fixed',
      bottom: '0',
      backgroundColor: 'white',
      padding: '15px 30px',
      marginLeft: '-30px',
      borderTop: 'thin solid #DFDFDF ',
      width: '100vw',
    },
  },
  btnNext: {
    [theme.breakpoints.down('sm')]: {
      padding: '17px 25px',
      fontSize: '20px',
      fontFamily: theme.typography.fontFamily,
      textTransform: 'none',
    },
  },
}))

const TripRecap = () => {
  const history = useHistory()
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  const { firestore } = useContext(FirebaseContext)
  const { user } = useContext(SessionContext)
  const [tripData, setTripData] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState(['', ''])
  const [link, setLink] = useState()

  useEffect(() => {
    if (user) {
      if (!user.lastCreatedTripId) {
        history.replace('/')
      }
      setLink(`https://${window.location.href.split('/')[2]}/join/${user.lastCreatedTripId}`)
      firestore
        .collection('trips')
        .doc(user.lastCreatedTripId)
        .onSnapshot(doc => {
          setTripData(doc.data())
        })
    }
  }, [user])

  useEffect(() => {
    if (tripData) {
      setIsLoading(false)
      let currentDateRange
      if (tripData.dateRange && tripData.dateRange[0] !== '' && tripData.dateRange[1] !== '') {
        currentDateRange = rCTFF(tripData.dateRange, 'dd LLL')
      }
      setDateRange(currentDateRange)
    }
  }, [tripData])

  return isLoading ? (
    <Typography variant="h2">Chargement...</Typography>
  ) : (
    <TripWrapper
      currentStep="7"
      title={matchesXs ? 'Super, ton séjour a bien été créé' : 'Création terminée'}
      subtitle={
        matchesXs
          ? 'Tu peux maintenant inviter tes compagnons de voyages à rejoindre ce séjour. Envoie leur le lien ci-dessous ! '
          : 'Tu peux maintenant inviter tes compagnons de voyages afin qu’ils puissent voir / editer ce séjour, et que vous puissiez échanger tous ensemble via le chat.'
      }
      backURL="/"
    >
      <Box
        display={matchesXs && 'flex'}
        alignItems={matchesXs && 'center'}
        justifyContent={matchesXs && 'center'}
      >
        <Box paddingTop={matchesXs && '15px'}>
          <Typography variant="h6">Obtenir le lien de partage</Typography>
        </Box>
        <Box display="flex" alignItems="center" mt={2}>
          {!matchesXs && (
            <Button
              variant="outlined"
              fullWidth
              onClick={() => {
                navigator.clipboard.writeText(link)
                toast.success('Lien copié !')
              }}
            >
              {link}
            </Button>
          )}
          <Box ml={2}>
            <IconButton
              onClick={() => {
                navigator.clipboard.writeText(link)
                toast.success('Lien copié !')
              }}
              size="large"
            >
              <FileCopyOutlined />
            </IconButton>
          </Box>
        </Box>
      </Box>
      <TripRecapCard
        tripData={tripData}
        dateRange={dateRange}
        onClick={() => history.push(`/tripPage/${user.lastCreatedTripId}`)}
      />
      {matchesXs && (
        <Box className={classes.btnsContainer}>
          <Button className={classes.btnNext} onClick={() => history.push('/')}>
            Retour à l’accueil
          </Button>
        </Box>
      )}
    </TripWrapper>
  )
}

export default TripRecap
