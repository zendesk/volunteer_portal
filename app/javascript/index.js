import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloProvider } from 'react-apollo'
import { ApolloProvider as ApolloHooksProvider } from '@apollo/react-hooks'
import { browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { ThemeProvider } from '@zendeskgarden/react-theming'
import Root from 'components/Root'
import configureStore from './store/configureStore'
import { lightTheme } from '/themes'
import './i18n'
import './styles'

const client = new ApolloClient({
  link: new HttpLink({
    credentials: 'include',
  }),
  cache: new InMemoryCache(),
})

const store = configureStore(client)
const history = syncHistoryWithStore(browserHistory, store)

ReactDOM.render(
  <ApolloProvider store={store} client={client}>
    <ApolloHooksProvider client={client}>
      <ThemeProvider theme={lightTheme}>
        <Root store={store} history={history} />
      </ThemeProvider>
    </ApolloHooksProvider>
  </ApolloProvider>,
  document.getElementById('root')
)
