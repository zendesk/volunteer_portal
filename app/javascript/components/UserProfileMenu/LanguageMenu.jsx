import React from 'react'
import {
  Item,
  Separator,
  PreviousItem,
} from '@zendeskgarden/react-dropdowns'
import TranslationIcon from '@zendeskgarden/svg-icons/src/12/translation-exists-fill.svg'

const LanguageMenu = ( { languages, previousMenuValue, selectedItem, t }) =>
<>
  <PreviousItem value={previousMenuValue}>
    <TranslationIcon /> {t('volunteer_portal.header.user_profile.language')}
  </PreviousItem>
  <Separator />
  {languages.map((language, i) => (
    <Item key={i} value={{ office: selectedItem.office, language: { label: language.languageName, value: language.languageCode } }}>
      {language.languageName}
    </Item>
  ))}
</>

export default LanguageMenu
