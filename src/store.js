// store.js
import { configureStore } from '@reduxjs/toolkit';
import settingsSlice from './reducers/settingsSlice';

const store = configureStore({
  reducer: {
    settings: settingsSlice,
    // Add other reducers here as needed
  },
});

export default store;
