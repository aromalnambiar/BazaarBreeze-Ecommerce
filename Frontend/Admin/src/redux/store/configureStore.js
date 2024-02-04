import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../reducers/authSlice.js';
import { adminLoginSuccess, logoutAdmin } from '../reducers/authSlice.js';

const initialAdminToken = localStorage.getItem('adminToken');


const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
if(initialAdminToken){
  store.dispatch(adminLoginSuccess(initialAdminToken));
} else {
  store.dispatch(logoutAdmin());
}

export default store;
