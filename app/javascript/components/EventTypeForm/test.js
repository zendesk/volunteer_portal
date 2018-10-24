import React from 'react'
import EventTypeForm from './'
import renderer from 'react-test-renderer'
import { createStore, combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import { reduxForm } from 'redux-form'
import { Provider } from 'react-redux'

const rootReducer = combineReducers({ form: formReducer })
const store = createStore(rootReducer)
const WithReduxForm = reduxForm({ form: 'test-event-type' })(EventTypeForm)

const handleSubmit = () => {}

test('loads', () => {
  const component = renderer.create(
    <Provider store={store}>
      <WithReduxForm handleSubmit={handleSubmit} disableSubmit={false} />
    </Provider>
  )
  const tree = component.toJSON()

  expect(tree).toMatchSnapshot()
})
