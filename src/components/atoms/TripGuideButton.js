import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import BookmarkAddOutlined from '@mui/icons-material/BookmarkAddOutlined'
import { makeStyles, useTheme } from '@mui/styles'
import { useHistory } from 'react-router-dom'

import arrow from '../../images/icons/arrow-back.svg'

const useStyles = makeStyles(theme => ({
  papers: {
    position: 'relative',
    width: '240px',
    // height: '115px',
    cursor: 'pointer',
    padding: '25px 15px',
    textAlign: 'left',
    textTransform: 'unset',
    // color: theme.palette.grey['33'],
    '&:hover': {
      backgroundColor: theme.palette.primary.ultraLight,
    },
    '&:focus': {
      backgroundColor: theme.palette.primary.ultraLight,
    },
    [theme.breakpoints.down('sm')]: {
      height: '100px',
      '&:nth-child(1)': {
        marginBottom: '-20px',
        borderRadius: '20px 20px 0 0',
        height: '85px',
      },
      '&:nth-child(2)': {
        borderRadius: '0 0 20px 20px',
        height: '85px',
      },
    },
    [theme.breakpoints.down('sm')]: {
      width: 'calc(100vw - 60px)',
    },

    backgroundSize: 'cover',
    color: 'white',
    height: '200px',
    backgroundPosition: 'center',
  },
  papersContent: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
    },
  },
  iconTypo: { marginRight: '15px', fontSize: '30px' },
  papersTitle: {
    fontWeight: 600,
    textAlign: 'center',
  },
}))

const TripGuideButton = ({
  itemName,
  model,
  setCurrentSelectedTripGuideButton,
  item_picture: itemPicture,
}) => {
  const classes = useStyles()
  const theme = useTheme()
  const history = useHistory()

  const [alertModal, setAlertModal] = useState(false)

  const handleClick = () => {
    history.push(`${history.location.pathname}?itemName=${model}`)
    setCurrentSelectedTripGuideButton(model)
  }

  return (
    <Box>
      <Paper
        component={Button}
        className={classes.papers}
        sx={{
          background:
            itemPicture ??
            'url(https://storage.googleapis.com/explomaker-data-stateless/2018/12/0a1c3c8c-opacifie-photo.jpg)',
        }}
        onClick={handleClick}
      >
        <Box className={classes.papersContent}>
          <Box className={classes.titleContainer}>
            <Typography className={classes.papersTitle}>{itemName}</Typography>
          </Box>
          {/* <Box
            component="img"
            sx={{ transform: 'rotate(180deg)', marginLeft: '20px' }}
            src={arrow}
            alt=""
          /> */}
        </Box>
      </Paper>
    </Box>
  )
}
export default TripGuideButton
