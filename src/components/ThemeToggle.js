import React from 'react';
import { Box, FormControlLabel, Switch } from '@mui/material';
import { useTheme } from '../themes/themeContext';

/**
 * ThemeToggle component that allows the user to toggle dark mode.
 */
const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 2 }}>
      <FormControlLabel
        control={<Switch checked={isDarkMode} onChange={toggleTheme} />}
        label="Dark Mode"
      />
    </Box>
  );
};

export default ThemeToggle;
