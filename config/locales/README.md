# Translations
Files in this directory are used by Zendesk's translation service, Rosetta, to generate translated files.

This is mainly used for development purposes.

## Extracting strings
Add translations in `en.csv` file in the following format.

```
key,value,title,screenshot,wip
volunteer_portal.dashboard.personal,Label referring to who the number of hours belong to,Personal,,true
volunteer_portal.dashboard.layouttab.calendar,Clickable tab that displays the Calendar View,Calendar,https://drive.google.com/open?id=1TEM84-1i6-GgF7N4cJuoTouGgCi0HC_f,true

```

Our preferred method is using the `useTranslation` hook, but there's a lot of legacy using the `withTranslation` after converting from v9.


```
import React from 'react';
import { useTranslation } from 'react-i18next';

export function MyComponent() {
  const { t, i18n } = useTranslation();
  // or const [t, i18n] = useTranslation();

  return <p>{t('my translated text')}</p>
}
```
https://react.i18next.com/latest/usetranslation-hook

Pass in the `t` function to other functions to access translations.


## Translation process
Use a translation software of choice to translate the `.csv` files into other languages. The `compile-i18next-plugin.js` then compiles the `.csv` into servable a servable translation `.json` file.
