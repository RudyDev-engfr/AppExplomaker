import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

import makeStyles from '@mui/styles/makeStyles'
import { ChatBubble, Favorite } from '@mui/icons-material'

import inspi1 from '../../images/inspiration/1.png'
import inspi2 from '../../images/inspiration/2.png'
import inspi3 from '../../images/inspiration/3.png'
import inspi4 from '../../images/inspiration/4.png'
import inspi5 from '../../images/inspiration/5.png'
import inspi6 from '../../images/inspiration/6.png'

const useStyles = makeStyles(theme => ({
  container: {
    padding: '2rem',
    margin: '2rem 0',
  },
  grid: {
    display: 'grid',
    gridTemplate: 'max-content / repeat(auto-fit, 300px)',
    gridGap: '20px',
    marginTop: '2rem',
  },
  category: {
    fontWeight: 'bold',
  },
  card: {
    display: 'grid',
    paddingBotton: '1rem',
    gridTemplate: '195px minmax(100px, auto) / 1fr',
    justifyItems: 'end',
    borderRadius: '10px',
    '& img': {
      borderRadius: '0 0 15px 15px',
      width: '100%',
    },
  },
  cardImageContainer: {
    position: 'relative',
    width: '100%',
  },
  cardType: {
    position: 'absolute',
    bottom: '-10px',
    left: '16px',
    textTransform: 'uppercase',
    backgroundColor: theme.palette.primary.ultraLight,
    color: theme.palette.primary.main,
    padding: '4px 12px',
    borderRadius: '30px',
    '& p': {
      fontWeight: 'bold',
    },
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    '&:last-child': {
      paddingBottom: '12px',
    },
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: theme.palette.grey[400],
    marginTop: '1rem',
  },
}))

const Inspiration = () => {
  const classes = useStyles()

  return (
    <Box my="20px">
      <Typography variant="h1">Inspiration</Typography>
      <Typography>
        Retrouvez ici une sélection d’articles, de spots et d&apos;explorations en rapport avec le
        Kenya.
      </Typography>
      <Paper className={classes.container}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h5" className={classes.category}>
            Articles sur le Kenya
          </Typography>
          <Button color="primary" variant="contained">
            Voir tout
          </Button>
        </Box>
        <Box className={classes.grid}>
          <Card variant="outlined" className={classes.card}>
            <Box className={classes.cardImageContainer}>
              <img src={inspi1} alt="" />
              <Box className={classes.cardType}>
                <Typography>Actualité</Typography>
              </Box>
            </Box>
            <CardContent className={classes.cardContent}>
              <Typography variant="h6">
                Déconfinement : ce qu&apos;il faut savoir si vous voulez sortir ce week-end
              </Typography>
              <Box className={classes.cardFooter}>
                <Typography variant="body2">19 Juin 2020 • 4 min</Typography>
                <Box display="flex">
                  <Box display="flex" alignItem="center" mr={2}>
                    <Favorite style={{ fontSize: '14px', marginRight: '.25rem' }} />
                    <Typography variant="body2">12</Typography>
                  </Box>
                  <Box display="flex" alignItem="center">
                    <ChatBubble style={{ fontSize: '14px', marginRight: '.25rem' }} />
                    <Typography variant="body2">4</Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
          <Card variant="outlined" className={classes.card}>
            <Box className={classes.cardImageContainer}>
              <img src={inspi2} alt="" />
              <Box className={classes.cardType}>
                <Typography>Inspiration</Typography>
              </Box>
            </Box>
            <CardContent className={classes.cardContent}>
              <Typography variant="h6">
                Déconfinement : peut-on voyager hors d&apos;Europe 🌎 ?
              </Typography>
              <Box className={classes.cardFooter}>
                <Typography variant="body2">19 Juin 2020 • 4 min</Typography>
                <Box display="flex">
                  <Box display="flex" alignItem="center" mr={2}>
                    <Favorite style={{ fontSize: '14px', marginRight: '.25rem' }} />
                    <Typography variant="body2">12</Typography>
                  </Box>
                  <Box display="flex" alignItem="center">
                    <ChatBubble style={{ fontSize: '14px', marginRight: '.25rem' }} />
                    <Typography variant="body2">4</Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
          <Card variant="outlined" className={classes.card}>
            <Box className={classes.cardImageContainer}>
              <img src={inspi3} alt="" />
              <Box className={classes.cardType}>
                <Typography>Récit de voyage</Typography>
              </Box>
            </Box>
            <CardContent className={classes.cardContent}>
              <Typography variant="h6">
                Coronavirus 😷 : Quels sont vos droits pour annuler un voyage à l&apos;étranger ?
              </Typography>
              <Box className={classes.cardFooter}>
                <Typography variant="body2">19 Juin 2020 • 4 min</Typography>
                <Box display="flex">
                  <Box display="flex" alignItem="center" mr={2}>
                    <Favorite style={{ fontSize: '14px', marginRight: '.25rem' }} />
                    <Typography variant="body2">12</Typography>
                  </Box>
                  <Box display="flex" alignItem="center">
                    <ChatBubble style={{ fontSize: '14px', marginRight: '.25rem' }} />
                    <Typography variant="body2">4</Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Paper>
      <Paper className={classes.container}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h5" className={classes.category}>
            Spots au Kenya
          </Typography>
          <Button color="primary" variant="contained">
            Voir tout
          </Button>
        </Box>
        <Box className={classes.grid}>
          <Card variant="outlined" className={classes.card}>
            <Box className={classes.cardImageContainer}>
              <img src={inspi4} alt="" />
              <Box className={classes.cardType}>
                <Typography>Afrique</Typography>
              </Box>
            </Box>
            <CardContent className={classes.cardContent}>
              <Typography variant="h6">
                Nairobi : l&apos;incontournable capitale dynamique et accueillante
              </Typography>
              <Box className={classes.cardFooter}>
                <Box />
                <Box display="flex">
                  <Box display="flex" alignItem="center" mr={2}>
                    <Favorite style={{ fontSize: '14px', marginRight: '.25rem' }} />
                    <Typography variant="body2">12</Typography>
                  </Box>
                  <Box display="flex" alignItem="center">
                    <ChatBubble style={{ fontSize: '14px', marginRight: '.25rem' }} />
                    <Typography variant="body2">4</Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
          <Card variant="outlined" className={classes.card}>
            <Box className={classes.cardImageContainer}>
              <img src={inspi5} alt="" />
              <Box className={classes.cardType}>
                <Typography>Afrique</Typography>
              </Box>
            </Box>
            <CardContent className={classes.cardContent}>
              <Typography variant="h6">
                Masaï Mara : un safari dans l’un des plus beaux parcs du monde
              </Typography>
              <Box className={classes.cardFooter}>
                <Box />
                <Box display="flex">
                  <Box display="flex" alignItem="center" mr={2}>
                    <Favorite style={{ fontSize: '14px', marginRight: '.25rem' }} />
                    <Typography variant="body2">12</Typography>
                  </Box>
                  <Box display="flex" alignItem="center">
                    <ChatBubble style={{ fontSize: '14px', marginRight: '.25rem' }} />
                    <Typography variant="body2">4</Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
          <Card variant="outlined" className={classes.card}>
            <Box className={classes.cardImageContainer}>
              <img src={inspi6} alt="" />
              <Box className={classes.cardType}>
                <Typography>Afrique</Typography>
              </Box>
            </Box>
            <CardContent className={classes.cardContent}>
              <Typography variant="h6">
                Le Mont Kenya : un univers fantastique pour le trek qui s&apos;offre à vous
              </Typography>
              <Box className={classes.cardFooter}>
                <Box />
                <Box display="flex">
                  <Box display="flex" alignItem="center" mr={2}>
                    <Favorite style={{ fontSize: '14px', marginRight: '.25rem' }} />
                    <Typography variant="body2">12</Typography>
                  </Box>
                  <Box display="flex" alignItem="center">
                    <ChatBubble style={{ fontSize: '14px', marginRight: '.25rem' }} />
                    <Typography variant="body2">4</Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Paper>
      <Paper className={classes.container}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h5" className={classes.category}>
            Explorations au Kenya
          </Typography>
          <Button color="primary" variant="contained">
            Voir tout
          </Button>
        </Box>
        <Box className={classes.grid}>
          <Card variant="outlined" className={classes.card}>
            <Box className={classes.cardImageContainer}>
              <img src={inspi1} alt="" />
              <Box className={classes.cardType}>
                <Typography>Afrique</Typography>
              </Box>
            </Box>
            <CardContent className={classes.cardContent}>
              <Typography variant="h6">
                Déconfinement : ce qu&apos;il faut savoir si vous voulez sortir ce week-end
              </Typography>
              <Box className={classes.cardFooter}>
                <Box />
                <Box display="flex">
                  <Box display="flex" alignItem="center" mr={2}>
                    <Favorite style={{ fontSize: '14px', marginRight: '.25rem' }} />
                    <Typography variant="body2">12</Typography>
                  </Box>
                  <Box display="flex" alignItem="center">
                    <ChatBubble style={{ fontSize: '14px', marginRight: '.25rem' }} />
                    <Typography variant="body2">4</Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
          <Card variant="outlined" className={classes.card}>
            <Box className={classes.cardImageContainer}>
              <img src={inspi2} alt="" />
              <Box className={classes.cardType}>
                <Typography>Afrique</Typography>
              </Box>
            </Box>
            <CardContent className={classes.cardContent}>
              <Typography variant="h6">
                Déconfinement : peut-on voyager hors d&apos;Europe 🌎 ?
              </Typography>
              <Box className={classes.cardFooter}>
                <Box />
                <Box display="flex">
                  <Box display="flex" alignItem="center" mr={2}>
                    <Favorite style={{ fontSize: '14px', marginRight: '.25rem' }} />
                    <Typography variant="body2">12</Typography>
                  </Box>
                  <Box display="flex" alignItem="center">
                    <ChatBubble style={{ fontSize: '14px', marginRight: '.25rem' }} />
                    <Typography variant="body2">4</Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
          <Card variant="outlined" className={classes.card}>
            <Box className={classes.cardImageContainer}>
              <img src={inspi3} alt="" />
              <Box className={classes.cardType}>
                <Typography>Afrique</Typography>
              </Box>
            </Box>
            <CardContent className={classes.cardContent}>
              <Typography variant="h6">
                Coronavirus 😷 : Quels sont vos droits pour annuler un voyage à l&apos;étranger ?
              </Typography>
              <Box className={classes.cardFooter}>
                <Box />
                <Box display="flex">
                  <Box display="flex" alignItem="center" mr={2}>
                    <Favorite style={{ fontSize: '14px', marginRight: '.25rem' }} />
                    <Typography variant="body2">12</Typography>
                  </Box>
                  <Box display="flex" alignItem="center">
                    <ChatBubble style={{ fontSize: '14px', marginRight: '.25rem' }} />
                    <Typography variant="body2">4</Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Paper>
    </Box>
  )
}

export default Inspiration
