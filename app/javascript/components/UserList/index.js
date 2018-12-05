import React from 'react'

import NamedAvatar from 'components/NamedAvatar'

import { present } from '../../lib/utils'
import s from './main.css'

const UserList = ({ users, destroySignup }) => (
  <div className={s.avatarGrid}>
    {users &&
      users.map((user, i) => (
        <div key={i} className={s.item}>
          <NamedAvatar
            userId={user.id}
            image={user.photo}
            name={user.name}
            subtitle={user.group}
            showRemove={present(destroySignup)}
            onRemove={() => destroySignup(user)}
          />
        </div>
      ))}
  </div>
)

export default UserList
