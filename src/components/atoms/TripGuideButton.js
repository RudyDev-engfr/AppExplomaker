import React from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { makeStyles } from '@mui/styles'
import { useHistory } from 'react-router-dom'

import arrow from '../../images/icons/arrow-back.svg'

const useStyles = makeStyles(theme => ({
  papers: {
    width: '330px',
    height: '115px',
    cursor: 'pointer',
    padding: '25px 15px',
    textAlign: 'left',
    textTransform: 'unset',
    color: theme.palette.grey['33'],
    '&:hover': {
      backgroundColor: theme.palette.primary.ultraLight,
    },
    '&:focus': {
      backgroundColor: theme.palette.primary.ultraLight,
    },
    [theme.breakpoints.down('sm')]: {
      height: '100px',
      '&:nth-child(1)': {
        marginBottom: '-20px',
        borderRadius: '20px 20px 0 0',
        height: '85px',
      },
      '&:nth-child(2)': {
        borderRadius: '0 0 20px 20px',
        height: '85px',
      },
    },
    [theme.breakpoints.down('sm')]: {
      width: 'calc(100vw - 60px)',
    },
  },
  papersContent: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
    },
  },
  iconTypo: { marginRight: '15px', fontSize: '30px' },
  papersTitle: {
    fontWeight: 600,
  },
}))

const TripGuideButton = ({ itemName, model, logo, setCurrentSelectedTripGuideButton }) => {
  const classes = useStyles()
  const history = useHistory()

  const handleClick = () => {
    history.push(`${history.location.pathname}?itemName=${model}`)
    setCurrentSelectedTripGuideButton(model)
  }

  return (
    <Box>
      <Paper component={Button} className={classes.papers} onClick={handleClick}>
        <Box className={classes.papersContent}>
          <Typography className={classes.iconTypo}>{logo}</Typography>
          <Box className={classes.titleContainer}>
            <Typography className={classes.papersTitle}>{itemName}</Typography>
          </Box>
          <Box
            component="img"
            sx={{ transform: 'rotate(180deg)', marginLeft: '20px' }}
            src={arrow}
            alt=""
          />
        </Box>
      </Paper>
    </Box>
  )
}
export default TripGuideButton
