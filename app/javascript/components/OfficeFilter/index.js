import React from 'react'

import * as R from 'ramda'
import { Dropdown, Field, Item, Menu, Select } from '@zendeskgarden/react-dropdowns'
import { withNamespaces } from 'react-i18next'
import { Skeleton } from '@zendeskgarden/react-loaders'

const Loader = withNamespaces()(({ t }) => (
  <Dropdown>
    <Field>
      <Select selectedItem="">
        <strong>{t('volunteer_portal.dashboard.layouteventstab.office')}</strong> <Skeleton width="4rem" />
      </Select>
    </Field>
    <Menu>
      {[1, 2, 3, 4].map(i => (
        <Item key={i} value={i}>
          <Skeleton />
        </Item>
      ))}
    </Menu>
  </Dropdown>
))

const OfficeFilter = ({ loading, offices, onChange, t, value }) => {
  const all = { id: 'all', name: t('volunteer_portal.dashboard.layouteventstab.office_all') }
  const selectedItem = R.find(R.propEq('id', value))(offices) || all

  if (loading) return <Loader />

  return (
    <Dropdown
      selectedItem={selectedItem}
      onSelect={office => onChange(office.id)}
      downshiftProps={{ itemToString: office => office && office.name }}
    >
      <Field>
        <Select>
          <strong>{t('volunteer_portal.dashboard.layouteventstab.office')}</strong> {selectedItem.name}
        </Select>
      </Field>
      <Menu>
        {[all, ...offices].map(office => (
          <Item key={office.id} value={office}>
            {office.name}
          </Item>
        ))}
      </Menu>
    </Dropdown>
  )
}

export default withNamespaces()(OfficeFilter)
