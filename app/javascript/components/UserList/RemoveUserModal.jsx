import React from 'react'

import styled from 'styled-components'
import { Body, Close, Footer, FooterItem, Header, Modal } from '@zendeskgarden/react-modals'
import { Button } from '@zendeskgarden/react-buttons'
import { XL } from '@zendeskgarden/react-typography'

const Title = styled.div`
  display: flex;
  align-items: center;
`

const RemoveUserModal = ({ user, onCancel, onRemove }) => (
  <Modal onClose={onCancel}>
    <Header>
      <Title>
        <XL tag="span">🤔</XL> <span>Remove volunteer from this event?</span>
      </Title>
    </Header>
    <Body>
      Please confirm you would like to remove <strong>{user.name}</strong> from this event?
    </Body>
    <Footer>
      <FooterItem>
        <Button basic onClick={onCancel}>
          Cancel
        </Button>
      </FooterItem>
      <FooterItem>
        <Button primary onClick={onRemove}>
          Confirm
        </Button>
      </FooterItem>
    </Footer>
    <Close aria-label="Close modal" />
  </Modal>
)

export default RemoveUserModal
