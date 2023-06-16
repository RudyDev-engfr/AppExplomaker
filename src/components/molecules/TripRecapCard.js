import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import makeStyles from '@mui/styles/makeStyles'
import { DateRange, Room } from '@mui/icons-material'

import CustomAvatar from '../atoms/CustomAvatar'

import kenya from '../../images/trip/Kenya 1.png'

const useStyles = makeStyles(theme => ({
  image: {
    height: '350px',
    width: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    borderRadius: '20px',
    position: 'relative',
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: {
      height: '200px',
    },
  },
  avatars: {
    position: 'absolute',
    bottom: '20px',
    right: '20px',
  },
  icons: {
    marginRight: theme.spacing(1),
  },
  recapTitle: {
    fontSize: '44px',
    fontFamily: theme.typography.h1.fontFamily,
    fontWeight: '500',
    [theme.breakpoints.down('sm')]: {
      fontFamily: theme.typography.fontFamily,
      fontSize: '20px',
      fontWeight: '500',
    },
  },
  recapDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  recapBtn: {
    width: '40%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginTop: '15px',
    },
  },
  recapPaper: {
    [theme.breakpoints.down('sm')]: {
      marginBottom: '120px',
    },
  },
}))

const TripRecapCard = ({ tripData, dateRange, onClick, isJoin = false, hasClicked }) => {
  const classes = useStyles()

  return (
    <Paper elevation={2} className={classes.recapPaper}>
      <Box p={4} my={4}>
        <Box
          className={classes.image}
          sx={{
            backgroundImage: `url('${tripData?.mainPicture || kenya}')`,
          }}
        >
          <CustomAvatar
            peopleIds={tripData.travelersDetails
              .filter(traveler => typeof traveler.id !== 'undefined')
              .map(traveler => traveler.id)}
            propsClasses={classes.avatars}
          />
        </Box>
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography className={classes.recapTitle}>{tripData.title}</Typography>
          </Box>
          <Box className={classes.recapDetails}>
            <Box>
              <Box display="flex" alignItems="center" mb={2}>
                <DateRange color="primary" fontSize="small" className={classes.icons} />
                <Typography>
                  {dateRange ? `${dateRange[0]} - ${dateRange[1]}` : 'À définir'}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <Room color="primary" fontSize="small" className={classes.icons} />
                <Typography>
                  {tripData.noDestination ? 'Je ne sais pas encore' : tripData.destination.label}
                </Typography>
              </Box>
            </Box>
            <Button
              color="primary"
              variant="contained"
              size="large"
              onClick={onClick}
              className={classes.recapBtn}
              disabled={hasClicked}
            >
              {isJoin ? 'Confirmer' : 'Voir le séjour'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  )
}

export default TripRecapCard
