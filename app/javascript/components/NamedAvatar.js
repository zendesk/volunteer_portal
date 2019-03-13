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
    marginLeft: 20,
    cursor: 'pointer',
  },
  dialogActionsLink: {
    padding: 15,
    cursor: 'pointer',
    fontSize: 16,
  },
  actionsContainer: {
    paddingBottom: 20,
    textAlign: 'center',
  },
}

const dialogActions = (togglePopover, onRemove) => [
  <a style={styles.dialogActionsLink} onClick={() => togglePopover('removeUserFromEvent')}>
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

const NamedAvatar = ({ userId, image, name, showRemove, onRemove, togglePopover, popover }) => (
  <div style={styles.container}>
    <Avatar image={image} />
    <div style={styles.details}>
      <span style={styles.name}>{name}</span>
    </div>
    {showRemove && (
      <a style={styles.remove} onClick={() => togglePopover('removeUserFromEvent', { userId })}>
        Remove
      </a>
    )}
    {present(popover) &&
      popover.data.userId === userId && (
        <Dialog
          title={`Remove ${name} from Event`}
          actions={dialogActions(togglePopover, onRemove)}
          open
          onRequestClose={() => togglePopover('removeUserFromEvent')}
          actionsContainerStyle={styles.actionsContainer}
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
