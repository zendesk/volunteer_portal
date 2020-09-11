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
import styled from 'styled-components'


const BaselineHeaderCell = styled(HeaderCell)`
  vertical-align: baseline;
`

const Reporting = ({ users }) => {
  const { t } = useTranslation()
  return (
    <div>
      <Table>
        <Head>
          <HeaderRow>
            {/* TODO: searchable name */}
            <BaselineHeaderCell>{t('volunteer_portal.admin.tab.reporting.name')}</BaselineHeaderCell>
            <BaselineHeaderCell>{t('volunteer_portal.admin.tab.reporting.email')}</BaselineHeaderCell>
            <BaselineHeaderCell>{t('volunteer_portal.admin.tab.reporting.office')}</BaselineHeaderCell>
            {/* TODO: sort by hours */}
            <BaselineHeaderCell>{t('volunteer_portal.admin.tab.reporting.hours')}</BaselineHeaderCell>
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
      {/* TODO: Pagination */}
    </div>
  )
}

export default Reporting
