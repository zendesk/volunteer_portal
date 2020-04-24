import React, { useState, useContext } from 'react'

import ReduxFormAutocomplete from 'components/ReduxFormAutoComplete'
import TagField from 'components/TagField'
import { UserContext } from '../../context/UserContext'
import { Header, Body } from '@zendeskgarden/react-modals'
import { Field as GField, Label, Hint, Input, Message, Range } from '@zendeskgarden/react-forms'
import { Datepicker } from '@zendeskgarden/react-datepickers'
import { Dots } from '@zendeskgarden/react-loaders'

import { Button } from '@zendeskgarden/react-buttons'
import styled from 'styled-components'

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
  modalEventData,
}) => {
  const currentUserOffice = useContext(UserContext).currentUser.office

  const [description, setDescription] = useState(modalEventData?.description || '')
  const [selectedTags, setSelectedTags] = useState(modalEventData?.tags || [])
  const [selectedOffice, setSelectedOffice] = useState(modalEventData?.office || currentUserOffice.id)
  const [date, setDate] = useState(modalEventData?.date || new Date())
  const [duration, setDuration] = useState(modalEventData?.duration || 0)
  const [selectedEventType, setSelectedEventType] = useState(modalEventData?.eventType)
  const [selectedOrg, setSelectedOrg] = useState(modalEventData?.organization)

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
        date,
        duration,
        eventTypeId: selectedEventType,
        organizationId: selectedOrg,
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
      <Header>{isNew ? 'Record Event' : 'Edit Event'}</Header>
      <Body>
        <PaddedField>
          <Label>Description</Label>
          <Input value={description} onChange={event => setDescription(event.target.value)} />
          {showFieldErrors && !isValidText(description) && (
            <Message validation={'error'}>{'Must not be empty'}</Message>
          )}
        </PaddedField>
        <PaddedField>
          <Label>Organization</Label>
          <Hint>Contact us to add your organization to this list or select 'Other'</Hint>
          <TopMargin />
          <ReduxFormAutocomplete
            dataSource={organizations}
            input={{ value: selectedOrg, onChange: setSelectedOrg }}
            searchField="name"
            />
          {showFieldErrors && !isValidSelect(selectedOrg) && (
            <Message validation={'error'}>{'Must have selection'}</Message>
          )}
        </PaddedField>
        <PaddedField>
          <Label>Date</Label>
          <Datepicker value={date} onChange={setDate}>
            <Input />
          </Datepicker>
          {showFieldErrors && !isValidSelect(date) && <Message validation={'error'}>{'Must have selection'}</Message>}
        </PaddedField>
        <PaddedField>
          <Label>Duration</Label>
          <TopMargin />
          <Hint>{duration / 60} hours</Hint>
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
            <Message validation={'error'}>{'Must be greater than 0'}</Message>
          )}
        </PaddedField>
        <PaddedField>
            <Label>Event type</Label>
            <TopMargin />
            <ReduxFormAutocomplete
              dataSource={eventTypes}
              input={{ value: selectedEventType, onChange: setSelectedEventType }}
              searchField="title"
            />
            {showFieldErrors && !isValidSelect(selectedEventType) && (
              <Message validation={'error'}>{'Must have selection'}</Message>
            )}
        </PaddedField>
        <PaddedField>
          <Label>Tags</Label>
          <TopMargin />
          <TagField tags={tags} input={{ value: selectedTags, onChange: setSelectedTags }} />
          {showFieldErrors && !isValidMultiSelect(selectedTags) && (
            <Message validation={'error'}>{'Must have at least one tag'}</Message>
          )}
        </PaddedField>
        <PaddedField>
          <Label>Office</Label>
          <TopMargin />
          <ReduxFormAutocomplete
            dataSource={offices}
            input={{ value: selectedOffice, onChange: setSelectedOffice }}
            searchField="name"
          />
          {showFieldErrors && !isValidSelect(selectedOffice) && (
            <Message validation={'error'}>{'Must have selection'}</Message>
          )}
        </PaddedField>
        <PaddedField> 
          <RightFloatButton disabled={loading} onClick={handleSubmit}>
            {loading ? <Dots /> : isNew ? 'Record' : 'Edit'}
          </RightFloatButton>
        </PaddedField>
      </Body>
    </>
  )
}

export default CreateEditModalContents