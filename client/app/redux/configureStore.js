import { createStore, applyMiddleware } from 'redux'
import rootReducer from './root.reducer.js'
import thunk from 'redux-thunk'

export function configureStore() {
  let store = createStore(rootReducer, applyMiddleware(thunk))
  return store
}