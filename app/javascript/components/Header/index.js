import React from 'react'
import { Link } from 'react-router'
import * as R from 'ramda'

import Popover from 'material-ui/Popover'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import Divider from 'material-ui/Divider'
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right'
import ContentIcon from 'material-ui/svg-icons/content/create'
import SvgIcon from 'material-ui/SvgIcon'

import DropDownMenu from 'material-ui/DropDownMenu'

import { present } from '../../lib/utils'
import s from './main.css'
import i18next from 'i18next'
import { AutoComplete } from 'material-ui'

// TODO: Refactor to use Garden Components

const TranslateIcon = props => (
  <SvgIcon {...props} style={{ height: 16, margin: 'auto' }}>
    <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" />
  </SvgIcon>
)

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
            <ContentIcon style={{ margin: 'auto', height: 16 }} />
            <p style={{ fontSize: 15 }}>Admin</p>
          </button>
        </Link>
      </div>
    </div>
  ) : null

class LanguageSelect extends React.Component {
  state = {
    language: i18next.language,
  }
  render() {
    return (
      <div style={{ display: 'flex' }}>
        <TranslateIcon />
        <DropDownMenu
          style={{ marginBottom: 0, marginLeft: -20, height: AutoComplete }}
          underlineStyle={{ display: 'none' }}
          value={this.state.language}
          onChange={(event, index, value) => {
            this.setState(() => ({ language: i18next.language }))
            i18next.changeLanguage(value, () => {
              // TODO: Handle callback (error/success)
            })
          }}
        >
          <MenuItem value="en" primaryText="English" />
          <MenuItem value="ja" primaryText="日本語" />
        </DropDownMenu>
      </div>
    )
  }
}

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
          <LanguageSelect />
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
