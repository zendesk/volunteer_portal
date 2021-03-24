import React from 'react'
import LocationIcon from '@zendeskgarden/svg-icons/src/16/location-fill.svg'

const styles = {
  property: {
    fontWeight: 600,
    margin: '10px 0',
  },
  icon: {
    verticalAlign: '-13%',
    marginRight: 10,
  },
}

const EventLocation = ({ event }) => (
  <div style={styles.property}>
    <LocationIcon style={styles.icon} color="#555" />
    {event.location}
  </div>
)

export default EventLocation
