import React from 'react'
import Avatar from './Avatar'
import Dialog from 'material-ui/Dialog'
import { connect } from 'react-redux'
import { togglePopover } from 'actions'
import { present } from '../lib/utils'

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
  dialogActionsLink: {
    padding: '15px',
    cursor: 'pointer',
    fontSize: '16px',
  },
}

const dialogActions = (togglePopover, onRemove) => [
  <a
    style={styles.dialogActionsLink}
    onClick={() => {
      togglePopover('removeUserFromEvent')
    }}
  >
    Cancel
  </a>,
  <a
    style={styles.dialogActionsLink}
    onClick={() => {
      onRemove()
      togglePopover('removeUserFromEvent')
    }}
  >
    Delete
  </a>,
]

const NamedAvatar = ({ userId, image, name, subtitle, showRemove, onRemove, togglePopover, popover }) => (
  <div style={styles.container}>
    <Avatar image={image} />
    <div style={styles.details}>
      <span style={styles.name}>{name}</span>
      <span style={styles.subtitle}>{subtitle || '\u00a0'}</span>
    </div>
    {showRemove && (
      <a
        style={styles.remove}
        onClick={() => {
          togglePopover('removeUserFromEvent', { userId })
        }}
      >
        Remove
      </a>
    )}
    {present(popover) &&
      popover.data.userId === userId && (
        <Dialog
          title={'Remove User ' + name + ' from Event'}
          actions={dialogActions(togglePopover, onRemove)}
          open
          onRequestClose={() => {
            togglePopover('removeUserFromEvent')
          }}
          actionsContainerStyle={{ paddingBottom: 20, textAlign: 'center' }}
        />
      )}
  </div>
)

const mapStateToProps = (state, { children }) => {
  const { popover } = state.model

  return {
    popover,
  }
}

const withActions = connect(mapStateToProps, {
  togglePopover,
})

export default withActions(NamedAvatar)
