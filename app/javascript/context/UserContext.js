import React, { useState, useCallback } from 'react'

import * as R from 'ramda'

const preferenceLens = R.lensProp('preference')
const officeLens = R.lensProp('office')

export const UserContext = React.createContext(null)

export const UserContextProvider = ({ user, children }) => {
  const [currentUser, setCurrentUser] = useState(user)

  const setOffice = useCallback(office => setCurrentUser(R.set(officeLens, office)), [])
  const setPreference = useCallback(pref => setCurrentUser(R.set(preferenceLens, pref)), [])
  const clear = useCallback(() => setCurrentUser(undefined), [])

  const ctx = {
    currentUser,
    setOffice,
    setPreference,
    clear,
  }

  return <UserContext.Provider value={ctx}>{children}</UserContext.Provider>
}
