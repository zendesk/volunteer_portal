import React, { useContext } from 'react'

import * as R from 'ramda'
import { Dropdown, Field, Item, Menu, Select } from '@zendeskgarden/react-dropdowns'
import { withTranslation } from 'react-i18next'

import { FilterContext, showFilterValueLens } from '/context'

const ShowFilter = ({ t }) => {
  const { filters, setShowValue } = useContext(FilterContext)
  const value = R.view(showFilterValueLens, filters)
  const all = { value: 'all', label: t('volunteer_portal.dashboard.layouteventstab.show_all') }
  const options = [all, { value: 'mine', label: t('volunteer_portal.dashboard.layouteventstab.show_myevents') }]

  const selectedItem = R.find(R.propEq('value', value))(options) || all

  return (
    <Dropdown
      selectedItem={selectedItem}
      onSelect={option => setShowValue(option.value)}
      downshiftProps={{ itemToString: option => option && option.label }}
    >
      <Field>
        <Select>
          <strong>{t('volunteer_portal.dashboard.layouteventstab.show')}</strong> {selectedItem.label}
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

export default withTranslation()(ShowFilter)
