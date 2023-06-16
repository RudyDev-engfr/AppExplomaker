import React from 'react'
import { makeStyles, useTheme } from '@mui/styles'
import ReactCamera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo'
import { Box } from '@mui/material'

import './index.css'

const useStyles = makeStyles({
  camera: {
    marginTop: '50px',
    borderRadius: '20px',
    '& .react-html5-camera-photo ': {
      borderRadius: '20px',
    },
  },
})

const Camera = ({ imageSrc, setImageSrc, setOpenModal }) => {
  const classes = useStyles()

  const handleTakePhoto = async dataUri => {
    const blob = await (await fetch(dataUri)).blob()
    const blobImg = new File([blob], 'avatar')
    setImageSrc(blobImg)
    setOpenModal('avatarEditor')
  }

  function handleTakePhotoAnimationDone(/* dataUri */) {
    // Do stuff with the photo...
    console.log('takePhotoAnimation')
  }

  function handleCameraError(/* error */) {
    console.log('handleCameraError')
  }

  function handleCameraStart(/* stream */) {
    console.log('handleCameraStart')
  }

  function handleCameraStop() {
    console.log('handleCameraStop')
  }

  return (
    <Box>
      {!imageSrc && (
        <ReactCamera
          classNames={classes.camera}
          onTakePhoto={dataUri => {
            handleTakePhoto(dataUri)
          }}
          onTakePhotoAnimationDone={dataUri => {
            handleTakePhotoAnimationDone(dataUri)
          }}
          onCameraError={error => {
            handleCameraError(error)
          }}
          idealFacingMode={FACING_MODES.USER}
          idealResolution={{ width: 640, height: 480 }}
          imageType={IMAGE_TYPES.JPG}
          imageCompression={1}
          isMaxResolution
          isImageMirror={false}
          isSilentMode={false}
          isDisplayStartCameraError
          isFullscreen={false}
          sizeFactor={1}
          onCameraStart={stream => {
            handleCameraStart(stream)
          }}
          onCameraStop={() => {
            handleCameraStop()
          }}
        />
      )}
    </Box>
  )
}

export default Camera
