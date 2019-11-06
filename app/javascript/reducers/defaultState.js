const defaultState = {
  showFilter: { value: 'all' },
  eventFilter: { value: 'all' },
  officeFilter: { value: 'current' },
  dashboardOfficeFilter: { value: 'current' },
  adminOfficeFilter: { value: 'current' },
  popover: { type: 'event', data: null, anchorEl: null },
  currentUser: {},
  calendarDate: new Date(),
  reportingStartDate: null,
  reportingStartEnd: null,
}

export default defaultState
