import { createSlice } from '@reduxjs/toolkit';
import API from '../api.service';

export const merchantsSlice = createSlice({
  name: 'merchant',
  initialState: {
    singleView: false,
    singleMerchant: {},
    merchants: [],
    isLoading: true,
    loaded: false
  },
  reducers: {
    getMerchantsList: (state) => {
      console.log(state);
      debugger;
    },
    setMerchantsList: (state,action) => {
      state.singleView = false;
      state.merchants = action.payload;      
      state.singleMerchant = {};
      state.isLoading = false;
      state.loaded = true;
    },
    setSingleMerchant: (state,action) => {
      state.singleView = true;
      state.singleMerchant = action.payload;
      state.merchants = [];
      state.isLoading = false;
      state.loaded = true;
    }
  },
});

export const { getMerchantsList, setMerchantsList, setSingleMerchant } = merchantsSlice.actions;
export default merchantsSlice.reducer;
