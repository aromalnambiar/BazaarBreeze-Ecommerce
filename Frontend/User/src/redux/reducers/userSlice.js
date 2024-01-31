import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userData: null,
    product:{},
  },
  reducers: {
    setUser: (state, action) => {
      state.userData = action.payload;
    },
    setProduct:(state,action)=>{
      state.product=action.payload;
    }
  },
});

export const { setUser,setProduct } = userSlice.actions;
export default userSlice.reducer;
