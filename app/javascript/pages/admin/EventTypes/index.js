import React from 'react'
import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'
import { NetworkStatus } from 'apollo-client'
import * as R from 'ramda'
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

import { withTranslation } from 'react-i18next'

const actionLinks = (eventType, togglePopover, t) => (
  <div className={s.actionColumn}>
    <Link to={`/portal/admin/event-types/${eventType.id}/edit`}>{t('volunteer_portal.admin.tab.eventtypes_edit')}</Link>
    <button className={s.deleteAction} onClick={() => togglePopover('destroyEventType', eventType)}>
      {t('volunteer_portal.admin.tab.eventtypes_delete')}
    </button>
  </div>
)

const columns = (togglePopover, t) => [
  {
    Header: t('volunteer_portal.admin.tab.eventtypes_title'),
    accessor: 'title',
    filterable: true,
  },
  {
    Header: t('volunteer_portal.admin.tab.eventtypes_actions'),
    accessor: 'id',
    sortable: false,
    width: 130,
    Cell: ({ original }) => actionLinks(original, togglePopover, t),
  },
]

const destroyActions = (togglePopover, destroyEventTypePopover, deleteOffice, t) => [
  <button
    className={`${s.btn} ${s.cancelBtn}`}
    onClick={() => togglePopover('destroyEventType', destroyEventTypePopover.data)}
  >
    {t('volunteer_portal.admin.tab.eventtypes_cancel')}
  </button>,
  <button
    className={`${s.btn} ${s.deleteBtn}`}
    onClick={() => deleteOffice(destroyEventTypePopover.data) && togglePopover('destroyEventType')}
  >
    {t('volunteer_portal.admin.tab.eventtypes_delete')}
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

const EventTypes = ({
  data: { networkStatus, eventTypes },
  t,
  deleteEventType,
  togglePopover,
  destroyEventTypePopover,
}) =>
  networkStatus === NetworkStatus.loading ? (
    <Loading />
  ) : (
    <div>
      <div className={s.actionBar}>
        <Link to="/portal/admin/event-types/new">
          <button className={s.createAction}>{t('volunteer_portal.admin.tab.eventtypes_addeventtype')}</button>
        </Link>
      </div>
      <ReactTable
        NoDataComponent={() => null}
        data={eventTypes}
        columns={columns(togglePopover, t)}
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
          title={t('volunteer_portal.admin.tab.eventtypes_deleteeventtype')}
          actions={destroyActions(togglePopover, destroyEventTypePopover, deleteEventType, t)}
          modal={false}
          open
          onRequestClose={() => togglePopover('destroyEventType', destroyEventTypePopover.data)}
          actionsContainerStyle={{ paddingBottom: 20 }}
        >
          {t('volunteer_portal.admin.tab.eventtypes_deleteeventtypeconfirmation')} {destroyEventTypePopover.data.title}?
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

export default withActions(withData(withTranslation()(EventTypes)))
