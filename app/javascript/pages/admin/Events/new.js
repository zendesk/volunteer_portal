import React from 'react'
import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'
import * as R from 'ramda'
import { NetworkStatus } from 'apollo-client'
import moment from 'moment'

import { graphQLError, changeAdminOfficeFilter } from 'actions'

import EventForm from './form'

import EventsQuery from './queries/index.gql'
import EventQuery from './queries/show.gql'
import CreateEventMutation from './mutations/create.gql'

import Loading from 'components/LoadingIcon'

const eventsSort = 'STARTS_AT_DESC'

const transformToReduxFormState = event => {
  const { title, description, capacity, location, startsAt, endsAt, eventType, office, organization } = event
  return {
    title,
    description,
    location,
    capacity,
    startsAt: new Date(startsAt),
    endsAt: new Date(endsAt),
    eventType: { id: eventType.id },
    office: { id: office.id },
    organization: { id: organization.id },
  }
}

const NewEvent = ({ createEvent, data: { networkStatus, event, eventTypes, tags, offices, organizations } }) =>
  networkStatus === NetworkStatus.loading ? (
    <Loading />
  ) : (
    console.log(eventTypes, tags) || (
      <EventForm
        event={event && transformToReduxFormState(event)}
        eventTypes={eventTypes}
        tags={tags}
        offices={offices}
        organizations={organizations}
        onSubmit={createEvent}
      />
    )
  )

const buildOptimisticResponse = ({
  title,
  description,
  eventType,
  organization,
  office,
  location,
  date,
  startsAt,
  endsAt,
  capacity,
}) => ({
  __typename: 'Mutation',
  createEvent: {
    __typename: 'Event',
    id: '-1',
    title,
    description,
    eventType,
    organization,
    office,
    location,
    date,
    startsAt,
    endsAt,
    capacity,
    duration: moment(endsAt).diff(startsAt, 'minutes'),
  },
})

const withData = compose(
  graphql(EventQuery, {
    options: ({ params: { id } }) => ({
      variables: {
        id: id || '-1',
      },
    }),
  }),
  graphql(CreateEventMutation, {
    props: ({ ownProps, mutate }) => ({
      createEvent: event =>
        mutate({
          variables: { input: event },
          optimisticResponse: buildOptimisticResponse(event),
          update: (proxy, { data: { createEvent } }) => {
            try {
              const queryParams = {
                query: EventsQuery,
                variables: {
                  officeId: event.office.id || 'current',
                  sortBy: eventsSort,
                },
              }

              const data = proxy.readQuery(queryParams)
              const withNewEvent = R.append(createEvent, data.events)
              proxy.writeQuery({
                ...queryParams,
                data: { ...data, events: withNewEvent },
              })
            } catch {}
          },
        })
          .then(_response => {
            ownProps.changeAdminOfficeFilter(event.office.id)
            ownProps.router.push('/portal/admin/events')
          })
          .catch(a => {
            console.log('new', a)

            ownProps.graphQLError(a.graphQLErrors)
          }),
    }),
  })
)

const mapStateToProps = (state, ownProps) => ({})

const withActions = connect(
  mapStateToProps,
  {
    graphQLError,
    changeAdminOfficeFilter,
  }
)

export default withActions(withData(NewEvent))
