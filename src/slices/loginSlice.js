import { createSlice } from '@reduxjs/toolkit';
import API from '../api.service';

export const loginSlice = createSlice({
  name: 'login',
  initialState: {
    email: sessionStorage['user'] != undefined ? JSON.parse(sessionStorage.user).email : '',
    userName: sessionStorage['user'] != undefined ? JSON.parse(sessionStorage.user).username : '',
    pwd: sessionStorage.pwd,
    remember: false,
    dashboard: false,
  },
  reducers: {
    loginNow: (state) => {
      console.log(state);
      debugger;
    },
    rememberClick: (state) => {
      console.log(state);
      debugger;
    },
    setAuthUser: (state,action) => {
      state.email = action.payload.email;
      state.pwd = action.payload.pwd;
    },
    setDashboard: (state,action) => {
      state.dashboard = action.payload;
    },
  },
});

export const { loginNow, rememberClick, setAuthUser , setDashboard } = loginSlice.actions;
export default loginSlice.reducer;
