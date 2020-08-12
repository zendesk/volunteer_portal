import React from 'react'
import moment from 'moment'
import ReactTable from 'react-table'

import { NoEventsMessage, EventsTable } from './StyledComponents'

import { useTranslation } from 'react-i18next'

const organizedEventsColumns = (t) => [
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
  const { t } = useTranslation() 
  const noOrganizedEventsMessage = (
    <NoEventsMessage>
      {t('volunteer_portal.admin.tab.user.myevents.organizedevents.noevents')}
    </NoEventsMessage>
  )
  return (
    <EventsTable>
      <h1>{t('volunteer_portal.admin.tab.user.myevents.organizedevents')}</h1>
      <h4>{t('volunteer_portal.admin.tab.user.myevents.organizedevents.description')}</h4>
      {signups.length === 0 ? (
        noOrganizedEventsMessage
      ) : (
        <ReactTable
          NoDataComponent={() => null}
          data={signups.map(signup => signup.event)}
          columns={organizedEventsColumns(t)}
          defaultPageSize={10}
          defaultSorted={[{ id: 'date', desc: true }]}
          minRows={0}
        />
      )}
    </EventsTable>
  )
}

export default OrganizedEvents

