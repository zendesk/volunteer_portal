import React from 'react'
import { Field } from 'redux-form'
import moment from 'moment-timezone'
import R from 'ramda'
import AutoComplete from 'material-ui/AutoComplete'

import Callout from 'components/Callout'

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
        <strong>{capitalize(field)}</strong>: {errors.join(', ')}
        <br />
      </span>
    ),
    R.toPairs(errors)
  )

const renderFieldHelper = ({ input, type, label, className, selectOptions, disabled }) => {
  switch (type) {
    case 'input':
    case 'text':
      return <input {...input} type={type} className={className} disabled={disabled} />
    case 'checkbox':
      return <input {...input} type={type} className={className} disabled={disabled} />
    case 'select':
      return (
        <select {...input} className={className} disabled={disabled}>
          {selectOptions}
        </select>
      )
    default:
      return <Callout type="error" />
  }
}

const renderField = props => {
  const { input, label, type, Custom, meta: { touched, error, warning }, className, required, disabled } = props
  const fieldInput = renderFieldHelper({ input, type, label, className, selectOptions: props.children, disabled })
  return (
    <div>
      <label className={s.label}>
        {label} <span className={s.errorMsg}>{touched && error ? error : '*'}</span>
      </label>
      <div>{Custom ? <Custom {...props} /> : fieldInput}</div>
    </div>
  )
}

const isNoErrors = errors => R.isNil(errors) || R.isEmpty(errors)

const OfficeField = ({ offices, input: { value, onChange } }) => (
  <AutoComplete
    id="office"
    searchText={R.isNil(value) || R.isEmpty(value) ? value : R.find(o => o.id === value, offices).name}
    dataSource={offices}
    dataSourceConfig={{ text: 'name', value: 'id' }}
    filter={AutoComplete.fuzzyFilter}
    onNewRequest={(chosen, _i) => onChange(chosen.id)}
    className={s.muiTextField}
    textFieldStyle={styles.muiTextField}
  />
)

const UserForm = ({ handleSubmit, disableSubmit, errors, offices }) => {
  return (
    <form className={s.form} onSubmit={handleSubmit}>
      {isNoErrors(errors) ? null : <Callout type="error" message={formatGraphQLErrors(errors)} />}
      <div className={s.inputGroup}>
        <Field label="Name" className={s.field} name="name" component={renderField} type="text" disabled />
      </div>
      <div className={s.inputGroup}>
        <Field label="Email" className={s.field} name="email" component={renderField} type="text" disabled />
      </div>
      <Field label="Timezone" className={s.field} name="timezone" component={renderField} type="select" disabled>
        <option value="-" key="-">
          Select Timezone
        </option>
        {R.map(
          zone => (
            <option value={zone} key={zone}>
              {zone}
            </option>
          ),
          moment.tz.names()
        )}
      </Field>
      <div className={s.inputGroup}>
        <Field label="Admin" className={s.field} name="isAdmin" component={renderField} type="checkbox" />
      </div>
      <div className={s.inputGroup}>
        <Field
          label="Office"
          className={s.field}
          name="office.id"
          component={renderField}
          type="select"
          offices={offices}
          Custom={OfficeField}
        />
      </div>
      <div className={s.inputGroup}>
        <button className={`${s.btn} ${s.primary}`} type="submit" disabled={disableSubmit}>
          Save
        </button>
      </div>
    </form>
  )
}

export default UserForm
