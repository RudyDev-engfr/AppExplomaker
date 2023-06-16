import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { makeStyles, useTheme } from '@mui/styles'
import React from 'react'

const months = [
  'jan',
  'fev',
  'mar',
  'avr',
  'mai',
  'juin',
  'juil',
  'août',
  'sept',
  'oct',
  'nov',
  'dec',
]

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: '#F4FBFA',
    marginTop: theme.spacing(2),
    padding: '1rem 2rem',
  },
  title: {
    margin: '1rem 0',
    fontWeight: 'bold',
  },
}))

const DateRangesBar = ({ destination, linkWord, bestPeriods }) => {
  const classes = useStyles()

  return (
    <Paper className={classes.root} elevation={0}>
      <Typography className={classes.title} variant="h5">
        Meilleures périodes pour partir {linkWord} {destination.split(',')[0]}
      </Typography>
      <Box display="flex">
        {months.map((month, index) => (
          <Box key={month} width="100%" display="flex" flexDirection="column" alignItems="center">
            <Box
              width="100%"
              bgcolor={
                bestPeriods[index + 1] === 2
                  ? '#009d8c'
                  : bestPeriods[index + 1] === 1
                  ? '#009d8c99'
                  : '#dfdfdf'
              }
              height="1rem"
              borderRadius={
                index === 0
                  ? '10px 0 0 10px'
                  : index === months.length - 1
                  ? '0 10px 10px 0'
                  : 'none'
              }
            />
            <Typography variant="caption">{month}</Typography>
          </Box>
        ))}
      </Box>
      <Box display="flex" width="60%" justifyContent="space-between" my={1}>
        <Box display="flex" alignItems="center">
          <Box width="20px" height="20px" borderRadius="50%" bgcolor="#009d8c" mr={1} mb={0.25} />
          <Typography variant="caption">Parfaite</Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <Box width="20px" height="20px" borderRadius="50%" bgcolor="#009d8c99" mr={1} mb={0.25} />
          <Typography variant="caption">Correcte</Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <Box width="20px" height="20px" borderRadius="50%" bgcolor="#dfdfdf" mr={1} mb={0.25} />
          <Typography variant="caption">Déconseillée</Typography>
        </Box>
      </Box>
    </Paper>
  )
}

export default DateRangesBar
