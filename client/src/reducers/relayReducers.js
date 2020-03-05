import { RELAY_URL } from '../actions/types';

const INITIAL_STATE = {
  relayUrl: "/profile"
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case RELAY_URL:
      return { ...state, relayUrl: action.payload};
    default:
      return state;
  }
};
