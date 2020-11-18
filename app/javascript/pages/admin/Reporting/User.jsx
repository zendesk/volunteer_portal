import React, { useState } from 'react'
import {
  Table,
  Head,
  HeaderRow,
  HeaderCell,
  Body,
  Row,
  Cell
} from '@zendeskgarden/react-tables';
import { Skeleton } from '@zendeskgarden/react-loaders';
import { Pagination } from '@zendeskgarden/react-pagination';
import { useTranslation } from 'react-i18next'
import * as R from 'ramda'

import { Box } from '../../../components/StyleFoundation'

const Reporting = ({ users, loading }) => {
  const pageSize = 10
  const { t } = useTranslation()
  const [ page, setPage ] = useState(1)

  const userSlice = R.pipe(
    R.slice(pageSize * (page - 1), pageSize * page),
    R.sort((a, b) => b.hours - a.hours),
  )(users)

  const totalPages = Math.floor(users.length / pageSize) + (users.length % pageSize > 0 ? 1 : 0)

  return (
    <div>
      {
        loading ?
        <>
          <Skeleton height="46px" />
          {
            R.range(0, 10).map((_, index) => <Skeleton key={index} height="38px" />)
          }
        </>
        :
        <>
          <Table>
            <Head>
              <HeaderRow>
                {/* TODO: searchable name */}
                <HeaderCell>{t('volunteer_portal.admin.tab.reporting.name')}</HeaderCell>
                <HeaderCell>{t('volunteer_portal.admin.tab.reporting.email')}</HeaderCell>
                <HeaderCell>{t('volunteer_portal.admin.tab.reporting.office')}</HeaderCell>
                {/* TODO: toggle sort by hours */}
                <HeaderCell>{t('volunteer_portal.admin.tab.reporting.hours')}</HeaderCell>
              </HeaderRow>
            </Head>
            <Body>
              {
                userSlice.map((user, index) =>
                  <Row key={`${user.name}-${index}`}>
                    <Cell>{user.name}</Cell>
                    <Cell>{user.email}</Cell>
                    <Cell>{user.office.name}</Cell>
                    <Cell>{user.hours}</Cell>
                  </Row>
                )
              }
            </Body>
          </Table>
          <Box height="16px" />
          <Pagination totalPages={totalPages} pagePadding={0} currentPage={page} onChange={setPage} />
        </>
      }
    </div>
  )
}

export default Reporting
