import React, { useState, useContext } from 'react'

import * as R from 'ramda'
import moment from 'moment'
import styled from 'styled-components'

import { Header, Body } from '@zendeskgarden/react-modals'
import { Field as GField, Label, Hint, Input, Message, Range } from '@zendeskgarden/react-forms'
import { Datepicker } from '@zendeskgarden/react-datepickers'
import { Dots } from '@zendeskgarden/react-loaders'
import { Button } from '@zendeskgarden/react-buttons'

import ReduxFormAutocomplete from 'components/ReduxFormAutoComplete'
import TagField from 'components/TagField'
import { UserContext } from '../../context/UserContext'

import { useTranslation } from 'react-i18next'

const PaddedField = styled(GField)`
  flex: 1;
  padding: ${({ theme }) => theme.space.sm} ${({ theme }) => theme.space.xs};
`

const TopMargin = styled.div`
  margin-top: ${({ theme }) => theme.space.xs};
`
const RightFloatButton = styled(Button)`
  float: right;
`

const CreateEditModalContents = ({
  offices,
  eventTypes,
  tags,
  organizations,
  createEditIndividualEvent,
  isNew,
  setShowCreateEditModal,
  modalEventData
}) => {
  const currentUserOffice = useContext(UserContext).currentUser.office

  const [description, setDescription] = useState(modalEventData?.description || '')
  const [selectedTags, setSelectedTags] = useState(modalEventData?.tags || [])
  const [selectedOffice, setSelectedOffice] = useState(modalEventData?.office || currentUserOffice.id)
  const [date, setDate] = useState(modalEventData?.date || new Date())
  const [duration, setDuration] = useState(modalEventData?.duration || 0)
  const [selectedEventType, setSelectedEventType] = useState(modalEventData?.eventType)
  const [selectedOrg, setSelectedOrg] = useState(modalEventData?.organization)

  const { t, i18n } = useTranslation()

  const [showFieldErrors, setShowFieldErrors] = useState(false)
  const [loading, setLoading] = useState(false)

  const isValidText = value => (value.length === 0 ? false : true)
  const isValidMultiSelect = selection => (selection.length < 1 ? false : true)
  const isValidSelect = selection => !!selection
  const isValidNumber = number => (number > 0 ? true : false)

  const handleSubmit = () => {
    if (
      isValidText(description) &&
      isValidMultiSelect(selectedTags) &&
      isValidSelect(date) &&
      isValidNumber(duration) &&
      isValidSelect(selectedEventType) &&
      isValidSelect(selectedOrg)
    ) {
      const data = {
        id: modalEventData?.id,
        description,
        tags: selectedTags,
        officeId: selectedOffice,
        date: moment(date).format('YYYY-MM-DD'),
        duration,
        eventTypeId: selectedEventType,
        organizationId: selectedOrg,
      }
      if (!isNew && !modalEventData?.id) {
        // This shouldn't happen, but we'll prevent creating an event.
        setShowCreateEditModal(false)
        return
      }
      setLoading(true)
      createEditIndividualEvent(data).then(() => {
        setLoading(false)
        setShowCreateEditModal(false)
      })
    } else {
      setShowFieldErrors(true)
    }
  }

  return (
    <>
      <Header>{isNew ? t('volunteer_portal.admin.tab.user.myevents.individualevent.recordevent') : t('volunteer_portal.admin.tab.user.myevents.individualevent.editevent')}</Header>
      <Body>
        <PaddedField>
          <Label>{t('volunteer_portal.admin.tab.user.myevents.individualevent.recordevent.description')}</Label>
          <Input value={description} onChange={event => setDescription(event.target.value)} />
          {showFieldErrors && !isValidText(description) && (
            <Message validation={'error'}>{t('volunteer_portal.admin.tab.user.myevents.individualevent.recordevent.description.error')}</Message>
          )}
        </PaddedField>
        <PaddedField>
          <Label>{t('volunteer_portal.admin.tab.user.myevents.individualevent.recordevent.organization')}</Label>
          <Hint>{t('volunteer_portal.admin.tab.user.myevents.individualevent.recordevent.organization.hint')}</Hint>
          <TopMargin />
          <ReduxFormAutocomplete
            dataSource={R.sortBy((a) => a.name.toLocaleLowerCase(), organizations)}
            input={{ value: selectedOrg, onChange: setSelectedOrg }}
            searchField="name"
            />
          {showFieldErrors && !isValidSelect(selectedOrg) && (
            <Message validation={'error'}>{t('volunteer_portal.admin.tab.user.myevents.individualevent.recordevent.organization.error')}</Message>
          )}
        </PaddedField>
        <PaddedField>
          <Label>{t('volunteer_portal.admin.tab.user.myevents.individualevent.recordevent.date')}</Label>
          <Datepicker value={date} onChange={setDate} locale={i18n.language}>
            <Input />
          </Datepicker>
          {showFieldErrors && !isValidSelect(date) && <Message validation={'error'}>{t('volunteer_portal.admin.tab.user.myevents.individualevent.recordevent.date.error')}</Message>}
        </PaddedField>
        <PaddedField>
          <Label>{t('volunteer_portal.admin.tab.user.myevents.individualevent.recordevent.duration')}</Label>
          <TopMargin />
          <Hint>{duration / 60} {t('volunteer_portal.admin.tab.user.myevents.individualevent.recordevent.duration.hours')}</Hint>
          <Range
            step={30}
            value={duration}
            onChange={event => {
              const duration = parseInt(event.target.value)
              setDuration(duration)
            }}
            min={0}
            max={480}
          />
          {showFieldErrors && !isValidNumber(duration) && (
            <Message validation={'error'}>{t('volunteer_portal.admin.tab.user.myevents.individualevent.recordevent.duration.error')}</Message>
          )}
        </PaddedField>
        <PaddedField>
            <Label>{t('volunteer_portal.admin.tab.user.myevents.individualevent.recordevent.type')}</Label>
            <TopMargin />
            <ReduxFormAutocomplete
              dataSource={R.sortBy((a) => a.title.toLocaleLowerCase(), eventTypes)}
              input={{ value: selectedEventType, onChange: setSelectedEventType }}
              searchField="title"
            />
            {showFieldErrors && !isValidSelect(selectedEventType) && (
              <Message validation={'error'}>{t('volunteer_portal.admin.tab.user.myevents.individualevent.recordevent.type.error')}</Message>
            )}
        </PaddedField>
        <PaddedField>
          <Label>{t('volunteer_portal.admin.tab.user.myevents.individualevent.recordevent.tags')}</Label>
          <TopMargin />
          <TagField tags={tags} input={{ value: selectedTags, onChange: setSelectedTags }} />
          {showFieldErrors && !isValidMultiSelect(selectedTags) && (
            <Message validation={'error'}>{t('volunteer_portal.admin.tab.user.myevents.individualevent.recordevent.tags.error')}</Message>
          )}
        </PaddedField>
        <PaddedField>
          <Label>{t('volunteer_portal.admin.tab.user.myevents.individualevent.recordevent.office')}</Label>
          <TopMargin />
          <ReduxFormAutocomplete
            dataSource={R.sortBy((a) => a.name.toLocaleLowerCase(), offices)}
            input={{ value: selectedOffice, onChange: setSelectedOffice }}
            searchField="name"
          />
          {showFieldErrors && !isValidSelect(selectedOffice) && (
            <Message validation={'error'}>{t('volunteer_portal.admin.tab.user.myevents.individualevent.recordevent.office.error')}</Message>
          )}
        </PaddedField>
        <PaddedField> 
          <RightFloatButton disabled={loading} onClick={handleSubmit}>
            {loading ? <Dots /> : isNew ? t('volunteer_portal.admin.tab.user.myevents.individualevent.recordevent.record') : t('volunteer_portal.admin.tab.user.myevents.individualevent.recordevent.edit')}
          </RightFloatButton>
        </PaddedField>
      </Body>
    </>
  )
}

export default CreateEditModalContents
