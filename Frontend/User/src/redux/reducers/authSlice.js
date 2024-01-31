// reducers/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    token: null,
    adminToken:null,
    isAdminAuthenticated:false
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
    },
    logoutAdmin:(state)=>{
      state.isAdminAuthenticated=false;
      state.adminToken=null;
    },
    adminLoginSuccess:(state,action)=>{
      state.isAdminAuthenticated=true;
      state.adminToken=action.payload;
    }
  },
});

export const { loginSuccess, logout,logoutAdmin,adminLoginSuccess } = authSlice.actions;
export default authSlice.reducer;
