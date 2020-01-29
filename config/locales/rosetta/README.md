# Translations
Files in this directory are used by Zendesk's translation service, Rosetta, to generate translated files.

This is mainly used for development purposes.

## Extracting strings
Add translations in `en-us.yml` file (generated on webpack compile if not existing)
```
parts:
  - translation:
      key: dashboard.personal
      title: 'Label referring to who the number of hours belong to'
      value: 'Personal'
  - translation:
      key: dashboard.hours
      title: 'Label referring to the metric of time'
      value: 'Hours'
```

Import `withTranslation` to file you wish to extract strings and translate
```
import { withTranslation } from 'react-i18next'
```
Wrap export with withTranslation to provide variable `t` to props
```
// Before
export default Calendar

// After
export default withTranslation()(Calendar)
```
Expose `t` function to component and replace strings with `t` function call
```
// With spread
const Dashboard = ({t}) => (
  ...
    {t('dashboard.personal')}
  ...
)

// From props
const Dashboard = (props) => (
  ...
    {props.t('dashboard.personal')}
  ...
)

// From class props
class Dashboard extends React.Component {
  ...
  {this.props.t('dashboard.personal')}
  ...
}

```
Pass down `t` constant to other functions that require translations
```
const Dashboard = ({t}) => (
  ...
    PartialComponent(x, y z, t)
  ...
)

const PartialComponent(x, y, z, t) = () => (
  ...
    {this.props.t('dashboard.personal')}
  ...
)
```
### Notes
The plugin will detect changes to the `en-us.yml` file and compile and edit `en-us.json` with updated translations from yml file. It will then be served to the public file for i18next consumption.

## Translation process
Once the strings are extracted, Zendesk's Rosetta system will read the `en-us.yml` file and generate json translations derived from the yml file. For example a `jp.json` will be created that contains the translations derived from `en-us.yml`

Once translations are available for a language, a compilation step is needed (only once) to serve the translations to the public file for consumption.