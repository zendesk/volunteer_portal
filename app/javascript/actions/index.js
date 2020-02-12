const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE'

function resetErrorMessage() {
  return {
    type: RESET_ERROR_MESSAGE,
  }
}

const CALENDAR_DATE_CHANGE = 'CALENDAR_DATE_CHANGE'

export function calendarDateChange(date) {
  return {
    type: CALENDAR_DATE_CHANGE,
    date,
  }
}

const TOGGLE_POPOVER = 'TOGGLE_POPOVER'

export function togglePopover(type, data, anchorEl) {
  return (dispatch, getState) => {
    const popover = getState().model.popover
    const newPopover = { type, data: data || null, anchorEl: anchorEl || null }
    if (popover) {
      newPopover.data = data ? popover.data : null
      newPopover.anchorEl = anchorEl ? popover.anchorEl : null
    }

    return dispatch({ type: TOGGLE_POPOVER, popover: newPopover })
  }
}

export const GRAPHQL_MUTATION_ERROR = 'GRAPHQL_MUTATION_ERROR'

export function graphQLError(errors) {
  return {
    type: GRAPHQL_MUTATION_ERROR,
    errors,
  }
}

export default {
  RESET_ERROR_MESSAGE,
  resetErrorMessage,
  CALENDAR_DATE_CHANGE,
  calendarDateChange,
  GRAPHQL_MUTATION_ERROR,
  graphQLError,
  TOGGLE_POPOVER,
  togglePopover,
}
