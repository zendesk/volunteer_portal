import React, { useState, useContext } from 'react'

import * as R from 'ramda'
import moment from 'moment'
import styled from 'styled-components'
import { useQuery } from '@apollo/react-hooks'

import LeaderboardQuery from './leaderboardQuery.gql'
import NamedAvatar from 'components/NamedAvatar'
import OfficeFilter from 'components/OfficeFilter'
import { Alert, Title } from '@zendeskgarden/react-notifications'
import { MD, LG } from '@zendeskgarden/react-typography'
import { Skeleton } from '@zendeskgarden/react-loaders'
import { UserContext } from '../../../context'

const { zdSpacingXxs, zdColorGrey300 } = require('@zendeskgarden/css-variables')

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid ${zdColorGrey300};
  margin-bottom: ${zdSpacingXxs};
  padding-bottom: ${zdSpacingXxs};
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
  const [currenOfficeId, setCurrentOfficeId] = useState(R.path(['office', 'Id'], currentUser))
  const { loading, error, data } = useQuery(LeaderboardQuery, {
    variables: {
      after: startOfYear,
      before: nowInSec,
      count: leaderBoardSize,
      officeId: currenOfficeId,
      sortBy: leaderBoardSort,
    },
  })

  const ofifces = R.propOr([], 'offices', data)
  const volunteers = R.propOr([], 'volunteers', data)

  if (error) console.log(error)

  return (
    <div>
      <SectionHeader>
        <SectionTitle>Top Volunteers</SectionTitle>
        <OfficeFilter
          offices={ofifces}
          value={currenOfficeId}
          onChange={setCurrentOfficeId}
          loading={error || loading}
        />
      </SectionHeader>
      <div>
        {error && (
          <Alert type="error">
            <Title>Network Error</Title>
            Sorry, we are unable to fetch data from server at this time. Please try again later.
          </Alert>
        )}

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
