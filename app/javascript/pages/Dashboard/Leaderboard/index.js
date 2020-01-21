import React, { useState, useContext } from 'react'

import * as R from 'ramda'
import moment from 'moment'
import styled from 'styled-components'
import { useQuery } from '@apollo/react-hooks'
import { Alert, Title, Paragraph } from '@zendeskgarden/react-notifications'
import { MD, LG } from '@zendeskgarden/react-typography'
import { Skeleton } from '@zendeskgarden/react-loaders'
import { Tag } from '@zendeskgarden/react-tags'

import LeaderboardQuery from './leaderboardQuery.gql'
import ListItem from 'components/ListItem'
import NamedAvatar from 'components/NamedAvatar'
import OfficeFilter from 'components/OfficeFilter'
import { UserContext } from 'context'

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

const Loader = _props => (
  <>
    {Array(10)
      .fill()
      .map((_, i) => (
        <ListItem key={i}>
          <NamedAvatar loading />
          <MD>
            <Skeleton width="6rem" />
          </MD>
        </ListItem>
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
  const [currentOfficeId, setCurrentOfficeId] = useState(R.path(['office', 'Id'], currentUser))
  const { loading, error, data } = useQuery(LeaderboardQuery, {
    variables: {
      after: startOfYear,
      before: nowInSec,
      count: leaderBoardSize,
      officeId: currentOfficeId,
      sortBy: leaderBoardSort,
    },
  })

  const offices = R.propOr([], 'offices', data)
  const volunteers = R.propOr([], 'volunteers', data)

  if (error) console.log(error)

  return (
    <div>
      <SectionHeader>
        <SectionTitle>Top Volunteers</SectionTitle>
        <OfficeFilter
          offices={offices}
          value={currentOfficeId}
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
          <ListItem key={`user-${i}`}>
            <NamedAvatar image={user.photo} name={user.name} subtitle={user.group} />
            <MD>
              <Tag round size="large">
                {user.hours}
              </Tag>{' '}
              hours
            </MD>
          </ListItem>
        ))}

        {!volunteers.length && <Paragraph>🤭 No users found</Paragraph>}
      </div>
    </div>
  )
}

export default Leaderboard
