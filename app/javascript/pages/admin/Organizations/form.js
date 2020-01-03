import React from 'react'
import { reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import * as R from 'ramda'
import moment from 'moment-timezone'

import OrganizationForm from 'components/OrganizationForm'

import s from './form.css'

const validate = values => {
  const errors = {}

  if (!values.name) {
    errors.name = 'is required'
  }

  if (!values.location) {
    errors.location = 'is required'
  }

  return errors
}

const OrganizationFormPage = ({ handleSubmit, pristine, submitting, graphQLErrors }) => (
  <OrganizationForm handleSubmit={handleSubmit} disableSubmit={pristine || submitting} errors={graphQLErrors} />
)

const withReduxForm = reduxForm({
  form: 'organization',
  enableReinitialize: true,
  validate,
})

const mapStateToProps = ({ graphQLErrors }, { organization }) => {
  const props = { graphQLErrors }

  return R.isNil(organization) ? props : R.merge({ initialValues: organization }, props)
}

const withActions = connect(
  mapStateToProps,
  {}
)

export default withActions(withReduxForm(OrganizationFormPage))
