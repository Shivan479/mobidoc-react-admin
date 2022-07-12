import { createSlice } from '@reduxjs/toolkit';
import API from '../api.service';

export const holidaysSlice = createSlice({
  name: 'holiday',
  initialState: {
    singleView: false,
    holiday: {},
    holidays: [],
    isLoading: true,
    loaded: false
  },
  reducers: {
    setHolidaysList: (state, action) => {
      state.holidays = action.payload;
      console.log(state);
    },
    setSingleHoliday: (state,action) => {
      state.singleView = true;
      state.holiday = action.payload;
      state.holidays = [];
      state.isLoading = false;
      state.loaded = true;
    }
  },
});

export const { getHolidaysList, setHolidaysList, setSingleHoliday } = holidaysSlice.actions;
export default holidaysSlice.reducer;
