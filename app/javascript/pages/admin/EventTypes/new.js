import React from 'react'
import { graphql } from 'react-apollo'
import { connect } from 'react-redux'
import R from 'ramda'

import { graphQLError } from 'actions'

import EventTypeForm from './form'

import EventTypesQuery from './queries/index.gql'
import CreateEventTypeMutation from './mutations/create.gql'

const NewEventType = ({ createEventType }) => <EventTypeForm onSubmit={createEventType} />

const buildOptimisticResponse = ({ title, timezone }) => ({
  __typename: 'Mutation',
  createEventType: {
    __typename: 'EventType',
    id: '-1',
    title,
  },
})

const withData = graphql(CreateEventTypeMutation, {
  props: ({ ownProps, mutate }) => ({
    createEventType: eventType =>
      mutate({
        variables: { input: eventType },
        optimisticResponse: buildOptimisticResponse(eventType),
        update: (proxy, { data: { createEventType } }) => {
          const { eventTypes } = proxy.readQuery({ query: EventTypesQuery })
          const withNewEventType = R.append(createEventType, eventTypes)
          proxy.writeQuery({ query: EventTypesQuery, data: { eventTypes: withNewEventType } })
        },
      })
        .then(_response => {
          ownProps.history.push('/portal/admin/event-types')
        })
        .catch(({ graphQLErrors }) => {
          ownProps.graphQLError(graphQLErrors)
        }),
  }),
})

const mapStateToProps = (state, ownProps) => ({})

const withActions = connect(mapStateToProps, {
  graphQLError,
})

export default withActions(withData(NewEventType))
