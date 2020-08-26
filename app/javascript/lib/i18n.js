import React from 'react'
import ReactTable from 'react-table'
import { useTranslation } from 'react-i18next'

export const I18nReactTable = (props) => {
  const { t } = useTranslation()
  return(
    <ReactTable
      {...props}
      previousText={t('volunteer_portal.reacttable.previous')}
      nextText={t('volunteer_portal.reacttable.next')}
      loadingText={t('volunteer_portal.reacttable.loading')}
      noDataText={t('volunteer_portal.reacttable.nodatatext')}
      pageText={t('volunteer_portal.reacttable.page')}
      ofText={t('volunteer_portal.reacttable.of')}
      rowsText={t('volunteer_portal.reacttable.rows')}
    />
  )
}
