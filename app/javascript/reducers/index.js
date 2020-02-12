import * as R from 'ramda'
import { routerReducer as routing } from 'react-router-redux'
import { combineReducers } from 'redux'
import deepmerge from 'deepmerge'
import { reducer as formReducer } from 'redux-form'

import Actions from 'actions'
import defaultState from './defaultState'

const handleFilterChange = (state, action, filterName) => {
  const newState = R.clone(state)

  newState[filterName] = { value: action.value }

  return newState
}

const handlePopoverToggle = (state, popoverToToggle) => {
  if (state.popover && state.popover.type == popoverToToggle.type) {
    return { ...state, popover: null }
  } else {
    return { ...state, popover: popoverToToggle }
  }
}

const model = (state = defaultState, action) => {
  const filterChange = R.partial(handleFilterChange, [state, action])

  /* eslint-disable no-fallthrough */
  switch (action.type) {
    case Actions.TOGGLE_POPOVER:
      return handlePopoverToggle(state, action.popover)
    // Non-standard Actions
    case Actions.UPDATE_USER_SUCCESS: {
      const updateUserState = deepmerge(state, action.response.entities)
      if (action.response.result === state.currentUser.id) {
        updateUserState.currentUser = action.response.entities.users[action.response.result]
      }
      return R.merge(state, updateUserState)
    }
    case Actions.CURRENT_USER_SUCCESS:
    case Actions.CURRENT_USER_OFFICE_UPDATE_SUCCESS: {
      const currentUser = action.response.entities.users[action.response.result]
      const newCurrentUserState = {
        currentUser,
        officeFilter: { value: currentUser.officeId },
        dashboardOfficeValue: { value: currentUser.officeId },
        adminOfficeFilter: { value: currentUser.officeId },
      }
      return R.merge(state, newCurrentUserState)
    }
    case Actions.CALENDAR_DATE_CHANGE: {
      const { date } = action
      return R.merge(state, { calendarDate: date })
    }
    case '@@router/LOCATION_CHANGE': {
      return R.merge(state, { popover: null })
    }
    default:
      return state
  }
  /* eslint-enable no-fallthrough */
}

// Updates error message to notify about the failed fetches.
function errorMessage(state = null, action) {
  const { type, error } = action

  if (type === Actions.RESET_ERROR_MESSAGE) {
    return null
  } else if (error) {
    return action.error
  }

  return state
}

function graphQLErrors(state = null, action) {
  const { type, errors } = action

  if (type === Actions.GRAPHQL_MUTATION_ERROR) {
    return errors
  } else {
    return state
  }
}

const createRootReducer = apolloClient =>
  combineReducers({
    model,
    errorMessage,
    graphQLErrors,
    routing,
    form: formReducer,
  })

export default createRootReducer
