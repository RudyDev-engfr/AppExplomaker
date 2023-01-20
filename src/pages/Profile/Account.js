import React, { useContext, useEffect, useState } from 'react'
import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardActionArea,
  CardMedia,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import { useHistory } from 'react-router-dom'
import { ArrowBackIos, Check, Visibility, VisibilityOff } from '@mui/icons-material'
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded'
import { MobileDatePicker } from '@mui/lab'
import clsx from 'clsx'
import MuiModal from '@mui/material/Modal'
import { toast } from 'react-toastify'
import Carousel from 'react-multi-carousel'

import { SessionContext } from '../../contexts/session'
import { arrayShuffle, filterObjectByValue, rCTFF } from '../../helper/functions'
import { emailAuthProvider, FirebaseContext } from '../../contexts/firebase'
import Footer from '../../components/molecules/Footer'
import Nav from '../../components/molecules/Nav'
import Modal from '../../components/molecules/Modal'
import Camera from '../../components/molecules/Camera'
import AvatarEditor from '../../components/molecules/AvatarEditor'
import { PasswordResetModal } from '../../components/molecules/AuthModals'
import Head from '../../components/molecules/Head'
import ProfileModal from '../../components/molecules/ProfileModal'

const useStyles = makeStyles(theme => ({
  mainContainer: {
    backgroundColor: theme.palette.grey.f7,
    width: '100%',
    height: '100%',
    paddingTop: '1px',
    marginTop: '80px',
    [theme.breakpoints.down('sm')]: {
      marginTop: 'unset',
    },
  },
  container: {
    width: '1220px',
    margin: '50px auto',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      margin: '0',
      padding: '112px 20px 90px',
    },
  },
  breadcrumbsContent: { margin: '20px 0' },
  breadcrumbsBtn: {
    textTransform: 'none',
    fontSize: '16px',
    color: theme.palette.grey['33'],
    padding: '0',
    minWidth: 'unset',
  },
  mainTitle: {
    fontSize: '28px',
    fontWeight: '500',
  },
  gridContainer: {
    margin: '45px 0 80px',
    display: 'grid',
    gridTemplate: 'auto / 1fr 1fr 1fr',
    gridGap: '20px',
    alignItems: 'start',
    [theme.breakpoints.down('sm')]: {
      gridTemplate: 'auto / 1fr',
    },
  },
  papers: {
    padding: '25px 20px 30px',
  },
  paperTitle: {
    fontSize: '22px',
    color: theme.palette.primary.dark,
    marginBottom: '30px',
  },
  avatar: {
    width: '80px',
    height: '80px',
    marginRight: '20px',
  },
  boldText: {
    fontWeight: 'bold',
    marginTop: '10px',
  },
  returnBtn: { position: 'absolute', top: '47px', left: '5px' },
  paperSubtitle: {
    fontSize: '17px',
    color: theme.palette.grey['4f'],
  },
  modifyBtn: {
    textDecoration: 'underline',
    textTransform: 'none',
    fontSize: '17px',
    color: theme.palette.grey['33'],
    fontWeight: '400',
    padding: '0',
    '&:hover': {
      textDecoration: 'underline',
      color: theme.palette.grey.black,
    },
  },
  textFieldContainer: {
    marginTop: '20px',
  },
  textField: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '17px',
      fontWeight: '400',
    },
  },
  textFieldLabel: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '14px',
      paddingTop: '15px',
    },
  },
  modalBtn: {
    backgroundColor: theme.palette.primary.main,
    margin: '30px 0',
    padding: '20px 0',
    borderRadius: '50px',
    textTransform: 'none',
    fontSize: '22px',
    fontWeight: '500',
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
  },
  travelPflBtnContainer: {
    display: 'flex',
    gap: '15px',
    width: 'max-content',
    padding: '0 32px',
  },
  travelerProfileTitle: {
    fontSize: '18px',
    fontWeight: '500',
    color: theme.palette.grey[33],
    margin: '10px 0 16px',
    [theme.breakpoints.down('sm')]: {
      margin: '50px 0 16px',
    },
  },
  travelerProfileBtn: {
    display: 'flex',
    flexDirection: 'column',
    textTransform: 'none',
    width: '170px',
    height: '117px',
    borderRadius: '10px',
    backgroundColor: theme.palette.grey.f7,
    color: theme.palette.grey['4f'],
    '&:hover': {
      color: theme.palette.primary.contrastText,
    },
  },
  travelerProfileBtnActive: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  pictureModal: {
    display: 'flex',
    position: 'fixed',
    bottom: '0',
    flexDirection: 'column',
    width: 'calc(100% - 40px)',
    margin: '0 20px 40px',
    '& button': {
      backgroundColor: theme.palette.primary.contrastText,
      height: '62px',
      color: theme.palette.primary.main,
      textTransform: 'none',
      fontSize: '18px',
      '&:hover': {
        color: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.primary.light,
      },
    },
    '& button:nth-child(1)': {
      borderRadius: '20px 20px 0 0',
      borderBottom: '1px solid rgba(17, 17, 17, 0.25)',
      fontWeight: '400',
    },
    '& button:nth-child(2)': {
      borderRadius: '0 0 20px 20px',
      fontWeight: '400',
    },
    '& button:nth-child(3)': {
      borderRadius: '20px',
      marginTop: '10px',
    },
    [theme.breakpoints.up('sm')]: {
      width: 'calc(100% - 800px)',
      margin: '0 400px 80px',
    },
  },
  pictureBtn: {
    fontSize: '17px',
    fontWeight: '400',
    textTransform: 'none',
    color: theme.palette.grey[33],
    textDecoration: 'underline',
  },
  invisibleButton: {
    textTransform: 'none',
    '&:hover': {
      backgroundColor: 'unset',
      color: '#008481',
    },
  },
}))

const iconTypes = ['🚗', '🚆', '🚗']
const iconRanges = ['⏱', '⏳', '⏱']

const Account = () => {
  const history = useHistory()
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))

  const { user } = useContext(SessionContext)
  const { auth, dictionary, firestore, timestampRef } = useContext(FirebaseContext)

  const [type, setType] = useState()
  const [allTypes, setAllTypes] = useState([])
  const [rangeType, setRangeType] = useState()
  const [allRanges, setAllRanges] = useState([])
  const [likes, setLikes] = useState({})
  const [allLikes, setAllLikes] = useState([])
  const [openModal, setOpenModal] = useState('')
  const [firstname, setFirstname] = useState(user.firstname)
  const [lastname, setLastname] = useState(user.lastname)
  const [gender, setGender] = useState(user.gender)
  const [birthdate, setBirthdate] = useState()
  const [newEmail, setNewEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPassword2, setNewPassword2] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [isPictureModalOpen, setIsPictureModalOpen] = useState(false)
  const [imageSrc, setImageSrc] = useState()
  const [needSave, setNeedSave] = useState(false)
  const [isFromCamera, setIsFromCamera] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  useEffect(() => {
    if (dictionary.meta_voyageur_type) {
      const arrayOfAllTypes = Object.entries(dictionary.meta_voyageur_type)
      const tempAllTypes = arrayOfAllTypes.map(currentType => ({
        value: currentType[0],
        label: currentType[1].name,
      }))
      setAllTypes(tempAllTypes)
      if (user.type) {
        const tempType = tempAllTypes.filter(currentType => currentType.value === user.type)[0]
        setType(tempType.value)
      } else {
        setType()
      }
    }
    if (dictionary.meta_duree_voyage) {
      const arrayOfAllDurations = Object.entries(dictionary.meta_duree_voyage)
      const tempAllDurations = arrayOfAllDurations.map(duration => ({
        value: duration[0],
        label: duration[1].name,
      }))
      setAllRanges(tempAllDurations)
      if (user.rangeType) {
        const tempDuration = tempAllDurations.filter(
          currentRangeType => currentRangeType.value === user.rangeType
        )[0]
        setRangeType(tempDuration.value)
      } else {
        setRangeType()
      }
    }

    if (dictionary.meta_name_envies_sport) {
      const tempAllLikes = dictionary.meta_name_envies_sport

      let shuffledLikes = []
      if (allLikes.length > 0) {
        shuffledLikes = allLikes
      } else {
        shuffledLikes = arrayShuffle(tempAllLikes)
        setAllLikes(shuffledLikes)
      }

      if (user.likes) {
        const tempTravelerLikes = {}
        shuffledLikes.forEach(option => {
          if (user.likes.includes(option.value)) {
            tempTravelerLikes[option.value] = true
          } else {
            tempTravelerLikes[option.value] = false
          }
        })
        setLikes(tempTravelerLikes)
      } else {
        const tempTravelerLikes = {}
        shuffledLikes.forEach(option => {
          tempTravelerLikes[option.value] = false
        })
        setLikes(tempTravelerLikes)
      }
    }
    if (user.birthdate) {
      setBirthdate(rCTFF(user.birthdate))
    }
  }, [dictionary, user])

  useEffect(() => {
    if (emailError) {
      setEmailError('')
    }
  }, [newEmail])

  useEffect(() => {
    if (passwordError) {
      setPasswordError('')
    }
  }, [password])

  const handleUpdate = data => {
    firestore
      .collection('users')
      .doc(user.id)
      .set(
        {
          ...data,
          updatedAt: new timestampRef.fromDate(new Date()),
        },
        { merge: true }
      )
  }

  const onSelectFile = event => {
    if (!event.target.files || event.target.files.length === 0) {
      setImageSrc()
      return
    }

    // I've kept this example simple by using the first image instead of multiple
    setImageSrc(event.target.files[0])
    setOpenModal('avatarEditor')
  }

  return (
    <>
      <Head title="Mon Compte" />
      <Nav />
      <Box className={classes.mainContainer}>
        <Box className={classes.container}>
          <Box>
            {matchesXs && (
              <IconButton
                className={classes.returnBtn}
                onClick={() => history.push('/profile')}
                size="large"
              >
                <ArrowBackIos style={{ transform: 'translate(5px ,0)' }} />
              </IconButton>
            )}
            {!matchesXs && (
              <Breadcrumbs
                className={classes.breadcrumbsContent}
                separator={<NavigateNextRoundedIcon fontSize="small" />}
                aria-label="breadcrumb"
              >
                <Button className={classes.breadcrumbsBtn} onClick={() => history.push('/profile')}>
                  Profil
                </Button>
                <Button className={classes.breadcrumbsBtn} onClick={() => history.push('/account')}>
                  Mon compte
                </Button>
              </Breadcrumbs>
            )}
          </Box>
          <Typography className={classes.mainTitle} component="h1">
            Mon compte
          </Typography>
          <Box className={classes.gridContainer}>
            <Box>
              <Paper className={classes.papers} sx={{ marginBottom: '20px' }}>
                <Typography component="h5" className={classes.paperTitle}>
                  Photo de profil
                </Typography>
                <Box display="flex" alignItems="center">
                  <Avatar src={user.avatar} className={classes.avatar} />
                  <Button
                    className={classes.pictureBtn}
                    onClick={() => setIsPictureModalOpen(true)}
                  >
                    Mettre à jour la photo
                  </Button>
                </Box>
              </Paper>
              <Paper className={classes.papers}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Typography component="h5" className={classes.paperTitle}>
                    Infos personnelles
                  </Typography>
                  <Button
                    disableRipple
                    className={classes.modifyBtn}
                    onClick={() => setOpenModal('infoPerso')}
                  >
                    Modifier
                  </Button>
                </Box>
                <Typography component="h6" className={classes.paperSubtitle}>
                  Prénom
                </Typography>
                <Typography component="h6" className={classes.boldText}>
                  {user.firstname}
                </Typography>
                <Divider flexItem sx={{ margin: '25px 0' }} />
                <Typography component="h6" className={classes.paperSubtitle}>
                  Nom
                </Typography>
                <Typography component="h6" className={classes.boldText}>
                  {user.lastname}
                </Typography>
                <Divider flexItem sx={{ margin: '25px 0' }} />
                <Typography component="h6" className={classes.paperSubtitle}>
                  Genre
                </Typography>
                <Typography component="h6" className={classes.boldText}>
                  {user.gender === 'female'
                    ? 'Femme'
                    : user.gender === 'male'
                    ? 'Homme'
                    : user.gender === 'n/a'
                    ? 'Non renseigné'
                    : null}
                </Typography>
                <Divider flexItem sx={{ margin: '25px 0' }} />
                <Typography component="h6" className={classes.paperSubtitle}>
                  Date de naissance
                </Typography>
                <Typography component="h6" className={classes.boldText}>
                  {user.birthdate ? rCTFF(user.birthdate, 'dd/MM/yyyy') : 'Non renseigné'}
                </Typography>
              </Paper>
            </Box>
            <Paper className={classes.papers}>
              <Typography component="h5" className={classes.paperTitle}>
                Identifiants
              </Typography>
              <Box display="flex" justifyContent="space-between">
                <Typography component="h6" className={classes.paperSubtitle}>
                  Email
                </Typography>
                <Button
                  disableRipple
                  className={classes.modifyBtn}
                  onClick={() => {
                    setNewEmail('')
                    setPassword('')
                    setOpenModal('email')
                  }}
                >
                  Modifier
                </Button>
              </Box>
              <Typography className={classes.boldText}>{user.email}</Typography>
              <Divider flexItem sx={{ margin: '25px 0' }} />
              <Box display="flex" justifyContent="space-between">
                <Typography component="h6" className={classes.paperSubtitle}>
                  Mot de passe
                </Typography>
                <Button
                  disableRipple
                  className={classes.modifyBtn}
                  onClick={() => {
                    setNewPassword('')
                    setNewPassword2('')
                    setOpenModal('password')
                  }}
                >
                  Modifier
                </Button>
              </Box>
              <Typography className={classes.boldText}>•••••••••••••••••</Typography>
            </Paper>
            <Paper className={classes.papers}>
              <Box display="flex" justifyContent="space-between">
                <Typography component="h5" className={classes.paperTitle}>
                  Profil voyageur
                </Typography>
                <Button
                  disableRipple
                  className={classes.modifyBtn}
                  onClick={() => setOpenModal('profilVoyageur')}
                >
                  Modifier
                </Button>
              </Box>
              <Typography>Type de voyageur</Typography>
              <Typography className={classes.boldText}>
                {(user.type &&
                  allTypes.length &&
                  allTypes.filter(currentType => currentType.value === user.type)[0].label) ||
                  'Non renseigné'}
              </Typography>
              <Divider flexItem sx={{ margin: '25px 0' }} />
              <Typography>Durée préférée</Typography>
              <Typography className={classes.boldText}>
                {(user.rangeType &&
                  allRanges.length &&
                  allRanges.filter(currentRangeType => currentRangeType.value === user.rangeType)[0]
                    .label) ||
                  'Non renseigné'}
              </Typography>
              <Divider flexItem sx={{ margin: '25px 0' }} />
              <Typography>Tu aimes</Typography>
              {(user.likes &&
                allLikes.length &&
                allLikes
                  .filter(currentLike => user.likes.includes(currentLike.value))
                  .map(currentLike => (
                    <Typography sx={{ fontWeight: 'bold' }}>{currentLike.label}</Typography>
                  ))) || <Typography sx={{ fontWeight: 'bold' }}>Non renseigné</Typography>}
            </Paper>
          </Box>
        </Box>
        <Footer />
        <MuiModal open={isPictureModalOpen} onClose={() => setIsPictureModalOpen(false)}>
          <Box className={classes.pictureModal}>
            <Button
              onClick={() => {
                setIsFromCamera(true)
                setOpenModal('camera')
              }}
            >
              Prenez une photo
            </Button>
            <Button>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <Box component="label" htmlFor="icon-button-file" sx={{ cursor: 'pointer' }}>
                <input
                  accept="image/*"
                  id="icon-button-file"
                  type="file"
                  hidden
                  onChange={event => {
                    setIsFromCamera(false)
                    onSelectFile(event)
                  }}
                />
                Choisir une photo
              </Box>
            </Button>
            <Button onClick={() => setIsPictureModalOpen(false)}>Annuler</Button>
          </Box>
        </MuiModal>
        <Modal
          modalName="infoPerso"
          openModal={openModal}
          setOpenModal={setOpenModal}
          hasValidation={false}
          title="Infos personnelles"
          submitHandler={() => {
            const tempData = { firstname, lastname }
            if (gender) {
              tempData.gender = gender
            }
            if (birthdate) {
              tempData.birthdate = birthdate
            }
            handleUpdate({ ...tempData })
          }}
        >
          <TextField
            InputProps={{ className: classes.textField }}
            InputLabelProps={{ className: classes.textFieldLabel }}
            label="Prénom"
            type="text"
            variant="filled"
            value={firstname}
            onChange={event => setFirstname(event.target.value)}
            fullWidth
            className={classes.textFieldContainer}
          />
          <TextField
            InputProps={{ className: classes.textField }}
            InputLabelProps={{ className: classes.textFieldLabel }}
            label="Nom"
            type="text"
            variant="filled"
            value={lastname}
            onChange={event => setLastname(event.target.value)}
            fullWidth
            className={classes.textFieldContainer}
          />
          <FormControl component="fieldset" required>
            <RadioGroup
              row
              aria-label="gender"
              name="gender"
              value={gender}
              onChange={event => setGender(event.target.value)}
              sx={{ margin: '20px 0 0 5px' }}
            >
              <FormControlLabel value="female" control={<Radio />} label="Madame" />
              <FormControlLabel value="male" control={<Radio />} label="Monsieur" />
              <FormControlLabel value="n/a" control={<Radio />} label="Non renseigné" />
            </RadioGroup>
          </FormControl>
          <MobileDatePicker
            disableFuture
            openTo="year"
            format="dd/MM/yyyy"
            views={['year', 'month', 'day']}
            label="Date de naissance"
            value={birthdate}
            onChange={event => setBirthdate(event)}
            DialogProps={{ sx: { zIndex: '10001' } }}
            renderInput={params => (
              <TextField
                className={classes.textFieldContainer}
                variant="filled"
                fullWidth
                InputProps={{ className: classes.textField }}
                InputLabelProps={{ className: classes.textFieldLabel }}
                {...params}
              />
            )}
          />
          <Button type="submit" fullWidth className={classes.modalBtn}>
            Mettre à jour
          </Button>
        </Modal>
        <Modal
          modalName="email"
          openModal={openModal}
          setOpenModal={setOpenModal}
          hasValidation={false}
          title="Adresse email"
          submitHandler={() => {
            const credential = emailAuthProvider.credential(user.email, password)

            auth
              .signInWithCredential(credential)
              .then(({ user: signedUser }) => {
                signedUser.updateEmail(newEmail).then(() => {
                  firestore
                    .collection('users')
                    .doc(user.id)
                    .update({ email: newEmail, updatedAt: new timestampRef.fromDate(new Date()) })
                    .then(() => {
                      const newCredential = emailAuthProvider.credential(newEmail, password)
                      auth.signInWithCredential(newCredential).then(() => {
                        signedUser.sendEmailVerification()
                        toast.success('Adresse email mise a jour !')
                        setOpenModal('')
                      })
                    })
                })
              })
              .catch(({ code }) => {
                if (code === 'auth/wrong-password') {
                  setPasswordError('Mot de passe invalide')
                } else {
                  setEmailError('Erreur inconnue')
                }
              })
          }}
          preventCloseOnSubmit
        >
          <Typography sx={{ margin: '30px 0 10px', fontSize: '17px' }}>
            Pour mettre à jour ton adresse e-mail, renseignes ton mot de passe. Nous t’enverrons un
            e-mail afin de confirmer ta nouvelle adresse e-mail.
          </Typography>
          <TextField
            InputProps={{ className: classes.textField }}
            InputLabelProps={{ className: classes.textFieldLabel }}
            label="Nouvelle adresse e-mail"
            type="email"
            variant="filled"
            value={newEmail}
            onChange={event => setNewEmail(event.target.value)}
            fullWidth
            className={classes.textFieldContainer}
            required
            error={!!emailError}
            helperText={emailError}
          />
          <TextField
            InputProps={{
              className: classes.textField,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            InputLabelProps={{ className: classes.textFieldLabel }}
            label="Mot de passe"
            type={showPassword ? 'text' : 'password'}
            variant="filled"
            value={password}
            onChange={event => setPassword(event.target.value)}
            fullWidth
            error={!!passwordError}
            helperText={passwordError}
            className={classes.textFieldContainer}
            required
          />
          <Button
            type="submit"
            fullWidth
            className={classes.modalBtn}
            disabled={password.length < 6 || newEmail.length < 1}
          >
            Mettre à jour
          </Button>
        </Modal>
        <Modal
          modalName="password"
          openModal={openModal}
          setOpenModal={setOpenModal}
          hasValidation={false}
          title="Mot de passe"
          submitHandler={() => {
            const credential = emailAuthProvider.credential(user.email, password)

            auth
              .signInWithCredential(credential)
              .then(({ user: signedUser }) => {
                signedUser
                  .updatePassword(newPassword)
                  .then(() => toast.success('Mot de passe mis a jour !'))
              })
              .catch(({ code }) => {
                if (code === 'auth/wrong-password') {
                  setPasswordError('Mot de passe invalide')
                }
              })
          }}
          preventCloseOnSubmit
        >
          <TextField
            InputProps={{
              className: classes.textField,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            InputLabelProps={{ className: classes.textFieldLabel }}
            label="Mot de passe actuel"
            type={showPassword ? 'text' : 'password'}
            variant="filled"
            error={!!passwordError}
            helperText={passwordError}
            value={password}
            onChange={event => setPassword(event.target.value)}
            fullWidth
            className={classes.textFieldContainer}
            required
          />
          <Button
            onClick={() => setOpenModal('pwdReset')}
            disableRipple
            className={classes.invisibleButton}
            sx={{ mt: '20px' }}
          >
            {matchesXs ? "J'ai oublié mon mot de passe" : 'Mot de passe oublié ?'}
          </Button>
          <TextField
            InputProps={{
              className: classes.textField,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    edge="end"
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            InputLabelProps={{ className: classes.textFieldLabel }}
            label="Nouveau mot de passe"
            type={showNewPassword ? 'text' : 'password'}
            variant="filled"
            value={newPassword}
            onChange={event => setNewPassword(event.target.value)}
            fullWidth
            className={classes.textFieldContainer}
            required
          />
          <TextField
            InputProps={{
              className: classes.textField,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    edge="end"
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            InputLabelProps={{ className: classes.textFieldLabel }}
            label="Confirmer le mot de passe"
            type={showNewPassword ? 'text' : 'password'}
            variant="filled"
            value={newPassword2}
            onChange={event => setNewPassword2(event.target.value)}
            fullWidth
            className={classes.textFieldContainer}
            required
          />
          <Button
            type="submit"
            fullWidth
            className={classes.modalBtn}
            disabled={newPassword.length < 6 || password.length < 6 || newPassword !== newPassword2}
          >
            Mettre à jour
          </Button>
        </Modal>
        <ProfileModal
          modalName="profilVoyageur"
          openModal={openModal}
          setOpenModal={setOpenModal}
          title="Profil voyageur"
          submitHandler={() => {
            const filteredLikes = filterObjectByValue(likes, true)
            const tempLikes = Object.keys(filteredLikes)
            handleUpdate({ type, rangeType, likes: tempLikes })
          }}
        >
          <Typography className={classes.travelerProfileTitle}>Tu es un voyageur :</Typography>
          <Box
            sx={{
              overflowX: 'scroll',
              margin: '0 -32px',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
            }}
          >
            <Box className={classes.travelPflBtnContainer}>
              {allTypes.map((currentType, typeIndex) => (
                <Button
                  key={currentType.value}
                  variant="contained"
                  disableElevation
                  className={clsx(classes.travelerProfileBtn, {
                    [classes.travelerProfileBtnActive]: type === currentType.value,
                  })}
                  onClick={() => setType(currentType.value)}
                >
                  <Typography sx={{ fontSize: '38px' }}>{iconTypes[typeIndex]}</Typography>
                  <Typography sx={{ marginTop: '10px', fontSize: '17px' }}>
                    {currentType.label}
                  </Typography>
                </Button>
              ))}
            </Box>
          </Box>
          <Typography className={classes.travelerProfileTitle}>
            Tu pars généralement pour :
          </Typography>
          <Box
            sx={{
              overflowX: 'scroll',
              margin: '0 -32px',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
            }}
          >
            <Box className={classes.travelPflBtnContainer}>
              {allRanges.map((currentRange, rangeIndex) => (
                <Button
                  key={currentRange.value}
                  variant="contained"
                  disableElevation
                  className={clsx(classes.travelerProfileBtn, {
                    [classes.travelerProfileBtnActive]: rangeType === currentRange.value,
                  })}
                  onClick={() => setRangeType(currentRange.value)}
                >
                  <Typography sx={{ fontSize: '38px' }}>{iconRanges[rangeIndex]}</Typography>
                  <Typography sx={{ marginTop: '10px', fontSize: '17px' }}>
                    {currentRange.label}
                  </Typography>
                </Button>
              ))}
            </Box>
          </Box>
          <Typography className={classes.travelerProfileTitle}>En voyage, tu aimes :</Typography>
          <Box
            sx={{
              overflowX: 'scroll',
              margin: '0 -32px',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
            }}
          >
            <Box
              component={Carousel}
              partialVisible
              responsive={{
                desktop: {
                  breakpoint: {
                    max: 8000,
                    min: 640,
                  },
                  items: 5,
                  partialVisibilityGutter: 15,
                },
                mobile: {
                  breakpoint: {
                    max: 640,
                    min: 0,
                  },
                  items: 2,
                  partialVisibilityGutter: 10,
                },
              }}
              slidesToSlide={matchesXs ? 1 : 4}
              removeArrowOnDeviceType="mobile"
            >
              {allLikes.map(currentLike => (
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  key={currentLike.value}
                >
                  <Card
                    key={currentLike.value}
                    elevation={0}
                    sx={{
                      width: 170,
                      borderRadius: '10px',
                      position: 'relative',
                      border: likes[currentLike.value]
                        ? `4px solid ${theme.palette.primary.main}`
                        : `none`,
                    }}
                  >
                    <CardActionArea
                      onClick={() =>
                        setLikes({ ...likes, [currentLike.value]: !likes[currentLike.value] })
                      }
                    >
                      <CardMedia
                        component="img"
                        height={likes[currentLike.value] ? '109px' : '117px'}
                        image={currentLike.picture}
                        alt=""
                      />
                      <Box
                        sx={{
                          width: '30px',
                          height: '30px',
                          position: 'absolute',
                          top: '15px',
                          left: '15px',
                          backgroundColor: likes[currentLike.value] ? 'primary.main' : 'grey.df',
                          border: `2px solid ${
                            likes[currentLike.value] ? theme.palette.primary.main : 'white'
                          }`,
                          borderRadius: '5px',
                          color: 'primary.contrastText',
                        }}
                      >
                        {likes[currentLike.value] && <Check color="inherit" />}
                      </Box>
                    </CardActionArea>
                  </Card>
                  <Typography
                    sx={{ mt: 2 }}
                    dangerouslySetInnerHTML={{ __html: currentLike.label }}
                  />
                </Box>
              ))}
            </Box>
          </Box>
          <Button type="submit" fullWidth className={classes.modalBtn}>
            Enregistrer
          </Button>
        </ProfileModal>
        <Modal
          modalName="camera"
          openModal={openModal}
          setOpenModal={setOpenModal}
          hasValidation={false}
          title="Cheeeeeese !"
        >
          <Camera setOpenModal={setOpenModal} imageSrc={imageSrc} setImageSrc={setImageSrc} />
        </Modal>
        <Modal
          modalName="avatarEditor"
          openModal={openModal}
          setOpenModal={setOpenModal}
          hasValidation={false}
          title="Recadrer"
          customHeader={
            <Box
              display="flex"
              justifyContent="space-between"
              textAlign="centers"
              margin="40px 20px 20px"
            >
              <Button
                sx={{
                  fontSize: '20px',
                  color: theme.palette.primary.main,
                  textTransform: 'unset',
                  padding: '0',
                  fontWeight: '400',
                }}
                onClick={() => {
                  setImageSrc()
                  setOpenModal(isFromCamera ? 'camera' : '')
                }}
              >
                Annuler
              </Button>
              <Typography
                sx={{ fontSize: '22px', fontWeight: '500', color: theme.palette.grey['33'] }}
              >
                Recadrer
              </Typography>
              <Button
                sx={{
                  fontSize: '20px',
                  color: theme.palette.primary.main,
                  textTransform: 'unset',
                  padding: '0',
                  fontWeight: '400',
                }}
                onClick={() => setNeedSave(true)}
              >
                Terminer
              </Button>
            </Box>
          }
        >
          <AvatarEditor
            needSave={needSave}
            setNeedSave={setNeedSave}
            image={imageSrc}
            setImageSrc={setImageSrc}
            setOpenModal={setOpenModal}
            setIsPictureModalOpen={setIsPictureModalOpen}
          />
        </Modal>
      </Box>
      <PasswordResetModal modalState={openModal} modalStateSetter={setOpenModal} isFromAccount />
    </>
  )
}

export default Account
