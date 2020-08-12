import React, { useContext, useState } from 'react'
import * as R from 'ramda'
import moment from 'moment'
import { useQuery } from '@apollo/react-hooks'
import { Tabs, TabList, Tab, TabPanel } from '@zendeskgarden/react-tabs'

import Loading from 'components/LoadingIcon'
import Reporting from 'components/Reporting'

import { FilterContext, officeFilterValueLens } from '/context'
import ReportingQuery from './queries/reportingQuery.gql'

import s from './main.css'
import { addDays } from 'date-fns'

const defaultStartDate = moment().startOf('year')
const defaultEndDate = moment().valueOf() // Now in Unix millisecond timestamp
const today = new Date()
const lastFortnight = addDays(today, -14)
const initialRange = {
  start: lastFortnight,
  end: today,
}

const formatOrDefaultStartDate = filterValue => Number(moment(filterValue || defaultStartDate).format('X'))
const formatOrDefaultEndDate = filterValue => Number(moment(filterValue || defaultEndDate).format('X'))

const ReportingPage = _props => {
  const [dateRange, setDateRange] = useState(initialRange)
  const { filters } = useContext(FilterContext)
  const { data, loading, error } = useQuery(ReportingQuery, {
    variables: {
      after: formatOrDefaultStartDate(dateRange.start),
      before: formatOrDefaultEndDate(dateRange.end),
      officeId: R.view(officeFilterValueLens, filters),
    },
  })

  if (error) console.log(error.graphQLErrors)

  const users = R.propOr([], 'users', data)
  const changeStartDate = date => setDateRange(R.set(R.lensProp('start'), date))
  const changeEndDate = date => setDateRange(R.set(R.lensProp('end'), date))

  return (
    <div className={s.admin}>
      <div className={s.content}>
        <Reporting
          users={users}
          startDate={dateRange.start}
          endDate={dateRange.end}
          onStartChange={changeStartDate}
          onEndChange={changeEndDate}
        />
      </div>
    </div>
  )
}

export default ReportingPage
