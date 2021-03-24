import React, { useState, useContext, useEffect } from 'react'
import * as R from 'ramda'
import styled from 'styled-components'
import { withRouter } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@apollo/react-hooks'

import {
  Dropdown,
  Trigger,
  Menu as GardenMenu,
} from '@zendeskgarden/react-dropdowns'
import { Avatar } from '@zendeskgarden/react-avatars'
import { MD } from '@zendeskgarden/react-typography'

import UpdateUserOfficeMutation from '/mutations/UpdateUserOfficeMutation.gql'
import { UserContext, FilterContext } from '/context'
import GeneralSettingsMenu from './GeneralSettingsMenu'
import DefaultOfficeMenu from './DefaultOfficeMenu'
import LanguageMenu from './LanguageMenu'

const UserDetails = styled.div`
  margin-left: ${({ theme }) => theme.space.sm};
`

const UserProfileContainer = styled.button`
  display: flex;
  border: none;
  text-align: left;
  background: none;
`

const UserName = styled(MD)`
  font-weight: bold;
`

const UserProfileMenu = ({ offices, location, router, togglePopover }) => {
  const languages = [
    { label: 'English', value: 'en' },
    { label: '日本語', value: 'ja' },
    { label: 'Español', value: 'es' },
  ]
  
  const { i18n, t } = useTranslation()
  const { currentUser, setOffice } = useContext(UserContext)
  const { setOfficeValue } = useContext(FilterContext)
  const [ isOpen, setIsOpen ] = useState(false)
  const [ tempSelectedItem, setTempSelectedItem ] = useState()
  // language: reach out to local storage first
  const [ selectedItem, setSelectedItem ] = useState({ office: currentUser.office, language: i18n.language })
  const [ updateDefaultOffice ] = useMutation(UpdateUserOfficeMutation)

  if (R.isNil(currentUser) || R.isEmpty(currentUser)) return null

  useEffect(() => {
    const selectedLanguage = R.find(R.propEq("value", i18n.language), languages)
    setSelectedItem({ ...selectedItem, language: selectedLanguage })
  }, [i18n.language])

  const handleOfficeSelect = office =>
    updateDefaultOffice({ variables: { userId: currentUser.id, officeId: office.id } })
      .then(response => setOffice(R.path(['data', 'updateUserOffice', 'office'], response)))
      .then(_ => setOfficeValue(office.id))
      .then(_ => togglePopover('user'))


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
            break
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
      // The following are for accessibility support for Link navigation
    } else if (selectedItem === 'admin') {
      router.push('/portal/admin')
    } else if (selectedItem === 'home') {
      router.push('/portal')
    } else if (selectedItem === 'sign-out') {
      window.location.href = '/users/sign_out'
    }
  }

  const renderItems = () => {
    if (tempSelectedItem === 'default-office') {
      return <DefaultOfficeMenu offices={offices} previousMenuValue="general-settings" selectedItem={selectedItem} t={t} />
    } else if (tempSelectedItem === 'language-settings') {
      return <LanguageMenu languages={languages} previousMenuValue="general-settings" selectedItem={selectedItem} t={t} />
    } else {
      return <GeneralSettingsMenu menuValues={{ defaultOffice: 'default-office', languageSettings: 'language-settings'}} pathname={location.pathname} t={t} />
    }
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
        {
          R.isNil(currentUser) || R.isEmpty(currentUser) ? null :
          <UserProfileContainer>
            <Avatar>
              <img src={currentUser.photo} alt="User Avatar" />
            </Avatar>
            <UserDetails>
              <UserName>{currentUser.name}</UserName>
              <MD>{currentUser.office && currentUser.office.name}</MD>
            </UserDetails>
          </UserProfileContainer>
        }
      </Trigger>
      <GardenMenu hasArrow>{renderItems()}</GardenMenu>
    </Dropdown>
  )
}

export default withRouter(UserProfileMenu)
