import React, { useContext, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import useTheme from '@mui/material/'

import makeStyles from '@mui/styles/makeStyles'
import Delete from '@mui/icons-material/Delete'
import PhotoCamera from '@mui/icons-material/PhotoCamera'

import { SessionContext } from '../../contexts/session'
import { SignupContext } from '../../contexts/signup'
import { FirebaseContext } from '../../contexts/firebase'
import Wrapper from './Wrapper'
import { returnFileSize } from '../../helper/functions'

import upAvatar from '../../images/signIn/upAvatar.svg'

const useStyles = makeStyles({
  avatar: {
    objectFit: 'cover',
    objectPosition: 'center',
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    cursor: 'pointer',
    zIndex: '1',
  },
})

const ThirdStep = () => {
  const history = useHistory()
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))

  const { user, setUser } = useContext(SessionContext)
  const { firestore, storage, timestampRef } = useContext(FirebaseContext)
  const { signup } = useContext(SignupContext)

  const inputFile = useRef(null)
  const [selectedFile, setSelectedFile] = useState()
  const [preview, setPreview] = useState(user.avatar)
  const [photoError, setPhotoError] = useState()

  const onSelectFile = event => {
    if (!event.target.files || event.target.files.length === 0) {
      setSelectedFile()
      return
    }

    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(event.target.files[0])
  }

  useEffect(() => {
    if (!selectedFile) {
      setPreview()
      return
    }
    if (selectedFile.size > 1048576 * 2) {
      setPhotoError(`L'image est trop lourde, celle la fait ${returnFileSize(selectedFile.size)}.`)
      setPreview()
      setSelectedFile()
      return
    }
    setPhotoError()
    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

  useEffect(() => {
    if (user?.avatar) {
      setPreview(user.avatar)
    }
  }, [user])

  const handleDelete = () => {
    if (user.avatar) {
      const avatarRef = storage.ref().child(`avatars/${user.id}`)
      avatarRef.delete().then(async () => {
        await firestore
          .collection('users')
          .doc(user.id)
          .set({ avatar: null, updatedAt: new timestampRef.fromDate(new Date()) }, { merge: true })
        setPreview()
        setSelectedFile()
      })
    } else {
      setPreview()
      setSelectedFile()
    }
    if (photoError) {
      setPhotoError()
    }
  }

  const handleContinue = async () => {
    if (selectedFile) {
      setUser({ ...user, avatar: selectedFile })
      const avatar = selectedFile
      const storageRef = storage.ref()
      const avatarRef = storageRef.child(`avatars/${user.id}`)
      await avatarRef.put(avatar)
      const avatarUrl = await avatarRef.getDownloadURL()
      await firestore
        .collection('users')
        .doc(user.id)
        .set(
          { avatar: avatarUrl, updatedAt: new timestampRef.fromDate(new Date()) },
          { merge: true }
        )
    }
    history.push('/signup/fourthStep')
  }

  return (
    <Wrapper
      currentStep="2"
      title="Avec une photo, c’est plus sympa"
      subtitle={
        matchesXs
          ? 'Elle permettra à vos amis de vous retrouver facilement'
          : "Une photo de profil qui montre votre visage peut aider d'autres voyageurs à mieux vous connaître, et c’est toujours plus chaleureux que l’avatar par défaut ! Elle permettra à vos amis de vous retrouver facilement"
      }
      backURL="/signup/secondStep"
    >
      <Box display="flex" m={5} flexDirection={matchesXs ? 'column' : 'row'}>
        <Box>
          <input
            hidden
            ref={inputFile}
            id="file-upload-input"
            type="file"
            onChange={onSelectFile}
            accept=".jpg,.JPG,.jpeg,.JPEG,.png,.PNG"
          />
          <Box
            component="label"
            htmlFor="file-upload-input"
            sx={{
              width: '150px',
              height: '150px',
              [theme.breakpoints.down('sm')]: {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
              },
            }}
          >
            <Box>
              {preview ? (
                <img src={preview} className={classes.avatar} alt="" />
              ) : (
                <img src={upAvatar} className={classes.avatar} alt="" />
              )}
            </Box>
          </Box>
          <Typography variant="h5" align="center">
            {signup.firstname}
          </Typography>
        </Box>
        <Box ml={matchesXs ? 0 : 4}>
          {!matchesXs && (
            <Typography>
              La taille du fichier ne doit pas excéder 2 Mo. Les formats acceptés sont : JPG / PNG
            </Typography>
          )}
          {photoError && (
            <Typography variant="h6" color="secondary">
              {photoError}
            </Typography>
          )}
          <Box display="flex" alignItems="center" flexDirection={matchesXs ? 'column' : 'row'}>
            <Box mr={matchesXs ? 0 : 4}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<PhotoCamera />}
                onClick={() => inputFile.current.click()}
              >
                Ajouter une photo
              </Button>
            </Box>
            {selectedFile && preview && (
              <Button color="secondary" startIcon={<Delete />} onClick={handleDelete}>
                Supprimer la photo
              </Button>
            )}
          </Box>
        </Box>
      </Box>
      <Box display="flex" alignItems="center" flexDirection={matchesXs ? 'column' : 'row'}>
        <Box mr={matchesXs ? 0 : 4}>
          <Button
            size="large"
            variant="contained"
            color="primary"
            onClick={handleContinue}
            disabled={photoError || (!selectedFile && !preview)}
            sx={{
              [theme.breakpoints.down('sm')]: {
                borderRadius: '50px',
                fontSize: '22px',
                textTransform: 'unset',
              },
            }}
          >
            Continuer
          </Button>
        </Box>
        {!selectedFile && !preview && (
          <Button
            size="small"
            onClick={() => history.push('/signup/fourthStep')}
            sx={{
              [theme.breakpoints.down('sm')]: {
                borderRadius: '50px',
                fontSize: '14px',
                textTransform: 'unset',
                marginTop: '30px',
              },
            }}
          >
            Ignorer cette étape
          </Button>
        )}
      </Box>
    </Wrapper>
  )
}

export default ThirdStep
