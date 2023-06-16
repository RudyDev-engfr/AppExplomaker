/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import ImageListItemBar from '@mui/material/ImageListItemBar'
import useTheme from '@mui/material/'
import useMediaQuery from '@mui/material/useMediaQuery'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import ButtonBase from '@mui/material/ButtonBase'

import makeStyles from '@mui/styles/makeStyles'
import { ArrowBackIos, Favorite, FavoriteBorder } from '@mui/icons-material'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import clsx from 'clsx'
import { useHistory } from 'react-router-dom'

import { arrayShuffle } from '../../helper/functions'
import CustomAvatar from '../../components/atoms/CustomAvatar'
import { SessionContext } from '../../contexts/session'

import photoPage1 from '../../images/photoPage/1.jpg'
import photoPage2 from '../../images/photoPage/2.png'
import sm1 from '../../images/photoPage/sm1.png'
import sm2 from '../../images/photoPage/sm2.png'
import sm4 from '../../images/photoPage/sm4.png'
import sm5 from '../../images/photoPage/sm5.png'
import download from '../../images/icons/downloadBtn.svg'
import ava2 from '../../images/avatar/ava2.png'
import ava3 from '../../images/avatar/ava3.png'
import ava4 from '../../images/avatar/ava4.png'
import ava5 from '../../images/avatar/ava5.png'
import arrow from '../../images/icons/arrow-back.svg'
import dots from '../../images/icons/dots.svg'
import bigCross from '../../images/icons/cross-big.svg'
import bigArrowRight from '../../images/icons/arrow-right-big.svg'
import expandBtn from '../../images/icons/expand-btn.svg'
import bigDots from '../../images/icons/dots-big.svg'
import hartIcon from '../../images/icons/hart-icon.svg'
import coment from '../../images/icons/coment.svg'

const travelers = [
  { avatar: ava2, name: 'Damien' },
  { avatar: ava3, name: 'Rose' },
  { avatar: ava4, name: 'Fabien' },
  { avatar: ava5, name: 'Julie' },
]

const fakePhotos = [
  { id: 1, src: photoPage1, likes: 4, comments: 4 },
  { id: 2, src: sm1, likes: 4, comments: 4 },
  { id: 3, src: sm2, likes: 4, comments: 4 },
  { id: 4, src: photoPage2, likes: 4, comments: 4 },
  { id: 5, src: sm4, likes: 4, comments: 4 },
  { id: 6, src: sm5, likes: 4, comments: 4 },
  { id: 7, src: photoPage1, likes: 4, comments: 4 },
  { id: 8, src: sm1, likes: 4, comments: 4 },
  { id: 9, src: sm2, likes: 4, comments: 4 },
  { id: 10, src: photoPage2, likes: 4, comments: 4 },
  { id: 11, src: sm4, likes: 4, comments: 4 },
  { id: 12, src: sm5, likes: 4, comments: 4 },
]

const useStyles = makeStyles(theme => ({
  mobileTitle: {
    [theme.breakpoints.up('xs')]: {
      display: 'none',
    },
    [theme.breakpoints.down('sm')]: {
      margin: '55px 0 27px 0',
      display: 'flex',
      justifyContent: 'center',
      fontSize: '38px',
      fontWeight: '700',
    },
  },
  mobileTitleTypo: {
    fontSize: '38px',
    fontWeight: '700',
    fontFamily: theme.typography.h1.fontFamily,
  },
  paper: {
    padding: '2rem',
    margin: '20px 0',
    [theme.breakpoints.down('sm')]: {
      padding: '20px',
      margin: '0',
      borderRedius: '10px',
    },
    '&:last-child': {
      marginBottom: '110px',
    },
    // Reset ButtonBase
    flexDirection: 'column',
    letterSpacing: '0.01071em',
    width: '100%',
    textAlign: 'left',
    alignItems: 'start',
    color: theme.palette.primary.main,
  },
  title: {
    [theme.breakpoints.up('md')]: {
      marginBottom: '10px',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '20px',
      marginTop: '10px',
      fontFamily: theme.typography.fontFamily,
    },
  },
  description: {
    color: theme.palette.grey.black,
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  numberOfPictures: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '12px',
      color: theme.palette.grey[82],
    },
  },
  divider: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  shared: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
    [theme.breakpoints.down('sm')]: {
      color: theme.palette.grey[82],
      fontSize: '12px',
      marginTop: '10px',
    },
  },
  imageGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.down('sm')]: {
      margin: '15px 0',
    },
  },
  imageList: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      flexWrap: 'nowrap',
      transform: 'translateZ(0)',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
  },
  imageListItem: {
    '& > div': {
      borderRadius: '10px',
    },
  },
  titleImage: {
    color: theme.palette.primary.light,
  },
  titleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  avatars: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  paperAlbumId: {
    padding: '20px',
    margin: '40px 0',
    [theme.breakpoints.down('sm')]: {
      backgroundColor: 'unset',
      boxShadow: 'unset',
      margin: '0 0 80px',
    },
  },
  titleAlbumId: {
    margin: '30px 0 20px',
    [theme.breakpoints.down('sm')]: {},
  },
  albumHeaderContainer: {
    display: 'grid',
    gridTemplate: '1fr / max-content 1fr max-content',
    gridGap: '10px',
    alignItems: 'center',
  },
  mainImageContainer: {
    position: 'relative',
    width: '100%',
  },
  mainImage: {
    width: '100%',
    borderRadius: '20px',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      '& img': {
        width: '90%',
        borderRadius: '10px',
      },
    },
  },
  mainContainerXs: {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
  },
  mainImageBack: {
    position: 'absolute',
    width: '100vw',
    height: '100vh',
    filter: 'blur(2.5rem)',
    top: '0',
    left: '0',
    zIndex: '-1',
    transform: 'scale(1.2)',
  },
  photoContainer: {
    transition: 'all .2s ease-in',
    '&:hover': {
      cursor: 'pointer',
      transform: 'scale(0.95)',
    },
  },
  photoXsContainer: {
    position: 'relative',
    top: '481px',
    width: '100%',
    transition: '0.2s linear',
    background: 'linear-gradient(360deg, #000000 0%, rgba(0, 0, 0, 0) 157.84%)',
    padding: '30px 20px',
  },
  photoDatePost: {
    [theme.breakpoints.down('sm')]: {
      fontFamily: theme.typography.fontFamily,
      color: theme.palette.secondary.constrastText,
      fontSize: '12px',
      marginBottom: '10px',
    },
  },
  photoUserName: {
    [theme.breakpoints.down('sm')]: {
      fontFamily: theme.typography.fontFamily,
      color: theme.palette.secondary.constrastText,
      fontSize: '18px',
      fontWeight: '500',
    },
  },
  prevNextContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    top: '50%',
    transform: 'translate(0, -50%)',
  },
  commentsBox: {
    display: 'grid',
    gridTemplate: '1fr / 1fr calc(100% - 55px)',
    margin: '20px 0 5px',
  },
  commentContainer: {
    backgroundColor: theme.palette.primary.ultraLight,
    padding: '10px',
    borderRadius: '10px',
  },
  likesTimer: {
    marginLeft: '55px',
  },
  photoDescription: {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: {
      color: theme.palette.secondary.constrastText,
      fontSize: '14px',
      fontFamily: theme.typography.fontFamily,
    },
  },
  likeBtn: {
    [theme.breakpoints.down('sm')]: {
      color: theme.palette.secondary.constrastText,
      backgroundColor: theme.palette.grey[33],
      borderRadius: '40px',
      fontSize: '14px',
      textTransform: 'capitalize',
      fontFamily: theme.typography.fontFamily,
    },
  },
  likeBtnFixed: {
    [theme.breakpoints.down('sm')]: {
      backgroundColor: theme.palette.secondary.likes,
      borderRadius: '40px',
      color: theme.palette.secondary.constrastText,
      marginBottom: '15px',
    },
  },
  squaredBtn: {
    textTransform: 'unset',
    fontWeight: '400',
    fontSize: '17px',
    color: `${theme.palette.grey[82]}!important`,
    marginLeft: theme.spacing(2),
  },
}))

const PhotosList = ({ photos, isAlbumPreview = false, id, setPhotoId }) => {
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))

  const handleColCalc = index => {
    if (matchesXs) {
      return 2
    }
    if (index === 0) {
      return 2
    }
    if (index % 6 === 0) {
      return 3
    }
    if (index % 3 === 0) {
      return 2
    }
    return 1
  }

  const handleRowCalc = () => {
    if (matchesXs) {
      return 2
    }
    return 1
  }

  return !isAlbumPreview && matchesXs ? (
    <Box className={classes.imageGroup}>
      <ImageList rowHeight={80} gap={8} className={classes.imageList} cols={4}>
        {arrayShuffle(photos).map(item => (
          <ImageListItem key={item.id} className={classes.imageListItem}>
            <img src={item.src} alt={item.title} />
            <ImageListItemBar
              title={item.title}
              classes={{
                root: classes.titleBar,
                title: classes.titleImage,
              }}
              actionIcon={
                <IconButton
                  aria-label={`star ${item.title}`}
                  size="large"
                  onClick={event => event.stopPropagation()}
                >
                  <StarBorderIcon className={classes.titleImage} />
                </IconButton>
              }
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  ) : (
    <Box className={classes.imageGroup}>
      <ImageList rowHeight={160} cols={matchesXs ? 4 : 6}>
        {arrayShuffle(photos).map((item, index) => (
          <ImageListItem
            key={item.id}
            cols={handleColCalc(index)}
            rows={handleRowCalc()}
            className={clsx({ [classes.photoContainer]: isAlbumPreview })}
            onClick={() => {
              if (isAlbumPreview) {
                setPhotoId(item.id)
              }
            }}
          >
            <img src={item.src} alt={item.title} />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  )
}

const Photos = ({ tripId }) => {
  const classes = useStyles()
  const history = useHistory()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  const { user } = useContext(SessionContext)
  const [albumId, setAlbumId] = useState('')
  const [photoId, setPhotoId] = useState('')

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const album = urlParams.get('album')
    const photo = urlParams.get('photo')
    if (album) {
      setAlbumId(album)
    }
    if (photo) {
      setPhotoId(photo)
    }
  }, [])

  useEffect(() => {
    if (photoId) {
      history.push(`/tripPage/${tripId}/photos?album=${albumId}&photo=${photoId}`)
    } else if (albumId) {
      history.push(`/tripPage/${tripId}/photos?album=${albumId}`)
    }
  }, [photoId])

  useEffect(() => {
    if (albumId) {
      history.push(`/tripPage/${tripId}/photos?album=${albumId}`)
    } else {
      history.push(`/tripPage/${tripId}/photos`)
    }
  }, [albumId])

  return albumId ? (
    photoId ? (
      matchesXs ? (
        <>
          <Box className={classes.mainContainerXs}>
            <Box
              style={{ backgroundImage: `url(${photoPage1})` }}
              className={classes.mainImageBack}
            />
            <Box
              display="flex"
              justifyContent="space-between"
              position="absolute"
              width="100%"
              p={2}
            >
              <Box>
                <IconButton size="large">
                  <img src={arrow} alt="" />
                </IconButton>
              </Box>
              <IconButton size="large">
                <img src={dots} alt="" />
              </IconButton>
            </Box>
            <Box className={classes.mainImage}>
              <img src={photoPage1} alt="" />
            </Box>
          </Box>
          <Box className={classes.photoXsContainer}>
            <Typography className={classes.photoUserName}>{user.firstname}</Typography>
            <Typography className={classes.photoDatePost}>20 septembre 2020</Typography>
            <Typography className={classes.photoDescription}>
              Regardez ça 😍 ! Photo prise lors d’une cérémonie d’une tribu Masaï au Kenya. Ça vous
              tente d’aller à leur rencontre ? On ne peut pas louper ça !
            </Typography>
            <Box display="flex" justifyContent="space-between">
              <Button
                variant="contained"
                className={classes.likeBtnFixed}
                startIcon={<FavoriteBorderIcon />}
              >
                3
              </Button>
              <Typography className={classes.photoDescription}>5 commentaires</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Button
                variant="contained"
                className={classes.likeBtn}
                startIcon={<FavoriteBorderIcon />}
              >
                J’aime
              </Button>
              <Button
                variant="contained"
                className={classes.likeBtn}
                startIcon={<FavoriteBorderIcon />}
              >
                Commenter
              </Button>
              <Button
                variant="contained"
                className={classes.likeBtn}
                startIcon={<FavoriteBorderIcon />}
              >
                Partager
              </Button>
            </Box>
          </Box>
        </>
      ) : (
        <Paper className={classes.paperAlbumId}>
          <Box className={classes.mainImageContainer}>
            <img
              src={fakePhotos.filter(fakePhoto => fakePhoto.id === photoId)[0].src}
              alt=""
              className={classes.mainImage}
            />
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              position="absolute"
              top="0"
              width="100%"
            >
              <IconButton size="small" onClick={() => setPhotoId('')}>
                <img src={bigCross} alt="" />
              </IconButton>
              <IconButton size="small">
                <img src={expandBtn} alt="" />
              </IconButton>
            </Box>
            <Box className={classes.prevNextContainer}>
              <IconButton size="small">
                <img src={bigArrowRight} alt="" style={{ transform: 'scaleX(-1)' }} />
              </IconButton>
              <IconButton size="small">
                <img src={bigArrowRight} alt="" />
              </IconButton>
            </Box>
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex">
              <Box mr={2}>
                <Avatar src={user.avatar} />
              </Box>
              <Box>
                <Typography>{user.firstname}</Typography>
                <Box>20 septembre 2020</Box>
              </Box>
            </Box>
            <Box>
              <IconButton size="large">
                <img src={bigDots} alt="" />
              </IconButton>
            </Box>
          </Box>
          <Typography className={classes.photoDescription}>
            Regardez ça 😍 ! Photo prise dans la réserve du Masaï Mara. Ça vous tente ?! On ne peut
            pas louper ça...
          </Typography>
          <Divider />
          <Box display="flex" justifyContent="space-between" alignItems="center" my={1}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <img src={hartIcon} alt="" style={{ marginRight: '10px' }} />
              <Typography>Toi, Julie et 2 autres aiment ça</Typography>
            </Box>
            <Box display="flex">
              <Button
                variant="contained"
                // eslint-disable-next-line no-constant-condition
                color={true ? 'primary' : 'inherit'}
                // eslint-disable-next-line no-constant-condition
                startIcon={true ? <Favorite /> : <FavoriteBorder />}
                onClick={event => {
                  /* todo */
                }}
              >
                J&apos;aime
              </Button>
              <Button
                variant="contained"
                className={classes.squaredBtn}
                startIcon={<img src={coment} alt="" />}
                disableElevation
              >
                Commenter
              </Button>
            </Box>
          </Box>
          <Divider />
          <Box className={classes.commentsBox}>
            <Avatar src={user.avatar} />
            <Box className={classes.commentContainer}>
              <Typography>
                Waw ! T’as trouvé ça où ? On ne peux clairement pas aller au Kenya sans visiter le
                Masaï Mara. Belle trouvaille !
              </Typography>
            </Box>
          </Box>
          <Typography className={classes.likesTimer}>J’aime • il y a 2h</Typography>
        </Paper>
      )
    ) : (
      <Paper className={classes.paperAlbumId}>
        {matchesXs && (
          <Box display="flex" justifyContent="space-between" marginTop="25px">
            <Box>
              <img src={arrow} alt="" />
            </Box>
            <Box>
              <img src={dots} alt="" />
            </Box>
          </Box>
        )}
        <Box className={classes.albumHeaderContainer}>
          <IconButton onClick={() => setAlbumId('')} size="large">
            <ArrowBackIos style={{ transform: 'translate(5px ,0)' }} />
          </IconButton>
          <Typography variant="h1" component="h2" className={classes.titleAlbumId}>
            Photos partagées
          </Typography>
          <CustomAvatar persons={travelers} propsClasses={classes.avatars} />
        </Box>
        <PhotosList photos={fakePhotos} id={1} isAlbumPreview setPhotoId={setPhotoId} />
      </Paper>
    )
  ) : (
    <>
      <Box className={classes.mobileTitle}>
        <Typography className={classes.mobileTitleTypo}>Photos</Typography>
      </Box>
      <Paper className={classes.paper} component={ButtonBase} onClick={() => setAlbumId(1)}>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h1" component="h2" className={classes.title}>
            Photos partagées
          </Typography>
          <Box>
            <img src={download} alt="" />
          </Box>
        </Box>
        <Typography variant="body1" className={classes.description}>
          Le séjour a débuté ! Tous les voyageurs peuvent ajouter leurs photos ici.
        </Typography>
        <Typography className={classes.numberOfPictures}>10 photos</Typography>
        <PhotosList photos={fakePhotos} id={1} />
        <Divider className={classes.divider} />
        <Box display="flex" justifyContent="space-between" mt="10px">
          <Typography className={classes.shared}>Partagé | 4 personnes</Typography>
          <CustomAvatar persons={travelers} propsClasses={classes.avatars} />
        </Box>
      </Paper>
      {/* -------------------------------------------------- */}
      <Paper className={classes.paper} component={ButtonBase} onClick={() => setAlbumId(2)}>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h1" component="h2" className={classes.title}>
            Mon album
          </Typography>
          <Box>
            <img src={download} alt="" />
          </Box>
        </Box>
        <Typography variant="body1" className={classes.description}>
          Cet espace de partage est commun à l’ensemble des voyageurs de ton séjour. Ajoute des
          photos de lieux que tu souhaites visiter, d’activités qui t’intéressent, ou plus
          simplement de belles photos que tu souhaites partager.
        </Typography>
        <Typography className={classes.numberOfPictures}>12 photos</Typography>
        <PhotosList photos={fakePhotos} id={2} />
        <Divider className={classes.divider} />
        <Box display="flex" justifyContent="space-between" mt="10px">
          <Typography className={classes.shared}>Partagé | 4 personnes</Typography>
          <CustomAvatar persons={travelers} propsClasses={classes.avatars} />
        </Box>
      </Paper>
    </>
  )
}

export default Photos
