import React from 'react'
import R from 'ramda'

import { present } from '../../lib/utils'
import s from './main.css'

const SignupButton = ({ currentUser, event, createSignupHandler, destroySignupHandler }) => {
  if (R.isNil(event)) {
    return <button disabled className={`${s.btn} ${s.primary}`} />
  }

  const isRegistered = present(R.find(user => user.id === currentUser.id)(event.users))
  const isFull = event.users.length >= event.capacity

  let classNames = [s.btn, s.primary]
  let buttonText = 'Sign up'
  let onClick = createSignupHandler

  if (isRegistered) {
    classNames = R.append(s.registered, classNames)
    buttonText = 'Leave'
    onClick = destroySignupHandler
  } else if (isFull) {
    classNames = R.append(s.full, classNames)
    buttonText = 'Full'
    onClick = null
  }

  return (
    <button className={R.join(' ', classNames)} onClick={onClick}>
      {buttonText}
    </button>
  )
}

export default SignupButton
