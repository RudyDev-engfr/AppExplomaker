import React, { useContext, useEffect, useRef, useState } from 'react'
import ReactAvatarEditor from 'react-avatar-editor'
import { IconButton, Box, useTheme } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'

import { FirebaseContext } from '../../contexts/firebase'
import { SessionContext } from '../../contexts/session'

import rotateImg from '../../images/icons/rotate.svg'

const useStyles = makeStyles({
  avatarEditor: {
    width: '100%!important',
    height: 'unset!important',
  },
})

const AvatarEditor = ({
  image,
  setImageSrc,
  needSave,
  setNeedSave,
  setOpenModal,
  setIsPictureModalOpen,
}) => {
  const classes = useStyles()
  const theme = useTheme()
  const { user, setUser } = useContext(SessionContext)
  const { firestore, storage, timestampRef } = useContext(FirebaseContext)
  const editorRef = useRef(null)

  const [rotate, setRotate] = useState(0)

  const getImg = () => {
    if (editorRef.current) {
      // This returns a HTMLCanvasElement, it can be made into a data URL or a blob,
      // drawn on another canvas, or added to the DOM.
      const canvas = editorRef.current.getImage()

      // If you want the image resized to the canvas size (also a HTMLCanvasElement)
      // const canvasScaled = editorRef.current.getImageScaledToCanvas()
      canvas.toBlob(blobImg => setImageSrc(blobImg), 'image/jpeg', 1)
    }
  }

  const uploadAndUpdate = async () => {
    if (image) {
      const avatar = image
      setUser({ ...user, avatar })
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
  }

  useEffect(() => {
    if (needSave) {
      getImg()
      uploadAndUpdate()
      setRotate(0)
      setNeedSave(false)
      setIsPictureModalOpen(false)
      setOpenModal('')
    }
  }, [needSave])

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{ [theme.breakpoints.down('sm')]: { marginTop: '100px' } }}
    >
      <ReactAvatarEditor
        ref={editorRef}
        className={classes.avatarEditor}
        image={image}
        border={0}
        color={[255, 255, 255, 0.6]}
        backgroundColor={[0, 255, 255, 1]}
        scale={1}
        rotate={rotate}
        borderRadius={125}
      />
      <IconButton
        sx={{
          padding: '0',
          marginTop: '20px',
          [theme.breakpoints.down('sm')]: { marginTop: '50px' },
        }}
        onClick={() => setRotate(rotate === -270 ? 0 : rotate - 90)}
      >
        <img src={rotateImg} alt="" />
      </IconButton>
    </Box>
  )
}

export default AvatarEditor
