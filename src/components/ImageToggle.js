import React from 'react';
import { Box, Button } from '@mui/material';

/**
 * ImageToggle component that allows the user to enable or disable image fetching.
 */
const ImageToggle = ({ fetchImages, setFetchImages, updateMeals }) => {
  return (
    <Box sx={{ padding: 2, textAlign: 'center' }}>
      <Button
        variant="outlined"
        onClick={() => setFetchImages(!fetchImages)}
        sx={{ marginRight: 1 }}
      >
        {fetchImages ? 'Disable Images' : 'Enable Images'}
      </Button>
      <Button variant="outlined" onClick={updateMeals}>
        Update Meals
      </Button>
    </Box>
  );
};

export default ImageToggle;
