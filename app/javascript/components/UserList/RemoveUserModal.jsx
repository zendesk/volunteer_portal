import React from 'react'
import styled from 'styled-components'
import { Body, Close, Footer, FooterItem, Header, Modal } from '@zendeskgarden/react-modals'
import { Button } from '@zendeskgarden/react-buttons'
import { XL } from '@zendeskgarden/react-typography'
import { useTranslation, Trans } from 'react-i18next'

const Title = styled.div`
  display: flex;
  align-items: center;
`

const PaddedText = styled.span`
  padding-left: 4px;
`
const RemoveUserModal = ({ user, onCancel, onRemove }) => {
  const { t } = useTranslation()
  return (
    <Modal onClose={onCancel}>
      <Header>
        <Title>
          <XL tag="span">🤔</XL><PaddedText>{t('volunteer_portal.admin.tab.events.edit.removeuser.title')}</PaddedText>
        </Title>
      </Header>
      <Body>
        <Trans
          i18nKey="volunteer_portal.admin.tab.events.edit.removeuser.text"
          values={{ volunteer_name: user.name }}
          components={{ bold: <strong/> }}
        />
        </Body>
      <Footer>
        <FooterItem>
          <Button basic onClick={onCancel}>
          {t('volunteer_portal.admin.tab.events.edit.removeuser.cancel')}
          </Button>
        </FooterItem>
        <FooterItem>
          <Button primary onClick={onRemove}>
          {t('volunteer_portal.admin.tab.events.edit.removeuser.confirm')}
          </Button>
        </FooterItem>
      </Footer>
      <Close aria-label="Close modal" />
    </Modal>
  )
}
export default RemoveUserModal
