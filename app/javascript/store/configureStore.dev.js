import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import createRootReducer from '../reducers'

export default function configureStore(apolloClient, initialState = {}) {
  const store = createStore(
    createRootReducer(apolloClient),
    initialState,
    compose(applyMiddleware(thunk, createLogger()))
  )

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
