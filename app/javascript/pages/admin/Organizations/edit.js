import React from 'react'
import { graphql, compose } from 'react-apollo'
import { NetworkStatus } from 'apollo-client'
import { connect } from 'react-redux'
import R from 'ramda'

import { graphQLError } from 'actions'

import OrganizationForm from './form'
import Loading from 'components/LoadingIcon'

import OrganizationQuery from './queries/show.gql'
import UpdateOrganizationMutation from './mutations/update.gql'

const EditOrganization = ({ data: { networkStatus, organization }, updateOrganization }) =>
  networkStatus === NetworkStatus.loading ? (
    <Loading />
  ) : (
    <OrganizationForm organization={organization} onSubmit={updateOrganization} />
  )

const buildOptimisticResponse = organization => ({
  __typename: 'Mutation',
  updateOrganization: {
    __typename: 'Organization',
    ...organization,
  },
})

const withData = compose(
  graphql(OrganizationQuery, {
    options: ({ params: { id } }) => ({
      variables: { id },
    }),
  }),
  graphql(UpdateOrganizationMutation, {
    props: ({ ownProps, mutate }) => ({
      updateOrganization: organization =>
        mutate({
          variables: { input: R.omit(['identifier', '__typename'], organization) },
          optimisticResponse: buildOptimisticResponse(organization),
        })
          .then(_response => {
            ownProps.history.push('/portal/admin/organizations')
          })
          .catch(({ graphQLErrors }) => {
            ownProps.graphQLError('organization', graphQLErrors)
          }),
    }),
  })
)

const mapStateToProps = (state, ownProps) => ({})

const withActions = connect(mapStateToProps, {
  graphQLError,
})

export default withActions(withData(EditOrganization))
