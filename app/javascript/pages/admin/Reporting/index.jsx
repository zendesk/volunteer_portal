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
import { Field as FormField, Input, FauxInput } from '@zendeskgarden/react-forms'
import { Datepicker } from '@zendeskgarden/react-datepickers'
import { Button } from '@zendeskgarden/react-buttons'
import { Skeleton } from '@zendeskgarden/react-loaders';

import UserReporting from 'components/Reporting/User'
import ReportingQuery from './queries/userReportingQuery.gql'
import { FilterContext, officeFilterValueLens } from '/context'

const InlineFauxInput = styled(FauxInput)`
  display: flex;
  align-items: center;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  border: none;
  box-shadow: none;
`

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
            <Field>
              <Select style={{ width: 240 }}>
                {
                  report === null ? "Select Report" : `Report: ${reportKeyTitleMap[report]}`
                }
              </Select>
            </Field>
            {renderMenu()}
          </Dropdown>
          <div style={{ display: "flex" }}>
            {/* TODO: upgrade date picker to use Datepicker.Start and Datepicker.End after garden update */}
            <div>
              <FormField>
                <InlineFauxInput>
                  <strong>{t('volunteer_portal.admin.tab.reporting.from')}&nbsp;</strong>
                  <Datepicker value={dateRange.start} onChange={changeStartDate} maxValue={today} locale={i18n.language}>
                    <Input bare />
                  </Datepicker>
                </InlineFauxInput>
              </FormField>
            </div>
            <div>
              <FormField>
                <InlineFauxInput>
                  <strong>{t('volunteer_portal.admin.tab.reporting.to')}&nbsp;</strong>
                  <Datepicker value={dateRange.end} onChange={changeEndDate} maxValue={today} locale={i18n.language}>
                    <Input bare />
                  </Datepicker>
                </InlineFauxInput>
              </FormField>
            </div>
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
