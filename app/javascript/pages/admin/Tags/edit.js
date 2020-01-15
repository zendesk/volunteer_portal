import React from 'react'
import { graphql, compose } from 'react-apollo'
import { NetworkStatus } from 'apollo-client'
import { connect } from 'react-redux'
import * as R from 'ramda'

import { graphQLError } from 'actions'

import TagForm from './form'
import Loading from 'components/LoadingIcon'

import TagQuery from './queries/show.gql'
import UpdateTagMutation from './mutations/update.gql'

const EditTag = ({ data: { networkStatus, tag }, updateTag }) =>
  networkStatus === NetworkStatus.loading ? <Loading /> : <TagForm tag={tag} onSubmit={updateTag} />

const buildOptimisticResponse = tag => ({
  __typename: 'Mutation',
  updateTag: {
    __typename: 'tag',
    ...tag,
  },
})

const withData = compose(
  graphql(TagQuery, {
    options: ({ params: { id } }) => ({
      variables: { id },
    }),
  }),
  graphql(UpdateTagMutation, {
    props: ({ ownProps, mutate }) => ({
      updateTag: tag =>
        mutate({
          variables: { input: R.omit(['__typename'], tag) },
          optimisticResponse: buildOptimisticResponse(tag),
        })
          .then(_response => {
            ownProps.router.push('/portal/admin/tags')
          })
          .catch(({ graphQLErrors }) => {
            ownProps.graphQLError('tag', graphQLErrors)
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

export default withActions(withData(EditTag))
