import React, { Component } from 'react'
import { Link } from 'react-router'
import R from 'ramda'
import LinearProgress from 'material-ui/LinearProgress'

import s from './main.css'

// Material UI components still require inline styles
const styles = {
  bar: {
    height: 7,
    borderRadius: 4,
    width: '100%',
    backgroundColor: '#ddd',
  },
}

const Container = ({ event, isLink, children, onClick }) => {
  // When this is rendered on the Calendar, we want it to trigger a popover. When it is
  // rendered on the admin dashboard, we want a link.
  if (isLink) {
    return <Link to={`/portal/events/${event.id}`}>{children}</Link>
  } else {
    return <div onClick={onClick}>{children}</div>
  }
}

const Event = ({ event, isLink, addPopover, onClick }) => {
  // ⚠️ Event gets stale data
  console.log('logging event from event', event)
  return (
    <Container className={s.event} event={event} isLink={isLink} onClick={onClick}>
      <span className={s.title}>{event.title}</span>
      <LinearProgress
        style={styles.bar}
        mode="determinate"
        value={(R.clamp(0, 100, event.signupCount / event.capacity) || 0) * 100.0}
        color="#30aabc"
      />
    </Container>
  )
}

export default Event
