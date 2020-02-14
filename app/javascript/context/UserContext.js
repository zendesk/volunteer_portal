import React, { useState, useCallback } from 'react'

import * as R from 'ramda'

export const UserContext = React.createContext(null)

export const UserContextProvider = ({ user, children }) => {
  const [currentUser, setCurrentUser] = useState(user)

  const setOffice = useCallback(office => setCurrentUser(R.set(R.lensProp('office'), office)), [])
  const clear = useCallback(() => setCurrentUser(undefined), [])

  const ctx = {
    currentUser,
    setOffice,
    clear,
  }

  return <UserContext.Provider value={ctx}>{children}</UserContext.Provider>
}
