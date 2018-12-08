import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux'
import App from './App';
import initStore from './app/redux/store'
// import Home from './app/index';

const store = initStore()

class RegisterApp extends React.Component {
  render () {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}

AppRegistry.registerComponent('manufacturingApp', () => RegisterApp);
