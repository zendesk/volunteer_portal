import React from 'react'

import DropDownMenu from 'material-ui/DropDownMenu'

import s from './main.css'

// Material UI components still require inline styles
export const styles = {
  dropdown: {
    height: 25,
    marginLeft: -18,
    color: '#777',
  },
  dropdownMenu: {
    color: '#777',
  },
  menuLabel: {
    color: '#777',
    fontWeight: 600,
    lineHeight: '23px',
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
  menuitem: {
    color: '#777',
    fontWeight: 600,
    lineHeight: '23px',
    padding: '3px 0',
  },
}

const Filter = ({ title, value, onChange, children }) => (
  <div className={s.menuGroup}>
    <span>{title}</span>
    <DropDownMenu
      value={value}
      onChange={(_e, _i, value) => onChange(value)}
      style={styles.dropdown}
      menuStyle={styles.dropdownMenu}
      labelStyle={styles.menuLabel}
      underlineStyle={styles.underline}
      iconStyle={styles.icon}
    >
      {children}
    </DropDownMenu>
  </div>
)

export default Filter
