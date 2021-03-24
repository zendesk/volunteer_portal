import React from 'react'
import ClockIcon from '@zendeskgarden/svg-icons/src/16/clock-stroke.svg'
import moment from 'moment'

const styles = {
  property: {
    fontWeight: 600,
    margin: '10px 0',
  },
  icon: {
    verticalAlign: '-13%',
    marginRight: 10,
  },
  iconWithDate: {
    verticalAlign: 'top',
    marginRight: 10,
  },
  date: {
    display: 'block',
  },
}

const getDate = (showDate, event) =>
  showDate ? <span style={styles.date}>{moment(event.startsAt).format('LL')}</span> : null

const getTime = event => {
  const start = moment(event.startsAt).format('h:mmA')
  const end = moment(event.endsAt).format('h:mmA')
  return `${start} - ${end}`
}

const EventTime = ({ showDate, event }) => (
  <div style={styles.property}>
    <ClockIcon style={showDate ? styles.iconWithDate : styles.icon} color="#555" />
    <div style={{ display: 'inline-block' }}>
      {getDate(showDate, event)}
      {getTime(event)}
    </div>
  </div>
)

export default EventTime
