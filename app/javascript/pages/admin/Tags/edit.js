import * as R from 'ramda'
import React, { useState } from 'react'

import { useMutation, useQuery } from '@apollo/react-hooks'

import Loading from 'components/LoadingIcon'
import TagForm from './form'
import TagQuery from './queries/show.gql'
import UpdateTagMutation from './mutations/update.gql'

const EditTag = props => {
  const [updateError, setUpdateError] = useState(null)
  const { data, loading, error } = useQuery(TagQuery, {
    variables: { id: props.params.id },
  })
  const [mutate, _] = useMutation(UpdateTagMutation)
  const updateTag = tag => {
    mutate({
      variables: { input: R.omit(['__typename'], tag) },
      optimisticResponse: buildOptimisticResponse(tag),
    })
      .then(_response => {
        props.router.push('/portal/admin/tags')
      })
      .catch(({ graphQLErrors }) => {
        setUpdateError(graphQLErrors)
      })
  }

  if (loading) return <Loading />
  if (error) return <div>Tag Not Found</div>
  return (
    <>
      {updateError && <p>Unable to update the tags</p>}
      <TagForm tag={data.tag} onSubmit={updateTag} />
    </>
  )
}

const buildOptimisticResponse = tag => ({
  __typename: 'Mutation',
  updateTag: {
    __typename: 'tag',
    ...tag,
  },
})

export default EditTag
