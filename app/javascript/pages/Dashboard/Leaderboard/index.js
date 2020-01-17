import React from 'react'
import { graphql } from 'react-apollo'
import { NetworkStatus } from 'apollo-client'
import { connect } from 'react-redux'
import * as R from 'ramda'
import moment from 'moment'

import OfficeFilter from 'components/OfficeFilter'
import Loading from 'components/LoadingIcon'
import NamedAvatar from 'components/NamedAvatar'

import { changeDashboardOfficeFilter } from 'actions'

import LeaderboardQuery from '../leaderboardQuery.gql'
import s from '../main.css'

// The server expects seconds since epoch, not milliseconds
const startOfYear = Math.floor(moment().startOf('year') / 1000)
const nowInSec = moment().unix()

const leaderBoardSize = 10
const leaderBoardSort = 'HOURS_DESC'

const LeaderboardContainer = ({
  data: { networkStatus, volunteers, offices, currentUser },
  dashboardOfficeFilter,
  changeDashboardOfficeFilter,
}) =>
  networkStatus === NetworkStatus.loading ? (
    <Loading />
  ) : (
    <div className={s.leaderboard}>
      <div className={s.leaderboardHeader}>
        <div className={s.topVolunteers}>Top Volunteers</div>
        <OfficeFilter
          offices={offices}
          value={dashboardOfficeFilter.value === 'current' ? currentUser.office.id : dashboardOfficeFilter.value}
          onChange={changeDashboardOfficeFilter}
        />
      </div>
      {volunteers.map((user, i) => (
        <div className={s.leaderboardUser} key={`user-${i}`}>
          <NamedAvatar image={user.photo} name={user.name} subtitle={user.group} />
          <span className={s.leaderboardHours}>{user.hours} hours</span>
        </div>
      ))}
    </div>
  )

const mapStateToProps = (state, _ownProps) => {
  const { dashboardOfficeFilter } = state.model
  const { locationBeforeTransitions } = state.routing

  return {
    dashboardOfficeFilter,
    locationBeforeTransitions,
  }
}

const leaderboardWithData = graphql(LeaderboardQuery, {
  options: ({ dashboardOfficeFilter }) => {
    const variables = {
      count: leaderBoardSize,
      sortBy: leaderBoardSort,
      after: startOfYear,
      before: nowInSec,
    }

    variables.officeId = dashboardOfficeFilter.value

    return {
      variables,
      fetchPolicy: 'cache-and-network',
    }
  },
})
const leaderboardWithActions = connect(
  mapStateToProps,
  { changeDashboardOfficeFilter }
)

const Leaderboard = leaderboardWithActions(leaderboardWithData(LeaderboardContainer))

export default Leaderboard
