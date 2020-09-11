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

const Reporting = ({ users }) => {
  const { t } = useTranslation()
  return (
    <div>
      <Table>
        <Head>
          <HeaderRow>
            {/* TODO: searchable name */}
            <HeaderCell>{t('volunteer_portal.admin.tab.reporting.name')}</HeaderCell>
            <HeaderCell>{t('volunteer_portal.admin.tab.reporting.email')}</HeaderCell>
            <HeaderCell>{t('volunteer_portal.admin.tab.reporting.office')}</HeaderCell>
            {/* TODO: sort by hours */}
            <HeaderCell>{t('volunteer_portal.admin.tab.reporting.hours')}</HeaderCell>
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
