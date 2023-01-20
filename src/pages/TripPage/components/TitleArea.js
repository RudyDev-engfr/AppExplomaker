import { makeStyles } from '@mui/styles'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React from 'react'

const useStyles = makeStyles(theme => ({
  titleArea: {
    padding: '15px 50px 15px 50px',
    display: 'flex',
    alignItems: 'center',
    color: '#000000',
    textTransform: 'unset',
    justifyContent: 'flex-start',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
}))
const TitleArea = ({ tripDestinationLabel, tripTitle, tripDateRange = [] }) => {
  const classes = useStyles()

  return (
    <Paper square className={classes.titleArea}>
      <Box>
        <Typography>
          <Box fontWeight="bold" component="span" fontSize="20px" lineHeight="24px">
            {/* {tripData.destination?.label ?? tripData.title} */}
            {tripDestinationLabel ?? tripTitle}
          </Box>
        </Typography>
        <Typography>
          {/* {typeof currentDateRange[0] === 'undefined'
            ? 'Je ne sais pas encore'
            : `${currentDateRange[0]} - ${currentDateRange[1]}`} */}
          {typeof tripDateRange[0] === 'undefined'
            ? 'Je ne sais pas encore'
            : `${tripDateRange[0]} - ${tripDateRange[1]}`}
        </Typography>
      </Box>
    </Paper>
  )
}
export default TitleArea
