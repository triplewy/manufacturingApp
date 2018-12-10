import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk'
import rootReducer from './root.reducer';

// const enhancerList = [];
// const devToolsExtension = window && window.__REDUX_DEVTOOLS_EXTENSION__;
//
// if (typeof devToolsExtension === 'function') {
//   enhancerList.push(devToolsExtension());
// }
//
// const composedEnhancer = compose(/* applyMiddleware(someReduxMiddleware, someOtherReduxMiddleware),*/ ...enhancerList);

export default function initStore(initialState) {
  return createStore(rootReducer, initialState, applyMiddleware(thunk))
}
