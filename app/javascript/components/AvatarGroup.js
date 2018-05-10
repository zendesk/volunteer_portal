import React from 'react'
import Avatar from './Avatar'

const styles = {
  group: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  spacer: {
    width: 10,
  },
}

const renderAvatars = props => {
  const slice = props.maxAvatars ? props.images.slice(0, props.maxAvatars) : props.images

  return slice.map((image, i) => <Avatar key={`avatar-${i}`} {...props} image={image} />)
}

const AvatarGroup = props => <div style={styles.group}>{renderAvatars(props)}</div>

AvatarGroup.defaultProps = {
  maxAvatars: null,
  orientation: 'horizontal',
}

export default AvatarGroup
