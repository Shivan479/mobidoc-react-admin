import { createSlice } from '@reduxjs/toolkit';
import API from '../api.service';

export const usersSlice = createSlice({
  name: 'users',
  initialState: {
    singleView: false,
    user: {},
    users: [],
    isLoading: true,
    loaded: false
  },
  reducers: {
    setUsersList: (state, action) => {
      state.users = action.payload;
      console.log(state);
    },
    setSingleUser: (state,action) => {
      state.singleView = true;
      state.user = action.payload;
      state.users = [];
      state.isLoading = false;
      state.loaded = true;
    }
  },
});

export const { setUsersList, setSingleUser } = usersSlice.actions;
export default usersSlice.reducer;
