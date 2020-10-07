import React from 'react'
import { compose, graphql } from 'react-apollo'
import { NetworkStatus } from 'apollo-client'
import moment from 'moment'
import { I18nReactTable } from '../../../lib/i18n'
import { withTranslation } from 'react-i18next'

import Loading from 'components/LoadingIcon'

import PendingIndividualEventsQuery from './query.gql'
import ApproveIndividualEventsMutation from './ApproveIndividualEventsMutation.gql'
import RejectIndividualEventsMutation from './RejectIndividualEventsMutation.gql'

import s from './main.css'

class IndividualEvents extends React.Component {
  state = {
    selected: [],
    bulkAction: null,
    selectAllChecked: false,
  }

  individualEventsColumns = [
    {
      id: 'selection',
      Header: props => (
        <input
          checked={this.state.selectAllChecked}
          type="checkbox"
          onChange={e => {
            const { pendingIndividualEvents } = this.props.data
            if (this.state.selectAllChecked) {
              this.setState({ selected: [], selectAllChecked: false })
            } else {
              this.setState({ selected: pendingIndividualEvents, selectAllChecked: true })
            }
          }}
        />
      ),
      Cell: props => (
        <input
          type="checkbox"
          checked={this.state.selected.includes(props.value)}
          onChange={e => {
            if (e.target.checked) {
              this.setState(prevState => ({ selected: [...prevState.selected, props.value] }))
            } else {
              this.setState(prevState => ({ selected: [...prevState.selected].filter(v => v.id != props.value.id) }))
            }
          }}
        />
      ),
      width: 50,
      style: { textAlign: 'center' },
      sortable: false,
      accessor: d => d,
    },
    {
      id: 'user',
      Header: this.props.t('volunteer_portal.admin.tab.individualevent.user'),
      accessor: 'user.name',
    },
    {
      id: 'description',
      Header: this.props.t('volunteer_portal.admin.tab.individualevent.description'),
      accessor: 'description',
    },
    {
      id: 'date',
      Header: this.props.t('volunteer_portal.admin.tab.individualevent.date'),
      Cell: props => <span>{moment(props.value).format('LL')}</span>,
      accessor: 'date',
    },
    {
      id: 'duration',
      Header: this.props.t('volunteer_portal.admin.tab.individualevent.duration'),
      accessor: 'duration',
    },
    {
      id: 'organization',
      Header: this.props.t('volunteer_portal.admin.tab.individualevent.organization'),
      accessor: 'organization.name',
    },
    {
      id: 'type',
      Header: this.props.t('volunteer_portal.admin.tab.individualevent.type'),
      accessor: 'eventType.title',
    },
  ]

  render() {
    const { data, t } = this.props
    const { networkStatus, pendingIndividualEvents } = data
    return networkStatus === NetworkStatus.loading ? (
      <Loading />
    ) : (
      <div className={s.eventsTable}>
        <h3>{t('volunteer_portal.admin.tab.individualevent.pendingapproval')}</h3>
        <div>
          <select
            className={s.bulkActionSelect}
            defaultValue="actions"
            onChange={e => {
              this.setState({ bulkAction: e.target.value })
            }}
          >
            <option value="actions" disabled>
              {t('volunteer_portal.admin.tab.individualevent.bulkactions')}
            </option>
            <option value="approve">{t('volunteer_portal.admin.tab.individualevent.approve')}</option>
            <option value="reject">{t('volunteer_portal.admin.tab.individualevent.reject')}</option>
          </select>
          <button
            className={s.bulkActionButton}
            disabled={!this.state.bulkAction || !this.state.selected.length}
            onClick={() => {
              const { selected, bulkAction } = this.state
              if (selected.length <= 0) return
              switch (bulkAction) {
                case 'approve':
                  this.props.approveIndividualEvents(selected.map(selection => selection.id))
                  break
                case 'reject':
                  this.props.rejectIndividualEvent(selected.map(selection => selection.id))
                  break
                default:
                  break
              }
              this.setState(() => ({ selectAllChecked: false, selected: [] }))
            }}
          >
            {t('volunteer_portal.admin.tab.individualevent.apply')}
          </button>
        </div>
        <I18nReactTable
          NoDataComponent={() => null}
          data={pendingIndividualEvents}
          columns={this.individualEventsColumns}
          showPagination={false}
          pageSize={pendingIndividualEvents.length}
          defaultSorted={[{ id: 'date', desc: true }]}
          minRows={0}
        />
      </div>
    )
  }
}

const withData = compose(
  graphql(PendingIndividualEventsQuery, {
    options: {
      fetchPolicy: 'cache-and-network',
    },
  }),
  graphql(ApproveIndividualEventsMutation, {
    props: ({ ownProps, mutate }) => ({
      approveIndividualEvents: ids =>
        mutate({
          variables: { ids },
          refetchQueries: [{ query: PendingIndividualEventsQuery }],
        }),
    }),
  }),
  graphql(RejectIndividualEventsMutation, {
    props: ({ ownProps, mutate }) => ({
      rejectIndividualEvent: ids =>
        mutate({
          variables: { ids },
          refetchQueries: [{ query: PendingIndividualEventsQuery }],
        }),
    }),
  })
)

export default withData(withTranslation()(IndividualEvents))
