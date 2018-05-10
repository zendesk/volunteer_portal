import React from 'react'
import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'
import { NetworkStatus } from 'apollo-client'
import R from 'ramda'
import ReactTable from 'react-table'
import { Link } from 'react-router'
import { filterByOffice } from 'lib/utils'
import moment from 'moment'

import { graphQLError } from 'actions'

import Loading from 'components/LoadingIcon'

import EventsQuery from './queries/index.gql'
import DeleteEventMutation from './mutations/delete.gql'

import s from './main.css'

import 'style-loader!css-loader!react-table/react-table.css'

const actionLinks = (event, deleteEvent) => (
  <div className={s.actionColumn}>
    <Link to={`/portal/admin/events/${event.id}/edit`}>Edit</Link>
    <button className={`${s.deleteAction}`} onClick={() => deleteEvent(event)}>
      Delete
    </button>
  </div>
)

const columns = deleteEvent => [
  {
    Header: 'Title',
    accessor: 'title',
  },
  {
    Header: 'Office',
    accessor: 'office.name',
    sortable: false,
  },
  {
    Header: 'Description',
    accessor: 'description',
    sortable: false,
  },
  {
    Header: 'Start',
    accessor: 'startsAt',
    sortable: false,
    Cell: ({ value }) => moment(value).format('MMM D, h:mm a'),
  },
  {
    Header: 'End',
    accessor: 'endsAt',
    sortable: false,
    Cell: ({ value }) => moment(value).format('MMM D, h:mm a'),
  },
  {
    Header: 'Actions',
    accessor: 'id',
    sortable: false,
    width: 130,
    Cell: ({ original }) => actionLinks(original, deleteEvent),
  },
]

// TODO: most of these are copied from components/v2/Reporting/index.js and should be extracted for shared use
const filterMethod = (filter, row, column) => {
  const id = filter.pivotId || filter.id
  return row[id] !== undefined
    ? String(row[id])
        .toLowerCase()
        .startsWith(filter.value.toLowerCase())
    : true
}

const containerProps = () => ({
  style: {
    border: 'none',
  },
})

const tableProps = () => ({
  style: {
    border: 'none',
  },
})

const theadProps = () => ({
  style: {
    boxShadow: 'none',
  },
})

const thProps = () => ({
  style: {
    border: 'none',
    borderBottom: '2px solid #eee',
    textAlign: 'left',
    padding: '15px 5px',
    boxShadow: 'none',
    fontWeight: 'bold',
  },
})

const trProps = () => ({
  style: {
    border: 'none',
  },
})

const tdProps = () => ({
  style: {
    border: 'none',
    borderBottom: '1px solid #eee',
    padding: 10,
  },
})

const Events = ({ data: { networkStatus, events }, deleteEvent }) =>
  networkStatus === NetworkStatus.loading ? (
    <Loading />
  ) : (
    <div>
      <div className={s.actionBar}>
        <Link to="/portal/admin/events/new">
          <button className={s.createAction}>Add Event</button>
        </Link>
      </div>
      <ReactTable
        NoDataComponent={() => null}
        data={events}
        columns={columns(deleteEvent)}
        showPagination={false}
        defaultPageSize={events.length}
        minRows={0}
        defaultFilterMethod={filterMethod}
        getProps={containerProps}
        getTableProps={tableProps}
        getTheadProps={theadProps}
        getTheadThProps={thProps}
        getTrGroupProps={trProps}
        getTrProps={trProps}
        getTdProps={tdProps}
      />
    </div>
  )

const buildOptimisticResponse = event => ({
  __typename: 'Mutation',
  deleteEvent: {
    __typename: 'Event',
    ...event,
  },
})

const withData = compose(
  graphql(EventsQuery, {}),
  graphql(DeleteEventMutation, {
    props: ({ ownProps, mutate }) => ({
      deleteEvent: event =>
        mutate({
          variables: { id: event.id },
          optimisticResponse: buildOptimisticResponse(event),
          update: (proxy, { data: { deleteEvent } }) => {
            const { events } = proxy.readQuery({ query: EventsQuery })
            const withEventRemoved = R.reject(event => event.id === deleteEvent.id, events)
            proxy.writeQuery({ query: EventsQuery, data: { events: withEventRemoved } })
          },
        }).catch(({ graphQLErrors }) => {
          ownProps.graphQLError(graphQLErrors)
        }),
    }),
  })
)

function mapStateToProps(state, _ownProps) {
  const {
    currentUser,
    events,
    eventTypes,
    offices,
    organizations,
    adminOfficeFilter,
    editEventPopover,
    destroyEventPopover,
  } = state.model

  const filteredEvents = filterByOffice(events, adminOfficeFilter.value)

  return {
    currentUser,
    events: filteredEvents,
    eventTypes,
    offices,
    organizations,
    editEventPopover,
    destroyEventPopover,
  }
}

const withActions = connect(mapStateToProps, {
  graphQLError,
})

export default withActions(withData(Events))
