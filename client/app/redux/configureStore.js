
import { createStore } from 'redux'
import rootReducer from './root.reducer.js'
import thunk from 'redux-thunk'

export default function configureStore() {
  let store = createStore(rootReducer, applyMiddleware(thunk))
  return store
}