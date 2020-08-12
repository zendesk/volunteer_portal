import React, { useState } from 'react'
import { Header, Body, Footer, FooterItem } from '@zendeskgarden/react-modals'
import { Dots } from '@zendeskgarden/react-loaders'
import { Button } from '@zendeskgarden/react-buttons'

import { useTranslation } from 'react-i18next'

const DeleteModalContents = ({ toDelete, deleteIndividualEvent, setShowDeleteModal }) => {
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()

  const handleDelete = () => {
    setLoading(true)
    deleteIndividualEvent(toDelete.id).then(() => {
      setLoading(false)
      setShowDeleteModal(false)
    })
  }

  return (
    <>
      <Header isDanger>Delete Event</Header>
      <Body>
        <p>Are you sure you want to delete this event?</p>
        <p><b>{toDelete.description}</b></p>
      </Body>
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
