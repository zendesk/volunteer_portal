export const CHANGE_SHOW_FILTER = 'CHANGE_SHOW_FILTER'

export function changeShowFilter(value) {
  return (dispatch, _getState) =>
    dispatch({
      type: CHANGE_SHOW_FILTER,
      value,
    })
}

export const CHANGE_EVENT_FILTER = 'CHANGE_EVENT_FILTER'

export function changeEventFilter(value) {
  return (dispatch, _getState) =>
    dispatch({
      type: CHANGE_EVENT_FILTER,
      value,
    })
}

export const CHANGE_OFFICE_FILTER = 'CHANGE_OFFICE_FILTER'

export function changeOfficeFilter(value) {
  return (dispatch, _getState) =>
    dispatch({
      type: CHANGE_OFFICE_FILTER,
      value,
    })
}

export const CHANGE_DASHBOARD_OFFICE_FILTER = 'CHANGE_DASHBOARD_OFFICE_FILTER'

export function changeDashboardOfficeFilter(value) {
  return (dispatch, _getState) =>
    dispatch({
      type: CHANGE_DASHBOARD_OFFICE_FILTER,
      value,
    })
}

export const CHANGE_ADMIN_OFFICE_FILTER = 'CHANGE_ADMIN_OFFICE_FILTER'

export function changeAdminOfficeFilter(value) {
  return (dispatch, _getState) =>
    dispatch({
      type: CHANGE_ADMIN_OFFICE_FILTER,
      value,
    })
}

export const CHANGE_ADMIN_REPORTING_START = 'CHANGE_ADMIN_REPORTING_START'

export function changeAdminReportingStart(date) {
  return (dispatch, _getState) =>
    dispatch({
      type: CHANGE_ADMIN_REPORTING_START,
      date,
    })
}

export const CHANGE_ADMIN_REPORTING_END = 'CHANGE_ADMIN_REPORTING_END'

export function changeAdminReportingEnd(date) {
  return (dispatch, _getState) =>
    dispatch({
      type: CHANGE_ADMIN_REPORTING_END,
      date,
    })
}
