import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { createBottomTabNavigator, createMaterialTopTabNavigator, createSwitchNavigator, createStackNavigator, NavigationActions } from 'react-navigation'
import editIcon from './app/icons/edit-icon.png'
import reportIcon from './app/icons/report-icon.png'
import statsIcon from './app/icons/stats-icon.png'
import accountIcon from './app/icons/account-icon.png'
import Splash from './app/Splash/Splash'
import Login from './app/Login/Login'
import CreateAccount from './app/CreateAccount'
import Name from './app/Login/Name'
import ForgotPassword from './app/ForgotPassword'
import Grid from './app/Grid/Grid'
import Input from './app/Input'
import Stats from './app/Stats/Stats'
import DayStats from './app/Stats/DayStats'
import Account from './app/Account/Account'
import Reports from './app/Reports/Reports'
import './global.js'

export default class App extends React.Component {
  constructor(props) {
    super(props)

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
          screen: props => <Reports {...props} {...this.props} />,
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
        Splash: Splash,
        Auth: AuthNavigation,
        Name: Name,
        Tabs: Tabs,
      },
      {
        // initialRouteName: this.state.loggedIn ? (this.state.hasName ? 'Tabs' : 'Name') : 'Auth'
      }
    )

    return (
      <AppNavigator />
    )
  }
}
