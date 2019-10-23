import React from 'react'

import MenuItem from 'material-ui/MenuItem'
import { withNamespaces } from 'react-i18next'

import Filter from 'components/Filter'
import { styles } from 'components/Filter'

const ShowFilter = ({ value, onChange, t }) => (
  <Filter title={t('volunteer_portal.dashboard.layouteventstab.show')} value={value} onChange={onChange}>
    <MenuItem
      value="all"
      primaryText={t('volunteer_portal.dashboard.layouteventstab.show_all')}
      style={styles.menuitem}
    />
    <MenuItem
      value="mine"
      primaryText={t('volunteer_portal.dashboard.layouteventstab.show_myevents')}
      style={styles.menuitem}
    />
  </Filter>
)

export default withNamespaces()(ShowFilter)
