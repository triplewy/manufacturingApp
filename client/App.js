import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { createBottomTabNavigator, createMaterialTopTabNavigator, createSwitchNavigator, createStackNavigator, NavigationActions } from 'react-navigation'
import './global.js'
import { getCookie, setCookie, getName } from './app/Storage'
import editIcon from './app/icons/edit-icon.png'
import reportIcon from './app/icons/report-icon.png'
import statsIcon from './app/icons/stats-icon.png'
import accountIcon from './app/icons/account-icon.png'
import Splash from './app/Splash'
import Login from './app/Auth/Login'
import CreateAccount from './app/Auth/CreateAccount'
import Name from './app/Auth/Name'
import ForgotPassword from './app/Auth/ForgotPassword'
import Grid from './app/Grid'
import Input from './app/Input'
import Stats from './app/Stats/Stats'
import DayStats from './app/Stats/DayStats'
import Account from './app/Account'
import Reports from './app/Reports'

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
      hasName: false,
      isLoading: true,
    }

    this.sessionLogin = this.sessionLogin.bind(this)
  }

  componentDidMount() {
    this.sessionLogin()
  }

  sessionLogin() {
    fetch(global.API_URL + '/api/sessionLogin', {
      method: 'GET',
      credentials: 'include',
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      if (data.message === 'not logged in') {
        this.setState({loggedIn: false, isLoading: false})
      } else {
        getName().then(name => {
          if (name === '') {
            this.setState({loggedIn: true, hasName: false, isLoading: false})
          } else {
            this.setState({loggedIn: true, hasName: true, isLoading: false})
          }
        })
      }
    })
    .catch((error) => {
      console.error(error);
    })
  }

  render() {
    const AuthNavigation = createStackNavigator(
      {
        Login: Login,
        ForgotPassword: ForgotPassword,
        CreateAccount: CreateAccount,
      },
      {
        headerMode: 'none',
        navigationOptions: {
          headerVisible: false
        },
        cardStyle: {
          backgroundColor: '#FF8300'
        }
      }
    )

    const InputsNavigator = createStackNavigator(
      {
        Grid: {
          screen: Grid,
          navigationOptions: {
            title: 'Inputs'
          }
        },
        Input: {
          screen: Input,
          navigationOptions: ({ navigation }) => ({
            title: `${navigation.state.params.name}`,
          }),
        },
      },
      {
        navigationOptions: {
          headerStyle: {
            height: 40
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '400'
          }
        }
      }
    )

    const ReportsNavigator = createStackNavigator(
      {
        Reports: {
          screen: Reports,
          navigationOptions: {
            title: 'Reports'
          }
        }
      },
      {
        navigationOptions: {
          headerStyle: {
            height: 40
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '400'
          }
        }
      }
    )

    const StatsNavigator = createStackNavigator(
      {
        Stats: {
          screen: Stats,
          navigationOptions: {
            title: 'Stats'
          }
        },
        DayStats: {
          screen: DayStats,
        }
      },
      {
        navigationOptions: {
          headerStyle: {
            height: 40
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '400'
          }
        }
      }
    )

    const AccountNavigator = createStackNavigator(
      {
        Account: {
          screen: Account,
          navigationOptions: {
            title: 'Account'
          }
        }
      },
      {
        navigationOptions: {
          headerStyle: {
            height: 40
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '400'
          }
        }
      }
    )

    const Tabs = createBottomTabNavigator(
      {
        Inputs: {
          screen: InputsNavigator,
          navigationOptions: {
            tabBarIcon: () => (<Image source={editIcon} style={{width: 40, height: 40, alignItems: 'center'}} />)
          }
        },
        Reports: {
          screen: ReportsNavigator,
          navigationOptions: {
            tabBarIcon: () => (<Image source={reportIcon} style={{width: 40, height: 40, alignItems: 'center'}} />)
          }
        },
        Stats: {
          screen: StatsNavigator,
          navigationOptions: {
            tabBarIcon: () => (<Image source={statsIcon} style={{width: 40, height: 40, alignItems: 'center'}} />)
          }
        },
        Account: {
          screen: AccountNavigator,
          navigationOptions: {
            tabBarIcon: () => (<Image source={accountIcon} style={{width: 40, height: 40, alignItems: 'center'}} />)
          }
        }
      },
      {
        tabBarOptions: {
          activeTintColor: '#FF8300',
          inactiveTintColor: 'gray',
          showIcon: true,
          showLabel: true,
          style: {
            height: 70
          },
          tabStyle: {
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 5
          },
          labelStyle: {
            fontSize: 14,
            marginLeft: 0,
            padding: 0
          }
        }
      }
    )

    const AppNavigator = createSwitchNavigator(
      {
        Auth: AuthNavigation,
        Name: Name,
        Tabs: Tabs,
      },
      {
        initialRouteName: this.state.loggedIn ? (this.state.hasName ? 'Tabs' : 'Name') : 'Auth'
      }
    )

    if (this.state.isLoading) {
      return (
        <Splash />
      )
    } else {
      return (
        <AppNavigator />
      )
    }
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
