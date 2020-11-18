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

const FieldHoursTable = ({ fields, loading, name, itemNameAccessor }) => {
  const pageSize = 10
  const { t } = useTranslation()
  const [ page, setPage ] = useState(1)

  const fieldSlice = R.pipe(
    R.slice(pageSize * (page - 1), pageSize * page),
    R.sort((a, b) => b.minutes - a.minutes),
  )(fields)

  const totalPages = Math.floor(fields.length / pageSize) + (fields.length % pageSize > 0 ? 1 : 0)

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
                <HeaderCell>{name}</HeaderCell>
                {/* TODO: toggle sort by hours */}
                <HeaderCell>{t('volunteer_portal.admin.tab.reporting.hours')}</HeaderCell>
              </HeaderRow>
            </Head>
            <Body>
              {
                fieldSlice.map((data, index) =>
                  <Row key={`${data.id}-${index}`}>
                    <Cell>{data[itemNameAccessor]}</Cell>
                    <Cell>{Math.floor(data.minutes / 60)}</Cell>
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

export default FieldHoursTable
