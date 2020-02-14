import React from 'react'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import { UserContextProvider, FilterContextProvider } from '/context'
import Loading from 'components/LoadingIcon'
import Header from 'components/Header'
import WelcomeModal from 'components/WelcomeModal'

const MuiTheme = {
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  palette: {
    primary1Color: '#333',
    accent1Color: '#30aabc',
    textColor: '#555',
  },
}

const App = ({ loading, currentUser, offices, userPopover, toggleUserPopover, children }) => {
  if (!currentUser) return null

  return (
    <UserContextProvider user={currentUser}>
      <FilterContextProvider user={currentUser}>
        <MuiThemeProvider muiTheme={getMuiTheme(MuiTheme)}>
          {loading ? (
            <Loading />
          ) : (
            <div>
              <Header offices={offices} togglePopover={e => toggleUserPopover(e.currentTarget)} popover={userPopover} />
              <WelcomeModal />
              {children}
            </div>
          )}
        </MuiThemeProvider>
      </FilterContextProvider>
    </UserContextProvider>
  )
}

export default App
