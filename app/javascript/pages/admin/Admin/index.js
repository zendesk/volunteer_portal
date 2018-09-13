import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { graphql } from 'react-apollo'
import { NetworkStatus } from 'apollo-client'
import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'

import { changeAdminOfficeFilter } from 'actions'

import AdminQuery from './query.gql'

import s from './main.css'

// Only declare styles in here that are needed for MUI components
const muiStyles = {
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
    paddingRight: 40,
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
    margin: 0,
  },
  icon: {
    top: 0,
    paddingTop: 0,
    paddingBottom: 0,
    paddingRight: 0,
    height: 25,
    right: -12,
  },
}

const btnClass = (routing, button) => {
  const currentPath = routing.locationBeforeTransitions.pathname
  const crudAction = new RegExp(`${button}/(\\d+|new)`)

  if (currentPath === '/portal/admin' && button === 'dashboard') {
    return `${s.navBtn} ${s.activeBtn}`
  } else if (currentPath.endsWith(`/${button}`) || crudAction.test(currentPath)) {
    return `${s.navBtn} ${s.activeBtn}`
  } else {
    return s.navBtn
  }
}

const OfficeFilter = ({ adminOfficeFilter, changeAdminOfficeFilter, offices }) => (
  <div className={s.officeFilter} style={muiStyles.menuGroup}>
    <span style={muiStyles.menuTitle}>Office:</span>
    <DropDownMenu
      value={adminOfficeFilter.value}
      onChange={(_e, _k, value) => changeAdminOfficeFilter(value)}
      style={muiStyles.dropdown}
      menuStyle={muiStyles.dropdownMenu}
      labelStyle={muiStyles.menuLabel}
      underlineStyle={muiStyles.underline}
      iconStyle={muiStyles.icon}
      menuItemStyle={muiStyles.menuitem}
    >
      <MenuItem value="all" primaryText="All" style={muiStyles.menuitem} />
      {offices.map((office, i) => <MenuItem key={`office-${i}`} value={office.id} primaryText={office.name} />)}
    </DropDownMenu>
  </div>
)

class Admin extends Component {
  componentDidUpdate() {
    const {
      history,
      data: { networkStatus, currentUser },
    } = this.props

    if (networkStatus !== NetworkStatus.loading && !currentUser.isAdmin) {
      history.push('/portal')
    }
  }

  render() {
    const {
      routing,
      children,
      adminOfficeFilter,
      changeAdminOfficeFilter,
      data: { currentUser, offices },
    } = this.props

    if (adminOfficeFilter.value === 'current') {
      adminOfficeFilter.value = currentUser.office.id
    }

    return (
      <div className={s.admin}>
        <div className={s.content}>
          <div className={s.navBar}>
            <Link to="/portal/admin">
              <span className={btnClass(routing, 'dashboard')}>Dashboard</span>
            </Link>
            <div className={s.navSpacer} />
            <Link to="/portal/admin/events">
              <span className={btnClass(routing, 'events')}>Events</span>
            </Link>
            <div className={s.navSpacer} />
            <Link to="/portal/admin/event-types">
              <span className={btnClass(routing, 'event-types')}>Event Types</span>
            </Link>
            <div className={s.navSpacer} />
            <Link to="/portal/admin/offices">
              <span className={btnClass(routing, 'offices')}>Offices</span>
            </Link>
            <div className={s.navSpacer} />
            <Link to="/portal/admin/organizations">
              <span className={btnClass(routing, 'organizations')}>Organizations</span>
            </Link>
            <div className={s.navSpacer} />
            <Link to="/portal/admin/individual_events">
              <span className={btnClass(routing, 'individual_events')}>Individual Events</span>
            </Link>
            <div className={s.navSpacer} />
            <Link to="/portal/admin/users">
              <span className={btnClass(routing, 'users')}>Users</span>
            </Link>
            <div className={`${s.navSpacer} ${s.growingSpace}`} />
            <OfficeFilter
              adminOfficeFilter={adminOfficeFilter}
              changeAdminOfficeFilter={changeAdminOfficeFilter}
              offices={offices}
            />
          </div>
          {children}
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ routing, model: { adminOfficeFilter } }, { children }) => ({
  routing,
  children,
  adminOfficeFilter,
})

const withData = graphql(AdminQuery, {
  options: {
    fetchPolicy: 'cache-and-network',
  },
})

const withActions = connect(
  mapStateToProps,
  {
    changeAdminOfficeFilter,
  }
)

export default withActions(withData(Admin))
