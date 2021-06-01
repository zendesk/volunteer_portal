import React from 'react'
import {Alert as AlertBase} from '@zendeskgarden/react-notifications';

const genericErrorMessage = 'We are having trouble loading this form, please contact support.'

const alertMessage = (message, type) => {
  if (type === 'error' && !message) {
    return genericErrorMessage
  } else {
    return message
  }
}

const Alert = ({ message, type }) => (
  <AlertBase type={type}>
    {alertMessage(message, type)}
  </AlertBase>
)

export default Alert
