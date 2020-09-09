import React, { useState, useEffect } from 'react'
import { I18nReactTable } from '../../lib/i18n'
import {
  Table,
  Caption,
  Head,
  HeaderRow,
  HeaderCell,
  Body,
  Row,
  Cell
} from '@zendeskgarden/react-tables';
import * as R from 'ramda'
import { defaultFilterMethod } from 'lib/utils'
import { Field, Input, FauxInput } from '@zendeskgarden/react-forms'
import { Datepicker } from '@zendeskgarden/react-datepickers'
import { Button } from '@zendeskgarden/react-buttons'
import { useTranslation } from 'react-i18next'

import FilterGroup from '/components/FilterGroup'
import OfficeFilter from '/components/OfficeFilter'

import 'style-loader!css-loader!react-table/react-table.css'
import styled from 'styled-components'

const InlineFauxInput = styled(FauxInput)`
  display: flex;
  align-items: center;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  border: none;
  box-shadow: none;
`

// todo: remove border
const HeaderOfficeFilter = styled(OfficeFilter)`
  padding: 0px;
  & > div {
    border: none;
  }
`

const columnDefs = t => [
  {
    Header: t('volunteer_portal.admin.tab.reporting.name'),
    accessor: 'name',
    filterable: true,
  },
  {
    Header: t('volunteer_portal.admin.tab.reporting.email'),
    accessor: 'email',
  },
  {
    Header: <OfficeFilter />, //t('volunteer_portal.admin.tab.reporting.office'),
    id: 'officeName',
    accessor: 'office.name',
  },
  {
    Header: t('volunteer_portal.admin.tab.reporting.hours'),
    accessor: 'hours',
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

const Reporting = ({ users }) => {
  const { t, i18n } = useTranslation()
  return (
    <div>
      <Table>
        <Head>
          <HeaderRow>
            <HeaderCell>Name</HeaderCell>
            <HeaderCell>Email</HeaderCell>
            <HeaderCell style={{ padding: 0}}><HeaderOfficeFilter /></HeaderCell>
            <HeaderCell>Hours</HeaderCell>
          </HeaderRow>
        </Head>
        <Body>
          {
            users.map((user, index) =>
              <Row key={index}>
                <Cell>{user.name}</Cell>
                <Cell>{user.email}</Cell>
                <Cell>{user.office.name}</Cell>
                <Cell>{user.hours}</Cell>
              </Row>
            )
          }
        </Body>
      </Table>
    </div>
  )
}

export default Reporting
