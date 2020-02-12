import React from 'react'

import { Dropdown, Field, Item, Menu, Select } from '@zendeskgarden/react-dropdowns'
import { withTranslation } from 'react-i18next'
import AlertWarning from '@zendeskgarden/svg-icons/src/12/alert-error-fill.svg'

const OfficeFilterError = ({ t }) => (
  <Dropdown>
    <Field>
      <Select selectedItem="">
        <strong>{t('volunteer_portal.dashboard.layouteventstab.office')}</strong> <AlertWarning />
      </Select>
    </Field>
    <Menu>
      <Item value="error">Unable to load offices list</Item>
    </Menu>
  </Dropdown>
)

export default withTranslation()(OfficeFilterError)
