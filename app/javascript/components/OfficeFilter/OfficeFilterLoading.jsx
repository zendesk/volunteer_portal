import React from 'react'

import { Dropdown, Field, Item, Menu, Select } from '@zendeskgarden/react-dropdowns'
import { withTranslation } from 'react-i18next'
import { Skeleton } from '@zendeskgarden/react-loaders'

const OfficeFilterLoading = ({ t }) => (
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
)

export default withTranslation()(OfficeFilterLoading)
