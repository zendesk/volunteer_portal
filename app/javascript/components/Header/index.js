import React, { useState, useContext } from 'react'
import { Link, withRouter } from 'react-router'
import * as R from 'ramda'
import styled from 'styled-components'
import { useMutation } from '@apollo/react-hooks'
import { useTranslation } from 'react-i18next'

import {
  Dropdown,
  Trigger,
  Menu as GardenMenu,
  Item,
  Separator,
  PreviousItem,
  HeaderItem,
  NextItem,
} from '@zendeskgarden/react-dropdowns'
import { Avatar } from '@zendeskgarden/react-avatars'
import TranslationIcon from '@zendeskgarden/svg-icons/src/12/translation-exists-fill.svg'
import { MD } from '@zendeskgarden/react-typography'

import UpdateUserOfficeMutation from '/mutations/UpdateUserOfficeMutation.gql'
import { UserContext, FilterContext } from '/context'

const NavigationText = styled.div`
  color: #08c;
`

const UserDetails = styled.div`
  margin-left: 10px;
`

const UserProfileContainer = styled.button`
  display: flex;
  border: none;
  text-align: left;
`

const UserName = styled(MD)`
  font-weight: bold;
`

const UserProfile = ({ currentUser, offices, handleOfficeSelect, location, router }) => {
  const { i18n, t } = useTranslation()
  const languages = [
    { label: 'English', value: 'en' },
    // Enable when Japanense is supported
    // { label: '日本語', value: 'ja' }
  ]

  const [isOpen, setIsOpen] = useState(false)
  const [tempSelectedItem, setTempSelectedItem] = useState()
  const [selectedItem, setSelectedItem] = useState({ office: currentUser.office, language: languages[0] })

  const handleStateChange = (changes, stateAndHelpers) => {
    if (R.hasPath(['isOpen'])(changes)) {
      setIsOpen(
        changes.selectedItem === 'default-office' ||
          changes.selectedItem === 'language-settings' ||
          changes.selectedItem === 'general-settings' ||
          changes.isOpen
      )
    }

    if (R.hasPath(['selectedItem'])(changes)) {
      const itemSelected = R.prop('selectedItem')(changes)
      if (itemSelected === 'general-settings') {
        switch (tempSelectedItem) {
          case 'default-office':
            stateAndHelpers.setHighlightedIndex(0)
            break
          case 'language-settings':
            stateAndHelpers.setHighlightedIndex(1)
        }
      }
      setTempSelectedItem(itemSelected)
    }
  }

  const handleSelect = selectedItem => {
    if (tempSelectedItem === 'default-office') {
      if (R.hasPath(['office'])(selectedItem)) {
        handleOfficeSelect(selectedItem.office)
        setSelectedItem(selectedItem)
      }
    } else if (tempSelectedItem === 'language-settings') {
      if (R.hasPath(['language'])(selectedItem)) {
        i18n.changeLanguage(selectedItem.language.value, () => {
          // TODO: Handle callback (error/success)
        })
        setSelectedItem(selectedItem)
      }
    } else if (selectedItem === 'admin') {
      router.push('/portal/admin')
    } else if (selectedItem === 'home') {
      router.push('/portal')
    } else if (selectedItem === 'sign-out') {
      router.push('/portal/sign_out')
    }
  }

  const renderItems = () => {
    if (tempSelectedItem === 'default-office') {
      return (
        <>
          <PreviousItem value="general-settings">
            {t('volunteer_portal.header.user_profile.default_office')}
          </PreviousItem>
          <Separator />
          {offices.map((office, i) => (
            <Item key={i} value={{ office, language: selectedItem.language }}>
              {office.name}
            </Item>
          ))}
        </>
      )
    }

    if (tempSelectedItem === 'language-settings') {
      return (
        <>
          <PreviousItem value="general-settings">
            <TranslationIcon /> {t('volunteer_portal.header.user_profile.language')}
          </PreviousItem>
          <Separator />
          {languages.map((language, i) => (
            <Item key={i} value={{ office: selectedItem.office, language }}>
              {' '}
              {language.label}{' '}
            </Item>
          ))}
        </>
      )
    }

    return (
      <>
        <HeaderItem>Settings</HeaderItem>
        <NextItem value="default-office">{t('volunteer_portal.header.user_profile.default_office')}</NextItem>
        <NextItem value="language-settings">
          <TranslationIcon /> {t('volunteer_portal.header.user_profile.language')}
        </NextItem>
        <Separator />
        {currentUser.isAdmin &&
          (R.contains('/portal/admin')(location.pathname) ? (
            <Link to="/portal">
              <Item value="home">
                <NavigationText>{t('volunteer_portal.header.user_profile.volunteer')}</NavigationText>
              </Item>
            </Link>
          ) : (
            <Link to="/portal/admin">
              <Item value="admin">
                <NavigationText>{t('volunteer_portal.header.user_profile.admin')}</NavigationText>
              </Item>
            </Link>
          ))}
        <NavigationText>
          <a href="/users/sign_out">
            <Item value="sign-out">
              <NavigationText>{t('volunteer_portal.header.user_profile.sign_out')}</NavigationText>
            </Item>
          </a>
        </NavigationText>
      </>
    )
  }

  return (
    <Dropdown
      selectedItem={selectedItem}
      // This is used to detect what items are selected with a check mark.
      downshiftProps={{
        itemToString: item => (item.office && item.office.id) + (item.language && item.language.value),
      }}
      isOpen={isOpen}
      onStateChange={handleStateChange}
      onSelect={handleSelect}
    >
      <Trigger>
        <UserProfileContainer>
          <Avatar>
            <img src={currentUser.photo} alt="User Avatar" />
          </Avatar>
          <UserDetails>
            <UserName>{currentUser.name}</UserName>
            <MD>{currentUser.office && currentUser.office.name}</MD>
          </UserDetails>
        </UserProfileContainer>
      </Trigger>
      <GardenMenu hasArrow>{renderItems()}</GardenMenu>
    </Dropdown>
  )
}

const LogoBox = styled.div`
  flex-grow: 2;
`

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

const LogoSection = () => (
  <LogoBox>
    <Link to="/portal">
      <Logo
        alt="Zendesk Relationshapes Logo"
        src="//d1eipm3vz40hy0.cloudfront.net/images/part-header/zendesk-relationshapes-logo.svg"
      />
    </Link>
  </LogoBox>
)

const Header = ({ offices, togglePopover, popover, adminPage, location, router }) => {
  const { currentUser, setOffice } = useContext(UserContext)
  const { setOfficeValue } = useContext(FilterContext)
  const [updateDefaultOffice] = useMutation(UpdateUserOfficeMutation)

  if (R.isNil(currentUser) || R.isEmpty(currentUser)) return null

  const handleOfficeSelect = office =>
    updateDefaultOffice({ variables: { userId: currentUser.id, officeId: office.id } })
      .then(response => setOffice(R.path(['data', 'updateUserOffice', 'office'], response)))
      .then(_ => setOfficeValue(office.id))
      .then(_ => togglePopover('user'))

  return R.isNil(currentUser) || R.isEmpty(currentUser) ? null : (
    <div>
      <Container>
        <Wrapper>
          <LogoSection />
          <UserProfile
            offices={offices}
            togglePopover={togglePopover}
            currentUser={currentUser}
            popover={popover}
            handleOfficeSelect={handleOfficeSelect}
            adminPage={adminPage}
            location={location}
            router={router}
          />
        </Wrapper>
      </Container>
      <div style={{ overflow: 'auto' }} />
    </div>
  )
}

export default withRouter(Header)
