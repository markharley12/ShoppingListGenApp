import React from 'react';
import { Box, TextField, Button } from '@mui/material';

/**
 * MealGenerator component that allows the user to generate meals.
 */
const MealGenerator = ({ numMeals, setNumMeals, handleSearch }) => {
  return (
    <Box
      sx={{
        padding: 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'stretch',
        height: '6.5rem',
        gap: 1,
      }}
    >
      <TextField
        type="number"
        value={numMeals}
        onChange={(e) => setNumMeals(e.target.value)}
        placeholder="Enter number of meals"
        variant="outlined"
        slotProps={{
          input: {
            sx: {
              height: '100%',
              textAlign: 'center',
              '& input': {
                height: '100%',
                textAlign: 'center',
              },
            },
          },
        }}
      />
      <Button variant="contained" onClick={handleSearch} sx={{ height: '100%' }}>
        Generate New Meals
      </Button>
    </Box>
  );
};

export default MealGenerator;
