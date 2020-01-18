import React from 'react'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { ThemeProvider as GardenThemeProvider } from '@zendeskgarden/react-theming'

import UserContext from '../../context/UserContext'
import Loading from 'components/LoadingIcon'
import Header from 'components/Header'
import WelcomeModal from 'components/WelcomeModal'

import '@zendeskgarden/react-avatars/dist/styles.css'
import '@zendeskgarden/react-buttons/dist/styles.css'
import '@zendeskgarden/react-dropdowns/dist/styles.css'
import '@zendeskgarden/react-grid/dist/styles.css'
import '@zendeskgarden/react-modals/dist/styles.css'
import '@zendeskgarden/react-notifications/dist/styles.css'
import '@zendeskgarden/react-tags/dist/styles.css'
import '@zendeskgarden/css-utilities'

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
  <UserContext.Provider value={currentUser}>
    <GardenThemeProvider>
      <MuiThemeProvider muiTheme={getMuiTheme(MuiTheme)}>
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
            <WelcomeModal />
            {children}
          </div>
        )}
      </MuiThemeProvider>
    </GardenThemeProvider>
  </UserContext.Provider>
)

export default App
