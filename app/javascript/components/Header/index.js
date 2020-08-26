import React, { useContext } from 'react'
import { Link } from 'react-router'
import { withTranslation } from 'react-i18next'
import styled from 'styled-components'
import { withRouter } from 'react-router'
import * as R from 'ramda'

import { UserContext } from '../../context'

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100px;
  margin: 0 0 50px 0;
  padding: 0;
  box-shadow: ${({ theme }) => `inset 0px -${theme.borderWidths.sm} 0px ${theme.palette.grey['300']}`};
  justify-content: space-around;
`

const Wrapper = styled.div`
  padding: 0 20px;
  width: 935px;
  display: flex;
  justify-content: space-between;
  flex-flow: row nowrap;
  align-items: center;
`

const Logo = styled.img`
  height: 40px;
`

const Tab = styled.p`
  margin: 0;
  height: 100%;
  padding: ${({ theme }) => `0px ${theme.space.md}`};
  display: flex;
  justify-content: center;
  flex-direction: column;
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  box-shadow: ${({ active, theme }) =>
    active ? `inset 0px -${theme.borderWidths.md} 0px ${theme.palette.blue['600']}` : 'none'};
  color: ${({ active, theme }) => (active ? `${theme.palette.blue['600']}` : `${theme.palette.grey['600']}`)};
  &:hover {
    color: ${({ theme }) => `${theme.palette.blue['600']}`};
  }
`

const TabList = styled.div`
  height: 100%;
  display: flex;
`

const TabLink = withRouter(({ children, to, location, active }) => (
  <Link to={to}>
    <Tab active={active ? active(location.pathname, to) : location.pathname === to}>{children}</Tab>
  </Link>
))

const Header = ({ children, t }) => {
  const { currentUser } = useContext(UserContext)
  return (
    <div>
      <Container>
        <Wrapper>
          <div>
            <Link to="/portal">
              <Logo
                alt="Zendesk Relationshapes Logo"
                src="//d1eipm3vz40hy0.cloudfront.net/images/part-header/zendesk-relationshapes-logo.svg"
              />
            </Link>
          </div>
          <TabList>
            <TabLink to="/portal">{t('volunteer_portal.dashboard.layouttab.calendar')}</TabLink>
            <TabLink to="/portal/dashboard">{t('volunteer_portal.dashboard.layouttab.dashboard')}</TabLink>
            <TabLink to="/portal/events">{t('volunteer_portal.dashboard.layouttab.myevents')}</TabLink>
            {currentUser.isAdmin && (
              <TabLink to="/portal/admin" active={(location, _) => R.includes('portal/admin', location)}>
                {t('volunteer_portal.header.user_profile.admin')}
              </TabLink>
            )}
          </TabList>
          {children}
        </Wrapper>
      </Container>
      <div style={{ overflow: 'auto' }} />
    </div>
  )
}

export default withTranslation()(Header)
