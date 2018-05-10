import React from 'react'
import LocationIcon from 'material-ui/svg-icons/maps/place'

const styles = {
  property: {
    fontWeight: 600,
    margin: '10px 0',
  },
  icon: {
    verticalAlign: '-33%',
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
