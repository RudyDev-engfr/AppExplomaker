import React from 'react'
import { useHistory } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import makeStyles from '@mui/styles/makeStyles'
import { ArrowBackIos } from '@mui/icons-material'

import Head from '../../components/molecules/Head'

import leftBg from '../../images/signIn/bg.png'
import logoFull from '../../images/icons/logoFull.svg'

const useStyles = makeStyles(theme => ({
  left: {
    width: '30%',
    background: `url(${leftBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center bottom',
    backgroundRepeat: 'no-repeat',
    height: '100vh',
    position: 'fixed',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  right: {
    width: '70%',
    padding: '30px 80px',
    position: 'relative',
    left: '30%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      left: '0',
      padding: '30px',
    },
  },
  arrowBack: {
    transform: 'translate(5px ,0)',
  },
  title: {
    margin: `${theme.spacing(8)} 0 ${theme.spacing(3)}`,
    [theme.breakpoints.down('sm')]: { textAlign: 'center', fontSize: '28px' },
  },
  subtitle: {
    [theme.breakpoints.down('sm')]: { textAlign: 'center', fontSize: '17px' },
  },
  form: {
    margin: `${theme.spacing(3)} 0 ${theme.spacing(3)}`,
  },
}))

const Wrapper = ({ currentStep, title, subtitle, backURL, handleSubmit, children }) => {
  const history = useHistory()
  const classes = useStyles()

  const wrapperSubmit = event => {
    event.preventDefault()
    handleSubmit(event)
  }

  return (
    <>
      <Head title="Signup" />
      <Box display="flex" position="relative" component="section">
        <Box className={classes.left}>
          <Box display="flex" alignItems="center" pt="40px" pl="80px">
            <Box mt={1}>
              <img src={logoFull} alt="explomaker" />
            </Box>
          </Box>
        </Box>
        <Box className={classes.right}>
          <Box maxWidth="800px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Button
                startIcon={<ArrowBackIos className={classes.arrowBack} />}
                onClick={() => history.push(backURL)}
              >
                Retour
              </Button>
              <Typography variant="subtitle1">Étape {currentStep} / 3</Typography>
            </Box>
            <Typography variant="h1" component="h2" className={classes.title}>
              {title}
            </Typography>
            <Typography variant="h5" className={classes.subtitle}>
              {subtitle}
            </Typography>
            <form onSubmit={wrapperSubmit} className={classes.form}>
              {children}
            </form>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default Wrapper
