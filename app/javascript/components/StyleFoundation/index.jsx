import styled, { css } from 'styled-components'

const margins = css`
  margin: ${props => props.m};
  margin-left: ${props => props.ml};
  margin-right: ${props => props.mr};
  margin-top: ${props => props.mt};
  margin-bottom: ${props => props.mb};
`

export const Box = styled.div`
  height: ${props => props.height};
  width: ${props => props.width};

  ${margins}
`

export const FlexBox = styled(Box)`
  display: flex;
  justify-content: ${props => props.justifyContent};
`
