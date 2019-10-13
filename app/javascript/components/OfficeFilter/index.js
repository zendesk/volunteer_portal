import React from 'react'

import MenuItem from 'material-ui/MenuItem'
import { withNamespaces } from 'react-i18next'

import Filter from 'components/Filter'
import { styles } from 'components/Filter'

const OfficeFilter = ({ value, onChange, offices, t }) => (
  <Filter title={t('volunteer_portal.dashboard.layouteventstab.office')} value={value} onChange={onChange}>
    <MenuItem
      value="all"
      primaryText={t('volunteer_portal.dashboard.layouteventstab.office.all')}
      style={styles.menuitem}
    />
    {offices.map((office, i) => (
      <MenuItem key={`office-${i}`} value={office.id} primaryText={office.name} style={styles.menuitem} />
    ))}
  </Filter>
)

export default withNamespaces()(OfficeFilter)
