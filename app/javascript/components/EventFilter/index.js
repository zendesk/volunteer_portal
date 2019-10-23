import React from 'react'

import MenuItem from 'material-ui/MenuItem'
import { withNamespaces } from 'react-i18next'

import Filter from 'components/Filter'
import { styles } from 'components/Filter'

const EventFilter = ({ value, onChange, t }) => (
  <Filter title={t('volunteer_portal.dashboard.layouteventstab.event')} value={value} onChange={onChange}>
    <MenuItem
      value="all"
      primaryText={t('volunteer_portal.dashboard.layouteventstab.event_all')}
      style={styles.menuitem}
    />
    <MenuItem
      value="open"
      primaryText={t('volunteer_portal.dashboard.layouteventstab.event_open')}
      style={styles.menuitem}
    />
    <MenuItem
      value="full"
      primaryText={t('volunteer_portal.dashboard.layouteventstab.event_full')}
      style={styles.menuitem}
    />
  </Filter>
)

export default withNamespaces()(EventFilter)
