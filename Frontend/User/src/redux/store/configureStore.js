import { configureStore } from '@reduxjs/toolkit';
import authReducer, { loginSuccess, logout } from '../reducers/authSlice.js';
import userReducer from '../reducers/userSlice.js';
import {jwtDecode} from 'jwt-decode';

const initialToken = localStorage.getItem('token');

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
  },
});

if (initialToken) {
  const decodedToken = jwtDecode(initialToken);
  const currentTime = Date.now() / 1000; 

  if (decodedToken.exp > currentTime) {
    store.dispatch(loginSuccess(initialToken));
  } else {
    store.dispatch(logout());
  }
}

export default store;
