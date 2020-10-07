import React from 'react'
import * as R from 'ramda'

import { present } from '../../lib/utils'
import s from './main.css'

import { useTranslation } from 'react-i18next'

const SignupButton = ({ currentUser, event, createSignupHandler, destroySignupHandler }) => {
  if (R.isNil(event)) {
    return <button disabled className={`${s.btn} ${s.primary}`} />
  }

  const isRegistered = present(R.find(user => user.id === currentUser.id)(event.users))
  const isFull = event.users.length >= event.capacity
  const { t } = useTranslation()

  let classNames = [s.btn, s.primary]
  let buttonText = t('volunteer_portal.dashboard.layouttab.eventpopover.button.signup')
  let onClick = createSignupHandler

  if (isRegistered) {
    classNames = R.append(s.registered, classNames)
    buttonText = t('volunteer_portal.dashboard.layouttab.eventpopover.button.leave')
    onClick = destroySignupHandler
  } else if (isFull) {
    classNames = R.append(s.full, classNames)
    buttonText = t('volunteer_portal.dashboard.layouttab.eventpopover.button.full')
    onClick = null
  }

  return (
    <button className={R.join(' ', classNames)} onClick={onClick}>
      {buttonText}
    </button>
  )
}

export default SignupButton
