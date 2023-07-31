import React, { useContext, useState } from 'react'
import Modal from '@mui/material/Modal'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/styles'

import { FirebaseContext } from '../../contexts/firebase'
import { SessionContext } from '../../contexts/session'
import { TripContext } from '../../contexts/trip'

const TripGuideAlertModal = ({ openState, setterOpenState, currentItem, titre, itemIndex }) => {
  const theme = useTheme()

  const { firestore } = useContext(FirebaseContext)
  const { user } = useContext(SessionContext)
  const { tripData } = useContext(TripContext)

  const [reasons, setReasons] = useState('')
  const [userComment, setUserComment] = useState('')

  const handleChange = event => {
    setReasons(event.target.value)
  }

  const handleClose = () => setterOpenState(false)

  const handleSubmit = async (contentTitle, index) => {
    const destinationId = tripData?.destination?.place_id
    const userId = user.id

    const docRef = firestore.collection('inspirations').doc(destinationId)

    try {
      // Get the current document
      const doc = await docRef.get()

      // Check if document exists
      if (!doc.exists) {
        console.log('No such document!')
        return
      }

      // Get document data
      const data = doc.data()
      console.log('docData', data)
      const propertyValue = data[currentItem.model]

      // Check if content exists and the key is valid
      if (!propertyValue.content || !propertyValue.content[index]) {
        console.log('Content or key does not exist!')
        return
      }

      // Add userId to userLikes array
      if (!propertyValue.content[index].userReports) {
        propertyValue.content[index].userReports = []
      }
      propertyValue.content[index].userReports.push({
        reasons,
        userComment,
        userId,
      })

      // Update the document with the new data
      await docRef.set(data, { merge: true })

      console.log('report added to userReports')
    } catch (error) {
      console.error('Error updating document:', error)
    }
    handleClose()
    setUserComment('')
    setReasons('')
  }

  return (
    <Modal
      open={openState}
      onClose={handleClose}
      aria-labelledby="modal-alertModal"
      aria-describedby="modal-alertModal-description"
    >
      <Paper
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 450,
          height: 270,
          boxShadow: 24,
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          gridGap: '15px',
          [theme.breakpoints.down('sm')]: {
            width: '100vw',
            height: '100vh',
            borderRadius: 'unset',
          },
        }}
      >
        <Box>
          <FormControl fullWidth>
            <InputLabel id="reasonsSelectLabel">Raisons de votre signalement</InputLabel>
            <Select
              labelId="reasonsSelectLabel"
              id="reasonsSelectElement"
              value={reasons}
              label="Raisons de votre signalement"
              onChange={handleChange}
            >
              <MenuItem value="Contenu inapproprié">Contenu inapproprié</MenuItem>
              <MenuItem value="Je ne veux pas voir ça">Je ne veux pas voir ça</MenuItem>
              <MenuItem value={"C'est un doublon"}>C&apos;est un doublon</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box>
          <FormControl fullWidth>
            {/* <InputLabel id="commentSelectLabel">Un Commentaire ? (facultatif)</InputLabel> */}
            <TextField
              label="Un Commentaire ? (facultatif)"
              labelId="commmentSelectLabel"
              multiline
              minRows={2}
              maxRows={4}
              value={userComment}
              onChange={event => {
                setUserComment(event.target.value)
              }}
            />
          </FormControl>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button variant="contained" value="submit" onClick={() => handleSubmit(titre, itemIndex)}>
            Valider
          </Button>
        </Box>
      </Paper>
    </Modal>
  )
}
export default TripGuideAlertModal
