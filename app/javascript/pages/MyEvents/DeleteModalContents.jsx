import React, { useState } from 'react'
import { Header, Body, Footer, FooterItem } from '@zendeskgarden/react-modals'
import { Dots } from '@zendeskgarden/react-loaders'
import { Button } from '@zendeskgarden/react-buttons'

const DeleteModalContents = ({ toDelete, deleteIndividualEvent, setShowDeleteModal }) => {
  const [loading, setLoading] = useState(false)

  const handleDelete = () => {
    setLoading(true)
    deleteIndividualEvent(toDelete).then(() => {
      setLoading(false)
      setShowDeleteModal(false)
    })
  }

  return (
    <>
      <Header isDanger>Delete Event</Header>
      <Body>Are you sure you want to delete this event?</Body>
      <Footer>
        <FooterItem>
          <Button isBasic onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
        </FooterItem>
        <FooterItem>
          <Button isDanger disabled={loading} onClick={handleDelete}>
            {loading ? <Dots /> : 'Delete'}
          </Button>
        </FooterItem>
      </Footer>
    </>
  )
}

export default DeleteModalContents