import React from 'react'

import RemoveIcon from '@zendeskgarden/svg-icons/src/16/trash-stroke.svg'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Icon, IconButton } from '@zendeskgarden/react-buttons'
import { MD, SM } from '@zendeskgarden/react-typography'
import { Skeleton } from '@zendeskgarden/react-loaders'

import Avatar from './Avatar'
import Dialog from 'material-ui/Dialog'
import { present } from '../lib/utils'
import { togglePopover } from 'actions'

const Container = styled.div`
  display: flex;
  flex-fglow: row nowrap;
  align-items: center;
  align-content: center;
`

const Details = styled.div`
  display: flex;
  flex-flow: column nowrap;
  padding-left: 10px;
`
const styles = {
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

const Loader = _props => (
  <Container>
    <Avatar loading />
    <Details>
      <MD>
        <Skeleton width="8rem" />
      </MD>
      <SM>
        <Skeleton width="8rem" />
      </SM>
    </Details>
  </Container>
)

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

const NamedAvatar = ({ loading, userId, image, name, subtitle, showRemove, onRemove, togglePopover, popover }) => {
  if (loading) return <Loader />
  return (
    <Container>
      <Avatar image={image} />
      <Details>
        <MD tag="strong">{name}</MD>
        <SM>{subtitle || '\u00a0'}</SM>
      </Details>

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
    </Container>
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
