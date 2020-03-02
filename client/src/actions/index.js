import {
    SIGN_IN,
    SIGN_OUT,
    SIGN_IN_FAILURE
  } from './types';
  import apiClient from '../api/apiClient';
  
  /*
  export const signIn = userId => {
  
    return {
      type: SIGN_IN,
      payload: userId
    };
  };
  */
  
  export const signIn = (email, password) => async (dispatch, getState) => {
    try {
    const response = await apiClient.login( email, password );
    console.log('Response dat is %o', response.data)
    sessionStorage.setItem('jwt', response.data.token);
    dispatch({ type: SIGN_IN, payload: response.data.user });
  } catch(err){
    console.log("IN action creator %o", err);
    dispatch({ type: SIGN_IN_FAILURE, payload: err });
  }
  
  };
  
  export const signOut = () => {
    sessionStorage.removeItem('jwt');
    return {
      type: SIGN_OUT
    };
  
  };
  