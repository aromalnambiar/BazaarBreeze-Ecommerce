import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../reducers/authSlice.js';
import userReducer from '../reducers/userSlice.js';
import { loginSuccess, logout} from '../reducers/authSlice.js';

const initialToken = localStorage.getItem('token');


const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
  },
});

if (initialToken) {
  store.dispatch(loginSuccess(initialToken));
} else {
  store.dispatch(logout());
}

export default store;
