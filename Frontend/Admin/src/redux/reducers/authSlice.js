// reducers/authSlice.js

import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    adminToken:null,
    isAdminAuthenticated:false
  },
  reducers: {
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

export const { logoutAdmin,adminLoginSuccess } = authSlice.actions;
export default authSlice.reducer;

