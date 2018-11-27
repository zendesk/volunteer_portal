import React from 'react'
import { graphql, compose } from 'react-apollo'
import { NetworkStatus } from 'apollo-client'
import { connect } from 'react-redux'
import R from 'ramda'

import { graphQLError } from 'actions'

import EventForm from './form'
import Loading from 'components/LoadingIcon'

import EventQuery from './queries/show.gql'
import UpdateEventMutation from './mutations/update.gql'

const EditEvent = ({ data: { networkStatus, event, eventTypes, offices, organizations }, updateEvent }) =>
  networkStatus === NetworkStatus.loading ? (
    <Loading />
  ) : (
    <EventForm
      event={event}
      eventTypes={eventTypes}
      offices={offices}
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
          variables: { input: R.omit(['__typename'], extractIdFromAssociations(event)) },
          optimisticResponse: buildOptimisticResponse(event),
        })
          .then(_response => {
            ownProps.history.push('/portal/admin/events')
          })
          .catch(({ graphQLErrors }) => {
            ownProps.graphQLError('event', graphQLErrors)
          }),
    }),
  })
)

const mapStateToProps = (state, ownProps) => ({})

const withActions = connect(mapStateToProps, {
  graphQLError,
})

export default withActions(withData(EditEvent))
