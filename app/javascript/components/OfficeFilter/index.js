import React from 'react'

import * as R from 'ramda'
import { Dropdown, Field, Item, Menu, Select } from '@zendeskgarden/react-dropdowns'
import { withTranslation } from 'react-i18next'
import { Skeleton } from '@zendeskgarden/react-loaders'

const Loader = withTranslation()(({ t }) => (
  <Dropdown>
    <Field>
      <Select selectedItem="">
        <strong>{t('volunteer_portal.dashboard.layouteventstab.office')}</strong> <Skeleton width="4rem" />
      </Select>
    </Field>
    <Menu>
      {Array(4)
        .fill()
        .map((_, i) => (
          <Item key={i} value={i}>
            <Skeleton />
          </Item>
        ))}
    </Menu>
  </Dropdown>
))

const OfficeFilter = ({ loading, offices, onChange, t, value }) => {
  const options = offices || []
  const all = { id: 'all', name: t('volunteer_portal.dashboard.layouteventstab.office_all') }
  const selectedItem = R.find(R.propEq('id', value))(options) || all

  if (loading) return <Loader />
  return (
    <Dropdown
      selectedItem={selectedItem}
      onSelect={option => onChange(option.id)}
      downshiftProps={{ itemToString: option => option && option.name }}
    >
      <Field>
        <Select>
          <strong>{t('volunteer_portal.dashboard.layouteventstab.office')}</strong> {selectedItem.name}
        </Select>
      </Field>
      <Menu>
        {[all, ...options].map(option => (
          <Item key={option.id} value={option}>
            {option.name}
          </Item>
        ))}
      </Menu>
    </Dropdown>
  )
}

export default withTranslation()(OfficeFilter)
