// theme.js
import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
    palette: {
        mode: 'light', // Set light mode
        background: {
            default: '#F5F5F5', // Light background
            paper: '#FFFFFF',   // White paper background
        },
        primary: {
            main: '#3F51B5',   // Indigo
        },
        secondary: {
            main: '#F50057',   // Pink
        },
        error: {
            main: '#F44336',   // Red for errors
        },
        warning: {
            main: '#FF9800',   // Amber for warnings
        },
        info: {
            main: '#2196F3',   // Blue for info
        },
        success: {
            main: '#4CAF50',   // Green for success
        },
    },
    typography: {
        fontSize: 14, // Base font size
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    },
});

export const darkTheme = createTheme({
    palette: {
        mode: 'dark', // Set dark mode
        background: {
            default: '#121212', // Dark background
            paper: '#1E1E1E',   // Dark paper background
        },
        primary: {
            main: '#BB86FC',   // Light Purple
        },
        secondary: {
            main: '#03DAC5',   // Teal
        },
        error: {
            main: '#CF6679',   // Light Red for errors
        },
        warning: {
            main: '#FFB74D',   // Yellow for warnings
        },
        info: {
            main: '#2196F3',   // Blue for info
        },
        success: {
            main: '#4CAF50',   // Green for success
        },
    },
    typography: {
        fontSize: 14, // Base font size
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    },
});
