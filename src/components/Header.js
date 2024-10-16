import React from 'react';
import { Box, Typography } from '@mui/material';

/**
 * Header component that displays the application name.
 */
const Header = () => {
  return (
    <Box
      sx={{
        textAlign: 'center',
        minHeight: '10vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <Typography variant="h8" sx={{ fontSize: 'calc(15px + 2vmin)' }}>
        Shopping List Generator App
      </Typography>
    </Box>
  );
};

export default Header;
