import React from 'react'
import * as R from 'ramda'
import { Link } from 'react-router'
import {
  Item,
  Separator,
  PreviousItem,
  HeaderItem,
  NextItem,
} from '@zendeskgarden/react-dropdowns'
import TranslationIcon from '@zendeskgarden/svg-icons/src/12/translation-exists-fill.svg'

export const DefaultOfficeMenu = ({ offices, previousMenuValue, selectedItem, t }) =>
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

export const LanguageMenu = ( { languages, previousMenuValue, selectedItem, t }) =>
<>
  <PreviousItem value={previousMenuValue}>
    <TranslationIcon /> {t('volunteer_portal.header.user_profile.language')}
  </PreviousItem>
  <Separator />
  {languages.map((language, i) => (
    <Item key={i} value={{ office: selectedItem.office, language }}>
      {' '}
      {language.label}{' '}
    </Item>
  ))}
</>

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
  <div>
    <a href="/users/sign_out">
      <Item value="sign-out">
        {t('volunteer_portal.header.user_profile.sign_out')}
      </Item>
    </a>
  </div>
</>