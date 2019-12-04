import React from 'react'
import { graphql, compose } from 'react-apollo'
import { NetworkStatus } from 'apollo-client'
import { connect } from 'react-redux'
import R from 'ramda'

import { graphQLError } from 'actions'

import OfficeForm from './form'
import Loading from 'components/LoadingIcon'

import OfficeQuery from './queries/show.gql'
import UpdateOfficeMutation from './mutations/update.gql'

const EditOffice = ({ data: { networkStatus, office }, updateOffice }) =>
  networkStatus === NetworkStatus.loading ? <Loading /> : <OfficeForm office={office} onSubmit={updateOffice} />

const buildOptimisticResponse = office => ({
  __typename: 'Mutation',
  updateOffice: {
    __typename: 'Office',
    ...office,
  },
})

const withData = compose(
  graphql(OfficeQuery, {
    options: ({ params: { id } }) => ({
      variables: { id },
    }),
  }),
  graphql(UpdateOfficeMutation, {
    props: ({ ownProps, mutate }) => ({
      updateOffice: office =>
        mutate({
          variables: { input: R.omit(['identifier', '__typename'], office) },
          optimisticResponse: buildOptimisticResponse(office),
        })
          .then(_response => {
            ownProps.router.push('/portal/admin/offices')
          })
          .catch(({ graphQLErrors }) => {
            ownProps.graphQLError('office', graphQLErrors)
          }),
    }),
  })
)

const mapStateToProps = (state, ownProps) => ({})

const withActions = connect(
  mapStateToProps,
  {
    graphQLError,
  }
)

export default withActions(withData(EditOffice))
