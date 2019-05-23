import React from 'react'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { Field, reduxForm } from 'redux-form'
import R from 'ramda'
import moment from 'moment'

import DatePicker from 'material-ui/DatePicker'
import Dialog from 'material-ui/Dialog'
import ActionDone from 'material-ui/svg-icons/action/done'
import ActionInfoOutline from 'material-ui/svg-icons/action/info-outline'
import AutoComplete from 'material-ui/AutoComplete'
import AVNotInterested from 'material-ui/svg-icons/av/not-interested'
import ReactTable from 'react-table'

import { togglePopover } from 'actions'

import Callout from 'components/Callout'
import Layout from 'components/Layout'
import Loading from 'components/LoadingIcon'

import MyOfficeQuery from './query.gql'
import UpdateUserOfficeMutation from './UpdateUserOfficeMutation.gql'
import s from './main.css'

const validate = values => {
  const errors = {}
  if (!values.description) {
    errors.description = 'is required'
  }
  if (!values.office) {
    errors.office = {}
    errors.office.id = 'is required'
  }
  if (!values.date) {
    errors.date = 'is required'
  }
  if (!values.duration) {
    errors.duration = 'is required'
  } else if (values.duration > 24 * 60) {
    errors.duration = 'must be less than or equal to 24 hours'
  }
  if (!values.eventType) {
    errors.eventType = {}
    errors.eventType.id = 'is required'
  }
  if (!values.organization) {
    errors.organization = {}
    errors.organization.id = 'is required'
  }
  return errors
}

const renderFieldHelper = ({ input, type, label, className, selectOptions }) => {
  switch (type) {
    case 'input':
    case 'number':
      return <input {...input} type={type} className={className} />
    case 'textarea':
      return <textarea {...input} className={className} />
    case 'select':
      return (
        <select {...input} className={className}>
          {selectOptions}
        </select>
      )
    default:
      return <Callout type="error" />
  }
}

const renderField = props => {
  const { input, label, type, Custom, meta: { touched, error, warning }, className, required } = props
  const fieldInput = renderFieldHelper({ input, type, label, className, selectOptions: props.children })
  return (
    <div>
      <label>
        {label} <span className={s.errorMsg}>{touched && error ? error : '*'}</span>
      </label>
      <div>{Custom ? <Custom {...props} /> : fieldInput}</div>
    </div>
  )
}

const MyOffice = props => {
  const { data: { loading, offices, currentUser }, updateUserOffice, handleSubmit, disableSubmit } = props

  if (loading) {
    return <Loading />
  } else {
    return (
      <form className={s.form} onSubmit={handleSubmit(updateUserOffice)}>
        {/* TODO: set default value */}
        <Field label="My Office" className={s.field} name="office.id" component={renderField} type="select">
          <option value="-" key="-" />
          {R.map(
            office => (
              <option value={office.id} key={`office-${office.id}`}>
                {office.name}
              </option>
            ),
            offices
          )}
        </Field>
        <button className={`${s.btn} ${s.primary}`} type="submit" disabled={disableSubmit}>
          Save
        </button>
      </form>
    )
  }
}

const withData = compose(
  graphql(MyOfficeQuery, {
    options: {
      fetchPolicy: 'cache-and-network',
    },
  }),
  graphql(UpdateUserOfficeMutation, {
    props: ({ ownProps, mutate }) => ({
      updateUserOffice: data => {
        const userId = ownProps.data.currentUser.id
        const officeId = data.office.id

        return mutate({
          variables: { userId, officeId },
        }).then(_response => {
          ownProps.history.push('/portal')
        })
      },
    }),
  })
)

const withReduxForm = reduxForm({
  form: 'myOffice',
  validate,
})

export default withData(withReduxForm(MyOffice))
