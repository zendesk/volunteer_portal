import React from 'react'
import { Field } from 'redux-form'
import R from 'ramda'
import DatePicker from 'material-ui/DatePicker'
import TimePicker from 'material-ui/TimePicker'

import Callout from 'components/Callout'
import UserList from 'components/UserList'
import LocationField from 'components/LocationField'

import { Dropdown, Menu, Item, Autocomplete, Label, Hint, Field as GardenField } from '@zendeskgarden/react-dropdowns'

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
  const { input, label, type, Custom, meta: { touched, error, warning }, className, required } = props
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

const renderGardenField = props => {
  const { input, label, type, Custom, meta: { touched, error, warning }, className, required } = props
  const fieldInput = renderFieldHelper({ input, type, label, className, selectOptions: props.children })
  return <div>{Custom ? <Custom {...props} /> : fieldInput}</div>
  // return (
  //   <GardenField>
  //     <Label>Autocomplete with debounce</Label>
  //     <Hint>This example includes basic debounce logic using Hooks</Hint>
  //     {/* <label className={s.label}>
  //       {label} <span className={s.errorMsg}>{touched && error ? renderError(error) : '*'}</span>
  //     </label> */}
  //     <div>{Custom ? <Custom {...props} /> : fieldInput}</div>
  //   </GardenField>
  // )
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

const debounce = require('lodash.debounce')
const options = ['Aster', "Bachelor's button", 'Celosia', 'Dusty miller']

function OrganizationField({ organizations, input: { value, onChange } }) {
  // <AutoComplete
  //   id="organization"
  //   searchText={R.isNil(value) || R.isEmpty(value) ? value : R.find(o => o.id === value, organizations).name}
  //   dataSource={organizations}
  //   dataSourceConfig={{ text: 'name', value: 'id' }}
  //   filter={AutoComplete.fuzzyFilter}
  //   onNewRequest={(chosen, _i) => onChange(chosen.id)}
  //   className={s.muiTextField}
  //   textFieldStyle={styles.muiTextField}
  //   menuStyle={{ overflowY: 'scroll', height: 200 }}
  //   openOnFocus
  //   fullWidth
  // />
  const [selectedItem, setSelectedItem] = React.useState(options[0])
  const [inputValue, setInputValue] = React.useState('')
  const [matchingOptions, setMatchingOptions] = React.useState(options)

  /**
   * Debounce filtering
   */
  const filterMatchingOptionsRef = React.useRef(
    debounce(value => {
      const matchingOptions = options.filter(option => {
        return (
          option
            .trim()
            .toLowerCase()
            .indexOf(value.trim().toLowerCase()) !== -1
        )
      })

      setMatchingOptions(matchingOptions)
    }, 300)
  )

  React.useEffect(
    () => {
      filterMatchingOptionsRef.current(inputValue)
    },
    [inputValue]
  )

  const renderOptions = () => {
    if (matchingOptions.length === 0) {
      return <Item disabled>No matches found</Item>
    }

    return matchingOptions.map(option => (
      <Item key={option} value={option}>
        <span>{option}</span>
      </Item>
    ))
  }
  return (
    <Dropdown
      inputValue={inputValue}
      selectedItem={selectedItem}
      onSelect={item => setSelectedItem(item)}
      onInputValueChange={inputValue => setInputValue(inputValue)}
      downshiftProps={{ defaultHighlightedIndex: 0 }}
    >
      <GardenField>
        <Label>Autocomplete with debounce</Label>
        <Hint>This example includes basic debounce logic using Hooks</Hint>
        <Autocomplete>
          <span aria-label="Garden emoji" role="image">
            🌱
          </span>
          <span>{selectedItem}</span>
        </Autocomplete>
      </GardenField>
      <Menu>{renderOptions()}</Menu>
    </Dropdown>
  )
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
    <div className={`${s.inputGroup} ${s.twoColumnForm}`}>
      <div className={s.column}>
        <Field label="Event Type" className={s.field} name="eventType.id" component={renderField} type="select">
          <option value="-" key="-" />
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
          component={renderGardenField}
          organizations={organizations}
          Custom={OrganizationField}
        />
      </div>
    </div>
    <div className={`${s.inputGroup} ${s.twoColumnForm}`}>
      <div className={s.column}>
        <Field label="Office" className={s.field} name="office.id" component={renderField} type="select">
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
    <UserList users={users} destroySignup={destroySignup} />
  </form>
)

export default EventForm
