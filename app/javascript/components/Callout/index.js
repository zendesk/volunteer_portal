import React from 'react'
import s from './main.css'

const colorClass = type => {
  switch (type) {
    case 'default':
      return s.default
    case 'success':
      return s.success
    case 'warning':
      return s.warning
    case 'error':
      return s.error
    default:
      return s.default
  }
}

const genericErrorMessage = 'We are having trouble loading this form, please contact support.'

const calloutMessage = (message, type) => {
  if (type === 'error' && !message) {
    return genericErrorMessage
  } else {
    return message
  }
}

const Callout = ({ message, type }) => (
  <div className={`${s.callout} ${colorClass(type)}`}>{calloutMessage(message, type)}</div>
)

export default Callout
