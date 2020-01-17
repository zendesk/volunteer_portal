import React, { useState, useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import * as R from 'ramda'
import moment from 'moment'

import LeaderboardQuery from './leaderboardQuery.gql'
import Loading from 'components/LoadingIcon'
import NamedAvatar from 'components/NamedAvatar'
import OfficeFilter from 'components/OfficeFilter'
import { UserContext } from '../../../context'

import s from '../main.css'

// The server expects seconds since epoch, not milliseconds
const startOfYear = Math.floor(moment().startOf('year') / 1000)
const nowInSec = moment().unix()
const leaderBoardSize = 10
const leaderBoardSort = 'HOURS_DESC'

const Leaderboard = _props => {
  const currentUser = useContext(UserContext)
  const [currenOfficeId, setCurrentOfficeId] = useState(currentUser.office.id)
  const { loading, error, data } = useQuery(LeaderboardQuery, {
    variables: {
      count: leaderBoardSize,
      sortBy: leaderBoardSort,
      after: startOfYear,
      before: nowInSec,
      officeId: currenOfficeId,
    },
    fetchPolicy: 'cache-and-network',
  })

  if (loading) return <Loading />

  if (error) return <div>{error}</div>

  const ofifces = R.propOr([], 'offices', data)
  const volunteers = R.propOr([], 'volunteers', data)

  return (
    <div className={s.leaderboard}>
      <div className={s.leaderboardHeader}>
        <div className={s.topVolunteers}>Top Volunteers</div>
        <OfficeFilter offices={ofifces} value={currenOfficeId} onChange={setCurrentOfficeId} />
      </div>
      {volunteers.map((user, i) => (
        <div className={s.leaderboardUser} key={`user-${i}`}>
          <NamedAvatar image={user.photo} name={user.name} subtitle={user.group} />
          <span className={s.leaderboardHours}>{user.hours} hours</span>
        </div>
      ))}
    </div>
  )
}

export default Leaderboard
