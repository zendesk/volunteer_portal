import React, { Component } from 'react'
import { connect } from 'react-redux'
import R from 'ramda'
import moment from 'moment'
import Paper from 'material-ui/Paper'
import { graphql, compose } from 'react-apollo'
import Loading from 'components/LoadingIcon'
import ProgressCircle from 'components/ProgressCircle'
import Event from 'components/Event'
import Callout from 'components/Callout'

import s from './main.css'
import AttendanceQuery from './attendanceQuery.gql'

const startOfWeek = moment()
  .startOf('week')
  .unix()

const startOfMonth = moment()
  .startOf('month')
  .unix()

const endOfWeek = moment()
  .endOf('week')
  .unix()

const endOfMonth = moment()
  .endOf('month')
  .unix()

// Only declare styles in here that are needed for MUI components
const styles = {
  paper: {
    width: '100%',
    height: '100%',
    padding: 20,
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

const Dashboard = props => {
  const { data } = props
  const { eventsThisMonth, eventsThisWeek, allEvents } = data

  if (data.loading) {
    return <Loading />
  }

  if (data.error) {
    return <Callout type="error" />
  }

  const signupsThisWeek = R.flatten(R.map(event => event.signups, eventsThisWeek))
  const signupsThisMonth = R.flatten(R.map(event => event.signups, eventsThisMonth))

  const volunteersThisWeek = R.length(signupsThisWeek)
  const volunteersThisMonth = R.length(signupsThisMonth)

  const hoursAppender = (hours, s) => [hours + R.find(e => e.id === s.event.id, allEvents).duration, s]

  const minutesThisWeek = R.mapAccum(hoursAppender, 0, signupsThisWeek)[0]
  const minutesThisMonth = R.mapAccum(hoursAppender, 0, signupsThisMonth)[0]

  const hoursThisWeek = Math.max(0, Math.round(minutesThisWeek / 60))
  const hoursThisMonth = Math.max(0, Math.round(minutesThisMonth / 60))

  const spotsAppender = (spots, e) => [spots + e.capacity, e]

  const spotsThisWeek = R.mapAccum(spotsAppender, 0, eventsThisWeek)[0]
  const spotsThisMonth = R.mapAccum(spotsAppender, 0, eventsThisMonth)[0]

  const spotsFilledThisWeek = spotsThisWeek > 0 ? Math.round(volunteersThisWeek / spotsThisWeek * 100) : 0
  const spotsFilledThisMonth = spotsThisMonth > 0 ? Math.round(volunteersThisMonth / spotsThisMonth * 100) : 0

  return (
    <div>
      <div className={s.row}>
        <div className={s.column}>
          <h2>This Week</h2>
        </div>
        <div className={s.column}>
          <h2>This Month</h2>
        </div>
      </div>
      <div className={s.row}>
        <div className={s.column}>
          <Paper style={styles.paper} rounded={false}>
            {eventsThisWeek.length === 0 ? (
              <h3>No Events This Week</h3>
            ) : (
              <div className={s.row}>
                <div className={s.column}>
                  <MemoBox label="Events" text={R.keys(eventsThisWeek).length} />
                  <MemoBox label="Volunteers" sublabel="registered" text={volunteersThisWeek} />
                  <MemoBox label="Hours" sublabel="committed" text={hoursThisWeek} />
                </div>
                <div className={s.column}>
                  <ProgressCircle percent={spotsFilledThisWeek} label="Spots Filled" stroke="#30AABC" />
                </div>
              </div>
            )}
          </Paper>
        </div>
        <div className={s.column}>
          <Paper style={styles.paper} rounded={false}>
            {eventsThisMonth.length === 0 ? (
              <h3>No Events This Month</h3>
            ) : (
              <div className={s.row}>
                <div className={s.column}>
                  <MemoBox label="Events" text={R.keys(eventsThisMonth).length} />
                  <MemoBox label="Volunteers" sublabel="registered" text={volunteersThisMonth} />
                  <MemoBox label="Hours" sublabel="committed" text={hoursThisMonth} />
                </div>
                <div className={s.column}>
                  <ProgressCircle percent={spotsFilledThisMonth} label="Spots Filled" stroke="#37B8AF" />
                </div>
              </div>
            )}
          </Paper>
        </div>
      </div>
      <div className={s.rowSpace} />
      <div className={s.row}>
        <div className={s.column}>
          {eventsThisWeek.length === 0 ? null : (
            <Paper style={styles.paper} rounded={false}>
              {R.take(10, eventsThisWeek).map(e => (
                <Event key={`week-event-${e.id}`} event={e} addPopover={false} isLink />
              ))}
            </Paper>
          )}
        </div>
        <div className={s.column}>
          {eventsThisMonth.length === 0 ? null : (
            <Paper style={styles.paper} rounded={false}>
              {R.take(10, eventsThisMonth).map(e => (
                <Event key={`month-event-${e.id}`} event={e} addPopover={false} isLink />
              ))}
            </Paper>
          )}
        </div>
      </div>
    </div>
  )
}

const filterByOffice = (adminOfficeFilter, data) =>
  adminOfficeFilter.value === 'all' ? null : R.find(office => office.id === input.officeId, data.offices)

const withData = graphql(AttendanceQuery, {
  options: ({ adminOfficeFilter, data }) => ({
    variables: {
      weekStart: startOfWeek,
      weekEnd: endOfWeek,
      monthStart: startOfMonth,
      monthEnd: endOfMonth,
      officeId: filterByOffice(adminOfficeFilter, data),
    },
  }),
})

const mapStateToProps = (state, _ownProps) => ({
  adminOfficeFilter: state.model.adminOfficeFilter,
})

const withActions = connect(mapStateToProps, {})

export default withActions(withData(Dashboard))
