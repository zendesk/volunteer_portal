import React, { useState, useCallback } from 'react'

import * as R from 'ramda'
import { useMutation } from '@apollo/react-hooks'

import UpdateUserOfficeMutation from '/mutations/UpdateUserOfficeMutation.gql'

export const UserContext = React.createContext(null)

export const UserContextProvider = ({ user, children }) => {
  const [currentUser, setCurrentUser] = useState(user)
  const [updateDefaultOffice] = useMutation(UpdateUserOfficeMutation)

  const setOffice = useCallback(
    office =>
      updateDefaultOffice({ variables: { userId: currentUser.id, officeId: office.id } }).then(
        R.pipe(
          R.path(['data', 'updateUserOffice']),
          setCurrentUser
        )
      ),
    []
  )
  const clear = useCallback(() => setCurrentUser(undefined), [])

  const ctx = {
    currentUser,
    setOffice,
    clear,
  }

  return <UserContext.Provider value={ctx}>{children}</UserContext.Provider>
}
