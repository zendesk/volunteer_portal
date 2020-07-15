import React from 'react'
import {
  Item,
  HeaderItem,
  NextItem,
} from '@zendeskgarden/react-dropdowns'
import TranslationIcon from '@zendeskgarden/svg-icons/src/12/translation-exists-fill.svg'

export const GeneralSettingsMenu = ({ menuValues: { defaultOffice, languageSettings }, t }) =>
<>
  <HeaderItem>{t('volunteer_portal.menu.settings')}</HeaderItem>
  <NextItem value={defaultOffice}>{t('volunteer_portal.header.user_profile.default_office')}</NextItem>
  <NextItem value={languageSettings}>
    <TranslationIcon /> {t('volunteer_portal.header.user_profile.language')}
  </NextItem>
  <Item value="sign-out">
      {t('volunteer_portal.header.user_profile.sign_out')}
  </Item>
</>

export default GeneralSettingsMenu
