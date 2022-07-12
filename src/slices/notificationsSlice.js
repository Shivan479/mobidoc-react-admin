import { createSlice } from '@reduxjs/toolkit';

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    data: []
  },
  reducers: {
    newNotification: (state, action) => {
      state.data.push(action.payload);
      // debugger;
    },
    clearNotifications: (state, action) => {
      state.data = [];
    }
  },
});

export const { newNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;
