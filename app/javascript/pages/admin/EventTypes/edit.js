import React from 'react'
import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'
import R from 'ramda'

import { graphQLError } from 'actions'

import EventTypeForm from './form'
import Loading from 'components/LoadingIcon'

import EventTypeQuery from './queries/show.gql'
import UpdateEventTypeMutation from './mutations/update.gql'

const EditEventType = ({ data: { loading, eventType }, updateEventType }) =>
  loading ? <Loading /> : <EventTypeForm eventType={eventType} onSubmit={updateEventType} />

const buildOptimisticResponse = eventType => ({
  __typename: 'Mutation',
  updateEventType: {
    __typename: 'EventType',
    ...eventType,
  },
})

const withData = compose(
  graphql(EventTypeQuery, {
    options: ({ params: { id } }) => ({
      variables: { id },
    }),
  }),
  graphql(UpdateEventTypeMutation, {
    props: ({ ownProps, mutate }) => ({
      updateEventType: eventType =>
        mutate({
          variables: { input: R.omit('__typename', eventType) },
          optimisticResponse: buildOptimisticResponse(eventType),
        })
          .then(_response => {
            ownProps.history.push('/portal/admin/event-types')
          })
          .catch(({ graphQLErrors }) => {
            ownProps.graphQLError('eventType', graphQLErrors)
          }),
    }),
  })
)

const mapStateToProps = (state, ownProps) => ({})

const withActions = connect(mapStateToProps, {
  graphQLError,
})

export default withActions(withData(EditEventType))
