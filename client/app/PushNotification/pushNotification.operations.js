import { postRequest, setDeviceTokenRegistered } from '../Storage'

export function postToken(token) {
  return postRequest(global.API_URL + '/api/account/token', {
    token: token
  })
  .then(data => {
    if (data.message == 'success') {
      setDeviceTokenRegistered()
    } else {
      console.log(data.message);
    }
  })
  .catch(function(err) {
    console.log(err);
  })
}
