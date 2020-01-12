import React, { useState } from 'react'

import { useMutation } from '@apollo/react-hooks'
import { Notification, Title, Close } from '@zendeskgarden/react-notifications'

import ConfirmProfileSettingsMutation from './mutations/confirmProfileSettings.gql'

import '@zendeskgarden/react-grid/dist/styles.css'
import '@zendeskgarden/react-notifications/dist/styles.css'

const ConfirmProfileAlert = ({ user }) => {
  const [show, setShow] = useState(true)
  const [confirmProfileSettings, _] = useMutation(ConfirmProfileSettingsMutation)

  const dismiss = () => {
    confirmProfileSettings()
    setShow(false)
  }

  if (show) {
    return (
      <Notification type="info">
        <Title>Welcome {user.name}</Title>
        <p>
          We have chosen <strong>{user.office.name}</strong> as your current office.
        </p>
        <p>
          To choose a different office, simply use the Default Office setting located in your profile menu (top right
          corner of your screen.)
        </p>
        <Close onClick={dismiss} aria-label="Close Alert" />
      </Notification>
    )
  }

  return null
}

export default ConfirmProfileAlert
