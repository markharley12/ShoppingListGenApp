// reducers/settingsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  fetchImages: false,
  googleCloudApiKey: process.env.REACT_APP_GOOGLE_CLOUD_API_KEY || '',
  customSearchEngineId: process.env.REACT_APP_CUSTOM_SEARCH_ENGINE_ID || '',
  llmApiUrl: process.env.REACT_APP_LLM_API_URL || '',
  llmApiKey: process.env.REACT_APP_LLM_API_KEY || '',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleFetchImages: (state) => {
      state.fetchImages = !state.fetchImages;
    },
    setGoogleCloudApiKey: (state, action) => {
      state.googleCloudApiKey = action.payload;
    },
    setCustomSearchEngineId: (state, action) => {
      state.customSearchEngineId = action.payload;
    },
    setLlmApiUrl: (state, action) => {
      state.llmApiUrl = action.payload;
    },
    setLlmApiKey: (state, action) => {
      state.llmApiKey = action.payload;
    },
  },
});

export const { 
  toggleFetchImages, 
  setGoogleCloudApiKey, 
  setCustomSearchEngineId, 
  setLlmApiUrl, 
  setLlmApiKey 
} = settingsSlice.actions;

export default settingsSlice.reducer;
