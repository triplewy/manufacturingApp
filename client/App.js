import React from 'react';
import { StyleSheet, Text, View, Image, ImageBackground, Platform } from 'react-native';
import { createBottomTabNavigator, createMaterialTopTabNavigator, createSwitchNavigator, createStackNavigator, NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'
import SplashScreen from 'react-native-splash-screen';
import editIcon from './app/icons/edit-icon.png'
import reportIcon from './app/icons/report-icon.png'
import statsIcon from './app/icons/stats-icon.png'
import accountIcon from './app/icons/account-icon.png'
import Splash from './app/Splash/Splash'
import Login from './app/Login/Login'
import CreateAccount from './app/CreateAccount/CreateAccount'
import Name from './app/Name/Name'
import Shifts from './app/Shifts/Shifts'
import ForgotPassword from './app/ForgotPassword'
import Grid from './app/Grid/Grid'
import Input from './app/Input/Input'
import Stats from './app/Stats/Stats'
import DayStats from './app/Stats/DayStats'
import Account from './app/Account/Account'
import Notifications from './app/Notifications/Notifications'
import NotificationBadge from './app/NotificationBadge/NotificationBadge'
import WorkOrder from './app/WorkOrder/WorkOrder'
import Reports from './app/Reports/Reports'
import './global.js'

export default class App extends React.Component {
  constructor(props) {
    super(props)

  }

  componentDidMount() {
    SplashScreen.hide()
  }

  render() {
    const AuthNavigation = createStackNavigator(
      {
        Login: Login,
        ForgotPassword: ForgotPassword,
        // CreateAccount: CreateAccount,
      },
      {
        navigationOptions: {
          headerStyle: {
            backgroundColor: '#FF8300',
            borderBottomWidth: 0,
            shadowRadius: 0,
            elevation: 0
          },
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
        },
        Input: {
          screen: Input,
          navigationOptions: ({ navigation }) => ({
            title: `${navigation.state.params.name}`,
          }),
        },
      },
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
    )

    const AccountNavigator = createStackNavigator(
      {
        Account: {
          screen: Account,
          navigationOptions: {
            title: 'Account'
          }
        },
        Notifications: {
          screen: Notifications,
          navigationOptions: {
            title: 'Notifications'
          }
        },
        WorkOrder: {
          screen: WorkOrder,
          navigationOptions: {
            title: 'Work Order'
          }
        }
      },
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
            tabBarIcon: () => (
              <ImageBackground source={accountIcon} style={{width: 40, height: 40, alignItems: 'center'}}>
                <NotificationBadge />
              </ImageBackground>
            )
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
        },
        navigationOptions: {
          headerStyle: {
            height: 60
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '400'
          }
        }
      }
    )

    const AppNavigator = createSwitchNavigator(
      {
        Splash: Splash,
        Auth: AuthNavigation,
        Name: Name,
        Shifts: Shifts,
        Tabs: Tabs,
      }
    )

    return (
      <AppNavigator />
    )
  }
}
