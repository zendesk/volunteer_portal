import React from 'react'
import Avatar from './Avatar'

const styles = {
  container: {
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    alignContent: 'center',
  },
  avatar: {},
  details: {
    display: 'flex',
    flexFlow: 'column nowrap',
  },
  name: {
    fontWeight: 600,
  },
  remove: {
    marginLeft: '20px',
    cursor: 'pointer',
  },
  subtitle: {},
}

const NamedAvatar = props => (
  <div style={styles.container}>
    <Avatar {...props} />
    <div style={styles.details}>
      <span style={styles.name}>{props.name}</span>
      <span style={styles.subtitle}>{props.subtitle || '\u00a0'}</span>
    </div>
    {props.showRemove && (
      <a style={styles.remove} onClick={props.onRemove}>
        Remove
      </a>
    )}
  </div>
)

export default NamedAvatar
