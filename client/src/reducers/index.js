import { combineReducers } from 'redux';
import authReducers from './authReducers';
import relayReducers from './relayReducers';

export default combineReducers({
  auth: authReducers,
  relay: relayReducers
});
