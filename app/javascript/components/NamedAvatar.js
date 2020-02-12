import React from 'react'

import styled from 'styled-components'
import { MD, SM } from '@zendeskgarden/react-typography'
import { Skeleton } from '@zendeskgarden/react-loaders'

import Avatar from './Avatar'

const Container = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  align-content: center;
`

const Details = styled.div`
  display: flex;
  flex-flow: column nowrap;
  padding-left: 10px;
`

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

const NamedAvatar = ({ loading, image, name, subtitle }) => {
  if (loading) return <Loader />
  return (
    <Container>
      <Avatar image={image} />
      <Details>
        <MD tag="strong">{name}</MD>
        {subtitle && <SM>{subtitle}</SM>}
      </Details>
    </Container>
  )
}

export default NamedAvatar
