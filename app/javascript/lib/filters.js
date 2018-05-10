export function officeFilter(eventAndFilters) {
  // eslint-disable-line import/prefer-default-export
  const { event, officeFilter, isValid } = eventAndFilters

  if (!isValid) {
    return eventAndFilters
  }

  if (officeFilter.value === 'all') {
    return eventAndFilters
  }
  const officeMatches = event.officeId === officeFilter.value
  return { ...eventAndFilters, isValid: officeMatches }
}
