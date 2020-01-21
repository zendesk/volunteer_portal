import React from 'react'

import styled from 'styled-components'

const Container = styled.div`
  align-content: center;
  align-items: center;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
`

const ListItem = ({ children }) => {
  return <Container>{children}</Container>
}

export default ListItem
