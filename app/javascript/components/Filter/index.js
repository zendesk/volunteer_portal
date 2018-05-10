import React from 'react'
import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'

import s from './main.css'

// Need inline styles for the material-ui components, everything else should be CSS
const styles = {
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

const Filter = ({ collection, value, onChange, itemValueProp }) => (
  <div className={s.menuGroup}>
    <span>Office:</span>
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
      {collection.map((item, i) => (
        <MenuItem key={`item-${i}`} value={item.id} primaryText={item[itemValueProp]} style={styles.menuitem} />
      ))}
    </DropDownMenu>
  </div>
)

export default Filter
