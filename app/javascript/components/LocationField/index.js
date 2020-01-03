import React from 'react'
import Geosuggest from 'react-geosuggest'

import * as R from 'ramda'

import s from './main.css'

const LocationField = ({ input: { value, onChange } }) => (
  <Geosuggest
    autoComplete="off"
    inputClassName={s.field}
    suggestsClassName={s.autocompleteList}
    initialValue={value}
    onChange={onChange}
    onSuggestSelect={R.pipe(
      R.pathOr('', ['gmaps', 'formatted_address']),
      onChange
    )}
  />
)

export default LocationField
