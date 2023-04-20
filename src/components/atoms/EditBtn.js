import React from 'react'
import IconButton from '@mui/material/IconButton'
import { CreateOutlined } from '@mui/icons-material'
import makeStyles from '@mui/styles/makeStyles'

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',

    width: '40px',
    height: '40px',
    background: theme.palette.grey.f7,
    color: 'rgba(0, 0, 0, 0.5)',
    fontSize: '18px',
    transition: '0.2s linear',
    zIndex: 10,
    '@media (max-width: 650px)': {
      top: '20px',
      color: '#bdbdbd !important',
      background: '#ffffff !important',
      boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1) !important',
    },
  },
}))

const EditBtn = ({ onClick, top = '24px', right = '20px' }) => {
  const classes = useStyles()

  return (
    <IconButton
      type="button"
      onClick={onClick}
      className={classes.root}
      sx={{ top, right }}
      size="large"
    >
      <CreateOutlined />
    </IconButton>
  )
}

export default EditBtn
