import { createSlice } from '@reduxjs/toolkit';

export const cronsSlice = createSlice({
  name: 'cron',
  initialState: {
    singleView: false,
    cron: {},
    doctors: [],
    isLoading: true,
    loaded: false
  },
  reducers: {
    setDoctorsList: (state, action) => {
      // debugger;
      state.doctors = action.payload;
    },
    setCron: (state,action) => {
      state.singleView = true;
      state.holiday = action.payload;
      state.doctors = [];
      state.isLoading = false;
      state.loaded = true;
    }
  },
});

export const { getDoctorsList, setDoctorsList, setSingleCron } = cronsSlice.actions;
export default cronsSlice.reducer;
