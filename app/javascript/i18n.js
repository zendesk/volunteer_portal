import i18n from 'i18next'
import { reactI18nextModule } from 'react-i18next'
import backend from 'i18next-xhr-backend'

i18n
  .use(backend)
  .use(reactI18nextModule) // passes i18n down to react-i18next
  .init({
    lng: 'en-us',
    fallbackLng: 'en-us',

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  })

export default i18n
