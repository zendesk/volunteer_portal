import React from 'react'
import Geosuggest from 'react-geosuggest'

import * as R from 'ramda'

import s from './main.css'
import { useTranslation } from 'react-i18next'

const LocationField = ({ input: { value, onChange } }) => {
  const { t } = useTranslation()
  return (
    <Geosuggest
      autoComplete="off"
      inputClassName={s.field}
      suggestsClassName={s.autocompleteList}
      initialValue={value}
      onChange={onChange}
      placeholder={t('volunteer_portal.admin.tab.events.add.searchplaces')}
      onSuggestSelect={R.pipe(R.pathOr('', ['gmaps', 'formatted_address']), onChange)}
    />
  )
}

export default LocationField
