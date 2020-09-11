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
  Separator,
  NextItem,
  PreviousItem,
  Field,
  Select
} from '@zendeskgarden/react-dropdowns';
import { Field as FormField, Label as FormLabel, Input, FauxInput } from '@zendeskgarden/react-forms'
import { Datepicker } from '@zendeskgarden/react-datepickers'
import { Button } from '@zendeskgarden/react-buttons'
import { Skeleton } from '@zendeskgarden/react-loaders';

import UserReporting from 'components/Reporting/User'
import ReportingQuery from './queries/userReportingQuery.gql'
import { FilterContext, officeFilterValueLens } from '/context'
import OfficeFilter from '../../../components/OfficeFilter'

const AdminSection = styled.div`
  display: flex;
  justify-content: space-around;
  padding-bottom: 50px;
`

const ToolbarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid ${({theme}) => theme.palette.grey["200"]};
  padding-bottom: 16px;
  & > * {
    align-self: flex-end;
    padding: 4px;
  }
`

const CombinedInput = styled(Input)`
  border-radius: ${(props) => props.left ? "4px 0 0 4px" : props.right ? "0 4px 4px 0" : "inherit"};
  ${(props) => props.left && "border-right: 0px"};
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
  
  useEffect(() => {
    switch (report) {
      case 'user':
        userData && setUserOctectStream(userData, setOctectStream)
        break;
      // TODO: match on future reports
      default:
        break;
    }
  }, [userData])

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

  const changeStartDate = date => setDateRange(R.set(R.lensProp('start'), date))
  const changeEndDate = date => setDateRange(R.set(R.lensProp('end'), date))

  const reportKeyTitleMap = {
    user: t('volunteer_portal.admin.tab.reporting.dropdown.users')
  }

  const handleDropdownStateChange = (changes, stateAndHelpers) => {
    if (Object.prototype.hasOwnProperty.call(changes, 'isOpen')) {
      const nextIsOpen =
        changes.selectedItem === 'general' ||
        changes.selectedItem === 'organized' ||
        changes.selectedItem === 'individual' ||
        changes.isOpen
      setDropDownIsOpen(nextIsOpen)
    }

    if (Object.prototype.hasOwnProperty.call(changes, 'selectedItem')) {
      const nextSelectedItem = changes.selectedItem

      if (nextSelectedItem === 'general') {
        switch (dropDownTempSelectedItem) {
          case 'organized':
            stateAndHelpers.setHighlightedIndex(1)
            break
          case 'individual':
            stateAndHelpers.setHighlightedIndex(2)
            break
        }
      }

      setDropDownTempSelectedItem(nextSelectedItem)
    }
  }

  const handleDropdownOnSelect = item => {
    if (item !== 'general' && item !== 'individual'  && item !== 'organized') {
      setReport(item)
    }
  }

  const renderMenu = () => (
    <Menu >
      {dropDownTempSelectedItem === 'organized' ? (
        <>
          <PreviousItem value="general">{t('volunteer_portal.admin.tab.reporting.dropdown.organized_events')}</PreviousItem>
          <Separator />
          <Item value="organizedEventType">{t('volunteer_portal.admin.tab.reporting.dropdown.nested.event_type')}</Item>
          <Item value="organizedTag">{t('volunteer_portal.admin.tab.reporting.dropdown.nested.tag')}</Item>
          <Item value="organizedOrganization">{t('volunteer_portal.admin.tab.reporting.dropdown.nested.organization')}</Item>
          <Item value="organizedTotal">{t('volunteer_portal.admin.tab.reporting.dropdown.nested.total')}</Item>
        </>
      ) : dropDownTempSelectedItem === 'individual' ? (
        <>
          <PreviousItem value="general">{t('volunteer_portal.admin.tab.reporting.dropdown.individual_events')}</PreviousItem>
          <Separator />
          <Item value="individualEvent-type">{t('volunteer_portal.admin.tab.reporting.dropdown.nested.event_type')}</Item>
          <Item value="individualTag">{t('volunteer_portal.admin.tab.reporting.dropdown.nested.tag')}</Item>
          <Item value="individualOrganization">{t('volunteer_portal.admin.tab.reporting.dropdown.nested.organization')}</Item>
          <Item value="individualTotal">{t('volunteer_portal.admin.tab.reporting.dropdown.nested.total')}</Item>
        </>
      ) : (
        <>
          <Item value="user">{t('volunteer_portal.admin.tab.reporting.dropdown.users')}</Item>
          <NextItem value="organized" disabled>{t('volunteer_portal.admin.tab.reporting.dropdown.organized_events')}</NextItem>
          <NextItem value="individual" disabled>{t('volunteer_portal.admin.tab.reporting.dropdown.individual_events')}</NextItem>
        </>
      )}
    </Menu>
  )

  return (
    <AdminSection>
      <div style={{ width: "100%" }}>
        <ToolbarHeader>
          <Dropdown
              isOpen={dropDownIsOpen}
              onSelect={handleDropdownOnSelect}
              onStateChange={handleDropdownStateChange}
            >
            <Field style={{ width: 200 }}>
              <FormLabel>{t('volunteer_portal.admin.tab.reporting.select_label')}</FormLabel>
              <Select>
                {
                  report === null ? t('volunteer_portal.admin.tab.reporting.dropdown.none') : reportKeyTitleMap[report]
                }
              </Select>
            </Field>
            {renderMenu()}
          </Dropdown>
          <FormField>
            <FormLabel>{t('volunteer_portal.admin.tab.reporting.filter')}</FormLabel>
            <div style={{ marginTop: 8 }}>
              <OfficeFilter/>
            </div>
          </FormField>
          <div style={{ display: "flex" }}>
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
          </div>
          <a href={octetStream && `data:application/octet-stream;filename=export.csv,${octetStream}`} download="export.csv">
            <Button disabled={!octetStream}>{t('volunteer_portal.admin.tab.reporting.exportascsv')}</Button>
          </a>
        </ToolbarHeader>
        {
          report === 'user' ?
          (
            userLoading ?
            <div>
              <Skeleton height="60px" />
              {
                Array(10).fill(0).map((value, index) => <Skeleton key={index} height="40px" />)
              }
            </div>
            :
            <UserReporting
              users={R.propOr([], 'users', userData)}
              startDate={dateRange.start}
              endDate={dateRange.end}
              onStartChange={changeStartDate}
              onEndChange={changeEndDate}
              setOctectStream={setOctectStream}
            />
          )
          :
          <h3 style={{ textAlign: "center", margin: 32 }}>{t('volunteer_portal.admin.tab.reporting.select_report')}</h3>
        }
      </div>
    </AdminSection>
  )
}

export default ReportingPage
