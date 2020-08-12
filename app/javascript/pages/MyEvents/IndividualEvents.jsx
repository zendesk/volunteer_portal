import React, { useState } from 'react'
import * as R from 'ramda'
import moment from 'moment'

import CheckCircleIcon from '@zendeskgarden/svg-icons/src/16/check-circle-stroke.svg'
import InfoIcon from '@zendeskgarden/svg-icons/src/16/info-stroke.svg'
import XCircleIcon from '@zendeskgarden/svg-icons/src/16/x-circle-stroke.svg'
import ReactTable from 'react-table'

import { Modal, Close } from '@zendeskgarden/react-modals'
import { Button } from '@zendeskgarden/react-buttons'

import CreateEditModalContents from './CreateEditModalContents'
import DeleteModalContents from './DeleteModalContents'
import { NoEventsMessage, EventsTable } from './StyledComponents'

import styled from 'styled-components'

import { useTranslation } from 'react-i18next'

const ApprovedIcon = styled(CheckCircleIcon)`
  color: ${({theme}) => theme.palette.lime["400"]};
`

const PendingIcon = styled(InfoIcon)`
  color: ${({theme}) => theme.palette.lemon["400"]};
`

const RejectedIcon = styled(XCircleIcon)`
  color: ${({theme}) => theme.palette.red["400"]};
`

const eventStatusIcon = event => {
  switch (event.status) {
    case 'REJECTED':
      return <RejectedIcon/>
    case 'PENDING':
      return <PendingIcon/>
    case 'APPROVED':
      return <ApprovedIcon/>
    default:
      return <PendingIcon/>
  }
}

const TableButton = styled(Button)`
  padding: 0 ${({theme}) => theme.space.xs};
  line-height: 0px;
  height: 17px;
`

const ActionBar = styled.div`
  display: flex;
  justify-content: flex-end;
  position: absolute;
  right: 0;
  bottom: 0;
`

const ActionColumn = styled.span`
  white-space: nowrap;
`

const PersonalHeader = styled.div`
  position: relative;
`

const IndividualEvents = props => {
  const { t } = useTranslation()
  const { data, popover, createEditIndividualEvent, deleteIndividualEvent } = props

  const { currentUser, offices, eventTypes, organizations, tags } = data

  const [showCreateEditModal, setShowCreateEditModal] = useState(false)
  const [isNew, setIsNew] = useState(true)
  const [modalEventData, setModalEventData] = useState()

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [toDelete, setToDelete] = useState(false)

  const noIndividualEventsMessage = (
    <NoEventsMessage>
      {t('volunteer_portal.admin.tab.user.myevents.individualevent.noevents')}
    </NoEventsMessage>
  )

  const individualEventsColumns = [
    {
      id: 'description',
      Header: t('volunteer_portal.admin.tab.user.myevents.individualevent.description'),
      accessor: 'description',
    },
    {
      id: 'organization',
      Header: t('volunteer_portal.admin.tab.user.myevents.individualevent.organization'),
      accessor: 'organization.name',
    },
    {
      id: 'date',
      Header: t('volunteer_portal.admin.tab.user.myevents.individualevent.date'),
      Cell: props => <span>{moment(props.value).format('MMMM D, YYYY')}</span>,
      accessor: 'date',
    },
    {
      id: 'duration',
      Header: t('volunteer_portal.admin.tab.user.myevents.individualevent.duration'),
      accessor: 'duration',
    },
    {
      id: 'type',
      Header: t('volunteer_portal.admin.tab.user.myevents.individualevent.type'),
      accessor: 'eventType.title',
    },
    {
      id: 'approval',
      Header: t('volunteer_portal.admin.tab.user.myevents.individualevent.approval'),
      accessor: d => eventStatusIcon(d),
      width: 75,
      style: { textAlign: 'center' },
    },
    {
      id: 'actions',
      Header: t('volunteer_portal.admin.tab.user.myevents.individualevent.actions'),
      accessor: d => d,
      sortable: false,
      width: 180,
      Cell: props => (
        <ActionColumn>
          <TableButton
            isBasic
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
            {t('volunteer_portal.admin.tab.user.myevents.individualevent.edit')}
          </TableButton>
          <TableButton
            isBasic
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
            {t('volunteer_portal.admin.tab.user.myevents.individualevent.clone')}
          </TableButton>
          <TableButton
            isBasic
            isDanger
            onClick={() => {
              setToDelete(props.value)
              setShowDeleteModal(true)
            }}
          >
            {t('volunteer_portal.admin.tab.user.myevents.individualevent.delete')}
          </TableButton>
        </ActionColumn>
      ),
    },
  ]

  return (
    <EventsTable>
      <PersonalHeader>
        <ActionBar>
          <Button
            onClick={() => {
              setIsNew(true)
              setModalEventData()
              setShowCreateEditModal(true)
            }}
          >
            {t('volunteer_portal.admin.tab.user.myevents.individualevent.recordevent')}
          </Button>
        </ActionBar>
        <h1>{t('volunteer_portal.admin.tab.user.myevents.individualevent')}</h1>
        <h4>{t('volunteer_portal.admin.tab.user.myevents.individualevent.message')}</h4>
      </PersonalHeader>
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
      {showCreateEditModal && (
        <Modal
          onClose={() => {
            setShowCreateEditModal(false)
            setModalEventData()
          }}
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
    </EventsTable>
  )
}
export default IndividualEvents
