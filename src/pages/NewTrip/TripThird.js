import React, { useContext, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Fade from '@mui/material/Fade'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import TextareaAutosize from '@mui/material/TextareaAutosize'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { makeStyles, useTheme } from '@mui/styles'
import { useHistory } from 'react-router-dom'
import { Info, InfoRounded } from '@mui/icons-material'

import { NewTripContext } from '../../contexts/newTrip'
import TripWrapper from './TripWrapper'
import { BUDGET_OPTIONS, CONTEXT_OPTIONS } from '../../helper/constants'

const useStyles = makeStyles(theme => ({
  roundedBtn: { borderRadius: '50px', margin: '5px 10px' },
  radio: {
    display: 'none',
    '& .MuiFormControlLabel-label': {
      backgroundColor: 'red',
    },
  },
  textarea: {
    padding: '25px',
    width: '100%',
    fontSize: '17px',
    borderRadius: '10px',
    border: '1px solid #BDBDBD',
    lineHeight: '23px',
    '&:active': {
      border: '2px solid #009d8c',
    },
    '&:focus': {
      border: '2px solid #009d8c',
    },
    fontFamily: theme.typography.h1.fontFamily,
    [theme.breakpoints.down('sm')]: {
      padding: '28px 25px',
      fontFamily: theme.typography.fontFamily,
    },
  },
  tooltip: {
    backgroundColor: theme.palette.primary.main,
    borderRadius: '5px',
    padding: '10px',
  },
  arrow: {
    color: theme.palette.primary.main,
  },
  tooltipIcon: {
    color: theme.palette.grey.bd,
    fontSize: '25px',
    [theme.breakpoints.down('sm')]: {
      color: theme.palette.grey.black,
    },
  },
  btnsContainer: {
    display: 'grid',
    gridTemplate: '1fr / 1fr 1fr',
    gap: '40px',
    alignItems: 'center',
    paddingTop: '50px',
    [theme.breakpoints.down('sm')]: {
      position: 'fixed',
      bottom: '0',
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
  budgetContainer: {
    [theme.breakpoints.down('sm')]: {
      marginBottom: '130px',
    },
  },
  formTitle: {
    fontSize: '24px',
    fontWeight: '500',
    fontFamily: theme.typography.h1.fontFamily,
    [theme.breakpoints.down('sm')]: {
      fontSize: '20px',
      fontFamily: theme.typography.fontFamily,
      color: theme.palette.grey[33],
      fontWeight: '400',
    },
  },
}))

const TripThird = () => {
  const history = useHistory()
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  const { newTrip, setNewTrip } = useContext(NewTripContext)
  const [title, setTitle] = useState(
    newTrip?.noDestination
      ? 'Je ne sais pas encore'
      : `Mon voyage à ${
          newTrip.destination.label.length <= 27
            ? newTrip.destination.label
            : newTrip.destination.label.slice(0, 27)
        }`
  )
  const [description, setDescription] = useState(newTrip.description)
  const [context, setContext] = useState(newTrip.context)
  const [budget, setBudget] = useState(newTrip.budget)

  useEffect(() => {
    setNewTrip({ ...newTrip, title, description, context, budget })
  }, [title, description, context, budget])

  useEffect(() => {
    console.log('nouveauvoyage', newTrip)
  }, [newTrip])

  return (
    <TripWrapper currentStep="3" title="Informations du séjour" backURL="/newtrip/tripSecond">
      <Box mb={3}>
        {!matchesXs && <Typography className={classes.formTitle}>Titre du séjour</Typography>}
        <TextareaAutosize
          className={classes.textarea}
          type="text"
          minRows={1}
          maxRows={1}
          value={title}
          onChange={event => setTitle(event.target.value)}
          placeholder={matchesXs ? 'Titre du séjour' : ''}
        />
        {title.trim().length > 40 && (
          <Box
            display="flex"
            alignItems="center"
            mt={1}
            p={2}
            bgcolor="secondary.ultraLight"
            borderRadius="10px"
          >
            <Info color="secondary" />
            <Box ml={1}>
              <Typography variant="body2">Maximum 40 caractères</Typography>
            </Box>
          </Box>
        )}
      </Box>
      <Box mb={3}>
        {!matchesXs && <Typography className={classes.formTitle}>Le projet</Typography>}
        <TextareaAutosize
          className={classes.textarea}
          type="text"
          minRows={1}
          maxRows={5}
          placeholder={matchesXs ? 'Le projet - optionnel' : ''}
          value={description}
          onChange={event => setDescription(event.target.value)}
        />
      </Box>
      <Box mb={4}>
        <Typography className={classes.formTitle}>Contexte</Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            <FormControl component="fieldset" required>
              <RadioGroup row aria-label="Contexte" name="Contexte">
                {CONTEXT_OPTIONS.map(option => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio classes={{ root: classes.radio }} />}
                    label={
                      <Button
                        color={context === option.value ? 'primary' : 'inherit'}
                        variant="contained"
                        disableElevation
                        className={classes.roundedBtn}
                        onClick={() => setContext(option.value)}
                      >
                        {option.label}
                      </Button>
                    }
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Box>
          <Tooltip
            arrow
            title="Connaitre le type de voyage que tu as envie de faire nous permettra de t'aider à trouver les bonnes explorations."
            classes={{ tooltip: classes.tooltip, arrow: classes.arrow }}
            TransitionComponent={Fade}
          >
            <InfoRounded className={classes.tooltipIcon} />
          </Tooltip>
        </Box>
      </Box>
      <Box className={classes.budgetContainer}>
        <Typography className={classes.formTitle}>Budget</Typography>
        <Box display="flex" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <FormControl component="fieldset" required>
              <RadioGroup row aria-label="Budget" name="Budget">
                {BUDGET_OPTIONS.map(option => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio classes={{ root: classes.radio }} />}
                    label={
                      <Button
                        color={budget === option.value ? 'primary' : 'inherit'}
                        variant="contained"
                        disableElevation
                        className={classes.roundedBtn}
                        onClick={() => setBudget(option.value)}
                      >
                        {option.label}
                      </Button>
                    }
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Box>
          <Tooltip
            arrow
            title="Connaitre le type de voyage que tu as envie de faire nous permettra de t'aider à trouver les bonnes explorations."
            classes={{ tooltip: classes.tooltip, arrow: classes.arrow }}
            TransitionComponent={Fade}
          >
            <InfoRounded className={classes.tooltipIcon} />
          </Tooltip>
        </Box>
      </Box>
      <Box className={classes.btnsContainer}>
        <Button
          className={classes.btnNext}
          color="primary"
          variant="contained"
          onClick={() => history.push('/newtrip/tripFourth')}
          disabled={title.trim().length > 40 || !context || !budget}
        >
          Continuer
        </Button>
      </Box>
    </TripWrapper>
  )
}

export default TripThird
