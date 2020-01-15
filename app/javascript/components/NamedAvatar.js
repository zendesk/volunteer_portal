import React from 'react'
import Avatar from './Avatar'
import Dialog from 'material-ui/Dialog'
import { connect } from 'react-redux'
import { togglePopover } from 'actions'
import { present } from '../lib/utils'

import RemoveIcon from '@zendeskgarden/svg-icons/src/16/trash-stroke.svg'
import { Icon, IconButton } from '@zendeskgarden/react-buttons'

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

const NamedAvatar = ({ userId, image, name, subtitle, showRemove, onRemove, togglePopover, popover }) => {
  return (
    <div style={styles.container}>
      <Avatar image={image} />
      <div style={styles.details}>
        <span style={styles.name}>{name}</span>
        <span style={styles.subtitle}>{subtitle || '\u00a0'}</span>
      </div>
      {showRemove && (
        <IconButton size="small" aria-label="Remove" onClick={() => togglePopover('removeUserFromEvent', { userId })}>
          <Icon>
            <RemoveIcon />
          </Icon>
        </IconButton>
      )}
      {present(popover) && popover.data.userId === userId && (
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
}

const mapStateToProps = (state, { children }) => {
  const { popover } = state.model

  return {
    popover,
  }
}

const withActions = connect(
  mapStateToProps,
  {
    togglePopover,
  }
)

export default withActions(NamedAvatar)
