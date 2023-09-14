import React, { useContext } from 'react'
import { toast } from 'react-toastify'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { makeStyles, useTheme } from '@mui/styles'
import { useParams } from 'react-router-dom'
import clsx from 'clsx'

import assistantImage from '../../images/ctaDashboard/assistant_voyage.png'
import invitationImage from '../../images/ctaDashboard/partage.png'
import guideImage from '../../images/ctaDashboard/guide.png'
import { TripContext } from '../../contexts/trip'

const useStyles = makeStyles(theme => ({
  componentContainer: {
    width: '345px',
    height: '250px',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '20px',
    [theme.breakpoints.down('sm')]: {
      width: 'calc(100vw - 60px)',
      height: '250px',
    },
    '@media (min-width: 1440px) and (max-width: 1800px)': {
      width: 'calc(100% - 30px - 650px)',
    },
    '@media (min-width: 1800px)': {
      width: 'calc((100% - 30px - 650px) / 2)',
    },
  },
  invitationImageContainer: {
    position: 'absolute',
    right: '-100px',
    bottom: '-7px',
  },
  assistantImageContainer: {
    position: 'absolute',
    right: '-25px',
    bottom: '0',
  },
  guideImageContainer: {
    position: 'absolute',
    right: '-30px',
    zIndex: 0,
    top: '10%',
  },
  contentContainer: {
    position: 'absolute',
    left: '15px',
    top: '30px',
    [theme.breakpoints.down('sm')]: {
      left: '50%',
      transform: 'translateX(-50%)',
    },
    [theme.breakpoints.down('xs')]: {
      left: '15px',
      transform: 'none',
      maxWidth: 'calc(100% - 120px)',
    },
  },
  // buttonContainer: {
  //   position: 'absolute',
  //   left: '10px',
  //   bottom: '20px',
  // },
  img: {
    maxWidth: '200px',
  },
  guideImg: {
    maxWidth: '340px',
  },
  invitationImg: {
    maxWidth: '280px',
  },
}))
const CTASmallHeadBand = ({ isInvitation, isAssistant, isGuide }) => {
  const classes = useStyles()
  const theme = useTheme()
  const { tripId } = useParams()
  const { setIsChatOpen, updateHasSeen, setCurrentActiveTab } = useContext(TripContext)

  return (
    <Box
      className={classes.componentContainer}
      sx={{ backgroundColor: isInvitation || isGuide ? '#8CC9EE' : isAssistant && '#BCD5FF' }}
    >
      <Box
        className={clsx({
          [classes.invitationImageContainer]: isInvitation,
          [classes.assistantImageContainer]: isAssistant,
          [classes.guideImageContainer]: isGuide,
        })}
      >
        <img
          src={
            isAssistant ? assistantImage : isGuide ? guideImage : isInvitation && invitationImage
          }
          alt="CTA_illustration"
          className={clsx({
            [classes.img]: !isGuide,
            [classes.guideImg]: isGuide,
            [classes.invitationImg]: isInvitation,
          })}
        />
      </Box>
      <Box className={classes.contentContainer}>
        <Box className={classes.textContainer}>
          <Typography
            variant="h3"
            sx={{ fontSize: '28px', lineHeight: 1.5, fontWeight: 700, marginBottom: '10px' }}
          >
            {isInvitation
              ? 'Invite tes amis'
              : isGuide
              ? 'Guide du séjour'
              : isAssistant && "Interroge l'Assistant"}
          </Typography>
          <Typography
            sx={{
              fontSize: '14px',
              maxWidth: isGuide
                ? 'calc(100% - 100px)'
                : isInvitation
                ? 'calc(100% - 120px)'
                : 'calc(100% - 110px)',
              marginBottom: '20px',
              [theme.breakpoints.down('sm')]: {
                width: '100%',
                maxWidth: '100%',
              },
            }}
          >
            {isInvitation
              ? 'Invitez vos proches à planifier avec vous. Cliquez pour partager'
              : isGuide
              ? "Découvre le guide exclusif du voyage pour t'inspirer sur la destination"
              : isAssistant && "Besoin d'aide? Ouvrez. Planifiez et explorez en un clic"}
          </Typography>
        </Box>
        <Box className={classes.buttonContainer}>
          <Button
            variant="contained"
            sx={{
              padding: '15px 40px',
              borderRadius: '50px',
              textDecoration: 'none',
              textTransform: 'none',
              maxWidth: '200px',
            }}
            onClick={() => {
              if (isAssistant) {
                setIsChatOpen('AIChat')
                updateHasSeen('Assistant')
              }
              if (isInvitation) {
                navigator.clipboard.writeText(
                  `https://${window.location.href.split('/')[2]}/join/${tripId}`
                )
                toast.success('Lien copié !')
              }
              if (isGuide) {
                setCurrentActiveTab('tripguide')
              }
            }}
          >
            {isInvitation ? 'Lien de partage' : isGuide ? 'Consulter' : isAssistant && 'Démarrer'}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
export default CTASmallHeadBand
