import styled from 'styled-components'
import * as R from 'ramda'

const toPixelIfDefined = (size) => !R.isNil(size) && `${size}px`

export const Box = styled.div`
  height: ${props => props.height};
  width: ${props => props.width};
`

export const MarginBox = styled(Box)`
  margin: ${props => toPixelIfDefined(props.margin)};
  margin-left: ${props => toPixelIfDefined(props.marginL)};
  margin-right: ${props => toPixelIfDefined(props.marginR)};
  margin-top: ${props => toPixelIfDefined(props.marginT)};
  margin-bottom: ${props => toPixelIfDefined(props.marginB)};
`

export const FlexBox = styled(MarginBox)`
  display: flex;
`
