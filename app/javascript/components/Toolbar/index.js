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

const ShowFilter = ({ value, onChange }) => (
  <div style={styles.menuGroup}>
    <span style={styles.menuTitle}>Show:</span>
    <DropDownMenu
      value={value}
      onChange={onChange}
      style={styles.dropdown}
      menuStyle={styles.dropdownMenu}
      labelStyle={styles.menuLabel}
      underlineStyle={styles.underline}
      iconStyle={styles.icon}
    >
      <MenuItem value="all" primaryText="All" style={styles.menuitem} />
      <MenuItem value="mine" primaryText="My Events" style={styles.menuitem} />
    </DropDownMenu>
  </div>
)

const EventFilter = ({ value, onChange }) => (
  <div style={styles.menuGroup}>
    <span style={styles.menuTitle}>Event:</span>
    <DropDownMenu
      value={value}
      onChange={onChange}
      style={styles.dropdown}
      menuStyle={styles.dropdownMenu}
      labelStyle={styles.menuLabel}
      underlineStyle={styles.underline}
      iconStyle={styles.icon}
    >
      <MenuItem value="all" primaryText="All" style={styles.menuitem} />
      <MenuItem value="open" primaryText="Open" style={styles.menuitem} />
      <MenuItem value="full" primaryText="Full" style={styles.menuitem} />
    </DropDownMenu>
  </div>
)

const OfficeFilter = ({ value, onChange, offices }) => (
  <div style={styles.menuGroup}>
    <span style={styles.menuTitle}>Office:</span>
    <DropDownMenu
      value={value}
      onChange={onChange}
      style={styles.dropdown}
      menuStyle={styles.dropdownMenu}
      labelStyle={styles.menuLabel}
      underlineStyle={styles.underline}
      iconStyle={styles.icon}
    >
      <MenuItem value="all" primaryText="All" style={styles.menuitem} />
      {offices.map((office, i) => (
        <MenuItem key={`office-${i}`} value={office.id} primaryText={office.name} style={styles.menuitem} />
      ))}
    </DropDownMenu>
  </div>
)

const Toolbar = (offices, showFilter, eventFilter, officeFilter, { label, view, views, onNavigate, onViewChange }) => (
  <div className={s.toolbar}>
    <div className={s.navBar}>
      <button className={s.todayBtn} type="button" onClick={() => onNavigate(navigate.TODAY)}>
        Today
      </button>
      <button className={s.btn} type="button" onClick={() => onNavigate(navigate.PREVIOUS)}>
        ‹
      </button>
      <span className={s.label}>{label}</span>
      <button className={s.btn} type="button" onClick={() => onNavigate(navigate.NEXT)}>
        ›
      </button>
    </div>
    <div className={s.filterBar}>
      <div className={s.filterDropdowns}>
        <ShowFilter value={showFilter.value} onChange={(_e, _i, value) => showFilter.onChange(value)} />
        <EventFilter value={eventFilter.value} onChange={(_e, _i, value) => eventFilter.onChange(value)} />
        <OfficeFilter
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
