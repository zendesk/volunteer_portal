import React, { useState, useContext } from 'react'
import { Link } from 'react-router'
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
import s from './main.css'
import { useTranslation } from 'react-i18next'

import {
  Dropdown,
  Trigger,
  Menu as GardenMenu,
  Item,
  Hint,
  Select,
  Field,
  Label,
  Separator,
  PreviousItem,
  HeaderItem,
  NextItem,
} from '@zendeskgarden/react-dropdowns'
import { Button } from '@zendeskgarden/react-buttons'
import { Avatar } from '@zendeskgarden/react-avatars'
import TranslationIcon from '@zendeskgarden/svg-icons/src/12/translation-exists-fill.svg'
import PencilIcon from '@zendeskgarden/svg-icons/src/12/pencil-fill.svg'

const styles = {
  item: {
    fontSize: 14,
  },
}

const AdminActions = ({ currentUser }) => {
  const { t } = useTranslation()

  return (
    currentUser.isAdmin && (
      <div className={s.adminActions}>
        <div className={s.adminBox}>
          <Link to="/portal/admin">
            <Button isLink={true}>
              <PencilIcon /> {t('volunteer_portal.header.admin')}
            </Button>
          </Link>
        </div>
      </div>
    )
  )
}

const LanguageSelect = () => {
  const { i18n } = useTranslation()
  const options = [{ label: 'English', value: 'en' }, { label: '日本語', value: 'ja' }]
  const [selectedItem, useSelectedItem] = useState(options[0].value)

  return (
    <div style={{ margin: '0px 4px' }}>
      <Dropdown
        selectedItem={selectedItem}
        // downshiftProps={{ itemToString: item => item && item.label }}
        onSelect={selectedItem => {
          i18n.changeLanguage(selectedItem.value, () => {
            // TODO: Handle callback (error/success)
          })
          useSelectedItem(selectedItem)
        }}
      >
        {/* <Field>
          <Select>
            <TranslationIcon /> {selectedItem.label}
          </Select>
        </Field> */}
        <Trigger>
          <Button>hi</Button>
        </Trigger>
        <GardenMenu>
          {options.map(option => (
            <Item key={option.value} value={option.value}>
              {option.label}
            </Item>
          ))}
        </GardenMenu>
      </Dropdown>
    </div>
  )
}

const UserProfile2 = ({ currentUser, offices, togglePopover, popover, handleOfficeSelect, adminPage }) => (
  <div>
    <button className={s.btn} onClick={togglePopover}>
      <img className={s.img} src={currentUser.photo} />
      <div className={s.userInfoBox}>
        <div className={s.userName}>{currentUser.name}</div>
        <div className={s.userOffice}>{currentUser.office && currentUser.office.name}</div>
      </div>
      <Popover
        className={s.popover}
        open={present(popover)}
        anchorEl={popover ? popover.anchorEl : null}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
        onRequestClose={togglePopover}
      >
        <Menu>
          <MenuItem
            style={styles.item}
            primaryText="Default Office"
            rightIcon={<ArrowDropRight />}
            menuItems={offices.map((o, i) => (
              <MenuItem
                key={`office-${i}`}
                primaryText={o.name}
                style={styles.item}
                checked={currentUser.office.id === o.id}
                onClick={() => handleOfficeSelect(o)}
                insetChildren
              />
            ))}
          />
          <Divider />
          <a href="/users/sign_out">
            <MenuItem style={styles.item} primaryText="Sign out" />
          </a>
        </Menu>
      </Popover>
    </button>
  </div>
)

const UserProfile = ({ currentUser, offices, togglePopover, popover, handleOfficeSelect, adminPage }) => {
  const { i18n } = useTranslation()
  const languages = [{ label: 'English', value: 'en' }, { label: '日本語', value: 'ja' }]

  const [isOpen, setIsOpen] = useState(false)
  const [tempSelectedItem, setTempSelectedItem] = useState()
  const [selectedItem, setSelectedItem] = useState({ office: currentUser.office })

  const renderItems = () => {
    if (tempSelectedItem === 'default-office') {
      return (
        <>
          <PreviousItem value="general-settings">Default Office</PreviousItem>
          <Separator />
          {offices.map((office, i) => (
            <Item key={i} value={{ office }}>
              {office.name}
            </Item>
          ))}
        </>
      )
    }

    if (tempSelectedItem === 'language-settings') {
      return (
        <>
          <PreviousItem value="general-settings">Language Settings</PreviousItem>
          <Separator />
          {languages.map((language, i) => (
            <Item key={i} value={language}>
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
        <Item value="admin">Admin</Item>
        <Item value="sign-out">Sign Out</Item>
      </>
    )
  }

  return (
    <Dropdown
      selectedItem={selectedItem}
      downshiftProps={{ itemToString: item => item.office && item.office.id }}
      isOpen={isOpen}
      onStateChange={(changes, stateAndHelpers) => {
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
          switch (itemSelected) {
            case 'specific-settings':
              stateAndHelpers.setHighlightedIndex(1)
              break
            case 'general-settings':
              stateAndHelpers.setHighlightedIndex(3)
              break
            default:
              break
          }
          setTempSelectedItem(itemSelected)
        }
      }}
      onSelect={selectedItem => {
        if (tempSelectedItem === 'default-office') {
          if (R.hasPath(['office'])(selectedItem)) {
            handleOfficeSelect(selectedItem.office)
            setSelectedItem(selectedItem)
          }
        }
      }}
    >
      <Trigger>
        <div>
          <img className={s.img} src={currentUser.photo} />
          <div className={s.userInfoBox}>
            <div className={s.userName}>{currentUser.name}</div>
            <div className={s.userOffice}>{currentUser.office && currentUser.office.name}</div>
          </div>
        </div>
      </Trigger>
      <GardenMenu hasArrow>{renderItems()}</GardenMenu>
    </Dropdown>
  )
}

const Header = ({ offices, togglePopover, popover, adminPage }) => {
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
          />
        </div>
      </div>
      <div style={{ overflow: 'auto' }} />
    </div>
  )
}

export default Header
