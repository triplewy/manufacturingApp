import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux'
import App from './App';
import configureStore from './redux/configureStore'


const store = configureStore()

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
