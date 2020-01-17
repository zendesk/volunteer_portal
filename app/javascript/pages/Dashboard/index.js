import React from 'react'
import { graphql } from 'react-apollo'
import { NetworkStatus } from 'apollo-client'
import { connect } from 'react-redux'
import * as R from 'ramda'
import moment from 'moment'

import Layout from 'components/Layout'
import Loading from 'components/LoadingIcon'
import ProgressCircle from 'components/ProgressCircle'
import Leaderboard from './Leaderboard'

import MilestoneQuery from './milestoneQuery.gql'
import s from './main.css'

const milestones = [
  { name: 1, hours: 4, color: '#358fb2' },
  { name: 2, hours: 8, color: '#5ebbde' },
  { name: 3, hours: 12, color: '#78cdec' },
]

const milestoneBarWidth = 650 // used as inline style for the .bar class
const milestoneBarChunk = milestoneBarWidth / milestones.length

// The server expects seconds since epoch, not milliseconds
const startOfYear = Math.floor(moment().startOf('year') / 1000)
const nowInSec = moment().unix()

const selectMilestone = hours => R.find(m => hours < m.hours)(milestones) || R.last(milestones)

const milestonePercentage = (user, milestone) => R.clamp(0, 100, Math.round((user.hours / milestone.hours) * 100))

const hoursRemaining = (user, milestone) => {
  const computed = Math.round(milestone.hours - user.hours)
  const remaining = R.clamp(0, milestone.hours, computed)

  switch (remaining) {
    case 0:
      return 'Complete'
    case 1:
      return '1 hour'
    default:
      return `${remaining} hours`
  }
}

const barStyling = (segment, user, milestone) => {
  const completedMilestoneCount = R.filter(m => user.hours >= m.hours)(milestones).length
  const completedWidth = R.clamp(0, milestoneBarWidth, completedMilestoneCount * milestoneBarChunk)

  const inProgessWidth =
    completedMilestoneCount < milestones.length
      ? R.clamp(0, milestoneBarWidth, (milestonePercentage(user, milestone) / 100) * milestoneBarChunk)
      : 0

  const incompleteWidth = R.clamp(0, milestoneBarWidth, milestoneBarWidth - inProgessWidth - completedWidth)

  let classes = [s.baseBar]
  let styles = {}

  switch (segment) {
    case 'completed':
      classes = R.append(s.completedBar, classes)
      styles = { width: completedWidth }

      if (completedMilestoneCount < milestones.length) {
        classes = R.append(s.noRightBorder, classes)
      }

      break
    case 'inprogress':
      classes = R.concat(classes, [s.inProgressBar, s.noRightBorder])
      styles = { width: inProgessWidth }

      if (completedMilestoneCount > 0) {
        classes = R.append(s.noLeftBorder, classes)
      }

      break
    case 'incomplete':
      classes = R.append(s.incompleteBar, classes)
      styles = { width: incompleteWidth }

      if (completedMilestoneCount > 0 || inProgessWidth > 0) {
        classes = R.append(s.noLeftBorder, classes)
      }

      break
  }

  return { classes: R.join(' ', classes), styles }
}

const milestoneLabelStyling = (item, milestone, user) => {
  let classes = []

  switch (item) {
    case 'label':
      classes = R.concat(classes, [s.milestoneLabel, s.milestoneMarkerLabel])
      break
    case 'hours':
      classes = R.concat(classes, [s.hoursRemaining, s.milestoneMarkerHours])
      break
  }

  if (user.hours >= milestone.hours) {
    classes = R.append(s.completedMilestone, classes)
  }

  return R.join(' ', classes)
}

const mapStateToProps = (state, _ownProps) => {
  const { locationBeforeTransitions } = state.routing

  return {
    locationBeforeTransitions,
  }
}

const Dashboard = ({ data: { networkStatus, currentUser }, locationBeforeTransitions }) => {
  if (networkStatus === NetworkStatus.loading) {
    return <Loading />
  } else {
    const activeMilestone = selectMilestone(currentUser.hours)
    const completedBarStyling = barStyling('completed', currentUser, activeMilestone)
    const inProgressBarStyling = barStyling('inprogress', currentUser, activeMilestone)
    const incompleteBarStyling = barStyling('incomplete', currentUser, activeMilestone)

    return (
      <div className={s.container}>
        <Layout currentPath={locationBeforeTransitions.pathname}>
          <div className={s.progressContainer}>
            <ProgressCircle
              percent={milestonePercentage(currentUser, activeMilestone)}
              label={`Milestone ${activeMilestone.name}`}
              sublabel={hoursRemaining(currentUser, activeMilestone)}
              stroke={activeMilestone.color}
            />
            <div className={s.overallProgress}>
              <div className={s.headerAndBar}>
                <div className={s.personalProgress}>
                  <div className={s.personalLabel}>
                    <div className={s.personal}>Personal</div>
                    <div className={s.label}>total hours</div>
                  </div>
                  <div className={s.personalTotal}>{currentUser.hours}</div>
                </div>
                <div className={s.bar} style={{ width: milestoneBarWidth }}>
                  <div className={completedBarStyling.classes} style={completedBarStyling.styles} />
                  <div className={inProgressBarStyling.classes} style={inProgressBarStyling.styles} />
                  <div className={incompleteBarStyling.classes} style={incompleteBarStyling.styles} />
                </div>
              </div>
              <div className={s.milestoneMarkers}>
                {milestones.map((milestone, i) => (
                  <div
                    key={`milestone-${i}`}
                    className={s.milestoneMarker}
                    style={{ flexBasis: `${(1 / milestones.length) * 100}%` }}
                  >
                    <p
                      className={milestoneLabelStyling('label', activeMilestone, currentUser)}
                    >{`Milestone ${milestone.name}`}</p>
                    <p
                      className={milestoneLabelStyling('hours', activeMilestone, currentUser)}
                    >{`${milestone.hours} hours`}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Leaderboard />
        </Layout>
      </div>
    )
  }
}

const withData = graphql(MilestoneQuery, {
  options: {
    variables: { after: startOfYear, before: nowInSec },
    fetchPolicy: 'cache-and-network',
  },
})

export default connect(mapStateToProps)(withData(Dashboard))
