import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import * as R from 'ramda'
import moment from 'moment'

import Loading from 'components/LoadingIcon'
import ProgressCircle from 'components/ProgressCircle'

import MilestoneQuery from './milestoneQuery.gql'
import s from './main.css'

import { withTranslation, useTranslation } from 'react-i18next'

const milestones = [
  { name: 1, hours: 2, color: '#358fb2' },
  { name: 2, hours: 4, color: '#5ebbde' },
  { name: 3, hours: 6, color: '#78cdec' },
]

const milestoneBarWidth = 650 // used as inline style for the .bar class
const milestoneBarChunk = milestoneBarWidth / milestones.length

// The server expects seconds since epoch, not milliseconds
const startOfYear = Math.floor(moment().startOf('year') / 1000)
const nowInSec = moment().unix()

const selectMilestone = hours => R.find(m => hours < m.hours)(milestones) || R.last(milestones)

const milestonePercentage = (hours, milestone) => R.clamp(0, 100, Math.round((hours / milestone.hours) * 100))

const hoursRemaining = (hours, milestone, t) => {
  const computed = Math.round(milestone.hours - hours)
  const remaining = R.clamp(0, milestone.hours, computed)

  switch (remaining) {
    case 0:
      return t('volunteer_portal.admin.tab.user.dashboard.milestone.complete')
    case 1:
      return t('volunteer_portal.admin.tab.user.dashboard.milestone.1hour')
    default:
      return `${remaining} ${t('volunteer_portal.admin.tab.user.dashboard.hours')}`
  }
}

const barStyling = (segment, hours, milestone) => {
  const completedMilestoneCount = R.filter(m => hours >= m.hours)(milestones).length
  const completedWidth = R.clamp(0, milestoneBarWidth, completedMilestoneCount * milestoneBarChunk)

  const inProgessWidth =
    completedMilestoneCount < milestones.length
      ? R.clamp(0, milestoneBarWidth, (milestonePercentage(hours, milestone) / 100) * milestoneBarChunk)
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

const milestoneLabelStyling = (item, milestone, hours) => {
  let classes = []

  switch (item) {
    case 'label':
      classes = R.concat(classes, [s.milestoneLabel, s.milestoneMarkerLabel])
      break
    case 'hours':
      classes = R.concat(classes, [s.hoursRemaining, s.milestoneMarkerHours])
      break
  }

  if (hours >= milestone.hours) {
    classes = R.append(s.completedMilestone, classes)
  }

  return R.join(' ', classes)
}

const Milestones = _props => {
  const { loading, error, data } = useQuery(MilestoneQuery, {
    variables: {
      after: startOfYear,
      before: nowInSec,
    },
  })

  if (error) {
    console.log(error)
    return null
  }

  if (loading) return <Loading />

  const hours = R.path(['currentUser', 'hours'], data)
  const activeMilestone = selectMilestone(hours)
  const completedBarStyling = barStyling('completed', hours, activeMilestone)
  const inProgressBarStyling = barStyling('inprogress', hours, activeMilestone)
  const incompleteBarStyling = barStyling('incomplete', hours, activeMilestone)
  const t = _props.t

  return (
    <div className={s.progressContainer}>
      <ProgressCircle
        percent={milestonePercentage(hours, activeMilestone)}
        label={`${t('volunteer_portal.admin.tab.user.dashboard.milestone')} ${activeMilestone.name}`}
        sublabel={hoursRemaining(hours, activeMilestone, t)}
        stroke={activeMilestone.color}
      />
      <div className={s.overallProgress}>
        <div className={s.headerAndBar}>
          <div className={s.personalProgress}>
            <div className={s.personalLabel}>
              <div className={s.personal}>{t('volunteer_portal.admin.tab.user.dashboard.personal')}</div>
              <div className={s.label}>{t('volunteer_portal.admin.tab.user.dashboard.totalhours')}</div>
            </div>
            <div className={s.personalTotal}>{hours}</div>
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
              <p className={milestoneLabelStyling('label', activeMilestone, hours)}>{`${t(
                'volunteer_portal.admin.tab.user.dashboard.milestone1'
              )} ${milestone.name}`}</p>
              <p className={milestoneLabelStyling('hours', activeMilestone, hours)}>{`${milestone.hours} ${t(
                'volunteer_portal.admin.tab.user.dashboard.hours1'
              )}`}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default withTranslation()(Milestones)
