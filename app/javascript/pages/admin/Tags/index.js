import React from 'react'

import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'
import { NetworkStatus } from 'apollo-client'
import * as R from 'ramda'
import { I18nReactTable } from '../../../lib/i18n'
import { Link } from 'react-router'
import Dialog from 'material-ui/Dialog'
import { Button } from '@zendeskgarden/react-buttons'
import { defaultFilterMethod } from 'lib/utils'
import { graphQLError, togglePopover } from 'actions'
import 'style-loader!css-loader!react-table/react-table.css'

import Loading from 'components/LoadingIcon'
import FilterGroup from 'components/FilterGroup'
import TagsQuery from './queries/index.gql'
import DeleteTagMutation from './mutations/delete.gql'
import s from './main.css'

import { withTranslation } from 'react-i18next'

const actionLinks = (tag, togglePopover, t) => (
  <div className={s.actionColumn}>
    <Link to={`/portal/admin/tags/${tag.id}/edit`}>{t('volunteer_portal.admin.tab.tags.edit')}</Link>
    <button className={s.deleteAction} onClick={() => togglePopover('destroyTag', tag)}>
      {t('volunteer_portal.admin.tab.tags.delete')}
    </button>
  </div>
)

const columns = (t, togglePopover) => [
  {
    Header: t('volunteer_portal.admin.tab.tags.label'),
    accessor: 'name',
    filterable: true,
  },
  {
    Header: t('volunteer_portal.admin.tab.tags.actions'),
    accessor: 'id',
    sortable: false,
    width: 130,
    Cell: ({ original }) => actionLinks(original, togglePopover, t),
  },
]

const destroyActions = (togglePopover, destroyTagPopover, deleteOffice, t) => [
  <button className={`${s.btn} ${s.cancelBtn}`} onClick={() => togglePopover('destroyTag', destroyTagPopover.data)}>
    {t('volunteer_portal.admin.tab.tags.cancel')}
  </button>,
  <button
    className={`${s.btn} ${s.deleteBtn}`}
    onClick={() => deleteOffice(destroyTagPopover.data) && togglePopover('destroyTag')}
  >
    {t('volunteer_portal.admin.tab.tags.delete')}
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

const Tags = withTranslation()(({ data: { networkStatus, tags }, deleteTag, togglePopover, destroyTagPopover, t }) =>
  networkStatus === NetworkStatus.loading ? (
    <Loading />
  ) : (
    <div>
      <FilterGroup>
        <Link to="/portal/admin/tags/new">
          <Button>{t('volunteer_portal.admin.tab.tags.addtag')}</Button>
        </Link>
      </FilterGroup>
      <I18nReactTable
        NoDataComponent={() => null}
        data={tags}
        columns={columns(t, togglePopover)}
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
          title={t('volunteer_portal.admin.tab.tags.deletetag')}
          actions={destroyActions(togglePopover, destroyTagPopover, deleteTag, t)}
          modal={false}
          open
          onRequestClose={() => togglePopover('destroyTag', destroyTagPopover.data)}
          actionsContainerStyle={{ paddingBottom: 20 }}
        >
          {t('volunteer_portal.admin.tab.tags_delete_confirmation', { tag: destroyTagPopover.data.name })}
        </Dialog>
      ) : null}
    </div>
  )
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

const withActions = connect(mapStateToProps, {
  graphQLError,
  togglePopover,
})

export default withActions(withData(withTranslation()(Tags)))
