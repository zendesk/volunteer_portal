import React from 'react'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import * as R from 'ramda'
import moment from 'moment'

import { togglePopover } from 'actions'

import Layout from 'components/Layout'
import Loading from 'components/LoadingIcon'

import MyEventsQuery from './query.gql'
import CreateEditIndividualEventMutation from 'mutations/CreateEditIndividualEventMutation.gql'
import DeleteIndividualEventMutation from 'mutations/DeleteIndividualEventMutation.gql'

import IndividualEvents from './IndividualEvents'
import OrganizedEvents from './OrganizedEvents'

const MyEvents = props => {
  const { data, locationBeforeTransitions } = props

  const { currentUser } = data

  if (data.loading) {
    return <Loading />
  } else if (data.error) {
    console.error(data.error)
    return <div>Sorry, we are having trouble loading your events.</div>
  } else {
    return (
      <Layout currentPath={locationBeforeTransitions.pathname}>
        <IndividualEvents {...props} />
        <OrganizedEvents currentUser={currentUser} />
      </Layout>
    )
  }
}

const mapStateToProps = (state, _ownProps) => {
  const { popover } = state.model
  const { locationBeforeTransitions } = state.routing
  const props = {
    popover,
    locationBeforeTransitions,
  }

  return R.isNil(popover) ? props : R.merge({ initialValues: popover.data }, props)
}

const individualEventInputToOptimisticResponse = (data, input) => {
  return {
    __typename: 'IndividualEvent',
    id: input.id || -1,
    description: input.description,
    office: R.find(office => office.id === input.officeId, data.offices),
    date: moment(input.date),
    duration: input.duration,
    eventType: R.find(et => et.id === input.eventTypeId, data.eventTypes),
    tags: R.filter(tag => R.includes(R.pick(['id'], tag), input.tags), data.tags),
    organization: R.find(org => org.id === input.organizationId, data.organizations),
    status: 'PENDING',
  }
}

const buildOptimisticResponse = (newEvent, currentUser) => {
  const { id: currentUserId, individualEvents: existingEvents } = currentUser
  const arrIdx = R.find(R.propEq('id', newEvent.id), existingEvents)
  const individualEvents = R.isNil(arrIdx)
    ? R.append(newEvent, existingEvents)
    : R.update(arrIdx, newEvent, existingEvents)

  return {
    __typename: 'Mutation',
    createEditIndividualEvent: {
      __typename: 'User',
      id: currentUserId,
      individualEvents,
    },
  }
}

const withData = compose(
  graphql(MyEventsQuery, {
    options: {
      fetchPolicy: 'cache-and-network',
    },
  }),
  graphql(CreateEditIndividualEventMutation, {
    props: ({ ownProps, mutate }) => ({
      createEditIndividualEvent: data => {
        const currentUser = ownProps.data.currentUser
        const individualEventInput = data
        const newEvent = individualEventInputToOptimisticResponse(ownProps.data, individualEventInput)

        return mutate({
          variables: { input: individualEventInput },
          optimisticResponse: buildOptimisticResponse(newEvent, currentUser),
        })
      },
    }),
  }),
  graphql(DeleteIndividualEventMutation, {
    props: ({ ownProps, mutate }) => ({
      deleteIndividualEvent: id => {
        const currentUser = ownProps.data.currentUser

        return mutate({
          variables: { input: { id } },
          optimisticResponse: {
            __typename: 'Mutation',
            deleteIndividualEvent: {
              __typename: 'User',
              id: currentUser.id,
              individualEvents: R.reject(ie => ie.id === currentUser.id, currentUser.individualEvents),
            },
          },
        })
      },
    }),
  })
)

const withActions = connect(mapStateToProps, {
  togglePopover,
})

export default withActions(withData(MyEvents))
