import React from 'react'
import {
  Item,
  Separator,
  PreviousItem,
} from '@zendeskgarden/react-dropdowns'

const DefaultOfficeMenu = ({ offices, previousMenuValue, selectedItem, t }) =>
<>
  <PreviousItem value={previousMenuValue}>
    {t('volunteer_portal.header.user_profile.default_office')}
  </PreviousItem>
  <Separator />
  {offices.map((office, i) => (
    <Item key={i} value={{ office, language: selectedItem.language }}>
      {office.name}
    </Item>
  ))}
</>

export default DefaultOfficeMenu
