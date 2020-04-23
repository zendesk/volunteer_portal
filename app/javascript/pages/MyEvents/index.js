import React, { useState, useContext } from 'react'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import * as R from 'ramda'
import moment from 'moment'

import ActionDone from 'material-ui/svg-icons/action/done'
import ActionInfoOutline from 'material-ui/svg-icons/action/info-outline'
import AVNotInterested from 'material-ui/svg-icons/av/not-interested'
import ReactTable from 'react-table'

import { togglePopover } from 'actions'

import Layout from 'components/Layout'
import Loading from 'components/LoadingIcon'
import ReduxFormAutocomplete from 'components/ReduxFormAutoComplete'
import TagField from 'components/TagField'
import { UserContext } from '../../context/UserContext'

import MyEventsQuery from './query.gql'
import CreateEditIndividualEventMutation from 'mutations/CreateEditIndividualEventMutation.gql'
import DeleteIndividualEventMutation from 'mutations/DeleteIndividualEventMutation.gql'
import s from './main.css'

import { Modal, Header, Body, Footer, FooterItem, Close } from '@zendeskgarden/react-modals'
import { Field as GField, Label, Hint, Input, Message, Range } from '@zendeskgarden/react-forms'
import { Datepicker } from '@zendeskgarden/react-datepickers'
import { Dots } from '@zendeskgarden/react-loaders'

import { Button } from '@zendeskgarden/react-buttons'
import styled from 'styled-components'

const eventStatusIcon = event => {
  switch (event.status) {
    case 'REJECTED':
      return <AVNotInterested color="#A93A38" />
    case 'PENDING':
      return <ActionInfoOutline color="#EFC93D" />
    case 'APPROVED':
      return <ActionDone color="16BA52" />
    default:
      return <ActionInfoOutline color="#EFC93D" />
  }
}

const PaddedField = styled(GField)`
  padding: ${({ theme }) => theme.space.sm} 0px;
`

const TopMargin = styled.div`
  margin-top: ${({ theme }) => theme.space.xs};
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
          <Label>Organization</Label>
          <TopMargin />
          <Hint>Contact us to add your organization to this list.</Hint>
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
          <Label>Tags</Label>
          <TopMargin />
          <TagField tags={tags} input={{ value: selectedTags, onChange: setSelectedTags }} />
          {showFieldErrors && !isValidMultiSelect(selectedTags) && (
            <Message validation={'error'}>{'Must have at least one tag'}</Message>
          )}
        </PaddedField>
      </Body>
      <Footer>
        <FooterItem>
          <Button disabled={loading} onClick={handleSubmit}>
            {loading ? <Dots /> : isNew ? 'Record' : 'Edit'}
          </Button>
        </FooterItem>
      </Footer>
    </>
  )
}

const DeleteModalContents = ({ toDelete, deleteIndividualEvent, setShowDeleteModal }) => {
  const [loading, setLoading] = useState(false)

  const handleDelete = () => {
    setLoading(true)
    deleteIndividualEvent(toDelete).then(() => {
      setLoading(false)
      setShowDeleteModal(false)
    })
  }

  return (
    <>
      <Header isDanger>Delete Event</Header>
      <Body>Are you sure you want to delete this event?</Body>
      <Footer>
        <FooterItem>
          <Button isBasic onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
        </FooterItem>
        <FooterItem>
          <Button isDanger disabled={loading} onClick={handleDelete}>
            {loading ? <Dots /> : 'Delete'}
          </Button>
        </FooterItem>
      </Footer>
    </>
  )
}

const IndividualEvents = props => {
  const { data, popover, togglePopover, handleSubmit, createEditIndividualEvent, deleteIndividualEvent } = props

  const { currentUser, offices, eventTypes, organizations, tags } = data

  const [showCreateEditModal, setShowCreateEditModal] = useState(false)
  const [isNew, setIsNew] = useState(true)
  const [modalEventData, setModalEventData] = useState()

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [toDelete, setToDelete] = useState(false)

  const noIndividualEventsMessage = (
    <p className={s.noEventsMessage}>
      Looks like there are no individual events here. Volunteer and record your first event.
    </p>
  )

  const individualEventsColumns = [
    {
      id: 'description',
      Header: 'Description',
      accessor: 'description',
    },
    {
      id: 'organization',
      Header: 'Organization',
      accessor: 'organization.name',
    },
    {
      id: 'date',
      Header: 'Date',
      Cell: props => <span>{moment(props.value).format('MMMM D, YYYY')}</span>,
      accessor: 'date',
    },
    {
      id: 'duration',
      Header: 'Duration (min)',
      accessor: 'duration',
    },
    {
      id: 'type',
      Header: 'Type',
      accessor: 'eventType.title',
    },
    {
      id: 'approval',
      Header: 'Approval',
      accessor: d => eventStatusIcon(d),
      width: 75,
      style: { textAlign: 'center' },
    },
    {
      id: 'actions',
      Header: 'Actions',
      accessor: d => d,
      sortable: false,
      width: 210,
      Cell: props => (
        <span className="s.actionColumn">
          <button
            className={`${s.btn} ${s.confirmBtn} ${s.leftAligned}`}
            onClick={() => {
              const { id, description, office, date, duration, eventType, tags, organization } = props.value
              setIsNew(false)
              setModalEventData({
                id,
                description,
                office: office.id,
                date: new Date(date),
                duration,
                eventType: eventType.id,
                tags: R.map(R.pick(['id']), tags),
                organization: organization.id,
              })
              setShowCreateEditModal(true)
            }}
          >
            Edit
          </button>
          <button
            className={`${s.btn} ${s.confirmBtn}`}
            onClick={() => {
              const { description, office, date, duration, eventType, tags, organization } = props.value
              setIsNew(true)
              setModalEventData({
                description,
                office: office.id,
                date: new Date(date),
                duration,
                eventType: eventType.id,
                tags: R.map(R.pick(['id']), tags),
                organization: organization.id,
              })
              setShowCreateEditModal(true)
            }}
          >
            Clone
          </button>
          <button
            className={`${s.btn} ${s.deleteBtn}`}
            onClick={() => {
              setToDelete(props.value.id)
              setShowDeleteModal(true)
            }}
          >
            Delete
          </button>
        </span>
      ),
    },
  ]

  return (
    <div className={s.eventsTable}>
      <div className={s.personalHeader}>
        <div className={s.actionBar}>
          <button
            className={s.createAction}
            onClick={() => {
              setIsNew(true)
              setModalEventData()
              setShowCreateEditModal(true)
            }}
          >
            Record Event
          </button>
        </div>
        <h1>Individual Events</h1>
        <h4>Private events that you've attended and want to record.</h4>
      </div>
      {currentUser.individualEvents.length === 0 ? (
        noIndividualEventsMessage
      ) : (
        <ReactTable
          NoDataComponent={() => null}
          data={currentUser.individualEvents}
          columns={individualEventsColumns}
          defaultPageSize={10}
          defaultSorted={[{ id: 'date', desc: true }]}
          minRows={0}
        />
      )}

      {popover && popover.type === 'editIndividualEvent' ? (
        <CreateEditDialog
          offices={offices}
          eventTypes={eventTypes}
          tags={tags}
          organizations={organizations}
          popover={popover}
          onSubmit={handleSubmit(createEditIndividualEvent)}
          onCancel={() => togglePopover('editIndividualEvent')}
        />
      ) : null}
      {popover && popover.type === 'destroyIndividualEvent' ? (
        <DestroyDialog
          popover={popover}
          onDelete={() => deleteIndividualEvent(popover.data.id) && togglePopover('destroyIndividualEvent')}
          onCancel={() => togglePopover('destroyIndividualEvent')}
        />
      ) : null}
      {showCreateEditModal && (
        <Modal
          onClose={() => {
            setShowCreateEditModal(false)
            setModalEventData()
          }}
          isLarge
        >
          <CreateEditModalContents
            offices={offices}
            eventTypes={eventTypes}
            tags={tags}
            organizations={organizations}
            popover={popover}
            createEditIndividualEvent={createEditIndividualEvent}
            setShowCreateEditModal={setShowCreateEditModal}
            isNew={isNew}
            modalEventData={modalEventData}
          />
          <Close aria-label="Close modal" />
        </Modal>
      )}
      {showDeleteModal && (
        <Modal
          onClose={() => {
            setShowDeleteModal(false)
            setToDelete()
          }}
        >
          <DeleteModalContents
            toDelete={toDelete}
            deleteIndividualEvent={deleteIndividualEvent}
            setShowDeleteModal={setShowDeleteModal}
          />
          <Close aria-label="Close modal" />
        </Modal>
      )}
    </div>
  )
}

const organizedEventsColumns = [
  {
    id: 'event',
    Header: 'Event',
    accessor: 'title',
  },
  {
    id: 'organization',
    Header: 'Organization',
    accessor: 'organization.name',
  },
  {
    id: 'date',
    Header: 'Date',
    Cell: props => <span>{moment(props.value).format('MMMM D, YYYY')}</span>,
    accessor: 'startsAt',
  },
  {
    id: 'duration',
    Header: 'Duration (min)',
    accessor: 'duration',
  },
  {
    id: 'type',
    Header: 'Type',
    accessor: 'eventType.title',
  },
  {
    id: 'location',
    Header: 'Location',
    accessor: 'location',
  },
]

const OrganizedEvents = ({ currentUser: { signups } }) => {
  const noOrganizedEventsMessage = (
    <p className={s.noEventsMessage}>
      Looks like you haven't signed up to any organized events yet. Checkout the calendar to join your first event!
    </p>
  )
  return (
    <div className={s.eventsTable}>
      <h1>Organized Events</h1>
      <h4>Events organized by your organization, found on the calendar.</h4>
      {signups.length === 0 ? (
        noOrganizedEventsMessage
      ) : (
        <ReactTable
          NoDataComponent={() => null}
          data={signups.map(signup => signup.event)}
          columns={organizedEventsColumns}
          defaultPageSize={10}
          defaultSorted={[{ id: 'date', desc: true }]}
          minRows={0}
        />
      )}
    </div>
  )
}

const MyEvents = props => {
  const { data, locationBeforeTransitions } = props

  const { currentUser } = data

  if (data.loading) {
    return <Loading />
  } else if (data.error) {
    console.error(data.error)
    return <div>Sorry, we are having trouble loading your events.</div>
  } else {
    return (
      <Layout currentPath={locationBeforeTransitions.pathname}>
        <IndividualEvents {...props} />
        <OrganizedEvents currentUser={currentUser} />
      </Layout>
    )
  }
}

const mapStateToProps = (state, _ownProps) => {
  const { popover } = state.model
  const { locationBeforeTransitions } = state.routing
  const props = {
    popover,
    locationBeforeTransitions,
  }

  return R.isNil(popover) ? props : R.merge({ initialValues: popover.data }, props)
}

const individualEventInputToOptimisticResponse = (data, input) => {
  return {
    __typename: 'IndividualEvent',
    id: input.id || -1,
    description: input.description,
    office: R.find(office => office.id === input.officeId, data.offices),
    date: moment(input.date),
    duration: input.duration,
    eventType: R.find(et => et.id === input.eventTypeId, data.eventTypes),
    tags: R.filter(tag => R.includes(R.pick(['id'], tag), input.tags), data.tags),
    organization: R.find(org => org.id === input.organizationId, data.organizations),
    status: 'PENDING',
  }
}

const buildOptimisticResponse = (newEvent, currentUser) => {
  const { id: currentUserId, individualEvents: existingEvents } = currentUser
  const arrIdx = R.find(R.propEq('id', newEvent.id), existingEvents)
  const individualEvents = R.isNil(arrIdx)
    ? R.append(newEvent, existingEvents)
    : R.update(arrIdx, newEvent, existingEvents)

  return {
    __typename: 'Mutation',
    createEditIndividualEvent: {
      __typename: 'User',
      id: currentUserId,
      individualEvents,
    },
  }
}

const withData = compose(
  graphql(MyEventsQuery, {
    options: {
      fetchPolicy: 'cache-and-network',
    },
  }),
  graphql(CreateEditIndividualEventMutation, {
    props: ({ ownProps, mutate }) => ({
      createEditIndividualEvent: data => {
        const currentUser = ownProps.data.currentUser
        const individualEventInput = data
        const newEvent = individualEventInputToOptimisticResponse(ownProps.data, individualEventInput)

        return mutate({
          variables: { input: individualEventInput },
          optimisticResponse: buildOptimisticResponse(newEvent, currentUser),
        })
      },
    }),
  }),
  graphql(DeleteIndividualEventMutation, {
    props: ({ ownProps, mutate }) => ({
      deleteIndividualEvent: id => {
        const currentUser = ownProps.data.currentUser

        return mutate({
          variables: { input: { id } },
          optimisticResponse: {
            __typename: 'Mutation',
            deleteIndividualEvent: {
              __typename: 'User',
              id: currentUser.id,
              individualEvents: R.reject(ie => ie.id === currentUser.id, currentUser.individualEvents),
            },
          },
        })
      },
    }),
  })
)

const withActions = connect(mapStateToProps, {
  togglePopover,
})

export default withActions(withData(MyEvents))
