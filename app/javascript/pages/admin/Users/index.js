import React, { useContext, useState } from 'react'
import * as R from 'ramda'
import ReactTable from 'react-table'
import Dialog from 'material-ui/Dialog'
import { Link } from 'react-router'
import { withTranslation } from 'react-i18next'
import { defaultFilterMethod } from 'lib/utils'
import { useQuery, useMutation } from '@apollo/react-hooks'

import Loading from 'components/LoadingIcon'
import OfficeFilter from '/components/OfficeFilter'
import FilterGroup from 'components/FilterGroup'
import { FilterContext, officeFilterValueLens } from '/context'

import UsersQuery from './queries/index.gql'
import DeleteUserMutation from './mutations/delete.gql'

import s from './main.css'
import 'style-loader!css-loader!react-table/react-table.css'

const actionLinks = (user, openDeleteModal, t) => (
  <div className={s.actionColumn}>
    <Link to={`/portal/admin/users/${user.id}/edit`}>{t('volunteer_portal.admin.tab.users_edit')}</Link>
    <button className={s.deleteAction} onClick={() => openDeleteModal(user)}>
      {t('volunteer_portal.admin.tab.users_delete')}
    </button>
  </div>
)

const columns = (openDeleteModal, t) => [
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
    Cell: ({ original }) => actionLinks(original, openDeleteModal, t),
  },
]

const destroyActions = (user, closeModal, deleteUser, t) => {
  return [
    <button className={`${s.btn} ${s.cancelBtn}`} onClick={closeModal}>
      {t('volunteer_portal.admin.tab.users_delete_cancel')}
    </button>,
    <button
      className={`${s.btn} ${s.deleteBtn}`}
      onClick={() => {
        deleteUser(user)
        closeModal()
      }}
    >
      {t('volunteer_portal.admin.tab.users_delete_delete')}
    </button>,
  ]
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

const Users = ({ t }) => {
  const [userToDelete, setUserToDelete] = useState(null)
  const { filters } = useContext(FilterContext)

  const queryVars = {
    officeId: R.view(officeFilterValueLens, filters),
  }

  const { data, error, loading } = useQuery(UsersQuery, { variables: queryVars })

  const [deleteUser] = useMutation(DeleteUserMutation, {
    update: (cache, { data: { deleteUser } }) => {
      const queryParams = {
        query: UsersQuery,
        variables: queryVars,
      }
      const data = cache.readQuery(queryParams)
      const withUserRemoved = R.reject(user => user.id === deleteUser.id, data.users)
      cache.writeQuery({
        ...queryParams,
        data: { ...data, users: withUserRemoved },
      })
    },
  })

  const onDeleteUser = user =>
    deleteUser({
      optimisticResponse: buildOptimisticResponse(user),
      variables: { id: user.id },
    })

  if (loading) return <Loading />
  if (error) return console.log(error.graphQLErrors)

  const users = R.propOr([], 'users', data)
  const closeDeleteModal = () => setUserToDelete(null)
  const openDeleteModal = user => setUserToDelete(user)

  return (
    <div>
      <FilterGroup>
        <OfficeFilter />
      </FilterGroup>
      <ReactTable
        NoDataComponent={() => null}
        data={users}
        columns={columns(openDeleteModal, t)}
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
      {userToDelete && (
        <Dialog
          title={t('volunteer_portal.admin.tab.users_delete_user')}
          actions={destroyActions(userToDelete, closeDeleteModal, onDeleteUser, t)}
          modal={false}
          open
          onRequestClose={closeDeleteModal}
          actionsContainerStyle={{ paddingBottom: 20 }}
        >
          {t('volunteer_portal.admin.tab.user.delete.confirmation', { user: userToDelete.name })}
        </Dialog>
      )}
    </div>
  )
}

const buildOptimisticResponse = user => ({
  __typename: 'Mutation',
  deleteUser: {
    __typename: 'User',
    ...user,
  },
})

export default withTranslation()(Users)
