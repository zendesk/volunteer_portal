import React, { useState, useContext } from 'react'

import * as R from 'ramda'
import moment from 'moment'
import styled from 'styled-components'
import { useQuery } from '@apollo/react-hooks'

import LeaderboardQuery from './leaderboardQuery.gql'
import NamedAvatar from 'components/NamedAvatar'
import OfficeFilter from 'components/OfficeFilter'
import { MD, LG } from '@zendeskgarden/react-typography'
import { Skeleton } from '@zendeskgarden/react-loaders'
import { UserContext } from '../../../context'

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
  margin-bottom: 1rem;
  padding: 0.5rem 0;
`
const SectionTitle = styled(LG)`
  align-self: flex-end;
`
const Volunteer = styled.div`
  display: flex;
  flex-direction: row nowrap;
  justify-content: space-between;
  padding 0.5rem 0;
`

const Loader = _props => (
  <>
    {Array(10)
      .fill(null)
      .map((_, i) => (
        <Volunteer key={i}>
          <NamedAvatar loading />
          <div>
            <MD>
              <Skeleton width="6rem" />
            </MD>
          </div>
        </Volunteer>
      ))}
  </>
)

// The server expects seconds since epoch, not milliseconds
const startOfYear = Math.floor(moment().startOf('year') / 1000)
const nowInSec = moment().unix()
const leaderBoardSize = 10
const leaderBoardSort = 'HOURS_DESC'

const Leaderboard = _props => {
  const currentUser = useContext(UserContext)
  const [currenOffice, setCurrentOffice] = useState(currentUser.office)
  const { loading, error, data } = useQuery(LeaderboardQuery, {
    variables: {
      after: startOfYear,
      before: nowInSec,
      count: leaderBoardSize,
      officeId: currenOffice.id,
      sortBy: leaderBoardSort,
    },
  })

  if (error) return <div className={s.leaderboard}>{error}</div>

  const ofifces = R.propOr([], 'offices', data)
  const volunteers = R.propOr([], 'volunteers', data)

  return (
    <div>
      <SectionHeader>
        <SectionTitle>Top Volunteers</SectionTitle>
        <OfficeFilter offices={ofifces} value={currenOffice} onChange={setCurrentOffice} loading={loading} />
      </SectionHeader>
      <div>
        {loading && <Loader />}

        {volunteers.map((user, i) => (
          <Volunteer key={`user-${i}`}>
            <NamedAvatar image={user.photo} name={user.name} subtitle={user.group} />
            <MD>{user.hours} hours</MD>
          </Volunteer>
        ))}
      </div>
    </div>
  )
}

export default Leaderboard
