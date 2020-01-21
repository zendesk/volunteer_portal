import React from 'react'

import * as R from 'ramda'
import { Dropdown, Field, Item, Menu, Select } from '@zendeskgarden/react-dropdowns'
import { withNamespaces } from 'react-i18next'

const EventFilter = ({ value, onChange, t }) => {
  const all = { value: 'all', label: t('volunteer_portal.dashboard.layouteventstab.event_all') }
  const options = [
    all,
    { value: 'open', label: t('volunteer_portal.dashboard.layouteventstab.event_open') },
    { value: 'full', label: t('volunteer_portal.dashboard.layouteventstab.event_full') },
  ]

  const selectedItem = R.find(R.propEq('value', value))(options) || all

  return (
    <Dropdown
      selectedItem={selectedItem}
      onSelect={option => onChange(option.value)}
      downshiftProps={{ itemToString: option => option && option.label }}
    >
      <Field>
        <Select>
          <strong>{t('volunteer_portal.dashboard.layouteventstab.event')}</strong> {selectedItem.label}
        </Select>
      </Field>
      <Menu>
        {options.map(option => (
          <Item key={option.value} value={option}>
            {option.label}
          </Item>
        ))}
      </Menu>
    </Dropdown>
  )
}

export default withNamespaces()(EventFilter)
