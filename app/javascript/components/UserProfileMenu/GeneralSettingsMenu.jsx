import React from 'react'
import * as R from 'ramda'
import { Link } from 'react-router'
import {
  Item,
  Separator,
  HeaderItem,
  NextItem,
} from '@zendeskgarden/react-dropdowns'
import TranslationIcon from '@zendeskgarden/svg-icons/src/12/translation-exists-fill.svg'

export const GeneralSettingsMenu = ({ menuValues: { defaultOffice, languageSettings }, isAdmin, pathname, t }) =>
<>
  <HeaderItem>Settings</HeaderItem>
  <NextItem value={defaultOffice}>{t('volunteer_portal.header.user_profile.default_office')}</NextItem>
  <NextItem value={languageSettings}>
    <TranslationIcon /> {t('volunteer_portal.header.user_profile.language')}
  </NextItem>
  <Separator />
  {isAdmin &&
    (R.contains('/portal/admin')(pathname) ? (
      <Link to="/portal">
        <Item value="home">
          {t('volunteer_portal.header.user_profile.volunteer')}
        </Item>
      </Link>
    ) : (
      <Link to="/portal/admin">
        <Item value="admin">
          {t('volunteer_portal.header.user_profile.admin')}
        </Item>
      </Link>
    ))}
  <Item value="sign-out">
      {t('volunteer_portal.header.user_profile.sign_out')}
  </Item>
</>

export default GeneralSettingsMenu
