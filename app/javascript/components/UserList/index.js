import React from 'react'

import NamedAvatar from 'components/NamedAvatar'

import s from './main.css'

const UserList = ({ users }) => {
  return (
    <div className={s.avatarGrid}>
      {users.map((user, i) => (
        <div key={i} className={s.item}>
          <NamedAvatar image={user.photo} name={user.name} subtitle={user.group} />
        </div>
      ))}
    </div>
  )
}

export default UserList
