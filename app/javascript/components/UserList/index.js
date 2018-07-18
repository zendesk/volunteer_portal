import React from 'react'

import NamedAvatar from 'components/NamedAvatar'

import s from './main.css'

const UserList = ({ users, destroySignup }) => (
  <div className={s.avatarGrid}>
    {users &&
      users.map((user, i) => (
        <div key={i} className={s.item}>
          <NamedAvatar
            image={user.photo}
            name={user.name}
            subtitle={user.group}
            showRemove={!!destroySignup}
            onRemove={() => destroySignup(user)}
          />
        </div>
      ))}
  </div>
)

export default UserList
