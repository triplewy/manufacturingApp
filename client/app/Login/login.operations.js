import { getUser, getUserFailure, setUsername, setPassword, getUserSuccess } from './login.actions'
import { postRequest } from '../Storage'


this.props.navigation.navigate('Name')

export function setUsername(username){
    return (dispatch) => {
        dispatch(setUsername(username))
    }
}

export function setPassword(password){
    return (dispatch) => {
        dispatch(setPassword(password))
    }
}

export function loginUser(username, password) {
    return (dispatch) => {
        dispatch(getUser)
        postRequest(global.API_URL + '/api/auth/signin', {
            username: username,
            password: password
        })
        .then(data => {
            console.log(data);
            this.setState({submitted: false})
            if (data.message === 'not logged in') {
                dispatch(getUserFailure(data.message))
            } else {
                dispatch(getUserSuccess)

            }
        })
        .catch(function(err) {
            dispatch(getUserFailure(err))
        })
    }
  }




