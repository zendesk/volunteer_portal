import React, { useState, useCallback } from 'react'

import * as R from 'ramda'

const initialState = {
  officeFilter: { value: undefined },
  eventFilter: { value: undefined },
  showFilter: { value: undefined },
}

const officeValueLense = R.lensPath(['officeFilter', 'value'])
const eventValueLense = R.lensPath(['eventFilter', 'value'])
const showValueLense = R.lensPath(['showFilter', 'value'])

const setInitialState = user => R.set(officeValueLense, R.path(['office', 'id'], user), initialState)

export const FilterContext = React.createContext(initialState)

export const FilterProvider = ({ user, children }) => {
  const [filters, setFilters] = useState(setInitialState(user))

  const setOfficeValue = useCallback(id => setFilters(R.set(officeValueLense, id)), [])
  const setEventValue = useCallback(id => setFilters(R.set(eventValueLense, id)), [])
  const setShowValue = useCallback(v => setFilters(R.set(showValueLense, v)), [])

  const ctx = {
    filters,
    setOfficeValue,
    setEventValue,
    setShowValue,
  }

  return <FilterContext.Provider value={ctx}>{children}</FilterContext.Provider>
}
