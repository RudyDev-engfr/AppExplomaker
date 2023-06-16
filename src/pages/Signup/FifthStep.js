import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'

import makeStyles from '@mui/styles/makeStyles'

import { SessionContext } from '../../contexts/session'
import { SignupContext } from '../../contexts/signup'

import confetti from '../../images/signIn/Confetti.svg'

const useStyles = makeStyles({
  avatar: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '50%',
    width: '140px',
    height: '140px',
    border: '4px solid #009D8C',
  },
})

const FifthStep = () => {
  const history = useHistory()
  const classes = useStyles()
  const { user, needRedirectTo, setNeedRedirectTo, joinCallback } = useContext(SessionContext)
  const { signup, setSignup } = useContext(SignupContext)
  const [preview, setPreview] = useState()

  useEffect(() => {
    if (!user.avatar) {
      setPreview()
    } else {
      const objectUrl = user.avatar
      setPreview(objectUrl)
    }
    setSignup({})
    setTimeout(() => {
      if (needRedirectTo === 'newTrip') {
        setNeedRedirectTo()
        history.push('/newtrip/tripFirst')
      } else if (needRedirectTo === 'afterJoin') {
        setNeedRedirectTo()
        const tripid = joinCallback(user.id)
        history.push(`/tripPage/${tripid}`)
      } else {
        history.push('/')
      }
    }, 2000)
  }, [])

  return (
    <Box component="section">
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <img src={confetti} alt="" />
        {/* 
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            width: '140px',
            height: '140px',
            border: '4px solid #009D8C',
          }}
        >
          <img
            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
            src={preview}
            alt=""
          />
        </div> */}
        <Avatar src={preview} className={classes.avatar} />
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            fontStyle: 'normal',
            fontWeight: 'bold',
            fontSize: '38px',
            color: '#000000',
            textAlign: 'center',
            marginTop: '10px',
          }}
        >
          Bienvenue
          <br />
          {signup.firstname}
        </div>
      </div>
    </Box>
  )
}

export default FifthStep
