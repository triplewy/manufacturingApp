export function auth(state = false, action) {
  switch (action.type) {
    case 'LOGGED_IN': {
      console.log("action.loggedIn", action.loggedIn);
      state.auth = action.loggedIn
      return action.loggedIn;
    }
    default:
      return state;
    }
};
