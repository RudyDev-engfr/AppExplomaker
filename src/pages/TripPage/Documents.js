import React, { useState } from 'react'
import Assignment from '@mui/icons-material/Assignment'
import ConfirmationNumber from '@mui/icons-material/ConfirmationNumber'
import Hotel from '@mui/icons-material/Hotel'
import LocalAirport from '@mui/icons-material/LocalAirport'
import Lock from '@mui/icons-material/Lock'
import MoreHoriz from '@mui/icons-material/MoreHoriz'
import SupervisorAccount from '@mui/icons-material/SupervisorAccount'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import MuiModal from '@mui/material/Modal'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

import { makeStyles, useTheme } from '@mui/styles'

import CustomAvatar from '../../components/atoms/CustomAvatar'
import CardMenu from '../../components/atoms/CardMenu'

import ava2 from '../../images/avatar/ava2.png'
import ava3 from '../../images/avatar/ava3.png'
import ava4 from '../../images/avatar/ava4.png'
import ava5 from '../../images/avatar/ava5.png'

const travelers = [
  { avatar: ava2, name: 'Damien' },
  { avatar: ava3, name: 'Rose' },
  { avatar: ava4, name: 'Fabien' },
  { avatar: ava5, name: 'Julie' },
]

const useStyles = makeStyles({
  container: {
    padding: '2rem',
    margin: '2rem 0',
  },
  grid: {
    display: 'grid',
    gridTemplate: 'max-content / repeat(auto-fit, 250px)',
    gridGap: '20px',
  },
  card: {
    display: 'grid',
    padding: '1rem .25em',
    gridTemplate: '24px minmax(200px, auto) / 1fr',
    justifyItems: 'end',
  },
  cardWithAvatars: {
    display: 'grid',
    padding: '1rem .25em',
    gridTemplate: '24px minmax(200px, auto) 40px / 1fr',
    justifyItems: 'end',
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    textAlign: 'center',
    '& p': {
      maxWidth: '60%',
    },
  },
  cardAvatars: {
    justifySelf: 'center',
  },
  plane: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#F9F1F1',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#A9474A',
    '& svg': {
      fontSize: '40px',
    },
  },
  hotel: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#F5F9F9',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#006A75',
    '& svg': {
      fontSize: '40px',
    },
  },
  ticket: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#F4FBFA',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#009D8C',
    '& svg': {
      fontSize: '40px',
    },
  },
  checklist: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#F7F7F7',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#B7B7B7',
    '& svg': {
      fontSize: '40px',
    },
  },
  fullScreenImage: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
})

const Documents = () => {
  const classes = useStyles()
  const [isFullscreenImageOpen, setIsFullscreenImageOpen] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const [fullscrenImageTitle, setFullscreenImageTitle] = useState('')
  const [fullscreenImageUrl, setFullscreenImageUrl] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)

  const handleOpenDropdown = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseDropdown = () => {
    setAnchorEl(null)
  }

  // eslint-disable-next-line no-unused-vars
  const handleFullscreenImage = (title, url) => {
    setFullscreenImageTitle(title)
    setFullscreenImageUrl(url)
    setIsFullscreenImageOpen(true)
  }

  return (
    <>
      <Box component="section" my="20px">
        <Typography variant="h1">Documents</Typography>
        <Typography>
          Vous pouvez ajouter ici tous les documents qui vous seront utiles lors de votre voyage :
          billets d’avions, passports, réservations d’hôtels, d’activités...
        </Typography>
        <Paper className={classes.container}>
          <Typography variant="h5">
            <Lock color="primary" />
            Documents personnels
          </Typography>
          <Box className={classes.grid}>
            <Card variant="outlined" className={classes.card}>
              <CardActions>
                {/* () => handleFullscreenImage("Billet d’avion aller : CDG - NBO", afisha) */}
                <IconButton size="small" onClick={handleOpenDropdown}>
                  <MoreHoriz />
                </IconButton>
              </CardActions>
              <CardContent className={classes.cardContent}>
                <Box className={classes.plane}>
                  <LocalAirport style={{ transform: 'rotate(45deg)' }} />
                </Box>
                <Typography>Billet d’avion aller : CDG - NBO</Typography>
              </CardContent>
            </Card>
            <Card variant="outlined" className={classes.card}>
              <CardActions>
                <IconButton size="small" onClick={handleOpenDropdown}>
                  <MoreHoriz />
                </IconButton>
              </CardActions>
              <CardContent className={classes.cardContent}>
                <Box className={classes.plane}>
                  <LocalAirport style={{ transform: 'rotate(45deg)' }} />
                </Box>
                <Typography>Billet d’avion aller : CDG - NBO</Typography>
              </CardContent>
            </Card>
          </Box>
        </Paper>
        <Paper className={classes.container}>
          <Typography variant="h5">
            <SupervisorAccount color="primary" />
            Documents partagés
          </Typography>
          <Box className={classes.grid}>
            <Card variant="outlined" className={classes.cardWithAvatars}>
              <CardActions>
                <IconButton size="small" onClick={handleOpenDropdown}>
                  <MoreHoriz />
                </IconButton>
              </CardActions>
              <CardContent className={classes.cardContent}>
                <Box className={classes.hotel}>
                  <Hotel />
                </Box>
                <Typography>Réservation Hôtel Au Lion d’Or</Typography>
              </CardContent>
              <CustomAvatar persons={travelers} propsClasses={classes.cardAvatars} />
            </Card>
            <Card variant="outlined" className={classes.cardWithAvatars}>
              <CardActions>
                <IconButton size="small" onClick={handleOpenDropdown}>
                  <MoreHoriz />
                </IconButton>
              </CardActions>
              <CardContent className={classes.cardContent}>
                <Box className={classes.ticket}>
                  <ConfirmationNumber />
                </Box>
                <Typography>Réservation Hôtel Safari Masaï Mara</Typography>
              </CardContent>
              <CustomAvatar persons={travelers.slice(0, 3)} propsClasses={classes.cardAvatars} />
            </Card>
            <Card variant="outlined" className={classes.cardWithAvatars}>
              <CardActions>
                <IconButton size="small" onClick={handleOpenDropdown}>
                  <MoreHoriz />
                </IconButton>
              </CardActions>
              <CardContent className={classes.cardContent}>
                <Box className={classes.checklist}>
                  <Assignment />
                </Box>
                <Typography>Partir au Kenya : Choses à savoir</Typography>
              </CardContent>
              <CustomAvatar persons={travelers.slice(0, 2)} propsClasses={classes.cardAvatars} />
            </Card>
          </Box>
        </Paper>
      </Box>
      <CardMenu
        anchorEl={anchorEl}
        handleCloseDropdown={handleCloseDropdown}
        options={['Télécharger', 'Modifier', 'Supprimer']}
      />
      <MuiModal open={isFullscreenImageOpen} onClose={() => setIsFullscreenImageOpen(false)}>
        <Box className={classes.fullScreenImage}>
          <img src={fullscreenImageUrl} alt="" />
        </Box>
      </MuiModal>
    </>
  )
}

export default Documents
