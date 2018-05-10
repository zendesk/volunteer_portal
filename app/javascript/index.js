import 'babel-polyfill'
import ActionCable from 'actioncable'
import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloProvider } from 'react-apollo'
import { browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

import Root from 'components/Root'
import configureStore from './store/configureStore'
import Actions from './actions'

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
    <Root store={store} history={history} />
  </ApolloProvider>,
  document.getElementById('root')
)
