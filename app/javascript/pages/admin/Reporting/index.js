import React from 'react'
import { graphql } from 'react-apollo'
import { NetworkStatus } from 'apollo-client'
import { connect } from 'react-redux'
import moment from 'moment'

import Loading from 'components/LoadingIcon'
import Reporting from 'components/Reporting'

import { changeAdminReportingStart, changeAdminReportingEnd } from 'actions'

import ReportingQuery from './query.gql'

import adminStyle from './../Admin/main.css'

const defaultStartDate = moment().startOf('year')
const defaultEndDate = moment().endOf('year')

const formatOrDefaultStartDate = filterValue => Number(moment(filterValue || defaultStartDate).format('X'))
const formatOrDefaultEndDate = filterValue => Number(moment(filterValue || defaultEndDate).format('X'))

const ReportingPage = ({
  data: { networkStatus, users },
  reportingStartDate,
  reportingEndDate,
  changeAdminReportingStart,
  changeAdminReportingEnd,
}) =>
  networkStatus === NetworkStatus.loading ? (
    <Loading />
  ) : (
    <div className={adminStyle.admin}>
      <div className={adminStyle.content}>
        <Reporting
          users={users}
          startDate={reportingStartDate}
          endDate={reportingEndDate}
          onStartChange={changeAdminReportingStart}
          onEndChange={changeAdminReportingEnd}
        />
      </div>
    </div>
  )

const mapStateToProps = ({ model: { adminOfficeFilter, reportingStartDate, reportingEndDate } }) => ({
  adminOfficeFilter,
  reportingStartDate,
  reportingEndDate,
  changeAdminReportingStart,
  changeAdminReportingEnd,
})

const withData = graphql(ReportingQuery, {
  options: ({ adminOfficeFilter: { value: officeId }, reportingStartDate, reportingEndDate }) => ({
    variables: {
      after: formatOrDefaultStartDate(reportingStartDate),
      before: formatOrDefaultEndDate(reportingEndDate),
      officeId: officeId === 'all' ? null : officeId,
    },
    fetchPolicy: 'cache-and-network',
  }),
})

const withActions = connect(mapStateToProps, {
  changeAdminReportingStart,
  changeAdminReportingEnd,
})

export default withActions(withData(ReportingPage))
