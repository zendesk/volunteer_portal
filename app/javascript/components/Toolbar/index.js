import React from 'react'
import R from 'ramda'

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
    <span style={styles.menuTitle}>{t('dashboard.layouteventstab.show')}</span>
    <DropDownMenu
      value={value}
      onChange={onChange}
      style={styles.dropdown}
      menuStyle={styles.dropdownMenu}
      labelStyle={styles.menuLabel}
      underlineStyle={styles.underline}
      iconStyle={styles.icon}
    >
      <MenuItem value="all" primaryText={t('dashboard.layouteventstab.show.all')} style={styles.menuitem} />
      <MenuItem value="mine" primaryText={t('dashboard.layouteventstab.show.myevents')} style={styles.menuitem} />
    </DropDownMenu>
  </div>
)

const EventFilter = ({ value, onChange, t }) => (
  <div style={styles.menuGroup}>
    <span style={styles.menuTitle}>{t('dashboard.layouteventstab.event')}</span>
    <DropDownMenu
      value={value}
      onChange={onChange}
      style={styles.dropdown}
      menuStyle={styles.dropdownMenu}
      labelStyle={styles.menuLabel}
      underlineStyle={styles.underline}
      iconStyle={styles.icon}
    >
      <MenuItem value="all" primaryText={t('dashboard.layouteventstab.event.all')} style={styles.menuitem} />
      <MenuItem value="open" primaryText={t('dashboard.layouteventstab.event.open')} style={styles.menuitem} />
      <MenuItem value="full" primaryText={t('dashboard.layouteventstab.event.full')} style={styles.menuitem} />
    </DropDownMenu>
  </div>
)

const OfficeFilter = ({ value, onChange, offices, t }) => (
  <div style={styles.menuGroup}>
    <span style={styles.menuTitle}>{t('dashboard.layouteventstab.office')}</span>
    <DropDownMenu
      value={value}
      onChange={onChange}
      style={styles.dropdown}
      menuStyle={styles.dropdownMenu}
      labelStyle={styles.menuLabel}
      underlineStyle={styles.underline}
      iconStyle={styles.icon}
    >
      <MenuItem value="all" primaryText={t('dashboard.layouteventstab.office')} style={styles.menuitem} />
      {offices.map((office, i) => (
        <MenuItem key={`office-${i}`} value={office.id} primaryText={office.name} style={styles.menuitem} />
      ))}
    </DropDownMenu>
  </div>
)

const Toolbar = (
  offices,
  showFilter,
  eventFilter,
  officeFilter,
  t,
  { label, view, views, onNavigate, onViewChange }
) => (
  <div className={s.toolbar}>
    <div className={s.navBar}>
      <button className={s.todayBtn} type="button" onClick={() => onNavigate(navigate.TODAY)}>
        {t('dashboard.layoutdatetab.today')}
      </button>
      <button className={s.btn} type="button" onClick={() => onNavigate(navigate.PREVIOUS)}>
        {t('dashboard.layoutdatetab.previous')}
      </button>
      <span className={s.label}>{label}</span>
      <button className={s.btn} type="button" onClick={() => onNavigate(navigate.NEXT)}>
        {t('dashboard.layoutdatetab.after')}
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
            {viewName.charAt(0).toUpperCase() + viewName.slice(1)}
          </button>
        ))}
      </div>
    </div>
  </div>
)

export default Toolbar
