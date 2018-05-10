const defaultState = {
  showFilter: { value: 'all' },
  eventFilter: { value: 'all' },
  officeFilter: { value: null },
  dashboardOfficeFilter: { value: 'all' },
  adminOfficeFilter: { value: 'all' },
  popover: { type: 'event', data: null, anchorEl: null },
  currentUser: {},
  calendarDate: new Date(),
  reportingStartDate: null,
  reportingStartEnd: null,
}

export default defaultState
