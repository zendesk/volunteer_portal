import React from 'react'
import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'
import { NetworkStatus } from 'apollo-client'
import R from 'ramda'
import ReactTable from 'react-table'
import { Link } from 'react-router'
import Dialog from 'material-ui/Dialog'
import NavigationCheck from 'material-ui/svg-icons/navigation/check'

import { graphQLError, togglePopover } from 'actions'

import Loading from 'components/LoadingIcon'

import UsersQuery from './queries/index.gql'
import DeleteUserMutation from './mutations/delete.gql'

import s from './main.css'

import 'style-loader!css-loader!react-table/react-table.css'

const actionLinks = (user, togglePopover) => (
  <div className={s.actionColumn}>
    <Link to={`/portal/admin/users/${user.id}/edit`}>Edit</Link>
    <button className={s.deleteAction} onClick={() => togglePopover('destroyUser', user)}>
      Delete
    </button>
  </div>
)

const adminIconDimension = {
  height: 18,
  width: 18,
}

const showAdminIcon = user => (user.isAdmin ? <NavigationCheck style={adminIconDimension} /> : <div />)

const columns = togglePopover => [
  {
    Header: 'Name',
    accessor: 'name',
  },
  {
    Header: 'Email',
    accessor: 'email',
    sortable: true,
  },
  {
    Header: 'Admin',
    accessor: 'isAdmin',
    width: 130,
    sortable: true,
    Cell: ({ original }) => showAdminIcon(original),
  },
  {
    Header: 'Actions',
    accessor: 'id',
    sortable: false,
    width: 130,
    Cell: ({ original }) => actionLinks(original, togglePopover),
  },
]

const destroyActions = (togglePopover, destroyUserPopover, deleteOffice) => [
  <button className={`${s.btn} ${s.cancelBtn}`} onClick={() => togglePopover('destroyUser', destroyUserPopover.data)}>
    Cancel
  </button>,
  <button
    className={`${s.btn} ${s.deleteBtn}`}
    onClick={() => deleteOffice(destroyUserPopover.data) && togglePopover('destroyUser')}
  >
    Delete
  </button>,
]

// TODO: most of these are copied from components/v2/Reporting/index.js and should be extracted for shared use
const filterMethod = (filter, row, column) => {
  const id = filter.pivotId || filter.id
  return row[id] !== undefined
    ? String(row[id])
        .toLowerCase()
        .startsWith(filter.value.toLowerCase())
    : true
}

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

const Users = ({ data: { networkStatus, users }, deleteUser, togglePopover, destroyUserPopover }) =>
  networkStatus === NetworkStatus.loading ? (
    <Loading />
  ) : (
    <div>
      <ReactTable
        NoDataComponent={() => null}
        data={users}
        columns={columns(togglePopover)}
        showPagination={false}
        resizable={false}
        defaultPageSize={users.length}
        minRows={0}
        defaultFilterMethod={filterMethod}
        getProps={containerProps}
        getTableProps={tableProps}
        getTheadProps={theadProps}
        getTheadThProps={thProps}
        getTrGroupProps={trProps}
        getTrProps={trProps}
        getTdProps={tdProps}
      />
      {destroyUserPopover ? (
        <Dialog
          title="Delete User"
          actions={destroyActions(togglePopover, destroyUserPopover, deleteUser)}
          modal={false}
          open
          onRequestClose={() => togglePopover('destroyUser', destroyUserPopover.data)}
          actionsContainerStyle={{ paddingBottom: 20 }}
        >
          Are you sure you want to delete {destroyUserPopover.data.name}?
        </Dialog>
      ) : null}
    </div>
  )

const buildOptimisticResponse = user => ({
  __typename: 'Mutation',
  deleteUser: {
    __typename: 'User',
    ...user,
  },
})

const withData = compose(
  graphql(UsersQuery, {}),
  graphql(DeleteUserMutation, {
    props: ({ ownProps, mutate }) => ({
      deleteUser: user =>
        mutate({
          variables: { id: user.id },
          optimisticResponse: buildOptimisticResponse(user),
          update: (proxy, { data: { deleteUser } }) => {
            const { users } = proxy.readQuery({ query: UsersQuery })
            const withUserRemoved = R.reject(user => user.id === deleteUser.id, users)
            proxy.writeQuery({ query: UsersQuery, data: { users: withUserRemoved } })
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
    destroyUserPopover: popover && popover.type === 'destroyUser' ? popover : null,
  }
}

const withActions = connect(mapStateToProps, {
  graphQLError,
  togglePopover,
})

export default withActions(withData(Users))
