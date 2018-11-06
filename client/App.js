import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { createBottomTabNavigator, createMaterialTopTabNavigator, createSwitchNavigator, createStackNavigator, NavigationActions } from 'react-navigation'
import './global.js'
import {getCookie, setCookie} from './app/Storage'
import editIcon from './app/icons/edit-icon.png'
import reportIcon from './app/icons/report-icon.png'
import statsIcon from './app/icons/stats-icon.png'
import accountIcon from './app/icons/account-icon.png'
import Splash from './app/Splash'
import Login from './app/Auth/Login'
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
      isLoading: true,
    }

    this.sessionLogin = this.sessionLogin.bind(this)
  }

  componentDidMount() {
    this.sessionLogin()
  }

  sessionLogin() {
    getCookie().then(cookie => {
      console.log("cookie is", cookie);
      fetch(global.API_URL + '/api/sessionLogin', {
        method: 'GET',
        credentials: 'include',
      })
      .then(res => {
        if (res.headers.get("set-cookie")) {
          console.log("set cookie is", res.headers.get("set-cookie"));
          return setCookie(res.headers.get("set-cookie")).then(data => {
            if (data.message === 'success') {
              return res.json()
            } else {
              console.log(data);
            }
          })
          .catch(err => {
            console.log(err);
          })
        } else {
          return res.json()
        }
      })
      .then(data => {
        console.log(data);
        if (data.message === 'not logged in') {
          this.setState({loggedIn: false, isLoading: false})
        } else {
          this.setState({loggedIn: true, isLoading: false})
        }
      })
      .catch((error) => {
        console.error(error);
      })
    })
    .catch(err => {
      console.log(err);
    })
  }

  render() {
    const AuthNavigation = createStackNavigator(
      {
        Login: Login,
        Name: {
          screen: Name,
          navigationOptions: {
            gesturesEnabled: false,
          }
        },
        ForgotPassword: ForgotPassword
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
            title: `${navigation.state.params.title}`,
          }),
        },
      },
      {
        navigationOptions: {
          headerStyle: {
            height: 50
          },
          headerTitleStyle: {
            fontSize: 21,
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
            height: 50
          },
          headerTitleStyle: {
            fontSize: 21,
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
            height: 50
          },
          headerTitleStyle: {
            fontSize: 21,
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
            height: 50
          },
          headerTitleStyle: {
            fontSize: 21,
            fontWeight: '400'
          }
        }
      }
    )

    const Tabs = createSwitchNavigator(
      {
        Tabs: createBottomTabNavigator(
          {
            Inputs: {
              screen: InputsNavigator,
              navigationOptions: {
                tabBarIcon: () => (<Image source={editIcon} style={{width: 30, height: 30, alignItems: 'center'}} />)
              }
            },
            Reports: {
              screen: ReportsNavigator,
              navigationOptions: {
                tabBarIcon: () => (<Image source={reportIcon} style={{width: 30, height: 30, alignItems: 'center'}} />)
              }
            },
            Stats: {
              screen: StatsNavigator,
              navigationOptions: {
                tabBarIcon: () => (<Image source={statsIcon} style={{width: 30, height: 30, alignItems: 'center'}} />)
              }
            },
            Account: {
              screen: AccountNavigator,
              navigationOptions: {
                tabBarIcon: () => (<Image source={accountIcon} style={{width: 30, height: 30, alignItems: 'center'}} />)
              }
            }
          },
          {
            tabBarPosition: 'bottom',
            animationEnabled: true,
            activeTintColor: '#FF8300',
            inactiveTintColor: '#666',
            tabBarOptions: {
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
        ),
        Auth: AuthNavigation,
      },
      {
        initialRouteName: this.state.loggedIn ? 'Tabs' : 'Auth'
      }
    )

    if (this.state.isLoading) {
      return (
        <Splash />
      )
    } else {
      return (
        <Tabs loggedIn={this.state.loggedIn} />
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
