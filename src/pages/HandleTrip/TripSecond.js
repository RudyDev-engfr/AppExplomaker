import React, { useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import { makeStyles, useTheme } from '@mui/styles'

import { NewTripContext } from '../../contexts/newTrip'
import TripWrapper from './TripWrapper'
import DateRangesBar from '../../components/atoms/DateRangesBar'
import DateRangePicker from '../../components/atoms/DateRangePicker'

const useStyles = makeStyles(theme => ({
  btnsContainer: {
    display: 'grid',
    gridTemplate: '1fr / 1fr 1fr',
    gap: '40px',
    alignItems: 'center',
    position: 'fixed',
    bottom: '0',
    paddingBottom: '106px',
    [theme.breakpoints.down('sm')]: {
      gridAutoFlow: 'dense',
      backgroundColor: 'white',
      padding: '15px 30px',
      borderTop: 'thin solid #DFDFDF ',
      width: '100vw',
      marginLeft: '-30px',
      '& > button:nth-child(1)': {
        gridColumn: '2 / 3',
      },
      '& > button:nth-child(2)': {
        gridColumn: '1 / 2',
      },
    },
  },
  btnNext: {
    padding: '24px 61px',
    fontSize: '18px',
    fontWeight: '900',
    fontFamily: theme.typography.h1.fontFamily,
    [theme.breakpoints.down('sm')]: {
      padding: '17px 25px',
      fontSize: '20px',
      fontFamily: theme.typography.fontFamily,
      fontWeight: '500',
      textTransform: 'capitalize',
    },
  },
}))

const TripSecond = () => {
  const history = useHistory()
  const classes = useStyles()
  const { newTrip, setNewTrip, newTripSpot } = useContext(NewTripContext)

  const handleDatePicker = value => {
    setNewTrip({ ...newTrip, dateRange: [...value] })
  }

  return (
    <TripWrapper
      currentStep="2"
      title="Tu pars quand ?"
      subtitle="Entre tes dates, et nous te diront si elles sont appropriées à la destination que tu as choisie !"
      backURL="/newtrip/tripFirst"
    >
      <DateRangePicker value={newTrip.dateRange} setter={handleDatePicker} />
      {false && (
        <>
          <Box>
            {/* TODO Conditional on daterange */}
            <Typography variant="h5">Excellente période ✨</Typography>
            <Typography>L&apos;été au Kenya</Typography>
            <Typography variant="body2">
              la majeure partie du pays et de toutes les activités qu&apos;il a à offrir. La Côte et
              le Nord-Est se visitent idéalement à cette période. C&apos;est également le moment de
              faire de la plongée, se baigner et tout simplement faire du farniente. Enfin, vous
              aurez tout le loisir d&apos;observer le Big 5 lors d’un safari inoubliable.
            </Typography>
          </Box>
          <Box>
            {/* TODO Conditional on daterange */}
            <Typography>L&apos;été au Kenya</Typography>
            <Typography variant="body2">
              C&apos;est la période où vous pourrez profiter de la majeure partie du pays et de
              toutes les activités qu&apos;il a à offrir. La Côte et le Nord-Est se visitent
              idéalement à cette période. C&apos;est également le moment de faire de la plongée, se
              baigner et tout simplement faire du farniente. Enfin, vous aurez tout le loisir
              d&apos;observer le Big 5 lors d’un safari inoubliable.
            </Typography>
          </Box>
          <Box>
            {/* TODO Conditional on daterange */}
            <Typography variant="body2">
              Attention ! Le nombre de jours ne correspond pas au montant payé. Pour changer la
              durée de ton séjour, fais-en la demande à ton conseiller ExploMaker
            </Typography>
          </Box>
        </>
      )}
      {!newTrip.noDestination && newTripSpot?.periode_visite && (
        <DateRangesBar
          destination={newTripSpot ? newTripSpot.title : newTrip.destination.label}
          bestPeriods={newTripSpot.periode_visite}
          linkWord={newTripSpot.link_words[1]}
        />
      )}
      <Box className={classes.btnsContainer}>
        <Button
          className={classes.btnNext}
          color="primary"
          variant="contained"
          onClick={() => history.push('/newtrip/tripThird')}
          disabled={newTrip.dateRange[0] === '' || newTrip.dateRange[1] === ''}
        >
          Continuer
        </Button>
        <Button
          onClick={() => {
            setNewTrip({ ...newTrip, dateRange: ['', ''] })
            history.push('/newtrip/tripThird')
          }}
        >
          Passer
        </Button>
      </Box>
    </TripWrapper>
  )
}

export default TripSecond
