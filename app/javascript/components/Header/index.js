import React from 'react'
import { Link } from 'react-router'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100px;
  margin: 0 0 50px 0;
  padding: 0;
  box-shadow: 0px 0px 5px #bbb;
  justify-content: space-around;
`

const Wrapper = styled.div`
  padding: 0 20px;
  width: 935px;
  display: flex;
  justify-content: flex-start;
  flex-flow: row nowrap;
  align-items: center;
`

const Logo = styled.img`
  height: 40px;
`

const LogoBox = styled.div`
  flex-grow: 2;
`

const Header = ({ children }) => (
  <div>
    <Container>
      <Wrapper>
        <LogoBox>
          <Link to="/portal">
            <Logo
              alt="Zendesk Relationshapes Logo"
              src="//d1eipm3vz40hy0.cloudfront.net/images/part-header/zendesk-relationshapes-logo.svg"
            />
          </Link>
        </LogoBox>
        {children}
      </Wrapper>
    </Container>
    <div style={{ overflow: 'auto' }} />
  </div>
)

export default Header
