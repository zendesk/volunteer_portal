import React, { Component } from 'react'
import { compose, graphql } from 'react-apollo'
import { NetworkStatus } from 'apollo-client'
import moment from 'moment'
import R from 'ramda'

import Loading from 'components/LoadingIcon'

import PendingIndividualEventsQuery from './query.gql'
import ApproveIndividualEventMutation from './ApproveIndividualEventMutation.gql'
import RejectIndividualEventMutation from './RejectIndividualEventMutation.gql'

import s from './main.css'

const buildRows = (individualEvents, rejectFn, approveFn) =>
  individualEvents.map(event => (
    <tr key={`individual-event-${event.id}`}>
      <td>{event.user.name}</td>
      <td>{event.description}</td>
      <td>{moment(event.date).format('ll')}</td>
      <td>{event.duration}</td>
      <td>{event.organization.name}</td>
      <td>{event.eventType.title}</td>
      <td className={s.actionColumn}>
        <button className={`${s.btn} ${s.deleteBtn}`} onClick={() => rejectFn(event)}>
          Reject
        </button>
        <button className={`${s.btn} ${s.confirmBtn}`} onClick={() => approveFn(event)}>
          Approve
        </button>
      </td>
    </tr>
  ))

const IndividualEvents = ({
  data: { networkStatus, pendingIndividualEvents },
  approveIndividualEvent,
  rejectIndividualEvent,
}) =>
  networkStatus === NetworkStatus.loading ? (
    <Loading />
  ) : (
    <div>
      <h3>Pending Approval</h3>
      <table className={s.table}>
        <thead>
          <tr>
            <th>User</th>
            <th>Description</th>
            <th>Date</th>
            <th>Duration (min)</th>
            <th>Organization</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{buildRows(pendingIndividualEvents, rejectIndividualEvent, approveIndividualEvent)}</tbody>
      </table>
    </div>
  )

const withData = compose(
  graphql(PendingIndividualEventsQuery, {
    options: {
      fetchPolicy: 'cache-and-network',
    },
  }),
  graphql(ApproveIndividualEventMutation, {
    props: ({ ownProps, mutate }) => ({
      approveIndividualEvent: event =>
        mutate({
          variables: { id: event.id },
          refetchQueries: [{ query: PendingIndividualEventsQuery }],
        }),
    }),
  }),
  graphql(RejectIndividualEventMutation, {
    props: ({ ownProps, mutate }) => ({
      rejectIndividualEvent: event =>
        mutate({
          variables: { id: event.id },
          refetchQueries: [{ query: PendingIndividualEventsQuery }],
        }),
    }),
  })
)

export default withData(IndividualEvents)
