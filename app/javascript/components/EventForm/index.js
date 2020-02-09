import React from 'react'
import { Field } from 'redux-form'
import * as R from 'ramda'

import DatePicker from 'material-ui/DatePicker'
import TimePicker from 'material-ui/TimePicker'

import Callout from 'components/Callout'
import UserList from 'components/UserList'
import LocationField from 'components/LocationField'
import ReduxFormAutocomplete from 'components/ReduxFormAutoComplete'

import TagField from 'components/TagField'

import s from './main.css'

// mui components need inline styles
const styles = {
  dialogBody: {
    maxHeight: 500,
  },
  dialogNoBorder: {
    border: 'none',
  },
  muiTextField: {
    height: 20,
    width: 'calc(100% - 10px)', // 100% - left and right padding
    border: '1px solid #ddd',
    borderRadius: 4,
    padding: 5,
  },
}

const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1)

const formatGraphQLErrors = errors =>
  R.map(
    ([field, errors]) => (
      <span key={`${field}-error`}>
        <strong>{capitalize(field)}</strong>: {Array.isArray(errors) ? errors.join(', ') : errors}
        <br />
      </span>
    ),
    R.toPairs(errors)
  )

const renderFieldHelper = ({ input, type, label, className, selectOptions }) => {
  switch (type) {
    case 'input':
    case 'text':
    case 'number':
      return <input {...input} type={type} className={className} />
    case 'textarea':
      return <textarea {...input} type={type} className={className} />
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

const renderError = error => <span className={s.fieldError}>{error}</span>

const renderField = props => {
  const {
    input,
    label,
    type,
    Custom,
    meta: { touched, error, warning },
    className,
    required,
  } = props
  const fieldInput = renderFieldHelper({ input, type, label, className, selectOptions: props.children })
  return (
    <div>
      <label className={s.label}>
        {label} <span className={s.errorMsg}>{touched && error ? renderError(error) : '*'}</span>
      </label>
      <div>{Custom ? <Custom {...props} /> : fieldInput}</div>
    </div>
  )
}

const isNoErrors = errors => R.isNil(errors) || R.isEmpty(errors)

const dateTimeSplitChange = (part, currentValue, newValue, callback) => {
  const timeStamp = R.isNil(currentValue) || R.isEmpty(currentValue) ? new Date() : new Date(currentValue)

  switch (part) {
    case 'date':
      timeStamp.setFullYear(newValue.getFullYear())
      timeStamp.setMonth(newValue.getMonth())
      timeStamp.setDate(newValue.getDate())
      break
    case 'time':
      timeStamp.setHours(newValue.getHours())
      timeStamp.setMinutes(newValue.getMinutes())
      timeStamp.setSeconds(0, 0) // We don't want more than minute precision
      break
  }

  callback(timeStamp)
}

const DateField = ({ input: { value, onChange } }) => (
  <DatePicker
    id="date"
    hintText=""
    className={s.muiTextField}
    textFieldStyle={styles.muiTextField}
    onChange={(_, selection) => dateTimeSplitChange('date', value, selection, onChange)}
    defaultDate={R.isEmpty(value) ? undefined : new Date(value)}
    autoOk
  />
)

const TimeField = ({ input: { value, onChange } }) => (
  <TimePicker
    id="time"
    hintText=""
    className={s.muiTextField}
    textFieldStyle={styles.muiTextField}
    onChange={(_, selection) => dateTimeSplitChange('time', value, selection, onChange)}
    defaultTime={R.isEmpty(value) ? undefined : new Date(value)}
    pedantic
  />
)

const EventForm = ({
  handleSubmit,
  disableSubmit,
  errors,
  eventTypes,
  tags,
  organizations,
  offices,
  users,
  destroySignup,
}) => (
  <form className={s.form} onSubmit={handleSubmit}>
    {isNoErrors(errors) ? null : <Callout type="error" message={formatGraphQLErrors(errors)} />}
    <div className={s.inputGroup}>
      <Field label="Title" className={s.field} name="title" component={renderField} type="text" />
    </div>
    <div className={s.inputGroup}>
      <Field label="Description" className={s.field} name="description" component={renderField} type="textarea" />
    </div>
    <div className={s.inputGroup}>
      <Field label="Tags" className={s.field} name="tags" component={renderField} tags={tags} Custom={TagField} />
    </div>
    <div className={`${s.inputGroup} ${s.twoColumnForm}`}>
      <div className={s.column}>
        <Field label="Event Type" className={s.field} name="eventType.id" component={renderField} type="select">
          <option />
          {R.map(
            eventType => (
              <option value={eventType.id} key={`eventType-${eventType.id}`}>
                {eventType.title}
              </option>
            ),
            eventTypes
          )}
        </Field>
      </div>
      <div className={s.column}>
        <Field
          label="Organization"
          className={s.field}
          name="organization.id"
          component={renderField}
          dataSource={organizations}
          searchField={'name'}
          Custom={ReduxFormAutocomplete}
        />
      </div>
    </div>
    <div className={`${s.inputGroup} ${s.twoColumnForm}`}>
      <div className={s.column}>
        <Field label="Office" className={s.field} name="office.id" component={renderField} type="select">
          <option />
          {R.map(
            office => (
              <option value={office.id} key={`office-${office.id}`}>
                {office.name}
              </option>
            ),
            offices
          )}
        </Field>
      </div>
      <div className={s.column}>
        <Field label="Location" className={s.field} name="location" component={renderField} Custom={LocationField} />
      </div>
    </div>
    <div className={`${s.inputGroup} ${s.twoColumnForm}`}>
      <div className={s.column}>
        <Field label="Start Date" className={s.field} name="startsAt" component={renderField} Custom={DateField} />
      </div>
      <div className={s.column}>
        <Field label="Start Time" className={s.field} name="startsAt" component={renderField} Custom={TimeField} />
      </div>
    </div>
    <div className={`${s.inputGroup} ${s.twoColumnForm}`}>
      <div className={s.column}>
        <Field label="End Date" className={s.field} name="endsAt" component={renderField} Custom={DateField} />
      </div>
      <div className={s.column}>
        <Field label="End Time" className={s.field} name="endsAt" component={renderField} Custom={TimeField} />
      </div>
    </div>
    <div className={`${s.inputGroup} ${s.twoColumnForm}`}>
      <div className={s.column}>
        <Field
          label="Capacity"
          className={s.field}
          name="capacity"
          component={renderField}
          type="number"
          parse={value => Number(value)}
        />
      </div>
    </div>
    <div className={s.inputGroup}>
      <button className={`${s.btn} ${s.primary}`} type="submit" disabled={disableSubmit}>
        Save
      </button>
    </div>
    <UserList users={users} onRemove={destroySignup} />
  </form>
)

export default EventForm
