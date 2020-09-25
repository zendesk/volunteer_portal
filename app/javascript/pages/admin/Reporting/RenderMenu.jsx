import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  Menu,
  Item,
  Separator,
  NextItem,
  PreviousItem,
} from '@zendeskgarden/react-dropdowns';
import * as R from 'ramda'

const BaseMenu = ({ t }) =>
<>
  <Item value="user">{t('volunteer_portal.admin.tab.reporting.dropdown.users')}</Item>
  <NextItem value="organized">{t('volunteer_portal.admin.tab.reporting.dropdown.organized_events')}</NextItem>
  <NextItem value="individual">{t('volunteer_portal.admin.tab.reporting.dropdown.individual_events')}</NextItem>
</>

const OrgnizedEventsMenu = ({ t }) =>
<>
  <PreviousItem value="base">{t('volunteer_portal.admin.tab.reporting.dropdown.organized_events')}</PreviousItem>
  <Separator />
  <Item value="organizedEventType">{t('volunteer_portal.admin.tab.reporting.dropdown.nested.event_type')}</Item>
  {/* Not implemented yet */}
  {/* <Item value="organizedTag">{t('volunteer_portal.admin.tab.reporting.dropdown.nested.tag')}</Item> */}
  {/* <Item value="organizedOrganization">{t('volunteer_portal.admin.tab.reporting.dropdown.nested.organization')}</Item> */}
</>

const IndividualEventsMenu = ({ t }) =>
<>
  <PreviousItem value="base">{t('volunteer_portal.admin.tab.reporting.dropdown.individual_events')}</PreviousItem>
  <Separator />
  <Item value="individualEventType">{t('volunteer_portal.admin.tab.reporting.dropdown.nested.event_type')}</Item>
  {/* Not implemented yet */}
  {/* <Item value="individualTag">{t('volunteer_portal.admin.tab.reporting.dropdown.nested.tag')}</Item> */}
  {/* <Item value="individualOrganization">{t('volunteer_portal.admin.tab.reporting.dropdown.nested.organization')}</Item> */}
</>

const ReportMenu = ({ dropDownTempSelectedItem }) => {
  const { t } = useTranslation()
  return (
    <Menu>
      {
        R.cond([
          [R.equals('organized'), R.always(<OrgnizedEventsMenu t={t} />)],
          [R.equals('individual'), R.always(<IndividualEventsMenu t={t} />)],
          [R.T, R.always(<BaseMenu t={t} />)],
        ])(dropDownTempSelectedItem)
      }
    </Menu>
  )
}

export default ReportMenu
