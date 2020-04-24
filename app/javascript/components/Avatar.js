import React from 'react'

import styled from 'styled-components'
import UserIcon from '@zendeskgarden/svg-icons/src/16/user-solo-stroke.svg'
import { Avatar as GardenAvatar } from '@zendeskgarden/react-avatars'
import { Skeleton } from '@zendeskgarden/react-loaders'

const { zdColorGrey600, zdColorSecondaryAzure600 } = require('@zendeskgarden/css-variables')

const StyledSvgAvatar = styled(GardenAvatar)`
  background-color: ${zdColorGrey600};
`

const StyledTextAvatar = styled(GardenAvatar)`
  background-color: ${zdColorSecondaryAzure600};
`

const GardenAvatarLoader = styled(GardenAvatar)`
  border-radius: 50%;
  overflow: hidden;
`

const Loader = _props => (
  <GardenAvatarLoader size="medium">
    <Skeleton />
  </GardenAvatarLoader>
)

const Avatar = ({ loading, image, text }) => {
  if (loading) return <Loader />

  if (image)
    return (
      <GardenAvatar>
        <img src={image} alt={name} />
      </GardenAvatar>
    )

  if (text)
    return (
      <StyledTextAvatar>
        <GardenAvatar.Text>{text}</GardenAvatar.Text>
      </StyledTextAvatar>
    )

  return (
    <StyledSvgAvatar>
      <UserIcon />
    </StyledSvgAvatar>
  )
}

export default Avatar
