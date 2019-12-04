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

import OfficesQuery from './queries/index.gql'
import DeleteOfficeMutation from './mutations/delete.gql'

import s from './main.css'

import 'style-loader!css-loader!react-table/react-table.css'

const actionLinks = (office, togglePopover) => (
  <div className={s.actionColumn}>
    <Link to={`/portal/admin/offices/${office.id}/edit`}>Edit</Link>
    <button className={s.deleteAction} onClick={() => togglePopover('destroyOffice', office)}>
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
    Header: 'Timezone',
    accessor: 'timezone',
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

const destroyActions = (togglePopover, destroyOfficePopover, deleteOffice) => [
  <button
    className={`${s.btn} ${s.cancelBtn}`}
    onClick={() => togglePopover('destroyOffice', destroyOfficePopover.data)}
  >
    Cancel
  </button>,
  <button
    className={`${s.btn} ${s.deleteBtn}`}
    onClick={() => deleteOffice(destroyOfficePopover.data) && togglePopover('destroyOffice')}
  >
    Delete
  </button>,
]

const Offices = ({ data: { networkStatus, offices }, deleteOffice, destroyOfficePopover, togglePopover }) =>
  networkStatus === NetworkStatus.loading ? (
    <Loading />
  ) : (
    <div>
      <div className={s.actionBar}>
        <Link to="/portal/admin/offices/new">
          <button className={s.createAction}>Add Office</button>
        </Link>
      </div>
      <ReactTable
        NoDataComponent={() => null}
        data={offices}
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
      {destroyOfficePopover ? (
        <Dialog
          title="Delete Office"
          actions={destroyActions(togglePopover, destroyOfficePopover, deleteOffice)}
          modal={false}
          open
          onRequestClose={() => togglePopover('destroyOffice', destroyOfficePopover.data)}
          actionsContainerStyle={{ paddingBottom: 20 }}
        >
          Are you sure you want to delete {destroyOfficePopover.data.name}?
        </Dialog>
      ) : null}
    </div>
  )

const buildOptimisticResponse = office => ({
  __typename: 'Mutation',
  deleteOffice: {
    __typename: 'Office',
    ...office,
  },
})

const withData = compose(
  graphql(OfficesQuery, {}),
  graphql(DeleteOfficeMutation, {
    props: ({ ownProps, mutate }) => ({
      deleteOffice: office =>
        mutate({
          variables: { id: office.id },
          optimisticResponse: buildOptimisticResponse(office),
          update: (proxy, { data: { deleteOffice } }) => {
            const { offices } = proxy.readQuery({ query: OfficesQuery })
            const withOfficeRemoved = R.reject(office => office.id === deleteOffice.id, offices)
            proxy.writeQuery({ query: OfficesQuery, data: { offices: withOfficeRemoved } })
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
    destroyOfficePopover: popover && popover.type === 'destroyOffice' ? popover : null,
  }
}

const withActions = connect(
  mapStateToProps,
  {
    graphQLError,
    togglePopover,
  }
)

export default withActions(withData(Offices))
