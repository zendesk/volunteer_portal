import React from 'react'
import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'
import { NetworkStatus } from 'apollo-client'
import R from 'ramda'
import ReactTable from 'react-table'
import { Link } from 'react-router'
import Dialog from 'material-ui/Dialog'
import { defaultFilterMethod } from 'lib/utils'

import { graphQLError, togglePopover } from 'actions'

import Loading from 'components/LoadingIcon'

import TagsQuery from './queries/index.gql'
import DeleteTagMutation from './mutations/delete.gql'

import s from './main.css'

import 'style-loader!css-loader!react-table/react-table.css'

const actionLinks = (tag, togglePopover) => (
  <div className={s.actionColumn}>
    <button className={s.deleteAction} onClick={() => togglePopover('destroyTag', tag)}>
      Delete
    </button>
  </div>
)

const columns = togglePopover => [
  {
    Header: 'Tag',
    accessor: 'name',
    filterable: true,
  },
  {
    Header: 'Actions',
    accessor: 'id',
    sortable: false,
    width: 130,
    Cell: ({ original }) => actionLinks(original, togglePopover),
  },
]

const destroyActions = (togglePopover, destroyTagPopover, deleteOffice) => [
  <button className={`${s.btn} ${s.cancelBtn}`} onClick={() => togglePopover('destroyTag', destroyTagPopover.data)}>
    Cancel
  </button>,
  <button
    className={`${s.btn} ${s.deleteBtn}`}
    onClick={() => deleteOffice(destroyTagPopover.data) && togglePopover('destroyTag')}
  >
    Delete
  </button>,
]

const containerProps = () => ({
  style: {
    border: 'none',
  },
})

const tableProps = () => ({
  style: {
    border: 'none',
  },
})

const theadProps = () => ({
  style: {
    boxShadow: 'none',
  },
})

const thProps = () => ({
  style: {
    border: 'none',
    borderBottom: '2px solid #eee',
    textAlign: 'left',
    padding: '15px 5px',
    boxShadow: 'none',
    fontWeight: 'bold',
  },
})

const trProps = () => ({
  style: {
    border: 'none',
  },
})

const tdProps = () => ({
  style: {
    border: 'none',
    borderBottom: '1px solid #eee',
    padding: 10,
  },
})

const Tags = ({ data: { networkStatus, tags }, deleteTag, togglePopover, destroyTagPopover }) =>
  networkStatus === NetworkStatus.loading ? (
    <Loading />
  ) : (
    <div>
      <div className={s.actionBar}>
        <Link to="/portal/admin/tags/new">
          <button className={s.createAction}>Add Tag</button>
        </Link>
      </div>
      <ReactTable
        NoDataComponent={() => null}
        data={tags}
        columns={columns(togglePopover)}
        minRows={0}
        defaultFilterMethod={defaultFilterMethod}
        getProps={containerProps}
        getTableProps={tableProps}
        getTheadProps={theadProps}
        getTheadThProps={thProps}
        getTrGroupProps={trProps}
        getTrProps={trProps}
        getTdProps={tdProps}
      />
      {destroyTagPopover ? (
        <Dialog
          title="Delete Tag"
          actions={destroyActions(togglePopover, destroyTagPopover, deleteTag)}
          modal={false}
          open
          onRequestClose={() => togglePopover('destroyTag', destroyTagPopover.data)}
          actionsContainerStyle={{ paddingBottom: 20 }}
        >
          Are you sure you want to delete {destroyTagPopover.data.title}?
        </Dialog>
      ) : null}
    </div>
  )

const buildOptimisticResponse = tag => ({
  __typename: 'Mutation',
  deleteTag: {
    __typename: 'Tag',
    ...tag,
  },
})

const withData = compose(
  graphql(TagsQuery, {}),
  graphql(DeleteTagMutation, {
    props: ({ ownProps, mutate }) => ({
      deleteTag: tag =>
        mutate({
          variables: { id: tag.id },
          optimisticResponse: buildOptimisticResponse(tag),
          update: (proxy, { data: { deleteTag } }) => {
            const { tags } = proxy.readQuery({ query: TagsQuery })
            const withTagRemoved = R.reject(tag => tag.id === deleteTag.id, tags)
            proxy.writeQuery({ query: TagsQuery, data: { tags: withTagRemoved } })
          },
        }).catch(({ graphQLErrors }) => {
          ownProps.graphQLError(graphQLErrors)
        }),
    }),
  })
)

const mapStateToProps = (state, ownProps) => {
  const { popover } = state.model

  return {
    destroyTagPopover: popover && popover.type === 'destroyTag' ? popover : null,
  }
}

const withActions = connect(
  mapStateToProps,
  {
    graphQLError,
    togglePopover,
  }
)

export default withActions(withData(Tags))
