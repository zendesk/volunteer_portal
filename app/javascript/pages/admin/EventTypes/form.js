import React from 'react'
import { reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import * as R from 'ramda'
import moment from 'moment-timezone'

import EventTypeForm from 'components/EventTypeForm'

import s from './form.css'

const validate = values => {
  const errors = {}

  if (!values.title) {
    errors.title = 'is required'
  }

  return errors
}

const EventTypeFormPage = ({ handleSubmit, pristine, submitting, graphQLErrors }) => (
  <EventTypeForm handleSubmit={handleSubmit} disableSubmit={pristine || submitting} errors={graphQLErrors} />
)

const withReduxForm = reduxForm({
  form: 'eventType',
  enableReinitialize: true,
  validate,
})

const mapStateToProps = ({ graphQLErrors }, { eventType }) => {
  const props = { graphQLErrors }

  return R.isNil(eventType) ? props : R.merge({ initialValues: eventType }, props)
}

const withActions = connect(
  mapStateToProps,
  {}
)

export default withActions(withReduxForm(EventTypeFormPage))
