import React, { useState, useContext } from 'react'
import { Link, withRouter } from 'react-router'
import * as R from 'ramda'
import Popover from 'material-ui/Popover'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import Divider from 'material-ui/Divider'
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right'

import ContentIcon from 'material-ui/svg-icons/content/create'
import UpdateUserOfficeMutation from '/mutations/UpdateUserOfficeMutation.gql'
import { UserContext, FilterContext } from '/context'
import { present } from '../../lib/utils'
import styled from 'styled-components'

import s from './main.css'
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

const NavigationText = styled.div`
  color: #08c;
`

const UserDetails = styled.div`
  margin-left: 10px;
`

const UserProfileContainer = styled.button`
  display: flex;
  border: none;
`

const UserName = styled(MD)`
  font-weight: bold;
`

const UserProfile = ({ currentUser, offices, handleOfficeSelect, location, router }) => {
  const { i18n } = useTranslation()
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
          <PreviousItem value="general-settings">Default Office</PreviousItem>
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
            <TranslationIcon /> Language
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
        <NextItem value="default-office">Default Office</NextItem>
        <NextItem value="language-settings">
          <TranslationIcon /> Language
        </NextItem>
        <Separator />
        {currentUser.isAdmin &&
          (R.contains('/portal/admin')(location.pathname) ? (
            <Link to="/portal">
              <Item value="home">
                <NavigationText>Volunteer</NavigationText>
              </Item>
            </Link>
          ) : (
            <Link to="/portal/admin">
              <Item value="admin">
                <NavigationText>Admin</NavigationText>
              </Item>
            </Link>
          ))}
        <NavigationText>
          <a href="/users/sign_out">
            <Item value="sign-out">
              <NavigationText>Sign Out</NavigationText>
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

const Header = ({ currentUser, offices, togglePopover, popover, adminPage, location, router }) => {
  const { currentUser, setOffice } = useContext(UserContext)
  const { setOfficeValue } = useContext(FilterContext)
  const [updateDefaultOffice] = useMutation(UpdateUserOfficeMutation)

  if (R.isNil(currentUser) || R.isEmpty(currentUser)) return null

  const handleOfficeSelect = office =>
    updateDefaultOffice({ variables: { userId: currentUser.id, officeId: office.id } })
      .then(response => setOffice(R.path(['data', 'updateUserOffice', 'office'], response)))
      .then(_ => setOfficeValue(office.id))
      .then(_ => togglePopover('user'))

  return (
  R.isNil(currentUser) || R.isEmpty(currentUser) ? null : (
    <div className={s.header}>
      <div className={s.container}>
        <div className={adminPage ? `${s.wrapper} ${s.wrapperAdmin}` : s.wrapper}>
          <div className={s.logoBox}>
            <Link to="/portal">
              <img
                alt="Zendesk Relationshapes Logo"
                className={s.logo}
                src="//d1eipm3vz40hy0.cloudfront.net/images/part-header/zendesk-relationshapes-logo.svg"
              />
            </Link>
          </div>
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
        </div>
      </div>
      <div style={{ overflow: 'auto' }} />
    </div>
  )
}

export default withRouter(Header)
