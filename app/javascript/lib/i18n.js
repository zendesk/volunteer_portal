import React from 'react'
import ReactTable from 'react-table'
import { useTranslation } from 'react-i18next'

export const I18nReactTable = (props) => {
  const { t } = useTranslation()
  return(
    <ReactTable
      {...props}
      previousText={t('volunteer_portal.dashboard.layouteventstab.office_all')}
      nextText={t('volunteer_portal.dashboard.layouteventstab.office_all')}
      loadingText={t('volunteer_portal.dashboard.layouteventstab.office_all')}
      noDataText={t('volunteer_portal.dashboard.layouteventstab.office_all')}
      pageText={t('volunteer_portal.dashboard.layouteventstab.office_all')}
      ofText={t('volunteer_portal.dashboard.layouteventstab.office_all')}
      rowsText={t('volunteer_portal.dashboard.layouteventstab.office_all')}
    />
  )
}
