import React, { useContext } from 'react'
import * as R from 'ramda'
import moment from 'moment'
import { Well } from '@zendeskgarden/react-notifications'
import { useQuery } from '@apollo/react-hooks'

import Loading from 'components/LoadingIcon'
import ProgressCircle from 'components/ProgressCircle'
import Event from 'components/Event'
import Callout from 'components/Callout'
import OfficeFilter from '/components/OfficeFilter'
import { FilterContext, officeFilterValueLens } from '/context'

import s from './main.css'
import AttendanceQuery from './attendanceQuery.gql'

import { withTranslation } from 'react-i18next'

const startOfWeek = moment().startOf('week').unix()

const startOfMonth = moment().startOf('month').unix()

const endOfWeek = moment().endOf('week').unix()

const endOfMonth = moment().endOf('month').unix()

// Only declare styles in here that are needed for MUI components
const styles = {
  well: {
    width: '85%',
    height: '100%',
  },
}

const MemoBox = ({ label, sublabel, text }) => (
  <div className={s.memobox}>
    <div className={s.label}>
      <div className={s.main}>{label}</div>
      {sublabel ? <div className={s.sublabel}>{sublabel}</div> : null}
    </div>
    <div className={s.text}>{text}</div>
  </div>
)

const Dashboard = ({ t }) => {
  const { filters } = useContext(FilterContext)
  const { data, loading, error } = useQuery(AttendanceQuery, {
    variables: {
      weekStart: startOfWeek,
      weekEnd: endOfWeek,
      monthStart: startOfMonth,
      monthEnd: endOfMonth,
      officeId: R.view(officeFilterValueLens, filters),
    },
  })

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Callout type="error" />
  }

  const eventsThisMonth = R.propOr([], 'eventsThisMonth', data)
  const eventsThisWeek = R.propOr([], 'eventsThisWeek', data)

  const accumTotalMinutes = (acc, event) => acc + event.duration * event.signupCount

  const minutesThisWeek = R.reduce(accumTotalMinutes, 0, eventsThisWeek)
  const minutesThisMonth = R.reduce(accumTotalMinutes, 0, eventsThisMonth)

  const hoursThisWeek = Math.max(0, Math.round(minutesThisWeek / 60))
  const hoursThisMonth = Math.max(0, Math.round(minutesThisMonth / 60))

  const accumCapacity = (acc, event) => acc + event.capacity

  const spotsThisWeek = R.reduce(accumCapacity, 0, eventsThisWeek)
  const spotsThisMonth = R.reduce(accumCapacity, 0, eventsThisMonth)

  const accumSignups = (acc, event) => acc + event.signupCount

  const volunteersThisWeek = R.reduce(accumSignups, 0, eventsThisWeek)
  const volunteersThisMonth = R.reduce(accumSignups, 0, eventsThisMonth)
  const spotsFilledThisWeek = spotsThisWeek > 0 ? Math.round((volunteersThisWeek / spotsThisWeek) * 100) : 0
  const spotsFilledThisMonth = spotsThisMonth > 0 ? Math.round((volunteersThisMonth / spotsThisMonth) * 100) : 0

  return (
    <div>
      <div className={s.row}>
        <OfficeFilter />
      </div>
      <div className={s.row}>
        <div className={s.column}>
          <h2>{t('volunteer_portal.admin.tab.dashboard_thisweek')}</h2>
        </div>
        <div className={s.column}>
          <h2>{t('volunteer_portal.admin.tab.dashboard_thismonth')}</h2>
        </div>
      </div>
      <div className={s.row}>
        <div className={s.column}>
          <Well style={styles.well}>
            {eventsThisWeek.length === 0 ? (
              <h3>{t('volunteer_portal.admin.tab.dashboard_noeventsthisweek')}</h3>
            ) : (
              <div className={s.row}>
                <div className={s.column}>
                  <MemoBox
                    label={t('volunteer_portal.admin.tab.dashboard_thisweek_events')}
                    text={R.keys(eventsThisWeek).length}
                  />
                  <MemoBox
                    label={t('volunteer_portal.admin.tab.dashboard_thisweek_volunteers')}
                    sublabel={t('volunteer_portal.admin.tab.dashboard_thisweek_registered')}
                    text={volunteersThisWeek}
                  />
                  <MemoBox
                    label={t('volunteer_portal.admin.tab.dashboard_thisweek_hours')}
                    sublabel={t('volunteer_portal.admin.tab.dashboard_thisweek_committed')}
                    text={hoursThisWeek}
                  />
                </div>
                <div className={s.column}>
                  <ProgressCircle
                    percent={spotsFilledThisWeek}
                    label={t('volunteer_portal.admin.tab.dashboard_thisweek_spotsfilled')}
                    stroke="#30AABC"
                  />
                </div>
              </div>
            )}
          </Well>
        </div>
        <div className={s.column}>
          <Well style={styles.well}>
            {eventsThisMonth.length === 0 ? (
              <h3>{t('volunteer_portal.admin.tab.dashboard_noeventsthismonth')}</h3>
            ) : (
              <div className={s.row}>
                <div className={s.column}>
                  <MemoBox
                    label={t('volunteer_portal.admin.tab.dashboard_thismonth_events')}
                    text={R.keys(eventsThisMonth).length}
                  />
                  <MemoBox
                    label={t('volunteer_portal.admin.tab.dashboard_thismonth_volunteers')}
                    sublabel={t('volunteer_portal.admin.tab.dashboard_thismonth_registered')}
                    text={volunteersThisMonth}
                  />
                  <MemoBox
                    label={t('volunteer_portal.admin.tab.dashboard_thismonth_hours')}
                    sublabel={t('volunteer_portal.admin.tab.dashboard_thismonth_committed')}
                    text={hoursThisMonth}
                  />
                </div>
                <div className={s.column}>
                  <ProgressCircle
                    percent={spotsFilledThisMonth}
                    label={t('volunteer_portal.admin.tab.dashboard_thismonth_spotsfilled')}
                    stroke="#37B8AF"
                  />
                </div>
              </div>
            )}
          </Well>
        </div>
      </div>
      <div className={s.rowSpace} />
      <div className={s.row}>
        <div className={s.column}>
          {eventsThisWeek.length === 0 ? null : (
            <Well style={styles.well}>
              {R.take(10, eventsThisWeek).map((e) => (
                <Event key={`week-event-${e.id}`} event={e} addPopover={false} isLink />
              ))}
            </Well>
          )}
        </div>
        <div className={s.column}>
          {eventsThisMonth.length === 0 ? null : (
            <Well style={styles.well}>
              {R.take(10, eventsThisMonth).map((e) => (
                <Event key={`month-event-${e.id}`} event={e} addPopover={false} isLink />
              ))}
            </Well>
          )}
        </div>
      </div>
    </div>
  )
}

export default withTranslation()(Dashboard)
