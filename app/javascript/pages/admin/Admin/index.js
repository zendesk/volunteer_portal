import React, { useContext } from 'react'

import { Link, withRouter } from 'react-router'
import { withTranslation } from 'react-i18next'

import { UserContext } from '/context'

import s from './main.css'

const btnClass = (location, button) => {
  const currentPath = location.pathname
  const crudAction = new RegExp(`${button}/(\\d+|new)`)

  if (currentPath === '/portal/admin' && button === 'dashboard') {
    return `${s.navBtn} ${s.activeBtn}`
  } else if (currentPath.endsWith(`/${button}`) || crudAction.test(currentPath)) {
    return `${s.navBtn} ${s.activeBtn}`
  } else {
    return s.navBtn
  }
}

const Admin = ({ location, router, children, t }) => {
  const { currentUser } = useContext(UserContext)

  if (!currentUser.isAdmin) {
    router.push('/portal')
  }

  return (
    <div className={s.admin}>
      <div className={s.content}>
        <div className={s.navBar}>
          <Link to="/portal/admin">
            <span className={btnClass(location, 'dashboard')}>{t('volunteer_portal.admin.tab.dashboard')}</span>
          </Link>
          <div className={s.navSpacer} />
          <Link to="/portal/admin/events">
            <span className={btnClass(location, 'events')}>{t('volunteer_portal.admin.tab.events')}</span>
          </Link>
          <div className={s.navSpacer} />
          <Link to="/portal/admin/event-types">
            <span className={btnClass(location, 'event-types')}>{t('volunteer_portal.admin.tab.eventtypes')}</span>
          </Link>
          <div className={s.navSpacer} />
          <Link to="/portal/admin/tags">
            <span className={btnClass(location, 'tags')}>{t('volunteer_portal.admin.tab.tags')}</span>
          </Link>
          <div className={s.navSpacer} />
          <Link to="/portal/admin/offices">
            <span className={btnClass(location, 'offices')}>{t('volunteer_portal.admin.tab.offices')}</span>
          </Link>
          <div className={s.navSpacer} />
          <Link to="/portal/admin/organizations">
            <span className={btnClass(location, 'organizations')}>{t('volunteer_portal.admin.tab.organizations')}</span>
          </Link>
          <div className={s.navSpacer} />
          <Link to="/portal/admin/individual_events">
            <span className={btnClass(location, 'individual_events')}>
              {t('volunteer_portal.admin.tab.individualevents')}
            </span>
          </Link>
          <div className={s.navSpacer} />
          <Link to="/portal/admin/users">
            <span className={btnClass(location, 'users')}>{t('volunteer_portal.admin.tab.users')}</span>
          </Link>
          <div className={s.navSpacer} />
          <Link to="/portal/admin/reporting">
            <span className={btnClass(location, 'reporting')}>{t('volunteer_portal.admin.tab.reporting')}</span>
          </Link>
          <div className={`${s.navSpacer} ${s.growingSpace}`} />
        </div>
        {children}
      </div>
    </div>
  )
}

export default withRouter(withTranslation()(Admin))
