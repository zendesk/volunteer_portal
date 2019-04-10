import React from 'react'
import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'
import R from 'ramda'
import { NetworkStatus } from 'apollo-client'
import moment from 'moment'

import { graphQLError } from 'actions'

import EventForm from './form'

import EventsQuery from './queries/index.gql'
import EventQuery from './queries/show.gql'
import CreateEventMutation from './mutations/create.gql'

import Loading from 'components/LoadingIcon'

const transformToReduxFormState = event => {
  const { title, description, capacity, location, startsAt, endsAt, eventType, office, organization } = event
  return {
    title,
    description,
    location,
    capacity,
    eventType,
    startsAt: new Date(startsAt),
    endsAt: new Date(endsAt),
    office: { id: office.id },
    organization: { id: organization.id },
  }
}

const NewEvent = ({ createEvent, data: { networkStatus, event, eventTypes, offices, organizations } }) =>
  networkStatus === NetworkStatus.loading ? (
    <Loading />
  ) : (
    <EventForm
      event={event && transformToReduxFormState(event)}
      eventTypes={eventTypes}
      offices={offices}
      organizations={organizations}
      onSubmit={createEvent}
    />
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
            const { events } = proxy.readQuery({ query: EventsQuery })
            const withNewEvent = R.append(createEvent, events)
            proxy.writeQuery({ query: EventsQuery, data: { events: withNewEvent } })
          },
        })
          .then(_response => {
            ownProps.history.push('/portal/admin/events')
          })
          .catch(({ graphQLErrors }) => {
            ownProps.graphQLError(graphQLErrors)
          }),
    }),
  })
)

const mapStateToProps = (state, ownProps) => ({})

const withActions = connect(mapStateToProps, {
  graphQLError,
})

export default withActions(withData(NewEvent))
