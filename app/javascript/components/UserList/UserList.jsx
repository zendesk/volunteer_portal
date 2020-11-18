import React, { useState } from 'react'
import * as R from 'ramda'

import styled from 'styled-components'
import { Well } from '@zendeskgarden/react-notifications'

import ListItem from 'components/ListItem'
import NamedAvatar from 'components/NamedAvatar'
import RemoveUserButton from './RemoveUserButton'
import RemoveUserModal from './RemoveUserModal'
import { present } from '/lib/utils'

import { useTranslation } from 'react-i18next'

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

const UserList = ({ users, onRemove }) => {
  const [activeUser, setActiveUser] = useState(null)
  const cancelRemove = () => setActiveUser(null)
  const removeUser = () => {
    onRemove(activeUser)
    setActiveUser(null)
  }

  const { t } = useTranslation()
  const userData = users || []
  const shouldShowRmBtn = present(onRemove)
  const shouldShowRmModal = shouldShowRmBtn && present(activeUser)
  const showEmpty = R.always(<Well>😓 {t('volunteer_portal.dashboard.layouttab.eventdetails.label.novolunteers')}</Well>)
  const showList = R.addIndex(R.map)((user, i) => (
    <User key={i}>
      <ListItem>
        <NamedAvatar image={user.photo} name={user.name} />
        {shouldShowRmBtn && <RemoveUserButton user={user} confirm={() => setActiveUser(user)} />}
      </ListItem>
    </User>
  ))

  return (
    <>
      <Grid>{R.ifElse(R.isEmpty, showEmpty, showList)(userData)}</Grid>
      {shouldShowRmModal && <RemoveUserModal user={activeUser} onCancel={cancelRemove} onRemove={removeUser} />}
    </>
  )
}

export default UserList
