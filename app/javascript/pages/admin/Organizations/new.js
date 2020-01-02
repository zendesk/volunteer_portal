import React from 'react'
import { graphql } from 'react-apollo'
import { connect } from 'react-redux'
import * as R from 'ramda'

import { graphQLError } from 'actions'

import OrganizationForm from './form'

import OrganizationsQuery from './queries/index.gql'
import CreateOrganizationMutation from './mutations/create.gql'

const NewOrganization = ({ createOrganization }) => <OrganizationForm onSubmit={createOrganization} />

const buildOptimisticResponse = ({ name, timezone }) => ({
  __typename: 'Mutation',
  createOrganization: {
    __typename: 'Organization',
    id: '-1',
    identifier: name.toLowerCase(),
    name,
    timezone,
  },
})

const withData = graphql(CreateOrganizationMutation, {
  props: ({ ownProps, mutate }) => ({
    createOrganization: organization =>
      mutate({
        variables: { input: organization },
        optimisticResponse: buildOptimisticResponse(organization),
        update: (proxy, { data: { createOrganization } }) => {
          const { organizations } = proxy.readQuery({ query: OrganizationsQuery })
          const withNewOrganization = R.append(createOrganization, organizations)
          proxy.writeQuery({ query: OrganizationsQuery, data: { organizations: withNewOrganization } })
        },
      })
        .then(_response => {
          ownProps.router.push('/portal/admin/organizations')
        })
        .catch(({ graphQLErrors }) => {
          ownProps.graphQLError(graphQLErrors)
        }),
  }),
})

const mapStateToProps = (state, ownProps) => ({})

const withActions = connect(
  mapStateToProps,
  {
    graphQLError,
  }
)

export default withActions(withData(NewOrganization))
