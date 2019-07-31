import React from 'react'
import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'
import R from 'ramda'

import { graphQLError } from 'actions'

import EventForm from './form'
import Loading from 'components/LoadingIcon'

import EventQuery from './queries/show.gql'
import UpdateEventMutation from './mutations/update.gql'
import DestroySignupMutation from 'mutations/DestroySignupMutation.gql'

const EditEvent = ({ data: { loading, event, eventTypes, offices, organizations }, updateEvent, destroySignup }) =>
  loading ? (
    <Loading />
  ) : (
    <EventForm
      event={event}
      eventTypes={eventTypes}
      offices={offices}
      users={event.users}
      destroySignup={user => destroySignup(event, user)}
      organizations={organizations}
      onSubmit={updateEvent}
    />
  )

const buildOptimisticResponse = event => ({
  __typename: 'Mutation',
  updateEvent: {
    __typename: 'Event',
    ...event,
  },
})

const extractIdFromAssociations = values =>
  R.map(value => {
    if (R.type(value) === 'Object' && R.has('id', value)) {
      return R.pick(['id'], value)
    } else {
      return value
    }
  }, values)

const withData = compose(
  graphql(EventQuery, {
    options: ({ params: { id } }) => ({
      variables: { id },
    }),
  }),
  graphql(UpdateEventMutation, {
    props: ({ ownProps, mutate }) => ({
      updateEvent: event =>
        mutate({
          variables: { input: R.omit(['__typename', 'users'], extractIdFromAssociations(event)) },
          optimisticResponse: buildOptimisticResponse(event),
        })
          .then(_response => {
            ownProps.history.push('/portal/admin/events')
          })
          .catch(({ graphQLErrors }) => {
            ownProps.graphQLError('event', graphQLErrors)
          }),
    }),
  }),
  graphql(DestroySignupMutation, {
    props: ({ mutate }) => ({
      destroySignup: (event, user) =>
        mutate({
          variables: { eventId: event.id, userId: user.id },
          optimisticResponse: {
            __typename: 'Mutation',
            destroySignup: {
              __typename: 'Signup',
              event: R.merge(event, {
                users: R.reject(u => u.id === user.id, event.users),
              }),
            },
          },
        }),
    }),
  })
)

const mapStateToProps = (state, ownProps) => ({})

const withActions = connect(mapStateToProps, {
  graphQLError,
})

export default withActions(withData(EditEvent))
