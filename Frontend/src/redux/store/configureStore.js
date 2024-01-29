import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../reducers/authSlice.js';
import userReducer from '../reducers/userSlice.js';
import { loginSuccess, logout, adminLoginSuccess, logoutAdmin } from '../reducers/authSlice.js';

const initialToken = localStorage.getItem('token');
const initialAdminToken = localStorage.getItem('adminToken');


const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
  },
});

if (initialToken) {
  store.dispatch(loginSuccess(initialToken));
}
else if(initialAdminToken){
  store.dispatch(adminLoginSuccess(initialAdminToken));
} else {
  store.dispatch(logout());
  store.dispatch(logoutAdmin());
}

export default store;
