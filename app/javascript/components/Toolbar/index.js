import React from 'react'
import { withNamespaces } from 'react-i18next'

import { navigate } from 'react-big-calendar/lib/utils/constants'

import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'

import s from './main.css'

// Material UI components still require inline styles
const styles = {
  menuGroup: {
    height: 23,
    display: 'flex',
    alignItems: 'center',
  },
  dropdown: {
    height: 25,
    marginLeft: -18,
    color: '#777',
  },
  menuLabel: {
    color: '#777',
    fontWeight: 600,
    lineHeight: '23px',
  },
  dropdownMenu: {
    color: '#777',
  },
  menuitem: {
    color: '#777',
    fontWeight: 600,
    lineHeight: '23px',
    padding: '3px 0',
  },
  underline: {
    border: 'none',
  },
  icon: {
    top: 0,
    paddingTop: 0,
    paddingBottom: 0,
    height: 25,
  },
}

const ShowFilter = ({ value, onChange, t }) => (
  <div style={styles.menuGroup}>
    <span style={styles.menuTitle}>{t('volunteer_portal.dashboard.layouteventstab.show')}</span>
    <DropDownMenu
      value={value}
      onChange={onChange}
      style={styles.dropdown}
      menuStyle={styles.dropdownMenu}
      labelStyle={styles.menuLabel}
      underlineStyle={styles.underline}
      iconStyle={styles.icon}
    >
      <MenuItem
        value="all"
        primaryText={t('volunteer_portal.dashboard.layouteventstab.show.all')}
        style={styles.menuitem}
      />
      <MenuItem
        value="mine"
        primaryText={t('volunteer_portal.dashboard.layouteventstab.show.myevents')}
        style={styles.menuitem}
      />
    </DropDownMenu>
  </div>
)

const EventFilter = ({ value, onChange, t }) => (
  <div style={styles.menuGroup}>
    <span style={styles.menuTitle}>{t('volunteer_portal.dashboard.layouteventstab.event')}</span>
    <DropDownMenu
      value={value}
      onChange={onChange}
      style={styles.dropdown}
      menuStyle={styles.dropdownMenu}
      labelStyle={styles.menuLabel}
      underlineStyle={styles.underline}
      iconStyle={styles.icon}
    >
      <MenuItem
        value="all"
        primaryText={t('volunteer_portal.dashboard.layouteventstab.event.all')}
        style={styles.menuitem}
      />
      <MenuItem
        value="open"
        primaryText={t('volunteer_portal.dashboard.layouteventstab.event.open')}
        style={styles.menuitem}
      />
      <MenuItem
        value="full"
        primaryText={t('volunteer_portal.dashboard.layouteventstab.event.full')}
        style={styles.menuitem}
      />
    </DropDownMenu>
  </div>
)

const OfficeFilter = ({ value, onChange, offices, t }) => (
  <div style={styles.menuGroup}>
    <span style={styles.menuTitle}>{t('volunteer_portal.dashboard.layouteventstab.office')}</span>
    <DropDownMenu
      value={value}
      onChange={onChange}
      style={styles.dropdown}
      menuStyle={styles.dropdownMenu}
      labelStyle={styles.menuLabel}
      underlineStyle={styles.underline}
      iconStyle={styles.icon}
    >
      <MenuItem
        value="all"
        primaryText={t('volunteer_portal.dashboard.layouteventstab.office.all')}
        style={styles.menuitem}
      />
      {offices.map((office, i) => (
        <MenuItem key={`office-${i}`} value={office.id} primaryText={office.name} style={styles.menuitem} />
      ))}
    </DropDownMenu>
  </div>
)

const toolbarTextMap = (t, key) => {
  const map = {
    month: t('volunteer_portal.calendar.bigcalendar.month'),
    week: t('volunteer_portal.calendar.bigcalendar.week'),
    work_week: t('volunteer_portal.calendar.bigcalendar.work_week'),
    day: t('volunteer_portal.calendar.bigcalendar.day'),
    agenda: t('volunteer_portal.calendar.bigcalendar.agenda'),
  }
  return map[key]
}

const Toolbar = ({
  label,
  view,
  views,
  onNavigate,
  onViewChange,
  offices,
  showFilter,
  eventFilter,
  officeFilter,
  t,
}) => (
  <div className={s.toolbar}>
    <div className={s.navBar}>
      <button className={s.todayBtn} type="button" onClick={() => onNavigate(navigate.TODAY)}>
        {t('volunteer_portal.dashboard.layoutdatetab.today')}
      </button>
      <button className={s.btn} type="button" onClick={() => onNavigate(navigate.PREVIOUS)}>
        {t('volunteer_portal.dashboard.layoutdatetab.previous')}
      </button>
      <span className={s.label}>{label}</span>
      <button className={s.btn} type="button" onClick={() => onNavigate(navigate.NEXT)}>
        {t('volunteer_portal.dashboard.layoutdatetab.after')}
      </button>
    </div>
    <div className={s.filterBar}>
      <div className={s.filterDropdowns}>
        <ShowFilter t={t} value={showFilter.value} onChange={(_e, _i, value) => showFilter.onChange(value)} />
        <EventFilter t={t} value={eventFilter.value} onChange={(_e, _i, value) => eventFilter.onChange(value)} />
        <OfficeFilter
          t={t}
          value={officeFilter.value}
          onChange={(_e, _i, value) => officeFilter.onChange(value)}
          offices={offices}
        />
      </div>
      <div className={s.viewBtns}>
        {views.map(viewName => (
          <button
            key={viewName}
            className={view === viewName ? `${s.btn} ${s.activeBtn}` : s.btn}
            onClick={() => onViewChange(viewName)}
          >
            {toolbarTextMap(t, viewName)}
          </button>
        ))}
      </div>
    </div>
  </div>
)

export default withNamespaces()(Toolbar)
