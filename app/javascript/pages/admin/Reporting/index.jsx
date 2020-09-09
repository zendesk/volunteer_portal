import React, { useContext, useState, useEffect } from 'react'
import * as R from 'ramda'
import moment from 'moment'
import { useLazyQuery } from '@apollo/react-hooks'
import {
  Dropdown,
  Menu,
  Item,
  Trigger,
  Separator,
  NextItem,
  PreviousItem,
  Field,
  Select
} from '@zendeskgarden/react-dropdowns';
import { Field as FormField, Input, FauxInput } from '@zendeskgarden/react-forms'
import { Datepicker } from '@zendeskgarden/react-datepickers'
import { Button } from '@zendeskgarden/react-buttons'

import Loading from 'components/LoadingIcon'
import Reporting from 'components/Reporting'

import { FilterContext, officeFilterValueLens } from '/context'
import ReportingQuery from './queries/reportingQuery.gql'
import { useTranslation } from 'react-i18next'

import { addDays } from 'date-fns'
import styled from 'styled-components'

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

const ContentFlex = styled.div`
  display: flex;
  justify-content: space-between;
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

const ReportingPage = _props => {
  
  const { t, i18n } = useTranslation()
  
  const [ report, setReport ] = useState(null) // null | 'user' | `other report keys`
  const [ dropDownIsOpen, setDropDownIsOpen ] = useState(false)
  const [ dropDownTempSelectedItem, setDropDownTempSelectedItem ] = useState(false)
  const [ octetStream, setOctectStream ] = useState(null)

  const [ dateRange, setDateRange ] = useState(initialRange)
  const { filters } = useContext(FilterContext)
  const [ getUsers, { loading: userLoading, data: userData } ] = useLazyQuery(ReportingQuery)

  // if (userError /** && other errors */) console.log(userError.graphQLErrors
  
  useEffect(() => {
    switch (report) {
      case 'user':
        if (userData) {
          const headers = 'Name,Email,Office,Hours\n'
          const csv = R.reduce((acc, row) => acc + `${row.name},${row.email},${row.officeName},${row.hours}\n`, headers, userData.users)
          const octetStream = encodeURIComponent(csv)
          setOctectStream(octetStream)
        }
        break;
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
      default:
        break;
    }
  }, [ report, dateRange.start, dateRange.end, filters ])

  const changeStartDate = date => setDateRange(R.set(R.lensProp('start'), date))
  const changeEndDate = date => setDateRange(R.set(R.lensProp('end'), date))

  const reportKeyMap = {
    "user": "User"
  }

  return (
    <AdminSection>
      <div style={{ width: 935 }}>
        <ContentFlex>
          <Dropdown
              isOpen={dropDownIsOpen}
              onSelect={item => {
                if (item !== 'general' && item !== 'individual'  && item !== 'organized') {
                  setReport(item)
                }
              }}
              onStateChange={(changes, stateAndHelpers) => {
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

                  if (nextSelectedItem === 'flowers') {
                    stateAndHelpers.setHighlightedIndex(1);
                  } else if (nextSelectedItem === 'general') {
                    stateAndHelpers.setHighlightedIndex(4);
                  }

                  setDropDownTempSelectedItem(nextSelectedItem)
                }
              }}
            >
              <Field>
                <Select style={{ width: 240 }}>
                  {
                    report === null ? "Select Report" : `Report: ${reportKeyMap[report]}`
                  }
                </Select>
              </Field>
              <Menu >
                {dropDownTempSelectedItem === 'organized' ? (
                  <>
                    <PreviousItem value="general">Organized Events</PreviousItem>
                    <Separator />
                    <Item value="organized-event-type">Event Type</Item>
                    <Item value="organized-tag">Tag</Item>
                    <Item value="organized-organization">Organization</Item>
                    <Item value="organized-total">Total</Item>
                  </>
                ) : dropDownTempSelectedItem === 'individual' ? (
                  <>
                    <PreviousItem value="general">Individual Events</PreviousItem>
                    <Separator />
                    <Item value="individual-event-type">Event Type</Item>
                    <Item value="individual-tag">Tag</Item>
                    <Item value="individual-organization">Organization</Item>
                    <Item value="individual-total">Total</Item>
                  </>
                ) : (
                  <>
                    <Item value="user">Users</Item>
                    <NextItem value="organized" disabled>Organized Events</NextItem>
                    <NextItem value="individual" disabled>Individual Events</NextItem>
                  </>
                )}
              </Menu>
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
        </ContentFlex>
        {
          report === 'user' ?
          (
            userLoading ?
            <Loading/>
            :
            <Reporting
              users={R.propOr([], 'users', userData)}
              startDate={dateRange.start}
              endDate={dateRange.end}
              onStartChange={changeStartDate}
              onEndChange={changeEndDate}
              setOctectStream={setOctectStream}
            />
          )
          :
          <h2 style={{ textAlign: "center" }}>😎 Select a report to begin</h2>
        }
      </div>
    </AdminSection>
  )
}

export default ReportingPage
