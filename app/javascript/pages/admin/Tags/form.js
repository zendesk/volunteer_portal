import React from 'react'
import { reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import * as R from 'ramda'
import moment from 'moment-timezone'

import TagForm from 'components/TagForm'

import s from './form.css'

const validate = values => {
  const errors = {}

  if (!values.title) {
    errors.title = 'is required'
  }

  return errors
}

const TagFormPage = ({ handleSubmit, pristine, submitting, graphQLErrors }) => (
  <TagForm handleSubmit={handleSubmit} disableSubmit={pristine || submitting} errors={graphQLErrors} />
)

const withReduxForm = reduxForm({
  form: 'tag',
  enableReinitialize: true,
  validate,
})

const mapStateToProps = ({ graphQLErrors }, { tag }) => {
  const props = { graphQLErrors }

  return R.isNil(tag) ? props : R.merge({ initialValues: tag }, props)
}

const withActions = connect(
  mapStateToProps,
  {}
)

export default withActions(withReduxForm(TagFormPage))
