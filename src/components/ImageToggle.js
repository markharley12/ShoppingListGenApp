import React from 'react';
import { Box, Button } from '@mui/material';

/**
 * ImageToggle component that allows the user to enable or disable image fetching.
 */
const ImageToggle = ({ fetchImages, setFetchImages, updateMeals, fetchMacros }) => {
  return (
    <Box sx={{ padding: 2, textAlign: 'center' }}>
      <Button
        variant="outlined"
        onClick={() => setFetchImages(!fetchImages)}
        sx={{ marginRight: 1 }}
      >
        {fetchImages ? 'Disable Images' : 'Enable Images'}
      </Button>
      <Button variant="outlined" onClick={updateMeals} sx={{ marginRight: 1 }}>
        Update Meals
      </Button>
      <Button variant="outlined" onClick={fetchMacros}>
        Fetch Macros
      </Button>
    </Box>
  );
};

export default ImageToggle;
