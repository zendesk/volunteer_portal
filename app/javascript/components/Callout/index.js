import React from 'react'
import startCase from 'lodash.startcase'
import { Alert, Close, Title } from '@zendeskgarden/react-notifications'

const genericErrorMessage = 'We are having trouble loading this form, please contact support.'

const calloutMessage = (message, type) => {
  if (type === 'error' && !message) {
    return genericErrorMessage
  }

  return message
}

const alertType = (type) => {
  if (!type || type === 'default') {
    return 'info'
  }

  return type
}

const Callout = ({ message, type }) => (
  <Alert type={alertType(type)}>
    <Title>{startCase(type)}</Title>
    {calloutMessage(message, type)}
    <Close aria-label="Close Alert" />
  </Alert>
)

export default Callout
