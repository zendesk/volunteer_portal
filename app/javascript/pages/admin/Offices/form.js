import React from 'react'
import { reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import * as R from 'ramda'
import moment from 'moment-timezone'

import OfficeForm from 'components/OfficeForm'

import s from './form.css'

import i18next from 'i18next'

const validate = values => {
  const errors = {}

  if (!values.name) {
    errors.name = i18next.t('volunteer_portal.admin.tab.offices_addoffice_name.error') //'is required'
  }

  if (!values.timezone || values.timezone === '-') {
    errors.timezone = i18next.t('volunteer_portal.admin.tab.offices_addoffice_timezone.error')
  }

  return errors
}

const OfficeFormPage = ({ handleSubmit, pristine, submitting, graphQLErrors }) => (
  <OfficeForm handleSubmit={handleSubmit} disableSubmit={pristine || submitting} errors={graphQLErrors} />
)

const withReduxForm = reduxForm({
  form: 'office',
  enableReinitialize: true,
  validate,
})

const mapStateToProps = ({ graphQLErrors }, { office }) => {
  const props = { graphQLErrors }

  return R.isNil(office) ? props : R.merge({ initialValues: office }, props)
}

const withActions = connect(mapStateToProps, {})

export default withActions(withReduxForm(OfficeFormPage))
