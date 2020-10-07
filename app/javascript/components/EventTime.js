import React from 'react'
import ClockIcon from 'material-ui/svg-icons/action/schedule'
import moment from 'moment'

const styles = {
  property: {
    fontWeight: 600,
    margin: '10px 0',
  },
  icon: {
    verticalAlign: '-33%',
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
