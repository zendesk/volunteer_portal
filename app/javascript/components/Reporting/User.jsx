import React from 'react'
import {
  Table,
  Head,
  HeaderRow,
  HeaderCell,
  Body,
  Row,
  Cell
} from '@zendeskgarden/react-tables';
import { useTranslation } from 'react-i18next'

import OfficeFilter from '/components/OfficeFilter'

import 'style-loader!css-loader!react-table/react-table.css'
import styled from 'styled-components'


const BaselineHeaderCell = styled(HeaderCell)`
  vertical-align: baseline;
`

const Reporting = ({ users }) => {
  const { t, i18n } = useTranslation()
  return (
    <div>
      <Table>
        <Head>
          <HeaderRow>
            <BaselineHeaderCell>Name</BaselineHeaderCell>
            <BaselineHeaderCell>Email</BaselineHeaderCell>
            <BaselineHeaderCell><OfficeFilter /></BaselineHeaderCell>
            {/* TODO: sort by hours */}
            <BaselineHeaderCell>Hours</BaselineHeaderCell>
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
