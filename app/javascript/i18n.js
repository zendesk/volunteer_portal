import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-xhr-backend'

i18n
  .use(Backend)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    lng: 'en',
    fallbackLng: 'en',

    keySeparator: false, // we do not use keys in form messages.welcome

    react: {
      useSuspense: false,
    },
    backend: {
      loadPath: '/assets/locales/{{lng}}/{{ns}}.json',
    },
  })

export default i18n
