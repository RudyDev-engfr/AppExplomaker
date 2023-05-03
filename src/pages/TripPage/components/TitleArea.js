import { makeStyles } from '@mui/styles'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React from 'react'
import EditBtn from '../../../components/atoms/EditBtn'

const useStyles = makeStyles(theme => ({
  titleArea: {
    padding: '15px 50px 15px 50px',
    display: 'flex',
    alignItems: 'center',
    color: '#000000',
    textTransform: 'unset',
    justifyContent: 'flex-start',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
    '@media (max-width: 1060px)': {
      padding: '15px 50px 15px 15px',
    },
  },
}))
const TitleArea = ({
  tripDestinationLabel,
  tripTitle,
  tripDateRange = [],
  setOpenModal,
  canEdit,
}) => {
  const classes = useStyles()

  return (
    <Paper square className={classes.titleArea}>
      <Box>
        <Typography>
          <Box fontWeight="bold" component="span" fontSize="20px" lineHeight="24px">
            {/* {tripData.destination?.label ?? tripData.title} */}
            {tripDestinationLabel ?? tripTitle}
          </Box>
        </Typography>
        <Box sx={{ position: 'relative' }}>
          <Typography>
            {/* {typeof currentDateRange[0] === 'undefined'
            ? 'Je ne sais pas encore'
            : `${currentDateRange[0]} - ${currentDateRange[1]}`} */}
            {typeof tripDateRange[0] === 'undefined'
              ? 'Je ne sais pas encore'
              : `${tripDateRange[0]} - ${tripDateRange[1]}`}
          </Typography>
          {canEdit && <EditBtn onClick={() => setOpenModal('general')} top="-15px" right="-50px" />}
        </Box>
      </Box>
    </Paper>
  )
}
export default TitleArea
