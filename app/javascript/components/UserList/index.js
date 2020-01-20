import React, { useState } from 'react'

import styled from 'styled-components'
import RemoveIcon from '@zendeskgarden/svg-icons/src/16/trash-stroke.svg'
import { Well } from '@zendeskgarden/react-notifications'
import { Modal, Header, Body, Footer, FooterItem, Close } from '@zendeskgarden/react-modals'
import { Button } from '@zendeskgarden/react-buttons'
import { Icon, IconButton } from '@zendeskgarden/react-buttons'
import { MD, XL } from '@zendeskgarden/react-typography'

import NamedAvatar from 'components/NamedAvatar'
import ListItem from 'components/ListItem'

const Grid = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
  margin-right: -30px;
`

const User = styled.div`
  padding-right: 30px;
  flex-basis: calc(50% - 30px);
`

const Title = styled.div`
  display: flex;
  align-items: center;
`

const UserList = ({ users, destroySignup }) => {
  const [activeUser, setActiveUser] = useState(null)
  const cancelRemove = () => setActiveUser(null)
  const removeUser = () => {
    destroySignup(activeUser)
    setActiveUser(null)
  }

  const userData = users || []
  return (
    <>
      <Grid>
        {userData.map((user, i) => (
          <User key={i}>
            <ListItem>
              <NamedAvatar image={user.photo} name={user.name} subtitle={user.group} />
              <IconButton
                aria-label={`Remove volunteer ${user.name} from this event`}
                onClick={() => setActiveUser(user)}
              >
                <Icon>
                  <RemoveIcon />
                </Icon>
              </IconButton>
            </ListItem>
          </User>
        ))}

        {!userData.length && <Well>😓 There are no volunteers assigned.</Well>}
      </Grid>

      {activeUser && (
        <Modal onClose={cancelRemove}>
          <Header>
            <Title>
              <XL tag="span">🤔</XL> <span>Remove volunteer from this event?</span>
            </Title>
          </Header>
          <Body>
            Please confirm you would like to remove <strong>{activeUser.name}</strong> from this event?
          </Body>
          <Footer>
            <FooterItem>
              <Button basic onClick={cancelRemove}>
                Cancel
              </Button>
            </FooterItem>
            <FooterItem>
              <Button primary onClick={removeUser}>
                Confirm
              </Button>
            </FooterItem>
          </Footer>
          <Close aria-label="Close modal" />
        </Modal>
      )}
    </>
  )
}

export default UserList
