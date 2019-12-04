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

import OrganizationsQuery from './queries/index.gql'
import DeleteOrganizationMutation from './mutations/delete.gql'

import s from './main.css'

import 'style-loader!css-loader!react-table/react-table.css'

const actionLinks = (organization, togglePopover) => (
  <div className={s.actionColumn}>
    <Link to={`/portal/admin/organizations/${organization.id}/edit`}>Edit</Link>
    <button className={s.deleteAction} onClick={() => togglePopover('destroyOrganization', organization)}>
      Delete
    </button>
  </div>
)

const columns = togglePopover => [
  {
    Header: 'Name',
    accessor: 'name',
    filterable: true,
  },
  {
    Header: 'Location',
    accessor: 'location',
    sortable: false,
  },
  {
    Header: 'Actions',
    accessor: 'id',
    sortable: false,
    width: 130,
    Cell: ({ original }) => actionLinks(original, togglePopover),
  },
]

const destroyActions = (togglePopover, destroyOrganizationPopover, deleteOffice) => [
  <button
    className={`${s.btn} ${s.cancelBtn}`}
    onClick={() => togglePopover('destroyOrganization', destroyOrganizationPopover.data)}
  >
    Cancel
  </button>,
  <button
    className={`${s.btn} ${s.deleteBtn}`}
    onClick={() => deleteOffice(destroyOrganizationPopover.data) && togglePopover('destroyOrganization')}
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

const Organizations = ({
  data: { networkStatus, organizations },
  deleteOrganization,
  togglePopover,
  destroyOrganizationPopover,
}) =>
  networkStatus === NetworkStatus.loading ? (
    <Loading />
  ) : (
    <div>
      <div className={s.actionBar}>
        <Link to="/portal/admin/organizations/new">
          <button className={s.createAction}>Add Organization</button>
        </Link>
      </div>
      <ReactTable
        NoDataComponent={() => null}
        data={organizations}
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
      {destroyOrganizationPopover ? (
        <Dialog
          title="Delete Organization"
          actions={destroyActions(togglePopover, destroyOrganizationPopover, deleteOrganization)}
          modal={false}
          open
          onRequestClose={() => togglePopover('destroyOrganization', destroyOrganizationPopover.data)}
          actionsContainerStyle={{ paddingBottom: 20 }}
        >
          Are you sure you want to delete {destroyOrganizationPopover.data.name}?
        </Dialog>
      ) : null}
    </div>
  )

const buildOptimisticResponse = organization => ({
  __typename: 'Mutation',
  deleteOrganization: {
    __typename: 'Organization',
    ...organization,
  },
})

const withData = compose(
  graphql(OrganizationsQuery, {}),
  graphql(DeleteOrganizationMutation, {
    props: ({ ownProps, mutate }) => ({
      deleteOrganization: organization =>
        mutate({
          variables: { id: organization.id },
          optimisticResponse: buildOptimisticResponse(organization),
          update: (proxy, { data: { deleteOrganization } }) => {
            const { organizations } = proxy.readQuery({ query: OrganizationsQuery })
            const withOrganizationRemoved = R.reject(
              organization => organization.id === deleteOrganization.id,
              organizations
            )
            proxy.writeQuery({ query: OrganizationsQuery, data: { organizations: withOrganizationRemoved } })
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
    destroyOrganizationPopover: popover && popover.type === 'destroyOrganization' ? popover : null,
  }
}

const withActions = connect(
  mapStateToProps,
  {
    graphQLError,
    togglePopover,
  }
)

export default withActions(withData(Organizations))
