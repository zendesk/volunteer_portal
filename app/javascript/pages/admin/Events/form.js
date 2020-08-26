import React from 'react'
import { reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import * as R from 'ramda'

import EventForm from 'components/EventForm'
import moment from 'moment'

import i18next from 'i18next'

const validate = values => {
  const errors = {}

  if (!values.title) {
    errors.title = i18next.t('volunteer_portal.admin.tab.events.add.title.error') //'- required'
  }
  if (!values.description) {
    errors.description = i18next.t('volunteer_portal.admin.tab.events.add.description.error')
  }
  if (!values.tags || values.tags.length < 1) {
    errors.tags = {}
    errors.tags = i18next.t('volunteer_portal.admin.tab.events.add.tags.error')
  }
  if (!values.eventType) {
    errors.eventType = {}
    errors.eventType.id = i18next.t('volunteer_portal.admin.tab.events.add.eventtype.error')
  }
  if (!values.organization) {
    errors.organization = {}
    errors.organization.id = i18next.t('volunteer_portal.admin.tab.events.add.organization.error')
  }
  if (!values.office) {
    errors.office = {}
    errors.office.id = i18next.t('volunteer_portal.admin.tab.events.add.office.error')
  }
  if (!values.location) {
    errors.location = i18next.t('volunteer_portal.admin.tab.events.add.location.error')
  }
  if (!values.startsAt) {
    errors.startsAt = i18next.t('volunteer_portal.admin.tab.events.add.starts.error')
  }
  if (!values.endsAt) {
    errors.endsAt = i18next.t('volunteer_portal.admin.tab.events.add.ends.error')
  }
  if (moment(values.endsAt).isBefore(moment(values.startsAt))) {
    errors.endsAt = i18next.t('volunteer_portal.admin.tab.events.add.startsends.error')
  }
  if (!values.capacity || Number(values.capacity) === NaN) {
    errors.capacity = i18next.t('volunteer_portal.admin.tab.events.add.capacity.error')
  }

  return errors
}

const EventFormPage = ({
  eventTypes,
  tags,
  offices,
  organizations,
  handleSubmit,
  pristine,
  submitting,
  graphQLErrors,
  children,
}) => (
  <EventForm
    eventTypes={eventTypes}
    tags={tags}
    offices={offices}
    organizations={organizations}
    handleSubmit={handleSubmit}
    disableSubmit={pristine || submitting}
    errors={graphQLErrors}
  >
    {children}
  </EventForm>
)

const withReduxForm = reduxForm({
  form: 'event',
  enableReinitialize: true,
  validate,
})

const mapStateToProps = ({ graphQLErrors }, { event }) => {
  const props = { graphQLErrors }
  return R.isNil(event) ? props : R.merge({ initialValues: event }, props)
}

const withActions = connect(mapStateToProps, {})

export default withActions(withReduxForm(EventFormPage))
