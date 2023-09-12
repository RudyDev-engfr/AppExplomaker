import React, { useContext, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import StarIcon from '@mui/icons-material/Star'
import { makeStyles, useTheme } from '@mui/styles'
import { SessionContext } from '../../contexts/session'

const useStyles = makeStyles(theme => ({}))
const CustomTooltip = ({ stepArrayLength, ...props }) => {
  const {
    step,
    next,
    back,
    tooltipProps,
    primaryProps,
    backProps,
    continuous,
    index,
    isLastStep,
    skipProps,
    size,
    close,
    closeProps,
  } = props
  const classes = useStyles()
  const theme = useTheme()

  const { user } = useContext(SessionContext)

  useEffect(() => {
    console.log('primaryprops', props)
  }, [])

  useEffect(() => {
    console.log('salut')
  }, [])

  // Utilisez les props fournis pour construire votre propre tooltip
  return (
    <Box
      className="monTooltip"
      sx={{
        position: 'relative',
        minWidth: '420px',
        maxWidth: '600px',
        minHeight: '320px',
        maxHeight: '400px',
        height: 'fit-content',
        overflow: 'hidden',
        backgroundColor: '#B3E1DD',
        border: 'none',
        padding: '30px',
        borderRadius: '20px',
        [theme.breakpoints.down('sm')]: {
          minWidth: 'calc(100vw - 60px)',
          minHeight: '400px',
        },
      }}
      {...tooltipProps}
    >
      {step?.title && (
        <>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '30px',
            }}
          >
            <Typography variant="h5" sx={{ fontSize: '18px', lineHeight: 1.5 }}>
              {step.title}
            </Typography>
            {index === 4 && (
              <Box
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: '700',
                  lineHeight: '1',
                  padding: '5px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  marginLeft: '10px', // Ajuster la marge à gauche
                }}
              >
                Premium
                <StarIcon
                  sx={{
                    marginLeft: '2px',
                    fontSize: '18px',
                  }}
                />
              </Box>
            )}
          </Box>
        </>
      )}
      <Typography>{step.content}</Typography>
      <Box
        sx={{
          position: 'absolute',
          bottom: '30px',
          right: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          width: 'calc(100% - 60px)',
        }}
      >
        <Typography sx={{ alignSelf: 'center', color: theme.palette.grey['82'], fontWeight: 500 }}>
          {index + 1} / {isLastStep ? index + 1 : size}
        </Typography>
        <Box>
          {index === 0 && (
            <Button
              onClick={close}
              variant="text"
              {...closeProps}
              id={continuous ? 'next' : 'close'}
              sx={{ borderRadius: '50px', color: theme.palette.grey['82'] }}
            >
              Fermer
            </Button>
          )}
          {index > 0 && (
            <Button
              onClick={back}
              variant="text"
              {...backProps}
              id={continuous ? 'next' : 'close'}
              sx={{ borderRadius: '50px', color: theme.palette.grey['82'] }}
            >
              Précédent
            </Button>
          )}

          <Button
            onClick={() => {
              next()
            }}
            variant="contained"
            {...primaryProps}
            id={continuous ? 'next' : 'close'}
            sx={{ borderRadius: '50px', marginLeft: '5px' }}
            disableRipple
          >
            {index === size - 1 ? 'Fermer' : 'Suivant'}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default CustomTooltip
