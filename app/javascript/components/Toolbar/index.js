import React from 'react'

import { navigate } from 'react-big-calendar/lib/utils/constants'
import { withNamespaces } from 'react-i18next'

import ShowFilter from 'components/Filter/ShowFilter'
import EventFilter from 'components/Filter/EventFilter'
import OfficeFilter from 'components/Filter/OfficeFilter'

import s from './main.css'

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
        <ShowFilter value={showFilter.value} onChange={showFilter.onChange} />
        <EventFilter value={eventFilter.value} onChange={eventFilter.onChange} />
        <OfficeFilter value={officeFilter.value} onChange={officeFilter.onChange} offices={offices} />
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
