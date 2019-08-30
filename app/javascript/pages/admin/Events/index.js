import React from 'react'
import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'
import { NetworkStatus } from 'apollo-client'
import R from 'ramda'
import ReactTable from 'react-table'
import { Link } from 'react-router'
import moment from 'moment'
import { defaultFilterMethod } from 'lib/utils'

import { graphQLError } from 'actions'

import Loading from 'components/LoadingIcon'

import EventsQuery from './queries/index.gql'
import DeleteEventMutation from './mutations/delete.gql'

import s from './main.css'

import 'style-loader!css-loader!react-table/react-table.css'

const eventsSort = 'STARTS_AT_DESC'

const actionLinks = (event, deleteEvent) => (
  <div className={s.actionColumn}>
    <Link to={`/portal/admin/events/${event.id}/edit`}>Edit</Link>
    <Link to={`/portal/admin/events/new/${event.id}`}>Clone</Link>
    <button className={`${s.deleteAction}`} onClick={() => deleteEvent(event)}>
      Delete
    </button>
  </div>
)

const columns = deleteEvent => [
  {
    Header: 'Title',
    accessor: 'title',
    sortable: true,
    filterable: true,
  },
  {
    Header: 'Organization',
    accessor: 'organization.name',
    sortable: true,
    filterable: true,
  },
  {
    Header: 'Start',
    accessor: 'startsAt',
    width: 130,
    sortable: true,
    Cell: ({ value }) => <span>{moment(value).format('MMM DD, Y')}</span>,
  },
  {
    id: 'duration',
    Header: 'Duration',
    width: 80,
    accessor: e => {
      let start = moment(e.startsAt)
      let end = moment(e.endsAt)
      let diff = end.diff(start)
      return moment.utc(diff).format('H:mm')
    },
    sortable: true,
  },
  {
    Header: 'Participants',
    accessor: 'signupCount',
    width: 120,
    sortable: true,
  },
  {
    Header: 'Actions',
    accessor: 'id',
    sortable: false,
    width: 150,
    Cell: ({ original }) => actionLinks(original, deleteEvent),
  },
]

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
    borderBottom: '2px solid #eee',
    textAlign: 'left',
    padding: '15px 5px',
    fontWeight: 'bold',
    outlineStyle: 'none',
  },
})

const trProps = () => ({
  style: {
    border: 'none',
  },
})

const tdProps = () => ({
  style: {
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
        defaultFilterMethod={defaultFilterMethod}
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
  graphql(EventsQuery, {
    options: ({ adminOfficeFilter: { value: officeId = 'current' } }) => ({
      variables: {
        officeId: officeId,
        sortBy: eventsSort,
      },
      fetchPolicy: 'cache-and-network',
    }),
  }),

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
    eventTypes,
    offices,
    organizations,
    adminOfficeFilter,
    editEventPopover,
    destroyEventPopover,
  } = state.model

  return {
    currentUser,
    adminOfficeFilter,
    eventTypes,
    offices,
    organizations,
    editEventPopover,
    destroyEventPopover,
  }
}

const withActions = connect(
  mapStateToProps,
  {
    graphQLError,
  }
)

export default withActions(withData(Events))
