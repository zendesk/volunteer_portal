import React from 'react'
import { graphql } from 'react-apollo'
import { connect } from 'react-redux'
import R from 'ramda'

import { graphQLError } from 'actions'

import OfficeForm from './form'

import OfficesQuery from './queries/index.gql'
import CreateOfficeMutation from './mutations/create.gql'

const NewOffice = ({ createOffice }) => <OfficeForm onSubmit={createOffice} />

const buildOptimisticResponse = ({ name, timezone }) => ({
  __typename: 'Mutation',
  createOffice: {
    __typename: 'Office',
    id: '-1',
    identifier: name.toLowerCase(),
    name,
    timezone,
  },
})

const withData = graphql(CreateOfficeMutation, {
  props: ({ ownProps, mutate }) => ({
    createOffice: office =>
      mutate({
        variables: { input: office },
        optimisticResponse: buildOptimisticResponse(office),
        update: (proxy, { data: { createOffice } }) => {
          const { offices } = proxy.readQuery({ query: OfficesQuery })
          const withNewOffice = R.append(createOffice, offices)
          proxy.writeQuery({ query: OfficesQuery, data: { offices: withNewOffice } })
        },
      })
        .then(_response => {
          ownProps.history.push('/portal/admin/offices')
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

export default withActions(withData(NewOffice))
