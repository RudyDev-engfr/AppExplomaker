import React, { useContext, useEffect, useState } from 'react'
import { Box, Tab, Tabs, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'

import { TripContext } from '../../contexts/trip'

import lineMobile from '../../images/icons/lineMobile.svg'

const useStyles = makeStyles(theme => ({
  mainHeaderContainer: {
    backgroundColor: theme.palette.primary.main,
    width: '100vw',
    height: '150px',
    position: 'fixed',
    borderRadius: '20px 20px 0 0 ',
    paddingTop: '10px',
  },
}))
const MobileTripPageHeader = () => {
  const { currentActiveTab, setCurrentActiveTab } = useContext(TripContext)
  const classes = useStyles()
  const { tripData } = useContext(TripContext)
  const [boxOffsetY, setBoxOffsetY] = useState(0)

  useEffect(() => {
    const boxElement = document.querySelector('.my-box-class')
    const handleScroll = () => {
      setBoxOffsetY(boxElement.offsetTop)
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <Box className={classes.mainHeaderContainer}>
      <Box display="flex" justifyContent="center">
        <img src={lineMobile} alt="" />
      </Box>
      <Typography
        sx={{
          color: 'white',
          fontSize: '28px',
          fontWeight: 700,
          padding: '40px 40px 5px 40px',
        }}
      >
        {tripData.destination.label}
      </Typography>
      <Box
        className={`my-box-class ${classes.tripPageTabsContainer}`}
        sx={{
          position: 'sticky',
          top: 0,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          zIndex: 100001,
        }}
      >
        <Tabs
          centered
          variant="fullWidth"
          fixedTabs
          value={currentActiveTab}
          TabIndicatorProps={{
            sx: {
              background: 'white',
              height: '5px',
            },
          }}
        >
          <Tab
            label={
              <Typography
                sx={{
                  color: 'white',
                  textTransform: 'none',
                  fontWeight: currentActiveTab === 'preview' && 700,
                }}
              >
                Aperçu
              </Typography>
            }
            onClick={() => setCurrentActiveTab('preview')}
            value="preview"
          />
          <Tab
            label={
              <Typography
                sx={{
                  color: 'white',
                  textTransform: 'none',
                  fontWeight: currentActiveTab === 'planning' && 700,
                }}
              >
                Planning
              </Typography>
            }
            value="planning"
            onClick={() => setCurrentActiveTab('planning')}
          />
          <Tab
            label={
              <Typography
                sx={{
                  color: 'white',
                  textTransform: 'none',
                  fontWeight: currentActiveTab === 'envies' && 700,
                }}
              >
                Envies
              </Typography>
            }
            value="wishes"
            onClick={() => setCurrentActiveTab('envies')}
          />
          <Tab
            label={
              <Typography
                sx={{
                  color: 'white',
                  textTransform: 'none',
                  fontWeight: currentActiveTab === 'triplogs' && 700,
                }}
              >
                Logs
              </Typography>
            }
            value="triplogs"
            onClick={() => setCurrentActiveTab('triplogs')}
          />
        </Tabs>
      </Box>
    </Box>
  )
}
export default MobileTripPageHeader
