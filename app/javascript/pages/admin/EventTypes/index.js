import React from 'react'
import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'
import { NetworkStatus } from 'apollo-client'
import R from 'ramda'
import ReactTable from 'react-table'
import { Link } from 'react-router'
import Dialog from 'material-ui/Dialog'
import { defaultFilterMethod } from 'lib/utils'

import { graphQLError, togglePopover } from 'actions'

import Loading from 'components/LoadingIcon'

import EventTypesQuery from './queries/index.gql'
import DeleteEventTypeMutation from './mutations/delete.gql'

import s from './main.css'

import 'style-loader!css-loader!react-table/react-table.css'

const actionLinks = (eventType, togglePopover) => (
  <div className={s.actionColumn}>
    <Link to={`/portal/admin/event-types/${eventType.id}/edit`}>Edit</Link>
    <button className={s.deleteAction} onClick={() => togglePopover('destroyEventType', eventType)}>
      Delete
    </button>
  </div>
)

const columns = togglePopover => [
  {
    Header: 'Title',
    accessor: 'title',
    filterable: true,
  },
  {
    Header: 'Actions',
    accessor: 'id',
    sortable: false,
    width: 130,
    Cell: ({ original }) => actionLinks(original, togglePopover),
  },
]

const destroyActions = (togglePopover, destroyEventTypePopover, deleteOffice) => [
  <button
    className={`${s.btn} ${s.cancelBtn}`}
    onClick={() => togglePopover('destroyEventType', destroyEventTypePopover.data)}
  >
    Cancel
  </button>,
  <button
    className={`${s.btn} ${s.deleteBtn}`}
    onClick={() => deleteOffice(destroyEventTypePopover.data) && togglePopover('destroyEventType')}
  >
    Delete
  </button>,
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

const EventTypes = ({ data: { networkStatus, eventTypes }, deleteEventType, togglePopover, destroyEventTypePopover }) =>
  networkStatus === NetworkStatus.loading ? (
    <Loading />
  ) : (
    <div>
      <div className={s.actionBar}>
        <Link to="/portal/admin/event-types/new">
          <button className={s.createAction}>Add Event Type</button>
        </Link>
      </div>
      <ReactTable
        NoDataComponent={() => null}
        data={eventTypes}
        columns={columns(togglePopover)}
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
      {destroyEventTypePopover ? (
        <Dialog
          title="Delete Event Type"
          actions={destroyActions(togglePopover, destroyEventTypePopover, deleteEventType)}
          modal={false}
          open
          onRequestClose={() => togglePopover('destroyEventType', destroyEventTypePopover.data)}
          actionsContainerStyle={{ paddingBottom: 20 }}
        >
          Are you sure you want to delete {destroyEventTypePopover.data.title}?
        </Dialog>
      ) : null}
    </div>
  )

const buildOptimisticResponse = eventType => ({
  __typename: 'Mutation',
  deleteEventType: {
    __typename: 'EventType',
    ...eventType,
  },
})

const withData = compose(
  graphql(EventTypesQuery, {}),
  graphql(DeleteEventTypeMutation, {
    props: ({ ownProps, mutate }) => ({
      deleteEventType: eventType =>
        mutate({
          variables: { id: eventType.id },
          optimisticResponse: buildOptimisticResponse(eventType),
          update: (proxy, { data: { deleteEventType } }) => {
            const { eventTypes } = proxy.readQuery({ query: EventTypesQuery })
            const withEventTypeRemoved = R.reject(eventType => eventType.id === deleteEventType.id, eventTypes)
            proxy.writeQuery({ query: EventTypesQuery, data: { eventTypes: withEventTypeRemoved } })
          },
        }).catch(({ graphQLErrors }) => {
          ownProps.graphQLError(graphQLErrors)
        }),
    }),
  })
)

const mapStateToProps = (state, ownProps) => {
  const { popover } = state.model

  return {
    destroyEventTypePopover: popover && popover.type === 'destroyEventType' ? popover : null,
  }
}

const withActions = connect(
  mapStateToProps,
  {
    graphQLError,
    togglePopover,
  }
)

export default withActions(withData(EventTypes))
