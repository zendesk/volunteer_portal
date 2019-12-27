import React from 'react'
import { graphql } from 'react-apollo'
import { connect } from 'react-redux'
import R from 'ramda'

import { graphQLError } from 'actions'

import TagForm from './form'

import TagsQuery from './queries/index.gql'
import CreateTagMutation from './mutations/create.gql'

const NewTag = ({ createTag }) => <TagForm onSubmit={createTag} />

const buildOptimisticResponse = ({ name, timezone }) => ({
  __typename: 'Mutation',
  createTag: {
    __typename: 'Tag',
    id: '-1',
    name,
  },
})

const withData = graphql(CreateTagMutation, {
  props: ({ ownProps, mutate }) => ({
    createTag: tag =>
      mutate({
        variables: { input: tag },
        optimisticResponse: buildOptimisticResponse(tag),
        update: (proxy, { data: { createTag } }) => {
          const { tags } = proxy.readQuery({ query: TagsQuery })
          const withNewTag = R.append(createTag, tags)
          proxy.writeQuery({ query: TagsQuery, data: { tags: withNewTag } })
        },
      })
        .then(_response => {
          ownProps.router.push('/portal/admin/tags')
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

export default withActions(withData(NewTag))
