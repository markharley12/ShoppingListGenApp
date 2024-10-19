import React from 'react';
import { Box, Button } from '@mui/material';

/**
 * ImageToggle component that allows the user to enable or disable image fetching.
 */
const MealUpdateButtons = ({ updateMeals, fetchMacros }) => {
  return (
    <Box sx={{ padding: 2, textAlign: 'center' }}>
      <Button variant="outlined" onClick={updateMeals} sx={{ marginRight: 1 }}>
        Update Meals
      </Button>
      <Button variant="outlined" onClick={fetchMacros}>
        Fetch Macros
      </Button>
    </Box>
  );
};

export default MealUpdateButtons;

