import React, { useContext, useState, useEffect } from 'react'
import * as R from 'ramda'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import { addDays } from 'date-fns'
import styled from 'styled-components'
import { useLazyQuery } from '@apollo/react-hooks'

import {
  Dropdown,
  Menu,
  Item,
  Field,
  Select
} from '@zendeskgarden/react-dropdowns';
import { Field as FormField, Label as FormLabel, Input } from '@zendeskgarden/react-forms'
import { Datepicker } from '@zendeskgarden/react-datepickers'
import { Button } from '@zendeskgarden/react-buttons'

import UserReporting from './User'
import ReportingQuery from './queries/userReportingQuery.gql'
import { FilterContext, officeFilterValueLens } from '/context'
import OfficeFilter from '../../../components/OfficeFilter'
import { Box, FlexBox } from '../../../components/StyleFoundation'


const ToolbarHeader = styled(FlexBox)`
  border-bottom: 1px solid ${({theme}) => theme.palette.grey["200"]};
  padding-bottom: ${({ theme }) => theme.space.md};
  & > * {
    align-self: flex-end;
    padding: 4px;
  }
`

const CombinedInput = styled(Input)`
  border-radius: ${(props) => props.left ? "4px 0 0 4px" : props.right ? "0 4px 4px 0" : "inherit"};
  ${(props) => props.left && "border-right: 0px"};
`

const Prompt = styled.h3`
  text-align: center;
  margin: 32px;
`

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

const setUserOctectStream = (userData, setOctectStream) => {
  const headers = 'Name,Email,Office,Hours\n'
  const csv = R.reduce((acc, row) => acc + `${row.name},${row.email},${row.office.name},${row.hours}\n`, headers, userData.users)
  const octetStream = encodeURIComponent(csv)
  setOctectStream(octetStream)
}

const ReportingPage = () => {
  
  const { t, i18n } = useTranslation()
  
  const [ report, setReport ] = useState(null) // null | 'user' | `other report keys`
  const [ dropDownIsOpen, setDropDownIsOpen ] = useState(false)
  const [ dropDownTempSelectedItem, setDropDownTempSelectedItem ] = useState(false)
  const [ octetStream, setOctectStream ] = useState(null)

  const [ dateRange, setDateRange ] = useState(initialRange)
  const { filters } = useContext(FilterContext)

  const [ getUsers, { loading: userLoading, data: userData } ] = useLazyQuery(ReportingQuery)

  // Updates data
  useEffect(() => {
    switch (report) {
      case 'user':
        getUsers({
          variables: {
            after: formatOrDefaultStartDate(dateRange.start),
            before: formatOrDefaultEndDate(dateRange.end),
            officeId: R.view(officeFilterValueLens, filters),
          },
        })
        break;
      // TODO: match on future reports
      default:
        break;
    }
  }, [ report, dateRange.start, dateRange.end, filters ])

  // Updates export button
  useEffect(() => {
    switch (report) {
      case 'user':
        userData && setUserOctectStream(userData, setOctectStream)
        break;
      // TODO: match on future reports
      default:
        break;
    }
  }, [ userData ])

  const changeStartDate = date => setDateRange(R.set(R.lensProp('start'), date))
  const changeEndDate = date => setDateRange(R.set(R.lensProp('end'), date))

  const reportKeyTitleMap = {
    user: t('volunteer_portal.admin.tab.reporting.dropdown.users')
  }

  const handleDropdownStateChange = (changes, stateAndHelpers) => {
    if (Object.prototype.hasOwnProperty.call(changes, 'isOpen')) {
      const nextIsOpen = changes.isOpen
      setDropDownIsOpen(nextIsOpen)
    }

    if (Object.prototype.hasOwnProperty.call(changes, 'selectedItem')) {
      const nextSelectedItem = changes.selectedItem
      setDropDownTempSelectedItem(nextSelectedItem)
    }
  }

  return (
    <FlexBox justifyContent="space-around">
      <Box width="100%">
        <ToolbarHeader justifyContent="space-between">
          <Dropdown
              isOpen={dropDownIsOpen}
              onSelect={setReport}
              onStateChange={handleDropdownStateChange}
            >
            <Field>
              <FormLabel>{t('volunteer_portal.admin.tab.reporting.select_label')}</FormLabel>
              <Select>
                {
                  report === null ? t('volunteer_portal.admin.tab.reporting.dropdown.none') : reportKeyTitleMap[report]
                }
              </Select>
            </Field>
            <Menu >
              <Item value="user">{t('volunteer_portal.admin.tab.reporting.dropdown.users')}</Item>
            </Menu>
          </Dropdown>
          <FormField>
            <FormLabel>{t('volunteer_portal.admin.tab.reporting.filter')}</FormLabel>
            <Box mt="8px">
              {/* TODO: Local office filter? */}
              <OfficeFilter/>
            </Box>
          </FormField>
          <FlexBox>
            <FormField>
                <FormLabel>{t('volunteer_portal.admin.tab.reporting.from')}</FormLabel>
                <Datepicker value={dateRange.start} onChange={changeStartDate} maxValue={today} locale={i18n.language}>
                  <CombinedInput left bare />
                </Datepicker>
            </FormField>
            <FormField>
                <FormLabel>{t('volunteer_portal.admin.tab.reporting.to')}</FormLabel>
                <Datepicker value={dateRange.end} onChange={changeEndDate} maxValue={today} locale={i18n.language}>
                  <CombinedInput right bare />
                </Datepicker>
            </FormField>
          </FlexBox>
          <a href={octetStream && `data:application/octet-stream;filename=export.csv,${octetStream}`} download="export.csv">
            <Button disabled={!octetStream}>{t('volunteer_portal.admin.tab.reporting.exportascsv')}</Button>
          </a>
        </ToolbarHeader>
        {
          report === 'user' ?
            <UserReporting
              users={R.propOr([], 'users', userData)}
              startDate={dateRange.start}
              endDate={dateRange.end}
              onStartChange={changeStartDate}
              onEndChange={changeEndDate}
              setOctectStream={setOctectStream}
              loading={userLoading}
            />
          :
          <Prompt>{t('volunteer_portal.admin.tab.reporting.select_report')}</Prompt>
        }
      </Box>
    </FlexBox>
  )
}

export default ReportingPage
