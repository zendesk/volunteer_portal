import React from 'react'
import moment from 'moment'
import ReactTable from 'react-table'

import { NoEventsMessage, EventsTable } from './StyledComponents'


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
    <NoEventsMessage>
      Looks like you haven't signed up to any organized events yet. Checkout the calendar to join your first event!
    </NoEventsMessage>
  )
  return (
    <EventsTable>
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
    </EventsTable>
  )
}

export default OrganizedEvents
