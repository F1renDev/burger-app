import * as actionTyps from "../actions/actionTypes";

// handling the authentication process
const initialState = {
  token: null,
  userId: null,
  error: null,
  loading: false,
  authRedirectPath : '/'
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTyps.AUTH_START:
      return {
        ...state,
        loading: true,
        error: null
      };
    case actionTyps.AUTH_SUCCESS:
      return {
        ...state,
        token: action.idToken,
        userId: action.userId,
        error: null,
        loading: false
      };
    case actionTyps.AUTH_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      };
      case actionTyps.AUTH_LOGOUT:
      return {
        ...state,
        token: null,
        userId: null
      };
      case actionTyps.SET_AUTH_REDIRECT_PATH:
      return {
        ...state,
        authRedirectPath: action.path
      };
    default:
      return state;
  }
};

export default reducer;
