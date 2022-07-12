import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './slices/loginSlice';
import merchantReducer from './slices/merchantsSlice';
import holidayReducer from './slices/holidaysSlice';
import doctorsReducer from './slices/doctorsSlice';
import notificationReducer from './slices/notificationsSlice';
import usersSlice from './slices/usersSlice';

export default configureStore({
  reducer: {
    login: loginReducer,
    merchant: merchantReducer,
    holiday: holidayReducer,
    doctors: doctorsReducer,
    notifications: notificationReducer,
    users: usersSlice,
  },
})