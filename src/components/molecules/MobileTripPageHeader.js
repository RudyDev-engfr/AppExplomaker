import React, { useContext, useEffect, useState } from 'react'
import { Box, Tab, Tabs, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'

import { TripContext } from '../../contexts/trip'

import lineMobile from '../../images/icons/lineMobile.svg'

const useStyles = makeStyles(theme => ({
  mainHeaderContainer: {
    backgroundColor: theme.palette.primary.main,
    width: '100vw',
    height: '188px',
    borderRadius: '20px 20px 0 0 ',
    paddingTop: '10px',
    position: 'sticky',
    zIndex: 1001,
    top: '-140px',
  },
}))
const MobileTripPageHeader = () => {
  const { currentActiveTab, setCurrentActiveTab } = useContext(TripContext)
  const classes = useStyles()
  const { tripData } = useContext(TripContext)

  return (
    <Box className={classes.mainHeaderContainer}>
      <Box display="flex" justifyContent="center">
        <img src={lineMobile} alt="" />
      </Box>
      <Typography
        sx={{
          color: 'white',
          fontSize: '24px',
          lineHeight: '40px',
          fontWeight: 700,
          padding: '10px 20px 5px 20px',
          minHeight: '125px',
          maxHeight: '125px',
          display: 'flex',
          alignItems: 'flex-end',
          wordBreak: 'break-all',
        }}
      >
        {tripData?.title?.length > 60 ? tripData?.title : tripData?.title?.substring(0, 50)}
      </Typography>
      <Box
        className={classes.tripPageTabsContainer}
        sx={{
          position: 'sticky',
          top: 0,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          zIndex: 1001,
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
            value="envies"
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
