import { createSlice } from '@reduxjs/toolkit';
import API from '../api.service';

export const cronsSlice = createSlice({
  name: 'cron',
  initialState: {
    singleView: false,
    cron: {},
    crons: [],
    isLoading: true,
    loaded: false
  },
  reducers: {
    setCronsList: (state, action) => {
      state.crons = action.payload;
    },
    setCron: (state,action) => {
      state.singleView = true;
      state.holiday = action.payload;
      state.crons = [];
      state.isLoading = false;
      state.loaded = true;
    }
  },
});

export const { getCronsList, setCronsList, setSingleCron } = cronsSlice.actions;
export default cronsSlice.reducer;
