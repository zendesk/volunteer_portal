import React, { Component } from 'react'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { ThemeProvider as GardenThemeProvider } from '@zendeskgarden/react-theming'

import Loading from 'components/LoadingIcon'
import Header from 'components/Header'

const MuiTheme = {
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  palette: {
    primary1Color: '#333',
    accent1Color: '#30aabc',
    textColor: '#555',
  },
}

const App = ({ loading, currentUser, offices, userPopover, toggleUserPopover, updateUserOffice, children }) => (
  <MuiThemeProvider muiTheme={getMuiTheme(MuiTheme)}>
    <GardenThemeProvider>
      {loading ? (
        <Loading />
      ) : (
        <div>
          <Header
            currentUser={currentUser}
            offices={offices}
            togglePopover={e => toggleUserPopover(e.currentTarget)}
            popover={userPopover}
            handleOfficeSelect={office => updateUserOffice(currentUser, office)}
          />
          {children}
        </div>
      )}
    </GardenThemeProvider>
  </MuiThemeProvider>
)

export default App
