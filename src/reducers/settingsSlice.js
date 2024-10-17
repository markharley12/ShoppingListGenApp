// reducers/settingsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  fetchImages: false,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleFetchImages: (state) => {
      state.fetchImages = !state.fetchImages;
    },
  },
});

export const { toggleFetchImages } = settingsSlice.actions;
export default settingsSlice.reducer;
