import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import createRootReducer from '../reducers'

export default function configureStore(apolloClient, initialState = {}) {
  return createStore(createRootReducer(apolloClient), initialState, applyMiddleware(thunk))
}
