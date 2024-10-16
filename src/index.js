import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider as CustomThemeProvider } from './themeContext.js';
import CssBaseline from '@mui/material/CssBaseline';  // Import CssBaseline

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <CustomThemeProvider>
    <React.StrictMode>
      <CssBaseline /> {/* Add CssBaseline here */}
      <App />
    </React.StrictMode>
  </CustomThemeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
