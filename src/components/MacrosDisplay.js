import React from 'react';
import { Box, Typography } from '@mui/material';

/**
 * MacrosDisplay component that displays macronutrient information.
 */
const MacrosDisplay = ({ macros }) => {
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6">Macronutrient Information</Typography>
      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
        {macros}
      </Typography>
    </Box>
  );
};

export default MacrosDisplay;
