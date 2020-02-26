import React, { useContext, useCallback } from 'react'
import * as R from 'ramda'
import ReactTable from 'react-table'
import moment from 'moment'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { defaultFilterMethod } from 'lib/utils'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { Button } from '@zendeskgarden/react-buttons'

import Loading from 'components/LoadingIcon'
import OfficeFilter from '/components/OfficeFilter'
import FilterGroup from 'components/FilterGroup'

import EventsQuery from './queries/index.gql'
import DeleteEventMutation from './mutations/delete.gql'
import { withTranslation } from 'react-i18next'
import { FilterContext, officeFilterValueLens } from '/context'

import s from './main.css'

import 'style-loader!css-loader!react-table/react-table.css'

const eventsSort = 'STARTS_AT_DESC'

const ActionLinks = withTranslation()(({ event, deleteEvent, t }) => (
  <div className={s.actionColumn}>
    <Link to={`/portal/admin/events/${event.id}/edit`}>{t('volunteer_portal.admin.tab.events_editevent')}</Link>
    <Link to={`/portal/admin/events/new/${event.id}`}>{t('volunteer_portal.admin.tab.events_cloneevent')}</Link>
    <button className={`${s.deleteAction}`} onClick={() => deleteEvent(event)}>
      {t('volunteer_portal.admin.tab.events_deleteevent')}
    </button>
  </div>
))

const columns = (deleteEvent, t) => [
  {
    Header: t('volunteer_portal.admin.tab.events_columntitle'),
    accessor: 'title',
    sortable: true,
    filterable: true,
  },
  {
    Header: t('volunteer_portal.admin.tab.events_columnorganization'),
    accessor: 'organization.name',
    sortable: true,
    filterable: true,
  },
  {
    Header: t('volunteer_portal.admin.tab.events_columnstart'),
    accessor: 'startsAt',
    width: 130,
    sortable: true,
    Cell: ({ value }) => <span>{moment(value).format('MMM DD, Y')}</span>,
  },
  {
    id: 'duration',
    Header: t('volunteer_portal.admin.tab.events_columnduration'),
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
    Header: t('volunteer_portal.admin.tab.events_columnparticipants'),
    accessor: 'signupCount',
    width: 120,
    sortable: true,
  },
  {
    Header: t('volunteer_portal.admin.tab.events_columnactions'),
    accessor: 'id',
    sortable: false,
    width: 150,
    Cell: ({ original }) => <ActionLinks event={original} deleteEvent={deleteEvent} />,
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

const Events = ({ t }) => {
  const { filters } = useContext(FilterContext)
  const queryVars = {
    officeId: R.view(officeFilterValueLens, filters),
    sortBy: eventsSort,
  }
  const { data, loading, error } = useQuery(EventsQuery, {
    variables: queryVars,
  })

  const [deleteEvent] = useMutation(DeleteEventMutation, {
    update: (cache, { data: { deleteEvent } }) => {
      const queryParams = {
        query: EventsQuery,
        variables: queryVars,
      }
      const data = cache.readQuery(queryParams)
      const withEventRemoved = R.reject(event => event.id === deleteEvent.id, data.events)
      cache.writeQuery({
        ...queryParams,
        data: { ...data, events: withEventRemoved },
      })
    },
  })

  const onDeleteEvent = event =>
    deleteEvent({
      optimisticResponse: buildOptimisticResponse(event),
      variables: { id: event.id },
    })

  if (loading) return <Loading />

  if (error) console.log(error.graphQLErrors)

  const events = R.propOr([], 'events', data)

  return (
    <div>
      <FilterGroup>
        <OfficeFilter />

        <Link to="/portal/admin/events/new">
          <Button>{t('volunteer_portal.admin.tab.events_addevent')}</Button>
        </Link>
      </FilterGroup>
      <ReactTable
        NoDataComponent={() => null}
        data={events}
        columns={columns(onDeleteEvent, t)}
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
}

const buildOptimisticResponse = event => ({
  __typename: 'Mutation',
  deleteEvent: {
    __typename: 'Event',
    ...event,
  },
})

function mapStateToProps(state, _ownProps) {
  const { eventTypes, editEventPopover, destroyEventPopover } = state.model

  return {
    eventTypes,
    editEventPopover,
    destroyEventPopover,
  }
}

const withActions = connect(mapStateToProps)

export default withActions(withTranslation()(Events))
