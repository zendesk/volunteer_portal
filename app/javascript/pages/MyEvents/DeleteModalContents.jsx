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
      <Header isDanger>{t('volunteer_portal.admin.tab.user.myevents.individualevent.deleteevent')}</Header>
      <Body>
        <p>{t('volunteer_portal.admin.tab.user.myevents.individualevent.deleteevent.description')}</p>
        <p><b>{toDelete.description}</b></p>
      </Body>
      <Footer>
        <FooterItem>
          <Button isBasic onClick={() => setShowDeleteModal(false)}>
          {t('volunteer_portal.admin.tab.user.myevents.individualevent.deleteevent.cancel')}
          </Button>
        </FooterItem>
        <FooterItem>
          <Button isDanger disabled={loading} onClick={handleDelete}>
            {loading ? <Dots /> : t('volunteer_portal.admin.tab.user.myevents.individualevent.deleteevent.delete')}
          </Button>
        </FooterItem>
      </Footer>
    </>
  )
}

export default DeleteModalContents
