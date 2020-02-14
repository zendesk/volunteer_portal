import React, { useState, useCallback } from 'react'

import * as R from 'ramda'

const initialState = {
  officeFilter: { value: undefined },
  eventFilter: { value: undefined },
  showFilter: { value: undefined },
}

export const officeFilterValueLens = R.lensPath(['officeFilter', 'value'])
export const eventFilterValueLens = R.lensPath(['eventFilter', 'value'])
export const showFilterValueLens = R.lensPath(['showFilter', 'value'])

const setInitialState = user => R.set(officeFilterValueLens, R.path(['office', 'id'], user), initialState)

export const FilterContext = React.createContext(initialState)

export const FilterContextProvider = ({ user, children }) => {
  const [filters, setFilters] = useState(setInitialState(user))

  const setOfficeValue = useCallback(id => setFilters(R.set(officeFilterValueLens, id)), [])
  const setEventValue = useCallback(id => setFilters(R.set(eventFilterValueLens, id)), [])
  const setShowValue = useCallback(v => setFilters(R.set(showFilterValueLens, v)), [])

  const ctx = {
    filters,
    setOfficeValue,
    setEventValue,
    setShowValue,
  }

  return <FilterContext.Provider value={ctx}>{children}</FilterContext.Provider>
}
