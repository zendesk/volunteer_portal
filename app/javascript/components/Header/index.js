import React from 'react'
import { Link } from 'react-router'
import R from 'ramda'

import Popover from 'material-ui/Popover'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import Divider from 'material-ui/Divider'
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right'
import ContentIcon from 'material-ui/svg-icons/content/create'

import { present } from '../../lib/utils'
import s from './main.css'

const styles = {
  item: {
    fontSize: 14,
  },
}

const AdminActions = ({ currentUser }) =>
  currentUser.isAdmin ? (
    <div className={s.adminActions}>
      <div className={s.adminBox}>
        <Link to="/portal/admin">
          <button className={s.btn}>
            <ContentIcon />
          </button>
        </Link>
      </div>
    </div>
  ) : null

const Header = ({ currentUser, offices, togglePopover, popover, handleOfficeSelect, adminPage }) =>
  R.isNil(currentUser) || R.isEmpty(currentUser) ? null : (
    <div className={s.header}>
      <div className={s.container}>
        <div className={adminPage ? `${s.wrapper} ${s.wrapperAdmin}` : s.wrapper}>
          <div className={s.logoBox}>
            <Link to="/portal">
              <img
                alt="Zendesk Relationshapes Logo"
                className={s.logo}
                src="//d1eipm3vz40hy0.cloudfront.net/images/part-header/zendesk-relationshapes-logo.svg"
              />
            </Link>
          </div>
          <AdminActions currentUser={currentUser} />
          <div>
            <button className={s.btn} onClick={togglePopover}>
              <img className={s.img} src={currentUser.photo} />
              <div className={s.userInfoBox}>
                <div className={s.userName}>{currentUser.name}</div>
                <div className={s.userOffice}>{currentUser.office && currentUser.office.name}</div>
              </div>
              <Popover
                className={s.popover}
                open={present(popover)}
                anchorEl={popover ? popover.anchorEl : null}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                targetOrigin={{ horizontal: 'right', vertical: 'top' }}
                onRequestClose={togglePopover}
              >
                <Menu>
                  <MenuItem
                    style={styles.item}
                    primaryText="Default Office"
                    rightIcon={<ArrowDropRight />}
                    menuItems={offices.map((o, i) => (
                      <MenuItem
                        key={`office-${i}`}
                        primaryText={o.name}
                        style={styles.item}
                        checked={currentUser.office.id === o.id}
                        onClick={() => handleOfficeSelect(o)}
                        insetChildren
                      />
                    ))}
                  />
                  <Divider />
                  <a href="/users/sign_out">
                    <MenuItem style={styles.item} primaryText="Sign out" />
                  </a>
                </Menu>
              </Popover>
            </button>
          </div>
        </div>
      </div>
      <div style={{ overflow: 'auto' }} />
    </div>
  )

export default Header
