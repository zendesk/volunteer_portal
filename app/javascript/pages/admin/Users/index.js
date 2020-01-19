import React from 'react'
import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'
import { NetworkStatus } from 'apollo-client'
import * as R from 'ramda'
import ReactTable from 'react-table'
import { Link } from 'react-router'
import Dialog from 'material-ui/Dialog'
import { defaultFilterMethod } from 'lib/utils'

import { graphQLError, togglePopover } from 'actions'

import Loading from 'components/LoadingIcon'

import UsersQuery from './queries/index.gql'
import DeleteUserMutation from './mutations/delete.gql'

import s from './main.css'

import 'style-loader!css-loader!react-table/react-table.css'

import { withNamespaces } from 'react-i18next'

const actionLinks = (user, togglePopover, t) => (
  <div className={s.actionColumn}>
    <Link to={`/portal/admin/users/${user.id}/edit`}>{t('volunteer_portal.admin.tab.users_edit')}</Link>
    <button className={s.deleteAction} onClick={() => togglePopover('destroyUser', user)}>
      {t('volunteer_portal.admin.tab.users_delete')}
    </button>
  </div>
)

const columns = (togglePopover, t) => [
  {
    Header: t('volunteer_portal.admin.tab.users_name'),
    accessor: 'name',
    filterable: true,
  },
  {
    Header: t('volunteer_portal.admin.tab.users_email'),
    accessor: 'email',
    filterable: true,
  },
  {
    Header: t('volunteer_portal.admin.tab.users_group'),
    accessor: 'group',
    sortable: false,
  },
  {
    Header: t('volunteer_portal.admin.tab.users_actions'),
    accessor: 'id',
    sortable: false,
    width: 130,
    Cell: ({ original }) => actionLinks(original, togglePopover, t),
  },
]

const destroyActions = (togglePopover, destroyUserPopover, deleteOffice, t) => [
  <button className={`${s.btn} ${s.cancelBtn}`} onClick={() => togglePopover('destroyUser', destroyUserPopover.data)}>
    {t('volunteer_portal.admin.tab.users_delete.cancel')}
  </button>,
  <button
    className={`${s.btn} ${s.deleteBtn}`}
    onClick={() => deleteOffice(destroyUserPopover.data) && togglePopover('destroyUser')}
  >
    {t('volunteer_portal.admin.tab.users_delete.delete')}
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

const Users = ({ data: { networkStatus, users }, deleteUser, togglePopover, destroyUserPopover, t }) =>
  networkStatus === NetworkStatus.loading ? (
    <Loading />
  ) : (
    <div>
      <ReactTable
        NoDataComponent={() => null}
        data={users}
        columns={columns(togglePopover, t)}
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
      {destroyUserPopover ? (
        <Dialog
          title={t('volunteer_portal.admin.tab.users_delete_user')}
          actions={destroyActions(togglePopover, destroyUserPopover, deleteUser, t)}
          modal={false}
          open
          onRequestClose={() => togglePopover('destroyUser', destroyUserPopover.data)}
          actionsContainerStyle={{ paddingBottom: 20 }}
        >
          {t('volunteer_portal.admin.tab.user.delete.confirmation', { user: destroyUserPopover.data.name })}
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

const withActions = connect(
  mapStateToProps,
  {
    graphQLError,
    togglePopover,
  }
)

export default withActions(withData(withNamespaces()(Users)))
