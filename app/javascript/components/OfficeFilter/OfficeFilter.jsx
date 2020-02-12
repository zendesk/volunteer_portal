import React, { useContext } from 'react'

import { useQuery } from '@apollo/react-hooks'
import * as R from 'ramda'
import { Dropdown, Field, Item, Menu, Select } from '@zendeskgarden/react-dropdowns'
import { withTranslation } from 'react-i18next'

import Error from './OfficeFilterError'
import Loading from './OfficeFilterLoading'
import OfficesQuery from './query.gql'
import { FilterContext, officeFilterValueLens } from '/context'

const OfficeFilter = ({ t }) => {
  const { filters, setOfficeValue } = useContext(FilterContext)
  const { data, loading, error } = useQuery(OfficesQuery)

  if (loading) return <Loading />
  if (error) return <Error />

  const options = R.propOr([], 'offices', data)
  const all = { id: 'all', name: t('volunteer_portal.dashboard.layouteventstab.office_all') }
  const value = R.view(officeFilterValueLens, filters)
  const selectedItem = R.find(R.propEq('id', value))(options) || all

  return (
    <Dropdown
      selectedItem={selectedItem}
      onSelect={option => setOfficeValue(option.id)}
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
