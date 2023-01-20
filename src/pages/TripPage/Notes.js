import React, { useState } from 'react'
import { Lock, MoreHoriz, SupervisorAccount } from '@mui/icons-material'
import {
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  IconButton,
  Paper,
  Typography,
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'

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
    gridTemplate: 'max-content / repeat(auto-fit, 400px)',
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
  cardActionArea: {},
})

const Notes = () => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(null)

  const handleOpenDropdown = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseDropdown = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <Box component="section" my="20px">
        <Typography variant="h1">Notes</Typography>
        <Typography>
          Créez des notes qui vous seront utiles pendant votre séjour, ou durant la préparation de
          ce dernier. Vous pouvez créer des notes personnelles, ou des notes partagées.
        </Typography>
        <Paper className={classes.container}>
          <Typography variant="h5">
            <Lock color="primary" />
            Notes personnelles
          </Typography>
          <Box className={classes.grid}>
            <Card variant="outlined" className={classes.card}>
              <CardActions>
                <IconButton size="small" onClick={handleOpenDropdown}>
                  <MoreHoriz />
                </IconButton>
              </CardActions>
              <CardContent className={classes.cardContent}>
                <label htmlFor="check1">
                  <input type="checkbox" name="check" id="check1" value="1" />
                  Vêtements légers
                </label>
                <label htmlFor="check2">
                  <input type="checkbox" name="check" id="check2" value="1" />
                  Trousse de toilette
                </label>
                <label htmlFor="check3">
                  <input type="checkbox" name="check" id="check3" value="1" />
                  Appareil photo reflex
                </label>
                <label htmlFor="check4">
                  <input type="checkbox" name="check" id="check4" value="1" />
                  Chaussures de randonnée
                </label>
                <label htmlFor="check5">
                  <input type="checkbox" name="check" id="check5" value="1" />
                  Répulsif à moustiques
                </label>
                <label htmlFor="check6">
                  <input type="checkbox" name="check" id="check6" value="1" />
                  Chapeau
                </label>
              </CardContent>
              <CardActionArea className={classes.cardActionArea}>
                <Typography variant="h6" color="primary">
                  À emmener dans la valise
                </Typography>
                <Typography variant="body2">Modifiée par moi il y a 2 jours</Typography>
              </CardActionArea>
            </Card>
            <Card variant="outlined" className={classes.card}>
              <CardActions>
                <IconButton size="small" onClick={handleOpenDropdown}>
                  <MoreHoriz />
                </IconButton>
              </CardActions>
              <CardContent className={classes.cardContent}>
                <Typography>
                  Né aux environs du Xe siècle, le swahili est un mélange de langue bantoue et
                  d&apos;arabe. Aujourd&apos;hui il est parlé au Kenya, en Tanzanie, au Burundi, en
                  Ouganda, au Rwanda mais aussi au Malawi, en Zambie, au Mozambique et dans
                  l&apos;immense République Démocratique du Congo, au point que le swahili est la
                  langue bantoue la plus parlée. Même s&apos;il parait difficilement envisageable de
                  tenir une conversation entière, les Kenyans apprécient que vous essayiez de dire
                  quelques mots dans leur langue officielle. Il ne vous tiendront pas rigueur si
                  vous faites des erreurs et au contraire sauront saluer vos efforts. Quand à la fin
                  de votre séjour, vous connaitrez de plus en plus de mot, cela éveillera même leur
                  curiosité. Faites donc l&apos;effort, les contacts n&apos;en seront que plus
                  chaleureux.
                </Typography>
              </CardContent>
              <CardActionArea className={classes.cardActionArea}>
                <Typography variant="h6" color="primary">
                  Vocabulaire basique swahili...
                </Typography>
                <Typography variant="body2">Modifiée par moi il y a une semaine</Typography>
              </CardActionArea>
            </Card>
          </Box>
        </Paper>
        <Paper className={classes.container}>
          <Typography variant="h5">
            <SupervisorAccount color="primary" />
            Notes partagées
          </Typography>
          <Box className={classes.grid}>
            <Card variant="outlined" className={classes.card}>
              <CardActions>
                <IconButton size="small" onClick={handleOpenDropdown}>
                  <MoreHoriz />
                </IconButton>
              </CardActions>
              <CardContent className={classes.cardContent}>
                <Typography>
                  Pour faire un safari ou simplement pour prendre du bon temps sur une plage de
                  sable fin, sous les cocotiers et face à l&apos;immensité azur de l&apos;océan
                  Indien un voyage au Kenya s&apos;impose de lui-même. Pour le préparer au mieux et
                  faire en sorte de ne rien oublier qui pourrait être indispensable sur place,
                  faisons ensemble un point sur ce qui doit être rangé dans vos bagages. Sur place,
                  en dehors des deux grandes villes Nairobi et Mombasa, il est difficile de faire
                  des achats. Il s&apos;agit donc de faire un point méthodique.
                </Typography>
                <CustomAvatar persons={travelers} />
              </CardContent>
              <CardActionArea className={classes.cardActionArea}>
                <Typography variant="h6" color="primary">
                  Que mettre dans sa valise...
                </Typography>
                <Typography variant="body2">Modifiée par Julie il y a 2h</Typography>
              </CardActionArea>
            </Card>
            <Card variant="outlined" className={classes.card}>
              <CardActions>
                <IconButton size="small" onClick={handleOpenDropdown}>
                  <MoreHoriz />
                </IconButton>
              </CardActions>
              <CardContent className={classes.cardContent}>
                <Typography>
                  Quelles formalités pour se rendre au Kenya ? Votre passeport doit être valide 6
                  mois après la date de retour et disposer d&apos;au moins 3 pages vierges dont 2
                  face à face. Pour y entrer, il vous faudra un visa. Vous pouvez vous le procurer
                  avant le départ, directement à l’ambassade du pays ou via une agence spécialisée
                  (voir ci-après) ou sur place, une fois arrivé, à l’aéroport ou aux postes
                  frontières (selon les destis).
                </Typography>
                <CustomAvatar persons={travelers.slice(0, 3)} />
              </CardContent>
              <CardActionArea className={classes.cardActionArea}>
                <Typography variant="h6" color="primary">
                  Quelles formalités et quel...
                </Typography>
                <Typography variant="body2">Modifiée par Fabien il y a un mois</Typography>
              </CardActionArea>
            </Card>
          </Box>
        </Paper>
      </Box>
      <CardMenu
        anchorEl={anchorEl}
        handleCloseDropdown={handleCloseDropdown}
        options={['Modifier', 'Supprimer']}
      />
    </>
  )
}

export default Notes
